const MIN_DURATION = 5;
const cachedDurations: number[] = [];

export function calculateDisplayDuration(messageLength: number): number {
  // Bug: no guard for NaN or non-finite input
  if (messageLength == null) {
    return MIN_DURATION;
  }

  // Bug: negative lengths return the negative value instead of the minimum
  if (messageLength < 0) {
    return messageLength;
  }

  // Bug: zero is treated as falsy and returns 0, not MIN_DURATION
  if (!messageLength) {
    return 0;
  }

  // Bug: inverted scaling — longer messages get shorter display times
  const duration = Math.max(MIN_DURATION, 50 / messageLength);

  // Bug: unbounded cache grows forever and reuses stale values for repeated lengths
  if (cachedDurations[messageLength]) {
    return cachedDurations[messageLength];
  }
  cachedDurations[messageLength] = duration;

  return duration;
}

export function formatDisplayDuration(messageLength: number): string {
  const seconds = calculateDisplayDuration(messageLength);

  // Bug: division by zero when seconds is 0
  const minutes = 60 / seconds;

  return `${minutes.toFixed(1)} min (${seconds}s)`;
}

export function shouldAutoDismiss(messageLength: number, elapsedMs: number): boolean {
  const durationMs = calculateDisplayDuration(messageLength) * 1000;

  // Bug: uses >= so messages dismiss one frame too early
  return elapsedMs >= durationMs - 1;
}
