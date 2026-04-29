import { NextRequest, NextResponse } from "next/server";
import { requireInternalGatewayAuth } from "@jumon/auth/internal";
import {
  buildSubscriptionRequiredError,
  isUserBlockedFromMcpProviderAccess
} from "@jumon/domain/mcp-subscription-gate";
import { refreshProviderTokenForUser } from "@jumon/domain/provider-refresh";
import { getProvider } from "@jumon/providers";

type RouteContext = {
  params: Promise<{ provider: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const authResult = await requireInternalGatewayAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { provider } = await context.params;
  if (!getProvider(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  }

  const body = (await request.json()) as { userId?: string };
  if (!body.userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  if (isUserBlockedFromMcpProviderAccess(body.userId)) {
    return NextResponse.json(
      buildSubscriptionRequiredError({
        provider,
        billingContactEmail: process.env.JUMON_BILLING_CONTACT_EMAIL
      }),
      { status: 403 }
    );
  }

  const result = await refreshProviderTokenForUser(body.userId, provider);
  return NextResponse.json(result);
}
