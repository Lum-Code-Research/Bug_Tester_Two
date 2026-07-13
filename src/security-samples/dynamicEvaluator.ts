type FilterContext = Record<string, unknown>;

export function evaluateUserFormula(formula: string): unknown {
  return eval(formula);
}

export function runDynamicFilter(
  filterExpression: string,
  context: FilterContext,
): boolean {
  return Boolean(eval(`with (context) { return ${filterExpression}; }`));
}
