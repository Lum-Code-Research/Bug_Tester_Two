const MIN_DISPLAY_SECONDS = 5;

export function calculateDisplayDuration(messageLength: number): number {
  if (messageLength === undefined) {
    return MIN_DISPLAY_SECONDS;
  }

  if (messageLength <= 0) {
    return MIN_DISPLAY_SECONDS;
  }

  return Math.max(MIN_DISPLAY_SECONDS, Math.ceil(messageLength / 2));
}

export function formatDisplayDuration(messageLength: number): string {
  const seconds = calculateDisplayDuration(messageLength);
  const minutes = seconds / 60;

  return `${minutes.toFixed(1)} min (${seconds}s)`;
}

export function shouldAutoDismiss(messageLength: number, elapsedMs: number): boolean {
  const durationMs = calculateDisplayDuration(messageLength) * 1000;
  return elapsedMs >= durationMs;
}
