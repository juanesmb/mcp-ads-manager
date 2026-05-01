const DEFAULT_APP_URL_PROD = "https://app.jumonintelligence.com";
const DEFAULT_SITE_URL_PROD = "https://jumonintelligence.com";

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "") || url;
}

/**
 * Origin for CTAs linking into the authenticated product (`app.` subdomain).
 * Default in production: DEFAULT_APP_URL_PROD. Dev: localhost:3000 when unset.
 */
export function getAppBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) return trimTrailingSlash(raw);
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return DEFAULT_APP_URL_PROD;
}

export function getAppHref(): string {
  return `${getAppBaseUrl()}/`;
}

/**
 * Canonical marketing origin (apex). Used for metadataBase / Open Graph.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return trimTrailingSlash(raw);
  if (process.env.NODE_ENV === "development") return "http://localhost:3001";
  return DEFAULT_SITE_URL_PROD;
}
