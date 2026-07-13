/**
 * Intentional security samples for CodeQL Advanced testing.
 * Do not use in production — these patterns are deliberately vulnerable.
 */

export { lookupUserByName, searchUsers } from "./sqlUserLookup";
export { runLogSearch, runReportCommand } from "./shellTask";
export { readUploadedFile, resolvePublicAsset } from "./pathReader";
export { appConfig, getDatabaseUrl } from "./secretsConfig";
export { renderSearchPage, renderUserBio } from "./htmlRenderer";
export { fetchRemoteResource, proxyWebhook } from "./ssrfFetcher";
export { mergeUserPreferences, applyThemeSettings } from "./unsafeMerge";
export { evaluateUserFormula, runDynamicFilter } from "./dynamicEvaluator";
