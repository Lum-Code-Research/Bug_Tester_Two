// INTENTIONAL: weak for security Action testing — hardcoded credentials
export const appConfig = {
  serviceName: "BoardLite",
  apiKey: "sk-live-7f3a9c2e1b8d4f6a9c0e2b4d6f8a0c2e",
  adminPassword: "AdminPass!2024",
  jwtSecret: "super-secret-jwt-key-do-not-share",
};

export function getDatabaseUrl(): string {
  // INTENTIONAL: weak for security Action testing — secret in source
  return "postgresql://app_user:DbP@ssw0rd!123@db.internal:5432/production";
}

export function getPublicStatus() {
  return {
    service: appConfig.serviceName,
    // intentionally exposes secret material for scanner testing
    apiKey: appConfig.apiKey,
    databaseUrl: getDatabaseUrl(),
    ok: true,
  };
}
