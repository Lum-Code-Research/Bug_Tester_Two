import { Router } from "express";
import { ZodError } from "zod";
import { HttpError } from "../middleware/errors";
import {
  bioQuerySchema,
  createPostSchema,
  paginationSchema,
} from "../middleware/validation";
import { escapeHtml, renderPostPreview, renderUserBio } from "../services/html";
import { addPost, listPosts, searchPosts } from "../services/store";
import { calculateDisplayDuration } from "../utils/calculateDisplayDuration";

export const postsRouter = Router();

function parseOrThrow<T>(schema: { parse: (data: unknown) => T }, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError(400, error.errors.map((e) => e.message).join("; "));
    }
    throw error;
  }
}

postsRouter.get("/posts", (req, res, next) => {
  try {
    const { limit, offset } = parseOrThrow(paginationSchema, req.query);
    res.json(listPosts(limit, offset));
  } catch (error) {
    next(error);
  }
});

postsRouter.post("/posts", (req, res, next) => {
  try {
    const { author, body } = parseOrThrow(createPostSchema, req.body);
    const post = addPost(author, body);
    res.status(201).json({
      post,
      previewHtml: renderPostPreview(author, body),
      displaySeconds: calculateDisplayDuration(body.length),
    });
  } catch (error) {
    next(error);
  }
});

postsRouter.get("/bio", (req, res, next) => {
  try {
    const { name, bio } = parseOrThrow(bioQuerySchema, req.query);
    res.type("html").send(renderUserBio(name, bio));
  } catch (error) {
    next(error);
  }
});

export function buildSearchMatchesHtml(query: string): string {
  return searchPosts(query)
    .map(
      (post) =>
        `<p><strong>${escapeHtml(post.author)}</strong>: ${escapeHtml(post.body)}</p>`,
    )
    .join("");
}
