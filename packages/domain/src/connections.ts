import {
  deleteConnectionByUserIdAndProvider,
  selectConnectionByUserIdAndProvider,
  upsertOauthConnection,
  type StoredOauthConnection
} from "@jumon/db/queries";

export type { StoredOauthConnection };

export type UpsertProviderConnectionInput = {
  userId: string;
  provider: string;
  encryptedAccessToken: string;
  encryptedRefreshToken: string | null;
  scope: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date | null;
  providerMetadata?: Record<string, unknown>;
};

export async function upsertProviderConnection(input: UpsertProviderConnectionInput): Promise<void> {
  await upsertOauthConnection(input);
}

export async function getConnectionByUserIdAndProvider(
  userId: string,
  provider: string
): Promise<StoredOauthConnection | null> {
  return selectConnectionByUserIdAndProvider(userId, provider);
}

export async function disconnectProviderConnection(userId: string, provider: string): Promise<void> {
  await deleteConnectionByUserIdAndProvider(userId, provider);
}

/** @deprecated Use upsertProviderConnection with provider: "linkedin" */
export async function upsertLinkedinConnection(
  input: Omit<UpsertProviderConnectionInput, "provider" | "providerMetadata"> & {
    providerMetadata?: Record<string, unknown>;
  }
): Promise<void> {
  await upsertProviderConnection({ ...input, provider: "linkedin", providerMetadata: input.providerMetadata ?? {} });
}

/** @deprecated Use getConnectionByUserIdAndProvider */
export async function getLinkedinConnectionByUserId(userId: string): Promise<StoredOauthConnection | null> {
  return getConnectionByUserIdAndProvider(userId, "linkedin");
}

/** @deprecated Use disconnectProviderConnection */
export async function disconnectLinkedinConnectionByUserId(userId: string): Promise<void> {
  await disconnectProviderConnection(userId, "linkedin");
}
