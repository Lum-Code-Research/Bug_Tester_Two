export function add(a: number, b: number): number {
  return a + b;
}

export function isEven(value: number): boolean {
  return value % 2 === 0;
}

export function buildPipelineMessage(appName: string): string {
  return `${appName} pipeline check passed`;
}
