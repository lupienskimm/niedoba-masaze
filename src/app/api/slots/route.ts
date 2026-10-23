import { NextResponse } from "next/server";
import { loadStore, publicSlots } from "@/lib/booking/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const store = await loadStore();
  return NextResponse.json({ slots: publicSlots(store, from, to) });
}
