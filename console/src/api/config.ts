declare const BASE_URL: string;
declare const TOKEN: string;

const AUTH_TOKEN_KEY = "copaw_auth_token";

/**
 * Get the full API URL with /api prefix
 * @param path - API path (e.g., "/models", "/skills")
 * @returns Full API URL (e.g., "http://localhost:8088/api/models" or "/api/models")
 */
export function getRuntimeBase(): string {
  const configuredBase = (BASE_URL || "")
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/\/$/, "");
  if (configuredBase) {
    return configuredBase.startsWith("/")
      ? configuredBase
      : `/${configuredBase}`;
  }

  const pathname = window.location.pathname;
  if (/^\/console(?:\/|$)/.test(pathname)) {
    return "/console";
  }

  const prefixedConsole = pathname.match(/^(.*)\/console(?:\/|$)/);
  if (prefixedConsole && prefixedConsole[1]) {
    return prefixedConsole[1];
  }

  const copawPrefix = pathname.match(/^\/(copaw\/[^/]+)(?:\/|$)/);
  if (copawPrefix) {
    return `/${copawPrefix[1]}`;
  }

  return "";
}

export function getApiUrl(path: string): string {
  const base = getRuntimeBase();
  const apiPrefix = "/api";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${apiPrefix}${normalizedPath}`;
}

/**
 * Get the API token - checks localStorage first (auth login),
 * then falls back to the build-time TOKEN constant.
 * @returns API token string or empty string
 */
export function getApiToken(): string {
  const stored = localStorage.getItem(AUTH_TOKEN_KEY);
  if (stored) return stored;
  return typeof TOKEN !== "undefined" ? TOKEN : "";
}

/**
 * Store the auth token in localStorage after login.
 */
export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Remove the auth token from localStorage (logout / 401).
 */
export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
