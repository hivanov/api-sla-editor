// Generated from src/utils/promql/PromQL.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener.js";

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
 * This interface defines a complete listener for a parse tree produced by
 * `PromQLParser`.
 */
export interface PromQLListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `PromQLParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.bin_modifier`.
	 * @param ctx the parse tree
	 */
	enterBin_modifier?: (ctx: Bin_modifierContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.bin_modifier`.
	 * @param ctx the parse tree
	 */
	exitBin_modifier?: (ctx: Bin_modifierContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.aggregate_expr`.
	 * @param ctx the parse tree
	 */
	enterAggregate_expr?: (ctx: Aggregate_exprContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.aggregate_expr`.
	 * @param ctx the parse tree
	 */
	exitAggregate_expr?: (ctx: Aggregate_exprContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.aggregate_modifier`.
	 * @param ctx the parse tree
	 */
	enterAggregate_modifier?: (ctx: Aggregate_modifierContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.aggregate_modifier`.
	 * @param ctx the parse tree
	 */
	exitAggregate_modifier?: (ctx: Aggregate_modifierContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.label_list`.
	 * @param ctx the parse tree
	 */
	enterLabel_list?: (ctx: Label_listContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.label_list`.
	 * @param ctx the parse tree
	 */
	exitLabel_list?: (ctx: Label_listContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.function_call`.
	 * @param ctx the parse tree
	 */
	enterFunction_call?: (ctx: Function_callContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.function_call`.
	 * @param ctx the parse tree
	 */
	exitFunction_call?: (ctx: Function_callContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.arg_list`.
	 * @param ctx the parse tree
	 */
	enterArg_list?: (ctx: Arg_listContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.arg_list`.
	 * @param ctx the parse tree
	 */
	exitArg_list?: (ctx: Arg_listContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.paren_expr`.
	 * @param ctx the parse tree
	 */
	enterParen_expr?: (ctx: Paren_exprContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.paren_expr`.
	 * @param ctx the parse tree
	 */
	exitParen_expr?: (ctx: Paren_exprContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.vector_selector`.
	 * @param ctx the parse tree
	 */
	enterVector_selector?: (ctx: Vector_selectorContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.vector_selector`.
	 * @param ctx the parse tree
	 */
	exitVector_selector?: (ctx: Vector_selectorContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.label_matchers`.
	 * @param ctx the parse tree
	 */
	enterLabel_matchers?: (ctx: Label_matchersContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.label_matchers`.
	 * @param ctx the parse tree
	 */
	exitLabel_matchers?: (ctx: Label_matchersContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.label_match_list`.
	 * @param ctx the parse tree
	 */
	enterLabel_match_list?: (ctx: Label_match_listContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.label_match_list`.
	 * @param ctx the parse tree
	 */
	exitLabel_match_list?: (ctx: Label_match_listContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.label_matcher`.
	 * @param ctx the parse tree
	 */
	enterLabel_matcher?: (ctx: Label_matcherContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.label_matcher`.
	 * @param ctx the parse tree
	 */
	exitLabel_matcher?: (ctx: Label_matcherContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.number_literal`.
	 * @param ctx the parse tree
	 */
	enterNumber_literal?: (ctx: Number_literalContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.number_literal`.
	 * @param ctx the parse tree
	 */
	exitNumber_literal?: (ctx: Number_literalContext) => void;

	/**
	 * Enter a parse tree produced by `PromQLParser.string_literal`.
	 * @param ctx the parse tree
	 */
	enterString_literal?: (ctx: String_literalContext) => void;
	/**
	 * Exit a parse tree produced by `PromQLParser.string_literal`.
	 * @param ctx the parse tree
	 */
	exitString_literal?: (ctx: String_literalContext) => void;
}

