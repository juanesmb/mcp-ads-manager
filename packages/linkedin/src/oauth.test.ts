import test from "node:test";
import assert from "node:assert/strict";

import { isLinkedinApiError, linkedinApiRequest } from "./oauth";

test("linkedinApiRequest throws typed LinkedinApiError for invalid params", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        errorDetailType: "com.linkedin.common.error.BadRequest",
        message: "Invalid param",
        errorDetails: {
          inputErrors: [
            {
              description: "Invalid value for param",
              input: { inputPath: { fieldPath: "search" } },
              code: "PARAM_INVALID"
            }
          ]
        },
        status: 400
      }),
      {
        status: 400,
        headers: { "content-type": "application/json" }
      }
    );

  try {
    await assert.rejects(
      () =>
        linkedinApiRequest({
          accessToken: "token",
          resourcePath: "adAccounts",
          query: { q: "search" }
        }),
      (error: unknown) => {
        assert.equal(isLinkedinApiError(error), true);
        if (!isLinkedinApiError(error)) {
          return false;
        }

        assert.equal(error.status, 400);
        assert.equal(error.code, "LINKEDIN_PARAM_INVALID");
        assert.equal(error.inputErrors[0]?.fieldPath, "search");
        return true;
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
