import { addPost, listPosts, searchPosts } from "../../src/services/store";
import { renderSearchPage, renderUserBio } from "../../src/services/html";
import { mergeUserPreferences } from "../../src/services/merge";
import { evaluateUserFormula } from "../../src/services/evalFilter";
import { getPublicStatus } from "../../src/services/secrets";
import { calculateDisplayDuration } from "../../src/utils/calculateDisplayDuration";

describe("BoardLite store", () => {
  it("adds and lists posts", () => {
    const before = listPosts().length;
    const post = addPost("Test", "Hello board");
    expect(post.author).toBe("Test");
    expect(listPosts().length).toBe(before + 1);
  });

  it("searches posts by author or body", () => {
    addPost("SearchUser", "unique-needle-xyz");
    const hits = searchPosts("unique-needle-xyz");
    expect(hits.some((p) => p.body.includes("unique-needle-xyz"))).toBe(true);
  });
});

describe("BoardLite HTML helpers", () => {
  it("includes the search query in the result page", () => {
    // Documents current (unsafe) behavior for Action comparisons
    const html = renderSearchPage("<b>q</b>", "<p>hit</p>");
    expect(html).toContain("<b>q</b>");
  });

  it("includes bio HTML without escaping", () => {
    const html = renderUserBio("Ada", "<img src=x>");
    expect(html).toContain("<img src=x>");
  });
});

describe("BoardLite preferences and formulas", () => {
  it("merges preference keys into the target object", () => {
    const merged = mergeUserPreferences({ theme: "light" }, { compact: true });
    expect(merged.theme).toBe("light");
    expect(merged.compact).toBe(true);
  });

  it("evaluates a simple arithmetic formula", () => {
    expect(evaluateUserFormula("2 + 3")).toBe(5);
  });
});

describe("BoardLite status and timing", () => {
  it("returns status payload with service name", () => {
    const status = getPublicStatus();
    expect(status.service).toBe("BoardLite");
    expect(status.ok).toBe(true);
  });

  it("keeps display duration at least 5 seconds for short text", () => {
    expect(calculateDisplayDuration(3)).toBe(5);
  });
});
