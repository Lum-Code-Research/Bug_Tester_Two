import { escapeHtml, renderSearchPage, renderUserBio } from "../../src/services/html";
import { mergeUserPreferences } from "../../src/services/merge";
import { evaluateArithmetic } from "../../src/services/evalFilter";
import { getPublicStatus } from "../../src/services/secrets";
import { readUploadedFile, resolvePublicAsset } from "../../src/services/pathReader";
import { addPost, listPosts, searchPosts } from "../../src/services/store";
import { verifyAuthToken, signAuthToken } from "../../src/middleware/auth";
import { calculateDisplayDuration } from "../../src/utils/calculateDisplayDuration";
import { HttpError } from "../../src/middleware/errors";

describe("BoardLite store", () => {
  it("paginates posts", () => {
    addPost("Pager", "page-me");
    const page = listPosts(1, 0);
    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(1);
  });

  it("searches posts by body", () => {
    addPost("SearchUser", "unique-needle-xyz");
    expect(searchPosts("unique-needle-xyz").some((p) => p.body.includes("unique-needle-xyz"))).toBe(
      true,
    );
  });
});

describe("BoardLite HTML helpers", () => {
  it("escapes HTML in search output", () => {
    const html = renderSearchPage("<script>alert(1)</script>", "<p>hit</p>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  it("escapes bio content", () => {
    const html = renderUserBio("Ada", "<img src=x>");
    expect(html).toContain("&lt;img src=x&gt;");
  });

  it("escapeHtml encodes reserved characters", () => {
    expect(escapeHtml(`a&b<"'>`)).toBe("a&amp;b&lt;&quot;&#39;&gt;");
  });
});

describe("BoardLite preferences and formulas", () => {
  it("merges only known preference keys", () => {
    const merged = mergeUserPreferences({ theme: "dark", compact: true });
    expect(merged).toEqual({ theme: "dark", compact: true });
  });

  it("evaluates arithmetic without eval", () => {
    expect(evaluateArithmetic("(2 + 3) * 4")).toBe(20);
  });

  it("evaluates unary minus expressions", () => {
    expect(evaluateArithmetic("-1")).toBe(-1);
    expect(evaluateArithmetic("-(2 + 3)")).toBe(-5);
    expect(evaluateArithmetic("2 * -3")).toBe(-6);
  });

  it("rejects division by zero", () => {
    expect(() => evaluateArithmetic("1 / 0")).toThrow(HttpError);
  });
});

describe("BoardLite path and auth helpers", () => {
  it("blocks path traversal for uploads", () => {
    expect(() => readUploadedFile("../package.json")).toThrow(HttpError);
  });

  it("blocks path traversal for public assets", () => {
    expect(() => resolvePublicAsset("../package.json")).toThrow(HttpError);
  });

  it("reads a valid uploaded file", () => {
    expect(readUploadedFile("notes.txt")).toContain("BoardLite");
  });

  it("rejects forged JWT tokens", () => {
    expect(() => verifyAuthToken("not.a.token")).toThrow(HttpError);
  });

  it("preserves invalid JWT payload errors", () => {
    const token = signAuthToken({ sub: "", username: "ada" });
    expect(() => verifyAuthToken(token)).toThrow("Invalid token payload");
  });

  it("round-trips a valid JWT", () => {
    const token = signAuthToken({ sub: "1", username: "ada" });
    expect(verifyAuthToken(token)).toEqual({ sub: "1", username: "ada" });
  });
});

describe("BoardLite status and timing", () => {
  it("returns public status without secrets", () => {
    const status = getPublicStatus();
    expect(status.service).toBe("BoardLite");
    expect(status.ok).toBe(true);
    expect(status).not.toHaveProperty("apiKey");
    expect(status).not.toHaveProperty("databaseUrl");
  });

  it("keeps display duration at least 5 seconds for short text", () => {
    expect(calculateDisplayDuration(3)).toBe(5);
  });
});
