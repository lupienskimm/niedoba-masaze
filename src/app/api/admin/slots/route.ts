import { NextResponse } from "next/server";
import {
  sendBookingNotify,
  sendOwnerPhoneSummary,
  type NotifyKind,
} from "@/lib/booking/email";
import { requireAdmin } from "@/lib/booking/require-admin";
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
  const denied = await requireAdmin();
  if (denied) return denied;
  const store = await loadStore();
  return NextResponse.json(store);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

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

    if (body.action === "phoneBook" && body.date && body.time) {
      let error: string | null = null;
      const store = await updateStore((s) => {
        let name = body.name || "";
        let phone = body.phone || "";
        let email = body.email || "";
        if (body.clientId) {
          const client = s.clients.find((c) => c.id === body.clientId);
          if (client) {
            name = name || client.name;
            phone = phone || client.phone;
            email = email || client.email;
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
      const created = store.bookings.find(
        (b) => b.date === body.date && b.time === body.time && b.stav !== "zrusena",
      );
      if (created) {
        // Telefonická rezervace: jen souhrn pro provozovatele, ne potvrzení klientovi
        await sendOwnerPhoneSummary(created);
      }
      return NextResponse.json(await loadStore());
    }

    if (body.action === "move" && body.bookingId && body.date && body.time) {
      const before = await loadStore();
      const prev = before.bookings.find((b) => b.id === body.bookingId);
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
      if (moved && prev) {
        await sendBookingNotify(moved, "change", {
          oldDate: prev.date,
          oldTime: prev.time,
          oldDurationHours: prev.durationHours,
        });
      }
      return NextResponse.json(await loadStore());
    }

    if (body.action === "extend" && body.bookingId) {
      const before = await loadStore();
      const prev = before.bookings.find((b) => b.id === body.bookingId);
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
      if (extended && prev) {
        await sendBookingNotify(extended, "extend", {
          oldDurationHours: prev.durationHours ?? 1,
        });
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
      // Potvrzení klientovi zapisujeme i když část selže — rezervace zůstává
      if (kind === "confirm" && (result.client?.ok || result.sent)) {
        await updateStore((s) => markBookingNotified(s, body.bookingId!));
      }
      const next = await loadStore();
      if (!result.sent) {
        const msg =
          result.reason === "missing_client_email"
            ? "Chybí e-mail klienta."
            : result.client?.chyba ||
              result.owner?.chyba ||
              "Odeslání e-mailu selhalo (rezervace zůstala uložená).";
        return NextResponse.json(
          {
            error: msg,
            ...next,
            _meta: {
              sent: false,
              zkusebni: result.zkusebni,
              prijemceOdeslano: result.prijemceOdeslano,
            },
          },
          { status: 502 },
        );
      }
      return NextResponse.json({
        ...next,
        _meta: {
          sent: true,
          kind,
          zkusebni: result.zkusebni,
          prijemceOdeslano: result.prijemceOdeslano,
        },
      });
    }

    return NextResponse.json({ error: "Neplatná akce." }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Uložení selhalo." }, { status: 500 });
  }
}
