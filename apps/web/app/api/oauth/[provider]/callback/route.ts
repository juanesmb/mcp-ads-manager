import { NextRequest, NextResponse } from "next/server";
import { upsertProviderConnection } from "@jumon/domain/connections";
import { consumeOauthStateNonce } from "@jumon/domain/oauth-state";
import { getProvider } from "@jumon/providers";
import { encryptLinkedinTokens } from "@jumon/linkedin/oauth";

type RouteContext = {
  params: Promise<{ provider: string }>;
};

function redirectUriForProvider(provider: string): string {
  if (provider === "linkedin") return process.env.LINKEDIN_REDIRECT_URI ?? "";
  if (provider === "google") return process.env.GOOGLE_REDIRECT_URI ?? "";
  return "";
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { provider } = await context.params;
  const adapter = getProvider(provider);
  if (!adapter) {
    return NextResponse.redirect(new URL("/connections?error=unknown_provider", request.url));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(new URL("/connections?error=oauth_denied", request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/connections?error=invalid_callback", request.url));
  }

  const nonce = await consumeOauthStateNonce({ state, provider });
  if (!nonce) {
    return NextResponse.redirect(new URL("/connections?error=invalid_state", request.url));
  }

  const redirectUri = redirectUriForProvider(provider);
  if (!redirectUri) {
    return NextResponse.redirect(new URL("/connections?error=missing_redirect", request.url));
  }

  const bundle = await adapter.exchangeAuthorizationCode({
    code,
    redirectUri
  });

  const encrypted = encryptLinkedinTokens({
    accessToken: bundle.accessToken,
    refreshToken: bundle.refreshToken
  });

  await upsertProviderConnection({
    userId: nonce.userId,
    provider,
    encryptedAccessToken: encrypted.accessToken,
    encryptedRefreshToken: encrypted.refreshToken,
    scope: bundle.scope,
    accessTokenExpiresAt: bundle.accessTokenExpiresAt,
    refreshTokenExpiresAt: bundle.refreshTokenExpiresAt,
    providerMetadata: {}
  });

  return NextResponse.redirect(new URL("/connections?status=connected", request.url));
}
