import { Router } from "express";
import { lookupUserByUsername, searchUsersByTerm } from "../services/sqlUser";

export const authRouter = Router();

authRouter.get("/user", async (req, res) => {
  const username = String(req.query.name ?? "");
  try {
    const results = await lookupUserByUsername(username);
    res.json({ results });
  } catch (error) {
    res.status(500).json({
      error: "Database lookup failed (expected without a live DB)",
      detail: String(error),
      attemptedUsername: username,
    });
  }
});

authRouter.get("/users/search", async (req, res) => {
  const term = String(req.query.term ?? "");
  try {
    const results = await searchUsersByTerm(term);
    res.json({ results });
  } catch (error) {
    res.status(500).json({
      error: "User search failed (expected without a live DB)",
      detail: String(error),
    });
  }
});
