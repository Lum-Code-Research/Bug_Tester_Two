import { Router } from "express";
import { ZodError } from "zod";
import { HttpError } from "../middleware/errors";
import { formulaBodySchema, preferencesSchema } from "../middleware/validation";
import { evaluateArithmetic } from "../services/evalFilter";
import { mergeUserPreferences } from "../services/merge";
import { getPublicStatus } from "../services/secrets";

export const prefsRouter = Router();

prefsRouter.post("/preferences", (req, res, next) => {
  try {
    const input = preferencesSchema.parse(req.body ?? {});
    res.json({ preferences: mergeUserPreferences(input) });
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, error.errors.map((e) => e.message).join("; ")));
      return;
    }
    next(error);
  }
});

prefsRouter.post("/evaluate", (req, res, next) => {
  try {
    const { expression } = formulaBodySchema.parse(req.body);
    res.json({ result: evaluateArithmetic(expression) });
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, error.errors.map((e) => e.message).join("; ")));
      return;
    }
    next(error);
  }
});

prefsRouter.get("/status", (_req, res) => {
  res.json(getPublicStatus());
});
