import {
  calculateDisplayDuration,
  formatDisplayDuration,
  shouldAutoDismiss,
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
    expect(calculateDisplayDuration(20)).toBeGreaterThan(
      calculateDisplayDuration(5),
    );
  });
});

describe("formatDisplayDuration", () => {
  it("formats zero-length messages without throwing", () => {
    expect(() => formatDisplayDuration(0)).not.toThrow();
    expect(formatDisplayDuration(0)).toContain("5");
  });

  it("formats longer messages with more minutes", () => {
    expect(formatDisplayDuration(100).length).toBeGreaterThan(
      formatDisplayDuration(10).length,
    );
  });
});

describe("shouldAutoDismiss", () => {
  it("does not dismiss before the display duration ends", () => {
    expect(shouldAutoDismiss(10, 4999)).toBe(false);
  });
});
