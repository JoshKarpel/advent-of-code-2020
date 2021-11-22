import { printSolution, readFile, sumReducer } from './util'

type TokenType = '+' | '*' | '(' | ')' | 'number'
type OperatorToken =
    { type: '+', value: undefined } |
    { type: '*', value: undefined }
type Token =
    OperatorToken |
    { type: '(', value: undefined } |
    { type: ')', value: undefined } |
    { type: 'number', value: number }

function lex (equation: string): Array<Token> {
  return equation
    .split(/([\s()])/)
    .filter(t => t !== '' && t !== ' ')
    .map(t => {
      if (t === '+' || t === '*' || t === '(' || t === ')') {
        return { type: t, value: undefined }
      } else {
        return { type: 'number', value: Number(t) }
      }
    })
}

// expression -> grouping | binary
// literal    -> NUMBER
// grouping   -> "(" expression ")"
// binary     -> expression operator expression
// operator   -> "+" | "*"

type Operator = (left: number, right: number) => number

interface Expression {
    evaluate(): number
}

class Literal {
  readonly value: number

  constructor (value: number) {
    this.value = value
  }

  evaluate (): number {
    return this.value
  }
}

class Binary {
  readonly left: Expression
  readonly operator: Operator
  readonly right: Expression

  constructor (left: Expression, operator: Operator, right: Expression) {
    this.left = left
    this.operator = operator
    this.right = right
  }

  evaluate (): number {
    return this.operator(this.left.evaluate(), this.right.evaluate())
  }
}

class Grouping {
  readonly expression: Expression

  constructor (expression: Expression) {
    this.expression = expression
  }

  evaluate (): number {
    return this.expression.evaluate()
  }
}

const add = (left: number, right: number) => left + right
const mul = (left: number, right: number) => left * right

abstract class Parser {
  readonly tokens: Array<Token>
  pointer = 0

  constructor (tokens: Array<Token>) {
    this.tokens = tokens
  }

    abstract parse(): Expression

    match (...types: Array<TokenType>): boolean {
      for (const type of types) {
        if (this.check(type)) {
          this.advance()
          return true
        }
      }
      return false
    }

    consume (type: TokenType, message: string) {
      if (this.check(type)) {
        return this.advance()
      }

      throw new Error(`Got ${this.peek().type} | ${message}`)
    }

    atEnd (): boolean {
      return this.pointer === this.tokens.length
    }

    check (type: TokenType) {
      if (this.atEnd()) {
        return false
      } else {
        return type === this.peek().type
      }
    }

    advance (): Token {
      if (!this.atEnd()) {
        this.pointer += 1
      }
      return this.previous()
    }

    peek (): Token {
      return this.tokens[this.pointer]
    }

    previous (): Token {
      return this.tokens[this.pointer - 1]
    }
}

class ParseFlat extends Parser {
  parse (): Expression {
    return this.binary()
  }

  binary (): Expression {
    let expr = this.expression()

    while (this.match('+', '*')) {
      const operator = this.previous().type === '+' ? add : mul
      const right = this.expression()
      expr = new Binary(expr, operator, right)
    }

    return expr
  }

  expression (): Expression {
    if (this.match('number')) {
      return new Literal(this.previous().value as number)
    } else if (this.match('(')) {
      const expr = this.binary()
      this.consume(')', "Expected ')' after expression.")
      return new Grouping(expr)
    } else {
      throw new Error(`Parse failed at token ${this.peek()}`)
    }
  }
}

class ParseAddBeforeMul extends Parser {
  parse (): Expression {
    return this.mul()
  }

  mul (): Expression {
    let expr = this.add()

    while (this.match('*')) {
      const operator = mul
      const right = this.add()
      expr = new Binary(expr, operator, right)
    }

    return expr
  }

  add (): Expression {
    let expr = this.expression()

    while (this.match('+')) {
      const operator = add
      const right = this.expression()
      expr = new Binary(expr, operator, right)
    }

    return expr
  }

  expression (): Expression {
    if (this.match('number')) {
      return new Literal(this.previous().value as number)
    } else if (this.match('(')) {
      const expr = this.mul()
      this.consume(')', "Expected ')' after expression.")
      return new Grouping(expr)
    } else {
      throw new Error(`Parse failed at token ${this.peek()}`)
    }
  }
}

function evaluateEquations (
  equations: Array<string>,
  ParserCls: new(tokens: Array<Token>) => Parser,
): number {
  return equations
    .map(equation => {
      const tokens = lex(equation)
      const parser = new ParserCls(tokens)
      const expr = parser.parse()
      return expr.evaluate()
    })
    .reduce(sumReducer)
}

const equations = readFile('data/day_18.txt').split('\n')

printSolution(18, 1, evaluateEquations(equations, ParseFlat))
printSolution(18, 2, evaluateEquations(equations, ParseAddBeforeMul))
