"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildMonthGrid,
  DAY_LABELS,
  DEFAULT_TIMES,
  monthTitle,
  shiftMonth,
  toDateKey,
} from "@/lib/booking/calendar";
import type { BookingStore, TimeSlot } from "@/lib/booking/types";

export function SpravaClient() {
  const [store, setStore] = useState<BookingStore | null>(null);
  const [year, setYear] = useState(2026);
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("1970-01-01");
  const [todayKey, setTodayKey] = useState("1970-01-01");
  const [calReady, setCalReady] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setTodayKey(toDateKey(now));
    setYear(now.getFullYear());
    setMonthIndex(now.getMonth());
    setSelectedDate(toDateKey(now));
    setCalReady(true);
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/sprava/slots");
      if (!res.ok) {
        setLoadError("Nepodařilo se načíst termíny.");
        return;
      }
      const data = (await res.json()) as BookingStore;
      setStore(data);
      setLoadError(null);
    } catch {
      setLoadError("Síťová chyba při načítání správy.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(body: Record<string, unknown>) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/sprava/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Chyba");
        return;
      }
      setStore(data as BookingStore);
      setMessage("Uloženo.");
      setSelectedTimes([]);
    } finally {
      setBusy(false);
    }
  }

  const cells = buildMonthGrid(year, monthIndex);
  const slotsByDate = useMemo(() => {
    const map = new Map<string, TimeSlot[]>();
    for (const s of store?.slots || []) {
      const list = map.get(s.date) || [];
      list.push(s);
      map.set(s.date, list);
    }
    return map;
  }, [store]);

  const daySlots = (slotsByDate.get(selectedDate) || []).sort((a, b) =>
    a.time.localeCompare(b.time),
  );
  const booked = (store?.bookings || [])
    .filter((b) => b.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  if (!calReady) {
    return <p className="muted">Načítám správu…</p>;
  }

  if (loadError && !store) {
    return <p className="booking-error">{loadError}</p>;
  }

  return (
    <div className="sprava">
      <div className="sprava__top">
        <div>
          <h1 className="sprava__title">Správa termínů</h1>
          <p className="muted">
            Přidávejte volné časy, odebírejte je nebo vracjejte po zrušení.
            Heslo zatím není — doplníme později.
          </p>
        </div>
      </div>

      <div className="booking-wizard sprava__grid">
        <div className="booking-cal">
          <div className="booking-cal__head">
            <button
              type="button"
              className="booking-cal__nav"
              onClick={() => {
                const n = shiftMonth(year, monthIndex, -1);
                setYear(n.year);
                setMonthIndex(n.monthIndex);
              }}
            >
              ‹
            </button>
            <h2 className="booking-cal__title">{monthTitle(year, monthIndex)}</h2>
            <button
              type="button"
              className="booking-cal__nav"
              onClick={() => {
                const n = shiftMonth(year, monthIndex, 1);
                setYear(n.year);
                setMonthIndex(n.monthIndex);
              }}
            >
              ›
            </button>
          </div>
          <div className="booking-cal__dow">
            {DAY_LABELS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="booking-cal__grid">
            {cells.map((cell, i) => {
              if (!cell.date) {
                return <span key={`e-${i}`} className="booking-cal__cell is-empty" />;
              }
              const list = slotsByDate.get(cell.date) || [];
              const hasAvail = list.some((s) => s.status === "available");
              const hasBooked = list.some((s) => s.status === "booked");
              return (
                <button
                  key={cell.date}
                  type="button"
                  className={[
                    "booking-cal__cell",
                    hasAvail ? "has-slots" : "",
                    hasBooked ? "has-booked" : "",
                    selectedDate === cell.date ? "is-selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setSelectedDate(cell.date!)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="booking-panel">
          <h3 className="booking-panel__title">Den {selectedDate}</h3>

          <div className="sprava-times-pick">
            {DEFAULT_TIMES.map((t) => {
              const existing = daySlots.find((s) => s.time === t);
              const active = selectedTimes.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  disabled={existing?.status === "booked"}
                  className={`booking-time${active ? " is-selected" : ""}${existing?.status === "booked" ? " is-booked" : ""}${existing?.status === "available" ? " is-open" : ""}`}
                  onClick={() => {
                    setSelectedTimes((prev) =>
                      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
                    );
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div className="sprava-actions">
            <button
              type="button"
              className="btn btn--primary"
              disabled={busy || selectedTimes.length === 0}
              onClick={() =>
                runAction({ action: "add", date: selectedDate, times: selectedTimes })
              }
            >
              Přidat volné časy
            </button>
          </div>

          <h4 className="sprava-subtitle">Termíny tohoto dne</h4>
          <ul className="sprava-list">
            {daySlots.length === 0 && <li className="muted">Žádné termíny</li>}
            {daySlots.map((slot) => {
              const booking = store?.bookings.find((b) => b.id === slot.bookingId);
              return (
                <li key={slot.id} className="sprava-list__item">
                  <div className="sprava-person">
                    <p className="sprava-person__time">
                      <strong>{slot.time}</strong>{" "}
                      <span className={`sprava-badge sprava-badge--${slot.status}`}>
                        {slot.status === "available" ? "volný" : "obsazený"}
                      </span>
                    </p>
                    {booking ? (
                      <dl className="sprava-person__meta">
                        <div>
                          <dt>Jméno</dt>
                          <dd>{booking.name}</dd>
                        </div>
                        <div>
                          <dt>Telefon</dt>
                          <dd>
                            <a href={`tel:${booking.phone.replace(/\s/g, "")}`}>
                              {booking.phone}
                            </a>
                          </dd>
                        </div>
                        {booking.service ? (
                          <div>
                            <dt>Služba</dt>
                            <dd>{booking.service}</dd>
                          </div>
                        ) : null}
                      </dl>
                    ) : null}
                  </div>
                  <div className="sprava-list__btns">
                    {slot.status === "available" && (
                      <button
                        type="button"
                        className="btn btn--ghost"
                        disabled={busy}
                        onClick={() =>
                          runAction({ action: "remove", slotId: slot.id })
                        }
                      >
                        Odebrat
                      </button>
                    )}
                    {slot.status === "booked" && (
                      <button
                        type="button"
                        className="btn btn--ghost"
                        disabled={busy}
                        onClick={() =>
                          runAction({ action: "restore", slotId: slot.id })
                        }
                      >
                        Vrátit jako volný
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {message && <p className="sprava-msg">{message}</p>}
        </div>
      </div>

      <section className="sprava-bookings">
        <h3 className="sprava-subtitle">Nadcházející rezervace</h3>
        <ul className="sprava-list">
          {booked.length === 0 && <li className="muted">Zatím žádné</li>}
          {booked.map((b) => (
            <li key={b.id} className="sprava-list__item">
              <div className="sprava-person">
                <p className="sprava-person__time">
                  <strong>
                    {b.date} · {b.time}
                  </strong>
                </p>
                <dl className="sprava-person__meta">
                  <div>
                    <dt>Jméno</dt>
                    <dd>{b.name}</dd>
                  </div>
                  <div>
                    <dt>Telefon</dt>
                    <dd>
                      <a href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a>
                    </dd>
                  </div>
                  {b.service ? (
                    <div>
                      <dt>Služba</dt>
                      <dd>{b.service}</dd>
                    </div>
                  ) : null}
                  {b.email ? (
                    <div>
                      <dt>E-mail</dt>
                      <dd>
                        <a href={`mailto:${b.email}`}>{b.email}</a>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={busy}
                onClick={() => runAction({ action: "restore", slotId: b.slotId })}
              >
                Zrušit a uvolnit
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
