import { defaultUsername } from "@/server/trpc/api/stats/constants";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL(`/${defaultUsername}`, request.url));
}

export const config = {
  matcher: "/",
};
