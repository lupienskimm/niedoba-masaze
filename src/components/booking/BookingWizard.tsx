"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  buildMonthGrid,
  DAY_LABELS,
  hourBlockLabel,
  monthTitle,
  shiftMonth,
  toDateKey,
} from "@/lib/booking/calendar";
import type { TimeSlot } from "@/lib/booking/types";
import { services, site } from "@/content/site";

type Step = "calendar" | "form" | "done";

export function BookingWizard() {
  const [ready, setReady] = useState(false);
  const [todayKey, setTodayKey] = useState("1970-01-01");
  const [year, setYear] = useState(2026);
  const [monthIndex, setMonthIndex] = useState(0);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [step, setStep] = useState<Step>("calendar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{
    date: string;
    time: string;
    cancelToken: string;
  } | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const now = new Date();
    setTodayKey(toDateKey(now));
    setYear(now.getFullYear());
    setMonthIndex(now.getMonth());
    setReady(true);
  }, []);

  const from = toDateKey(new Date(year, monthIndex, 1));
  const to = toDateKey(new Date(year, monthIndex + 1, 0));

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/slots?from=${from}&to=${to}`);
        const data = (await res.json()) as { slots: TimeSlot[] };
        if (!cancelled) setSlots(data.slots || []);
      } catch {
        if (!cancelled) setSlots([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [from, to, step, ready]);

  const datesWithSlots = useMemo(() => {
    const set = new Set(slots.map((s) => s.date));
    return set;
  }, [slots]);

  const daySlots = useMemo(
    () =>
      selectedDate
        ? slots
            .filter((s) => s.date === selectedDate)
            .sort((a, b) => a.time.localeCompare(b.time))
        : [],
    [slots, selectedDate],
  );

  const cells = buildMonthGrid(year, monthIndex);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    if (!service) {
      setError("Vyberte prosím službu.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          name,
          email,
          phone,
          service,
          note: note || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Rezervace se nepodařila.");
        return;
      }
      setDone({
        date: data.booking.date,
        time: data.booking.time,
        cancelToken: data.booking.cancelToken,
      });
      setStep("done");
    } catch {
      setError("Síťová chyba. Zkuste to znovu.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return <p className="muted content-center">Načítám kalendář…</p>;
  }

  if (step === "done" && done) {
    return (
      <div className="booking-done">
        <h2 className="booking-done__title">Rezervace je hotová</h2>
        <p>
          Termín <strong>{done.date}</strong> ·{" "}
          <strong>{hourBlockLabel(done.time)}</strong> je zarezervovaný
          (celá hodina). Potvrzení přijde e-mailem.
        </p>
        <p className="muted">
          Provozovna: {site.address}. Telefon:{" "}
          <a href={`tel:${site.phoneRaw}`}>{site.phoneDisplay}</a>
        </p>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setStep("calendar");
            setSelectedDate(null);
            setSelectedSlot(null);
            setDone(null);
            setName("");
            setEmail("");
            setPhone("");
            setService("");
            setNote("");
          }}
        >
          Nová rezervace
        </button>
      </div>
    );
  }

  return (
    <div className="booking-wizard">
      <div className="booking-cal">
        <p className="booking-cal__legend">
          Zelený den = volný hodinový blok. Rezervace vždy zabere celou hodinu.
        </p>
        <div className="booking-cal__head">
          <button
            type="button"
            className="booking-cal__nav"
            aria-label="Předchozí měsíc"
            onClick={() => {
              const next = shiftMonth(year, monthIndex, -1);
              setYear(next.year);
              setMonthIndex(next.monthIndex);
              setSelectedDate(null);
              setSelectedSlot(null);
            }}
          >
            ‹
          </button>
          <h2 className="booking-cal__title">{monthTitle(year, monthIndex)}</h2>
          <button
            type="button"
            className="booking-cal__nav"
            aria-label="Další měsíc"
            onClick={() => {
              const next = shiftMonth(year, monthIndex, 1);
              setYear(next.year);
              setMonthIndex(next.monthIndex);
              setSelectedDate(null);
              setSelectedSlot(null);
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
            const has = datesWithSlots.has(cell.date);
            const isPast = cell.date < todayKey;
            const isSelected = selectedDate === cell.date;
            return (
              <button
                key={cell.date}
                type="button"
                className={[
                  "booking-cal__cell",
                  has ? "has-slots" : "",
                  isSelected ? "is-selected" : "",
                  isPast ? "is-past" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                disabled={!has || isPast}
                onClick={() => {
                  setSelectedDate(cell.date);
                  setSelectedSlot(null);
                  setStep("calendar");
                }}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="booking-panel">
        {!selectedDate && (
          <p className="booking-panel__hint">
            Nejprve vyberte den v kalendáři.
          </p>
        )}

        {selectedDate && (
          <>
            <h3 className="booking-panel__title">
              Volné hodinové bloky · {selectedDate}
            </h3>
            {daySlots.length === 0 ? (
              <p className="muted">Pro tento den už nejsou volné časy.</p>
            ) : (
              <div className="booking-times">
                {daySlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    className={`booking-time${selectedSlot?.id === slot.id ? " is-selected" : ""}`}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setStep("form");
                    }}
                  >
                    {hourBlockLabel(slot.time)}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {step === "form" && selectedSlot && (
          <form className="booking-form" onSubmit={submit}>
            <h3 className="booking-panel__title">
              Objednávka · {selectedSlot.date}{" "}
              {hourBlockLabel(selectedSlot.time)}
            </h3>

            <fieldset className="booking-services">
              <legend>Výběr služby</legend>
              {services.map((s) => {
                const selected = service === s.title;
                return (
                  <div
                    key={s.id}
                    className={`booking-service${selected ? " is-selected" : ""}`}
                  >
                    <div className="booking-service__row">
                      <label className="booking-service__pick">
                        <input
                          type="radio"
                          name="service"
                          required
                          checked={selected}
                          onChange={() => setService(s.title)}
                        />
                        <Link
                          href={`/sluzby/${s.id}`}
                          className="booking-service__name"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {s.title}
                        </Link>
                      </label>
                    </div>
                    <p className="booking-service__short">{s.short}</p>
                  </div>
                );
              })}
            </fieldset>

            <label className="booking-field">
              <span>Jméno a příjmení</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label className="booking-field">
              <span>E-mail</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>
            <label className="booking-field">
              <span>Telefon</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </label>
            <label className="booking-field">
              <span>Poznámka</span>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
            {error && <p className="booking-error">{error}</p>}
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? "Odesílám…" : "Potvrdit rezervaci"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
