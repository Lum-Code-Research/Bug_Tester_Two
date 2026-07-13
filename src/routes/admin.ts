import { Router } from "express";
import { runLogSearch, runReportCommand } from "../services/shellTasks";

export const adminRouter = Router();

adminRouter.get("/logs/search", async (req, res) => {
  const query = String(req.query.q ?? "");
  try {
    const output = await runLogSearch(query);
    res.type("text/plain").send(output);
  } catch (error) {
    res.status(500).type("text/plain").send(String(error));
  }
});

adminRouter.get("/reports/run", async (req, res) => {
  const reportName = String(req.query.name ?? "");
  try {
    const output = await runReportCommand(reportName);
    res.type("text/plain").send(output);
  } catch (error) {
    res.status(500).type("text/plain").send(String(error));
  }
});
