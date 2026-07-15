import { HttpError } from "../middleware/errors";

function tokenize(expression: string): string[] {
  return expression.match(/\d+(\.\d+)?|[+\-*/()]/g) ?? [];
}

function precedence(op: string): number {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  if (op === "u-") return 3;
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

function applyTopOperator(values: number[], op: string): void {
  const b = values.pop();
  if (b === undefined) {
    throw new HttpError(400, "Malformed expression");
  }
  if (op === "u-") {
    values.push(-b);
    return;
  }

  const a = values.pop();
  if (a === undefined) {
    throw new HttpError(400, "Malformed expression");
  }
  values.push(applyOp(a, b, op));
}

/** Safe arithmetic evaluator: numbers and + - * / ( ) only. No eval. */
export function evaluateArithmetic(expression: string): number {
  const tokens = tokenize(expression);
  if (tokens.join("") !== expression.replace(/\s+/g, "")) {
    throw new HttpError(400, "Invalid characters in expression");
  }

  const values: number[] = [];
  const ops: string[] = [];
  let expectsOperand = true;

  for (const token of tokens) {
    if (/^\d+(\.\d+)?$/.test(token)) {
      values.push(Number(token));
      expectsOperand = false;
      continue;
    }
    if (token === "(") {
      ops.push(token);
      expectsOperand = true;
      continue;
    }
    if (token === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        applyTopOperator(values, ops.pop() as string);
      }
      if (!ops.length || ops.pop() !== "(") {
        throw new HttpError(400, "Mismatched parentheses");
      }
      expectsOperand = false;
      continue;
    }
    if (token === "-" && expectsOperand) {
      ops.push("u-");
      continue;
    }

    while (
      ops.length &&
      ops[ops.length - 1] !== "(" &&
      precedence(ops[ops.length - 1]) >= precedence(token)
    ) {
      applyTopOperator(values, ops.pop() as string);
    }
    ops.push(token);
    expectsOperand = true;
  }

  while (ops.length) {
    const op = ops.pop() as string;
    if (op === "(") {
      throw new HttpError(400, "Mismatched parentheses");
    }
    applyTopOperator(values, op);
  }

  if (values.length !== 1) {
    throw new HttpError(400, "Malformed expression");
  }

  return values[0];
}
