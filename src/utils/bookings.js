import { read, write, KEYS } from './storage.js';
import { getSlotStatus, getTrainerSlotStatus } from './availability.js';
import { trainerById } from '../data/trainers.js';
import { slotStart } from './dates.js';

export const METHOD_LABELS = {
  credit: 'Credit card',
  debit: 'Debit card',
  upi: 'UPI',
  netbanking: 'Net banking',
};

const getAll = () => read(KEYS.bookings, []);

const newId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return `A360-${id}`;
};

export const getUserBookings = (userId) => getAll().filter((b) => b.userId === userId);
export const getBooking = (id) => getAll().find((b) => b.id === id);

// Confirmed bookings whose hour is over are shown as "Completed"
export function displayStatus(b) {
  if (b.status !== 'Confirmed') return b.status;
  const end = new Date(slotStart(b.date, b.hour).getTime() + 60 * 60 * 1000);
  return end < new Date() ? 'Completed' : 'Confirmed';
}

export function createBooking({ userId, venue, trainer, date, hour, amount, method }) {
  const target = trainer || venue;
  const status = trainer ? getTrainerSlotStatus(trainer, date, hour) : getSlotStatus(venue.id, date, hour);
  if (status !== 'free') {
    return { ok: false, error: 'Sorry, this slot was just taken. Please pick another time.' };
  }
  const booking = {
    id: newId(),
    userId,
    kind: trainer ? 'trainer' : 'facility',
    venueId: venue ? venue.id : null,
    trainerId: trainer ? trainer.id : null,
    sportId: target.sportId,
    date,
    hour,
    amount,
    method,
    status: 'Confirmed',
    refund: 0,
    createdAt: new Date().toISOString(),
  };
  write(KEYS.bookings, [...getAll(), booking]);
  return { ok: true, booking };
}

// Cancellation policy: 24h+ before = full refund, 2h to 24h = 50%, under 2h = none
export function refundFor(b) {
  const hours = (slotStart(b.date, b.hour) - new Date()) / 36e5;
  if (hours >= 24) return { pct: 100, amount: b.amount };
  if (hours >= 2) return { pct: 50, amount: Math.round(b.amount * 0.5) };
  return { pct: 0, amount: 0 };
}

export function cancelBooking(id) {
  const all = getAll();
  const b = all.find((x) => x.id === id);
  if (!b || displayStatus(b) !== 'Confirmed') return { ok: false };
  const refund = refundFor(b);
  b.status = 'Cancelled';
  b.refund = refund.amount;
  b.cancelledAt = new Date().toISOString();
  write(KEYS.bookings, all);
  return { ok: true, refund };
}

export function rescheduleBooking(id, date, hour) {
  const all = getAll();
  const b = all.find((x) => x.id === id);
  if (!b) return { ok: false, error: 'Booking not found.' };
  const status =
    b.kind === 'trainer'
      ? getTrainerSlotStatus(trainerById(b.trainerId), date, hour, id)
      : getSlotStatus(b.venueId, date, hour, id);
  if (status !== 'free') {
    return { ok: false, error: 'That slot is not available. Please choose another.' };
  }
  b.date = date;
  b.hour = hour;
  b.rescheduledAt = new Date().toISOString();
  write(KEYS.bookings, all);
  return { ok: true };
}

// ---- Feedback / ratings ----
export const getFeedback = () => read(KEYS.feedback, []);
export const getFeedbackFor = (bookingId) => getFeedback().find((f) => f.bookingId === bookingId);

export function saveFeedback({ bookingId, userId, venueId, trainerId, rating, comment }) {
  const rest = getFeedback().filter((f) => f.bookingId !== bookingId);
  write(KEYS.feedback, [
    ...rest,
    { bookingId, userId, venueId, trainerId, rating, comment, at: new Date().toISOString() },
  ]);
}

export function venueRating(venueId) {
  const list = getFeedback().filter((f) => f.venueId === venueId);
  if (!list.length) return null;
  const avg = list.reduce((s, f) => s + f.rating, 0) / list.length;
  return { avg: avg.toFixed(1), count: list.length };
}

// Trainers start with a base rating; customer feedback is blended in
export function trainerRating(trainer) {
  const mine = getFeedback().filter((f) => f.trainerId === trainer.id);
  const total = trainer.rating * trainer.reviews + mine.reduce((sum, f) => sum + f.rating, 0);
  const count = trainer.reviews + mine.length;
  return { avg: (total / count).toFixed(1), count };
}

export const trainerReviews = (trainerId) =>
  getFeedback()
    .filter((f) => f.trainerId === trainerId && f.comment)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 3);
