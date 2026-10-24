"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_TIMES,
  hourBlockLabel,
} from "@/lib/booking/calendar";
import type { Booking, Client } from "@/lib/booking/types";
import { services } from "@/content/services";

type RunAction = (
  body: Record<string, unknown>,
) => Promise<boolean>;

type Props = {
  booking: Booking;
  busy: boolean;
  clients: Client[];
  runAction: RunAction;
  onDone?: () => void;
};

export function BookingActions({
  booking,
  busy,
  clients,
  runAction,
  onDone,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<
    null | "move" | "contact" | "menu"
  >(null);

  const [moveDate, setMoveDate] = useState(booking.date);
  const [moveTime, setMoveTime] = useState(booking.time);
  const [name, setName] = useState(booking.name);
  const [phone, setPhone] = useState(booking.phone || "");
  const [email, setEmail] = useState(booking.email || "");
  const [service, setService] = useState(booking.service || "");
  const [note, setNote] = useState(booking.note || "");

  const duration = Math.max(1, booking.durationHours ?? 1);
  const range = hourBlockLabel(booking.time, duration);

  const sortedClients = useMemo(
    () =>
      [...clients].sort((a, b) =>
        a.name.localeCompare(b.name, "cs"),
      ),
    [clients],
  );

  function closeAll() {
    setOpen(false);
    setMode(null);
    onDone?.();
  }

  async function doAction(body: Record<string, unknown>) {
    const ok = await runAction(body);
    if (ok) closeAll();
    return ok;
  }

  return (
    <div className="booking-actions">
      <button
        type="button"
        className={`btn btn--ghost booking-actions__toggle${open ? " is-open" : ""}`}
        disabled={busy}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          setMode((m) => (m ? m : "menu"));
        }}
      >
        Upravit rezervaci
      </button>

      {open && (
        <div className="booking-actions__panel">
          <p className="booking-actions__summary">
            <strong>{booking.name}</strong>
            <span>
              {booking.date} · {range}
            </span>
            {booking.phone ? (
              <a href={`tel:${booking.phone.replace(/\s/g, "")}`}>
                {booking.phone}
              </a>
            ) : (
              <span className="muted">telefon chybí</span>
            )}
            {booking.email ? (
              <a href={`mailto:${booking.email}`}>{booking.email}</a>
            ) : (
              <span className="muted">e-mail chybí</span>
            )}
          </p>

          {(mode === "menu" || mode === null) && (
            <div className="booking-actions__grid">
              <button
                type="button"
                className="btn btn--primary"
                disabled={busy || !booking.email}
                title={
                  !booking.email
                    ? "Nejdřív doplňte e-mail v „Upravit kontakt“"
                    : undefined
                }
                onClick={() =>
                  doAction({
                    action: "notify",
                    bookingId: booking.id,
                    notifyKind: "confirm",
                  })
                }
              >
                Odeslat info o rezervaci
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={busy}
                onClick={() => setMode("move")}
              >
                Změnit / přesunout čas
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={busy}
                onClick={() =>
                  doAction({
                    action: "extend",
                    bookingId: booking.id,
                    extraHours: 1,
                  })
                }
              >
                Prodloužit o 1 hodinu
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={busy}
                onClick={() => setMode("contact")}
              >
                Upravit kontakt
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={busy}
                onClick={() =>
                  doAction({
                    action: "saveClient",
                    bookingId: booking.id,
                  })
                }
              >
                Uložit do klientů
              </button>
              <button
                type="button"
                className="btn btn--danger"
                disabled={busy}
                onClick={() => {
                  if (
                    !window.confirm(
                      `Zrušit rezervaci ${booking.name} (${booking.date} ${range})? Klient dostane e-mail, pokud má vyplněný.`,
                    )
                  ) {
                    return;
                  }
                  void doAction({
                    action: "cancelBooking",
                    bookingId: booking.id,
                  });
                }}
              >
                Zrušit a uvolnit
              </button>
            </div>
          )}

          {mode === "move" && (
            <form
              className="booking-actions__form"
              onSubmit={(e) => {
                e.preventDefault();
                void doAction({
                  action: "move",
                  bookingId: booking.id,
                  date: moveDate,
                  time: moveTime,
                });
              }}
            >
              <label className="booking-field">
                <span>Nové datum</span>
                <input
                  type="date"
                  required
                  value={moveDate}
                  onChange={(e) => setMoveDate(e.target.value)}
                />
              </label>
              <label className="booking-field">
                <span>Nový hodinový blok</span>
                <select
                  required
                  value={moveTime}
                  onChange={(e) => setMoveTime(e.target.value)}
                >
                  {DEFAULT_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {hourBlockLabel(t)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="sprava-actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={busy}
                >
                  Přesunout a upozornit
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setMode("menu")}
                >
                  Zpět
                </button>
              </div>
            </form>
          )}

          {mode === "contact" && (
            <form
              className="booking-actions__form"
              onSubmit={(e) => {
                e.preventDefault();
                void doAction({
                  action: "updateContact",
                  bookingId: booking.id,
                  name,
                  phone,
                  email,
                  service,
                  note,
                });
              }}
            >
              {sortedClients.length > 0 && (
                <label className="booking-field">
                  <span>Načíst ze seznamu klientů</span>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const c = clients.find((x) => x.id === e.target.value);
                      if (!c) return;
                      setName(c.name);
                      setPhone(c.phone);
                      setEmail(c.email);
                      if (c.note) setNote(c.note);
                    }}
                  >
                    <option value="">— vybrat klienta —</option>
                    {sortedClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.phone ? ` · ${c.phone}` : ""}
                        {c.email ? ` · ${c.email}` : ""}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="booking-field">
                <span>Jméno</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="booking-field">
                <span>Telefon</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label className="booking-field">
                <span>E-mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="booking-field">
                <span>Služba</span>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="">— nevybráno —</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="booking-field">
                <span>Poznámka</span>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <div className="sprava-actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={busy}
                >
                  Uložit kontakt
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setMode("menu")}
                >
                  Zpět
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
