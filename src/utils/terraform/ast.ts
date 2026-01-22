export type TerraformNodeType =
  | 'File'
  | 'Resource'
  | 'Data'
  | 'Provider'
  | 'Variable'
  | 'Output'
  | 'Locals'
  | 'Block'
  | 'Argument'
  | 'Identifier'
  | 'Literal'
  | 'List'
  | 'Map'
  | 'FunctionCall';

export interface TerraformNode {
  type: TerraformNodeType;
}

export interface TerraformFile extends TerraformNode {
  type: 'File';
  blocks: (TerraformResource | TerraformData | TerraformProvider | TerraformVariable | TerraformOutput | TerraformLocals)[];
}

export interface TerraformResource extends TerraformNode {
  type: 'Resource';
  resourceType: string;
  name: string;
  body: (TerraformArgument | TerraformBlock)[];
}

export interface TerraformData extends TerraformNode {
  type: 'Data';
  resourceType: string;
  name: string;
  body: (TerraformArgument | TerraformBlock)[];
}

export interface TerraformProvider extends TerraformNode {
  type: 'Provider';
  name: string;
  body: (TerraformArgument | TerraformBlock)[];
}

export interface TerraformVariable extends TerraformNode {
  type: 'Variable';
  name: string;
  body: (TerraformArgument | TerraformBlock)[];
}

export interface TerraformOutput extends TerraformNode {
  type: 'Output';
  name: string;
  body: (TerraformArgument | TerraformBlock)[];
}

export interface TerraformLocals extends TerraformNode {
  type: 'Locals';
  body: TerraformArgument[];
}

export interface TerraformBlock extends TerraformNode {
  type: 'Block';
  blockType: string;
  labels: string[];
  body: (TerraformArgument | TerraformBlock)[];
}

export interface TerraformArgument extends TerraformNode {
  type: 'Argument';
  identifier: string;
  expression: TerraformExpression;
}

export type TerraformExpression =
  | TerraformIdentifier
  | TerraformLiteral
  | TerraformList
  | TerraformMap
  | TerraformFunctionCall;

export interface TerraformIdentifier extends TerraformNode {
  type: 'Identifier';
  name: string;
}

export interface TerraformLiteral extends TerraformNode {
  type: 'Literal';
  value: string | number | boolean | null;
}

export interface TerraformList extends TerraformNode {
  type: 'List';
  elements: TerraformExpression[];
}

export interface TerraformMap extends TerraformNode {
  type: 'Map';
  entries: TerraformArgument[];
}

export interface TerraformFunctionCall extends TerraformNode {
  type: 'FunctionCall';
  name: string;
  args: TerraformExpression[];
}
