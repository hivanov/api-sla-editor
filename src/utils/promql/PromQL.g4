grammar PromQL;

/*
 * Parser Rules
 */

expression : expr EOF ;

expr
    // Primaries
    : paren_expr
    | number_literal
    | string_literal
    | aggregate_expr
    | function_call
    | vector_selector
    | '[' DURATION ']'

    // Postfix modifiers
    | expr '[' DURATION ']'
    | expr '[' DURATION ':' DURATION? ']'
    | expr OFFSET (DURATION | NUMBER)
    | expr AT NUMBER
    | expr AT (START | END)

    // Unary
    | (ADD | SUB) expr

    // Binary Operators
    | <assoc=right> expr POW BOOL? bin_modifier? expr
    | expr (MUL | DIV | MOD) BOOL? bin_modifier? expr
    | expr (ADD | SUB) BOOL? bin_modifier? expr
    | expr (EQL | NEQ | GTE | LTE | GTR | LSS) BOOL? bin_modifier? expr

    | expr (LAND | LUNLESS) BOOL? bin_modifier? expr
    | expr LOR BOOL? bin_modifier? expr
    ;

bin_modifier
    : (ON | IGNORING) '(' label_list ')' (GROUP_LEFT | GROUP_RIGHT)? ('(' label_list ')')?
    ;

aggregate_expr
    : AGGREGATE_OP aggregate_modifier? '(' arg_list? ')'
    | AGGREGATE_OP '(' arg_list? ')' aggregate_modifier?
    ;

aggregate_modifier
    : BY '(' label_list ')'
    | WITHOUT '(' label_list ')'
    ;

label_list
    : IDENTIFIER (',' IDENTIFIER)*
    ;

function_call
    : IDENTIFIER '(' arg_list? ')'
    ;

arg_list
    : expr (',' expr)*
    ;

paren_expr
    : '(' expr ')'
    ;

vector_selector
    : IDENTIFIER label_matchers?
    | label_matchers
    ;

label_matchers
    : '{' label_match_list? '}'
    ;

label_match_list
    : label_matcher (',' label_matcher)*
    ;

label_matcher
    : IDENTIFIER (ASSIGN | NEQ | EQL_REGEX | NEQ_REGEX) STRING
    ;

number_literal
    : NUMBER
    ;

string_literal
    : STRING
    ;

/*
 * Lexer Rules
 */

AGGREGATE_OP : 'sum' | 'min' | 'max' | 'avg' | 'stddev' | 'stdvar' | 'count' | 'count_values' | 'bottomk' | 'topk' | 'quantile' | 'group' ;

BY : 'by' ;
WITHOUT : 'without' ;
ON : 'on' ;
IGNORING : 'ignoring' ;
GROUP_LEFT : 'group_left' ;
GROUP_RIGHT : 'group_right' ;
OFFSET : 'offset' ;
BOOL : 'bool' ;
LAND : 'and' ;
LOR : 'or' ;
LUNLESS : 'unless' ;
AT : '@' ;
START : 'start()' ;
END : 'end()' ;

EQL : '==' ;
NEQ : '!=' ;
EQL_REGEX : '=~' ;
NEQ_REGEX : '!~' ;
ASSIGN : '=' ;
GTE : '>=' ;
LTE : '<=' ;
GTR : '>' ;
LSS : '<' ;
ADD : '+' ;
SUB : '-' ;
MUL : '*' ;
DIV : '/' ;
MOD : '%' ;
POW : '^' ;

IDENTIFIER : [a-zA-Z_:][a-zA-Z0-9_:./]* ;
NUMBER : '-'? [0-9]+ ('.' [0-9]+)? ;
DURATION : ([0-9]+ [smhdw])+ ;
STRING : '"' (~["\r\n])* '"' | '\'' (~['\r\n])* '\'' ;

WS : [ \t\r\n]+ -> skip ;
