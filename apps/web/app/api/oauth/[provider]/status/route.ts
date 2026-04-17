import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getConnectionByUserIdAndProvider } from "@jumon/domain/connections";
import { getProvider } from "@jumon/providers";

type RouteContext = {
  params: Promise<{ provider: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { provider } = await context.params;
  if (!getProvider(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  }

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const connection = await getConnectionByUserIdAndProvider(userId, provider);
  return NextResponse.json({
    connected: Boolean(connection),
    scope: connection?.scope ?? null
  });
}
