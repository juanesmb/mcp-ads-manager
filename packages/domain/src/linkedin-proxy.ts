import { getConnectionByUserIdAndProvider } from "./connections";
import {
  decryptLinkedinTokens,
  isLinkedinApiError,
  linkedinApiRequest,
  type LinkedinApiError
} from "@jumon/linkedin/oauth";

type Input = {
  userId: string;
  resourcePath: string;
  query: Record<string, string>;
};

type LinkedinProxyDeps = {
  getConnectionByUserId: (userId: string) => ReturnType<typeof getConnectionByUserIdAndProvider>;
  decryptTokens: typeof decryptLinkedinTokens;
  apiRequest: typeof linkedinApiRequest;
};

const defaultDeps: LinkedinProxyDeps = {
  getConnectionByUserId: (userId) => getConnectionByUserIdAndProvider(userId, "linkedin"),
  decryptTokens: decryptLinkedinTokens,
  apiRequest: linkedinApiRequest
};

export async function callLinkedinApiForUser(input: Input, deps: LinkedinProxyDeps = defaultDeps) {
  const connection = await deps.getConnectionByUserId(input.userId);
  if (!connection) {
    return { status: 404, body: { error: "LinkedIn connection not found." } };
  }

  const tokens = deps.decryptTokens({
    encryptedAccessToken: connection.encryptedAccessToken,
    encryptedRefreshToken: connection.encryptedRefreshToken
  });

  try {
    const data = await deps.apiRequest({
      accessToken: tokens.accessToken,
      resourcePath: input.resourcePath,
      query: input.query
    });

    return { status: 200, body: data };
  } catch (error) {
    if (isLinkedinApiError(error)) {
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
