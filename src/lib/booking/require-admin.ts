import { NextResponse } from "next/server";
import { isSpravaAuthed } from "@/lib/booking/auth";

export async function requireAdmin() {
  if (!(await isSpravaAuthed())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }
  return null;
}
