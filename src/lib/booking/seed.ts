import type { Booking, BookingStore, TimeSlot } from "@/lib/booking/types";
import { toDateKey } from "@/lib/booking/calendar";

const TIMES = ["08:00", "09:30", "11:00", "13:00", "14:30", "16:00"] as const;

const DEMO_CLIENTS = [
  {
    name: "Jana Svobodová",
    email: "jana.svobodova@example.cz",
    phone: "+420 777 123 456",
    service: "Relaxace",
  },
  {
    name: "Petr Novák",
    email: "petr.novak@example.cz",
    phone: "+420 603 987 654",
    service: "Hloubková masáž",
  },
  {
    name: "Marie Dvořáková",
    email: "marie.dvorakova@example.cz",
    phone: "+420 731 555 210",
    service: "Obnova těla",
  },
  {
    name: "Tomáš Horák",
    email: "tomas.horak@example.cz",
    phone: "+420 608 444 321",
    service: "Sport",
  },
] as const;

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function hash(n: number) {
  let x = (n * 2654435761) >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  return x >>> 0;
}

/** Deterministic “random” weekday slots for the next ~5 weeks when store is empty. */
export function seedDemoSlots(store: BookingStore): BookingStore {
  if (store.slots.length > 0) return store;

  const start = new Date();
  start.setHours(12, 0, 0, 0);
  const slots: TimeSlot[] = [];

  for (let day = 1; day <= 40; day++) {
    const d = new Date(start);
    d.setDate(start.getDate() + day);
    const wd = d.getDay(); // 0 Sun … 6 Sat
    if (wd === 0 || wd === 6) continue; // weekend closed
    const date = toDateKey(d);
    const pick = hash(day * 17 + d.getMonth());
    if (pick % 3 === 0) continue; // some days empty
    const count = 2 + (pick % 3);
    const used = new Set<string>();
    for (let i = 0; i < count; i++) {
      const t = TIMES[(pick + i * 2) % TIMES.length];
      if (used.has(t)) continue;
      used.add(t);
      slots.push({
        id: makeId("slot"),
        date,
        time: t,
        status: "available",
      });
    }
  }

  return {
    ...store,
    slots,
    updatedAt: new Date().toISOString(),
  };
}

/** Sample reservations so /sprava shows name, time and phone. */
export function seedDemoBookings(store: BookingStore): BookingStore {
  if (store.bookings.length > 0) return store;

  const available = store.slots
    .filter((s) => s.status === "available")
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  if (available.length === 0) return store;

  const bookings: Booking[] = [];
  const slots = store.slots.map((s) => ({ ...s }));
  const pickEvery = Math.max(1, Math.floor(available.length / (DEMO_CLIENTS.length + 1)));

  DEMO_CLIENTS.forEach((client, i) => {
    const source = available[Math.min(i * pickEvery, available.length - 1)];
    if (!source) return;
    const slot = slots.find((s) => s.id === source.id);
    if (!slot || slot.status !== "available") return;

    const bookingId = makeId("book");
    const booking: Booking = {
      id: bookingId,
      slotId: slot.id,
      date: slot.date,
      time: slot.time,
      name: client.name,
      email: client.email,
      phone: client.phone,
      service: client.service,
      note: "Testovací rezervace (ukázka)",
      createdAt: new Date().toISOString(),
      cancelToken: makeId("cancel"),
    };
    slot.status = "booked";
    slot.bookingId = bookingId;
    bookings.push(booking);
  });

  return {
    ...store,
    slots,
    bookings,
    updatedAt: new Date().toISOString(),
  };
}
