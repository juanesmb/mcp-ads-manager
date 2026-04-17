import { z } from "zod";
import type { OAuthTokenBundle, ProviderAdapter, ProviderApiCall, ProviderApiResult } from "./types";

const GoogleTokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string().optional()
});

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function googleAdsBaseUrl(): string {
  return (process.env.GOOGLE_ADS_API_BASE_URL ?? "https://googleads.googleapis.com").replace(/\/$/, "");
}

function developerToken(): string {
  return requireEnv("GOOGLE_ADS_DEVELOPER_TOKEN");
}

export const googleAdapter: ProviderAdapter = {
  id: "google",
  displayName: "Google Ads",
  defaultScopes: process.env.GOOGLE_SCOPES ?? "https://www.googleapis.com/auth/adwords",

  buildAuthorizeUrl(input: { state: string; redirectUri: string }): URL {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", requireEnv("GOOGLE_CLIENT_ID"));
    url.searchParams.set("redirect_uri", input.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", googleAdapter.defaultScopes);
    url.searchParams.set("state", input.state);
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");
    return url;
  },

  async exchangeAuthorizationCode(input: {
    code: string;
    redirectUri: string;
  }): Promise<OAuthTokenBundle> {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: input.code,
      client_id: requireEnv("GOOGLE_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
      redirect_uri: input.redirectUri
    });
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Google token exchange failed: ${response.status} ${text}`);
    }
    const json = GoogleTokenResponseSchema.parse(await response.json());
    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token ?? null,
      scope: json.scope ?? "",
      accessTokenExpiresAt: new Date(Date.now() + json.expires_in * 1000),
      refreshTokenExpiresAt: null
    };
  },

  async refreshAccessToken(input: { refreshToken: string }): Promise<OAuthTokenBundle> {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: input.refreshToken,
      client_id: requireEnv("GOOGLE_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_CLIENT_SECRET")
    });
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Google refresh failed: ${response.status} ${text}`);
    }
    const json = GoogleTokenResponseSchema.parse(await response.json());
    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token ?? input.refreshToken,
      scope: json.scope ?? "",
      accessTokenExpiresAt: new Date(Date.now() + json.expires_in * 1000),
      refreshTokenExpiresAt: null
    };
  },

  async callApi(input: {
    call: ProviderApiCall;
    accessToken: string;
    providerMetadata: Record<string, unknown>;
  }): Promise<ProviderApiResult> {
    const { call, accessToken, providerMetadata } = input;
    const base = googleAdsBaseUrl();
    const path = call.path.replace(/^\//, "");
    const url = new URL(`${base}/${path}`);
    if (call.query) {
      for (const [k, v] of Object.entries(call.query)) {
        url.searchParams.set(k, v);
      }
    }

    const loginFromMeta =
      typeof providerMetadata.googleLoginCustomerId === "string"
        ? providerMetadata.googleLoginCustomerId
        : undefined;
    const loginCustomerId = call.headers?.["login-customer-id"] ?? loginFromMeta;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": developerToken(),
      ...call.headers
    };
    if (loginCustomerId && !headers["login-customer-id"]) {
      headers["login-customer-id"] = loginCustomerId;
    }

    const init: RequestInit = {
      method: call.method,
      headers: {
        ...headers,
        ...(call.body !== undefined ? { "Content-Type": "application/json" } : {})
      }
    };
    if (call.body !== undefined && call.method !== "GET") {
      init.body = JSON.stringify(call.body);
    }

    const response = await fetch(url, init);
    const contentType = response.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json") ? await response.json() : await response.text();
    return { status: response.status, body };
  }
};
