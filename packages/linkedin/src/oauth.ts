import crypto from "node:crypto";
import { z } from "zod";

const LinkedinTokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  refresh_token_expires_in: z.number().optional(),
  scope: z.string().optional()
});

function tokenCipherKey(): Buffer {
  const key = process.env.TOKENS_ENCRYPTION_KEY ?? "";
  if (!key) throw new Error("Missing TOKENS_ENCRYPTION_KEY");
  return crypto.createHash("sha256").update(key).digest();
}

function encrypt(value: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", tokenCipherKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

function decrypt(value: string): string {
  const [ivB64, tagB64, encryptedB64] = value.split(".");
  const decipher = crypto.createDecipheriv("aes-256-gcm", tokenCipherKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(encryptedB64, "base64")),
    decipher.final()
  ]);
  return plain.toString("utf8");
}

export function createOauthState(): string {
  return crypto.randomBytes(24).toString("hex");
}

export function buildLinkedinAuthorizationUrl(input: {
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string;
}): URL {
  const url = new URL("https://www.linkedin.com/oauth/v2/authorization");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("state", input.state);
  url.searchParams.set("scope", input.scope);
  return url;
}

export async function exchangeAuthorizationCode(input: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: input.code,
    client_id: input.clientId,
    client_secret: input.clientSecret,
    redirect_uri: input.redirectUri
  });
  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!response.ok) throw new Error("LinkedIn token exchange failed");

  return LinkedinTokenResponseSchema.parse(await response.json());
}

export async function exchangeRefreshToken(input: {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: input.refreshToken,
    client_id: input.clientId,
    client_secret: input.clientSecret
  });
  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!response.ok) throw new Error("LinkedIn refresh failed");
  return LinkedinTokenResponseSchema.parse(await response.json());
}

export function encryptLinkedinTokens(input: { accessToken: string; refreshToken: string | null }) {
  return {
    accessToken: encrypt(input.accessToken),
    refreshToken: input.refreshToken ? encrypt(input.refreshToken) : null
  };
}

export function decryptLinkedinTokens(input: {
  encryptedAccessToken: string;
  encryptedRefreshToken: string | null;
}) {
  return {
    accessToken: decrypt(input.encryptedAccessToken),
    refreshToken: input.encryptedRefreshToken ? decrypt(input.encryptedRefreshToken) : null
  };
}

export async function linkedinApiRequest(input: {
  accessToken: string;
  resourcePath: string;
  query: Record<string, string>;
}) {
  const url = new URL(`https://api.linkedin.com/rest/${input.resourcePath}`);
  Object.entries(input.query).forEach(([k, v]) => url.searchParams.set(k, v));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${input.accessToken}`,
      "LinkedIn-Version": process.env.LINKEDIN_API_VERSION ?? "202604",
      "X-Restli-Protocol-Version": "2.0.0"
    }
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) throw new Error(typeof body === "string" ? body : JSON.stringify(body));
  return body;
}
