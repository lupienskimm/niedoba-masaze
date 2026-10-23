import { NextResponse } from "next/server";
import { checkPassword, setSpravaSession } from "@/lib/booking/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  if (!body.password || !checkPassword(body.password)) {
    return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
  }
  await setSpravaSession();
  return NextResponse.json({ ok: true });
}
