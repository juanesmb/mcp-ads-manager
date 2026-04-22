import { getProvider } from "@jumon/providers";
import type { ProviderApiCall } from "@jumon/providers";
import {
  decryptLinkedinTokens,
  isLinkedinApiError,
  type LinkedinApiError
} from "@jumon/linkedin/oauth";
import { getConnectionByUserIdAndProvider } from "./connections";

type Input = {
  userId: string;
  provider: string;
  call: ProviderApiCall;
};

type ProxyDeps = {
  getConnection: typeof getConnectionByUserIdAndProvider;
};

const defaultDeps: ProxyDeps = {
  getConnection: getConnectionByUserIdAndProvider
};

export async function callProviderApiForUser(input: Input, deps: ProxyDeps = defaultDeps) {
  const adapter = getProvider(input.provider);
  if (!adapter) {
    return { status: 404, body: { error: "Unknown provider.", code: "UNKNOWN_PROVIDER" } };
  }

  const connection = await deps.getConnection(input.userId, input.provider);
  if (!connection) {
    return {
      status: 404,
      body: { error: `${adapter.displayName} connection not found.`, code: "CONNECTION_NOT_FOUND" }
    };
  }

  const tokens = decryptLinkedinTokens({
    encryptedAccessToken: connection.encryptedAccessToken,
    encryptedRefreshToken: connection.encryptedRefreshToken
  });

  try {
    return await adapter.callApi({
      call: input.call,
      accessToken: tokens.accessToken,
      providerMetadata: connection.providerMetadata
    });
  } catch (error) {
    if (input.provider === "linkedin" && isLinkedinApiError(error)) {
      return mapLinkedinApiErrorToResponse(error);
    }
    throw error;
  }
}

export function mapLinkedinApiErrorToResponse(error: LinkedinApiError) {
  return {
    status: error.status,
    body: {
      code: error.code,
      message: error.message,
      providerStatus: error.status,
      inputErrors: error.inputErrors
    }
  };
}
