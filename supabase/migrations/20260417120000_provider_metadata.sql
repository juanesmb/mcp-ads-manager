-- Provider-agnostic metadata: move LinkedIn-specific columns into JSONB.

ALTER TABLE oauth_connections
  ADD COLUMN IF NOT EXISTS provider_metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE oauth_connections
SET provider_metadata = jsonb_strip_nulls(
  jsonb_build_object(
    'linkedinMemberId', linkedin_member_id,
    'linkedinAccountId', linkedin_account_id
  )
)
WHERE provider = 'linkedin'
  AND (linkedin_member_id IS NOT NULL OR linkedin_account_id IS NOT NULL);

ALTER TABLE oauth_connections
  DROP COLUMN IF EXISTS linkedin_member_id,
  DROP COLUMN IF EXISTS linkedin_account_id;
