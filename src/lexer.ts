export type TokenType =
  | "BEGIN_ARRAY"
  | "END_ARRAY"
  | "BEGIN_OBJECT"
  | "END_OBJECT"
  | "TRUE"
  | "FALSE"
  | "NULL"
  | "STRING"
  | "NUMBER"
  | "EOF";

class Token {
  constructor(public type: TokenType, public lexeme: string, literal?: any) {}
}

export class Lexer {
  private start: number = 0;
  private current: number = 0;
  private tokens: Array<Token> = [];

  constructor(private source: string) {}

  tokenize(): Array<Token> {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token("EOF", ""));

    return this.tokens;
  }

  private isDigit(c: string) {
    return /[0-9]/.test(c);
  }

  private isAlpha(c: string) {
    return /[a-zA-Z]/.test(c);
  }

  private scanToken() {
    const c = this.advance();
    switch (c) {
      // single character tokens
      case "{":
        this.addToken("BEGIN_OBJECT");
        break;
      case "}":
        this.addToken("END_OBJECT");
        break;
      case "[":
        this.addToken("BEGIN_ARRAY");
        break;
      case "]":
        this.addToken("END_ARRAY");
        break;
      // whitespace
      // TODO: rest of the characters
      case " ":
        break;
      case '"':
        this.string();
        break;
      default:
        // number token
        if (c == "-" || /[0-9]/.test(c)) {
          this.number();
          return;
        }

        // literal token
        while (this.isAlpha(this.peek())) {
          this.advance();
        }

        const literal = this.source.slice(this.start, this.current);

        switch (literal) {
          case "null":
            this.tokens.push(new Token("NULL", literal, null));
            break;
          case "true":
            this.tokens.push(new Token("TRUE", literal, true));
            break;
          case "false":
            this.tokens.push(new Token("FALSE", literal, false));
            break;
          default:
            throw new Error(`Token "${literal}" is not a valid JSON value.`);
        }
    }
  }

  private string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      this.advance();
    }

    const literal = this.source.slice(this.start, this.current);

    this.tokens.push(new Token("STRING", ""));
  }

  private number() {
    let integerPart = "";
    let fractionPart = "";
    let exponentPart = "";

    // TODO: handle leading zero
    while (this.isDigit(this.peek())) {
      this.advance();
    }
    integerPart = this.source.slice(this.start, this.current);
    if (integerPart === "-" && integerPart.length === 1)
      throw Error("No number after minus sign.");

    // optional fraction part
    if (this.peek() === ".") {
      this.advance(); // consume "."
      let fractionStart = this.current;

      while (this.isDigit(this.peek())) {
        this.advance();
      }
      fractionPart = this.source.slice(fractionStart, this.current);
      if (fractionPart.length === 0)
        throw Error("Unterminated fractional number.");
    }

    // optional exponent part
    if (this.peek() === "e" || this.peek() === "E") {
      // optional -/+
      // required integer
    }

    // throw Error("Exponent part is missing a number");

    const lexeme = this.source.slice(this.start, this.current);
    this.tokens.push(new Token("NUMBER", lexeme));
  }

  private addToken(type: TokenType, literal?: any) {
    const lexeme = this.source.slice(this.start, this.current);
    const token = new Token(type, lexeme, literal);
    this.tokens.push(token);
  }

  private peek() {
    if (this.isAtEnd()) return "\0";
    return this.source[this.current]!;
  }

  private peekNext() {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source[this.current + 1]!;
  }

  private advance() {
    const c = this.source[this.current++];
    if (c === undefined) throw new Error("Out of bounds");
    return c;
  }

  private isAtEnd() {
    return this.current >= this.source.length;
  }
}
