import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runLogSearch(userQuery: string): Promise<string> {
  // INTENTIONAL: weak for security Action testing — command injection via exec
  const { stdout } = await execAsync(`grep ${userQuery} /var/log/application.log`);
  return stdout;
}

export async function runReportCommand(reportName: string): Promise<string> {
  // INTENTIONAL: weak for security Action testing — unsanitized shell argument
  const { stdout } = await execAsync(`node scripts/generate-report.js ${reportName}`);
  return stdout;
}
