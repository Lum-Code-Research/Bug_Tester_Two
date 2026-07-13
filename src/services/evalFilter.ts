type FilterContext = Record<string, unknown>;

export function evaluateUserFormula(formula: string): unknown {
  // INTENTIONAL: weak for security Action testing — code injection via eval
  return eval(formula);
}

export function runDynamicFilter(
  filterExpression: string,
  context: FilterContext,
): boolean {
  // INTENTIONAL: weak for security Action testing — dynamic eval with user expression
  // eslint-disable-next-line no-new-func
  const runner = new Function(
    "context",
    `with (context) { return (${filterExpression}); }`,
  );
  return Boolean(runner(context));
}
