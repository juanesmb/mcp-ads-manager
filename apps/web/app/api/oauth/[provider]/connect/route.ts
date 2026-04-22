import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { saveOauthStateNonce } from "@jumon/domain/oauth-state";
import { getProvider } from "@jumon/providers";
import { createOauthState } from "@jumon/linkedin/oauth";

type RouteContext = {
  params: Promise<{ provider: string }>;
};

function redirectUriForProvider(provider: string): string | undefined {
  if (provider === "linkedin") return process.env.LINKEDIN_REDIRECT_URI;
  if (provider === "google") return process.env.GOOGLE_REDIRECT_URI;
  return undefined;
}

export async function GET(request: Request, context: RouteContext) {
  const { provider } = await context.params;
  const adapter = getProvider(provider);
  if (!adapter) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  }

  const { userId } = await auth();
  if (!userId) return NextResponse.redirect(new URL("/sign-in", request.url));

  const state = createOauthState();
  await saveOauthStateNonce({ state, userId, provider });

  const redirectUri = redirectUriForProvider(provider);
  if (!redirectUri) {
    return NextResponse.json(
      { error: `Missing redirect URI env for provider ${provider}` },
      { status: 500 }
    );
  }

  const url = adapter.buildAuthorizeUrl({ state, redirectUri });
  return NextResponse.redirect(url);
}
