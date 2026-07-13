export async function fetchRemoteResource(userUrl: string): Promise<Response> {
  return fetch(userUrl);
}

export async function proxyWebhook(callbackUrl: string, payload: unknown): Promise<Response> {
  return fetch(callbackUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
