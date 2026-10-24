import { NextResponse } from "next/server";
import { clearSpravaSession } from "@/lib/booking/auth";

export async function POST() {
  await clearSpravaSession();
  return NextResponse.json({ ok: true });
}
