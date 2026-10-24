import { get, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  BOOKING_SEED_VERSION,
  enrichBookingMeta,
  migrateToHourlyRealBookings,
  seedDemoBookings,
  seedDemoSlots,
} from "@/lib/booking/seed";
import {
  emptyStore,
  type Booking,
  type BookingStore,
  type Client,
  type EmailLogEntry,
  type TimeSlot,
} from "@/lib/booking/types";

const BLOB_PATH = "booking-store.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "booking-store.json");

function canUseBlob() {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

async function readLocal(): Promise<BookingStore> {
  try {
    const raw = await readFile(LOCAL_PATH, "utf8");
    return JSON.parse(raw) as BookingStore;
  } catch {
    return emptyStore();
  }
}

async function writeLocal(store: BookingStore) {
  await mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await writeFile(LOCAL_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function readBlob(): Promise<BookingStore | null> {
  try {
    const result = await get(BLOB_PATH, { access: "private", useCache: false });
    if (!result) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as BookingStore;
  } catch {
    return null;
  }
}

async function writeBlob(store: BookingStore) {
  await put(BLOB_PATH, JSON.stringify(store, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function readRaw(): Promise<BookingStore> {
  if (canUseBlob()) {
    const blob = await readBlob();
    if (blob) return blob;
  }
  return readLocal();
}

function normalizeStore(store: BookingStore): { store: BookingStore; changed: boolean } {
  let changed = false;
  if (!Array.isArray(store.clients)) {
    store.clients = [];
    changed = true;
  }
  if (!Array.isArray(store.emailLog)) {
    store.emailLog = [];
    changed = true;
  }
  // Hourly + real bookings migration ONLY when behind v3 (never wipe existing v3+)
  if ((store.seedVersion ?? 0) < 3) {
    store = migrateToHourlyRealBookings(store);
    changed = true;
  }
  // Slots/bookings seed ONLY when empty
  if (store.slots.length === 0) {
    store = seedDemoSlots(store);
    changed = true;
  }
  if (store.bookings.length === 0) {
    store = seedDemoBookings(store);
    changed = true;
  }
  if ((store.seedVersion ?? 0) < BOOKING_SEED_VERSION) {
    store = enrichBookingMeta(store);
    changed = true;
  }
  return { store, changed };
}

export async function loadStore(): Promise<BookingStore> {
  let store = await readRaw();
  const { store: next, changed } = normalizeStore(store);
  if (changed) await saveStoreForce(next);
  return next;
}

async function saveStoreForce(store: BookingStore): Promise<BookingStore> {
  const next = { ...store, updatedAt: new Date().toISOString() };
  if (canUseBlob()) {
    try {
      await writeBlob(next);
      return next;
    } catch (err) {
      console.error("Blob save failed, falling back to local file", err);
    }
  }
  await writeLocal(next);
  return next;
}

export async function saveStore(store: BookingStore): Promise<void> {
  await saveStoreForce(store);
}

/**
 * Optimistic concurrency: mutate only if updatedAt is unchanged since load.
 * Retries up to 3 times on conflict.
 */
export async function updateStore(
  mutator: (store: BookingStore) => BookingStore | void,
): Promise<BookingStore> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const loaded = await loadStore();
    const expected = loaded.updatedAt;
    const draft = structuredClone(loaded);
    const result = mutator(draft);
    const next = result ?? draft;
    const fresh = await readRaw();
    if (fresh.updatedAt !== expected) {
      lastError = new Error("Konflikt zápisu");
      continue;
    }
    return saveStoreForce(next);
  }
  throw lastError || new Error("Uložení selhalo po opakováních.");
}

export async function appendEmailLog(entry: EmailLogEntry) {
  return updateStore((store) => {
    if (!Array.isArray(store.emailLog)) store.emailLog = [];
    if (entry.typ === "pripominka" && entry.stav === "ok") {
      const exists = store.emailLog.some(
        (e) =>
          e.rezervaceId === entry.rezervaceId &&
          e.typ === "pripominka" &&
          e.stav === "ok",
      );
      if (exists) return store;
    }
    store.emailLog.unshift(entry);
    if (store.emailLog.length > 500) {
      store.emailLog = store.emailLog.slice(0, 500);
    }
    return store;
  });
}

export function publicSlots(store: BookingStore, from?: string, to?: string) {
  return store.slots
    .filter((s) => s.status === "available")
    .filter((s) => (!from || s.date >= from) && (!to || s.date <= to))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
}

export function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function upsertAvailableSlots(
  store: BookingStore,
  date: string,
  times: string[],
): BookingStore {
  const existing = new Map(store.slots.map((s) => [`${s.date}|${s.time}`, s]));
  for (const time of times) {
    const key = `${date}|${time}`;
    const current = existing.get(key);
    if (!current) {
      const slot: TimeSlot = {
        id: makeId("slot"),
        date,
        time,
        status: "available",
      };
      store.slots.push(slot);
      existing.set(key, slot);
    } else if (current.status !== "booked") {
      current.status = "available";
      delete current.bookingId;
    }
  }
  return store;
}

export function removeAvailableSlot(store: BookingStore, slotId: string) {
  store.slots = store.slots.filter(
    (s) => !(s.id === slotId && s.status === "available"),
  );
  return store;
}

export function restoreSlot(store: BookingStore, slotId: string) {
  const slot = store.slots.find((s) => s.id === slotId);
  if (!slot) return store;
  if (slot.bookingId) {
    releaseBookingSlots(store, slot.bookingId);
    store.bookings = store.bookings.filter((b) => b.id !== slot.bookingId);
  } else {
    slot.status = "available";
    delete slot.bookingId;
  }
  return store;
}

function nextHour(time: string) {
  const [h, m = "00"] = time.split(":");
  return `${String(Number(h) + 1).padStart(2, "0")}:${m.padStart(2, "0")}`;
}

function ensureSlot(
  store: BookingStore,
  date: string,
  time: string,
): TimeSlot | { error: string } {
  let slot = store.slots.find((s) => s.date === date && s.time === time);
  if (slot?.status === "booked") {
    return { error: `Čas ${time} už je obsazený.` };
  }
  if (!slot) {
    slot = {
      id: makeId("slot"),
      date,
      time,
      status: "available",
    };
    store.slots.push(slot);
  }
  return slot;
}

function releaseBookingSlots(store: BookingStore, bookingId: string) {
  for (const s of store.slots) {
    if (s.bookingId === bookingId) {
      s.status = "available";
      delete s.bookingId;
    }
  }
}

function occupyHours(
  store: BookingStore,
  bookingId: string,
  date: string,
  startTime: string,
  hours: number,
): { error: string } | null {
  let time = startTime;
  for (let i = 0; i < hours; i++) {
    const slotOrErr = ensureSlot(store, date, time);
    if ("error" in slotOrErr) return slotOrErr;
    const slot = slotOrErr;
    if (slot.status === "booked" && slot.bookingId !== bookingId) {
      return { error: `Čas ${time} už je obsazený.` };
    }
    slot.status = "booked";
    slot.bookingId = bookingId;
    time = nextHour(time);
  }
  return null;
}

export function upsertClient(
  store: BookingStore,
  input: { name: string; phone: string; email?: string; note?: string },
): { store: BookingStore; client: Client } | { error: string } {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = (input.email || "").trim().toLowerCase();
  if (!name) return { error: "Vyplňte jméno klienta." };
  if (!phone && !email) {
    return { error: "Pro uložení klienta vyplňte telefon nebo e-mail." };
  }

  const existing = store.clients.find(
    (c) =>
      (email && c.email.toLowerCase() === email) ||
      (phone && c.phone.replace(/\s/g, "") === phone.replace(/\s/g, "")),
  );

  const now = new Date().toISOString();
  if (existing) {
    existing.name = name;
    if (phone) existing.phone = phone;
    if (email) existing.email = email;
    if (input.note?.trim()) existing.note = input.note.trim();
    existing.updatedAt = now;
    return { store, client: existing };
  }

  const client: Client = {
    id: makeId("client"),
    name,
    phone,
    email,
    note: input.note?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };
  store.clients.unshift(client);
  return { store, client };
}

export function rememberClientFromBooking(store: BookingStore, booking: Booking) {
  if (!booking.phone?.trim() && !booking.email?.trim()) return store;
  const result = upsertClient(store, {
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
    note: booking.note,
  });
  if ("error" in result) return store;
  booking.clientId = result.client.id;
  return result.store;
}

export function updateBookingContact(
  store: BookingStore,
  bookingId: string,
  input: { name?: string; phone?: string; email?: string; service?: string; note?: string },
): { store: BookingStore; booking: Booking } | { error: string } {
  const booking = store.bookings.find((b) => b.id === bookingId);
  if (!booking) return { error: "Rezervace nenalezena." };
  if (input.name !== undefined) {
    booking.name = input.name.trim() || "Bez jména";
  }
  if (input.phone !== undefined) booking.phone = input.phone.trim();
  if (input.email !== undefined) booking.email = input.email.trim();
  if (input.service !== undefined) {
    booking.service = input.service.trim() || undefined;
  }
  if (input.note !== undefined) booking.note = input.note.trim() || undefined;
  return { store, booking };
}

export function moveBooking(
  store: BookingStore,
  bookingId: string,
  date: string,
  time: string,
): { store: BookingStore; booking: Booking } | { error: string } {
  const booking = store.bookings.find((b) => b.id === bookingId);
  if (!booking) return { error: "Rezervace nenalezena." };
  const hours = Math.max(1, booking.durationHours ?? 1);

  releaseBookingSlots(store, bookingId);
  const err = occupyHours(store, bookingId, date, time, hours);
  if (err) {
    // rollback to original
    occupyHours(store, bookingId, booking.date, booking.time, hours);
    return err;
  }

  const primary = store.slots.find((s) => s.date === date && s.time === time);
  booking.date = date;
  booking.time = time;
  booking.upraveno = new Date().toISOString();
  if (primary) booking.slotId = primary.id;
  return { store, booking };
}

export function extendBooking(
  store: BookingStore,
  bookingId: string,
  extraHours = 1,
): { store: BookingStore; booking: Booking } | { error: string } {
  const booking = store.bookings.find((b) => b.id === bookingId);
  if (!booking) return { error: "Rezervace nenalezena." };
  const current = Math.max(1, booking.durationHours ?? 1);
  const next = current + Math.max(1, extraHours);

  let time = booking.time;
  for (let i = 0; i < current; i++) time = nextHour(time);

  for (let i = 0; i < extraHours; i++) {
    const slotOrErr = ensureSlot(store, booking.date, time);
    if ("error" in slotOrErr) return slotOrErr;
    const slot = slotOrErr;
    if (slot.status === "booked" && slot.bookingId !== bookingId) {
      return { error: `Nelze prodloužit — ${time} je obsazený.` };
    }
    slot.status = "booked";
    slot.bookingId = bookingId;
    time = nextHour(time);
  }

  booking.durationHours = next;
  booking.upraveno = new Date().toISOString();
  return { store, booking };
}

/** Soft cancel: keep the row, free the calendar slots. */
export function cancelBookingById(
  store: BookingStore,
  bookingId: string,
): { store: BookingStore; booking: Booking } | { error: string } {
  const booking = store.bookings.find((b) => b.id === bookingId);
  if (!booking) return { error: "Rezervace nenalezena." };
  releaseBookingSlots(store, bookingId);
  booking.stav = "zrusena";
  booking.upraveno = new Date().toISOString();
  return { store, booking };
}

export function markBookingNotified(store: BookingStore, bookingId: string) {
  const booking = store.bookings.find((b) => b.id === bookingId);
  if (booking) {
    const now = new Date().toISOString();
    booking.lastNotifiedAt = now;
    booking.potvrzeniOdeslano = now;
    booking.upraveno = now;
  }
  return store;
}

export function createBooking(
  store: BookingStore,
  input: {
    slotId: string;
    name: string;
    email?: string;
    phone?: string;
    note?: string;
    service?: string;
    zdroj?: Booking["zdroj"];
  },
): { store: BookingStore; booking: Booking } | { error: string } {
  const slot = store.slots.find((s) => s.id === input.slotId);
  if (!slot) return { error: "Termín neexistuje." };
  if (slot.status !== "available") return { error: "Termín už není volný." };

  const now = new Date().toISOString();
  const booking: Booking = {
    id: makeId("book"),
    slotId: slot.id,
    date: slot.date,
    time: slot.time,
    name: input.name.trim() || "Bez jména",
    email: (input.email || "").trim(),
    phone: (input.phone || "").trim(),
    note: input.note?.trim() || undefined,
    service: input.service?.trim() || undefined,
    createdAt: now,
    cancelToken: makeId("cancel"),
    stav: "potvrzena",
    zdroj:
      input.zdroj ||
      (input.note?.toLowerCase().includes("telefon") ? "telefon" : "web"),
    upraveno: now,
    durationHours: 1,
  };

  slot.status = "booked";
  slot.bookingId = booking.id;
  store.bookings.unshift(booking);
  rememberClientFromBooking(store, booking);
  return { store, booking };
}

/** Phone / admin booking: create the slot if missing, then mark it booked. */
export function manualPhoneBooking(
  store: BookingStore,
  input: {
    date: string;
    time: string;
    name?: string;
    phone?: string;
    email?: string;
    note?: string;
    service?: string;
  },
): { store: BookingStore; booking: Booking } | { error: string } {
  // Admin / phone booking: all contact fields are optional
  const name = (input.name || "").trim() || "Bez jména";
  const phone = (input.phone || "").trim();
  const email = (input.email || "").trim();

  let slot = store.slots.find(
    (s) => s.date === input.date && s.time === input.time,
  );

  if (slot?.status === "booked") {
    return { error: "Tento čas už je obsazený." };
  }

  if (!slot) {
    slot = {
      id: makeId("slot"),
      date: input.date,
      time: input.time,
      status: "available",
    };
    store.slots.push(slot);
  }

  return createBooking(store, {
    slotId: slot.id,
    name,
    phone,
    email,
    note: input.note || "Rezervace telefonicky",
    service: input.service,
    zdroj: "telefon",
  });
}

export function removeAvailableTimes(
  store: BookingStore,
  date: string,
  times: string[],
) {
  const remove = new Set(times);
  store.slots = store.slots.filter(
    (s) =>
      !(s.date === date && remove.has(s.time) && s.status === "available"),
  );
  return store;
}

export function cancelBookingByToken(store: BookingStore, token: string) {
  const booking = store.bookings.find((b) => b.cancelToken === token);
  if (!booking) return { error: "Rezervace nenalezena." as const };
  return cancelBookingById(store, booking.id);
}
