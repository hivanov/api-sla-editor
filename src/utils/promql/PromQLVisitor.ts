// Generated from src/utils/promql/PromQL.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor.js";

import { ExpressionContext } from "./PromQLParser.js";
import { ExprContext } from "./PromQLParser.js";
import { Bin_modifierContext } from "./PromQLParser.js";
import { Aggregate_exprContext } from "./PromQLParser.js";
import { Aggregate_modifierContext } from "./PromQLParser.js";
import { Label_listContext } from "./PromQLParser.js";
import { Function_callContext } from "./PromQLParser.js";
import { Arg_listContext } from "./PromQLParser.js";
import { Paren_exprContext } from "./PromQLParser.js";
import { Vector_selectorContext } from "./PromQLParser.js";
import { Label_matchersContext } from "./PromQLParser.js";
import { Label_match_listContext } from "./PromQLParser.js";
import { Label_matcherContext } from "./PromQLParser.js";
import { Number_literalContext } from "./PromQLParser.js";
import { String_literalContext } from "./PromQLParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `PromQLParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface PromQLVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `PromQLParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr?: (ctx: ExprContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.bin_modifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBin_modifier?: (ctx: Bin_modifierContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.aggregate_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAggregate_expr?: (ctx: Aggregate_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.aggregate_modifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAggregate_modifier?: (ctx: Aggregate_modifierContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.label_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLabel_list?: (ctx: Label_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.function_call`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunction_call?: (ctx: Function_callContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.arg_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArg_list?: (ctx: Arg_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.paren_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParen_expr?: (ctx: Paren_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.vector_selector`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVector_selector?: (ctx: Vector_selectorContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.label_matchers`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLabel_matchers?: (ctx: Label_matchersContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.label_match_list`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLabel_match_list?: (ctx: Label_match_listContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.label_matcher`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLabel_matcher?: (ctx: Label_matcherContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.number_literal`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumber_literal?: (ctx: Number_literalContext) => Result;

	/**
	 * Visit a parse tree produced by `PromQLParser.string_literal`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitString_literal?: (ctx: String_literalContext) => Result;
}

