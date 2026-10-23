import type { BookingStore, TimeSlot } from "@/lib/booking/types";
import { toDateKey } from "@/lib/booking/calendar";

const TIMES = ["08:00", "09:30", "11:00", "13:00", "14:30", "16:00"] as const;

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
