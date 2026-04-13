import { getLinkedinConnectionByUserId } from "./connections";
import { decryptLinkedinTokens, linkedinApiRequest } from "@jumon/linkedin/oauth";

type Input = {
  userId: string;
  resourcePath: string;
  query: Record<string, string>;
};

export async function callLinkedinApiForUser(input: Input) {
  const connection = await getLinkedinConnectionByUserId(input.userId);
  if (!connection) {
    return { status: 404, body: { error: "LinkedIn connection not found." } };
  }

  const tokens = decryptLinkedinTokens({
    encryptedAccessToken: connection.encryptedAccessToken,
    encryptedRefreshToken: connection.encryptedRefreshToken
  });

  const data = await linkedinApiRequest({
    accessToken: tokens.accessToken,
    resourcePath: input.resourcePath,
    query: input.query
  });

  return { status: 200, body: data };
}
