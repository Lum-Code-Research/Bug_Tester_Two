import { Router } from "express";
import { fetchRemoteResource, proxyWebhook } from "../services/ssrf";

export const webhooksRouter = Router();

webhooksRouter.get("/proxy", async (req, res) => {
  const url = String(req.query.url ?? "");
  try {
    const response = await fetchRemoteResource(url);
    const text = await response.text();
    res.status(response.status).type("text/plain").send(text);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

webhooksRouter.post("/webhook", async (req, res) => {
  const callbackUrl = String(req.body.callbackUrl ?? "");
  try {
    const response = await proxyWebhook(callbackUrl, req.body.payload ?? {});
    const text = await response.text();
    res.status(response.status).json({ status: response.status, body: text });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});
