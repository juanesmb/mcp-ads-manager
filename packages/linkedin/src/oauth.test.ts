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

test("linkedinApiRequest preserves comma-separated fields projection", async () => {
  const originalFetch = globalThis.fetch;
  let calledURL = "";
  globalThis.fetch = async (input) => {
    calledURL = String(input);
    return new Response(JSON.stringify({ elements: [] }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };

  try {
    await linkedinApiRequest({
      accessToken: "token",
      resourcePath: "adAnalytics",
      query: {
        q: "analytics",
        fields: "impressions,clicks,costInLocalCurrency"
      }
    });

    assert.match(
      calledURL,
      /fields=impressions,clicks,costInLocalCurrency/
    );
    assert.ok(!calledURL.includes("fields=impressions%2Cclicks"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("linkedinApiRequest decodes pre-encoded fields before serialization", async () => {
  const originalFetch = globalThis.fetch;
  let calledURL = "";
  globalThis.fetch = async (input) => {
    calledURL = String(input);
    return new Response(JSON.stringify({ elements: [] }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };

  try {
    await linkedinApiRequest({
      accessToken: "token",
      resourcePath: "adAnalytics",
      query: {
        q: "analytics",
        fields: "impressions%2Cclicks%2CcostInLocalCurrency"
      }
    });

    assert.match(
      calledURL,
      /fields=impressions,clicks,costInLocalCurrency/
    );
    assert.ok(!calledURL.includes("%252C"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("linkedinApiRequest falls back to supported LinkedIn version when env is future month", async () => {
  const originalFetch = globalThis.fetch;
  const originalVersion = process.env.LINKEDIN_API_VERSION;
  let capturedVersionHeader = "";
  process.env.LINKEDIN_API_VERSION = "209912";

  globalThis.fetch = async (_input, init) => {
    const headers = init?.headers as Record<string, string>;
    capturedVersionHeader = headers["LinkedIn-Version"];
    return new Response(JSON.stringify({ elements: [] }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };

  try {
    await linkedinApiRequest({
      accessToken: "token",
      resourcePath: "adAnalytics",
      query: {
        q: "analytics",
        fields: "impressions,clicks,costInLocalCurrency"
      }
    });

    assert.equal(capturedVersionHeader, "202501");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalVersion === undefined) {
      delete process.env.LINKEDIN_API_VERSION;
    } else {
      process.env.LINKEDIN_API_VERSION = originalVersion;
    }
  }
});

test("linkedinApiRequest preserves RestLi syntax for structured params", async () => {
  const originalFetch = globalThis.fetch;
  let calledURL = "";
  globalThis.fetch = async (input) => {
    calledURL = String(input);
    return new Response(JSON.stringify({ elements: [] }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };

  try {
    await linkedinApiRequest({
      accessToken: "token",
      resourcePath: "adAnalytics",
      query: {
        q: "analytics",
        dateRange: "(start:(year:2025,month:1,day:1),end:(year:2026,month:4,day:15))",
        accounts: "List(urn:li:sponsoredAccount:512247261)",
        campaigns: "List(urn:li:sponsoredCampaign:474763193)",
        fields: "impressions,clicks,costInLocalCurrency"
      }
    });

    assert.match(
      calledURL,
      /dateRange=\(start:\(year:2025,month:1,day:1\),end:\(year:2026,month:4,day:15\)\)/
    );
    assert.match(calledURL, /accounts=List\(urn%3Ali%3AsponsoredAccount%3A512247261\)/);
    assert.match(calledURL, /campaigns=List\(urn%3Ali%3AsponsoredCampaign%3A474763193\)/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("linkedinApiRequest preserves encoded URNs for pre-encoded RestLi lists", async () => {
  const originalFetch = globalThis.fetch;
  let calledURL = "";
  globalThis.fetch = async (input) => {
    calledURL = String(input);
    return new Response(JSON.stringify({ elements: [] }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };

  try {
    await linkedinApiRequest({
      accessToken: "token",
      resourcePath: "adAnalytics",
      query: {
        q: "analytics",
        accounts: "List(urn%3Ali%3AsponsoredAccount%3A512247261)",
        fields: "impressions,clicks"
      }
    });

    assert.match(calledURL, /accounts=List\(urn%3Ali%3AsponsoredAccount%3A512247261\)/);
    assert.ok(!calledURL.includes("accounts=List(urn:li:sponsoredAccount:512247261)"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("linkedinApiRequest preserves RestLi syntax for search composite", async () => {
  const originalFetch = globalThis.fetch;
  let calledURL = "";
  globalThis.fetch = async (input) => {
    calledURL = String(input);
    return new Response(JSON.stringify({ elements: [] }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };

  try {
    await linkedinApiRequest({
      accessToken: "token",
      resourcePath: "adAccounts",
      query: {
        q: "search",
        search: "(status:(values:List(ACTIVE)))",
        count: "1000"
      }
    });

    assert.match(calledURL, /search=\(status:\(values:List\(ACTIVE\)\)\)/);
    assert.ok(!calledURL.includes("search=%28status%3A"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
