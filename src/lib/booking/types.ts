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
  name: string;
  email: string;
  phone: string;
  note?: string;
  service?: string;
  createdAt: string;
  cancelToken: string;
};

export type BookingStore = {
  slots: TimeSlot[];
  bookings: Booking[];
  updatedAt: string;
  /** Applied seed/migration version (hourly blocks + real bookings). */
  seedVersion?: number;
};

export function emptyStore(): BookingStore {
  return {
    slots: [],
    bookings: [],
    updatedAt: new Date().toISOString(),
    seedVersion: 0,
  };
}

export function slotKey(date: string, time: string) {
  return `${date}T${time}`;
}
