import {
  buildLinkedinAuthorizationUrl,
  exchangeAuthorizationCode as liExchangeCode,
  exchangeRefreshToken as liRefresh,
  linkedinApiRequest
} from "@jumon/linkedin/oauth";
import type { OAuthTokenBundle, ProviderAdapter, ProviderApiCall, ProviderApiResult } from "./types";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

export const linkedinAdapter: ProviderAdapter = {
  id: "linkedin",
  displayName: "LinkedIn",
  defaultScopes: process.env.LINKEDIN_SCOPES ?? "r_ads r_ads_reporting",

  buildAuthorizeUrl(input: { state: string; redirectUri: string }): URL {
    return buildLinkedinAuthorizationUrl({
      clientId: requireEnv("LINKEDIN_CLIENT_ID"),
      redirectUri: input.redirectUri,
      state: input.state,
      scope: linkedinAdapter.defaultScopes
    });
  },

  async exchangeAuthorizationCode(input: {
    code: string;
    redirectUri: string;
  }): Promise<OAuthTokenBundle> {
    const tokenPayload = await liExchangeCode({
      code: input.code,
      clientId: requireEnv("LINKEDIN_CLIENT_ID"),
      clientSecret: requireEnv("LINKEDIN_CLIENT_SECRET"),
      redirectUri: input.redirectUri
    });

    return {
      accessToken: tokenPayload.access_token,
      refreshToken: tokenPayload.refresh_token ?? null,
      scope: tokenPayload.scope ?? "",
      accessTokenExpiresAt: new Date(Date.now() + tokenPayload.expires_in * 1000),
      refreshTokenExpiresAt: tokenPayload.refresh_token_expires_in
        ? new Date(Date.now() + tokenPayload.refresh_token_expires_in * 1000)
        : null
    };
  },

  async refreshAccessToken(input: { refreshToken: string }): Promise<OAuthTokenBundle> {
    const refreshed = await liRefresh({
      refreshToken: input.refreshToken,
      clientId: requireEnv("LINKEDIN_CLIENT_ID"),
      clientSecret: requireEnv("LINKEDIN_CLIENT_SECRET")
    });

    return {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? input.refreshToken,
      scope: refreshed.scope ?? "",
      accessTokenExpiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
      refreshTokenExpiresAt: refreshed.refresh_token_expires_in
        ? new Date(Date.now() + refreshed.refresh_token_expires_in * 1000)
        : null
    };
  },

  async callApi(input: {
    call: ProviderApiCall;
    accessToken: string;
    providerMetadata: Record<string, unknown>;
  }): Promise<ProviderApiResult> {
    const { call, accessToken } = input;
    if (call.method !== "GET") {
      throw new Error(`LinkedIn adapter only supports GET, got ${call.method}`);
    }
    const data = await linkedinApiRequest({
      accessToken,
      resourcePath: call.path.replace(/^\//, ""),
      query: call.query ?? {},
      ...(call.headers ? { headers: call.headers } : {})
    });
    return { status: 200, body: data };
  }
};
