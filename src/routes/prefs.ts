import { Router } from "express";
import { applyThemeSettings, mergeUserPreferences } from "../services/merge";
import { evaluateUserFormula, runDynamicFilter } from "../services/evalFilter";
import { getPublicStatus } from "../services/secrets";

export const prefsRouter = Router();

prefsRouter.post("/preferences", (req, res) => {
  const defaults = { theme: "light", compact: false };
  const merged = mergeUserPreferences({ ...defaults }, req.body ?? {});
  const themed = applyThemeSettings(defaults, req.body ?? {});
  res.json({ merged, themed });
});

prefsRouter.post("/evaluate", (req, res) => {
  const formula = String(req.body.formula ?? "");
  res.json({ result: evaluateUserFormula(formula) });
});

prefsRouter.post("/filter", (req, res) => {
  const expression = String(req.body.expression ?? "true");
  const context = (req.body.context ?? {}) as Record<string, unknown>;
  res.json({ matches: runDynamicFilter(expression, context) });
});

prefsRouter.get("/status", (_req, res) => {
  res.json(getPublicStatus());
});
