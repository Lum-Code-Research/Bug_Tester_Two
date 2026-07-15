import request from "supertest";
import { createApp } from "../../src/app";

describe("BoardLite HTTP routes", () => {
  const app = createApp();

  it("serves health check", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("lists posts with pagination envelope", async () => {
    const res = await request(app).get("/api/posts").query({ limit: 10, offset: 0 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(typeof res.body.total).toBe("number");
  });

  it("creates a post and returns escaped preview HTML", async () => {
    const res = await request(app)
      .post("/api/posts")
      .send({ author: "CI", body: "<b>pipeline</b>" });
    expect(res.status).toBe(201);
    expect(res.body.post.body).toBe("<b>pipeline</b>");
    expect(res.body.previewHtml).toContain("&lt;b&gt;pipeline&lt;/b&gt;");
  });

  it("rejects invalid posts", async () => {
    const res = await request(app).post("/api/posts").send({ author: "", body: "" });
    expect(res.status).toBe(400);
  });

  it("returns escaped search HTML", async () => {
    const res = await request(app).get("/api/search").query({ q: "<em>hi</em>" });
    expect(res.status).toBe(200);
    expect(res.text).toContain("&lt;em&gt;hi&lt;/em&gt;");
  });

  it("returns status without secrets", async () => {
    const res = await request(app).get("/api/status");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.apiKey).toBeUndefined();
  });

  it("issues a login token for a known offline user", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "ada", password: "any-password" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it("rejects outbound fetch to non-allowlisted hosts", async () => {
    const res = await request(app)
      .get("/api/proxy")
      .query({ url: "http://127.0.0.1/" });
    expect(res.status).toBe(400);
  });

  it("evaluates safe arithmetic expressions", async () => {
    const res = await request(app)
      .post("/api/evaluate")
      .send({ expression: "2 + 3 * 4" });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(14);
  });
});
