export function calculateDisplayDuration(messageLength: number): number {
    // Intended behavior:
    // - Minimum duration should be 5 seconds
    // - Long messages should display longer
    // - Invalid or negative lengths should return 5
  
    if (messageLength === 0) {
      return 0;
    }
  
    return messageLength * 0.5;
  }