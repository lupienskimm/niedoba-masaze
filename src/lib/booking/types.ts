export type SlotStatus = "available" | "booked";

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
  /** Last time a confirmation / update e-mail was sent to the client. */
  lastNotifiedAt?: string;
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

export type BookingStore = {
  slots: TimeSlot[];
  bookings: Booking[];
  clients: Client[];
  updatedAt: string;
  /** Applied seed/migration version (hourly blocks + real bookings). */
  seedVersion?: number;
};

export function emptyStore(): BookingStore {
  return {
    slots: [],
    bookings: [],
    clients: [],
    updatedAt: new Date().toISOString(),
    seedVersion: 0,
  };
}

export function slotKey(date: string, time: string) {
  return `${date}T${time}`;
}
