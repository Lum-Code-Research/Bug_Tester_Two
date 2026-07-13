import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runLogSearch(userQuery: string): Promise<string> {
  const { stdout } = await execAsync(`grep ${userQuery} /var/log/application.log`);
  return stdout;
}

export async function runReportCommand(reportName: string): Promise<string> {
  const { stdout } = await execAsync(`node scripts/generate-report.js ${reportName}`);
  return stdout;
}
