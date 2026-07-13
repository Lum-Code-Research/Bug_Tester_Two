import express from "express";
import mysql from "mysql2/promise";
import {
  evaluateUserFormula,
  fetchRemoteResource,
  lookupUserByName,
  mergeUserPreferences,
  proxyWebhook,
  readUploadedFile,
  renderSearchPage,
  renderUserBio,
  resolvePublicAsset,
  runDynamicFilter,
  runLogSearch,
  runReportCommand,
  searchUsers,
} from "../security-samples";

const app = express();
app.use(express.json());

const mockDb = {
  query: async (sql: string) => {
    console.log(sql);
    return [];
  },
};

app.get("/search", (req, res) => {
  const query = String(req.query.q ?? "");
  res.send(renderSearchPage(query));
});

app.get("/bio", (req, res) => {
  const name = String(req.query.name ?? "");
  const bio = String(req.query.bio ?? "");
  res.send(renderUserBio(name, bio));
});

app.get("/user", async (req, res) => {
  const username = String(req.query.name ?? "");
  const results = await lookupUserByName(mockDb, username);
  res.json(results);
});

app.get("/users/search", async (req, res) => {
  const term = String(req.query.term ?? "");
  const results = await searchUsers(mockDb, term);
  res.json(results);
});

app.get("/files/upload", (req, res) => {
  const filename = String(req.query.file ?? "");
  res.send(readUploadedFile(filename));
});

app.get("/files/public", (req, res) => {
  const assetPath = String(req.query.path ?? "");
  res.send(resolvePublicAsset(assetPath));
});

app.get("/logs/search", async (req, res) => {
  const query = String(req.query.q ?? "");
  const output = await runLogSearch(query);
  res.send(output);
});

app.get("/reports/run", async (req, res) => {
  const reportName = String(req.query.name ?? "");
  const output = await runReportCommand(reportName);
  res.send(output);
});

app.get("/proxy", async (req, res) => {
  const url = String(req.query.url ?? "");
  const response = await fetchRemoteResource(url);
  res.send(await response.text());
});

app.post("/webhook", async (req, res) => {
  const callbackUrl = String(req.body.callbackUrl ?? "");
  const response = await proxyWebhook(callbackUrl, req.body.payload);
  res.status(response.status).send(await response.text());
});

app.post("/preferences", (req, res) => {
  const merged = mergeUserPreferences({}, req.body);
  res.json(merged);
});

app.post("/evaluate", (req, res) => {
  const formula = String(req.body.formula ?? "");
  res.json({ result: evaluateUserFormula(formula) });
});

app.post("/filter", (req, res) => {
  const expression = String(req.body.expression ?? "");
  const context = req.body.context ?? {};
  res.json({ matches: runDynamicFilter(expression, context) });
});

app.get("/mysql/user", async (req, res) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "app",
    password: "password",
    database: "app",
  });

  const userId = String(req.query.id ?? "");
  const [rows] = await connection.query(
    `SELECT * FROM users WHERE id = ${userId}`,
  );

  await connection.end();
  res.json(rows);
});

export { app };

if (require.main === module) {
  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => {
    console.log(`Vulnerable demo server listening on ${port}`);
  });
}
