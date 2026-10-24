import { DEFAULT_TIMES, toDateKey } from "@/lib/booking/calendar";
import type { Booking, BookingStore, TimeSlot } from "@/lib/booking/types";

export { hourBlockLabel } from "@/lib/booking/calendar";

/** Bump when empty-store / migration seed data must re-apply. */
export const BOOKING_SEED_VERSION = 3;

/** Real upcoming reservations transferred from the previous booking system. */
export const REAL_BOOKINGS = [
  { name: "Lukáš Lačík", date: "2026-10-26", time: "15:00" },
  { name: "Božena Bojkova", date: "2026-10-29", time: "15:00" },
  { name: "Pavlína Sušková", date: "2026-10-30", time: "16:00" },
  { name: "Zuzana Lysková", date: "2026-11-03", time: "16:00" },
  { name: "Petr Bonacina", date: "2026-11-05", time: "17:00" },
  { name: "Karel Wojnar", date: "2026-11-09", time: "16:00" },
  { name: "Lucie Karchová", date: "2026-11-10", time: "17:00" },
  { name: "Božena Bojkova", date: "2026-11-12", time: "15:00" },
  { name: "Božena Bojkova", date: "2026-11-26", time: "15:00" },
  { name: "Božena Bojkova", date: "2026-12-10", time: "15:00" },
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

function isFullHour(time: string) {
  return /^\d{2}:00$/.test(time);
}

function applyRealBookings(slots: TimeSlot[], bookings: Booking[]): void {
  for (const real of REAL_BOOKINGS) {
    let slot = slots.find((s) => s.date === real.date && s.time === real.time);
    if (!slot) {
      slot = {
        id: makeId("slot"),
        date: real.date,
        time: real.time,
        status: "available",
      };
      slots.push(slot);
    }
    if (slot.status === "booked" && slot.bookingId) {
      const existing = bookings.find((b) => b.id === slot!.bookingId);
      if (existing?.name === real.name) continue;
    }

    const bookingId = makeId("book");
    const booking: Booking = {
      id: bookingId,
      slotId: slot.id,
      date: real.date,
      time: real.time,
      name: real.name,
      email: "",
      phone: "",
      service: undefined,
      note: "Přeneseno z původní rezervace",
      createdAt: new Date().toISOString(),
      cancelToken: makeId("cancel"),
    };
    slot.status = "booked";
    slot.bookingId = bookingId;
    bookings.push(booking);
  }
}

/**
 * Hourly weekday openings for ~8 weeks.
 * Each click books the whole hour — duration of the service does not matter.
 */
export function seedDemoSlots(store: BookingStore): BookingStore {
  if (store.slots.length > 0) return store;

  const start = new Date();
  start.setHours(12, 0, 0, 0);
  const slots: TimeSlot[] = [];

  for (let day = 0; day <= 56; day++) {
    const d = new Date(start);
    d.setDate(start.getDate() + day);
    const wd = d.getDay();
    if (wd === 0 || wd === 6) continue;
    const date = toDateKey(d);
    const pick = hash(day * 17 + d.getMonth());
    // Most weekdays open; skip a few quieter days
    if (pick % 7 === 0) continue;
    for (const t of DEFAULT_TIMES) {
      // Lightly thin lunch / early slots so the calendar stays readable
      if ((t === "12:00" || t === "08:00") && pick % 2 === 0) continue;
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
    clients: store.clients ?? [],
    seedVersion: BOOKING_SEED_VERSION,
    updatedAt: new Date().toISOString(),
  };
}

/** Seed real reservations (replaces old demo clients). */
export function seedDemoBookings(store: BookingStore): BookingStore {
  if (store.bookings.length > 0) return store;

  const slots = store.slots.map((s) => ({ ...s }));
  const bookings: Booking[] = [];
  applyRealBookings(slots, bookings);

  return {
    ...store,
    slots,
    bookings,
    clients: store.clients ?? [],
    seedVersion: BOOKING_SEED_VERSION,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * One-shot migration: full-hour slots only + real upcoming bookings.
 * Safe to run repeatedly when seedVersion is behind.
 */
export function migrateToHourlyRealBookings(store: BookingStore): BookingStore {
  if ((store.seedVersion ?? 0) >= BOOKING_SEED_VERSION) return store;

  // Drop half-hour / irregular times; keep full-hour inventory
  let slots = store.slots
    .filter((s) => isFullHour(s.time))
    .map((s) => ({ ...s }));

  // Drop previous demo / transferred bookings — re-apply from REAL_BOOKINGS
  const keepBookings = store.bookings.filter(
    (b) =>
      isFullHour(b.time) &&
      b.note !== "Testovací rezervace (ukázka)" &&
      b.note !== "Přeneseno z původní rezervace" &&
      !REAL_BOOKINGS.some((r) => r.date === b.date && r.time === b.time && r.name === b.name),
  );

  // Free slots that belonged to removed bookings
  const keepIds = new Set(keepBookings.map((b) => b.id));
  for (const slot of slots) {
    if (slot.bookingId && !keepIds.has(slot.bookingId)) {
      slot.status = "available";
      delete slot.bookingId;
    }
  }

  // Ensure weekday hourly openings exist for the next ~8 weeks
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  const existing = new Map(slots.map((s) => [`${s.date}|${s.time}`, s]));
  for (let day = 0; day <= 56; day++) {
    const d = new Date(start);
    d.setDate(start.getDate() + day);
    const wd = d.getDay();
    if (wd === 0 || wd === 6) continue;
    const date = toDateKey(d);
    for (const t of DEFAULT_TIMES) {
      const key = `${date}|${t}`;
      if (existing.has(key)) continue;
      const slot: TimeSlot = {
        id: makeId("slot"),
        date,
        time: t,
        status: "available",
      };
      slots.push(slot);
      existing.set(key, slot);
    }
  }

  const bookings = [...keepBookings];
  applyRealBookings(slots, bookings);

  return {
    ...store,
    slots,
    bookings,
    clients: store.clients ?? [],
    seedVersion: BOOKING_SEED_VERSION,
    updatedAt: new Date().toISOString(),
  };
}
