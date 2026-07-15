import { Router } from "express";
import { ZodError } from "zod";
import { HttpError } from "../middleware/errors";
import { urlQuerySchema, webhookBodySchema } from "../middleware/validation";
import { fetchRemoteResource, proxyWebhook } from "../services/ssrf";

export const webhooksRouter = Router();

webhooksRouter.get("/proxy", async (req, res, next) => {
  try {
    const { url } = urlQuerySchema.parse(req.query);
    const response = await fetchRemoteResource(url);
    const text = await response.text();
    res.status(response.status).type("text/plain").send(text);
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, error.errors.map((e) => e.message).join("; ")));
      return;
    }
    next(error);
  }
});

webhooksRouter.post("/webhook", async (req, res, next) => {
  try {
    const { callbackUrl, payload } = webhookBodySchema.parse(req.body);
    const response = await proxyWebhook(callbackUrl, payload);
    const text = await response.text();
    res.status(response.status).json({ status: response.status, body: text });
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, error.errors.map((e) => e.message).join("; ")));
      return;
    }
    next(error);
  }
});
