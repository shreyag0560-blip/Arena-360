import { read, KEYS } from './storage.js';
import { pad } from './dates.js';

// Venues are open 6 AM to 10 PM, one-hour slots (6..21)
export const SLOT_HOURS = Array.from({ length: 16 }, (_, i) => i + 6);

// Peak hours (5 PM to 9 PM) cost 25% more
export const getPrice = (venue, hour) =>
  Math.round(venue.price * (hour >= 17 && hour < 21 ? 1.25 : 1));

// Simple string hash. It makes some slots "already booked by other customers"
// in a repeatable way, so the demo behaves like a real, busy venue.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const isPrebooked = (venueId, iso, hour) => hash(`${venueId}|${iso}|${hour}`) % 100 < 28;

// a booking is for either a venue or a trainer
const resourceOf = (b) => (b.kind === 'trainer' ? b.trainerId : b.venueId);

const isBookedByUsers = (venueId, iso, hour, ignoreId) =>
  read(KEYS.bookings, []).some(
    (b) =>
      resourceOf(b) === venueId &&
      b.date === iso &&
      b.hour === hour &&
      b.status === 'Confirmed' &&
      b.id !== ignoreId
  );

// returns 'past' | 'booked' | 'free'
export function getSlotStatus(venueId, iso, hour, ignoreId) {
  if (new Date(`${iso}T${pad(hour)}:00:00`) <= new Date()) return 'past';
  if (isPrebooked(venueId, iso, hour)) return 'booked';
  if (isBookedByUsers(venueId, iso, hour, ignoreId)) return 'booked';
  return 'free';
}

// Trainers only work on certain weekdays and hours: 'off' outside those
export function getTrainerSlotStatus(trainer, iso, hour, ignoreId) {
  const weekday = new Date(`${iso}T00:00:00`).getDay();
  if (!trainer.days.includes(weekday) || hour < trainer.from || hour >= trainer.to) return 'off';
  return getSlotStatus(trainer.id, iso, hour, ignoreId);
}
