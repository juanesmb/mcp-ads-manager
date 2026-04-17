import { and, eq } from "drizzle-orm";
import { DrizzleQueryError } from "drizzle-orm/errors";
import { getDb } from "./client";
import {
  oauthConnections,
  oauthConnectionEvents,
  oauthConnectionTokens,
  oauthStateNonces
} from "./schema";

export type StoredOauthConnection = {
  userId: string;
  provider: string;
  scope: string;
  encryptedAccessToken: string;
  encryptedRefreshToken: string | null;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date | null;
  providerMetadata: Record<string, unknown>;
};

export async function upsertOauthConnection(input: {
  userId: string;
  provider: string;
  encryptedAccessToken: string;
  encryptedRefreshToken: string | null;
  scope: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date | null;
  providerMetadata?: Record<string, unknown>;
}): Promise<void> {
  const db = getDb();
  const metadata = input.providerMetadata ?? {};

  const [connection] = await db
    .insert(oauthConnections)
    .values({
      clerkUserId: input.userId,
      provider: input.provider,
      status: "connected",
      scope: input.scope,
      providerMetadata: metadata,
      accessTokenExpiresAt: input.accessTokenExpiresAt,
      refreshTokenExpiresAt: input.refreshTokenExpiresAt
    })
    .onConflictDoUpdate({
      target: [oauthConnections.clerkUserId, oauthConnections.provider],
      set: {
        status: "connected",
        scope: input.scope,
        providerMetadata: metadata,
        accessTokenExpiresAt: input.accessTokenExpiresAt,
        refreshTokenExpiresAt: input.refreshTokenExpiresAt,
        updatedAt: new Date()
      }
    })
    .returning({ id: oauthConnections.id });

  await db
    .insert(oauthConnectionTokens)
    .values({
      connectionId: connection.id,
      encryptedAccessToken: input.encryptedAccessToken,
      encryptedRefreshToken: input.encryptedRefreshToken
    })
    .onConflictDoUpdate({
      target: oauthConnectionTokens.connectionId,
      set: {
        encryptedAccessToken: input.encryptedAccessToken,
        encryptedRefreshToken: input.encryptedRefreshToken,
        updatedAt: new Date()
      }
    });

  await db.insert(oauthConnectionEvents).values({
    connectionId: connection.id,
    type: "connection_updated",
    payload: JSON.stringify({ provider: input.provider })
  });
}

export async function selectConnectionByUserIdAndProvider(
  userId: string,
  provider: string
): Promise<StoredOauthConnection | null> {
  const db = getDb();
  try {
    const connRows = await db
      .select({
        id: oauthConnections.id,
        userId: oauthConnections.clerkUserId,
        provider: oauthConnections.provider,
        scope: oauthConnections.scope,
        providerMetadata: oauthConnections.providerMetadata,
        accessTokenExpiresAt: oauthConnections.accessTokenExpiresAt,
        refreshTokenExpiresAt: oauthConnections.refreshTokenExpiresAt
      })
      .from(oauthConnections)
      .where(and(eq(oauthConnections.clerkUserId, userId), eq(oauthConnections.provider, provider)))
      .limit(1);

    const conn = connRows[0];
    if (!conn) return null;

    const tokenRows = await db
      .select({
        encryptedAccessToken: oauthConnectionTokens.encryptedAccessToken,
        encryptedRefreshToken: oauthConnectionTokens.encryptedRefreshToken
      })
      .from(oauthConnectionTokens)
      .where(eq(oauthConnectionTokens.connectionId, conn.id))
      .limit(1);

    const tok = tokenRows[0];
    if (!tok) return null;

    return {
      userId: conn.userId,
      provider: conn.provider,
      scope: conn.scope,
      encryptedAccessToken: tok.encryptedAccessToken,
      encryptedRefreshToken: tok.encryptedRefreshToken,
      accessTokenExpiresAt: conn.accessTokenExpiresAt,
      refreshTokenExpiresAt: conn.refreshTokenExpiresAt,
      providerMetadata: (conn.providerMetadata as Record<string, unknown>) ?? {}
    };
  } catch (e) {
    if (e instanceof DrizzleQueryError && e.cause instanceof Error) {
      throw new Error(`${e.message}\nCause: ${e.cause.message}`, { cause: e.cause });
    }
    throw e;
  }
}

export async function deleteConnectionByUserIdAndProvider(userId: string, provider: string): Promise<void> {
  const db = getDb();
  await db
    .delete(oauthConnections)
    .where(and(eq(oauthConnections.clerkUserId, userId), eq(oauthConnections.provider, provider)));
}

export async function insertOauthStateNonce(input: {
  state: string;
  userId: string;
  provider: string;
}): Promise<void> {
  const db = getDb();
  await db.insert(oauthStateNonces).values({
    state: input.state,
    clerkUserId: input.userId,
    provider: input.provider
  });
}

export async function deleteOauthStateNonce(input: {
  state: string;
  provider: string;
}): Promise<{ userId: string } | null> {
  const db = getDb();
  const rows = await db
    .delete(oauthStateNonces)
    .where(and(eq(oauthStateNonces.state, input.state), eq(oauthStateNonces.provider, input.provider)))
    .returning({ userId: oauthStateNonces.clerkUserId });

  return rows[0] ?? null;
}
