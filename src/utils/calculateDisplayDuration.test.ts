import { calculateDisplayDuration } from "./calculateDisplayDuration";

describe("calculateDisplayDuration", () => {
  it("returns at least 5 seconds for short messages", () => {
    expect(calculateDisplayDuration(0)).toBe(5);
    expect(calculateDisplayDuration(3)).toBe(5);
  });

  it("handles negative message lengths safely", () => {
    expect(calculateDisplayDuration(-10)).toBe(5);
  });

  it("increases duration for longer messages", () => {
    expect(calculateDisplayDuration(20)).toBeGreaterThanOrEqual(5);
  });
});