import { ANTLRInputStream, CommonTokenStream, ANTLRErrorListener, RecognitionException, Recognizer, Token } from 'antlr4ts/index.js';
import { bicepLexer } from './bicepLexer.js';
import { bicepParser } from './bicepParser.js';

export interface BicepValidationError {
  line: number;
  column: number;
  message: string;
  type: 'error' | 'warning';
}

class BicepErrorListener implements ANTLRErrorListener<Token> {
  errors: BicepValidationError[] = [];

  syntaxError(
    recognizer: Recognizer<Token, any>,
    offendingSymbol: Token | undefined,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | undefined
  ): void {
    this.errors.push({
      line,
      column: charPositionInLine,
      message: msg,
      type: 'error'
    });
  }
}

export const validateBicep = (code: string) => {
  if (!code || !code.trim()) {
    return { valid: true, errors: [] };
  }

  const inputStream = new ANTLRInputStream(code);
  const lexer = new bicepLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new bicepParser(tokenStream);

  const errorListener = new BicepErrorListener();
  lexer.removeErrorListeners();
  lexer.addErrorListener(errorListener);
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  try {
    parser.program();
  } catch (e) {
    // Parser might throw if it can't recover
  }

  return {
    valid: errorListener.errors.length === 0,
    errors: errorListener.errors
  };
};