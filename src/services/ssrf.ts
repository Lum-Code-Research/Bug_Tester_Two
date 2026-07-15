import { lookup } from "dns/promises";
import net from "net";
import { Agent, fetch, type Response } from "undici";
import { HttpError } from "../middleware/errors";

const ALLOWED_HOSTS = new Set(
  (process.env.ALLOWED_FETCH_HOSTS ?? "example.com,www.example.com")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean),
);

function isPrivateIp(ip: string): boolean {
  if (ip === "::1") return true;
  if (ip.startsWith("fe80:") || ip.startsWith("fc") || ip.startsWith("fd")) return true;

  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  const [a, b] = parts;
  if (a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

interface SafeOutboundUrl {
  url: URL;
  address: string;
  family: number;
}

async function assertSafeOutboundUrl(rawUrl: string): Promise<SafeOutboundUrl> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new HttpError(400, "Invalid URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new HttpError(400, "Only http and https URLs are allowed");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.has(hostname)) {
    throw new HttpError(400, "Host is not in the allowlist");
  }

  const family = net.isIP(hostname);
  if (family) {
    if (isPrivateIp(hostname)) {
      throw new HttpError(400, "Private IP addresses are not allowed");
    }
    return { url: parsed, address: hostname, family };
  }

  const records = await lookup(hostname, { all: true });
  if (records.some((record) => isPrivateIp(record.address))) {
    throw new HttpError(400, "Host resolves to a private address");
  }

  const [record] = records;
  if (!record) {
    throw new HttpError(400, "Host did not resolve to an address");
  }

  return { url: parsed, address: record.address, family: record.family };
}

function createPinnedDispatcher(address: string, family: number): Agent {
  return new Agent({
    connect: {
      // Reuse the address checked above instead of allowing a second DNS lookup.
      lookup: (_hostname, _options, callback) => callback(null, address, family),
    },
    pipelining: 0,
  });
}

export async function fetchRemoteResource(userUrl: string): Promise<Response> {
  const target = await assertSafeOutboundUrl(userUrl);
  return fetch(target.url, {
    dispatcher: createPinnedDispatcher(target.address, target.family),
    redirect: "error",
    signal: AbortSignal.timeout(5000),
  });
}

export async function proxyWebhook(
  callbackUrl: string,
  payload: unknown,
): Promise<Response> {
  const target = await assertSafeOutboundUrl(callbackUrl);
  return fetch(target.url, {
    dispatcher: createPinnedDispatcher(target.address, target.family),
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "error",
    signal: AbortSignal.timeout(5000),
  });
}
