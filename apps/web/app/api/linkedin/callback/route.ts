import { NextRequest, NextResponse } from "next/server";
import { consumeOauthStateNonce } from "@jumon/domain/oauth-state";
import { exchangeAuthorizationCode, encryptLinkedinTokens } from "@jumon/linkedin/oauth";
import { upsertLinkedinConnection } from "@jumon/domain/connections";

export async function GET(request: NextRequest) {
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

  const nonce = await consumeOauthStateNonce({ state, provider: "linkedin" });
  if (!nonce) {
    return NextResponse.redirect(new URL("/connections?error=invalid_state", request.url));
  }

  const redirectUri = process.env.LINKEDIN_REDIRECT_URI ?? "";
  const tokenPayload = await exchangeAuthorizationCode({
    code,
    clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
    redirectUri
  });

  const encrypted = encryptLinkedinTokens({
    accessToken: tokenPayload.access_token,
    refreshToken: tokenPayload.refresh_token ?? null
  });

  await upsertLinkedinConnection({
    userId: nonce.userId,
    encryptedAccessToken: encrypted.accessToken,
    encryptedRefreshToken: encrypted.refreshToken,
    scope: tokenPayload.scope ?? "",
    accessTokenExpiresAt: new Date(Date.now() + tokenPayload.expires_in * 1000),
    refreshTokenExpiresAt: tokenPayload.refresh_token_expires_in
      ? new Date(Date.now() + tokenPayload.refresh_token_expires_in * 1000)
      : null
  });

  return NextResponse.redirect(new URL("/connections?status=connected", request.url));
}
