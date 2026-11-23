export const pad = (n) => String(n).padStart(2, '0');

export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function nextDays(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const clock = (h) => `${h % 12 === 0 ? 12 : h % 12}:00 ${h < 12 ? 'AM' : 'PM'}`;
export const slotLabel = (h) => `${clock(h)} - ${clock(h + 1)}`;
export const slotStart = (iso, h) => new Date(`${iso}T${pad(h)}:00:00`);
export const money = (n) => '\u20B9' + Number(n).toLocaleString('en-IN');
export const timeLabel = (h) => clock(h);
