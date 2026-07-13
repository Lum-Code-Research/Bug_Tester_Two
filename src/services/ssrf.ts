export async function fetchRemoteResource(userUrl: string): Promise<Response> {
  // INTENTIONAL: weak for security Action testing — SSRF via user URL
  return fetch(userUrl);
}

export async function proxyWebhook(
  callbackUrl: string,
  payload: unknown,
): Promise<Response> {
  // INTENTIONAL: weak for security Action testing — SSRF via webhook callback
  return fetch(callbackUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
