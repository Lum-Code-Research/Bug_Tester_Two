import express from "express";
import path from "path";
import { adminRouter } from "./routes/admin";
import { authRouter } from "./routes/auth";
import { filesRouter } from "./routes/files";
import { postsRouter } from "./routes/posts";
import { prefsRouter } from "./routes/prefs";
import { searchRouter } from "./routes/search";
import { webhooksRouter } from "./routes/webhooks";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(process.cwd(), "public")));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api", postsRouter);
  app.use("/api", searchRouter);
  app.use("/api", authRouter);
  app.use("/api", adminRouter);
  app.use("/api", filesRouter);
  app.use("/api", webhooksRouter);
  app.use("/api", prefsRouter);

  return app;
}

const app = createApp();

if (require.main === module) {
  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => {
    console.log(`BoardLite listening on http://localhost:${port}`);
  });
}

export { app };
