import { NextRequest, NextResponse } from "next/server";
import { requireInternalGatewayAuth } from "@jumon/auth/internal";
import { refreshLinkedinTokenForUser } from "@jumon/domain/linkedin-refresh";

export async function POST(request: NextRequest) {
  const authResult = await requireInternalGatewayAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { userId?: string };
  if (!body.userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const result = await refreshLinkedinTokenForUser(body.userId);
  return NextResponse.json(result);
}
