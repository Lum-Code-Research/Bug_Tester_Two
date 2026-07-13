import {
  add,
  buildPipelineMessage,
  isEven,
} from "./pipelineHelpers";

describe("pipelineHelpers", () => {
  it("adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("detects even numbers", () => {
    expect(isEven(4)).toBe(true);
    expect(isEven(5)).toBe(false);
  });

  it("builds a pipeline success message", () => {
    expect(buildPipelineMessage("Bug_Tester_Two")).toContain("pipeline check passed");
  });
});

describe("CI pipeline smoke tests", () => {
  it("runs in a Node.js environment", () => {
    expect(process.version.startsWith("v")).toBe(true);
  });

  it("can import existing project utilities", () => {
    const { calculateDisplayDuration } = require("../utils/calculateDisplayDuration");
    expect(calculateDisplayDuration(10)).toBeGreaterThanOrEqual(5);
  });

  it("detects GitHub Actions when CI is enabled", () => {
    if (process.env.CI === "true") {
      expect(process.env.GITHUB_ACTIONS).toBe("true");
      expect(process.env.GITHUB_WORKFLOW).toBeTruthy();
    } else {
      expect(process.env.CI).toBeUndefined();
    }
  });
});
