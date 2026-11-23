import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { describeBooking } from '../utils/resource.js';
import { getUserBookings, displayStatus } from '../utils/bookings.js';
import { slotStart, money } from '../utils/dates.js';
import BookingCard from '../components/BookingCard.jsx';
import FeedbackModal from '../components/FeedbackModal.jsx';

export default function History() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [rating, setRating] = useState(null);
  const [, setTick] = useState(0);

  const all = getUserBookings(user.id).sort((a, b) => slotStart(b.date, b.hour) - slotStart(a.date, a.hour));
  const shown = all.filter((b) => filter === 'All' || displayStatus(b) === filter);

  const paid = all.reduce((s, b) => s + b.amount, 0);
  const refunded = all.reduce((s, b) => s + (b.refund || 0), 0);

  return (
    <div className="container section">
      <div className="section-head">
        <h1>Booking history</h1>
        <p className="muted">Every booking and payment on your account.</p>
      </div>

      <div className="stat-row">
        <div><strong>{all.length}</strong><span>Bookings</span></div>
        <div><strong>{money(paid)}</strong><span>Total paid</span></div>
        <div><strong>{money(refunded)}</strong><span>Refunded</span></div>
        <div><strong>{money(paid - refunded)}</strong><span>Net spend</span></div>
      </div>

      <div className="chips">
        {['All', 'Confirmed', 'Completed', 'Cancelled'].map((f) => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="empty"><h3>No bookings to show</h3><p>Nothing matches this filter yet.</p></div>
      ) : (
        <div className="booking-list">
          {shown.map((b) => <BookingCard key={b.id} booking={b} onFeedback={setRating} />)}
        </div>
      )}

      {rating && (
        <FeedbackModal booking={rating} name={describeBooking(rating).title} onClose={() => setRating(null)} onSaved={() => setTick((t) => t + 1)} />
      )}
    </div>
  );
}
