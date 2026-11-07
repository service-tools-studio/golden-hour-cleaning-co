import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getInternalAuthToken,
  INTERNAL_AUTH_COOKIE,
} from "@/lib/internalAuth";
import {
  readPreferredMarketFromCookies,
  resolveResidentialLegacyHomeRedirect,
} from "@/lib/marketPreference";

function enrichRequestHeaders(request: NextRequest): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const region =
    request.headers.get("x-vercel-ip-country-region") ??
    request.headers.get("x-vercel-ip-country-region-code");
  const country = request.headers.get("x-vercel-ip-country");

  if (region) requestHeaders.set("x-geo-region", region);
  if (country) requestHeaders.set("x-geo-country", country);

  return requestHeaders;
}

function nextWithHeaders(request: NextRequest) {
  return NextResponse.next({
    request: { headers: enrichRequestHeaders(request) },
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/residential") {
    const preferred = readPreferredMarketFromCookies((name) =>
      request.cookies.get(name)?.value,
    );
    const destination = resolveResidentialLegacyHomeRedirect(preferred);
    return NextResponse.redirect(new URL(destination, request.url), 308);
  }

  const isInternalRoute =
    pathname === "/internal" ||
    pathname.startsWith("/internal/") ||
    pathname.startsWith("/api/internal/");

  if (!isInternalRoute) {
    return nextWithHeaders(request);
  }

  const isLoginPage = pathname === "/internal/login";
  const isUnlockApi = pathname === "/api/internal/unlock";

  if (isUnlockApi) {
    return nextWithHeaders(request);
  }

  const password = process.env.INTERNAL_PASSWORD;
  if (!password) {
    if (isLoginPage) {
      return nextWithHeaders(request);
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
    return nextWithHeaders(request);
  }

  if (isAuthed) {
    return nextWithHeaders(request);
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/internal/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
