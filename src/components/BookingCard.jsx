import { formatDate, slotLabel, money } from '../utils/dates.js';
import { displayStatus, getFeedbackFor, METHOD_LABELS } from '../utils/bookings.js';
import { describeBooking } from '../utils/resource.js';

export default function BookingCard({ booking, onCancel, onReschedule, onFeedback }) {
  const info = describeBooking(booking);
  const status = displayStatus(booking);
  const feedback = getFeedbackFor(booking.id);

  return (
    <article className="booking">
      <div className="booking-main">
        <p className="eyebrow">{info.kind} &middot; Ref {booking.id}</p>
        <h3>{info.title}</h3>
        <p className="muted">{info.sub}</p>
        <dl className="facts">
          <div><dt>Date</dt><dd>{formatDate(booking.date)}</dd></div>
          <div><dt>Time</dt><dd>{slotLabel(booking.hour)}</dd></div>
          <div><dt>Paid</dt><dd>{money(booking.amount)} via {METHOD_LABELS[booking.method]}</dd></div>
          {status === 'Cancelled' && <div><dt>Refund</dt><dd>{money(booking.refund)}</dd></div>}
        </dl>
        {feedback && <p className="muted">Your rating: {feedback.rating}/5</p>}
      </div>

      <div className="booking-side">
        <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
        <div className="booking-actions">
          {status === 'Confirmed' && onReschedule && (
            <button className="btn btn-outline btn-sm" onClick={() => onReschedule(booking)}>Reschedule</button>
          )}
          {status === 'Confirmed' && onCancel && (
            <button className="btn btn-danger btn-sm" onClick={() => onCancel(booking)}>Cancel</button>
          )}
          {status !== 'Cancelled' && onFeedback && (
            <button className="btn btn-outline btn-sm" onClick={() => onFeedback(booking)}>
              {feedback ? 'Edit feedback' : 'Rate & review'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
