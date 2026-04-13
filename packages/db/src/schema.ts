import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

export const oauthConnections = pgTable(
  "oauth_connections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 64 }).notNull(),
    status: varchar("status", { length: 32 }).notNull().default("connected"),
    scope: text("scope").notNull(),
    linkedinMemberId: varchar("linkedin_member_id", { length: 255 }),
    linkedinAccountId: varchar("linkedin_account_id", { length: 255 }),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }).notNull(),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    byUserProviderIdx: index("oauth_connections_user_provider_idx").on(table.clerkUserId, table.provider),
    uniqueUserProviderIdx: uniqueIndex("oauth_connections_user_provider_uniq").on(
      table.clerkUserId,
      table.provider
    ),
    byStatusIdx: index("oauth_connections_status_idx").on(table.status),
    byAccessExpiryIdx: index("oauth_connections_access_expiry_idx").on(table.accessTokenExpiresAt)
  })
);

export const oauthConnectionTokens = pgTable(
  "oauth_connection_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    connectionId: uuid("connection_id").notNull(),
    encryptedAccessToken: text("encrypted_access_token").notNull(),
    encryptedRefreshToken: text("encrypted_refresh_token"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    uniqueConnectionIdx: uniqueIndex("oauth_connection_tokens_connection_uniq").on(table.connectionId)
  })
);

export const oauthConnectionEvents = pgTable("oauth_connection_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  connectionId: uuid("connection_id").notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  payload: text("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const oauthStateNonces = pgTable(
  "oauth_state_nonces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    state: varchar("state", { length: 255 }).notNull(),
    clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    uniqueStateProviderIdx: uniqueIndex("oauth_state_nonces_state_provider_uniq").on(
      table.state,
      table.provider
    ),
    byStateProviderIdx: index("oauth_state_nonces_state_provider_idx").on(table.state, table.provider)
  })
);
