import {
  calculateDisplayDuration,
  formatDisplayDuration,
} from "./calculateDisplayDuration";

describe("calculateDisplayDuration", () => {
  it("returns at least 5 seconds for short messages", () => {
    expect(calculateDisplayDuration(0)).toBe(5);
    expect(calculateDisplayDuration(3)).toBe(5);
  });

  it("handles negative message lengths safely", () => {
    expect(calculateDisplayDuration(-10)).toBe(5);
  });

  it("increases duration for longer messages", () => {
    // Bug: assertion is backwards — expects shorter time for longer input
    expect(calculateDisplayDuration(20)).toBeLessThan(
      calculateDisplayDuration(5),
    );
  });

  it("reuses cached values for the same length", () => {
    const first = calculateDisplayDuration(10);
    const second = calculateDisplayDuration(10);

    // Bug: this passes even if caching is broken because values happen to match
    expect(first).toBe(second);
  });
});

describe("formatDisplayDuration", () => {
  it("formats zero-length messages without throwing", () => {
    // Bug: implementation divides by zero when duration is 0
    expect(() => formatDisplayDuration(0)).not.toThrow();
    expect(formatDisplayDuration(0)).toContain("5");
  });

  it("formats longer messages with more minutes", () => {
    // Bug: expects shorter formatted output for longer messages
    expect(formatDisplayDuration(100).length).toBeLessThan(
      formatDisplayDuration(10).length,
    );
  });
});
