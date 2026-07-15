import express from "express";
import path from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorHandler, requestLogger } from "./middleware/errors";
import { adminRouter } from "./routes/admin";
import { authRouter } from "./routes/auth";
import { filesRouter } from "./routes/files";
import { postsRouter } from "./routes/posts";
import { prefsRouter } from "./routes/prefs";
import { searchRouter } from "./routes/search";
import { webhooksRouter } from "./routes/webhooks";

export function createApp() {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(requestLogger);
  app.use(express.json({ limit: "32kb" }));
  app.use(express.urlencoded({ extended: false }));
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

  app.use(errorHandler);
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
