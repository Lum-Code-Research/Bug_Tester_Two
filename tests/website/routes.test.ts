import request from "supertest";
import { createApp } from "../../src/app";

describe("BoardLite HTTP routes", () => {
  const app = createApp();

  it("serves health check", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("lists posts as JSON", async () => {
    const res = await request(app).get("/api/posts");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("creates a post and returns preview HTML", async () => {
    const res = await request(app)
      .post("/api/posts")
      .send({ author: "CI", body: "pipeline post" });
    expect(res.status).toBe(200);
    expect(res.body.post.body).toBe("pipeline post");
    expect(res.body.previewHtml).toContain("pipeline post");
  });

  it("returns search HTML that includes the query", async () => {
    const res = await request(app).get("/api/search").query({ q: "hello" });
    expect(res.status).toBe(200);
    expect(res.text).toContain("hello");
  });

  it("returns status including intentional secret fields", async () => {
    const res = await request(app).get("/api/status");
    expect(res.status).toBe(200);
    expect(res.body.apiKey).toBeTruthy();
  });
});
