import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { disconnectLinkedinConnectionByUserId } from "@jumon/domain/connections";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url), 303);
  }

  await disconnectLinkedinConnectionByUserId(userId);

  return NextResponse.redirect(new URL("/connections?status=disconnected", request.url), 303);
}
