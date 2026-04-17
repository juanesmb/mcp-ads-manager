import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { disconnectProviderConnection } from "@jumon/domain/connections";
import { getProvider } from "@jumon/providers";

type RouteContext = {
  params: Promise<{ provider: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { provider } = await context.params;
  if (!getProvider(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url), 303);
  }

  await disconnectProviderConnection(userId, provider);

  return NextResponse.redirect(new URL("/connections?status=disconnected", request.url), 303);
}
