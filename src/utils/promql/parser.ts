import { ANTLRInputStream, CommonTokenStream, ANTLRErrorListener, Recognizer, RecognitionException } from 'antlr4ts/index.js';
import { PromQLLexer } from './PromQLLexer.js';
import { PromQLParser, ExprContext, Vector_selectorContext, Label_matchersContext, Label_matcherContext, Aggregate_exprContext, Function_callContext, Binary_modifierContext, Aggregate_modifierContext, Label_listContext, Arg_listContext, Paren_exprContext, Number_literalContext, String_literalContext } from './PromQLParser.js';
import { PromQLVisitor } from './PromQLVisitor.js';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor.js';
import * as AST from './ast.js';

class ThrowingErrorListener implements ANTLRErrorListener<any> {
  syntaxError(
    recognizer: Recognizer<any, any>,
    offendingSymbol: any,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | undefined
  ): void {
    throw new Error(`Line ${line}:${charPositionInLine} ${msg}`);
  }
}

class PromQLVisitorImpl extends AbstractParseTreeVisitor<AST.Expr | AST.LabelMatcher | string[] | AST.VectorMatching | any> implements PromQLVisitor<AST.Expr | AST.LabelMatcher | string[] | AST.VectorMatching | any> {
    
    protected defaultResult() {
        return null;
    }

    visitExpression(ctx: any): AST.Expr {
        return this.visit(ctx.expr());
    }

    visitExpr(ctx: any): AST.Expr {
        if (ctx.paren_expr()) return this.visit(ctx.paren_expr());
        if (ctx.number_literal()) return this.visit(ctx.number_literal());
        if (ctx.string_literal()) return this.visit(ctx.string_literal());
        if (ctx.aggregate_expr()) return this.visit(ctx.aggregate_expr());
        if (ctx.function_call()) return this.visit(ctx.function_call());
        if (ctx.vector_selector()) return this.visit(ctx.vector_selector());

        const exprs = ctx.expr();

        // Lenient Matrix Selector: '[' DURATION ']'
        if (ctx.getChild(0).text === '[' && ctx.DURATION().length === 1) {
            return {
                type: 'MatrixSelector',
                vectorSelector: { type: 'VectorSelector', name: undefined, labelMatchers: [] },
                range: ctx.DURATION(0).text
            } as AST.MatrixSelector;
        }

        // Binary Operators
        if (exprs.length === 2) {
            const left = this.visit(exprs[0]) as AST.Expr;
            const right = this.visit(exprs[1]) as AST.Expr;
            const op = ctx.getChild(1).text;
            
            // Handle binary matching
            const bin_mod = ctx.bin_modifier();
            const returnBool = ctx.BOOL() != null;

            return {
                type: 'BinaryExpr',
                op,
                left,
                right,
                returnBool,
                vectorMatching: bin_mod ? this.visit(bin_mod) : undefined
            } as AST.BinaryExpr;
        }

        // Unary
        if (exprs.length === 1 && (ctx.ADD() || ctx.SUB())) {
            return {
                type: 'UnaryExpr',
                op: ctx.getChild(0).text,
                expr: this.visit(exprs[0])
            } as AST.UnaryExpr;
        }

        // Postfix modifiers
        if (exprs.length === 1) {
            const e = this.visit(exprs[0]) as AST.Expr;
            if (ctx.OFFSET()) {
                const offVal = ctx.getChild(2).text;
                return {
                    type: 'OffsetExpr',
                    expr: e,
                    offset: offVal
                } as AST.OffsetExpr;
            }
            if (ctx.AT()) {
                const atVal = ctx.getChild(2).text;
                if (atVal === 'start()') return { type: 'StepInvariantExpr', expr: e, variant: 'start' } as AST.StepInvariantExpr;
                if (atVal === 'end()') return { type: 'StepInvariantExpr', expr: e, variant: 'end' } as AST.StepInvariantExpr;
                return { type: 'StepInvariantExpr', expr: e, timestamp: parseFloat(atVal) } as AST.StepInvariantExpr;
            }
            if (ctx.getChild(1).text === '[') {
                const durations = ctx.DURATION();
                const range = durations[0].text;
                if (durations.length === 2 || ctx.getChild(3).text === ':') {
                    const res = durations.length > 1 ? durations[1].text : undefined;
                    return { type: 'SubqueryExpr', expr: e, range, resolution: res } as AST.SubqueryExpr;
                }
                if (e.type === 'VectorSelector') {
                    return { type: 'MatrixSelector', vectorSelector: e as AST.VectorSelector, range } as AST.MatrixSelector;
                }
                return { type: 'SubqueryExpr', expr: e, range } as AST.SubqueryExpr;
            }
        }
        
        return null as any;
    }

    visitBin_modifier(ctx: Binary_modifierContext): AST.VectorMatching {
        const labels = ctx.label_list();
        const group = ctx.GROUP_LEFT() || ctx.GROUP_RIGHT();
        return {
            cardinality: group == null ? 'one-to-one' : (group.text === 'group_left' ? 'many-to-one' : 'one-to-many'),
            matchingLabels: this.visit(labels[0]) as string[],
            on: ctx.ON() != null,
            include: labels.length > 1 ? this.visit(labels[1]) as string[] : []
        };
    }

    visitAggregate_expr(ctx: Aggregate_exprContext): AST.AggregateExpr {
        const op = ctx.AGGREGATE_OP().text;
        const arg_list = ctx.arg_list();
        const modifier = ctx.aggregate_modifier();
        
        let expr: AST.Expr;
        let param: AST.Expr | undefined = undefined;
        
        const args = arg_list ? this.visit(arg_list) as AST.Expr[] : [];
        
        if (args.length === 2) {
            param = args[0];
            expr = args[1];
        } else {
            expr = args[0] || { type: 'VectorSelector', name: undefined, labelMatchers: [] };
        }

        const modData = modifier ? this.visit(modifier) as any : { without: false, grouping: [] };

        return {
            type: 'AggregateExpr',
            op,
            expr,
            param,
            without: modData.without,
            grouping: modData.grouping
        };
    }

    visitAggregate_modifier(ctx: Aggregate_modifierContext) {
        return {
            without: ctx.WITHOUT() != null,
            grouping: this.visit(ctx.label_list())
        };
    }

    visitLabel_list(ctx: Label_listContext): string[] {
        return ctx.IDENTIFIER().map(id => id.text);
    }

    visitFunction_call(ctx: Function_callContext): AST.Call {
        return {
            type: 'Call',
            func: ctx.IDENTIFIER().text,
            args: ctx.arg_list() ? this.visit(ctx.arg_list()!) as any : []
        };
    }

    visitArg_list(ctx: Arg_listContext): AST.Expr[] {
        return ctx.expr().map(e => this.visit(e) as AST.Expr);
    }

    visitParen_expr(ctx: Paren_exprContext): AST.ParenExpr {
        return {
            type: 'ParenExpr',
            expr: this.visit(ctx.expr()) as AST.Expr
        };
    }

    visitVector_selector(ctx: Vector_selectorContext): AST.VectorSelector {
        const id = ctx.IDENTIFIER();
        const matchers = ctx.label_matchers();
        return {
            type: 'VectorSelector',
            name: id ? id.text : undefined,
            labelMatchers: matchers ? this.visit(matchers) as any : []
        };
    }

    visitLabel_matchers(ctx: Label_matchersContext): AST.LabelMatcher[] {
        return ctx.label_match_list() ? this.visit(ctx.label_match_list()!) as any : [];
    }

    visitLabel_match_list(ctx: any): AST.LabelMatcher[] {
        return ctx.label_matcher().map((m: any) => this.visit(m));
    }

    visitLabel_matcher(ctx: Label_matcherContext): AST.LabelMatcher {
        const val = ctx.STRING().text;
        return {
            name: ctx.IDENTIFIER().text,
            type: ctx.getChild(1).text as any,
            value: val.substring(1, val.length - 1)
        };
    }

    visitNumber_literal(ctx: Number_literalContext): AST.NumberLiteral {
        return {
            type: 'NumberLiteral',
            value: parseFloat(ctx.NUMBER().text)
        };
    }

    visitString_literal(ctx: String_literalContext): AST.StringLiteral {
        const val = ctx.STRING().text;
        return {
            type: 'StringLiteral',
            value: val.substring(1, val.length - 1)
        };
    }
}

export function parsePromQL(input: string): AST.Expr {
    const chars = new ANTLRInputStream(input);
    const lexer = new PromQLLexer(chars);
    lexer.removeErrorListeners();
    lexer.addErrorListener(new ThrowingErrorListener());

    const tokens = new CommonTokenStream(lexer);
    const parser = new PromQLParser(tokens);
    parser.removeErrorListeners();
    parser.addErrorListener(new ThrowingErrorListener());
    
    const tree = parser.expression();
    const visitor = new PromQLVisitorImpl();
    return visitor.visit(tree) as AST.Expr;
}
