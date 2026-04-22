export type ProviderId = "linkedin" | "google";

export type ProviderApiCall = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /** Path relative to the provider API base (no leading slash). */
  path: string;
  query?: Record<string, string>;
  body?: unknown;
  headers?: Record<string, string>;
};

export type ProviderApiResult = {
  status: number;
  body: unknown;
};

export type OAuthTokenBundle = {
  accessToken: string;
  refreshToken: string | null;
  scope: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date | null;
};

export type ProviderAdapter = {
  readonly id: ProviderId;
  readonly displayName: string;
  readonly defaultScopes: string;
  buildAuthorizeUrl(input: { state: string; redirectUri: string }): URL;
  exchangeAuthorizationCode(input: { code: string; redirectUri: string }): Promise<OAuthTokenBundle>;
  refreshAccessToken(input: { refreshToken: string }): Promise<OAuthTokenBundle>;
  callApi(input: {
    call: ProviderApiCall;
    accessToken: string;
    providerMetadata: Record<string, unknown>;
  }): Promise<ProviderApiResult>;
};
