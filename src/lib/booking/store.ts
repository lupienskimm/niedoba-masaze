import { get, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  emptyStore,
  type Booking,
  type BookingStore,
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

export async function loadStore(): Promise<BookingStore> {
  if (canUseBlob()) {
    const fromBlob = await readBlob();
    if (fromBlob) return fromBlob;
  }
  return readLocal();
}

export async function saveStore(store: BookingStore): Promise<void> {
  const next = { ...store, updatedAt: new Date().toISOString() };
  if (canUseBlob()) {
    try {
      await writeBlob(next);
      return;
    } catch (err) {
      console.error("Blob save failed, falling back to local file", err);
    }
  }
  await writeLocal(next);
}

export async function updateStore(
  mutator: (store: BookingStore) => BookingStore | void,
): Promise<BookingStore> {
  const store = await loadStore();
  const result = mutator(store);
  const next = result ?? store;
  await saveStore(next);
  return next;
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
    store.bookings = store.bookings.filter((b) => b.id !== slot.bookingId);
  }
  slot.status = "available";
  delete slot.bookingId;
  return store;
}

export function createBooking(
  store: BookingStore,
  input: {
    slotId: string;
    name: string;
    email: string;
    phone: string;
    note?: string;
    service?: string;
  },
): { store: BookingStore; booking: Booking } | { error: string } {
  const slot = store.slots.find((s) => s.id === input.slotId);
  if (!slot) return { error: "Termín neexistuje." };
  if (slot.status !== "available") return { error: "Termín už není volný." };

  const booking: Booking = {
    id: makeId("book"),
    slotId: slot.id,
    date: slot.date,
    time: slot.time,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    note: input.note?.trim() || undefined,
    service: input.service?.trim() || undefined,
    createdAt: new Date().toISOString(),
    cancelToken: makeId("cancel"),
  };

  slot.status = "booked";
  slot.bookingId = booking.id;
  store.bookings.unshift(booking);
  return { store, booking };
}

export function cancelBookingByToken(store: BookingStore, token: string) {
  const booking = store.bookings.find((b) => b.cancelToken === token);
  if (!booking) return { error: "Rezervace nenalezena." as const };
  const slot = store.slots.find((s) => s.id === booking.slotId);
  if (slot) {
    slot.status = "available";
    delete slot.bookingId;
  }
  store.bookings = store.bookings.filter((b) => b.id !== booking.id);
  return { store, booking };
}
