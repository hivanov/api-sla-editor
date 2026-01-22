import type {
  BicepStatement,
  BicepExpression,
  BicepObject,
  BicepArray,
  BicepDecorator,
  BicepStringLiteral,
  BicepIfCondition,
  BicepForExpression,
  BicepTypeExpression
} from './ast.js';

export class BicepEmitter {
  private indentLevel = 0;

  emit(statements: BicepStatement[]): string {
    return statements.map(s => this.emitStatement(s)).join('\n');
  }

  private emitStatement(s: BicepStatement): string {
    let result = '';
    if ('decorators' in s && s.decorators) {
      result += s.decorators.map(d => this.emitDecorator(d)).join('\n');
      if (s.decorators.length > 0) result += '\n';
    }

    switch (s.type) {
      case 'TargetScope':
        return `targetScope = ${this.emitExpression(s.scope)}`;
      case 'Import':
        result += `import '${s.specification}'`;
        if (s.with) result += ` with ${this.emitObject(s.with)}`;
        if (s.alias) result += ` as ${s.alias}`;
        return result;
      case 'Metadata':
        return `metadata ${s.name} = ${this.emitExpression(s.value)}`;
      case 'Parameter':
        result += `param ${s.name} `;
        if (typeof s.parameterType === 'string') {
          result += s.parameterType;
        } else {
          result += `resource '${s.parameterType.resourceType}'`;
        }
        if (s.defaultValue) {
          result += ` = ${this.emitExpression(s.defaultValue)}`;
        }
        return result;
      case 'Type':
        return `type ${s.name} = ${s.value}`;
      case 'Variable':
        return `var ${s.name} = ${this.emitExpression(s.value)}`;
      case 'Resource':
        result += `resource ${s.name} '${s.resourceType}'${s.existing ? ' existing' : ''} = `;
        result += this.emitBody(s.body);
        return result;
      case 'Module':
        result += `module ${s.name} '${s.path}' = `;
        result += this.emitBody(s.body);
        return result;
      case 'Output':
        result += `output ${s.name} `;
        if (typeof s.outputType === 'string') {
          result += s.outputType;
        } else {
          result += `resource '${s.outputType.resourceType}'`;
        }
        result += ` = ${this.emitExpression(s.value)}`;
        return result;
      default:
        return '';
    }
  }

  private emitBody(body: BicepObject | BicepIfCondition | BicepForExpression): string {
    if (body.type === 'Object') {
      return this.emitObject(body);
    } else if (body.type === 'IfCondition') {
      return this.emitIfCondition(body);
    } else {
      return this.emitExpression(body);
    }
  }

  private emitDecorator(d: BicepDecorator): string {
    const args = d.arguments ? `(${d.arguments.map(a => this.emitExpression(a)).join(', ')})` : '';
    return `@${d.name}${args}`;
  }

  private emitExpression(e: BicepExpression): string {
    switch (e.type) {
      case 'BinaryExpression':
        return `${this.emitExpression(e.left)} ${e.operator} ${this.emitExpression(e.right)}`;
      case 'UnaryExpression':
        return `${e.operator}${this.emitExpression(e.argument)}`;
      case 'TernaryExpression':
        return `${this.emitExpression(e.condition)} ? ${this.emitExpression(e.consequent)} : ${this.emitExpression(e.alternate)}`;
      case 'MemberExpression':
        if (e.isIndexer) {
          return `${this.emitExpression(e.object)}[${typeof e.property === 'string' ? e.property : this.emitExpression(e.property)}]`;
        }
        return `${this.emitExpression(e.object)}.${e.property}`;
      case 'FunctionCall':
        return `${e.name}(${e.arguments.map(a => this.emitExpression(a)).join(', ')})`;
      case 'Literal':
        if (e.value === null) return 'null';
        if (typeof e.value === 'string') return `'${e.value}'`;
        return String(e.value);
      case 'StringLiteral':
        return this.emitStringLiteral(e);
      case 'MultilineStringLiteral':
        return `'''\n${e.value}\n'''`;
      case 'Object':
        return this.emitObject(e);
      case 'Array':
        return this.emitArray(e);
      case 'Identifier':
        return e.name;
      case 'ParenthesizedExpression':
        return `(${this.emitExpression(e.expression)})`;
      case 'LambdaExpression':
        const params = e.parameters.length === 1 ? e.parameters[0] : `(${e.parameters.join(', ')})`;
        return `${params} => ${this.emitExpression(e.body)}`;
      case 'ForExpression':
        return this.emitForExpression(e);
      default:
        return '';
    }
  }

  private emitStringLiteral(s: BicepStringLiteral): string {
    if (s.segments) {
      return `'${s.segments.map(seg => typeof seg === 'string' ? this.escapeString(seg) : `\${${this.emitExpression(seg)}}`).join('')}'`;
    }
    return `'${this.escapeString(s.value)}'`;
  }

  private escapeString(s: string): string {
    return s.replace(/'/g, "''").replace(/\\/g, '\\\\');
  }

  private emitObject(obj: BicepObject): string {
    if (obj.properties.length === 0) return '{}';
    this.indentLevel++;
    const indent = '  '.repeat(this.indentLevel);
    const props = obj.properties.map(p => {
      const name = typeof p.name === 'string' ? p.name : this.emitStringLiteral(p.name);
      return `${indent}${name}: ${this.emitExpression(p.value)}`;
    }).join('\n');
    this.indentLevel--;
    const outIndent = '  '.repeat(this.indentLevel);
    return `{\n${props}\n${outIndent}}`;
  }

  private emitArray(arr: BicepArray): string {
    if (arr.items.length === 0) return '[]';
    this.indentLevel++;
    const indent = '  '.repeat(this.indentLevel);
    const items = arr.items.map(item => `${indent}${this.emitExpression(item)}`).join('\n');
    this.indentLevel--;
    const outIndent = '  '.repeat(this.indentLevel);
    return `[\n${items}\n${outIndent}]`;
  }

  private emitIfCondition(cond: BicepIfCondition): string {
    return `if (${this.emitExpression(cond.condition)}) ${this.emitObject(cond.body)}`;
  }

  private emitForExpression(expr: BicepForExpression): string {
    const varPart = expr.index ? `(${expr.item}, ${expr.index})` : expr.item;
    const bodyPart = expr.body.type === 'IfCondition' ? this.emitIfCondition(expr.body) : this.emitExpression(expr.body);
    return `[for ${varPart} in ${this.emitExpression(expr.collection)}: ${bodyPart}]`;
  }
}
