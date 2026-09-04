import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getInternalAuthToken,
  INTERNAL_AUTH_COOKIE,
} from "@/lib/internalAuth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/internal/login";
  const isUnlockApi = pathname === "/api/internal/unlock";

  if (isUnlockApi) {
    return NextResponse.next();
  }

  const password = process.env.INTERNAL_PASSWORD;
  if (!password) {
    if (isLoginPage) {
      return NextResponse.next();
    }
    return new NextResponse(
      "Internal tools are locked: set INTERNAL_PASSWORD in the environment.",
      { status: 503 },
    );
  }

  const expected = await getInternalAuthToken(password);
  const cookie = request.cookies.get(INTERNAL_AUTH_COOKIE)?.value;
  const isAuthed = cookie === expected;

  if (isLoginPage) {
    if (isAuthed) {
      const nextParam = request.nextUrl.searchParams.get("next");
      const dest =
        nextParam && nextParam.startsWith("/internal")
          ? nextParam
          : "/internal";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  if (isAuthed) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/internal/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/internal", "/internal/:path*", "/api/internal/:path*"],
};
