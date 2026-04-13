import { NextRequest, NextResponse } from "next/server";
import { requireInternalGatewayAuth } from "@jumon/auth/internal";
import { getLinkedinConnectionByUserId } from "@jumon/domain/connections";

export async function GET(request: NextRequest) {
  const authResult = await requireInternalGatewayAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const connection = await getLinkedinConnectionByUserId(userId);
  return NextResponse.json({ connected: Boolean(connection), connection });
}
