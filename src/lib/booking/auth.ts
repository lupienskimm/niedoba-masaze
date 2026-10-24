import { cookies, headers } from "next/headers";
import { createHmac, timingSafeEqual, randomBytes } from "crypto";

const COOKIE = "niedoba_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;

/** In-memory rate limit (per serverless isolate — best effort). */
const attempts = new Map<string, { count: number; resetAt: number }>();

function cookieSecret() {
  return (
    process.env.SPRAVA_COOKIE_SECRET ||
    process.env.SPRAVA_PASSWORD ||
    "dev-admin-cookie-secret"
  );
}

function passwords(): string[] {
  return [process.env.SPRAVA_PASSWORD, process.env.SPRAVA_PASSWORD_2].filter(
    (p): p is string => Boolean(p && p.length > 0),
  );
}

function safeEqualStr(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    // still do a compare to keep timing flatter
    timingSafeEqual(ba, ba);
    return false;
  }
  try {
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function checkPassword(password: string) {
  const list = passwords();
  if (list.length === 0) return false;
  let ok = false;
  for (const expected of list) {
    if (safeEqualStr(password, expected)) ok = true;
  }
  return ok;
}

export function signSession(nonce: string) {
  return createHmac("sha256", cookieSecret())
    .update(`admin:${nonce}`)
    .digest("hex");
}

export function verifySessionCookie(value: string | undefined) {
  if (!value) return false;
  const [nonce, sig] = value.split(".");
  if (!nonce || !sig) return false;
  const expected = signSession(nonce);
  return safeEqualStr(sig, expected);
}

export async function isSpravaAuthed() {
  const jar = await cookies();
  return verifySessionCookie(jar.get(COOKIE)?.value);
}

export async function setSpravaSession() {
  const jar = await cookies();
  const nonce = randomBytes(16).toString("hex");
  jar.set(COOKIE, `${nonce}.${signSession(nonce)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSpravaSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function clientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimitLogin(ip: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const row = attempts.get(ip);
  if (!row || now > row.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }
  if (row.count >= RATE_MAX) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((row.resetAt - now) / 1000),
    };
  }
  row.count += 1;
  return { ok: true };
}

export function clearLoginAttempts(ip: string) {
  attempts.delete(ip);
}
