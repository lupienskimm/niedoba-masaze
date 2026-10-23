import { NextResponse } from "next/server";
import { sendCancelEmails } from "@/lib/booking/email";
import { cancelBookingByToken, updateStore } from "@/lib/booking/store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string };
    if (!body.token) {
      return NextResponse.json({ error: "Chybí token." }, { status: 400 });
    }

    let cancelled = null as Awaited<ReturnType<typeof cancelBookingByToken>> | null;
    await updateStore((store) => {
      cancelled = cancelBookingByToken(store, body.token!);
      if ("error" in cancelled) return store;
      return cancelled.store;
    });

    if (!cancelled || "error" in cancelled) {
      return NextResponse.json(
        { error: cancelled && "error" in cancelled ? cancelled.error : "Chyba." },
        { status: 404 },
      );
    }

    await sendCancelEmails(cancelled.booking);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Zrušení selhalo." }, { status: 500 });
  }
}
