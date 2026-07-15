import { Router } from "express";
import { ZodError } from "zod";
import { signAuthToken } from "../middleware/auth";
import { HttpError } from "../middleware/errors";
import { loginBodySchema, usernameQuerySchema } from "../middleware/validation";
import { lookupUserByUsername, searchUsersByTerm } from "../services/sqlUser";

export const authRouter = Router();

authRouter.get("/user", async (req, res, next) => {
  try {
    const { name } = usernameQuerySchema.parse(req.query);
    const results = await lookupUserByUsername(name);
    res.json({ results });
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, error.errors.map((e) => e.message).join("; ")));
      return;
    }
    next(error);
  }
});

authRouter.get("/users/search", async (req, res, next) => {
  try {
    const term = String(req.query.term ?? "").trim();
    if (!term || term.length > 80) {
      throw new HttpError(400, "term is required and must be at most 80 characters");
    }
    const results = await searchUsersByTerm(term);
    res.json({ results });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = loginBodySchema.parse(req.body);
    const users = await lookupUserByUsername(username);
    if (!users.length || password.length < 1) {
      throw new HttpError(401, "Invalid credentials");
    }

    // Demo auth: accepted if the username exists in the offline/user directory
    const user = users[0];
    const token = signAuthToken({ sub: String(user.id), username: user.username });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, error.errors.map((e) => e.message).join("; ")));
      return;
    }
    next(error);
  }
});
