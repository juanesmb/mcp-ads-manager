import test from "node:test";
import assert from "node:assert/strict";

import { callLinkedinApiForUser, mapLinkedinApiErrorToResponse } from "./linkedin-proxy";
import { LinkedinApiError } from "@jumon/linkedin/oauth";

test("mapLinkedinApiErrorToResponse keeps provider context", () => {
  const error = new LinkedinApiError({
    status: 400,
    code: "LINKEDIN_PARAM_INVALID",
    message: "Invalid param",
    inputErrors: [{ code: "PARAM_INVALID", description: "wrong type", fieldPath: "search" }],
    providerError: {}
  });

  const response = mapLinkedinApiErrorToResponse(error);
  assert.equal(response.status, 400);
  assert.equal(response.body.code, "LINKEDIN_PARAM_INVALID");
  assert.equal(response.body.inputErrors[0]?.fieldPath, "search");
});

test("callLinkedinApiForUser returns 404 when no connection", async () => {
  const response = await callLinkedinApiForUser(
    { userId: "user_123", resourcePath: "adAccounts", query: {} },
    {
      getConnectionByUserId: async () => null,
      decryptTokens: () => ({ accessToken: "access", refreshToken: null }),
      apiRequest: async () => ({})
    }
  );

  assert.equal(response.status, 404);
});

test("callLinkedinApiForUser maps LinkedinApiError to status/body", async () => {
  const response = await callLinkedinApiForUser(
    { userId: "user_123", resourcePath: "adAccounts", query: { q: "search" } },
    {
      getConnectionByUserId: async () =>
        ({
          encryptedAccessToken: "encrypted-access",
          encryptedRefreshToken: null
        }) as never,
      decryptTokens: () => ({ accessToken: "access", refreshToken: null }),
      apiRequest: async () => {
        throw new LinkedinApiError({
          status: 400,
          code: "LINKEDIN_PARAM_INVALID",
          message: "Invalid param",
          inputErrors: [{ code: "PARAM_INVALID", description: "wrong type", fieldPath: "search" }],
          providerError: {}
        });
      }
    }
  );

  assert.equal(response.status, 400);
  assert.equal(response.body.code, "LINKEDIN_PARAM_INVALID");
  assert.equal(response.body.inputErrors[0]?.fieldPath, "search");
});
