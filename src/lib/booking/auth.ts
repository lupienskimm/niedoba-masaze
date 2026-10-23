import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "niedoba_sprava";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

/**
 * Správa is currently open without password (no login UI).
 * Later: set SPRAVA_REQUIRE_PASSWORD=1 and restore login form.
 */
export function isSpravaPasswordRequired() {
  return false;
}

function secret() {
  return (
    process.env.SPRAVA_PASSWORD ||
    process.env.BLOB_STORE_ID ||
    "dev-sprava-secret"
  );
}

export function signSession(password: string) {
  return createHmac("sha256", secret()).update(`ok:${password}`).digest("hex");
}

export function checkPassword(password: string) {
  const expected = process.env.SPRAVA_PASSWORD || "niedoba2026";
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return password === expected;
  }
}

export async function isSpravaAuthed() {
  return true;
}

export async function setSpravaSession() {
  const jar = await cookies();
  jar.set(COOKIE, signSession(process.env.SPRAVA_PASSWORD || "niedoba2026"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSpravaSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
