import { Router } from "express";
import { addPost, listPosts, searchPosts } from "../services/store";
import { renderPostPreview, renderUserBio } from "../services/html";
import { calculateDisplayDuration } from "../utils/calculateDisplayDuration";

export const postsRouter = Router();

postsRouter.get("/posts", (_req, res) => {
  res.json(listPosts());
});

postsRouter.post("/posts", (req, res) => {
  const author = String(req.body.author ?? "anon");
  const body = String(req.body.body ?? "");
  const post = addPost(author, body);
  const previewHtml = renderPostPreview(author, body);
  res.json({
    post,
    previewHtml,
    displaySeconds: calculateDisplayDuration(body.length),
  });
});

postsRouter.get("/bio", (req, res) => {
  const name = String(req.query.name ?? "");
  const bio = String(req.query.bio ?? "");
  res.send(renderUserBio(name, bio));
});

export function buildSearchMatchesHtml(query: string): string {
  return searchPosts(query)
    .map((post) => `<p><strong>${post.author}</strong>: ${post.body}</p>`)
    .join("");
}
