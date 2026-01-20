// Generated from src/utils/promql/PromQL.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN.js";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer.js";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException.js";
import { NotNull } from "antlr4ts/Decorators.js";
import { NoViableAltException } from "antlr4ts/NoViableAltException.js";
import { Override } from "antlr4ts/Decorators.js";
import { Parser } from "antlr4ts/Parser.js";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext.js";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator.js";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener.js";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor.js";
import { RecognitionException } from "antlr4ts/RecognitionException.js";
import { RuleContext } from "antlr4ts/RuleContext.js";
//import { RuleVersion } from "antlr4ts/RuleVersion.js";
import { TerminalNode } from "antlr4ts/tree/TerminalNode.js";
import { Token } from "antlr4ts/Token.js";
import { TokenStream } from "antlr4ts/TokenStream.js";
import { Vocabulary } from "antlr4ts/Vocabulary.js";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl.js";

import * as Utils from "antlr4ts/misc/Utils.js";

import { PromQLListener } from "./PromQLListener.js";
import { PromQLVisitor } from "./PromQLVisitor.js";


export class PromQLParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly AGGREGATE_OP = 9;
	public static readonly BY = 10;
	public static readonly WITHOUT = 11;
	public static readonly ON = 12;
	public static readonly IGNORING = 13;
	public static readonly GROUP_LEFT = 14;
	public static readonly GROUP_RIGHT = 15;
	public static readonly OFFSET = 16;
	public static readonly BOOL = 17;
	public static readonly LAND = 18;
	public static readonly LOR = 19;
	public static readonly LUNLESS = 20;
	public static readonly AT = 21;
	public static readonly START = 22;
	public static readonly END = 23;
	public static readonly EQL = 24;
	public static readonly NEQ = 25;
	public static readonly EQL_REGEX = 26;
	public static readonly NEQ_REGEX = 27;
	public static readonly ASSIGN = 28;
	public static readonly GTE = 29;
	public static readonly LTE = 30;
	public static readonly GTR = 31;
	public static readonly LSS = 32;
	public static readonly ADD = 33;
	public static readonly SUB = 34;
	public static readonly MUL = 35;
	public static readonly DIV = 36;
	public static readonly MOD = 37;
	public static readonly POW = 38;
	public static readonly IDENTIFIER = 39;
	public static readonly NUMBER = 40;
	public static readonly DURATION = 41;
	public static readonly STRING = 42;
	public static readonly WS = 43;
	public static readonly RULE_expression = 0;
	public static readonly RULE_expr = 1;
	public static readonly RULE_bin_modifier = 2;
	public static readonly RULE_aggregate_expr = 3;
	public static readonly RULE_aggregate_modifier = 4;
	public static readonly RULE_label_list = 5;
	public static readonly RULE_function_call = 6;
	public static readonly RULE_arg_list = 7;
	public static readonly RULE_paren_expr = 8;
	public static readonly RULE_vector_selector = 9;
	public static readonly RULE_label_matchers = 10;
	public static readonly RULE_label_match_list = 11;
	public static readonly RULE_label_matcher = 12;
	public static readonly RULE_number_literal = 13;
	public static readonly RULE_string_literal = 14;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"expression", "expr", "bin_modifier", "aggregate_expr", "aggregate_modifier", 
		"label_list", "function_call", "arg_list", "paren_expr", "vector_selector", 
		"label_matchers", "label_match_list", "label_matcher", "number_literal", 
		"string_literal",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'['", "']'", "':'", "'('", "')'", "','", "'{'", "'}'", undefined, 
		"'by'", "'without'", "'on'", "'ignoring'", "'group_left'", "'group_right'", 
		"'offset'", "'bool'", "'and'", "'or'", "'unless'", "'@'", "'start()'", 
		"'end()'", "'=='", "'!='", "'=~'", "'!~'", "'='", "'>='", "'<='", "'>'", 
		"'<'", "'+'", "'-'", "'*'", "'/'", "'%'", "'^'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, "AGGREGATE_OP", "BY", "WITHOUT", "ON", "IGNORING", 
		"GROUP_LEFT", "GROUP_RIGHT", "OFFSET", "BOOL", "LAND", "LOR", "LUNLESS", 
		"AT", "START", "END", "EQL", "NEQ", "EQL_REGEX", "NEQ_REGEX", "ASSIGN", 
		"GTE", "LTE", "GTR", "LSS", "ADD", "SUB", "MUL", "DIV", "MOD", "POW", 
		"IDENTIFIER", "NUMBER", "DURATION", "STRING", "WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(PromQLParser._LITERAL_NAMES, PromQLParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return PromQLParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "PromQL.g4"; }

	// @Override
	public get ruleNames(): string[] { return PromQLParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return PromQLParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(PromQLParser._ATN, this);
	}
	// @RuleVersion(0)
	public expression(): ExpressionContext {
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, PromQLParser.RULE_expression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 30;
			this.expr(0);
			this.state = 31;
			this.match(PromQLParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expr(): ExprContext;
	public expr(_p: number): ExprContext;
	// @RuleVersion(0)
	public expr(_p?: number): ExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExprContext = new ExprContext(this._ctx, _parentState);
		let _prevctx: ExprContext = _localctx;
		let _startState: number = 2;
		this.enterRecursionRule(_localctx, 2, PromQLParser.RULE_expr, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 45;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 0, this._ctx) ) {
			case 1:
				{
				this.state = 34;
				this.paren_expr();
				}
				break;

			case 2:
				{
				this.state = 35;
				this.number_literal();
				}
				break;

			case 3:
				{
				this.state = 36;
				this.string_literal();
				}
				break;

			case 4:
				{
				this.state = 37;
				this.aggregate_expr();
				}
				break;

			case 5:
				{
				this.state = 38;
				this.function_call();
				}
				break;

			case 6:
				{
				this.state = 39;
				this.vector_selector();
				}
				break;

			case 7:
				{
				this.state = 40;
				this.match(PromQLParser.T__0);
				this.state = 41;
				this.match(PromQLParser.DURATION);
				this.state = 42;
				this.match(PromQLParser.T__1);
				}
				break;

			case 8:
				{
				this.state = 43;
				_la = this._input.LA(1);
				if (!(_la === PromQLParser.ADD || _la === PromQLParser.SUB)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 44;
				this.expr(7);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 124;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 15, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 122;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 14, this._ctx) ) {
					case 1:
						{
						_localctx = new ExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, PromQLParser.RULE_expr);
						this.state = 47;
						if (!(this.precpred(this._ctx, 6))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
						}
						this.state = 48;
						this.match(PromQLParser.POW);
						this.state = 50;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.BOOL) {
							{
							this.state = 49;
							this.match(PromQLParser.BOOL);
							}
						}

						this.state = 53;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.ON || _la === PromQLParser.IGNORING) {
							{
							this.state = 52;
							this.bin_modifier();
							}
						}

						this.state = 55;
						this.expr(6);
						}
						break;

					case 2:
						{
						_localctx = new ExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, PromQLParser.RULE_expr);
						this.state = 56;
						if (!(this.precpred(this._ctx, 5))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
						}
						this.state = 57;
						_la = this._input.LA(1);
						if (!(((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & ((1 << (PromQLParser.MUL - 35)) | (1 << (PromQLParser.DIV - 35)) | (1 << (PromQLParser.MOD - 35)))) !== 0))) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 59;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.BOOL) {
							{
							this.state = 58;
							this.match(PromQLParser.BOOL);
							}
						}

						this.state = 62;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.ON || _la === PromQLParser.IGNORING) {
							{
							this.state = 61;
							this.bin_modifier();
							}
						}

						this.state = 64;
						this.expr(6);
						}
						break;

					case 3:
						{
						_localctx = new ExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, PromQLParser.RULE_expr);
						this.state = 65;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 66;
						_la = this._input.LA(1);
						if (!(_la === PromQLParser.ADD || _la === PromQLParser.SUB)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 68;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.BOOL) {
							{
							this.state = 67;
							this.match(PromQLParser.BOOL);
							}
						}

						this.state = 71;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.ON || _la === PromQLParser.IGNORING) {
							{
							this.state = 70;
							this.bin_modifier();
							}
						}

						this.state = 73;
						this.expr(5);
						}
						break;

					case 4:
						{
						_localctx = new ExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, PromQLParser.RULE_expr);
						this.state = 74;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 75;
						_la = this._input.LA(1);
						if (!(((((_la - 24)) & ~0x1F) === 0 && ((1 << (_la - 24)) & ((1 << (PromQLParser.EQL - 24)) | (1 << (PromQLParser.NEQ - 24)) | (1 << (PromQLParser.GTE - 24)) | (1 << (PromQLParser.LTE - 24)) | (1 << (PromQLParser.GTR - 24)) | (1 << (PromQLParser.LSS - 24)))) !== 0))) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 77;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.BOOL) {
							{
							this.state = 76;
							this.match(PromQLParser.BOOL);
							}
						}

						this.state = 80;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.ON || _la === PromQLParser.IGNORING) {
							{
							this.state = 79;
							this.bin_modifier();
							}
						}

						this.state = 82;
						this.expr(4);
						}
						break;

					case 5:
						{
						_localctx = new ExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, PromQLParser.RULE_expr);
						this.state = 83;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 84;
						_la = this._input.LA(1);
						if (!(_la === PromQLParser.LAND || _la === PromQLParser.LUNLESS)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 86;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.BOOL) {
							{
							this.state = 85;
							this.match(PromQLParser.BOOL);
							}
						}

						this.state = 89;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.ON || _la === PromQLParser.IGNORING) {
							{
							this.state = 88;
							this.bin_modifier();
							}
						}

						this.state = 91;
						this.expr(3);
						}
						break;

					case 6:
						{
						_localctx = new ExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, PromQLParser.RULE_expr);
						this.state = 92;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 93;
						this.match(PromQLParser.LOR);
						this.state = 95;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.BOOL) {
							{
							this.state = 94;
							this.match(PromQLParser.BOOL);
							}
						}

						this.state = 98;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.ON || _la === PromQLParser.IGNORING) {
							{
							this.state = 97;
							this.bin_modifier();
							}
						}

						this.state = 100;
						this.expr(2);
						}
						break;

					case 7:
						{
						_localctx = new ExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, PromQLParser.RULE_expr);
						this.state = 101;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 102;
						this.match(PromQLParser.T__0);
						this.state = 103;
						this.match(PromQLParser.DURATION);
						this.state = 104;
						this.match(PromQLParser.T__1);
						}
						break;

					case 8:
						{
						_localctx = new ExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, PromQLParser.RULE_expr);
						this.state = 105;
						if (!(this.precpred(this._ctx, 11))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 11)");
						}
						this.state = 106;
						this.match(PromQLParser.T__0);
						this.state = 107;
						this.match(PromQLParser.DURATION);
						this.state = 108;
						this.match(PromQLParser.T__2);
						this.state = 110;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						if (_la === PromQLParser.DURATION) {
							{
							this.state = 109;
							this.match(PromQLParser.DURATION);
							}
						}

						this.state = 112;
						this.match(PromQLParser.T__1);
						}
						break;

					case 9:
						{
						_localctx = new ExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, PromQLParser.RULE_expr);
						this.state = 113;
						if (!(this.precpred(this._ctx, 10))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
						}
						this.state = 114;
						this.match(PromQLParser.OFFSET);
						this.state = 115;
						_la = this._input.LA(1);
						if (!(_la === PromQLParser.NUMBER || _la === PromQLParser.DURATION)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						}
						break;

					case 10:
						{
						_localctx = new ExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, PromQLParser.RULE_expr);
						this.state = 116;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 117;
						this.match(PromQLParser.AT);
						this.state = 118;
						this.match(PromQLParser.NUMBER);
						}
						break;

					case 11:
						{
						_localctx = new ExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, PromQLParser.RULE_expr);
						this.state = 119;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 120;
						this.match(PromQLParser.AT);
						this.state = 121;
						_la = this._input.LA(1);
						if (!(_la === PromQLParser.START || _la === PromQLParser.END)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						}
						break;
					}
					}
				}
				this.state = 126;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 15, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public bin_modifier(): Bin_modifierContext {
		let _localctx: Bin_modifierContext = new Bin_modifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, PromQLParser.RULE_bin_modifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 127;
			_la = this._input.LA(1);
			if (!(_la === PromQLParser.ON || _la === PromQLParser.IGNORING)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 128;
			this.match(PromQLParser.T__3);
			this.state = 129;
			this.label_list();
			this.state = 130;
			this.match(PromQLParser.T__4);
			this.state = 132;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PromQLParser.GROUP_LEFT || _la === PromQLParser.GROUP_RIGHT) {
				{
				this.state = 131;
				_la = this._input.LA(1);
				if (!(_la === PromQLParser.GROUP_LEFT || _la === PromQLParser.GROUP_RIGHT)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				}
			}

			this.state = 138;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 17, this._ctx) ) {
			case 1:
				{
				this.state = 134;
				this.match(PromQLParser.T__3);
				this.state = 135;
				this.label_list();
				this.state = 136;
				this.match(PromQLParser.T__4);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public aggregate_expr(): Aggregate_exprContext {
		let _localctx: Aggregate_exprContext = new Aggregate_exprContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, PromQLParser.RULE_aggregate_expr);
		let _la: number;
		try {
			this.state = 158;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 22, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 140;
				this.match(PromQLParser.AGGREGATE_OP);
				this.state = 142;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === PromQLParser.BY || _la === PromQLParser.WITHOUT) {
					{
					this.state = 141;
					this.aggregate_modifier();
					}
				}

				this.state = 144;
				this.match(PromQLParser.T__3);
				this.state = 146;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << PromQLParser.T__0) | (1 << PromQLParser.T__3) | (1 << PromQLParser.T__6) | (1 << PromQLParser.AGGREGATE_OP))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (PromQLParser.ADD - 33)) | (1 << (PromQLParser.SUB - 33)) | (1 << (PromQLParser.IDENTIFIER - 33)) | (1 << (PromQLParser.NUMBER - 33)) | (1 << (PromQLParser.STRING - 33)))) !== 0)) {
					{
					this.state = 145;
					this.arg_list();
					}
				}

				this.state = 148;
				this.match(PromQLParser.T__4);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 149;
				this.match(PromQLParser.AGGREGATE_OP);
				this.state = 150;
				this.match(PromQLParser.T__3);
				this.state = 152;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << PromQLParser.T__0) | (1 << PromQLParser.T__3) | (1 << PromQLParser.T__6) | (1 << PromQLParser.AGGREGATE_OP))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (PromQLParser.ADD - 33)) | (1 << (PromQLParser.SUB - 33)) | (1 << (PromQLParser.IDENTIFIER - 33)) | (1 << (PromQLParser.NUMBER - 33)) | (1 << (PromQLParser.STRING - 33)))) !== 0)) {
					{
					this.state = 151;
					this.arg_list();
					}
				}

				this.state = 154;
				this.match(PromQLParser.T__4);
				this.state = 156;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 21, this._ctx) ) {
				case 1:
					{
					this.state = 155;
					this.aggregate_modifier();
					}
					break;
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public aggregate_modifier(): Aggregate_modifierContext {
		let _localctx: Aggregate_modifierContext = new Aggregate_modifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, PromQLParser.RULE_aggregate_modifier);
		try {
			this.state = 170;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PromQLParser.BY:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 160;
				this.match(PromQLParser.BY);
				this.state = 161;
				this.match(PromQLParser.T__3);
				this.state = 162;
				this.label_list();
				this.state = 163;
				this.match(PromQLParser.T__4);
				}
				break;
			case PromQLParser.WITHOUT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 165;
				this.match(PromQLParser.WITHOUT);
				this.state = 166;
				this.match(PromQLParser.T__3);
				this.state = 167;
				this.label_list();
				this.state = 168;
				this.match(PromQLParser.T__4);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public label_list(): Label_listContext {
		let _localctx: Label_listContext = new Label_listContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, PromQLParser.RULE_label_list);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 172;
			this.match(PromQLParser.IDENTIFIER);
			this.state = 177;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PromQLParser.T__5) {
				{
				{
				this.state = 173;
				this.match(PromQLParser.T__5);
				this.state = 174;
				this.match(PromQLParser.IDENTIFIER);
				}
				}
				this.state = 179;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public function_call(): Function_callContext {
		let _localctx: Function_callContext = new Function_callContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, PromQLParser.RULE_function_call);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 180;
			this.match(PromQLParser.IDENTIFIER);
			this.state = 181;
			this.match(PromQLParser.T__3);
			this.state = 183;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << PromQLParser.T__0) | (1 << PromQLParser.T__3) | (1 << PromQLParser.T__6) | (1 << PromQLParser.AGGREGATE_OP))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (PromQLParser.ADD - 33)) | (1 << (PromQLParser.SUB - 33)) | (1 << (PromQLParser.IDENTIFIER - 33)) | (1 << (PromQLParser.NUMBER - 33)) | (1 << (PromQLParser.STRING - 33)))) !== 0)) {
				{
				this.state = 182;
				this.arg_list();
				}
			}

			this.state = 185;
			this.match(PromQLParser.T__4);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public arg_list(): Arg_listContext {
		let _localctx: Arg_listContext = new Arg_listContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, PromQLParser.RULE_arg_list);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 187;
			this.expr(0);
			this.state = 192;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PromQLParser.T__5) {
				{
				{
				this.state = 188;
				this.match(PromQLParser.T__5);
				this.state = 189;
				this.expr(0);
				}
				}
				this.state = 194;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public paren_expr(): Paren_exprContext {
		let _localctx: Paren_exprContext = new Paren_exprContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, PromQLParser.RULE_paren_expr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 195;
			this.match(PromQLParser.T__3);
			this.state = 196;
			this.expr(0);
			this.state = 197;
			this.match(PromQLParser.T__4);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public vector_selector(): Vector_selectorContext {
		let _localctx: Vector_selectorContext = new Vector_selectorContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, PromQLParser.RULE_vector_selector);
		try {
			this.state = 204;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PromQLParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 199;
				this.match(PromQLParser.IDENTIFIER);
				this.state = 201;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 27, this._ctx) ) {
				case 1:
					{
					this.state = 200;
					this.label_matchers();
					}
					break;
				}
				}
				break;
			case PromQLParser.T__6:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 203;
				this.label_matchers();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public label_matchers(): Label_matchersContext {
		let _localctx: Label_matchersContext = new Label_matchersContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, PromQLParser.RULE_label_matchers);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 206;
			this.match(PromQLParser.T__6);
			this.state = 208;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PromQLParser.IDENTIFIER) {
				{
				this.state = 207;
				this.label_match_list();
				}
			}

			this.state = 210;
			this.match(PromQLParser.T__7);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public label_match_list(): Label_match_listContext {
		let _localctx: Label_match_listContext = new Label_match_listContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, PromQLParser.RULE_label_match_list);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 212;
			this.label_matcher();
			this.state = 217;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PromQLParser.T__5) {
				{
				{
				this.state = 213;
				this.match(PromQLParser.T__5);
				this.state = 214;
				this.label_matcher();
				}
				}
				this.state = 219;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public label_matcher(): Label_matcherContext {
		let _localctx: Label_matcherContext = new Label_matcherContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, PromQLParser.RULE_label_matcher);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 220;
			this.match(PromQLParser.IDENTIFIER);
			this.state = 221;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << PromQLParser.NEQ) | (1 << PromQLParser.EQL_REGEX) | (1 << PromQLParser.NEQ_REGEX) | (1 << PromQLParser.ASSIGN))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 222;
			this.match(PromQLParser.STRING);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public number_literal(): Number_literalContext {
		let _localctx: Number_literalContext = new Number_literalContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, PromQLParser.RULE_number_literal);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 224;
			this.match(PromQLParser.NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public string_literal(): String_literalContext {
		let _localctx: String_literalContext = new String_literalContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, PromQLParser.RULE_string_literal);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 226;
			this.match(PromQLParser.STRING);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 1:
			return this.expr_sempred(_localctx as ExprContext, predIndex);
		}
		return true;
	}
	private expr_sempred(_localctx: ExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 6);

		case 1:
			return this.precpred(this._ctx, 5);

		case 2:
			return this.precpred(this._ctx, 4);

		case 3:
			return this.precpred(this._ctx, 3);

		case 4:
			return this.precpred(this._ctx, 2);

		case 5:
			return this.precpred(this._ctx, 1);

		case 6:
			return this.precpred(this._ctx, 12);

		case 7:
			return this.precpred(this._ctx, 11);

		case 8:
			return this.precpred(this._ctx, 10);

		case 9:
			return this.precpred(this._ctx, 9);

		case 10:
			return this.precpred(this._ctx, 8);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03-\xE7\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x03\x02\x03\x02\x03\x02\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x05\x030\n\x03\x03\x03\x03\x03\x03\x03\x05\x035\n\x03" +
		"\x03\x03\x05\x038\n\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03>\n\x03" +
		"\x03\x03\x05\x03A\n\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03G\n\x03" +
		"\x03\x03\x05\x03J\n\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03P\n\x03" +
		"\x03\x03\x05\x03S\n\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03Y\n\x03" +
		"\x03\x03\x05\x03\\\n\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03b\n\x03" +
		"\x03\x03\x05\x03e\n\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03q\n\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x07\x03}\n\x03" +
		"\f\x03\x0E\x03\x80\v\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05\x04" +
		"\x87\n\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05\x04\x8D\n\x04\x03\x05\x03" +
		"\x05\x05\x05\x91\n\x05\x03\x05\x03\x05\x05\x05\x95\n\x05\x03\x05\x03\x05" +
		"\x03\x05\x03\x05\x05\x05\x9B\n\x05\x03\x05\x03\x05\x05\x05\x9F\n\x05\x05" +
		"\x05\xA1\n\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06" +
		"\x03\x06\x03\x06\x03\x06\x05\x06\xAD\n\x06\x03\x07\x03\x07\x03\x07\x07" +
		"\x07\xB2\n\x07\f\x07\x0E\x07\xB5\v\x07\x03\b\x03\b\x03\b\x05\b\xBA\n\b" +
		"\x03\b\x03\b\x03\t\x03\t\x03\t\x07\t\xC1\n\t\f\t\x0E\t\xC4\v\t\x03\n\x03" +
		"\n\x03\n\x03\n\x03\v\x03\v\x05\v\xCC\n\v\x03\v\x05\v\xCF\n\v\x03\f\x03" +
		"\f\x05\f\xD3\n\f\x03\f\x03\f\x03\r\x03\r\x03\r\x07\r\xDA\n\r\f\r\x0E\r" +
		"\xDD\v\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x10\x03\x10" +
		"\x03\x10\x02\x02\x03\x04\x11\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02" +
		"\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02" +
		"\x02\v\x03\x02#$\x03\x02%\'\x04\x02\x1A\x1B\x1F\"\x04\x02\x14\x14\x16" +
		"\x16\x03\x02*+\x03\x02\x18\x19\x03\x02\x0E\x0F\x03\x02\x10\x11\x03\x02" +
		"\x1B\x1E\x02\u0105\x02 \x03\x02\x02\x02\x04/\x03\x02\x02\x02\x06\x81\x03" +
		"\x02\x02\x02\b\xA0\x03\x02\x02\x02\n\xAC\x03\x02\x02\x02\f\xAE\x03\x02" +
		"\x02\x02\x0E\xB6\x03\x02\x02\x02\x10\xBD\x03\x02\x02\x02\x12\xC5\x03\x02" +
		"\x02\x02\x14\xCE\x03\x02\x02\x02\x16\xD0\x03\x02\x02\x02\x18\xD6\x03\x02" +
		"\x02\x02\x1A\xDE\x03\x02\x02\x02\x1C\xE2\x03\x02\x02\x02\x1E\xE4\x03\x02" +
		"\x02\x02 !\x05\x04\x03\x02!\"\x07\x02\x02\x03\"\x03\x03\x02\x02\x02#$" +
		"\b\x03\x01\x02$0\x05\x12\n\x02%0\x05\x1C\x0F\x02&0\x05\x1E\x10\x02\'0" +
		"\x05\b\x05\x02(0\x05\x0E\b\x02)0\x05\x14\v\x02*+\x07\x03\x02\x02+,\x07" +
		"+\x02\x02,0\x07\x04\x02\x02-.\t\x02\x02\x02.0\x05\x04\x03\t/#\x03\x02" +
		"\x02\x02/%\x03\x02\x02\x02/&\x03\x02\x02\x02/\'\x03\x02\x02\x02/(\x03" +
		"\x02\x02\x02/)\x03\x02\x02\x02/*\x03\x02\x02\x02/-\x03\x02\x02\x020~\x03" +
		"\x02\x02\x0212\f\b\x02\x0224\x07(\x02\x0235\x07\x13\x02\x0243\x03\x02" +
		"\x02\x0245\x03\x02\x02\x0257\x03\x02\x02\x0268\x05\x06\x04\x0276\x03\x02" +
		"\x02\x0278\x03\x02\x02\x0289\x03\x02\x02\x029}\x05\x04\x03\b:;\f\x07\x02" +
		"\x02;=\t\x03\x02\x02<>\x07\x13\x02\x02=<\x03\x02\x02\x02=>\x03\x02\x02" +
		"\x02>@\x03\x02\x02\x02?A\x05\x06\x04\x02@?\x03\x02\x02\x02@A\x03\x02\x02" +
		"\x02AB\x03\x02\x02\x02B}\x05\x04\x03\bCD\f\x06\x02\x02DF\t\x02\x02\x02" +
		"EG\x07\x13\x02\x02FE\x03\x02\x02\x02FG\x03\x02\x02\x02GI\x03\x02\x02\x02" +
		"HJ\x05\x06\x04\x02IH\x03\x02\x02\x02IJ\x03\x02\x02\x02JK\x03\x02\x02\x02" +
		"K}\x05\x04\x03\x07LM\f\x05\x02\x02MO\t\x04\x02\x02NP\x07\x13\x02\x02O" +
		"N\x03\x02\x02\x02OP\x03\x02\x02\x02PR\x03\x02\x02\x02QS\x05\x06\x04\x02" +
		"RQ\x03\x02\x02\x02RS\x03\x02\x02\x02ST\x03\x02\x02\x02T}\x05\x04\x03\x06" +
		"UV\f\x04\x02\x02VX\t\x05\x02\x02WY\x07\x13\x02\x02XW\x03\x02\x02\x02X" +
		"Y\x03\x02\x02\x02Y[\x03\x02\x02\x02Z\\\x05\x06\x04\x02[Z\x03\x02\x02\x02" +
		"[\\\x03\x02\x02\x02\\]\x03\x02\x02\x02]}\x05\x04\x03\x05^_\f\x03\x02\x02" +
		"_a\x07\x15\x02\x02`b\x07\x13\x02\x02a`\x03\x02\x02\x02ab\x03\x02\x02\x02" +
		"bd\x03\x02\x02\x02ce\x05\x06\x04\x02dc\x03\x02\x02\x02de\x03\x02\x02\x02" +
		"ef\x03\x02\x02\x02f}\x05\x04\x03\x04gh\f\x0E\x02\x02hi\x07\x03\x02\x02" +
		"ij\x07+\x02\x02j}\x07\x04\x02\x02kl\f\r\x02\x02lm\x07\x03\x02\x02mn\x07" +
		"+\x02\x02np\x07\x05\x02\x02oq\x07+\x02\x02po\x03\x02\x02\x02pq\x03\x02" +
		"\x02\x02qr\x03\x02\x02\x02r}\x07\x04\x02\x02st\f\f\x02\x02tu\x07\x12\x02" +
		"\x02u}\t\x06\x02\x02vw\f\v\x02\x02wx\x07\x17\x02\x02x}\x07*\x02\x02yz" +
		"\f\n\x02\x02z{\x07\x17\x02\x02{}\t\x07\x02\x02|1\x03\x02\x02\x02|:\x03" +
		"\x02\x02\x02|C\x03\x02\x02\x02|L\x03\x02\x02\x02|U\x03\x02\x02\x02|^\x03" +
		"\x02\x02\x02|g\x03\x02\x02\x02|k\x03\x02\x02\x02|s\x03\x02\x02\x02|v\x03" +
		"\x02\x02\x02|y\x03\x02\x02\x02}\x80\x03\x02\x02\x02~|\x03\x02\x02\x02" +
		"~\x7F\x03\x02\x02\x02\x7F\x05\x03\x02\x02\x02\x80~\x03\x02\x02\x02\x81" +
		"\x82\t\b\x02\x02\x82\x83\x07\x06\x02\x02\x83\x84\x05\f\x07\x02\x84\x86" +
		"\x07\x07\x02\x02\x85\x87\t\t\x02\x02\x86\x85\x03\x02\x02\x02\x86\x87\x03" +
		"\x02\x02\x02\x87\x8C\x03\x02\x02\x02\x88\x89\x07\x06\x02\x02\x89\x8A\x05" +
		"\f\x07\x02\x8A\x8B\x07\x07\x02\x02\x8B\x8D\x03\x02\x02\x02\x8C\x88\x03" +
		"\x02\x02\x02\x8C\x8D\x03\x02\x02\x02\x8D\x07\x03\x02\x02\x02\x8E\x90\x07" +
		"\v\x02\x02\x8F\x91\x05\n\x06\x02\x90\x8F\x03\x02\x02\x02\x90\x91\x03\x02" +
		"\x02\x02\x91\x92\x03\x02\x02\x02\x92\x94\x07\x06\x02\x02\x93\x95\x05\x10" +
		"\t\x02\x94\x93\x03\x02\x02\x02\x94\x95\x03\x02\x02\x02\x95\x96\x03\x02" +
		"\x02\x02\x96\xA1\x07\x07\x02\x02\x97\x98\x07\v\x02\x02\x98\x9A\x07\x06" +
		"\x02\x02\x99\x9B\x05\x10\t\x02\x9A\x99\x03\x02\x02\x02\x9A\x9B\x03\x02" +
		"\x02\x02\x9B\x9C\x03\x02\x02\x02\x9C\x9E\x07\x07\x02\x02\x9D\x9F\x05\n" +
		"\x06\x02\x9E\x9D\x03\x02\x02\x02\x9E\x9F\x03\x02\x02\x02\x9F\xA1\x03\x02" +
		"\x02\x02\xA0\x8E\x03\x02\x02\x02\xA0\x97\x03\x02\x02\x02\xA1\t\x03\x02" +
		"\x02\x02\xA2\xA3\x07\f\x02\x02\xA3\xA4\x07\x06\x02\x02\xA4\xA5\x05\f\x07" +
		"\x02\xA5\xA6\x07\x07\x02\x02\xA6\xAD\x03\x02\x02\x02\xA7\xA8\x07\r\x02" +
		"\x02\xA8\xA9\x07\x06\x02\x02\xA9\xAA\x05\f\x07\x02\xAA\xAB\x07\x07\x02" +
		"\x02\xAB\xAD\x03\x02\x02\x02\xAC\xA2\x03\x02\x02\x02\xAC\xA7\x03\x02\x02" +
		"\x02\xAD\v\x03\x02\x02\x02\xAE\xB3\x07)\x02\x02\xAF\xB0\x07\b\x02\x02" +
		"\xB0\xB2\x07)\x02\x02\xB1\xAF\x03\x02\x02\x02\xB2\xB5\x03\x02\x02\x02" +
		"\xB3\xB1\x03\x02\x02\x02\xB3\xB4\x03\x02\x02\x02\xB4\r\x03\x02\x02\x02" +
		"\xB5\xB3\x03\x02\x02\x02\xB6\xB7\x07)\x02\x02\xB7\xB9\x07\x06\x02\x02" +
		"\xB8\xBA\x05\x10\t\x02\xB9\xB8\x03\x02\x02\x02\xB9\xBA\x03\x02\x02\x02" +
		"\xBA\xBB\x03\x02\x02\x02\xBB\xBC\x07\x07\x02\x02\xBC\x0F\x03\x02\x02\x02" +
		"\xBD\xC2\x05\x04\x03\x02\xBE\xBF\x07\b\x02\x02\xBF\xC1\x05\x04\x03\x02" +
		"\xC0\xBE\x03\x02\x02\x02\xC1\xC4\x03\x02\x02\x02\xC2\xC0\x03\x02\x02\x02" +
		"\xC2\xC3\x03\x02\x02\x02\xC3\x11\x03\x02\x02\x02\xC4\xC2\x03\x02\x02\x02" +
		"\xC5\xC6\x07\x06\x02\x02\xC6\xC7\x05\x04\x03\x02\xC7\xC8\x07\x07\x02\x02" +
		"\xC8\x13\x03\x02\x02\x02\xC9\xCB\x07)\x02\x02\xCA\xCC\x05\x16\f\x02\xCB" +
		"\xCA\x03\x02\x02\x02\xCB\xCC\x03\x02\x02\x02\xCC\xCF\x03\x02\x02\x02\xCD" +
		"\xCF\x05\x16\f\x02\xCE\xC9\x03\x02\x02\x02\xCE\xCD\x03\x02\x02\x02\xCF" +
		"\x15\x03\x02\x02\x02\xD0\xD2\x07\t\x02\x02\xD1\xD3\x05\x18\r\x02\xD2\xD1" +
		"\x03\x02\x02\x02\xD2\xD3\x03\x02\x02\x02\xD3\xD4\x03\x02\x02\x02\xD4\xD5" +
		"\x07\n\x02\x02\xD5\x17\x03\x02\x02\x02\xD6\xDB\x05\x1A\x0E\x02\xD7\xD8" +
		"\x07\b\x02\x02\xD8\xDA\x05\x1A\x0E\x02\xD9\xD7\x03\x02\x02\x02\xDA\xDD" +
		"\x03\x02\x02\x02\xDB\xD9\x03\x02\x02\x02\xDB\xDC\x03\x02\x02\x02\xDC\x19" +
		"\x03\x02\x02\x02\xDD\xDB\x03\x02\x02\x02\xDE\xDF\x07)\x02\x02\xDF\xE0" +
		"\t\n\x02\x02\xE0\xE1\x07,\x02\x02\xE1\x1B\x03\x02\x02\x02\xE2\xE3\x07" +
		"*\x02\x02\xE3\x1D\x03\x02\x02\x02\xE4\xE5\x07,\x02\x02\xE5\x1F\x03\x02" +
		"\x02\x02!/47=@FIORX[adp|~\x86\x8C\x90\x94\x9A\x9E\xA0\xAC\xB3\xB9\xC2" +
		"\xCB\xCE\xD2\xDB";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!PromQLParser.__ATN) {
			PromQLParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(PromQLParser._serializedATN));
		}

		return PromQLParser.__ATN;
	}

}

export class ExpressionContext extends ParserRuleContext {
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	public EOF(): TerminalNode { return this.getToken(PromQLParser.EOF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_expression; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterExpression) {
			listener.enterExpression(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitExpression) {
			listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	public paren_expr(): Paren_exprContext | undefined {
		return this.tryGetRuleContext(0, Paren_exprContext);
	}
	public number_literal(): Number_literalContext | undefined {
		return this.tryGetRuleContext(0, Number_literalContext);
	}
	public string_literal(): String_literalContext | undefined {
		return this.tryGetRuleContext(0, String_literalContext);
	}
	public aggregate_expr(): Aggregate_exprContext | undefined {
		return this.tryGetRuleContext(0, Aggregate_exprContext);
	}
	public function_call(): Function_callContext | undefined {
		return this.tryGetRuleContext(0, Function_callContext);
	}
	public vector_selector(): Vector_selectorContext | undefined {
		return this.tryGetRuleContext(0, Vector_selectorContext);
	}
	public DURATION(): TerminalNode[];
	public DURATION(i: number): TerminalNode;
	public DURATION(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PromQLParser.DURATION);
		} else {
			return this.getToken(PromQLParser.DURATION, i);
		}
	}
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public OFFSET(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.OFFSET, 0); }
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.NUMBER, 0); }
	public AT(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.AT, 0); }
	public START(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.START, 0); }
	public END(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.END, 0); }
	public ADD(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.ADD, 0); }
	public SUB(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.SUB, 0); }
	public POW(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.POW, 0); }
	public BOOL(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.BOOL, 0); }
	public bin_modifier(): Bin_modifierContext | undefined {
		return this.tryGetRuleContext(0, Bin_modifierContext);
	}
	public MUL(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.MUL, 0); }
	public DIV(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.DIV, 0); }
	public MOD(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.MOD, 0); }
	public EQL(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.EQL, 0); }
	public NEQ(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.NEQ, 0); }
	public GTE(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.GTE, 0); }
	public LTE(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.LTE, 0); }
	public GTR(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.GTR, 0); }
	public LSS(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.LSS, 0); }
	public LAND(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.LAND, 0); }
	public LUNLESS(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.LUNLESS, 0); }
	public LOR(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.LOR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_expr; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterExpr) {
			listener.enterExpr(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitExpr) {
			listener.exitExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitExpr) {
			return visitor.visitExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Bin_modifierContext extends ParserRuleContext {
	public label_list(): Label_listContext[];
	public label_list(i: number): Label_listContext;
	public label_list(i?: number): Label_listContext | Label_listContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Label_listContext);
		} else {
			return this.getRuleContext(i, Label_listContext);
		}
	}
	public ON(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.ON, 0); }
	public IGNORING(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.IGNORING, 0); }
	public GROUP_LEFT(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.GROUP_LEFT, 0); }
	public GROUP_RIGHT(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.GROUP_RIGHT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_bin_modifier; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterBin_modifier) {
			listener.enterBin_modifier(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitBin_modifier) {
			listener.exitBin_modifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitBin_modifier) {
			return visitor.visitBin_modifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Aggregate_exprContext extends ParserRuleContext {
	public AGGREGATE_OP(): TerminalNode { return this.getToken(PromQLParser.AGGREGATE_OP, 0); }
	public aggregate_modifier(): Aggregate_modifierContext | undefined {
		return this.tryGetRuleContext(0, Aggregate_modifierContext);
	}
	public arg_list(): Arg_listContext | undefined {
		return this.tryGetRuleContext(0, Arg_listContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_aggregate_expr; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterAggregate_expr) {
			listener.enterAggregate_expr(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitAggregate_expr) {
			listener.exitAggregate_expr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitAggregate_expr) {
			return visitor.visitAggregate_expr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Aggregate_modifierContext extends ParserRuleContext {
	public BY(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.BY, 0); }
	public label_list(): Label_listContext {
		return this.getRuleContext(0, Label_listContext);
	}
	public WITHOUT(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.WITHOUT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_aggregate_modifier; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterAggregate_modifier) {
			listener.enterAggregate_modifier(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitAggregate_modifier) {
			listener.exitAggregate_modifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitAggregate_modifier) {
			return visitor.visitAggregate_modifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Label_listContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode[];
	public IDENTIFIER(i: number): TerminalNode;
	public IDENTIFIER(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PromQLParser.IDENTIFIER);
		} else {
			return this.getToken(PromQLParser.IDENTIFIER, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_label_list; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterLabel_list) {
			listener.enterLabel_list(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitLabel_list) {
			listener.exitLabel_list(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitLabel_list) {
			return visitor.visitLabel_list(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Function_callContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(PromQLParser.IDENTIFIER, 0); }
	public arg_list(): Arg_listContext | undefined {
		return this.tryGetRuleContext(0, Arg_listContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_function_call; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterFunction_call) {
			listener.enterFunction_call(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitFunction_call) {
			listener.exitFunction_call(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitFunction_call) {
			return visitor.visitFunction_call(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Arg_listContext extends ParserRuleContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_arg_list; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterArg_list) {
			listener.enterArg_list(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitArg_list) {
			listener.exitArg_list(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitArg_list) {
			return visitor.visitArg_list(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Paren_exprContext extends ParserRuleContext {
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_paren_expr; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterParen_expr) {
			listener.enterParen_expr(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitParen_expr) {
			listener.exitParen_expr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitParen_expr) {
			return visitor.visitParen_expr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Vector_selectorContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.IDENTIFIER, 0); }
	public label_matchers(): Label_matchersContext | undefined {
		return this.tryGetRuleContext(0, Label_matchersContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_vector_selector; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterVector_selector) {
			listener.enterVector_selector(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitVector_selector) {
			listener.exitVector_selector(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitVector_selector) {
			return visitor.visitVector_selector(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Label_matchersContext extends ParserRuleContext {
	public label_match_list(): Label_match_listContext | undefined {
		return this.tryGetRuleContext(0, Label_match_listContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_label_matchers; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterLabel_matchers) {
			listener.enterLabel_matchers(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitLabel_matchers) {
			listener.exitLabel_matchers(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitLabel_matchers) {
			return visitor.visitLabel_matchers(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Label_match_listContext extends ParserRuleContext {
	public label_matcher(): Label_matcherContext[];
	public label_matcher(i: number): Label_matcherContext;
	public label_matcher(i?: number): Label_matcherContext | Label_matcherContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Label_matcherContext);
		} else {
			return this.getRuleContext(i, Label_matcherContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_label_match_list; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterLabel_match_list) {
			listener.enterLabel_match_list(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitLabel_match_list) {
			listener.exitLabel_match_list(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitLabel_match_list) {
			return visitor.visitLabel_match_list(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Label_matcherContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(PromQLParser.IDENTIFIER, 0); }
	public STRING(): TerminalNode { return this.getToken(PromQLParser.STRING, 0); }
	public ASSIGN(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.ASSIGN, 0); }
	public NEQ(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.NEQ, 0); }
	public EQL_REGEX(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.EQL_REGEX, 0); }
	public NEQ_REGEX(): TerminalNode | undefined { return this.tryGetToken(PromQLParser.NEQ_REGEX, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_label_matcher; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterLabel_matcher) {
			listener.enterLabel_matcher(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitLabel_matcher) {
			listener.exitLabel_matcher(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitLabel_matcher) {
			return visitor.visitLabel_matcher(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Number_literalContext extends ParserRuleContext {
	public NUMBER(): TerminalNode { return this.getToken(PromQLParser.NUMBER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_number_literal; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterNumber_literal) {
			listener.enterNumber_literal(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitNumber_literal) {
			listener.exitNumber_literal(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitNumber_literal) {
			return visitor.visitNumber_literal(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class String_literalContext extends ParserRuleContext {
	public STRING(): TerminalNode { return this.getToken(PromQLParser.STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PromQLParser.RULE_string_literal; }
	// @Override
	public enterRule(listener: PromQLListener): void {
		if (listener.enterString_literal) {
			listener.enterString_literal(this);
		}
	}
	// @Override
	public exitRule(listener: PromQLListener): void {
		if (listener.exitString_literal) {
			listener.exitString_literal(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PromQLVisitor<Result>): Result {
		if (visitor.visitString_literal) {
			return visitor.visitString_literal(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


