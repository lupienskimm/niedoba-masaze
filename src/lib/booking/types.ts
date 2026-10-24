export type SlotStatus = "available" | "booked";

export type BookingStatus = "potvrzena" | "zrusena" | "probehla";
export type BookingSource = "web" | "telefon" | "import";

export type EmailLogTyp =
  | "potvrzeni"
  | "pripominka"
  | "zmena"
  | "zruseni"
  | "prehled"
  | "prodlouzeni";

export type TimeSlot = {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time: string;
  status: SlotStatus;
  bookingId?: string;
};

export type Booking = {
  id: string;
  slotId: string;
  date: string;
  time: string;
  /** How many consecutive hour blocks this booking occupies (default 1). */
  durationHours?: number;
  name: string;
  email: string;
  phone: string;
  note?: string;
  service?: string;
  clientId?: string;
  createdAt: string;
  cancelToken: string;
  /** @deprecated use potvrzeniOdeslano */
  lastNotifiedAt?: string;
  potvrzeniOdeslano?: string;
  stav?: BookingStatus;
  zdroj?: BookingSource;
  upraveno?: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type EmailLogEntry = {
  id: string;
  rezervaceId: string;
  typ: EmailLogTyp;
  prijemceSkutecny: string;
  prijemceOdeslano: string;
  resendId?: string;
  stav: "ok" | "chyba";
  chyba?: string;
  odeslano: string;
};

export type BookingStore = {
  slots: TimeSlot[];
  bookings: Booking[];
  clients: Client[];
  emailLog: EmailLogEntry[];
  updatedAt: string;
  /** Applied seed/migration version (hourly blocks + real bookings). */
  seedVersion?: number;
};

export function emptyStore(): BookingStore {
  return {
    slots: [],
    bookings: [],
    clients: [],
    emailLog: [],
    updatedAt: new Date().toISOString(),
    seedVersion: 0,
  };
}

export function slotKey(date: string, time: string) {
  return `${date}T${time}`;
}

export function isBookingActive(b: Booking) {
  return (b.stav || "potvrzena") !== "zrusena";
}

export function hasConfirmationSent(b: Booking) {
  return Boolean(b.potvrzeniOdeslano || b.lastNotifiedAt);
}
