import { NextResponse } from "next/server";
import { sendBookingNotify, type NotifyKind } from "@/lib/booking/email";
import {
  cancelBookingById,
  extendBooking,
  loadStore,
  manualPhoneBooking,
  markBookingNotified,
  moveBooking,
  removeAvailableSlot,
  removeAvailableTimes,
  rememberClientFromBooking,
  restoreSlot,
  updateBookingContact,
  updateStore,
  upsertAvailableSlots,
  upsertClient,
} from "@/lib/booking/store";
type Action =
  | "add"
  | "remove"
  | "removeTimes"
  | "restore"
  | "phoneBook"
  | "move"
  | "extend"
  | "cancelBooking"
  | "updateContact"
  | "saveClient"
  | "notify";

export async function GET() {
  const store = await loadStore();
  return NextResponse.json(store);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    action?: Action;
    date?: string;
    times?: string[];
    time?: string;
    slotId?: string;
    bookingId?: string;
    name?: string;
    phone?: string;
    email?: string;
    service?: string;
    note?: string;
    notifyKind?: NotifyKind;
    extraHours?: number;
    clientId?: string;
  };

  try {
    if (body.action === "add" && body.date && body.times?.length) {
      const store = await updateStore((s) =>
        upsertAvailableSlots(s, body.date!, body.times!),
      );
      return NextResponse.json(store);
    }

    if (body.action === "remove" && body.slotId) {
      const store = await updateStore((s) => removeAvailableSlot(s, body.slotId!));
      return NextResponse.json(store);
    }

    if (body.action === "removeTimes" && body.date && body.times?.length) {
      const store = await updateStore((s) =>
        removeAvailableTimes(s, body.date!, body.times!),
      );
      return NextResponse.json(store);
    }

    if (body.action === "restore" && body.slotId) {
      const before = await loadStore();
      const slot = before.slots.find((x) => x.id === body.slotId);
      const snapshot = slot?.bookingId
        ? before.bookings.find((b) => b.id === slot.bookingId)
        : undefined;
      const store = await updateStore((s) => restoreSlot(s, body.slotId!));
      if (snapshot?.email) {
        await sendBookingNotify(snapshot, "cancel");
      }
      return NextResponse.json(store);
    }

    if (body.action === "cancelBooking" && body.bookingId) {
      const before = await loadStore();
      const snapshot = before.bookings.find((b) => b.id === body.bookingId);
      let error: string | null = null;
      const store = await updateStore((s) => {
        const result = cancelBookingById(s, body.bookingId!);
        if ("error" in result) {
          error = result.error;
          return s;
        }
        return result.store;
      });
      if (error) return NextResponse.json({ error }, { status: 404 });
      if (snapshot) await sendBookingNotify(snapshot, "cancel");
      return NextResponse.json(store);
    }

    if (
      body.action === "phoneBook" &&
      body.date &&
      body.time &&
      body.name &&
      body.phone
    ) {
      let error: string | null = null;
      const store = await updateStore((s) => {
        let name = body.name!;
        let phone = body.phone!;
        let email = body.email;
        if (body.clientId) {
          const client = s.clients.find((c) => c.id === body.clientId);
          if (client) {
            name = client.name;
            phone = client.phone || phone;
            email = client.email || email;
          }
        }
        const result = manualPhoneBooking(s, {
          date: body.date!,
          time: body.time!,
          name,
          phone,
          email,
          service: body.service,
          note: body.note,
        });
        if ("error" in result) {
          error = result.error;
          return s;
        }
        return result.store;
      });
      if (error) {
        return NextResponse.json({ error }, { status: 409 });
      }
      return NextResponse.json(store);
    }

    if (body.action === "move" && body.bookingId && body.date && body.time) {
      let error: string | null = null;
      const store = await updateStore((s) => {
        const result = moveBooking(s, body.bookingId!, body.date!, body.time!);
        if ("error" in result) {
          error = result.error;
          return s;
        }
        return result.store;
      });
      if (error) return NextResponse.json({ error }, { status: 409 });
      const moved = store.bookings.find((b) => b.id === body.bookingId);
      if (moved) {
        await sendBookingNotify(moved, "change");
        await updateStore((s) => markBookingNotified(s, body.bookingId!));
      }
      return NextResponse.json(await loadStore());
    }

    if (body.action === "extend" && body.bookingId) {
      let error: string | null = null;
      const store = await updateStore((s) => {
        const result = extendBooking(s, body.bookingId!, body.extraHours ?? 1);
        if ("error" in result) {
          error = result.error;
          return s;
        }
        return result.store;
      });
      if (error) return NextResponse.json({ error }, { status: 409 });
      const extended = store.bookings.find((b) => b.id === body.bookingId);
      if (extended) {
        await sendBookingNotify(extended, "extend");
        await updateStore((s) => markBookingNotified(s, body.bookingId!));
      }
      return NextResponse.json(await loadStore());
    }

    if (body.action === "updateContact" && body.bookingId) {
      let error: string | null = null;
      const store = await updateStore((s) => {
        const result = updateBookingContact(s, body.bookingId!, {
          name: body.name,
          phone: body.phone,
          email: body.email,
          service: body.service,
          note: body.note,
        });
        if ("error" in result) {
          error = result.error;
          return s;
        }
        return result.store;
      });
      if (error) return NextResponse.json({ error }, { status: 404 });
      return NextResponse.json(store);
    }

    if (body.action === "saveClient") {
      let error: string | null = null;
      const store = await updateStore((s) => {
        if (body.bookingId) {
          const booking = s.bookings.find((b) => b.id === body.bookingId);
          if (!booking) {
            error = "Rezervace nenalezena.";
            return s;
          }
          rememberClientFromBooking(s, booking);
          return s;
        }
        const result = upsertClient(s, {
          name: body.name || "",
          phone: body.phone || "",
          email: body.email,
          note: body.note,
        });
        if ("error" in result) {
          error = result.error;
          return s;
        }
        return result.store;
      });
      if (error) return NextResponse.json({ error }, { status: 400 });
      return NextResponse.json(store);
    }

    if (body.action === "notify" && body.bookingId) {
      const store = await loadStore();
      const booking = store.bookings.find((b) => b.id === body.bookingId);
      if (!booking) {
        return NextResponse.json({ error: "Rezervace nenalezena." }, { status: 404 });
      }
      if (!booking.email?.trim()) {
        return NextResponse.json(
          { error: "U rezervace chybí e-mail — doplňte ho a zkuste znovu." },
          { status: 400 },
        );
      }
      const kind = body.notifyKind || "confirm";
      const result = await sendBookingNotify(booking, kind);
      if (!result.sent) {
        const msg =
          result.reason === "missing_api_key"
            ? "Chybí RESEND_API_KEY — e-mail se neodeslal."
            : result.reason === "missing_client_email"
              ? "Chybí e-mail klienta."
              : "Odeslání e-mailu selhalo.";
        return NextResponse.json({ error: msg, store }, { status: 502 });
      }
      const next = await updateStore((s) => markBookingNotified(s, body.bookingId!));
      return NextResponse.json({
        ...next,
        _meta: { sent: true, kind },
      });
    }

    return NextResponse.json({ error: "Neplatná akce." }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Uložení selhalo." }, { status: 500 });
  }
}
