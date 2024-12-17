import { Lexer } from "./lexer.js";

export class Jeson {
  static parse(text: string) {
    const lexer = new Lexer(text);
    const tokens = lexer.tokenize();
    console.log(tokens);
  }

  static stringify = JSON.stringify;
}
