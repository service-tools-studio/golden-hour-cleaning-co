import { NextResponse } from "next/server";
import {
  getInternalAuthToken,
  INTERNAL_AUTH_COOKIE,
} from "@/lib/internalAuth";

export async function POST(request: Request) {
  const password = process.env.INTERNAL_PASSWORD;
  if (!password) {
    return NextResponse.json(
      { error: "INTERNAL_PASSWORD is not configured." },
      { status: 503 },
    );
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const submitted =
    typeof body.password === "string" ? body.password.trim() : "";
  if (!submitted || submitted !== password) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await getInternalAuthToken(password);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(INTERNAL_AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
