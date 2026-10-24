const DAY_LABELS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"] as const;

const MONTH_LABELS = [
  "Leden",
  "Únor",
  "Březen",
  "Duben",
  "Květen",
  "Červen",
  "Červenec",
  "Srpen",
  "Září",
  "Říjen",
  "Listopad",
  "Prosinec",
] as const;

export { DAY_LABELS, MONTH_LABELS };

export function toDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function monthTitle(year: number, monthIndex: number) {
  return `${MONTH_LABELS[monthIndex]} ${year}`;
}

/** Monday-first calendar cells for a month. */
export function buildMonthGrid(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const startOffset = (first.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: Array<{ date: string | null; day: number | null }> = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ date: null, day: null });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = toDateKey(new Date(year, monthIndex, day));
    cells.push({ date, day });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: null, day: null });
  }
  return cells;
}

export function shiftMonth(year: number, monthIndex: number, delta: number) {
  const d = new Date(year, monthIndex + delta, 1);
  return { year: d.getFullYear(), monthIndex: d.getMonth() };
}

export const DEFAULT_TIMES = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

/** Label for a one-hour block starting at `time` (e.g. 15:00 → 15:00–16:00). */
export function hourBlockLabel(time: string, hours = 1) {
  const [hRaw, mRaw = "00"] = time.split(":");
  const h = Number(hRaw);
  if (!Number.isFinite(h)) return time;
  const span = Math.max(1, hours);
  const end = `${String(h + span).padStart(2, "0")}:${mRaw.padStart(2, "0")}`;
  return `${time}–${end}`;
}
