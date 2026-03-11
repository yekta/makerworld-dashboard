import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const res = await fetch(`${process.env.API_URL}/v1/my-users/list`);
  const { users }: { users: { username: string }[] } = await res.json();
  const defaultUsername = users[0]?.username;
  if (!defaultUsername) {
    return NextResponse.redirect(new URL(`/leaderboard`, request.url));
  }
  return NextResponse.redirect(new URL(`/${defaultUsername}`, request.url));
}

export const config = {
  matcher: "/",
};
