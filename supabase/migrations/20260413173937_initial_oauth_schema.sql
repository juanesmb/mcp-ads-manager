-- Mirrors remote migration `initial_oauth_schema` (Supabase MCP apply_migration).

CREATE TABLE IF NOT EXISTS oauth_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id varchar(255) NOT NULL,
  provider varchar(64) NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'connected',
  scope text NOT NULL,
  linkedin_member_id varchar(255),
  linkedin_account_id varchar(255),
  access_token_expires_at timestamptz NOT NULL,
  refresh_token_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS oauth_connections_user_provider_uniq ON oauth_connections (clerk_user_id, provider);
CREATE INDEX IF NOT EXISTS oauth_connections_user_provider_idx ON oauth_connections (clerk_user_id, provider);
CREATE INDEX IF NOT EXISTS oauth_connections_status_idx ON oauth_connections (status);
CREATE INDEX IF NOT EXISTS oauth_connections_access_expiry_idx ON oauth_connections (access_token_expires_at);

CREATE TABLE IF NOT EXISTS oauth_connection_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid NOT NULL REFERENCES oauth_connections(id) ON DELETE CASCADE,
  encrypted_access_token text NOT NULL,
  encrypted_refresh_token text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS oauth_connection_tokens_connection_uniq ON oauth_connection_tokens (connection_id);

CREATE TABLE IF NOT EXISTS oauth_connection_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid NOT NULL REFERENCES oauth_connections(id) ON DELETE CASCADE,
  type varchar(64) NOT NULL,
  payload text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS oauth_state_nonces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state varchar(255) NOT NULL,
  clerk_user_id varchar(255) NOT NULL,
  provider varchar(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS oauth_state_nonces_state_provider_uniq ON oauth_state_nonces (state, provider);
CREATE INDEX IF NOT EXISTS oauth_state_nonces_state_provider_idx ON oauth_state_nonces (state, provider);
