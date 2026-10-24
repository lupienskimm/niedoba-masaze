"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildMonthGrid,
  DAY_LABELS,
  DEFAULT_TIMES,
  hourBlockLabel,
  monthTitle,
  shiftMonth,
  toDateKey,
} from "@/lib/booking/calendar";
import type { BookingStore, TimeSlot } from "@/lib/booking/types";
import { services } from "@/content/services";

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

  const [phoneSlotId, setPhoneSlotId] = useState<string | null>(null);
  const [phoneTime, setPhoneTime] = useState<string | null>(null);
  const [phoneName, setPhoneName] = useState("");
  const [phonePhone, setPhonePhone] = useState("");
  const [phoneEmail, setPhoneEmail] = useState("");
  const [phoneService, setPhoneService] = useState("");
  const [phoneNote, setPhoneNote] = useState("");

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
      const res = await fetch("/api/admin/slots");
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

  function resetPhoneForm() {
    setPhoneSlotId(null);
    setPhoneTime(null);
    setPhoneName("");
    setPhonePhone("");
    setPhoneEmail("");
    setPhoneService("");
    setPhoneNote("");
  }

  async function runAction(body: Record<string, unknown>) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Chyba");
        return false;
      }
      setStore(data as BookingStore);
      setMessage("Uloženo.");
      setSelectedTimes([]);
      return true;
    } finally {
      setBusy(false);
    }
  }

  async function submitPhoneBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!phoneTime) return;
    const ok = await runAction({
      action: "phoneBook",
      date: selectedDate,
      time: phoneTime,
      name: phoneName,
      phone: phonePhone,
      email: phoneEmail || undefined,
      service: phoneService || undefined,
      note: phoneNote || "Rezervace telefonicky",
    });
    if (ok) resetPhoneForm();
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

  const selectedAvailable = selectedTimes.filter((t) =>
    daySlots.some((s) => s.time === t && s.status === "available"),
  );

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
            Termíny jsou jen celé hodiny (např. 15:00–16:00). I krátká služba zabere
            celý blok. Když někdo zavolá, zapište rezervaci sami — online už termín
            neuvidí. Delší návštěvu označte v adminu jako další obsazenou hodinu.
          </p>
        </div>
      </div>

      <div className="sprava-legend">
        <span>
          <i className="sprava-dot sprava-dot--free" /> volný den / čas
        </span>
        <span>
          <i className="sprava-dot sprava-dot--booked" /> má rezervaci
        </span>
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
                  onClick={() => {
                    setSelectedDate(cell.date!);
                    resetPhoneForm();
                    setSelectedTimes([]);
                  }}
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
                  {hourBlockLabel(t)}
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
              Přidat volné hodiny
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              disabled={busy || selectedAvailable.length === 0}
              onClick={() =>
                runAction({
                  action: "removeTimes",
                  date: selectedDate,
                  times: selectedAvailable,
                })
              }
            >
              Odebrat vybrané volné
            </button>
          </div>

          <h4 className="sprava-subtitle">Termíny tohoto dne</h4>
          <ul className="sprava-list">
            {daySlots.length === 0 && <li className="muted">Žádné termíny</li>}
            {daySlots.map((slot) => {
              const booking = store?.bookings.find((b) => b.id === slot.bookingId);
              const phoneOpen =
                phoneSlotId === slot.id ||
                (phoneTime === slot.time && !phoneSlotId && slot.status === "available");
              return (
                <li key={slot.id} className="sprava-list__item sprava-list__item--stack">
                  <div className="sprava-list__row">
                    <div className="sprava-person">
                      <p className="sprava-person__time">
                        <strong>{hourBlockLabel(slot.time)}</strong>{" "}
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
                          {booking.phone ? (
                          <div>
                            <dt>Telefon</dt>
                            <dd>
                              <a href={`tel:${booking.phone.replace(/\s/g, "")}`}>
                                {booking.phone}
                              </a>
                            </dd>
                          </div>
                          ) : null}
                          {booking.service ? (
                            <div>
                              <dt>Služba</dt>
                              <dd>{booking.service}</dd>
                            </div>
                          ) : null}
                          {booking.note ? (
                            <div>
                              <dt>Pozn.</dt>
                              <dd>{booking.note}</dd>
                            </div>
                          ) : null}
                        </dl>
                      ) : null}
                    </div>
                    <div className="sprava-list__btns">
                      {slot.status === "available" && (
                        <>
                          <button
                            type="button"
                            className="btn btn--primary"
                            disabled={busy}
                            onClick={() => {
                              setPhoneSlotId(slot.id);
                              setPhoneTime(slot.time);
                              setPhoneName("");
                              setPhonePhone("");
                              setPhoneEmail("");
                              setPhoneService("");
                              setPhoneNote("");
                            }}
                          >
                            Telefonická rezervace
                          </button>
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
                        </>
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
                          Uvolnit termín
                        </button>
                      )}
                    </div>
                  </div>

                  {phoneOpen && slot.status === "available" && (
                    <form className="sprava-phone-form" onSubmit={submitPhoneBooking}>
                      <p className="sprava-phone-form__title">
                        Zápis telefonické rezervace · {selectedDate}{" "}
                        {hourBlockLabel(slot.time)}
                      </p>
                      <div className="sprava-phone-form__grid">
                        <label className="booking-field">
                          <span>Jméno a příjmení</span>
                          <input
                            required
                            value={phoneName}
                            onChange={(e) => setPhoneName(e.target.value)}
                            autoComplete="name"
                          />
                        </label>
                        <label className="booking-field">
                          <span>Telefon</span>
                          <input
                            required
                            type="tel"
                            value={phonePhone}
                            onChange={(e) => setPhonePhone(e.target.value)}
                            autoComplete="tel"
                          />
                        </label>
                        <label className="booking-field">
                          <span>E-mail (volitelné)</span>
                          <input
                            type="email"
                            value={phoneEmail}
                            onChange={(e) => setPhoneEmail(e.target.value)}
                            autoComplete="email"
                          />
                        </label>
                        <label className="booking-field">
                          <span>Služba (volitelné)</span>
                          <select
                            value={phoneService}
                            onChange={(e) => setPhoneService(e.target.value)}
                          >
                            <option value="">— nevybráno —</option>
                            {services.map((s) => (
                              <option key={s.id} value={s.title}>
                                {s.title}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="booking-field sprava-phone-form__full">
                          <span>Poznámka</span>
                          <input
                            value={phoneNote}
                            onChange={(e) => setPhoneNote(e.target.value)}
                            placeholder="Rezervace telefonicky"
                          />
                        </label>
                      </div>
                      <div className="sprava-actions">
                        <button
                          type="submit"
                          className="btn btn--primary"
                          disabled={busy}
                        >
                          Uložit rezervaci
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost"
                          disabled={busy}
                          onClick={resetPhoneForm}
                        >
                          Zrušit
                        </button>
                      </div>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>

          <h4 className="sprava-subtitle">Rychlá telefonická rezervace nového času</h4>
          <p className="muted" style={{ marginTop: 0 }}>
            Když klient zavolá na čas, který ještě není v kalendáři — vyberte nahoře
            právě jeden čas, vyplňte údaje a uložte. Termín se vytvoří rovnou jako
            obsazený a online už ho nikdo jiný nevezme.
          </p>
          <form
            className="sprava-phone-form"
            onSubmit={async (e) => {
              e.preventDefault();
              if (selectedTimes.length !== 1) {
                setMessage("Pro telefonickou rezervaci vyberte přesně jeden čas.");
                return;
              }
              const ok = await runAction({
                action: "phoneBook",
                date: selectedDate,
                time: selectedTimes[0],
                name: phoneName,
                phone: phonePhone,
                email: phoneEmail || undefined,
                service: phoneService || undefined,
                note: phoneNote || "Rezervace telefonicky",
              });
              if (ok) resetPhoneForm();
            }}
          >
            <div className="sprava-phone-form__grid">
              <label className="booking-field">
                <span>Jméno a příjmení</span>
                <input
                  required
                  value={phoneName}
                  onChange={(e) => setPhoneName(e.target.value)}
                />
              </label>
              <label className="booking-field">
                <span>Telefon</span>
                <input
                  required
                  type="tel"
                  value={phonePhone}
                  onChange={(e) => setPhonePhone(e.target.value)}
                />
              </label>
              <label className="booking-field">
                <span>Vybraný čas</span>
                <input
                  readOnly
                  value={
                    selectedTimes.length === 1
                      ? selectedTimes[0]
                      : "Vyberte jeden čas výše"
                  }
                />
              </label>
              <label className="booking-field">
                <span>Služba (volitelné)</span>
                <select
                  value={phoneService}
                  onChange={(e) => setPhoneService(e.target.value)}
                >
                  <option value="">— nevybráno —</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="sprava-actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={busy || selectedTimes.length !== 1}
              >
                Rezervovat vybraný čas (telefon)
              </button>
            </div>
          </form>

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
                    {b.date} · {hourBlockLabel(b.time)}
                  </strong>
                </p>
                <dl className="sprava-person__meta">
                  <div>
                    <dt>Jméno</dt>
                    <dd>{b.name}</dd>
                  </div>
                  {b.phone ? (
                  <div>
                    <dt>Telefon</dt>
                    <dd>
                      <a href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a>
                    </dd>
                  </div>
                  ) : null}
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
                  {b.note ? (
                    <div>
                      <dt>Pozn.</dt>
                      <dd>{b.note}</dd>
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
