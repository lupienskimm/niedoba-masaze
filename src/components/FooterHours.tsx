"use client";

import { useEffect, useState } from "react";

const OPEN_MIN = 8 * 60;
const CLOSE_MIN = 18 * 60;

function pragueNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Prague",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
  const map: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };
  const weekday = map[get("weekday")] ?? 1;
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const isWeekend = weekday === 0 || weekday === 6;
  const open = !isWeekend && minutes >= OPEN_MIN && minutes < CLOSE_MIN;
  return { open, isWeekend };
}

/** Tiny live hours line for footer. */
export function FooterHours() {
  const [label, setLabel] = useState("Po–Pá 8:00–18:00 · víkend zavřeno");

  useEffect(() => {
    const tick = () => {
      const { open, isWeekend } = pragueNow();
      if (isWeekend) {
        setLabel("Víkend zavřeno · Po–Pá 8:00–18:00");
      } else if (open) {
        setLabel("Teď otevřeno · Po–Pá 8:00–18:00");
      } else {
        setLabel("Teď zavřeno · Po–Pá 8:00–18:00");
      }
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return <p className="site-footer__hours">{label}</p>;
}
