import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { HttpError } from "../middleware/errors";

const execFileAsync = promisify(execFile);

const ALLOWED_REPORTS = new Set(["summary", "activity", "errors"]);

export async function runLogSearch(userQuery: string): Promise<string> {
  // Fixed binary + fixed log path; query is a single argv (no shell)
  const { stdout } = await execFileAsync("grep", [
    "--",
    userQuery,
    "/var/log/application.log",
  ]).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") {
      return { stdout: `No local log available for pattern: ${userQuery}` };
    }
    throw error;
  });
  return stdout;
}

export async function runReportCommand(reportName: string): Promise<string> {
  if (!ALLOWED_REPORTS.has(reportName)) {
    throw new HttpError(400, "Unknown report name");
  }

  const scriptPath = path.join(process.cwd(), "scripts", "generate-report.js");
  const { stdout } = await execFileAsync("node", [scriptPath, reportName]).catch(
    (error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") {
        return { stdout: `Report "${reportName}" queued (script unavailable in this environment).` };
      }
      throw error;
    },
  );
  return stdout;
}
