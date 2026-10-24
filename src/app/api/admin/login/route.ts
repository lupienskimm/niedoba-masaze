import { NextResponse } from "next/server";
import {
  checkPassword,
  clearLoginAttempts,
  clientIp,
  rateLimitLogin,
  setSpravaSession,
} from "@/lib/booking/auth";

export async function POST(request: Request) {
  const ip = await clientIp();
  const limited = rateLimitLogin(ip);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Špatné heslo" },
      {
        status: 429,
        headers: limited.retryAfterSec
          ? { "Retry-After": String(limited.retryAfterSec) }
          : undefined,
      },
    );
  }

  const body = (await request.json()) as { password?: string };
  if (!body.password || !checkPassword(body.password)) {
    return NextResponse.json({ error: "Špatné heslo" }, { status: 401 });
  }

  clearLoginAttempts(ip);
  await setSpravaSession();
  return NextResponse.json({ ok: true });
}
