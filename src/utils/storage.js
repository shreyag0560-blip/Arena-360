// Tiny wrapper around localStorage so every page reads/writes data the same way.
export const KEYS = {
  users: 'arena360_users',
  session: 'arena360_session',
  bookings: 'arena360_bookings',
  feedback: 'arena360_feedback',
  attempts: 'arena360_login_attempts',
  pending: 'arena360_pending_booking',
};

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
