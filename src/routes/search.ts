import { Router } from "express";
import { ZodError } from "zod";
import { HttpError } from "../middleware/errors";
import { searchQuerySchema } from "../middleware/validation";
import { renderSearchPage } from "../services/html";
import { buildSearchMatchesHtml } from "./posts";

export const searchRouter = Router();

searchRouter.get("/search", (req, res, next) => {
  try {
    const { q } = searchQuerySchema.parse(req.query);
    res.type("html").send(renderSearchPage(q, buildSearchMatchesHtml(q)));
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, error.errors.map((e) => e.message).join("; ")));
      return;
    }
    next(error);
  }
});
