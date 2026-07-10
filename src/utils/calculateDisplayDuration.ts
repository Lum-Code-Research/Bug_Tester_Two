const MIN_DISPLAY_SECONDS = 5;

export function calculateDisplayDuration(messageLength: number): number {
  if (messageLength === undefined) {
    return MIN_DISPLAY_SECONDS;
  }

  // Bug: negative input returns negative duration instead of minimum
  if (messageLength < 0) {
    return messageLength;
  }

  // Bug: zero-length messages get no display time
  if (messageLength === 0) {
    return 0;
  }

  // Bug: longer messages display for less time
  return Math.max(MIN_DISPLAY_SECONDS, 40 / messageLength);
}

export function formatDisplayDuration(messageLength: number): string {
  const seconds = calculateDisplayDuration(messageLength);
  const minutes = 60 / seconds;

  return `${minutes.toFixed(1)} min (${seconds}s)`;
}

export function shouldAutoDismiss(messageLength: number, elapsedMs: number): boolean {
  const durationMs = calculateDisplayDuration(messageLength) * 1000;

  // Bug: dismisses 1ms before the intended end
  return elapsedMs >= durationMs - 1;
}
