import { NextRequest, NextResponse } from "next/server";
import { requireInternalGatewayAuth } from "@jumon/auth/internal";
import { callProviderApiForUser } from "@jumon/domain/provider-proxy";
import type { ProviderApiCall } from "@jumon/providers";
import { getProvider } from "@jumon/providers";

type RouteContext = {
  params: Promise<{ provider: string }>;
};

type ProxyBody = {
  userId?: string;
  method?: ProviderApiCall["method"];
  path?: string;
  query?: Record<string, string>;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const authResult = await requireInternalGatewayAuth(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { provider } = await context.params;
    if (!getProvider(provider)) {
      return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
    }

    const parsed = (await request.json()) as ProxyBody;
    if (!parsed.userId || !parsed.path || !parsed.method) {
      return NextResponse.json({ error: "Missing userId, path, or method" }, { status: 400 });
    }

    const call: ProviderApiCall = {
      method: parsed.method,
      path: parsed.path,
      query: parsed.query,
      body: parsed.body,
      headers: parsed.headers
    };

    const result = await callProviderApiForUser({
      userId: parsed.userId,
      provider,
      call
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch {
    return NextResponse.json(
      {
        code: "GATEWAY_INTERNAL_ERROR",
        message: "Unexpected internal gateway error while proxying provider request"
      },
      { status: 500 }
    );
  }
}
