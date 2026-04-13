import { NextRequest, NextResponse } from "next/server";
import { requireInternalGatewayAuth } from "@jumon/auth/internal";
import { callLinkedinApiForUser } from "@jumon/domain/linkedin-proxy";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const authResult = await requireInternalGatewayAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await context.params;
  const body = (await request.json()) as { userId?: string; query?: Record<string, string> };
  if (!body.userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const result = await callLinkedinApiForUser({
    userId: body.userId,
    resourcePath: path.join("/"),
    query: body.query ?? {}
  });

  return NextResponse.json(result.body, { status: result.status });
}
