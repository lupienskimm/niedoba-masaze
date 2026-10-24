import { NextResponse } from "next/server";
import { sendBookingNotify } from "@/lib/booking/email";
import {
  createBooking,
  markBookingNotified,
  updateStore,
} from "@/lib/booking/store";
import type { Booking } from "@/lib/booking/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      slotId?: string;
      name?: string;
      email?: string;
      phone?: string;
      note?: string;
      service?: string;
    };

    if (
      !body.slotId ||
      !body.name?.trim() ||
      !body.email?.trim() ||
      !body.phone?.trim()
    ) {
      return NextResponse.json(
        { error: "Vyplňte jméno, e-mail, telefon a termín." },
        { status: 400 },
      );
    }

    let error: string | null = null;
    let booking: Booking | null = null;

    await updateStore((store) => {
      const result = createBooking(store, {
        slotId: body.slotId!,
        name: body.name!,
        email: body.email!,
        phone: body.phone!,
        note: body.note,
        service: body.service,
        zdroj: "web",
      });
      if ("error" in result) {
        error = result.error;
        return store;
      }
      booking = result.booking;
      return result.store;
    });

    if (error || !booking) {
      return NextResponse.json(
        { error: error || "Termín už není volný." },
        { status: 409 },
      );
    }

    const confirmed = booking as Booking;
    // E-mail nesmí shodit uloženou rezervaci
    try {
      const mail = await sendBookingNotify(confirmed, "confirm");
      if (mail.client?.ok || mail.sent) {
        await updateStore((s) => markBookingNotified(s, confirmed.id));
      }
    } catch (err) {
      console.error("[bookings] mail failed after save", err);
    }

    return NextResponse.json({
      ok: true,
      booking: {
        id: confirmed.id,
        date: confirmed.date,
        time: confirmed.time,
        name: confirmed.name,
        email: confirmed.email,
        cancelToken: confirmed.cancelToken,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Nepodařilo se uložit rezervaci." },
      { status: 500 },
    );
  }
}
