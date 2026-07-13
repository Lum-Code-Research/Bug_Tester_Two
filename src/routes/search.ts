import { Router } from "express";
import { renderSearchPage } from "../services/html";
import { buildSearchMatchesHtml } from "./posts";

export const searchRouter = Router();

searchRouter.get("/search", (req, res) => {
  const query = String(req.query.q ?? "");
  const matchesHtml = buildSearchMatchesHtml(query);
  res.send(renderSearchPage(query, matchesHtml));
});
