export type BicepStatement =
  | BicepTargetScope
  | BicepImport
  | BicepMetadata
  | BicepParameter
  | BicepType
  | BicepVariable
  | BicepResource
  | BicepModule
  | BicepOutput;

export interface BicepTargetScope {
  type: 'TargetScope';
  scope: BicepExpression;
}

export interface BicepImport {
  type: 'Import';
  specification: string;
  alias?: string;
  with?: BicepObject;
}

export interface BicepMetadata {
  type: 'Metadata';
  name: string;
  value: BicepExpression;
}

export interface BicepParameter {
  type: 'Parameter';
  name: string;
  parameterType: BicepTypeExpression | { resourceType: string };
  defaultValue?: BicepExpression;
  decorators?: BicepDecorator[];
}

export interface BicepType {
  type: 'Type';
  name: string;
  value: BicepTypeExpression;
  decorators?: BicepDecorator[];
}

export interface BicepVariable {
  type: 'Variable';
  name: string;
  value: BicepExpression;
  decorators?: BicepDecorator[];
}

export interface BicepResource {
  type: 'Resource';
  name: string;
  resourceType: string;
  existing?: boolean;
  body: BicepObject | BicepIfCondition | BicepForExpression;
  decorators?: BicepDecorator[];
}

export interface BicepModule {
  type: 'Module';
  name: string;
  path: string;
  body: BicepObject | BicepIfCondition | BicepForExpression;
  decorators?: BicepDecorator[];
}

export interface BicepOutput {
  type: 'Output';
  name: string;
  outputType: string | { resourceType: string };
  value: BicepExpression;
  decorators?: BicepDecorator[];
}

export interface BicepDecorator {
  name: string;
  arguments?: BicepExpression[];
}

export type BicepExpression =
  | BicepBinaryExpression
  | BicepUnaryExpression
  | BicepTernaryExpression
  | BicepMemberExpression
  | BicepFunctionCall
  | BicepLiteral
  | BicepStringLiteral
  | BicepMultilineStringLiteral
  | BicepObject
  | BicepArray
  | BicepIdentifier
  | BicepParenthesizedExpression
  | BicepLambdaExpression
  | BicepForExpression;

export interface BicepBinaryExpression {
  type: 'BinaryExpression';
  operator: '&&' | '||' | '??' | '==' | '!=' | '>' | '>=' | '<' | '<=' | '+' | '-' | '*' | '/' | '%';
  left: BicepExpression;
  right: BicepExpression;
}

export interface BicepUnaryExpression {
  type: 'UnaryExpression';
  operator: '!' | '-' | '+';
  argument: BicepExpression;
}

export interface BicepTernaryExpression {
  type: 'TernaryExpression';
  condition: BicepExpression;
  consequent: BicepExpression;
  alternate: BicepExpression;
}

export interface BicepMemberExpression {
  type: 'MemberExpression';
  object: BicepExpression;
  property: string | BicepExpression; // BicepExpression for indexer [index]
  isIndexer?: boolean;
}

export interface BicepFunctionCall {
  type: 'FunctionCall';
  name: string;
  arguments: BicepExpression[];
}

export interface BicepLiteral {
  type: 'Literal';
  value: string | number | boolean | null;
}

export interface BicepStringLiteral {
  type: 'StringLiteral';
  value: string; // The literal string content, emitter handles escaping and interpolation if needed
  segments?: (string | BicepExpression)[]; // For interpolation
}

export interface BicepMultilineStringLiteral {
  type: 'MultilineStringLiteral';
  value: string;
}

export interface BicepObject {
  type: 'Object';
  properties: BicepObjectProperty[];
}

export interface BicepObjectProperty {
  name: string | BicepStringLiteral;
  value: BicepExpression;
}

export interface BicepArray {
  type: 'Array';
  items: BicepExpression[];
}

export interface BicepIdentifier {
  type: 'Identifier';
  name: string;
}

export interface BicepParenthesizedExpression {
  type: 'ParenthesizedExpression';
  expression: BicepExpression;
}

export interface BicepLambdaExpression {
  type: 'LambdaExpression';
  parameters: string[];
  body: BicepExpression;
}

export interface BicepIfCondition {
  type: 'IfCondition';
  condition: BicepExpression;
  body: BicepObject;
}

export interface BicepForExpression {
  type: 'ForExpression';
  item: string;
  index?: string;
  collection: BicepExpression;
  body: BicepExpression | BicepIfCondition;
}

export type BicepTypeExpression = string; // Simplified for now
