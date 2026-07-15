import { HttpError } from "../middleware/errors";

function tokenize(expression: string): string[] {
  return expression.match(/\d+(\.\d+)?|[+\-*/()]/g) ?? [];
}

function precedence(op: string): number {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
}

function applyOp(a: number, b: number, op: string): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        throw new HttpError(400, "Division by zero");
      }
      return a / b;
    default:
      throw new HttpError(400, "Unsupported operator");
  }
}

/** Safe arithmetic evaluator: numbers and + - * / ( ) only. No eval. */
export function evaluateArithmetic(expression: string): number {
  const tokens = tokenize(expression);
  if (tokens.join("") !== expression.replace(/\s+/g, "")) {
    throw new HttpError(400, "Invalid characters in expression");
  }

  const values: number[] = [];
  const ops: string[] = [];

  for (const token of tokens) {
    if (/^\d+(\.\d+)?$/.test(token)) {
      values.push(Number(token));
      continue;
    }
    if (token === "(") {
      ops.push(token);
      continue;
    }
    if (token === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        const op = ops.pop() as string;
        const b = values.pop();
        const a = values.pop();
        if (a === undefined || b === undefined) {
          throw new HttpError(400, "Malformed expression");
        }
        values.push(applyOp(a, b, op));
      }
      if (!ops.length || ops.pop() !== "(") {
        throw new HttpError(400, "Mismatched parentheses");
      }
      continue;
    }

    while (
      ops.length &&
      ops[ops.length - 1] !== "(" &&
      precedence(ops[ops.length - 1]) >= precedence(token)
    ) {
      const op = ops.pop() as string;
      const b = values.pop();
      const a = values.pop();
      if (a === undefined || b === undefined) {
        throw new HttpError(400, "Malformed expression");
      }
      values.push(applyOp(a, b, op));
    }
    ops.push(token);
  }

  while (ops.length) {
    const op = ops.pop() as string;
    if (op === "(") {
      throw new HttpError(400, "Mismatched parentheses");
    }
    const b = values.pop();
    const a = values.pop();
    if (a === undefined || b === undefined) {
      throw new HttpError(400, "Malformed expression");
    }
    values.push(applyOp(a, b, op));
  }

  if (values.length !== 1) {
    throw new HttpError(400, "Malformed expression");
  }

  return values[0];
}
