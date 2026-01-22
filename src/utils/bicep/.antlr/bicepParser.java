// Generated from /Users/ivanovhr/wirk/sit-paas/api/sla/editor/src/utils/bicep/bicep.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue"})
public class bicepParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.13.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		DISABLE_NEXT_LINE_DIAGNOSTIC_DIRECTIVE=1, SINGLE_LINE_COMMENT=2, MULTI_LINE_COMMENT=3, 
		MULTILINE_STRING=4, STRING_LEFT_PIECE=5, STRING_MIDDLE_PIECE=6, STRING_RIGHT_PIECE=7, 
		STRING_COMPLETE=8, ARROW=9, AT=10, COMMA=11, PIPE=12, STAR_COL=13, OBRACK=14, 
		CBRACK=15, OPAR=16, CPAR=17, DOT=18, NOT=19, MUL=20, DIV=21, MOD=22, ADD=23, 
		MIN=24, GT=25, GTE=26, LT=27, LTE=28, EQ=29, NEQ=30, AND=31, OR=32, COALESCE=33, 
		QMARK=34, COL=35, ASSIGN=36, OBRACE=37, CBRACE=38, IMPORT=39, WITH=40, 
		AS=41, METADATA=42, PARAM=43, RESOURCE=44, MODULE=45, OUTPUT=46, EXISTING=47, 
		TYPE=48, VAR=49, IF=50, FOR=51, IN=52, TRUE=53, FALSE=54, NULL=55, TARGET_SCOPE=56, 
		STRING=57, INT=58, BOOL=59, ARRAY=60, OBJECT=61, IDENTIFIER=62, NUMBER=63, 
		NL=64, SPACES=65, UNKNOWN=66;
	public static final int
		RULE_program = 0, RULE_statement = 1, RULE_targetScopeDecl = 2, RULE_importDecl = 3, 
		RULE_importWithClause = 4, RULE_importAsClause = 5, RULE_metadataDecl = 6, 
		RULE_parameterDecl = 7, RULE_parameterDefaultValue = 8, RULE_typeDecl = 9, 
		RULE_variableDecl = 10, RULE_resourceDecl = 11, RULE_moduleDecl = 12, 
		RULE_outputDecl = 13, RULE_decorator = 14, RULE_expression = 15, RULE_binaryExpression = 16, 
		RULE_equalityExpression = 17, RULE_relationalExpression = 18, RULE_additiveExpression = 19, 
		RULE_multiplicativeExpression = 20, RULE_unaryExpression = 21, RULE_unaryOperator = 22, 
		RULE_memberExpression = 23, RULE_primaryExpression = 24, RULE_decoratorExpression = 25, 
		RULE_functionCall = 26, RULE_argumentList = 27, RULE_parenthesizedExpression = 28, 
		RULE_lambdaExpression = 29, RULE_ifCondition = 30, RULE_forExpression = 31, 
		RULE_forVariableBlock = 32, RULE_forBody = 33, RULE_interpString = 34, 
		RULE_literalValue = 35, RULE_object = 36, RULE_objectProperty = 37, RULE_array = 38, 
		RULE_arrayItem = 39, RULE_typeExpression = 40, RULE_singularTypeExpression = 41, 
		RULE_primaryTypeExpression = 42, RULE_ambientTypeReference = 43, RULE_objectType = 44, 
		RULE_objectTypeProperty = 45, RULE_objectTypeAdditionalPropertiesMatcher = 46, 
		RULE_tupleType = 47, RULE_tupleItem = 48, RULE_parenthesizedTypeExpression = 49, 
		RULE_identifier = 50;
	private static String[] makeRuleNames() {
		return new String[] {
			"program", "statement", "targetScopeDecl", "importDecl", "importWithClause", 
			"importAsClause", "metadataDecl", "parameterDecl", "parameterDefaultValue", 
			"typeDecl", "variableDecl", "resourceDecl", "moduleDecl", "outputDecl", 
			"decorator", "expression", "binaryExpression", "equalityExpression", 
			"relationalExpression", "additiveExpression", "multiplicativeExpression", 
			"unaryExpression", "unaryOperator", "memberExpression", "primaryExpression", 
			"decoratorExpression", "functionCall", "argumentList", "parenthesizedExpression", 
			"lambdaExpression", "ifCondition", "forExpression", "forVariableBlock", 
			"forBody", "interpString", "literalValue", "object", "objectProperty", 
			"array", "arrayItem", "typeExpression", "singularTypeExpression", "primaryTypeExpression", 
			"ambientTypeReference", "objectType", "objectTypeProperty", "objectTypeAdditionalPropertiesMatcher", 
			"tupleType", "tupleItem", "parenthesizedTypeExpression", "identifier"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, "'=>'", "'@'", 
			"','", "'|'", "'*:'", "'['", "']'", "'('", "')'", "'.'", "'!'", "'*'", 
			"'/'", "'%'", "'+'", "'-'", "'>'", "'>='", "'<'", "'<='", "'=='", "'!='", 
			"'&&'", "'OR'", "'??'", "'?'", "':'", "'='", "'{'", "'}'", "'import'", 
			"'with'", "'as'", "'metadata'", "'param'", "'resource'", "'module'", 
			"'output'", "'existing'", "'type'", "'var'", "'if'", "'for'", "'in'", 
			"'true'", "'false'", "'null'", "'targetScope'", "'string'", "'int'", 
			"'bool'", "'array'", "'object'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "DISABLE_NEXT_LINE_DIAGNOSTIC_DIRECTIVE", "SINGLE_LINE_COMMENT", 
			"MULTI_LINE_COMMENT", "MULTILINE_STRING", "STRING_LEFT_PIECE", "STRING_MIDDLE_PIECE", 
			"STRING_RIGHT_PIECE", "STRING_COMPLETE", "ARROW", "AT", "COMMA", "PIPE", 
			"STAR_COL", "OBRACK", "CBRACK", "OPAR", "CPAR", "DOT", "NOT", "MUL", 
			"DIV", "MOD", "ADD", "MIN", "GT", "GTE", "LT", "LTE", "EQ", "NEQ", "AND", 
			"OR", "COALESCE", "QMARK", "COL", "ASSIGN", "OBRACE", "CBRACE", "IMPORT", 
			"WITH", "AS", "METADATA", "PARAM", "RESOURCE", "MODULE", "OUTPUT", "EXISTING", 
			"TYPE", "VAR", "IF", "FOR", "IN", "TRUE", "FALSE", "NULL", "TARGET_SCOPE", 
			"STRING", "INT", "BOOL", "ARRAY", "OBJECT", "IDENTIFIER", "NUMBER", "NL", 
			"SPACES", "UNKNOWN"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "bicep.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public bicepParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ProgramContext extends ParserRuleContext {
		public TerminalNode EOF() { return getToken(bicepParser.EOF, 0); }
		public List<StatementContext> statement() {
			return getRuleContexts(StatementContext.class);
		}
		public StatementContext statement(int i) {
			return getRuleContext(StatementContext.class,i);
		}
		public ProgramContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_program; }
	}

	public final ProgramContext program() throws RecognitionException {
		ProgramContext _localctx = new ProgramContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_program);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(105);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (((((_la - 10)) & ~0x3f) == 0 && ((1L << (_la - 10)) & 18085725568237569L) != 0)) {
				{
				{
				setState(102);
				statement();
				}
				}
				setState(107);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(108);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class StatementContext extends ParserRuleContext {
		public TargetScopeDeclContext targetScopeDecl() {
			return getRuleContext(TargetScopeDeclContext.class,0);
		}
		public ImportDeclContext importDecl() {
			return getRuleContext(ImportDeclContext.class,0);
		}
		public MetadataDeclContext metadataDecl() {
			return getRuleContext(MetadataDeclContext.class,0);
		}
		public ParameterDeclContext parameterDecl() {
			return getRuleContext(ParameterDeclContext.class,0);
		}
		public TypeDeclContext typeDecl() {
			return getRuleContext(TypeDeclContext.class,0);
		}
		public VariableDeclContext variableDecl() {
			return getRuleContext(VariableDeclContext.class,0);
		}
		public ResourceDeclContext resourceDecl() {
			return getRuleContext(ResourceDeclContext.class,0);
		}
		public ModuleDeclContext moduleDecl() {
			return getRuleContext(ModuleDeclContext.class,0);
		}
		public OutputDeclContext outputDecl() {
			return getRuleContext(OutputDeclContext.class,0);
		}
		public TerminalNode NL() { return getToken(bicepParser.NL, 0); }
		public StatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_statement; }
	}

	public final StatementContext statement() throws RecognitionException {
		StatementContext _localctx = new StatementContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_statement);
		try {
			setState(120);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,1,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(110);
				targetScopeDecl();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(111);
				importDecl();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(112);
				metadataDecl();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(113);
				parameterDecl();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(114);
				typeDecl();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(115);
				variableDecl();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(116);
				resourceDecl();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(117);
				moduleDecl();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(118);
				outputDecl();
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(119);
				match(NL);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TargetScopeDeclContext extends ParserRuleContext {
		public TerminalNode TARGET_SCOPE() { return getToken(bicepParser.TARGET_SCOPE, 0); }
		public TerminalNode ASSIGN() { return getToken(bicepParser.ASSIGN, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public TargetScopeDeclContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_targetScopeDecl; }
	}

	public final TargetScopeDeclContext targetScopeDecl() throws RecognitionException {
		TargetScopeDeclContext _localctx = new TargetScopeDeclContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_targetScopeDecl);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(122);
			match(TARGET_SCOPE);
			setState(123);
			match(ASSIGN);
			setState(124);
			expression();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ImportDeclContext extends ParserRuleContext {
		public InterpStringContext specification;
		public TerminalNode IMPORT() { return getToken(bicepParser.IMPORT, 0); }
		public TerminalNode NL() { return getToken(bicepParser.NL, 0); }
		public InterpStringContext interpString() {
			return getRuleContext(InterpStringContext.class,0);
		}
		public List<DecoratorContext> decorator() {
			return getRuleContexts(DecoratorContext.class);
		}
		public DecoratorContext decorator(int i) {
			return getRuleContext(DecoratorContext.class,i);
		}
		public ImportWithClauseContext importWithClause() {
			return getRuleContext(ImportWithClauseContext.class,0);
		}
		public ImportAsClauseContext importAsClause() {
			return getRuleContext(ImportAsClauseContext.class,0);
		}
		public ImportDeclContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_importDecl; }
	}

	public final ImportDeclContext importDecl() throws RecognitionException {
		ImportDeclContext _localctx = new ImportDeclContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_importDecl);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(129);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==AT) {
				{
				{
				setState(126);
				decorator();
				}
				}
				setState(131);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(132);
			match(IMPORT);
			setState(133);
			((ImportDeclContext)_localctx).specification = interpString();
			setState(135);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==WITH) {
				{
				setState(134);
				importWithClause();
				}
			}

			setState(138);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==AS) {
				{
				setState(137);
				importAsClause();
				}
			}

			setState(140);
			match(NL);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ImportWithClauseContext extends ParserRuleContext {
		public TerminalNode WITH() { return getToken(bicepParser.WITH, 0); }
		public ObjectContext object() {
			return getRuleContext(ObjectContext.class,0);
		}
		public ImportWithClauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_importWithClause; }
	}

	public final ImportWithClauseContext importWithClause() throws RecognitionException {
		ImportWithClauseContext _localctx = new ImportWithClauseContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_importWithClause);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(142);
			match(WITH);
			setState(143);
			object();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ImportAsClauseContext extends ParserRuleContext {
		public IdentifierContext alias;
		public TerminalNode AS() { return getToken(bicepParser.AS, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ImportAsClauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_importAsClause; }
	}

	public final ImportAsClauseContext importAsClause() throws RecognitionException {
		ImportAsClauseContext _localctx = new ImportAsClauseContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_importAsClause);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(145);
			match(AS);
			setState(146);
			((ImportAsClauseContext)_localctx).alias = identifier();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class MetadataDeclContext extends ParserRuleContext {
		public IdentifierContext name;
		public TerminalNode METADATA() { return getToken(bicepParser.METADATA, 0); }
		public TerminalNode ASSIGN() { return getToken(bicepParser.ASSIGN, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public TerminalNode NL() { return getToken(bicepParser.NL, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public MetadataDeclContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_metadataDecl; }
	}

	public final MetadataDeclContext metadataDecl() throws RecognitionException {
		MetadataDeclContext _localctx = new MetadataDeclContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_metadataDecl);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(148);
			match(METADATA);
			setState(149);
			((MetadataDeclContext)_localctx).name = identifier();
			setState(150);
			match(ASSIGN);
			setState(151);
			expression();
			setState(152);
			match(NL);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ParameterDeclContext extends ParserRuleContext {
		public IdentifierContext name;
		public InterpStringContext type;
		public TerminalNode PARAM() { return getToken(bicepParser.PARAM, 0); }
		public TerminalNode NL() { return getToken(bicepParser.NL, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public TypeExpressionContext typeExpression() {
			return getRuleContext(TypeExpressionContext.class,0);
		}
		public TerminalNode RESOURCE() { return getToken(bicepParser.RESOURCE, 0); }
		public List<DecoratorContext> decorator() {
			return getRuleContexts(DecoratorContext.class);
		}
		public DecoratorContext decorator(int i) {
			return getRuleContext(DecoratorContext.class,i);
		}
		public InterpStringContext interpString() {
			return getRuleContext(InterpStringContext.class,0);
		}
		public ParameterDefaultValueContext parameterDefaultValue() {
			return getRuleContext(ParameterDefaultValueContext.class,0);
		}
		public ParameterDeclContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_parameterDecl; }
	}

	public final ParameterDeclContext parameterDecl() throws RecognitionException {
		ParameterDeclContext _localctx = new ParameterDeclContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_parameterDecl);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(157);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==AT) {
				{
				{
				setState(154);
				decorator();
				}
				}
				setState(159);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(160);
			match(PARAM);
			setState(161);
			((ParameterDeclContext)_localctx).name = identifier();
			setState(171);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,8,_ctx) ) {
			case 1:
				{
				setState(162);
				typeExpression();
				setState(164);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==ASSIGN) {
					{
					setState(163);
					parameterDefaultValue();
					}
				}

				}
				break;
			case 2:
				{
				setState(166);
				match(RESOURCE);
				setState(167);
				((ParameterDeclContext)_localctx).type = interpString();
				setState(169);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==ASSIGN) {
					{
					setState(168);
					parameterDefaultValue();
					}
				}

				}
				break;
			}
			setState(173);
			match(NL);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ParameterDefaultValueContext extends ParserRuleContext {
		public TerminalNode ASSIGN() { return getToken(bicepParser.ASSIGN, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public ParameterDefaultValueContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_parameterDefaultValue; }
	}

	public final ParameterDefaultValueContext parameterDefaultValue() throws RecognitionException {
		ParameterDefaultValueContext _localctx = new ParameterDefaultValueContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_parameterDefaultValue);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(175);
			match(ASSIGN);
			setState(176);
			expression();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TypeDeclContext extends ParserRuleContext {
		public IdentifierContext name;
		public TerminalNode TYPE() { return getToken(bicepParser.TYPE, 0); }
		public TerminalNode ASSIGN() { return getToken(bicepParser.ASSIGN, 0); }
		public TypeExpressionContext typeExpression() {
			return getRuleContext(TypeExpressionContext.class,0);
		}
		public TerminalNode NL() { return getToken(bicepParser.NL, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public List<DecoratorContext> decorator() {
			return getRuleContexts(DecoratorContext.class);
		}
		public DecoratorContext decorator(int i) {
			return getRuleContext(DecoratorContext.class,i);
		}
		public TypeDeclContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_typeDecl; }
	}

	public final TypeDeclContext typeDecl() throws RecognitionException {
		TypeDeclContext _localctx = new TypeDeclContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_typeDecl);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(181);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==AT) {
				{
				{
				setState(178);
				decorator();
				}
				}
				setState(183);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(184);
			match(TYPE);
			setState(185);
			((TypeDeclContext)_localctx).name = identifier();
			setState(186);
			match(ASSIGN);
			setState(187);
			typeExpression();
			setState(188);
			match(NL);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class VariableDeclContext extends ParserRuleContext {
		public IdentifierContext name;
		public TerminalNode VAR() { return getToken(bicepParser.VAR, 0); }
		public TerminalNode ASSIGN() { return getToken(bicepParser.ASSIGN, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public TerminalNode NL() { return getToken(bicepParser.NL, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public List<DecoratorContext> decorator() {
			return getRuleContexts(DecoratorContext.class);
		}
		public DecoratorContext decorator(int i) {
			return getRuleContext(DecoratorContext.class,i);
		}
		public VariableDeclContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_variableDecl; }
	}

	public final VariableDeclContext variableDecl() throws RecognitionException {
		VariableDeclContext _localctx = new VariableDeclContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_variableDecl);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(193);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==AT) {
				{
				{
				setState(190);
				decorator();
				}
				}
				setState(195);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(196);
			match(VAR);
			setState(197);
			((VariableDeclContext)_localctx).name = identifier();
			setState(198);
			match(ASSIGN);
			setState(199);
			expression();
			setState(200);
			match(NL);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ResourceDeclContext extends ParserRuleContext {
		public IdentifierContext name;
		public InterpStringContext type;
		public TerminalNode RESOURCE() { return getToken(bicepParser.RESOURCE, 0); }
		public TerminalNode ASSIGN() { return getToken(bicepParser.ASSIGN, 0); }
		public TerminalNode NL() { return getToken(bicepParser.NL, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public InterpStringContext interpString() {
			return getRuleContext(InterpStringContext.class,0);
		}
		public IfConditionContext ifCondition() {
			return getRuleContext(IfConditionContext.class,0);
		}
		public ObjectContext object() {
			return getRuleContext(ObjectContext.class,0);
		}
		public ForExpressionContext forExpression() {
			return getRuleContext(ForExpressionContext.class,0);
		}
		public List<DecoratorContext> decorator() {
			return getRuleContexts(DecoratorContext.class);
		}
		public DecoratorContext decorator(int i) {
			return getRuleContext(DecoratorContext.class,i);
		}
		public TerminalNode EXISTING() { return getToken(bicepParser.EXISTING, 0); }
		public ResourceDeclContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_resourceDecl; }
	}

	public final ResourceDeclContext resourceDecl() throws RecognitionException {
		ResourceDeclContext _localctx = new ResourceDeclContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_resourceDecl);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(205);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==AT) {
				{
				{
				setState(202);
				decorator();
				}
				}
				setState(207);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(208);
			match(RESOURCE);
			setState(209);
			((ResourceDeclContext)_localctx).name = identifier();
			setState(210);
			((ResourceDeclContext)_localctx).type = interpString();
			setState(212);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==EXISTING) {
				{
				setState(211);
				match(EXISTING);
				}
			}

			setState(214);
			match(ASSIGN);
			setState(218);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IF:
				{
				setState(215);
				ifCondition();
				}
				break;
			case OBRACE:
				{
				setState(216);
				object();
				}
				break;
			case OBRACK:
				{
				setState(217);
				forExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(220);
			match(NL);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ModuleDeclContext extends ParserRuleContext {
		public IdentifierContext name;
		public InterpStringContext type;
		public TerminalNode MODULE() { return getToken(bicepParser.MODULE, 0); }
		public TerminalNode ASSIGN() { return getToken(bicepParser.ASSIGN, 0); }
		public TerminalNode NL() { return getToken(bicepParser.NL, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public InterpStringContext interpString() {
			return getRuleContext(InterpStringContext.class,0);
		}
		public IfConditionContext ifCondition() {
			return getRuleContext(IfConditionContext.class,0);
		}
		public ObjectContext object() {
			return getRuleContext(ObjectContext.class,0);
		}
		public ForExpressionContext forExpression() {
			return getRuleContext(ForExpressionContext.class,0);
		}
		public List<DecoratorContext> decorator() {
			return getRuleContexts(DecoratorContext.class);
		}
		public DecoratorContext decorator(int i) {
			return getRuleContext(DecoratorContext.class,i);
		}
		public ModuleDeclContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_moduleDecl; }
	}

	public final ModuleDeclContext moduleDecl() throws RecognitionException {
		ModuleDeclContext _localctx = new ModuleDeclContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_moduleDecl);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(225);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==AT) {
				{
				{
				setState(222);
				decorator();
				}
				}
				setState(227);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(228);
			match(MODULE);
			setState(229);
			((ModuleDeclContext)_localctx).name = identifier();
			setState(230);
			((ModuleDeclContext)_localctx).type = interpString();
			setState(231);
			match(ASSIGN);
			setState(235);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IF:
				{
				setState(232);
				ifCondition();
				}
				break;
			case OBRACE:
				{
				setState(233);
				object();
				}
				break;
			case OBRACK:
				{
				setState(234);
				forExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(237);
			match(NL);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class OutputDeclContext extends ParserRuleContext {
		public IdentifierContext name;
		public IdentifierContext type1;
		public InterpStringContext type2;
		public TerminalNode OUTPUT() { return getToken(bicepParser.OUTPUT, 0); }
		public TerminalNode ASSIGN() { return getToken(bicepParser.ASSIGN, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public TerminalNode NL() { return getToken(bicepParser.NL, 0); }
		public List<IdentifierContext> identifier() {
			return getRuleContexts(IdentifierContext.class);
		}
		public IdentifierContext identifier(int i) {
			return getRuleContext(IdentifierContext.class,i);
		}
		public TerminalNode RESOURCE() { return getToken(bicepParser.RESOURCE, 0); }
		public List<DecoratorContext> decorator() {
			return getRuleContexts(DecoratorContext.class);
		}
		public DecoratorContext decorator(int i) {
			return getRuleContext(DecoratorContext.class,i);
		}
		public InterpStringContext interpString() {
			return getRuleContext(InterpStringContext.class,0);
		}
		public OutputDeclContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_outputDecl; }
	}

	public final OutputDeclContext outputDecl() throws RecognitionException {
		OutputDeclContext _localctx = new OutputDeclContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_outputDecl);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(242);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==AT) {
				{
				{
				setState(239);
				decorator();
				}
				}
				setState(244);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(245);
			match(OUTPUT);
			setState(246);
			((OutputDeclContext)_localctx).name = identifier();
			setState(250);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,17,_ctx) ) {
			case 1:
				{
				setState(247);
				((OutputDeclContext)_localctx).type1 = identifier();
				}
				break;
			case 2:
				{
				setState(248);
				match(RESOURCE);
				setState(249);
				((OutputDeclContext)_localctx).type2 = interpString();
				}
				break;
			}
			setState(252);
			match(ASSIGN);
			setState(253);
			expression();
			setState(254);
			match(NL);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class DecoratorContext extends ParserRuleContext {
		public TerminalNode AT() { return getToken(bicepParser.AT, 0); }
		public DecoratorExpressionContext decoratorExpression() {
			return getRuleContext(DecoratorExpressionContext.class,0);
		}
		public TerminalNode NL() { return getToken(bicepParser.NL, 0); }
		public DecoratorContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_decorator; }
	}

	public final DecoratorContext decorator() throws RecognitionException {
		DecoratorContext _localctx = new DecoratorContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_decorator);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(256);
			match(AT);
			setState(257);
			decoratorExpression();
			setState(258);
			match(NL);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ExpressionContext extends ParserRuleContext {
		public BinaryExpressionContext binaryExpression() {
			return getRuleContext(BinaryExpressionContext.class,0);
		}
		public TerminalNode QMARK() { return getToken(bicepParser.QMARK, 0); }
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode COL() { return getToken(bicepParser.COL, 0); }
		public ExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expression; }
	}

	public final ExpressionContext expression() throws RecognitionException {
		ExpressionContext _localctx = new ExpressionContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_expression);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(260);
			binaryExpression(0);
			setState(266);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,18,_ctx) ) {
			case 1:
				{
				setState(261);
				match(QMARK);
				setState(262);
				expression();
				setState(263);
				match(COL);
				setState(264);
				expression();
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class BinaryExpressionContext extends ParserRuleContext {
		public EqualityExpressionContext equalityExpression() {
			return getRuleContext(EqualityExpressionContext.class,0);
		}
		public BinaryExpressionContext binaryExpression() {
			return getRuleContext(BinaryExpressionContext.class,0);
		}
		public TerminalNode AND() { return getToken(bicepParser.AND, 0); }
		public TerminalNode OR() { return getToken(bicepParser.OR, 0); }
		public TerminalNode COALESCE() { return getToken(bicepParser.COALESCE, 0); }
		public BinaryExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_binaryExpression; }
	}

	public final BinaryExpressionContext binaryExpression() throws RecognitionException {
		return binaryExpression(0);
	}

	private BinaryExpressionContext binaryExpression(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		BinaryExpressionContext _localctx = new BinaryExpressionContext(_ctx, _parentState);
		BinaryExpressionContext _prevctx = _localctx;
		int _startState = 32;
		enterRecursionRule(_localctx, 32, RULE_binaryExpression, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(269);
			equalityExpression(0);
			}
			_ctx.stop = _input.LT(-1);
			setState(276);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,19,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					{
					_localctx = new BinaryExpressionContext(_parentctx, _parentState);
					pushNewRecursionContext(_localctx, _startState, RULE_binaryExpression);
					setState(271);
					if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
					setState(272);
					_la = _input.LA(1);
					if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 15032385536L) != 0)) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					setState(273);
					equalityExpression(0);
					}
					} 
				}
				setState(278);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,19,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class EqualityExpressionContext extends ParserRuleContext {
		public RelationalExpressionContext relationalExpression() {
			return getRuleContext(RelationalExpressionContext.class,0);
		}
		public EqualityExpressionContext equalityExpression() {
			return getRuleContext(EqualityExpressionContext.class,0);
		}
		public TerminalNode EQ() { return getToken(bicepParser.EQ, 0); }
		public TerminalNode NEQ() { return getToken(bicepParser.NEQ, 0); }
		public EqualityExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_equalityExpression; }
	}

	public final EqualityExpressionContext equalityExpression() throws RecognitionException {
		return equalityExpression(0);
	}

	private EqualityExpressionContext equalityExpression(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		EqualityExpressionContext _localctx = new EqualityExpressionContext(_ctx, _parentState);
		EqualityExpressionContext _prevctx = _localctx;
		int _startState = 34;
		enterRecursionRule(_localctx, 34, RULE_equalityExpression, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(280);
			relationalExpression(0);
			}
			_ctx.stop = _input.LT(-1);
			setState(287);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					{
					_localctx = new EqualityExpressionContext(_parentctx, _parentState);
					pushNewRecursionContext(_localctx, _startState, RULE_equalityExpression);
					setState(282);
					if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
					setState(283);
					_la = _input.LA(1);
					if ( !(_la==EQ || _la==NEQ) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					setState(284);
					relationalExpression(0);
					}
					} 
				}
				setState(289);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class RelationalExpressionContext extends ParserRuleContext {
		public AdditiveExpressionContext additiveExpression() {
			return getRuleContext(AdditiveExpressionContext.class,0);
		}
		public RelationalExpressionContext relationalExpression() {
			return getRuleContext(RelationalExpressionContext.class,0);
		}
		public TerminalNode GT() { return getToken(bicepParser.GT, 0); }
		public TerminalNode GTE() { return getToken(bicepParser.GTE, 0); }
		public TerminalNode LT() { return getToken(bicepParser.LT, 0); }
		public TerminalNode LTE() { return getToken(bicepParser.LTE, 0); }
		public RelationalExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_relationalExpression; }
	}

	public final RelationalExpressionContext relationalExpression() throws RecognitionException {
		return relationalExpression(0);
	}

	private RelationalExpressionContext relationalExpression(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		RelationalExpressionContext _localctx = new RelationalExpressionContext(_ctx, _parentState);
		RelationalExpressionContext _prevctx = _localctx;
		int _startState = 36;
		enterRecursionRule(_localctx, 36, RULE_relationalExpression, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(291);
			additiveExpression(0);
			}
			_ctx.stop = _input.LT(-1);
			setState(298);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,21,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					{
					_localctx = new RelationalExpressionContext(_parentctx, _parentState);
					pushNewRecursionContext(_localctx, _startState, RULE_relationalExpression);
					setState(293);
					if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
					setState(294);
					_la = _input.LA(1);
					if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 503316480L) != 0)) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					setState(295);
					additiveExpression(0);
					}
					} 
				}
				setState(300);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,21,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class AdditiveExpressionContext extends ParserRuleContext {
		public MultiplicativeExpressionContext multiplicativeExpression() {
			return getRuleContext(MultiplicativeExpressionContext.class,0);
		}
		public AdditiveExpressionContext additiveExpression() {
			return getRuleContext(AdditiveExpressionContext.class,0);
		}
		public TerminalNode ADD() { return getToken(bicepParser.ADD, 0); }
		public TerminalNode MIN() { return getToken(bicepParser.MIN, 0); }
		public AdditiveExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_additiveExpression; }
	}

	public final AdditiveExpressionContext additiveExpression() throws RecognitionException {
		return additiveExpression(0);
	}

	private AdditiveExpressionContext additiveExpression(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		AdditiveExpressionContext _localctx = new AdditiveExpressionContext(_ctx, _parentState);
		AdditiveExpressionContext _prevctx = _localctx;
		int _startState = 38;
		enterRecursionRule(_localctx, 38, RULE_additiveExpression, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(302);
			multiplicativeExpression(0);
			}
			_ctx.stop = _input.LT(-1);
			setState(309);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,22,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					{
					_localctx = new AdditiveExpressionContext(_parentctx, _parentState);
					pushNewRecursionContext(_localctx, _startState, RULE_additiveExpression);
					setState(304);
					if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
					setState(305);
					_la = _input.LA(1);
					if ( !(_la==ADD || _la==MIN) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					setState(306);
					multiplicativeExpression(0);
					}
					} 
				}
				setState(311);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,22,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class MultiplicativeExpressionContext extends ParserRuleContext {
		public UnaryExpressionContext unaryExpression() {
			return getRuleContext(UnaryExpressionContext.class,0);
		}
		public MultiplicativeExpressionContext multiplicativeExpression() {
			return getRuleContext(MultiplicativeExpressionContext.class,0);
		}
		public TerminalNode MUL() { return getToken(bicepParser.MUL, 0); }
		public TerminalNode DIV() { return getToken(bicepParser.DIV, 0); }
		public TerminalNode MOD() { return getToken(bicepParser.MOD, 0); }
		public MultiplicativeExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_multiplicativeExpression; }
	}

	public final MultiplicativeExpressionContext multiplicativeExpression() throws RecognitionException {
		return multiplicativeExpression(0);
	}

	private MultiplicativeExpressionContext multiplicativeExpression(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		MultiplicativeExpressionContext _localctx = new MultiplicativeExpressionContext(_ctx, _parentState);
		MultiplicativeExpressionContext _prevctx = _localctx;
		int _startState = 40;
		enterRecursionRule(_localctx, 40, RULE_multiplicativeExpression, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(313);
			unaryExpression();
			}
			_ctx.stop = _input.LT(-1);
			setState(320);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,23,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					{
					_localctx = new MultiplicativeExpressionContext(_parentctx, _parentState);
					pushNewRecursionContext(_localctx, _startState, RULE_multiplicativeExpression);
					setState(315);
					if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
					setState(316);
					_la = _input.LA(1);
					if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 7340032L) != 0)) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					setState(317);
					unaryExpression();
					}
					} 
				}
				setState(322);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,23,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class UnaryExpressionContext extends ParserRuleContext {
		public MemberExpressionContext memberExpression() {
			return getRuleContext(MemberExpressionContext.class,0);
		}
		public UnaryOperatorContext unaryOperator() {
			return getRuleContext(UnaryOperatorContext.class,0);
		}
		public UnaryExpressionContext unaryExpression() {
			return getRuleContext(UnaryExpressionContext.class,0);
		}
		public UnaryExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_unaryExpression; }
	}

	public final UnaryExpressionContext unaryExpression() throws RecognitionException {
		UnaryExpressionContext _localctx = new UnaryExpressionContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_unaryExpression);
		try {
			setState(327);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case MULTILINE_STRING:
			case STRING_LEFT_PIECE:
			case STRING_COMPLETE:
			case OBRACK:
			case OPAR:
			case OBRACE:
			case IMPORT:
			case WITH:
			case AS:
			case METADATA:
			case PARAM:
			case RESOURCE:
			case MODULE:
			case OUTPUT:
			case EXISTING:
			case TYPE:
			case VAR:
			case IF:
			case FOR:
			case IN:
			case TRUE:
			case FALSE:
			case NULL:
			case TARGET_SCOPE:
			case STRING:
			case INT:
			case BOOL:
			case ARRAY:
			case OBJECT:
			case IDENTIFIER:
			case NUMBER:
				enterOuterAlt(_localctx, 1);
				{
				setState(323);
				memberExpression(0);
				}
				break;
			case NOT:
			case ADD:
			case MIN:
				enterOuterAlt(_localctx, 2);
				{
				setState(324);
				unaryOperator();
				setState(325);
				unaryExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class UnaryOperatorContext extends ParserRuleContext {
		public TerminalNode NOT() { return getToken(bicepParser.NOT, 0); }
		public TerminalNode MIN() { return getToken(bicepParser.MIN, 0); }
		public TerminalNode ADD() { return getToken(bicepParser.ADD, 0); }
		public UnaryOperatorContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_unaryOperator; }
	}

	public final UnaryOperatorContext unaryOperator() throws RecognitionException {
		UnaryOperatorContext _localctx = new UnaryOperatorContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_unaryOperator);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(329);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 25690112L) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class MemberExpressionContext extends ParserRuleContext {
		public IdentifierContext property;
		public IdentifierContext name;
		public PrimaryExpressionContext primaryExpression() {
			return getRuleContext(PrimaryExpressionContext.class,0);
		}
		public MemberExpressionContext memberExpression() {
			return getRuleContext(MemberExpressionContext.class,0);
		}
		public TerminalNode OBRACK() { return getToken(bicepParser.OBRACK, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public TerminalNode CBRACK() { return getToken(bicepParser.CBRACK, 0); }
		public TerminalNode DOT() { return getToken(bicepParser.DOT, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public FunctionCallContext functionCall() {
			return getRuleContext(FunctionCallContext.class,0);
		}
		public TerminalNode COL() { return getToken(bicepParser.COL, 0); }
		public MemberExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_memberExpression; }
	}

	public final MemberExpressionContext memberExpression() throws RecognitionException {
		return memberExpression(0);
	}

	private MemberExpressionContext memberExpression(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		MemberExpressionContext _localctx = new MemberExpressionContext(_ctx, _parentState);
		MemberExpressionContext _prevctx = _localctx;
		int _startState = 46;
		enterRecursionRule(_localctx, 46, RULE_memberExpression, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(332);
			primaryExpression();
			}
			_ctx.stop = _input.LT(-1);
			setState(350);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,26,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(348);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,25,_ctx) ) {
					case 1:
						{
						_localctx = new MemberExpressionContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_memberExpression);
						setState(334);
						if (!(precpred(_ctx, 5))) throw new FailedPredicateException(this, "precpred(_ctx, 5)");
						setState(335);
						match(OBRACK);
						setState(336);
						expression();
						setState(337);
						match(CBRACK);
						}
						break;
					case 2:
						{
						_localctx = new MemberExpressionContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_memberExpression);
						setState(339);
						if (!(precpred(_ctx, 4))) throw new FailedPredicateException(this, "precpred(_ctx, 4)");
						setState(340);
						match(DOT);
						setState(341);
						((MemberExpressionContext)_localctx).property = identifier();
						}
						break;
					case 3:
						{
						_localctx = new MemberExpressionContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_memberExpression);
						setState(342);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(343);
						match(DOT);
						setState(344);
						functionCall();
						}
						break;
					case 4:
						{
						_localctx = new MemberExpressionContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_memberExpression);
						setState(345);
						if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
						setState(346);
						match(COL);
						setState(347);
						((MemberExpressionContext)_localctx).name = identifier();
						}
						break;
					}
					} 
				}
				setState(352);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,26,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PrimaryExpressionContext extends ParserRuleContext {
		public FunctionCallContext functionCall() {
			return getRuleContext(FunctionCallContext.class,0);
		}
		public LiteralValueContext literalValue() {
			return getRuleContext(LiteralValueContext.class,0);
		}
		public InterpStringContext interpString() {
			return getRuleContext(InterpStringContext.class,0);
		}
		public TerminalNode MULTILINE_STRING() { return getToken(bicepParser.MULTILINE_STRING, 0); }
		public ArrayContext array() {
			return getRuleContext(ArrayContext.class,0);
		}
		public ForExpressionContext forExpression() {
			return getRuleContext(ForExpressionContext.class,0);
		}
		public ObjectContext object() {
			return getRuleContext(ObjectContext.class,0);
		}
		public ParenthesizedExpressionContext parenthesizedExpression() {
			return getRuleContext(ParenthesizedExpressionContext.class,0);
		}
		public LambdaExpressionContext lambdaExpression() {
			return getRuleContext(LambdaExpressionContext.class,0);
		}
		public PrimaryExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_primaryExpression; }
	}

	public final PrimaryExpressionContext primaryExpression() throws RecognitionException {
		PrimaryExpressionContext _localctx = new PrimaryExpressionContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_primaryExpression);
		try {
			setState(362);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,27,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(353);
				functionCall();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(354);
				literalValue();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(355);
				interpString();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(356);
				match(MULTILINE_STRING);
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(357);
				array();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(358);
				forExpression();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(359);
				object();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(360);
				parenthesizedExpression();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(361);
				lambdaExpression();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class DecoratorExpressionContext extends ParserRuleContext {
		public FunctionCallContext functionCall() {
			return getRuleContext(FunctionCallContext.class,0);
		}
		public MemberExpressionContext memberExpression() {
			return getRuleContext(MemberExpressionContext.class,0);
		}
		public TerminalNode DOT() { return getToken(bicepParser.DOT, 0); }
		public DecoratorExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_decoratorExpression; }
	}

	public final DecoratorExpressionContext decoratorExpression() throws RecognitionException {
		DecoratorExpressionContext _localctx = new DecoratorExpressionContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_decoratorExpression);
		try {
			setState(369);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,28,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(364);
				functionCall();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(365);
				memberExpression(0);
				setState(366);
				match(DOT);
				setState(367);
				functionCall();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class FunctionCallContext extends ParserRuleContext {
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public TerminalNode OPAR() { return getToken(bicepParser.OPAR, 0); }
		public TerminalNode CPAR() { return getToken(bicepParser.CPAR, 0); }
		public ArgumentListContext argumentList() {
			return getRuleContext(ArgumentListContext.class,0);
		}
		public FunctionCallContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_functionCall; }
	}

	public final FunctionCallContext functionCall() throws RecognitionException {
		FunctionCallContext _localctx = new FunctionCallContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_functionCall);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(371);
			identifier();
			setState(372);
			match(OPAR);
			setState(374);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & -412291088080L) != 0)) {
				{
				setState(373);
				argumentList();
				}
			}

			setState(376);
			match(CPAR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ArgumentListContext extends ParserRuleContext {
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(bicepParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(bicepParser.COMMA, i);
		}
		public ArgumentListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_argumentList; }
	}

	public final ArgumentListContext argumentList() throws RecognitionException {
		ArgumentListContext _localctx = new ArgumentListContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_argumentList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(378);
			expression();
			setState(383);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(379);
				match(COMMA);
				setState(380);
				expression();
				}
				}
				setState(385);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ParenthesizedExpressionContext extends ParserRuleContext {
		public TerminalNode OPAR() { return getToken(bicepParser.OPAR, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public TerminalNode CPAR() { return getToken(bicepParser.CPAR, 0); }
		public ParenthesizedExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_parenthesizedExpression; }
	}

	public final ParenthesizedExpressionContext parenthesizedExpression() throws RecognitionException {
		ParenthesizedExpressionContext _localctx = new ParenthesizedExpressionContext(_ctx, getState());
		enterRule(_localctx, 56, RULE_parenthesizedExpression);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(386);
			match(OPAR);
			setState(387);
			expression();
			setState(388);
			match(CPAR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class LambdaExpressionContext extends ParserRuleContext {
		public TerminalNode ARROW() { return getToken(bicepParser.ARROW, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public TerminalNode OPAR() { return getToken(bicepParser.OPAR, 0); }
		public TerminalNode CPAR() { return getToken(bicepParser.CPAR, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ArgumentListContext argumentList() {
			return getRuleContext(ArgumentListContext.class,0);
		}
		public LambdaExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_lambdaExpression; }
	}

	public final LambdaExpressionContext lambdaExpression() throws RecognitionException {
		LambdaExpressionContext _localctx = new LambdaExpressionContext(_ctx, getState());
		enterRule(_localctx, 58, RULE_lambdaExpression);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(396);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case OPAR:
				{
				setState(390);
				match(OPAR);
				setState(392);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & -412291088080L) != 0)) {
					{
					setState(391);
					argumentList();
					}
				}

				setState(394);
				match(CPAR);
				}
				break;
			case IMPORT:
			case WITH:
			case AS:
			case METADATA:
			case PARAM:
			case RESOURCE:
			case MODULE:
			case OUTPUT:
			case EXISTING:
			case TYPE:
			case VAR:
			case IF:
			case FOR:
			case IN:
			case TRUE:
			case FALSE:
			case NULL:
			case TARGET_SCOPE:
			case STRING:
			case INT:
			case BOOL:
			case ARRAY:
			case OBJECT:
			case IDENTIFIER:
				{
				setState(395);
				identifier();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(398);
			match(ARROW);
			setState(399);
			expression();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class IfConditionContext extends ParserRuleContext {
		public TerminalNode IF() { return getToken(bicepParser.IF, 0); }
		public ParenthesizedExpressionContext parenthesizedExpression() {
			return getRuleContext(ParenthesizedExpressionContext.class,0);
		}
		public ObjectContext object() {
			return getRuleContext(ObjectContext.class,0);
		}
		public IfConditionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_ifCondition; }
	}

	public final IfConditionContext ifCondition() throws RecognitionException {
		IfConditionContext _localctx = new IfConditionContext(_ctx, getState());
		enterRule(_localctx, 60, RULE_ifCondition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(401);
			match(IF);
			setState(402);
			parenthesizedExpression();
			setState(403);
			object();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ForExpressionContext extends ParserRuleContext {
		public IdentifierContext item;
		public TerminalNode OBRACK() { return getToken(bicepParser.OBRACK, 0); }
		public TerminalNode FOR() { return getToken(bicepParser.FOR, 0); }
		public TerminalNode IN() { return getToken(bicepParser.IN, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public TerminalNode COL() { return getToken(bicepParser.COL, 0); }
		public ForBodyContext forBody() {
			return getRuleContext(ForBodyContext.class,0);
		}
		public TerminalNode CBRACK() { return getToken(bicepParser.CBRACK, 0); }
		public ForVariableBlockContext forVariableBlock() {
			return getRuleContext(ForVariableBlockContext.class,0);
		}
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ForExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_forExpression; }
	}

	public final ForExpressionContext forExpression() throws RecognitionException {
		ForExpressionContext _localctx = new ForExpressionContext(_ctx, getState());
		enterRule(_localctx, 62, RULE_forExpression);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(405);
			match(OBRACK);
			setState(406);
			match(FOR);
			setState(409);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IMPORT:
			case WITH:
			case AS:
			case METADATA:
			case PARAM:
			case RESOURCE:
			case MODULE:
			case OUTPUT:
			case EXISTING:
			case TYPE:
			case VAR:
			case IF:
			case FOR:
			case IN:
			case TRUE:
			case FALSE:
			case NULL:
			case TARGET_SCOPE:
			case STRING:
			case INT:
			case BOOL:
			case ARRAY:
			case OBJECT:
			case IDENTIFIER:
				{
				setState(407);
				((ForExpressionContext)_localctx).item = identifier();
				}
				break;
			case OPAR:
				{
				setState(408);
				forVariableBlock();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(411);
			match(IN);
			setState(412);
			expression();
			setState(413);
			match(COL);
			setState(414);
			forBody();
			setState(415);
			match(CBRACK);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ForVariableBlockContext extends ParserRuleContext {
		public IdentifierContext item;
		public IdentifierContext index;
		public TerminalNode OPAR() { return getToken(bicepParser.OPAR, 0); }
		public TerminalNode COMMA() { return getToken(bicepParser.COMMA, 0); }
		public TerminalNode CPAR() { return getToken(bicepParser.CPAR, 0); }
		public List<IdentifierContext> identifier() {
			return getRuleContexts(IdentifierContext.class);
		}
		public IdentifierContext identifier(int i) {
			return getRuleContext(IdentifierContext.class,i);
		}
		public ForVariableBlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_forVariableBlock; }
	}

	public final ForVariableBlockContext forVariableBlock() throws RecognitionException {
		ForVariableBlockContext _localctx = new ForVariableBlockContext(_ctx, getState());
		enterRule(_localctx, 64, RULE_forVariableBlock);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(417);
			match(OPAR);
			setState(418);
			((ForVariableBlockContext)_localctx).item = identifier();
			setState(419);
			match(COMMA);
			setState(420);
			((ForVariableBlockContext)_localctx).index = identifier();
			setState(421);
			match(CPAR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ForBodyContext extends ParserRuleContext {
		public ExpressionContext body;
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public IfConditionContext ifCondition() {
			return getRuleContext(IfConditionContext.class,0);
		}
		public ForBodyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_forBody; }
	}

	public final ForBodyContext forBody() throws RecognitionException {
		ForBodyContext _localctx = new ForBodyContext(_ctx, getState());
		enterRule(_localctx, 66, RULE_forBody);
		try {
			setState(425);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,34,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(423);
				((ForBodyContext)_localctx).body = expression();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(424);
				ifCondition();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class InterpStringContext extends ParserRuleContext {
		public TerminalNode STRING_LEFT_PIECE() { return getToken(bicepParser.STRING_LEFT_PIECE, 0); }
		public List<ExpressionContext> expression() {
			return getRuleContexts(ExpressionContext.class);
		}
		public ExpressionContext expression(int i) {
			return getRuleContext(ExpressionContext.class,i);
		}
		public TerminalNode STRING_RIGHT_PIECE() { return getToken(bicepParser.STRING_RIGHT_PIECE, 0); }
		public List<TerminalNode> STRING_MIDDLE_PIECE() { return getTokens(bicepParser.STRING_MIDDLE_PIECE); }
		public TerminalNode STRING_MIDDLE_PIECE(int i) {
			return getToken(bicepParser.STRING_MIDDLE_PIECE, i);
		}
		public TerminalNode STRING_COMPLETE() { return getToken(bicepParser.STRING_COMPLETE, 0); }
		public InterpStringContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_interpString; }
	}

	public final InterpStringContext interpString() throws RecognitionException {
		InterpStringContext _localctx = new InterpStringContext(_ctx, getState());
		enterRule(_localctx, 68, RULE_interpString);
		try {
			int _alt;
			setState(440);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case STRING_LEFT_PIECE:
				enterOuterAlt(_localctx, 1);
				{
				setState(427);
				match(STRING_LEFT_PIECE);
				setState(433);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,35,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(428);
						expression();
						setState(429);
						match(STRING_MIDDLE_PIECE);
						}
						} 
					}
					setState(435);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,35,_ctx);
				}
				setState(436);
				expression();
				setState(437);
				match(STRING_RIGHT_PIECE);
				}
				break;
			case STRING_COMPLETE:
				enterOuterAlt(_localctx, 2);
				{
				setState(439);
				match(STRING_COMPLETE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class LiteralValueContext extends ParserRuleContext {
		public TerminalNode NUMBER() { return getToken(bicepParser.NUMBER, 0); }
		public TerminalNode TRUE() { return getToken(bicepParser.TRUE, 0); }
		public TerminalNode FALSE() { return getToken(bicepParser.FALSE, 0); }
		public TerminalNode NULL() { return getToken(bicepParser.NULL, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public LiteralValueContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_literalValue; }
	}

	public final LiteralValueContext literalValue() throws RecognitionException {
		LiteralValueContext _localctx = new LiteralValueContext(_ctx, getState());
		enterRule(_localctx, 70, RULE_literalValue);
		try {
			setState(447);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,37,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(442);
				match(NUMBER);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(443);
				match(TRUE);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(444);
				match(FALSE);
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(445);
				match(NULL);
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(446);
				identifier();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ObjectContext extends ParserRuleContext {
		public TerminalNode OBRACE() { return getToken(bicepParser.OBRACE, 0); }
		public TerminalNode CBRACE() { return getToken(bicepParser.CBRACE, 0); }
		public List<TerminalNode> NL() { return getTokens(bicepParser.NL); }
		public TerminalNode NL(int i) {
			return getToken(bicepParser.NL, i);
		}
		public List<ObjectPropertyContext> objectProperty() {
			return getRuleContexts(ObjectPropertyContext.class);
		}
		public ObjectPropertyContext objectProperty(int i) {
			return getRuleContext(ObjectPropertyContext.class,i);
		}
		public ObjectContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_object; }
	}

	public final ObjectContext object() throws RecognitionException {
		ObjectContext _localctx = new ObjectContext(_ctx, getState());
		enterRule(_localctx, 72, RULE_object);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(449);
			match(OBRACE);
			setState(466);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NL) {
				{
				setState(451); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(450);
					match(NL);
					}
					}
					setState(453); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NL );
				setState(463);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while ((((_la) & ~0x3f) == 0 && ((1L << _la) & 9223371487098962208L) != 0)) {
					{
					{
					setState(455);
					objectProperty();
					setState(457); 
					_errHandler.sync(this);
					_la = _input.LA(1);
					do {
						{
						{
						setState(456);
						match(NL);
						}
						}
						setState(459); 
						_errHandler.sync(this);
						_la = _input.LA(1);
					} while ( _la==NL );
					}
					}
					setState(465);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
			}

			setState(468);
			match(CBRACE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ObjectPropertyContext extends ParserRuleContext {
		public IdentifierContext name;
		public TerminalNode COL() { return getToken(bicepParser.COL, 0); }
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public InterpStringContext interpString() {
			return getRuleContext(InterpStringContext.class,0);
		}
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ObjectPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_objectProperty; }
	}

	public final ObjectPropertyContext objectProperty() throws RecognitionException {
		ObjectPropertyContext _localctx = new ObjectPropertyContext(_ctx, getState());
		enterRule(_localctx, 74, RULE_objectProperty);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(472);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IMPORT:
			case WITH:
			case AS:
			case METADATA:
			case PARAM:
			case RESOURCE:
			case MODULE:
			case OUTPUT:
			case EXISTING:
			case TYPE:
			case VAR:
			case IF:
			case FOR:
			case IN:
			case TRUE:
			case FALSE:
			case NULL:
			case TARGET_SCOPE:
			case STRING:
			case INT:
			case BOOL:
			case ARRAY:
			case OBJECT:
			case IDENTIFIER:
				{
				setState(470);
				((ObjectPropertyContext)_localctx).name = identifier();
				}
				break;
			case STRING_LEFT_PIECE:
			case STRING_COMPLETE:
				{
				setState(471);
				interpString();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(474);
			match(COL);
			setState(475);
			expression();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ArrayContext extends ParserRuleContext {
		public TerminalNode OBRACK() { return getToken(bicepParser.OBRACK, 0); }
		public TerminalNode CBRACK() { return getToken(bicepParser.CBRACK, 0); }
		public List<TerminalNode> NL() { return getTokens(bicepParser.NL); }
		public TerminalNode NL(int i) {
			return getToken(bicepParser.NL, i);
		}
		public List<ArrayItemContext> arrayItem() {
			return getRuleContexts(ArrayItemContext.class);
		}
		public ArrayItemContext arrayItem(int i) {
			return getRuleContext(ArrayItemContext.class,i);
		}
		public ArrayContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_array; }
	}

	public final ArrayContext array() throws RecognitionException {
		ArrayContext _localctx = new ArrayContext(_ctx, getState());
		enterRule(_localctx, 76, RULE_array);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(477);
			match(OBRACK);
			setState(489);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NL) {
				{
				setState(479); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(478);
					match(NL);
					}
					}
					setState(481); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NL );
				setState(486);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while ((((_la) & ~0x3f) == 0 && ((1L << _la) & -412291088080L) != 0)) {
					{
					{
					setState(483);
					arrayItem();
					}
					}
					setState(488);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
			}

			setState(491);
			match(CBRACK);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ArrayItemContext extends ParserRuleContext {
		public ExpressionContext expression() {
			return getRuleContext(ExpressionContext.class,0);
		}
		public List<TerminalNode> NL() { return getTokens(bicepParser.NL); }
		public TerminalNode NL(int i) {
			return getToken(bicepParser.NL, i);
		}
		public ArrayItemContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_arrayItem; }
	}

	public final ArrayItemContext arrayItem() throws RecognitionException {
		ArrayItemContext _localctx = new ArrayItemContext(_ctx, getState());
		enterRule(_localctx, 78, RULE_arrayItem);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(493);
			expression();
			setState(495); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(494);
				match(NL);
				}
				}
				setState(497); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NL );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TypeExpressionContext extends ParserRuleContext {
		public List<SingularTypeExpressionContext> singularTypeExpression() {
			return getRuleContexts(SingularTypeExpressionContext.class);
		}
		public SingularTypeExpressionContext singularTypeExpression(int i) {
			return getRuleContext(SingularTypeExpressionContext.class,i);
		}
		public List<TerminalNode> PIPE() { return getTokens(bicepParser.PIPE); }
		public TerminalNode PIPE(int i) {
			return getToken(bicepParser.PIPE, i);
		}
		public TypeExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_typeExpression; }
	}

	public final TypeExpressionContext typeExpression() throws RecognitionException {
		TypeExpressionContext _localctx = new TypeExpressionContext(_ctx, getState());
		enterRule(_localctx, 80, RULE_typeExpression);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(499);
			singularTypeExpression(0);
			setState(504);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==PIPE) {
				{
				{
				setState(500);
				match(PIPE);
				setState(501);
				singularTypeExpression(0);
				}
				}
				setState(506);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SingularTypeExpressionContext extends ParserRuleContext {
		public PrimaryTypeExpressionContext primaryTypeExpression() {
			return getRuleContext(PrimaryTypeExpressionContext.class,0);
		}
		public ParenthesizedTypeExpressionContext parenthesizedTypeExpression() {
			return getRuleContext(ParenthesizedTypeExpressionContext.class,0);
		}
		public SingularTypeExpressionContext singularTypeExpression() {
			return getRuleContext(SingularTypeExpressionContext.class,0);
		}
		public TerminalNode OBRACK() { return getToken(bicepParser.OBRACK, 0); }
		public TerminalNode CBRACK() { return getToken(bicepParser.CBRACK, 0); }
		public SingularTypeExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_singularTypeExpression; }
	}

	public final SingularTypeExpressionContext singularTypeExpression() throws RecognitionException {
		return singularTypeExpression(0);
	}

	private SingularTypeExpressionContext singularTypeExpression(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		SingularTypeExpressionContext _localctx = new SingularTypeExpressionContext(_ctx, _parentState);
		SingularTypeExpressionContext _prevctx = _localctx;
		int _startState = 82;
		enterRecursionRule(_localctx, 82, RULE_singularTypeExpression, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(510);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case MULTILINE_STRING:
			case STRING_COMPLETE:
			case OBRACK:
			case NOT:
			case ADD:
			case MIN:
			case OBRACE:
			case IMPORT:
			case WITH:
			case AS:
			case METADATA:
			case PARAM:
			case RESOURCE:
			case MODULE:
			case OUTPUT:
			case EXISTING:
			case TYPE:
			case VAR:
			case IF:
			case FOR:
			case IN:
			case TRUE:
			case FALSE:
			case NULL:
			case TARGET_SCOPE:
			case STRING:
			case INT:
			case BOOL:
			case ARRAY:
			case OBJECT:
			case IDENTIFIER:
			case NUMBER:
				{
				setState(508);
				primaryTypeExpression();
				}
				break;
			case OPAR:
				{
				setState(509);
				parenthesizedTypeExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			_ctx.stop = _input.LT(-1);
			setState(517);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,49,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					{
					_localctx = new SingularTypeExpressionContext(_parentctx, _parentState);
					pushNewRecursionContext(_localctx, _startState, RULE_singularTypeExpression);
					setState(512);
					if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
					setState(513);
					match(OBRACK);
					setState(514);
					match(CBRACK);
					}
					} 
				}
				setState(519);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,49,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PrimaryTypeExpressionContext extends ParserRuleContext {
		public IdentifierContext type;
		public AmbientTypeReferenceContext ambientTypeReference() {
			return getRuleContext(AmbientTypeReferenceContext.class,0);
		}
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public LiteralValueContext literalValue() {
			return getRuleContext(LiteralValueContext.class,0);
		}
		public UnaryOperatorContext unaryOperator() {
			return getRuleContext(UnaryOperatorContext.class,0);
		}
		public TerminalNode STRING_COMPLETE() { return getToken(bicepParser.STRING_COMPLETE, 0); }
		public TerminalNode MULTILINE_STRING() { return getToken(bicepParser.MULTILINE_STRING, 0); }
		public ObjectTypeContext objectType() {
			return getRuleContext(ObjectTypeContext.class,0);
		}
		public TupleTypeContext tupleType() {
			return getRuleContext(TupleTypeContext.class,0);
		}
		public PrimaryTypeExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_primaryTypeExpression; }
	}

	public final PrimaryTypeExpressionContext primaryTypeExpression() throws RecognitionException {
		PrimaryTypeExpressionContext _localctx = new PrimaryTypeExpressionContext(_ctx, getState());
		enterRule(_localctx, 84, RULE_primaryTypeExpression);
		int _la;
		try {
			setState(530);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,51,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(520);
				ambientTypeReference();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(521);
				((PrimaryTypeExpressionContext)_localctx).type = identifier();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(523);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & 25690112L) != 0)) {
					{
					setState(522);
					unaryOperator();
					}
				}

				setState(525);
				literalValue();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(526);
				match(STRING_COMPLETE);
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(527);
				match(MULTILINE_STRING);
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(528);
				objectType();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(529);
				tupleType();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class AmbientTypeReferenceContext extends ParserRuleContext {
		public TerminalNode STRING() { return getToken(bicepParser.STRING, 0); }
		public TerminalNode INT() { return getToken(bicepParser.INT, 0); }
		public TerminalNode ARRAY() { return getToken(bicepParser.ARRAY, 0); }
		public TerminalNode OBJECT() { return getToken(bicepParser.OBJECT, 0); }
		public AmbientTypeReferenceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_ambientTypeReference; }
	}

	public final AmbientTypeReferenceContext ambientTypeReference() throws RecognitionException {
		AmbientTypeReferenceContext _localctx = new AmbientTypeReferenceContext(_ctx, getState());
		enterRule(_localctx, 86, RULE_ambientTypeReference);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(532);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 3891110078048108544L) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ObjectTypeContext extends ParserRuleContext {
		public TerminalNode OBRACE() { return getToken(bicepParser.OBRACE, 0); }
		public TerminalNode CBRACE() { return getToken(bicepParser.CBRACE, 0); }
		public List<TerminalNode> NL() { return getTokens(bicepParser.NL); }
		public TerminalNode NL(int i) {
			return getToken(bicepParser.NL, i);
		}
		public List<ObjectTypePropertyContext> objectTypeProperty() {
			return getRuleContexts(ObjectTypePropertyContext.class);
		}
		public ObjectTypePropertyContext objectTypeProperty(int i) {
			return getRuleContext(ObjectTypePropertyContext.class,i);
		}
		public List<ObjectTypeAdditionalPropertiesMatcherContext> objectTypeAdditionalPropertiesMatcher() {
			return getRuleContexts(ObjectTypeAdditionalPropertiesMatcherContext.class);
		}
		public ObjectTypeAdditionalPropertiesMatcherContext objectTypeAdditionalPropertiesMatcher(int i) {
			return getRuleContext(ObjectTypeAdditionalPropertiesMatcherContext.class,i);
		}
		public ObjectTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_objectType; }
	}

	public final ObjectTypeContext objectType() throws RecognitionException {
		ObjectTypeContext _localctx = new ObjectTypeContext(_ctx, getState());
		enterRule(_localctx, 88, RULE_objectType);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(534);
			match(OBRACE);
			setState(554);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NL) {
				{
				setState(536); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(535);
					match(NL);
					}
					}
					setState(538); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NL );
				setState(551);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while ((((_la) & ~0x3f) == 0 && ((1L << _la) & 9223371487098971408L) != 0)) {
					{
					{
					setState(542);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,53,_ctx) ) {
					case 1:
						{
						setState(540);
						objectTypeProperty();
						}
						break;
					case 2:
						{
						setState(541);
						objectTypeAdditionalPropertiesMatcher();
						}
						break;
					}
					setState(545); 
					_errHandler.sync(this);
					_la = _input.LA(1);
					do {
						{
						{
						setState(544);
						match(NL);
						}
						}
						setState(547); 
						_errHandler.sync(this);
						_la = _input.LA(1);
					} while ( _la==NL );
					}
					}
					setState(553);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
			}

			setState(556);
			match(CBRACE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ObjectTypePropertyContext extends ParserRuleContext {
		public IdentifierContext name;
		public TerminalNode COL() { return getToken(bicepParser.COL, 0); }
		public TypeExpressionContext typeExpression() {
			return getRuleContext(TypeExpressionContext.class,0);
		}
		public TerminalNode STRING_COMPLETE() { return getToken(bicepParser.STRING_COMPLETE, 0); }
		public TerminalNode MULTILINE_STRING() { return getToken(bicepParser.MULTILINE_STRING, 0); }
		public List<DecoratorContext> decorator() {
			return getRuleContexts(DecoratorContext.class);
		}
		public DecoratorContext decorator(int i) {
			return getRuleContext(DecoratorContext.class,i);
		}
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ObjectTypePropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_objectTypeProperty; }
	}

	public final ObjectTypePropertyContext objectTypeProperty() throws RecognitionException {
		ObjectTypePropertyContext _localctx = new ObjectTypePropertyContext(_ctx, getState());
		enterRule(_localctx, 90, RULE_objectTypeProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(561);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==AT) {
				{
				{
				setState(558);
				decorator();
				}
				}
				setState(563);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(567);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IMPORT:
			case WITH:
			case AS:
			case METADATA:
			case PARAM:
			case RESOURCE:
			case MODULE:
			case OUTPUT:
			case EXISTING:
			case TYPE:
			case VAR:
			case IF:
			case FOR:
			case IN:
			case TRUE:
			case FALSE:
			case NULL:
			case TARGET_SCOPE:
			case STRING:
			case INT:
			case BOOL:
			case ARRAY:
			case OBJECT:
			case IDENTIFIER:
				{
				setState(564);
				((ObjectTypePropertyContext)_localctx).name = identifier();
				}
				break;
			case STRING_COMPLETE:
				{
				setState(565);
				match(STRING_COMPLETE);
				}
				break;
			case MULTILINE_STRING:
				{
				setState(566);
				match(MULTILINE_STRING);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(569);
			match(COL);
			setState(570);
			typeExpression();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ObjectTypeAdditionalPropertiesMatcherContext extends ParserRuleContext {
		public TerminalNode STAR_COL() { return getToken(bicepParser.STAR_COL, 0); }
		public TypeExpressionContext typeExpression() {
			return getRuleContext(TypeExpressionContext.class,0);
		}
		public List<DecoratorContext> decorator() {
			return getRuleContexts(DecoratorContext.class);
		}
		public DecoratorContext decorator(int i) {
			return getRuleContext(DecoratorContext.class,i);
		}
		public ObjectTypeAdditionalPropertiesMatcherContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_objectTypeAdditionalPropertiesMatcher; }
	}

	public final ObjectTypeAdditionalPropertiesMatcherContext objectTypeAdditionalPropertiesMatcher() throws RecognitionException {
		ObjectTypeAdditionalPropertiesMatcherContext _localctx = new ObjectTypeAdditionalPropertiesMatcherContext(_ctx, getState());
		enterRule(_localctx, 92, RULE_objectTypeAdditionalPropertiesMatcher);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(575);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==AT) {
				{
				{
				setState(572);
				decorator();
				}
				}
				setState(577);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(578);
			match(STAR_COL);
			setState(579);
			typeExpression();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TupleTypeContext extends ParserRuleContext {
		public TerminalNode OBRACK() { return getToken(bicepParser.OBRACK, 0); }
		public TerminalNode CBRACK() { return getToken(bicepParser.CBRACK, 0); }
		public List<TerminalNode> NL() { return getTokens(bicepParser.NL); }
		public TerminalNode NL(int i) {
			return getToken(bicepParser.NL, i);
		}
		public List<TupleItemContext> tupleItem() {
			return getRuleContexts(TupleItemContext.class);
		}
		public TupleItemContext tupleItem(int i) {
			return getRuleContext(TupleItemContext.class,i);
		}
		public TupleTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_tupleType; }
	}

	public final TupleTypeContext tupleType() throws RecognitionException {
		TupleTypeContext _localctx = new TupleTypeContext(_ctx, getState());
		enterRule(_localctx, 94, RULE_tupleType);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(581);
			match(OBRACK);
			setState(593);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NL) {
				{
				setState(583); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(582);
					match(NL);
					}
					}
					setState(585); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==NL );
				setState(590);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while ((((_la) & ~0x3f) == 0 && ((1L << _la) & -412291087088L) != 0)) {
					{
					{
					setState(587);
					tupleItem();
					}
					}
					setState(592);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
			}

			setState(595);
			match(CBRACK);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TupleItemContext extends ParserRuleContext {
		public TypeExpressionContext typeExpression() {
			return getRuleContext(TypeExpressionContext.class,0);
		}
		public List<DecoratorContext> decorator() {
			return getRuleContexts(DecoratorContext.class);
		}
		public DecoratorContext decorator(int i) {
			return getRuleContext(DecoratorContext.class,i);
		}
		public List<TerminalNode> NL() { return getTokens(bicepParser.NL); }
		public TerminalNode NL(int i) {
			return getToken(bicepParser.NL, i);
		}
		public TupleItemContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_tupleItem; }
	}

	public final TupleItemContext tupleItem() throws RecognitionException {
		TupleItemContext _localctx = new TupleItemContext(_ctx, getState());
		enterRule(_localctx, 96, RULE_tupleItem);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(600);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==AT) {
				{
				{
				setState(597);
				decorator();
				}
				}
				setState(602);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(603);
			typeExpression();
			setState(605); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(604);
				match(NL);
				}
				}
				setState(607); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==NL );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ParenthesizedTypeExpressionContext extends ParserRuleContext {
		public TerminalNode OPAR() { return getToken(bicepParser.OPAR, 0); }
		public TypeExpressionContext typeExpression() {
			return getRuleContext(TypeExpressionContext.class,0);
		}
		public TerminalNode CPAR() { return getToken(bicepParser.CPAR, 0); }
		public ParenthesizedTypeExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_parenthesizedTypeExpression; }
	}

	public final ParenthesizedTypeExpressionContext parenthesizedTypeExpression() throws RecognitionException {
		ParenthesizedTypeExpressionContext _localctx = new ParenthesizedTypeExpressionContext(_ctx, getState());
		enterRule(_localctx, 98, RULE_parenthesizedTypeExpression);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(609);
			match(OPAR);
			setState(610);
			typeExpression();
			setState(611);
			match(CPAR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class IdentifierContext extends ParserRuleContext {
		public TerminalNode IDENTIFIER() { return getToken(bicepParser.IDENTIFIER, 0); }
		public TerminalNode IMPORT() { return getToken(bicepParser.IMPORT, 0); }
		public TerminalNode WITH() { return getToken(bicepParser.WITH, 0); }
		public TerminalNode AS() { return getToken(bicepParser.AS, 0); }
		public TerminalNode METADATA() { return getToken(bicepParser.METADATA, 0); }
		public TerminalNode PARAM() { return getToken(bicepParser.PARAM, 0); }
		public TerminalNode RESOURCE() { return getToken(bicepParser.RESOURCE, 0); }
		public TerminalNode MODULE() { return getToken(bicepParser.MODULE, 0); }
		public TerminalNode OUTPUT() { return getToken(bicepParser.OUTPUT, 0); }
		public TerminalNode EXISTING() { return getToken(bicepParser.EXISTING, 0); }
		public TerminalNode TYPE() { return getToken(bicepParser.TYPE, 0); }
		public TerminalNode VAR() { return getToken(bicepParser.VAR, 0); }
		public TerminalNode IF() { return getToken(bicepParser.IF, 0); }
		public TerminalNode FOR() { return getToken(bicepParser.FOR, 0); }
		public TerminalNode IN() { return getToken(bicepParser.IN, 0); }
		public TerminalNode TRUE() { return getToken(bicepParser.TRUE, 0); }
		public TerminalNode FALSE() { return getToken(bicepParser.FALSE, 0); }
		public TerminalNode NULL() { return getToken(bicepParser.NULL, 0); }
		public TerminalNode TARGET_SCOPE() { return getToken(bicepParser.TARGET_SCOPE, 0); }
		public TerminalNode STRING() { return getToken(bicepParser.STRING, 0); }
		public TerminalNode INT() { return getToken(bicepParser.INT, 0); }
		public TerminalNode BOOL() { return getToken(bicepParser.BOOL, 0); }
		public TerminalNode ARRAY() { return getToken(bicepParser.ARRAY, 0); }
		public TerminalNode OBJECT() { return getToken(bicepParser.OBJECT, 0); }
		public IdentifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_identifier; }
	}

	public final IdentifierContext identifier() throws RecognitionException {
		IdentifierContext _localctx = new IdentifierContext(_ctx, getState());
		enterRule(_localctx, 100, RULE_identifier);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(613);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 9223371487098961920L) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 16:
			return binaryExpression_sempred((BinaryExpressionContext)_localctx, predIndex);
		case 17:
			return equalityExpression_sempred((EqualityExpressionContext)_localctx, predIndex);
		case 18:
			return relationalExpression_sempred((RelationalExpressionContext)_localctx, predIndex);
		case 19:
			return additiveExpression_sempred((AdditiveExpressionContext)_localctx, predIndex);
		case 20:
			return multiplicativeExpression_sempred((MultiplicativeExpressionContext)_localctx, predIndex);
		case 23:
			return memberExpression_sempred((MemberExpressionContext)_localctx, predIndex);
		case 41:
			return singularTypeExpression_sempred((SingularTypeExpressionContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean binaryExpression_sempred(BinaryExpressionContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return precpred(_ctx, 2);
		}
		return true;
	}
	private boolean equalityExpression_sempred(EqualityExpressionContext _localctx, int predIndex) {
		switch (predIndex) {
		case 1:
			return precpred(_ctx, 2);
		}
		return true;
	}
	private boolean relationalExpression_sempred(RelationalExpressionContext _localctx, int predIndex) {
		switch (predIndex) {
		case 2:
			return precpred(_ctx, 2);
		}
		return true;
	}
	private boolean additiveExpression_sempred(AdditiveExpressionContext _localctx, int predIndex) {
		switch (predIndex) {
		case 3:
			return precpred(_ctx, 2);
		}
		return true;
	}
	private boolean multiplicativeExpression_sempred(MultiplicativeExpressionContext _localctx, int predIndex) {
		switch (predIndex) {
		case 4:
			return precpred(_ctx, 2);
		}
		return true;
	}
	private boolean memberExpression_sempred(MemberExpressionContext _localctx, int predIndex) {
		switch (predIndex) {
		case 5:
			return precpred(_ctx, 5);
		case 6:
			return precpred(_ctx, 4);
		case 7:
			return precpred(_ctx, 3);
		case 8:
			return precpred(_ctx, 2);
		}
		return true;
	}
	private boolean singularTypeExpression_sempred(SingularTypeExpressionContext _localctx, int predIndex) {
		switch (predIndex) {
		case 9:
			return precpred(_ctx, 2);
		}
		return true;
	}

	public static final String _serializedATN =
		"\u0004\u0001B\u0268\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004\u0007\u0004\u0002"+
		"\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007\u0007\u0007\u0002"+
		"\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002\u000b\u0007\u000b\u0002"+
		"\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e\u0002\u000f\u0007\u000f"+
		"\u0002\u0010\u0007\u0010\u0002\u0011\u0007\u0011\u0002\u0012\u0007\u0012"+
		"\u0002\u0013\u0007\u0013\u0002\u0014\u0007\u0014\u0002\u0015\u0007\u0015"+
		"\u0002\u0016\u0007\u0016\u0002\u0017\u0007\u0017\u0002\u0018\u0007\u0018"+
		"\u0002\u0019\u0007\u0019\u0002\u001a\u0007\u001a\u0002\u001b\u0007\u001b"+
		"\u0002\u001c\u0007\u001c\u0002\u001d\u0007\u001d\u0002\u001e\u0007\u001e"+
		"\u0002\u001f\u0007\u001f\u0002 \u0007 \u0002!\u0007!\u0002\"\u0007\"\u0002"+
		"#\u0007#\u0002$\u0007$\u0002%\u0007%\u0002&\u0007&\u0002\'\u0007\'\u0002"+
		"(\u0007(\u0002)\u0007)\u0002*\u0007*\u0002+\u0007+\u0002,\u0007,\u0002"+
		"-\u0007-\u0002.\u0007.\u0002/\u0007/\u00020\u00070\u00021\u00071\u0002"+
		"2\u00072\u0001\u0000\u0005\u0000h\b\u0000\n\u0000\f\u0000k\t\u0000\u0001"+
		"\u0000\u0001\u0000\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0003"+
		"\u0001y\b\u0001\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001"+
		"\u0003\u0005\u0003\u0080\b\u0003\n\u0003\f\u0003\u0083\t\u0003\u0001\u0003"+
		"\u0001\u0003\u0001\u0003\u0003\u0003\u0088\b\u0003\u0001\u0003\u0003\u0003"+
		"\u008b\b\u0003\u0001\u0003\u0001\u0003\u0001\u0004\u0001\u0004\u0001\u0004"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0007\u0005\u0007\u009c\b\u0007"+
		"\n\u0007\f\u0007\u009f\t\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001"+
		"\u0007\u0003\u0007\u00a5\b\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0003"+
		"\u0007\u00aa\b\u0007\u0003\u0007\u00ac\b\u0007\u0001\u0007\u0001\u0007"+
		"\u0001\b\u0001\b\u0001\b\u0001\t\u0005\t\u00b4\b\t\n\t\f\t\u00b7\t\t\u0001"+
		"\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001\n\u0005\n\u00c0\b\n\n"+
		"\n\f\n\u00c3\t\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001"+
		"\u000b\u0005\u000b\u00cc\b\u000b\n\u000b\f\u000b\u00cf\t\u000b\u0001\u000b"+
		"\u0001\u000b\u0001\u000b\u0001\u000b\u0003\u000b\u00d5\b\u000b\u0001\u000b"+
		"\u0001\u000b\u0001\u000b\u0001\u000b\u0003\u000b\u00db\b\u000b\u0001\u000b"+
		"\u0001\u000b\u0001\f\u0005\f\u00e0\b\f\n\f\f\f\u00e3\t\f\u0001\f\u0001"+
		"\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0003\f\u00ec\b\f\u0001\f\u0001"+
		"\f\u0001\r\u0005\r\u00f1\b\r\n\r\f\r\u00f4\t\r\u0001\r\u0001\r\u0001\r"+
		"\u0001\r\u0001\r\u0003\r\u00fb\b\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001"+
		"\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000f\u0001\u000f\u0001"+
		"\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0003\u000f\u010b\b\u000f\u0001"+
		"\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0005"+
		"\u0010\u0113\b\u0010\n\u0010\f\u0010\u0116\t\u0010\u0001\u0011\u0001\u0011"+
		"\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011\u0005\u0011\u011e\b\u0011"+
		"\n\u0011\f\u0011\u0121\t\u0011\u0001\u0012\u0001\u0012\u0001\u0012\u0001"+
		"\u0012\u0001\u0012\u0001\u0012\u0005\u0012\u0129\b\u0012\n\u0012\f\u0012"+
		"\u012c\t\u0012\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0013"+
		"\u0001\u0013\u0005\u0013\u0134\b\u0013\n\u0013\f\u0013\u0137\t\u0013\u0001"+
		"\u0014\u0001\u0014\u0001\u0014\u0001\u0014\u0001\u0014\u0001\u0014\u0005"+
		"\u0014\u013f\b\u0014\n\u0014\f\u0014\u0142\t\u0014\u0001\u0015\u0001\u0015"+
		"\u0001\u0015\u0001\u0015\u0003\u0015\u0148\b\u0015\u0001\u0016\u0001\u0016"+
		"\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017"+
		"\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017"+
		"\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0005\u0017"+
		"\u015d\b\u0017\n\u0017\f\u0017\u0160\t\u0017\u0001\u0018\u0001\u0018\u0001"+
		"\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001\u0018\u0001"+
		"\u0018\u0003\u0018\u016b\b\u0018\u0001\u0019\u0001\u0019\u0001\u0019\u0001"+
		"\u0019\u0001\u0019\u0003\u0019\u0172\b\u0019\u0001\u001a\u0001\u001a\u0001"+
		"\u001a\u0003\u001a\u0177\b\u001a\u0001\u001a\u0001\u001a\u0001\u001b\u0001"+
		"\u001b\u0001\u001b\u0005\u001b\u017e\b\u001b\n\u001b\f\u001b\u0181\t\u001b"+
		"\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001d\u0001\u001d"+
		"\u0003\u001d\u0189\b\u001d\u0001\u001d\u0001\u001d\u0003\u001d\u018d\b"+
		"\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001e\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0001\u001f\u0001\u001f\u0001\u001f\u0001\u001f\u0003"+
		"\u001f\u019a\b\u001f\u0001\u001f\u0001\u001f\u0001\u001f\u0001\u001f\u0001"+
		"\u001f\u0001\u001f\u0001 \u0001 \u0001 \u0001 \u0001 \u0001 \u0001!\u0001"+
		"!\u0003!\u01aa\b!\u0001\"\u0001\"\u0001\"\u0001\"\u0005\"\u01b0\b\"\n"+
		"\"\f\"\u01b3\t\"\u0001\"\u0001\"\u0001\"\u0001\"\u0003\"\u01b9\b\"\u0001"+
		"#\u0001#\u0001#\u0001#\u0001#\u0003#\u01c0\b#\u0001$\u0001$\u0004$\u01c4"+
		"\b$\u000b$\f$\u01c5\u0001$\u0001$\u0004$\u01ca\b$\u000b$\f$\u01cb\u0005"+
		"$\u01ce\b$\n$\f$\u01d1\t$\u0003$\u01d3\b$\u0001$\u0001$\u0001%\u0001%"+
		"\u0003%\u01d9\b%\u0001%\u0001%\u0001%\u0001&\u0001&\u0004&\u01e0\b&\u000b"+
		"&\f&\u01e1\u0001&\u0005&\u01e5\b&\n&\f&\u01e8\t&\u0003&\u01ea\b&\u0001"+
		"&\u0001&\u0001\'\u0001\'\u0004\'\u01f0\b\'\u000b\'\f\'\u01f1\u0001(\u0001"+
		"(\u0001(\u0005(\u01f7\b(\n(\f(\u01fa\t(\u0001)\u0001)\u0001)\u0003)\u01ff"+
		"\b)\u0001)\u0001)\u0001)\u0005)\u0204\b)\n)\f)\u0207\t)\u0001*\u0001*"+
		"\u0001*\u0003*\u020c\b*\u0001*\u0001*\u0001*\u0001*\u0001*\u0003*\u0213"+
		"\b*\u0001+\u0001+\u0001,\u0001,\u0004,\u0219\b,\u000b,\f,\u021a\u0001"+
		",\u0001,\u0003,\u021f\b,\u0001,\u0004,\u0222\b,\u000b,\f,\u0223\u0005"+
		",\u0226\b,\n,\f,\u0229\t,\u0003,\u022b\b,\u0001,\u0001,\u0001-\u0005-"+
		"\u0230\b-\n-\f-\u0233\t-\u0001-\u0001-\u0001-\u0003-\u0238\b-\u0001-\u0001"+
		"-\u0001-\u0001.\u0005.\u023e\b.\n.\f.\u0241\t.\u0001.\u0001.\u0001.\u0001"+
		"/\u0001/\u0004/\u0248\b/\u000b/\f/\u0249\u0001/\u0005/\u024d\b/\n/\f/"+
		"\u0250\t/\u0003/\u0252\b/\u0001/\u0001/\u00010\u00050\u0257\b0\n0\f0\u025a"+
		"\t0\u00010\u00010\u00040\u025e\b0\u000b0\f0\u025f\u00011\u00011\u0001"+
		"1\u00011\u00012\u00012\u00012\u0000\u0007 \"$&(.R3\u0000\u0002\u0004\u0006"+
		"\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u001c\u001e \"$&(*,."+
		"02468:<>@BDFHJLNPRTVXZ\\^`bd\u0000\b\u0001\u0000\u001f!\u0001\u0000\u001d"+
		"\u001e\u0001\u0000\u0019\u001c\u0001\u0000\u0017\u0018\u0001\u0000\u0014"+
		"\u0016\u0002\u0000\u0013\u0013\u0017\u0018\u0002\u00009:<=\u0001\u0000"+
		"\'>\u0291\u0000i\u0001\u0000\u0000\u0000\u0002x\u0001\u0000\u0000\u0000"+
		"\u0004z\u0001\u0000\u0000\u0000\u0006\u0081\u0001\u0000\u0000\u0000\b"+
		"\u008e\u0001\u0000\u0000\u0000\n\u0091\u0001\u0000\u0000\u0000\f\u0094"+
		"\u0001\u0000\u0000\u0000\u000e\u009d\u0001\u0000\u0000\u0000\u0010\u00af"+
		"\u0001\u0000\u0000\u0000\u0012\u00b5\u0001\u0000\u0000\u0000\u0014\u00c1"+
		"\u0001\u0000\u0000\u0000\u0016\u00cd\u0001\u0000\u0000\u0000\u0018\u00e1"+
		"\u0001\u0000\u0000\u0000\u001a\u00f2\u0001\u0000\u0000\u0000\u001c\u0100"+
		"\u0001\u0000\u0000\u0000\u001e\u0104\u0001\u0000\u0000\u0000 \u010c\u0001"+
		"\u0000\u0000\u0000\"\u0117\u0001\u0000\u0000\u0000$\u0122\u0001\u0000"+
		"\u0000\u0000&\u012d\u0001\u0000\u0000\u0000(\u0138\u0001\u0000\u0000\u0000"+
		"*\u0147\u0001\u0000\u0000\u0000,\u0149\u0001\u0000\u0000\u0000.\u014b"+
		"\u0001\u0000\u0000\u00000\u016a\u0001\u0000\u0000\u00002\u0171\u0001\u0000"+
		"\u0000\u00004\u0173\u0001\u0000\u0000\u00006\u017a\u0001\u0000\u0000\u0000"+
		"8\u0182\u0001\u0000\u0000\u0000:\u018c\u0001\u0000\u0000\u0000<\u0191"+
		"\u0001\u0000\u0000\u0000>\u0195\u0001\u0000\u0000\u0000@\u01a1\u0001\u0000"+
		"\u0000\u0000B\u01a9\u0001\u0000\u0000\u0000D\u01b8\u0001\u0000\u0000\u0000"+
		"F\u01bf\u0001\u0000\u0000\u0000H\u01c1\u0001\u0000\u0000\u0000J\u01d8"+
		"\u0001\u0000\u0000\u0000L\u01dd\u0001\u0000\u0000\u0000N\u01ed\u0001\u0000"+
		"\u0000\u0000P\u01f3\u0001\u0000\u0000\u0000R\u01fe\u0001\u0000\u0000\u0000"+
		"T\u0212\u0001\u0000\u0000\u0000V\u0214\u0001\u0000\u0000\u0000X\u0216"+
		"\u0001\u0000\u0000\u0000Z\u0231\u0001\u0000\u0000\u0000\\\u023f\u0001"+
		"\u0000\u0000\u0000^\u0245\u0001\u0000\u0000\u0000`\u0258\u0001\u0000\u0000"+
		"\u0000b\u0261\u0001\u0000\u0000\u0000d\u0265\u0001\u0000\u0000\u0000f"+
		"h\u0003\u0002\u0001\u0000gf\u0001\u0000\u0000\u0000hk\u0001\u0000\u0000"+
		"\u0000ig\u0001\u0000\u0000\u0000ij\u0001\u0000\u0000\u0000jl\u0001\u0000"+
		"\u0000\u0000ki\u0001\u0000\u0000\u0000lm\u0005\u0000\u0000\u0001m\u0001"+
		"\u0001\u0000\u0000\u0000ny\u0003\u0004\u0002\u0000oy\u0003\u0006\u0003"+
		"\u0000py\u0003\f\u0006\u0000qy\u0003\u000e\u0007\u0000ry\u0003\u0012\t"+
		"\u0000sy\u0003\u0014\n\u0000ty\u0003\u0016\u000b\u0000uy\u0003\u0018\f"+
		"\u0000vy\u0003\u001a\r\u0000wy\u0005@\u0000\u0000xn\u0001\u0000\u0000"+
		"\u0000xo\u0001\u0000\u0000\u0000xp\u0001\u0000\u0000\u0000xq\u0001\u0000"+
		"\u0000\u0000xr\u0001\u0000\u0000\u0000xs\u0001\u0000\u0000\u0000xt\u0001"+
		"\u0000\u0000\u0000xu\u0001\u0000\u0000\u0000xv\u0001\u0000\u0000\u0000"+
		"xw\u0001\u0000\u0000\u0000y\u0003\u0001\u0000\u0000\u0000z{\u00058\u0000"+
		"\u0000{|\u0005$\u0000\u0000|}\u0003\u001e\u000f\u0000}\u0005\u0001\u0000"+
		"\u0000\u0000~\u0080\u0003\u001c\u000e\u0000\u007f~\u0001\u0000\u0000\u0000"+
		"\u0080\u0083\u0001\u0000\u0000\u0000\u0081\u007f\u0001\u0000\u0000\u0000"+
		"\u0081\u0082\u0001\u0000\u0000\u0000\u0082\u0084\u0001\u0000\u0000\u0000"+
		"\u0083\u0081\u0001\u0000\u0000\u0000\u0084\u0085\u0005\'\u0000\u0000\u0085"+
		"\u0087\u0003D\"\u0000\u0086\u0088\u0003\b\u0004\u0000\u0087\u0086\u0001"+
		"\u0000\u0000\u0000\u0087\u0088\u0001\u0000\u0000\u0000\u0088\u008a\u0001"+
		"\u0000\u0000\u0000\u0089\u008b\u0003\n\u0005\u0000\u008a\u0089\u0001\u0000"+
		"\u0000\u0000\u008a\u008b\u0001\u0000\u0000\u0000\u008b\u008c\u0001\u0000"+
		"\u0000\u0000\u008c\u008d\u0005@\u0000\u0000\u008d\u0007\u0001\u0000\u0000"+
		"\u0000\u008e\u008f\u0005(\u0000\u0000\u008f\u0090\u0003H$\u0000\u0090"+
		"\t\u0001\u0000\u0000\u0000\u0091\u0092\u0005)\u0000\u0000\u0092\u0093"+
		"\u0003d2\u0000\u0093\u000b\u0001\u0000\u0000\u0000\u0094\u0095\u0005*"+
		"\u0000\u0000\u0095\u0096\u0003d2\u0000\u0096\u0097\u0005$\u0000\u0000"+
		"\u0097\u0098\u0003\u001e\u000f\u0000\u0098\u0099\u0005@\u0000\u0000\u0099"+
		"\r\u0001\u0000\u0000\u0000\u009a\u009c\u0003\u001c\u000e\u0000\u009b\u009a"+
		"\u0001\u0000\u0000\u0000\u009c\u009f\u0001\u0000\u0000\u0000\u009d\u009b"+
		"\u0001\u0000\u0000\u0000\u009d\u009e\u0001\u0000\u0000\u0000\u009e\u00a0"+
		"\u0001\u0000\u0000\u0000\u009f\u009d\u0001\u0000\u0000\u0000\u00a0\u00a1"+
		"\u0005+\u0000\u0000\u00a1\u00ab\u0003d2\u0000\u00a2\u00a4\u0003P(\u0000"+
		"\u00a3\u00a5\u0003\u0010\b\u0000\u00a4\u00a3\u0001\u0000\u0000\u0000\u00a4"+
		"\u00a5\u0001\u0000\u0000\u0000\u00a5\u00ac\u0001\u0000\u0000\u0000\u00a6"+
		"\u00a7\u0005,\u0000\u0000\u00a7\u00a9\u0003D\"\u0000\u00a8\u00aa\u0003"+
		"\u0010\b\u0000\u00a9\u00a8\u0001\u0000\u0000\u0000\u00a9\u00aa\u0001\u0000"+
		"\u0000\u0000\u00aa\u00ac\u0001\u0000\u0000\u0000\u00ab\u00a2\u0001\u0000"+
		"\u0000\u0000\u00ab\u00a6\u0001\u0000\u0000\u0000\u00ac\u00ad\u0001\u0000"+
		"\u0000\u0000\u00ad\u00ae\u0005@\u0000\u0000\u00ae\u000f\u0001\u0000\u0000"+
		"\u0000\u00af\u00b0\u0005$\u0000\u0000\u00b0\u00b1\u0003\u001e\u000f\u0000"+
		"\u00b1\u0011\u0001\u0000\u0000\u0000\u00b2\u00b4\u0003\u001c\u000e\u0000"+
		"\u00b3\u00b2\u0001\u0000\u0000\u0000\u00b4\u00b7\u0001\u0000\u0000\u0000"+
		"\u00b5\u00b3\u0001\u0000\u0000\u0000\u00b5\u00b6\u0001\u0000\u0000\u0000"+
		"\u00b6\u00b8\u0001\u0000\u0000\u0000\u00b7\u00b5\u0001\u0000\u0000\u0000"+
		"\u00b8\u00b9\u00050\u0000\u0000\u00b9\u00ba\u0003d2\u0000\u00ba\u00bb"+
		"\u0005$\u0000\u0000\u00bb\u00bc\u0003P(\u0000\u00bc\u00bd\u0005@\u0000"+
		"\u0000\u00bd\u0013\u0001\u0000\u0000\u0000\u00be\u00c0\u0003\u001c\u000e"+
		"\u0000\u00bf\u00be\u0001\u0000\u0000\u0000\u00c0\u00c3\u0001\u0000\u0000"+
		"\u0000\u00c1\u00bf\u0001\u0000\u0000\u0000\u00c1\u00c2\u0001\u0000\u0000"+
		"\u0000\u00c2\u00c4\u0001\u0000\u0000\u0000\u00c3\u00c1\u0001\u0000\u0000"+
		"\u0000\u00c4\u00c5\u00051\u0000\u0000\u00c5\u00c6\u0003d2\u0000\u00c6"+
		"\u00c7\u0005$\u0000\u0000\u00c7\u00c8\u0003\u001e\u000f\u0000\u00c8\u00c9"+
		"\u0005@\u0000\u0000\u00c9\u0015\u0001\u0000\u0000\u0000\u00ca\u00cc\u0003"+
		"\u001c\u000e\u0000\u00cb\u00ca\u0001\u0000\u0000\u0000\u00cc\u00cf\u0001"+
		"\u0000\u0000\u0000\u00cd\u00cb\u0001\u0000\u0000\u0000\u00cd\u00ce\u0001"+
		"\u0000\u0000\u0000\u00ce\u00d0\u0001\u0000\u0000\u0000\u00cf\u00cd\u0001"+
		"\u0000\u0000\u0000\u00d0\u00d1\u0005,\u0000\u0000\u00d1\u00d2\u0003d2"+
		"\u0000\u00d2\u00d4\u0003D\"\u0000\u00d3\u00d5\u0005/\u0000\u0000\u00d4"+
		"\u00d3\u0001\u0000\u0000\u0000\u00d4\u00d5\u0001\u0000\u0000\u0000\u00d5"+
		"\u00d6\u0001\u0000\u0000\u0000\u00d6\u00da\u0005$\u0000\u0000\u00d7\u00db"+
		"\u0003<\u001e\u0000\u00d8\u00db\u0003H$\u0000\u00d9\u00db\u0003>\u001f"+
		"\u0000\u00da\u00d7\u0001\u0000\u0000\u0000\u00da\u00d8\u0001\u0000\u0000"+
		"\u0000\u00da\u00d9\u0001\u0000\u0000\u0000\u00db\u00dc\u0001\u0000\u0000"+
		"\u0000\u00dc\u00dd\u0005@\u0000\u0000\u00dd\u0017\u0001\u0000\u0000\u0000"+
		"\u00de\u00e0\u0003\u001c\u000e\u0000\u00df\u00de\u0001\u0000\u0000\u0000"+
		"\u00e0\u00e3\u0001\u0000\u0000\u0000\u00e1\u00df\u0001\u0000\u0000\u0000"+
		"\u00e1\u00e2\u0001\u0000\u0000\u0000\u00e2\u00e4\u0001\u0000\u0000\u0000"+
		"\u00e3\u00e1\u0001\u0000\u0000\u0000\u00e4\u00e5\u0005-\u0000\u0000\u00e5"+
		"\u00e6\u0003d2\u0000\u00e6\u00e7\u0003D\"\u0000\u00e7\u00eb\u0005$\u0000"+
		"\u0000\u00e8\u00ec\u0003<\u001e\u0000\u00e9\u00ec\u0003H$\u0000\u00ea"+
		"\u00ec\u0003>\u001f\u0000\u00eb\u00e8\u0001\u0000\u0000\u0000\u00eb\u00e9"+
		"\u0001\u0000\u0000\u0000\u00eb\u00ea\u0001\u0000\u0000\u0000\u00ec\u00ed"+
		"\u0001\u0000\u0000\u0000\u00ed\u00ee\u0005@\u0000\u0000\u00ee\u0019\u0001"+
		"\u0000\u0000\u0000\u00ef\u00f1\u0003\u001c\u000e\u0000\u00f0\u00ef\u0001"+
		"\u0000\u0000\u0000\u00f1\u00f4\u0001\u0000\u0000\u0000\u00f2\u00f0\u0001"+
		"\u0000\u0000\u0000\u00f2\u00f3\u0001\u0000\u0000\u0000\u00f3\u00f5\u0001"+
		"\u0000\u0000\u0000\u00f4\u00f2\u0001\u0000\u0000\u0000\u00f5\u00f6\u0005"+
		".\u0000\u0000\u00f6\u00fa\u0003d2\u0000\u00f7\u00fb\u0003d2\u0000\u00f8"+
		"\u00f9\u0005,\u0000\u0000\u00f9\u00fb\u0003D\"\u0000\u00fa\u00f7\u0001"+
		"\u0000\u0000\u0000\u00fa\u00f8\u0001\u0000\u0000\u0000\u00fb\u00fc\u0001"+
		"\u0000\u0000\u0000\u00fc\u00fd\u0005$\u0000\u0000\u00fd\u00fe\u0003\u001e"+
		"\u000f\u0000\u00fe\u00ff\u0005@\u0000\u0000\u00ff\u001b\u0001\u0000\u0000"+
		"\u0000\u0100\u0101\u0005\n\u0000\u0000\u0101\u0102\u00032\u0019\u0000"+
		"\u0102\u0103\u0005@\u0000\u0000\u0103\u001d\u0001\u0000\u0000\u0000\u0104"+
		"\u010a\u0003 \u0010\u0000\u0105\u0106\u0005\"\u0000\u0000\u0106\u0107"+
		"\u0003\u001e\u000f\u0000\u0107\u0108\u0005#\u0000\u0000\u0108\u0109\u0003"+
		"\u001e\u000f\u0000\u0109\u010b\u0001\u0000\u0000\u0000\u010a\u0105\u0001"+
		"\u0000\u0000\u0000\u010a\u010b\u0001\u0000\u0000\u0000\u010b\u001f\u0001"+
		"\u0000\u0000\u0000\u010c\u010d\u0006\u0010\uffff\uffff\u0000\u010d\u010e"+
		"\u0003\"\u0011\u0000\u010e\u0114\u0001\u0000\u0000\u0000\u010f\u0110\n"+
		"\u0002\u0000\u0000\u0110\u0111\u0007\u0000\u0000\u0000\u0111\u0113\u0003"+
		"\"\u0011\u0000\u0112\u010f\u0001\u0000\u0000\u0000\u0113\u0116\u0001\u0000"+
		"\u0000\u0000\u0114\u0112\u0001\u0000\u0000\u0000\u0114\u0115\u0001\u0000"+
		"\u0000\u0000\u0115!\u0001\u0000\u0000\u0000\u0116\u0114\u0001\u0000\u0000"+
		"\u0000\u0117\u0118\u0006\u0011\uffff\uffff\u0000\u0118\u0119\u0003$\u0012"+
		"\u0000\u0119\u011f\u0001\u0000\u0000\u0000\u011a\u011b\n\u0002\u0000\u0000"+
		"\u011b\u011c\u0007\u0001\u0000\u0000\u011c\u011e\u0003$\u0012\u0000\u011d"+
		"\u011a\u0001\u0000\u0000\u0000\u011e\u0121\u0001\u0000\u0000\u0000\u011f"+
		"\u011d\u0001\u0000\u0000\u0000\u011f\u0120\u0001\u0000\u0000\u0000\u0120"+
		"#\u0001\u0000\u0000\u0000\u0121\u011f\u0001\u0000\u0000\u0000\u0122\u0123"+
		"\u0006\u0012\uffff\uffff\u0000\u0123\u0124\u0003&\u0013\u0000\u0124\u012a"+
		"\u0001\u0000\u0000\u0000\u0125\u0126\n\u0002\u0000\u0000\u0126\u0127\u0007"+
		"\u0002\u0000\u0000\u0127\u0129\u0003&\u0013\u0000\u0128\u0125\u0001\u0000"+
		"\u0000\u0000\u0129\u012c\u0001\u0000\u0000\u0000\u012a\u0128\u0001\u0000"+
		"\u0000\u0000\u012a\u012b\u0001\u0000\u0000\u0000\u012b%\u0001\u0000\u0000"+
		"\u0000\u012c\u012a\u0001\u0000\u0000\u0000\u012d\u012e\u0006\u0013\uffff"+
		"\uffff\u0000\u012e\u012f\u0003(\u0014\u0000\u012f\u0135\u0001\u0000\u0000"+
		"\u0000\u0130\u0131\n\u0002\u0000\u0000\u0131\u0132\u0007\u0003\u0000\u0000"+
		"\u0132\u0134\u0003(\u0014\u0000\u0133\u0130\u0001\u0000\u0000\u0000\u0134"+
		"\u0137\u0001\u0000\u0000\u0000\u0135\u0133\u0001\u0000\u0000\u0000\u0135"+
		"\u0136\u0001\u0000\u0000\u0000\u0136\'\u0001\u0000\u0000\u0000\u0137\u0135"+
		"\u0001\u0000\u0000\u0000\u0138\u0139\u0006\u0014\uffff\uffff\u0000\u0139"+
		"\u013a\u0003*\u0015\u0000\u013a\u0140\u0001\u0000\u0000\u0000\u013b\u013c"+
		"\n\u0002\u0000\u0000\u013c\u013d\u0007\u0004\u0000\u0000\u013d\u013f\u0003"+
		"*\u0015\u0000\u013e\u013b\u0001\u0000\u0000\u0000\u013f\u0142\u0001\u0000"+
		"\u0000\u0000\u0140\u013e\u0001\u0000\u0000\u0000\u0140\u0141\u0001\u0000"+
		"\u0000\u0000\u0141)\u0001\u0000\u0000\u0000\u0142\u0140\u0001\u0000\u0000"+
		"\u0000\u0143\u0148\u0003.\u0017\u0000\u0144\u0145\u0003,\u0016\u0000\u0145"+
		"\u0146\u0003*\u0015\u0000\u0146\u0148\u0001\u0000\u0000\u0000\u0147\u0143"+
		"\u0001\u0000\u0000\u0000\u0147\u0144\u0001\u0000\u0000\u0000\u0148+\u0001"+
		"\u0000\u0000\u0000\u0149\u014a\u0007\u0005\u0000\u0000\u014a-\u0001\u0000"+
		"\u0000\u0000\u014b\u014c\u0006\u0017\uffff\uffff\u0000\u014c\u014d\u0003"+
		"0\u0018\u0000\u014d\u015e\u0001\u0000\u0000\u0000\u014e\u014f\n\u0005"+
		"\u0000\u0000\u014f\u0150\u0005\u000e\u0000\u0000\u0150\u0151\u0003\u001e"+
		"\u000f\u0000\u0151\u0152\u0005\u000f\u0000\u0000\u0152\u015d\u0001\u0000"+
		"\u0000\u0000\u0153\u0154\n\u0004\u0000\u0000\u0154\u0155\u0005\u0012\u0000"+
		"\u0000\u0155\u015d\u0003d2\u0000\u0156\u0157\n\u0003\u0000\u0000\u0157"+
		"\u0158\u0005\u0012\u0000\u0000\u0158\u015d\u00034\u001a\u0000\u0159\u015a"+
		"\n\u0002\u0000\u0000\u015a\u015b\u0005#\u0000\u0000\u015b\u015d\u0003"+
		"d2\u0000\u015c\u014e\u0001\u0000\u0000\u0000\u015c\u0153\u0001\u0000\u0000"+
		"\u0000\u015c\u0156\u0001\u0000\u0000\u0000\u015c\u0159\u0001\u0000\u0000"+
		"\u0000\u015d\u0160\u0001\u0000\u0000\u0000\u015e\u015c\u0001\u0000\u0000"+
		"\u0000\u015e\u015f\u0001\u0000\u0000\u0000\u015f/\u0001\u0000\u0000\u0000"+
		"\u0160\u015e\u0001\u0000\u0000\u0000\u0161\u016b\u00034\u001a\u0000\u0162"+
		"\u016b\u0003F#\u0000\u0163\u016b\u0003D\"\u0000\u0164\u016b\u0005\u0004"+
		"\u0000\u0000\u0165\u016b\u0003L&\u0000\u0166\u016b\u0003>\u001f\u0000"+
		"\u0167\u016b\u0003H$\u0000\u0168\u016b\u00038\u001c\u0000\u0169\u016b"+
		"\u0003:\u001d\u0000\u016a\u0161\u0001\u0000\u0000\u0000\u016a\u0162\u0001"+
		"\u0000\u0000\u0000\u016a\u0163\u0001\u0000\u0000\u0000\u016a\u0164\u0001"+
		"\u0000\u0000\u0000\u016a\u0165\u0001\u0000\u0000\u0000\u016a\u0166\u0001"+
		"\u0000\u0000\u0000\u016a\u0167\u0001\u0000\u0000\u0000\u016a\u0168\u0001"+
		"\u0000\u0000\u0000\u016a\u0169\u0001\u0000\u0000\u0000\u016b1\u0001\u0000"+
		"\u0000\u0000\u016c\u0172\u00034\u001a\u0000\u016d\u016e\u0003.\u0017\u0000"+
		"\u016e\u016f\u0005\u0012\u0000\u0000\u016f\u0170\u00034\u001a\u0000\u0170"+
		"\u0172\u0001\u0000\u0000\u0000\u0171\u016c\u0001\u0000\u0000\u0000\u0171"+
		"\u016d\u0001\u0000\u0000\u0000\u01723\u0001\u0000\u0000\u0000\u0173\u0174"+
		"\u0003d2\u0000\u0174\u0176\u0005\u0010\u0000\u0000\u0175\u0177\u00036"+
		"\u001b\u0000\u0176\u0175\u0001\u0000\u0000\u0000\u0176\u0177\u0001\u0000"+
		"\u0000\u0000\u0177\u0178\u0001\u0000\u0000\u0000\u0178\u0179\u0005\u0011"+
		"\u0000\u0000\u01795\u0001\u0000\u0000\u0000\u017a\u017f\u0003\u001e\u000f"+
		"\u0000\u017b\u017c\u0005\u000b\u0000\u0000\u017c\u017e\u0003\u001e\u000f"+
		"\u0000\u017d\u017b\u0001\u0000\u0000\u0000\u017e\u0181\u0001\u0000\u0000"+
		"\u0000\u017f\u017d\u0001\u0000\u0000\u0000\u017f\u0180\u0001\u0000\u0000"+
		"\u0000\u01807\u0001\u0000\u0000\u0000\u0181\u017f\u0001\u0000\u0000\u0000"+
		"\u0182\u0183\u0005\u0010\u0000\u0000\u0183\u0184\u0003\u001e\u000f\u0000"+
		"\u0184\u0185\u0005\u0011\u0000\u0000\u01859\u0001\u0000\u0000\u0000\u0186"+
		"\u0188\u0005\u0010\u0000\u0000\u0187\u0189\u00036\u001b\u0000\u0188\u0187"+
		"\u0001\u0000\u0000\u0000\u0188\u0189\u0001\u0000\u0000\u0000\u0189\u018a"+
		"\u0001\u0000\u0000\u0000\u018a\u018d\u0005\u0011\u0000\u0000\u018b\u018d"+
		"\u0003d2\u0000\u018c\u0186\u0001\u0000\u0000\u0000\u018c\u018b\u0001\u0000"+
		"\u0000\u0000\u018d\u018e\u0001\u0000\u0000\u0000\u018e\u018f\u0005\t\u0000"+
		"\u0000\u018f\u0190\u0003\u001e\u000f\u0000\u0190;\u0001\u0000\u0000\u0000"+
		"\u0191\u0192\u00052\u0000\u0000\u0192\u0193\u00038\u001c\u0000\u0193\u0194"+
		"\u0003H$\u0000\u0194=\u0001\u0000\u0000\u0000\u0195\u0196\u0005\u000e"+
		"\u0000\u0000\u0196\u0199\u00053\u0000\u0000\u0197\u019a\u0003d2\u0000"+
		"\u0198\u019a\u0003@ \u0000\u0199\u0197\u0001\u0000\u0000\u0000\u0199\u0198"+
		"\u0001\u0000\u0000\u0000\u019a\u019b\u0001\u0000\u0000\u0000\u019b\u019c"+
		"\u00054\u0000\u0000\u019c\u019d\u0003\u001e\u000f\u0000\u019d\u019e\u0005"+
		"#\u0000\u0000\u019e\u019f\u0003B!\u0000\u019f\u01a0\u0005\u000f\u0000"+
		"\u0000\u01a0?\u0001\u0000\u0000\u0000\u01a1\u01a2\u0005\u0010\u0000\u0000"+
		"\u01a2\u01a3\u0003d2\u0000\u01a3\u01a4\u0005\u000b\u0000\u0000\u01a4\u01a5"+
		"\u0003d2\u0000\u01a5\u01a6\u0005\u0011\u0000\u0000\u01a6A\u0001\u0000"+
		"\u0000\u0000\u01a7\u01aa\u0003\u001e\u000f\u0000\u01a8\u01aa\u0003<\u001e"+
		"\u0000\u01a9\u01a7\u0001\u0000\u0000\u0000\u01a9\u01a8\u0001\u0000\u0000"+
		"\u0000\u01aaC\u0001\u0000\u0000\u0000\u01ab\u01b1\u0005\u0005\u0000\u0000"+
		"\u01ac\u01ad\u0003\u001e\u000f\u0000\u01ad\u01ae\u0005\u0006\u0000\u0000"+
		"\u01ae\u01b0\u0001\u0000\u0000\u0000\u01af\u01ac\u0001\u0000\u0000\u0000"+
		"\u01b0\u01b3\u0001\u0000\u0000\u0000\u01b1\u01af\u0001\u0000\u0000\u0000"+
		"\u01b1\u01b2\u0001\u0000\u0000\u0000\u01b2\u01b4\u0001\u0000\u0000\u0000"+
		"\u01b3\u01b1\u0001\u0000\u0000\u0000\u01b4\u01b5\u0003\u001e\u000f\u0000"+
		"\u01b5\u01b6\u0005\u0007\u0000\u0000\u01b6\u01b9\u0001\u0000\u0000\u0000"+
		"\u01b7\u01b9\u0005\b\u0000\u0000\u01b8\u01ab\u0001\u0000\u0000\u0000\u01b8"+
		"\u01b7\u0001\u0000\u0000\u0000\u01b9E\u0001\u0000\u0000\u0000\u01ba\u01c0"+
		"\u0005?\u0000\u0000\u01bb\u01c0\u00055\u0000\u0000\u01bc\u01c0\u00056"+
		"\u0000\u0000\u01bd\u01c0\u00057\u0000\u0000\u01be\u01c0\u0003d2\u0000"+
		"\u01bf\u01ba\u0001\u0000\u0000\u0000\u01bf\u01bb\u0001\u0000\u0000\u0000"+
		"\u01bf\u01bc\u0001\u0000\u0000\u0000\u01bf\u01bd\u0001\u0000\u0000\u0000"+
		"\u01bf\u01be\u0001\u0000\u0000\u0000\u01c0G\u0001\u0000\u0000\u0000\u01c1"+
		"\u01d2\u0005%\u0000\u0000\u01c2\u01c4\u0005@\u0000\u0000\u01c3\u01c2\u0001"+
		"\u0000\u0000\u0000\u01c4\u01c5\u0001\u0000\u0000\u0000\u01c5\u01c3\u0001"+
		"\u0000\u0000\u0000\u01c5\u01c6\u0001\u0000\u0000\u0000\u01c6\u01cf\u0001"+
		"\u0000\u0000\u0000\u01c7\u01c9\u0003J%\u0000\u01c8\u01ca\u0005@\u0000"+
		"\u0000\u01c9\u01c8\u0001\u0000\u0000\u0000\u01ca\u01cb\u0001\u0000\u0000"+
		"\u0000\u01cb\u01c9\u0001\u0000\u0000\u0000\u01cb\u01cc\u0001\u0000\u0000"+
		"\u0000\u01cc\u01ce\u0001\u0000\u0000\u0000\u01cd\u01c7\u0001\u0000\u0000"+
		"\u0000\u01ce\u01d1\u0001\u0000\u0000\u0000\u01cf\u01cd\u0001\u0000\u0000"+
		"\u0000\u01cf\u01d0\u0001\u0000\u0000\u0000\u01d0\u01d3\u0001\u0000\u0000"+
		"\u0000\u01d1\u01cf\u0001\u0000\u0000\u0000\u01d2\u01c3\u0001\u0000\u0000"+
		"\u0000\u01d2\u01d3\u0001\u0000\u0000\u0000\u01d3\u01d4\u0001\u0000\u0000"+
		"\u0000\u01d4\u01d5\u0005&\u0000\u0000\u01d5I\u0001\u0000\u0000\u0000\u01d6"+
		"\u01d9\u0003d2\u0000\u01d7\u01d9\u0003D\"\u0000\u01d8\u01d6\u0001\u0000"+
		"\u0000\u0000\u01d8\u01d7\u0001\u0000\u0000\u0000\u01d9\u01da\u0001\u0000"+
		"\u0000\u0000\u01da\u01db\u0005#\u0000\u0000\u01db\u01dc\u0003\u001e\u000f"+
		"\u0000\u01dcK\u0001\u0000\u0000\u0000\u01dd\u01e9\u0005\u000e\u0000\u0000"+
		"\u01de\u01e0\u0005@\u0000\u0000\u01df\u01de\u0001\u0000\u0000\u0000\u01e0"+
		"\u01e1\u0001\u0000\u0000\u0000\u01e1\u01df\u0001\u0000\u0000\u0000\u01e1"+
		"\u01e2\u0001\u0000\u0000\u0000\u01e2\u01e6\u0001\u0000\u0000\u0000\u01e3"+
		"\u01e5\u0003N\'\u0000\u01e4\u01e3\u0001\u0000\u0000\u0000\u01e5\u01e8"+
		"\u0001\u0000\u0000\u0000\u01e6\u01e4\u0001\u0000\u0000\u0000\u01e6\u01e7"+
		"\u0001\u0000\u0000\u0000\u01e7\u01ea\u0001\u0000\u0000\u0000\u01e8\u01e6"+
		"\u0001\u0000\u0000\u0000\u01e9\u01df\u0001\u0000\u0000\u0000\u01e9\u01ea"+
		"\u0001\u0000\u0000\u0000\u01ea\u01eb\u0001\u0000\u0000\u0000\u01eb\u01ec"+
		"\u0005\u000f\u0000\u0000\u01ecM\u0001\u0000\u0000\u0000\u01ed\u01ef\u0003"+
		"\u001e\u000f\u0000\u01ee\u01f0\u0005@\u0000\u0000\u01ef\u01ee\u0001\u0000"+
		"\u0000\u0000\u01f0\u01f1\u0001\u0000\u0000\u0000\u01f1\u01ef\u0001\u0000"+
		"\u0000\u0000\u01f1\u01f2\u0001\u0000\u0000\u0000\u01f2O\u0001\u0000\u0000"+
		"\u0000\u01f3\u01f8\u0003R)\u0000\u01f4\u01f5\u0005\f\u0000\u0000\u01f5"+
		"\u01f7\u0003R)\u0000\u01f6\u01f4\u0001\u0000\u0000\u0000\u01f7\u01fa\u0001"+
		"\u0000\u0000\u0000\u01f8\u01f6\u0001\u0000\u0000\u0000\u01f8\u01f9\u0001"+
		"\u0000\u0000\u0000\u01f9Q\u0001\u0000\u0000\u0000\u01fa\u01f8\u0001\u0000"+
		"\u0000\u0000\u01fb\u01fc\u0006)\uffff\uffff\u0000\u01fc\u01ff\u0003T*"+
		"\u0000\u01fd\u01ff\u0003b1\u0000\u01fe\u01fb\u0001\u0000\u0000\u0000\u01fe"+
		"\u01fd\u0001\u0000\u0000\u0000\u01ff\u0205\u0001\u0000\u0000\u0000\u0200"+
		"\u0201\n\u0002\u0000\u0000\u0201\u0202\u0005\u000e\u0000\u0000\u0202\u0204"+
		"\u0005\u000f\u0000\u0000\u0203\u0200\u0001\u0000\u0000\u0000\u0204\u0207"+
		"\u0001\u0000\u0000\u0000\u0205\u0203\u0001\u0000\u0000\u0000\u0205\u0206"+
		"\u0001\u0000\u0000\u0000\u0206S\u0001\u0000\u0000\u0000\u0207\u0205\u0001"+
		"\u0000\u0000\u0000\u0208\u0213\u0003V+\u0000\u0209\u0213\u0003d2\u0000"+
		"\u020a\u020c\u0003,\u0016\u0000\u020b\u020a\u0001\u0000\u0000\u0000\u020b"+
		"\u020c\u0001\u0000\u0000\u0000\u020c\u020d\u0001\u0000\u0000\u0000\u020d"+
		"\u0213\u0003F#\u0000\u020e\u0213\u0005\b\u0000\u0000\u020f\u0213\u0005"+
		"\u0004\u0000\u0000\u0210\u0213\u0003X,\u0000\u0211\u0213\u0003^/\u0000"+
		"\u0212\u0208\u0001\u0000\u0000\u0000\u0212\u0209\u0001\u0000\u0000\u0000"+
		"\u0212\u020b\u0001\u0000\u0000\u0000\u0212\u020e\u0001\u0000\u0000\u0000"+
		"\u0212\u020f\u0001\u0000\u0000\u0000\u0212\u0210\u0001\u0000\u0000\u0000"+
		"\u0212\u0211\u0001\u0000\u0000\u0000\u0213U\u0001\u0000\u0000\u0000\u0214"+
		"\u0215\u0007\u0006\u0000\u0000\u0215W\u0001\u0000\u0000\u0000\u0216\u022a"+
		"\u0005%\u0000\u0000\u0217\u0219\u0005@\u0000\u0000\u0218\u0217\u0001\u0000"+
		"\u0000\u0000\u0219\u021a\u0001\u0000\u0000\u0000\u021a\u0218\u0001\u0000"+
		"\u0000\u0000\u021a\u021b\u0001\u0000\u0000\u0000\u021b\u0227\u0001\u0000"+
		"\u0000\u0000\u021c\u021f\u0003Z-\u0000\u021d\u021f\u0003\\.\u0000\u021e"+
		"\u021c\u0001\u0000\u0000\u0000\u021e\u021d\u0001\u0000\u0000\u0000\u021f"+
		"\u0221\u0001\u0000\u0000\u0000\u0220\u0222\u0005@\u0000\u0000\u0221\u0220"+
		"\u0001\u0000\u0000\u0000\u0222\u0223\u0001\u0000\u0000\u0000\u0223\u0221"+
		"\u0001\u0000\u0000\u0000\u0223\u0224\u0001\u0000\u0000\u0000\u0224\u0226"+
		"\u0001\u0000\u0000\u0000\u0225\u021e\u0001\u0000\u0000\u0000\u0226\u0229"+
		"\u0001\u0000\u0000\u0000\u0227\u0225\u0001\u0000\u0000\u0000\u0227\u0228"+
		"\u0001\u0000\u0000\u0000\u0228\u022b\u0001\u0000\u0000\u0000\u0229\u0227"+
		"\u0001\u0000\u0000\u0000\u022a\u0218\u0001\u0000\u0000\u0000\u022a\u022b"+
		"\u0001\u0000\u0000\u0000\u022b\u022c\u0001\u0000\u0000\u0000\u022c\u022d"+
		"\u0005&\u0000\u0000\u022dY\u0001\u0000\u0000\u0000\u022e\u0230\u0003\u001c"+
		"\u000e\u0000\u022f\u022e\u0001\u0000\u0000\u0000\u0230\u0233\u0001\u0000"+
		"\u0000\u0000\u0231\u022f\u0001\u0000\u0000\u0000\u0231\u0232\u0001\u0000"+
		"\u0000\u0000\u0232\u0237\u0001\u0000\u0000\u0000\u0233\u0231\u0001\u0000"+
		"\u0000\u0000\u0234\u0238\u0003d2\u0000\u0235\u0238\u0005\b\u0000\u0000"+
		"\u0236\u0238\u0005\u0004\u0000\u0000\u0237\u0234\u0001\u0000\u0000\u0000"+
		"\u0237\u0235\u0001\u0000\u0000\u0000\u0237\u0236\u0001\u0000\u0000\u0000"+
		"\u0238\u0239\u0001\u0000\u0000\u0000\u0239\u023a\u0005#\u0000\u0000\u023a"+
		"\u023b\u0003P(\u0000\u023b[\u0001\u0000\u0000\u0000\u023c\u023e\u0003"+
		"\u001c\u000e\u0000\u023d\u023c\u0001\u0000\u0000\u0000\u023e\u0241\u0001"+
		"\u0000\u0000\u0000\u023f\u023d\u0001\u0000\u0000\u0000\u023f\u0240\u0001"+
		"\u0000\u0000\u0000\u0240\u0242\u0001\u0000\u0000\u0000\u0241\u023f\u0001"+
		"\u0000\u0000\u0000\u0242\u0243\u0005\r\u0000\u0000\u0243\u0244\u0003P"+
		"(\u0000\u0244]\u0001\u0000\u0000\u0000\u0245\u0251\u0005\u000e\u0000\u0000"+
		"\u0246\u0248\u0005@\u0000\u0000\u0247\u0246\u0001\u0000\u0000\u0000\u0248"+
		"\u0249\u0001\u0000\u0000\u0000\u0249\u0247\u0001\u0000\u0000\u0000\u0249"+
		"\u024a\u0001\u0000\u0000\u0000\u024a\u024e\u0001\u0000\u0000\u0000\u024b"+
		"\u024d\u0003`0\u0000\u024c\u024b\u0001\u0000\u0000\u0000\u024d\u0250\u0001"+
		"\u0000\u0000\u0000\u024e\u024c\u0001\u0000\u0000\u0000\u024e\u024f\u0001"+
		"\u0000\u0000\u0000\u024f\u0252\u0001\u0000\u0000\u0000\u0250\u024e\u0001"+
		"\u0000\u0000\u0000\u0251\u0247\u0001\u0000\u0000\u0000\u0251\u0252\u0001"+
		"\u0000\u0000\u0000\u0252\u0253\u0001\u0000\u0000\u0000\u0253\u0254\u0005"+
		"\u000f\u0000\u0000\u0254_\u0001\u0000\u0000\u0000\u0255\u0257\u0003\u001c"+
		"\u000e\u0000\u0256\u0255\u0001\u0000\u0000\u0000\u0257\u025a\u0001\u0000"+
		"\u0000\u0000\u0258\u0256\u0001\u0000\u0000\u0000\u0258\u0259\u0001\u0000"+
		"\u0000\u0000\u0259\u025b\u0001\u0000\u0000\u0000\u025a\u0258\u0001\u0000"+
		"\u0000\u0000\u025b\u025d\u0003P(\u0000\u025c\u025e\u0005@\u0000\u0000"+
		"\u025d\u025c\u0001\u0000\u0000\u0000\u025e\u025f\u0001\u0000\u0000\u0000"+
		"\u025f\u025d\u0001\u0000\u0000\u0000\u025f\u0260\u0001\u0000\u0000\u0000"+
		"\u0260a\u0001\u0000\u0000\u0000\u0261\u0262\u0005\u0010\u0000\u0000\u0262"+
		"\u0263\u0003P(\u0000\u0263\u0264\u0005\u0011\u0000\u0000\u0264c\u0001"+
		"\u0000\u0000\u0000\u0265\u0266\u0007\u0007\u0000\u0000\u0266e\u0001\u0000"+
		"\u0000\u0000Aix\u0081\u0087\u008a\u009d\u00a4\u00a9\u00ab\u00b5\u00c1"+
		"\u00cd\u00d4\u00da\u00e1\u00eb\u00f2\u00fa\u010a\u0114\u011f\u012a\u0135"+
		"\u0140\u0147\u015c\u015e\u016a\u0171\u0176\u017f\u0188\u018c\u0199\u01a9"+
		"\u01b1\u01b8\u01bf\u01c5\u01cb\u01cf\u01d2\u01d8\u01e1\u01e6\u01e9\u01f1"+
		"\u01f8\u01fe\u0205\u020b\u0212\u021a\u021e\u0223\u0227\u022a\u0231\u0237"+
		"\u023f\u0249\u024e\u0251\u0258\u025f";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}