import { getProvider } from "@jumon/providers";
import { decryptLinkedinTokens, encryptLinkedinTokens } from "@jumon/linkedin/oauth";
import { getConnectionByUserIdAndProvider, upsertProviderConnection } from "./connections";

export async function refreshProviderTokenForUser(userId: string, provider: string) {
  const adapter = getProvider(provider);
  if (!adapter) {
    return { refreshed: false as const, reason: "unknown_provider" };
  }

  const connection = await getConnectionByUserIdAndProvider(userId, provider);
  if (!connection) {
    return { refreshed: false as const, reason: "missing_connection" };
  }

  const tokens = decryptLinkedinTokens({
    encryptedAccessToken: connection.encryptedAccessToken,
    encryptedRefreshToken: connection.encryptedRefreshToken
  });

  if (!tokens.refreshToken) {
    return { refreshed: false as const, reason: "no_refresh_token" };
  }

  const refreshed = await adapter.refreshAccessToken({ refreshToken: tokens.refreshToken });

  const encrypted = encryptLinkedinTokens({
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken
  });

  await upsertProviderConnection({
    userId,
    provider,
    encryptedAccessToken: encrypted.accessToken,
    encryptedRefreshToken: encrypted.refreshToken,
    scope: refreshed.scope || connection.scope,
    accessTokenExpiresAt: refreshed.accessTokenExpiresAt,
    refreshTokenExpiresAt: refreshed.refreshTokenExpiresAt,
    providerMetadata: connection.providerMetadata
  });

  return { refreshed: true as const };
}
