import { NextRequest, NextResponse } from "next/server";
import { requireInternalGatewayAuth } from "@jumon/auth/internal";
import { getConnectionByUserIdAndProvider } from "@jumon/domain/connections";
import { getProvider } from "@jumon/providers";

type RouteContext = {
  params: Promise<{ provider: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const authResult = await requireInternalGatewayAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { provider } = await context.params;
  if (!getProvider(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  }

  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const connection = await getConnectionByUserIdAndProvider(userId, provider);
  return NextResponse.json({
    connected: Boolean(connection),
    scope: connection?.scope ?? null,
    accessTokenExpiresAt: connection?.accessTokenExpiresAt ?? null,
    refreshTokenExpiresAt: connection?.refreshTokenExpiresAt ?? null,
    providerMetadata: connection?.providerMetadata ?? null
  });
}
