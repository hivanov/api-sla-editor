export type NodeType = 
  | 'AggregateExpr'
  | 'BinaryExpr'
  | 'Call'
  | 'MatrixSelector'
  | 'NumberLiteral'
  | 'OffsetExpr'
  | 'ParenExpr'
  | 'StringLiteral'
  | 'SubqueryExpr'
  | 'UnaryExpr'
  | 'VectorSelector'
  | 'StepInvariantExpr';

export interface Node {
  type: NodeType;
}

export interface Expr extends Node {}

export interface AggregateExpr extends Expr {
  type: 'AggregateExpr';
  op: string;
  expr: Expr;
  param?: Expr;
  grouping?: string[];
  without: boolean;
}

export interface BinaryExpr extends Expr {
  type: 'BinaryExpr';
  op: string;
  left: Expr;
  right: Expr;
  returnBool: boolean;
  vectorMatching?: VectorMatching;
}

export interface VectorMatching {
  cardinality: 'one-to-one' | 'many-to-one' | 'one-to-many' | 'many-to-many';
  matchingLabels: string[];
  on: boolean;
  include: string[];
}

export interface Call extends Expr {
  type: 'Call';
  func: string;
  args: Expr[];
}

export interface MatrixSelector extends Expr {
  type: 'MatrixSelector';
  vectorSelector: VectorSelector;
  range: string; // duration string
}

export interface NumberLiteral extends Expr {
  type: 'NumberLiteral';
  value: number;
}

export interface StringLiteral extends Expr {
  type: 'StringLiteral';
  value: string;
}

export interface UnaryExpr extends Expr {
  type: 'UnaryExpr';
  op: string;
  expr: Expr;
}

export interface VectorSelector extends Expr {
  type: 'VectorSelector';
  name?: string;
  labelMatchers: LabelMatcher[];
}

export interface LabelMatcher {
  name: string;
  type: '=' | '!=' | '=~' | '!~';
  value: string;
}

export interface OffsetExpr extends Expr {
  type: 'OffsetExpr';
  expr: Expr;
  offset: string;
}

export interface StepInvariantExpr extends Expr {
  type: 'StepInvariantExpr';
  expr: Expr;
  timestamp?: number;
  variant?: 'start' | 'end';
}

export interface SubqueryExpr extends Expr {
  type: 'SubqueryExpr';
  expr: Expr;
  range: string;
  resolution?: string;
}

export interface ParenExpr extends Expr {
  expr: Expr;
}