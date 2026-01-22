import type {
  TerraformNode,
  TerraformFile,
  TerraformResource,
  TerraformData,
  TerraformProvider,
  TerraformVariable,
  TerraformOutput,
  TerraformLocals,
  TerraformBlock,
  TerraformArgument,
  TerraformExpression,
  TerraformIdentifier,
  TerraformLiteral,
  TerraformList,
  TerraformMap,
  TerraformFunctionCall
} from './ast.js';

export class TerraformEmitter {
  private indentLevel: number = 0;

  emit(node: TerraformNode): string {
    switch (node.type) {
      case 'File':
        return (node as TerraformFile).blocks.map(b => this.emit(b)).join('\n\n');
      case 'Resource':
        return this.emitResource(node as TerraformResource);
      case 'Data':
        return this.emitData(node as TerraformData);
      case 'Provider':
        return this.emitProvider(node as TerraformProvider);
      case 'Variable':
        return this.emitVariable(node as TerraformVariable);
      case 'Output':
        return this.emitOutput(node as TerraformOutput);
      case 'Locals':
        return this.emitLocals(node as TerraformLocals);
      case 'Block':
        return this.emitBlock(node as TerraformBlock);
      case 'Argument':
        return this.emitArgument(node as TerraformArgument);
      case 'Identifier':
        return (node as TerraformIdentifier).name;
      case 'Literal':
        return this.emitLiteral(node as TerraformLiteral);
      case 'List':
        return this.emitList(node as TerraformList);
      case 'Map':
        return this.emitMap(node as TerraformMap);
      case 'FunctionCall':
        return this.emitFunctionCall(node as TerraformFunctionCall);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private indent(): string {
    return '  '.repeat(this.indentLevel);
  }

  private emitResource(node: TerraformResource): string {
    const header = `resource "${node.resourceType}" "${node.name}" {`;
    return this.emitContainer(header, node.body);
  }

  private emitData(node: TerraformData): string {
    const header = `data "${node.resourceType}" "${node.name}" {`;
    return this.emitContainer(header, node.body);
  }

  private emitProvider(node: TerraformProvider): string {
    const header = `provider "${node.name}" {`;
    return this.emitContainer(header, node.body);
  }

  private emitVariable(node: TerraformVariable): string {
    const header = `variable "${node.name}" {`;
    return this.emitContainer(header, node.body);
  }

  private emitOutput(node: TerraformOutput): string {
    const header = `output "${node.name}" {`;
    return this.emitContainer(header, node.body);
  }

  private emitLocals(node: TerraformLocals): string {
    const header = `locals {`;
    return this.emitContainer(header, node.body);
  }

  private emitBlock(node: TerraformBlock): string {
    const labels = node.labels.map(l => ` "${l}"`).join('');
    const header = `${this.indent()}${node.blockType}${labels} {`;
    this.indentLevel++;
    const body = node.body.map(item => this.emit(item)).join('\n');
    this.indentLevel--;
    return `${header}\n${body}\n${this.indent()}}`;
  }

  private emitArgument(node: TerraformArgument): string {
    return `${this.indent()}${node.identifier} = ${this.emitExpression(node.expression)}`;
  }

  private emitContainer(header: string, bodyNodes: TerraformNode[]): string {
    this.indentLevel++;
    const body = bodyNodes.map(item => this.emit(item)).join('\n');
    this.indentLevel--;
    return `${header}\n${body}\n}`;
  }

  private emitExpression(expr: TerraformExpression): string {
    return this.emit(expr);
  }

  private emitLiteral(node: TerraformLiteral): string {
    if (typeof node.value === 'string') {
      if (node.value.includes('\n')) {
        return `<<-EOF\n${node.value}\nEOF`;
      }
      return `"${node.value.replace(/"/g, '\\"')}"`;
    }
    if (node.value === null) return 'null';
    return String(node.value);
  }

  private emitList(node: TerraformList): string {
    const elements = node.elements.map(e => this.emitExpression(e)).join(', ');
    return `[${elements}]`;
  }

  private emitMap(node: TerraformMap): string {
    if (node.entries.length === 0) return '{}';
    this.indentLevel++;
    const entries = node.entries.map(e => this.emitArgument(e)).join('\n');
    this.indentLevel--;
    return `{\n${entries}\n${this.indent()}}`;
  }

  private emitFunctionCall(node: TerraformFunctionCall): string {
    const args = node.args.map(a => this.emitExpression(a)).join(', ');
    return `${node.name}(${args})`;
  }
}

export function emitTerraform(node: TerraformNode): string {
  return new TerraformEmitter().emit(node);
}
