import { getLinkedinConnectionByUserId, upsertLinkedinConnection } from "./connections";
import { decryptLinkedinTokens, exchangeRefreshToken, encryptLinkedinTokens } from "@jumon/linkedin/oauth";

export async function refreshLinkedinTokenForUser(userId: string) {
  const connection = await getLinkedinConnectionByUserId(userId);
  if (!connection) {
    return { refreshed: false, reason: "missing_connection" };
  }

  const tokens = decryptLinkedinTokens({
    encryptedAccessToken: connection.encryptedAccessToken,
    encryptedRefreshToken: connection.encryptedRefreshToken
  });

  if (!tokens.refreshToken) {
    return { refreshed: false, reason: "no_refresh_token" };
  }

  const refreshed = await exchangeRefreshToken({
    refreshToken: tokens.refreshToken,
    clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? ""
  });

  const encrypted = encryptLinkedinTokens({
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token ?? tokens.refreshToken
  });

  await upsertLinkedinConnection({
    userId,
    encryptedAccessToken: encrypted.accessToken,
    encryptedRefreshToken: encrypted.refreshToken,
    scope: refreshed.scope ?? connection.scope,
    accessTokenExpiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
    refreshTokenExpiresAt: refreshed.refresh_token_expires_in
      ? new Date(Date.now() + refreshed.refresh_token_expires_in * 1000)
      : connection.refreshTokenExpiresAt
  });

  return { refreshed: true };
}
