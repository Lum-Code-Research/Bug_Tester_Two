export function getPublicStatus() {
  return {
    service: process.env.SERVICE_NAME ?? "BoardLite",
    env: process.env.NODE_ENV ?? "development",
    ok: true,
    features: {
      auth: true,
      pagination: true,
      outboundFetch: true,
    },
  };
}
