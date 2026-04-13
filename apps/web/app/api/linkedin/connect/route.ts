import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { buildLinkedinAuthorizationUrl, createOauthState } from "@jumon/linkedin/oauth";
import { saveOauthStateNonce } from "@jumon/domain/oauth-state";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.redirect(new URL("/sign-in", request.url));

  const state = createOauthState();
  await saveOauthStateNonce({ state, userId, provider: "linkedin" });

  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  if (!redirectUri) {
    return NextResponse.json(
      { error: "Missing LINKEDIN_REDIRECT_URI environment variable." },
      { status: 500 }
    );
  }

  const url = buildLinkedinAuthorizationUrl({
    clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
    redirectUri,
    state,
    scope: process.env.LINKEDIN_SCOPES ?? "r_ads r_ads_reporting"
  });

  return NextResponse.redirect(url);
}
