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

export type LinkedinApiInputError = {
  code: string | null;
  description: string;
  fieldPath: string | null;
};

export type LinkedinApiErrorPayload = {
  status: number;
  code: string;
  message: string;
  inputErrors: LinkedinApiInputError[];
  providerError: unknown;
};

const defaultLinkedinApiErrorCode = "LINKEDIN_API_ERROR";
const paramInvalidCode = "LINKEDIN_PARAM_INVALID";

export class LinkedinApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly inputErrors: LinkedinApiInputError[];
  readonly providerError: unknown;

  constructor(payload: LinkedinApiErrorPayload) {
    super(payload.message);
    this.name = "LinkedinApiError";
    this.status = payload.status;
    this.code = payload.code;
    this.inputErrors = payload.inputErrors;
    this.providerError = payload.providerError;
  }
}

export function isLinkedinApiError(error: unknown): error is LinkedinApiError {
  return error instanceof LinkedinApiError;
}

export async function linkedinApiRequest(input: {
  accessToken: string;
  resourcePath: string;
  query: Record<string, string>;
}) {
  const queryString = serializeLinkedinQueryParams(input.query);
  const linkedinVersion = resolveLinkedinApiVersionHeader(process.env.LINKEDIN_API_VERSION);
  const url = new URL(
    `https://api.linkedin.com/rest/${input.resourcePath}${queryString ? `?${queryString}` : ""}`
  );

  maybeLogLinkedinRequest(url, {
    "LinkedIn-Version": linkedinVersion,
    "X-Restli-Protocol-Version": "2.0.0"
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${input.accessToken}`,
      "LinkedIn-Version": linkedinVersion,
      "X-Restli-Protocol-Version": "2.0.0"
    }
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    throw normalizeLinkedinApiError(response.status, body);
  }
  return body;
}

const minimumLinkedinApiVersion = "202501";

function resolveLinkedinApiVersionHeader(value: string | undefined): string {
  if (!value) {
    return minimumLinkedinApiVersion;
  }

  const normalized = value.trim();
  if (!/^\d{6}$/.test(normalized)) {
    return minimumLinkedinApiVersion;
  }

  if (normalized > currentYearMonth()) {
    return minimumLinkedinApiVersion;
  }

  return normalized;
}

function currentYearMonth(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
}

function serializeLinkedinQueryParams(query: Record<string, string>): string {
  const parts: string[] = [];
  const restliListKeys = new Set([
    "accounts",
    "campaigns",
    "campaignGroups",
    "companies",
    "shares"
  ]);
  const restliTupleKeys = new Set([
    "dateRange",
    "sortBy",
    "campaignType"
  ]);

  for (const [key, value] of Object.entries(query)) {
    const encodedKey = encodeURIComponent(key);
    const normalizedValue = decodeLinkedinQueryValue(value);
    if (key === "fields") {
      const encodedFields = normalizedValue
        .split(",")
        .map((field) => field.trim())
        .filter(Boolean)
        .map((field) => encodeURIComponent(field))
        .join(",");
      parts.push(`${encodedKey}=${encodedFields}`);
      continue;
    }

    if (restliListKeys.has(key)) {
      parts.push(`${encodedKey}=${encodeRestLiList(normalizedValue)}`);
      continue;
    }

    if (restliTupleKeys.has(key)) {
      parts.push(`${encodedKey}=${encodePreservingRestLiSyntax(normalizedValue)}`);
      continue;
    }

    parts.push(`${encodedKey}=${encodeURIComponent(normalizedValue)}`);
  }

  return parts.join("&");
}

function decodeLinkedinQueryValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function encodePreservingRestLiSyntax(value: string): string {
  return encodeURIComponent(value)
    .replace(/%28/gi, "(")
    .replace(/%29/gi, ")")
    .replace(/%3A/gi, ":")
    .replace(/%2C/gi, ",");
}

function encodeRestLiList(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith("List(") || !trimmed.endsWith(")")) {
    return encodePreservingRestLiSyntax(trimmed);
  }

  const inner = trimmed.slice(5, -1);
  const encodedItems = inner
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => encodeURIComponent(item))
    .join(",");

  return `List(${encodedItems})`;
}

function maybeLogLinkedinRequest(url: URL, headers: Record<string, string>): void {
  if (process.env.LINKEDIN_DEBUG_REQUESTS !== "1") {
    return;
  }

  console.info("[linkedinApiRequest] outbound request", {
    url: String(url),
    headers
  });
}

function normalizeLinkedinApiError(status: number, body: unknown): LinkedinApiError {
  const stringBody = typeof body === "string" ? body : JSON.stringify(body);

  if (!body || typeof body !== "object") {
    return new LinkedinApiError({
      status,
      code: defaultLinkedinApiErrorCode,
      message: stringBody || "LinkedIn API request failed",
      inputErrors: [],
      providerError: body
    });
  }

  const bodyRecord = body as Record<string, unknown>;
  const message = asString(bodyRecord.message) ?? stringBody ?? "LinkedIn API request failed";
  const inputErrors = extractInputErrors(bodyRecord.errorDetails);

  const code = inputErrors.length > 0 ? paramInvalidCode : defaultLinkedinApiErrorCode;

  return new LinkedinApiError({
    status,
    code,
    message,
    inputErrors,
    providerError: body
  });
}

function extractInputErrors(errorDetails: unknown): LinkedinApiInputError[] {
  if (!errorDetails || typeof errorDetails !== "object") {
    return [];
  }
  const inputErrors = (errorDetails as Record<string, unknown>).inputErrors;
  if (!Array.isArray(inputErrors)) {
    return [];
  }

  return inputErrors
    .map((entry) => toInputError(entry))
    .filter((entry): entry is LinkedinApiInputError => entry !== null);
}

function toInputError(entry: unknown): LinkedinApiInputError | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const record = entry as Record<string, unknown>;

  const inputPath = record.input;
  let fieldPath: string | null = null;
  if (inputPath && typeof inputPath === "object") {
    const inputPathRecord = inputPath as Record<string, unknown>;
    const nestedInputPath = inputPathRecord.inputPath;
    if (nestedInputPath && typeof nestedInputPath === "object") {
      fieldPath = asString((nestedInputPath as Record<string, unknown>).fieldPath) ?? null;
    }
  }

  return {
    code: asString(record.code) ?? null,
    description: asString(record.description) ?? "Invalid input parameter",
    fieldPath
  };
}

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}
