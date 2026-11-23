import { useMemo, useState } from 'react';
import { nextDays, toISODate, slotLabel, money } from '../utils/dates.js';
import { SLOT_HOURS, getSlotStatus, getTrainerSlotStatus, getPrice } from '../utils/availability.js';

// Shared by venue booking, trainer booking and the reschedule dialog.
// Pass either `venue` or `trainer`.
export default function SlotPicker({ venue, trainer, date, hour, onDate, onHour, ignoreBookingId }) {
  const days = useMemo(() => nextDays(7), []);
  const [notice, setNotice] = useState('');

  const statusOf = (h) =>
    trainer
      ? getTrainerSlotStatus(trainer, date, h, ignoreBookingId)
      : getSlotStatus(venue.id, date, h, ignoreBookingId);
  const priceOf = (h) => (trainer ? trainer.price : getPrice(venue, h));

  function changeDate(iso) {
    setNotice('');
    onDate(iso);
    onHour(null);
  }

  function pick(h) {
    const status = statusOf(h);
    if (status === 'past' || status === 'off') return;
    if (status === 'booked') {
      const next = SLOT_HOURS.find((x) => x > h && statusOf(x) === 'free');
      setNotice(
        `${slotLabel(h)} is already booked.` +
          (next !== undefined ? ` The next free slot is ${slotLabel(next)}.` : ' No later slots are free that day, try another date.')
      );
      onHour(null);
      return;
    }
    setNotice('');
    onHour(h);
  }

  const small = (status, h) =>
    status === 'free' ? money(priceOf(h)) : status === 'booked' ? 'Booked' : status === 'off' ? 'Not working' : 'Passed';

  return (
    <div>
      <div className="date-strip" role="tablist" aria-label="Choose a date">
        {days.map((d) => {
          const iso = toISODate(d);
          return (
            <button
              key={iso}
              type="button"
              className={`date-chip ${iso === date ? 'active' : ''}`}
              onClick={() => changeDate(iso)}
            >
              <small>{d.toLocaleDateString('en-IN', { weekday: 'short' })}</small>
              <strong>{d.getDate()}</strong>
              <small>{d.toLocaleDateString('en-IN', { month: 'short' })}</small>
            </button>
          );
        })}
      </div>

      <div className="slot-grid">
        {SLOT_HOURS.map((h) => {
          const status = statusOf(h);
          const cls =
            status === 'free'
              ? h === hour ? 'slot selected' : 'slot'
              : `slot ${status === 'off' ? 'past' : status}`;
          return (
            <button
              key={h}
              type="button"
              className={cls}
              disabled={status === 'past' || status === 'off'}
              aria-pressed={h === hour}
              onClick={() => pick(h)}
            >
              <span>{slotLabel(h)}</span>
              <small>{small(status, h)}</small>
            </button>
          );
        })}
      </div>

      <div className="legend">
        <span><i className="dot free"></i>Available</span>
        <span><i className="dot booked"></i>Booked</span>
        {!trainer && <span><i className="dot peak"></i>Peak pricing 5 PM - 9 PM</span>}
      </div>

      {notice && <p className="alert alert-warn" role="alert">{notice}</p>}
    </div>
  );
}
