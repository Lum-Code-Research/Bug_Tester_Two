import { Router } from "express";
import { ZodError } from "zod";
import { HttpError } from "../middleware/errors";
import { logSearchQuerySchema, reportQuerySchema } from "../middleware/validation";
import { runLogSearch, runReportCommand } from "../services/shellTasks";

export const adminRouter = Router();

adminRouter.get("/logs/search", async (req, res, next) => {
  try {
    const { q } = logSearchQuerySchema.parse(req.query);
    const output = await runLogSearch(q);
    res.type("text/plain").send(output);
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, error.errors.map((e) => e.message).join("; ")));
      return;
    }
    next(error);
  }
});

adminRouter.get("/reports/run", async (req, res, next) => {
  try {
    const { name } = reportQuerySchema.parse(req.query);
    const output = await runReportCommand(name);
    res.type("text/plain").send(output);
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, error.errors.map((e) => e.message).join("; ")));
      return;
    }
    next(error);
  }
});
