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
};

export function emptyStore(): BookingStore {
  return {
    slots: [],
    bookings: [],
    updatedAt: new Date().toISOString(),
  };
}

export function slotKey(date: string, time: string) {
  return `${date}T${time}`;
}
