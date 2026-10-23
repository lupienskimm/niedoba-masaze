import { NextResponse } from "next/server";
import { isSpravaAuthed } from "@/lib/booking/auth";
import {
  loadStore,
  removeAvailableSlot,
  restoreSlot,
  updateStore,
  upsertAvailableSlots,
} from "@/lib/booking/store";

export async function GET() {
  if (!(await isSpravaAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = await loadStore();
  return NextResponse.json(store);
}

export async function POST(request: Request) {
  if (!(await isSpravaAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    action?: "add" | "remove" | "restore";
    date?: string;
    times?: string[];
    slotId?: string;
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

    if (body.action === "restore" && body.slotId) {
      const store = await updateStore((s) => restoreSlot(s, body.slotId!));
      return NextResponse.json(store);
    }

    return NextResponse.json({ error: "Neplatná akce." }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Uložení selhalo." }, { status: 500 });
  }
}
