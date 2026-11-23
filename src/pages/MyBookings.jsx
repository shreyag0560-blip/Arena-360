import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { venueById } from '../data/facilities.js';
import { trainerById } from '../data/trainers.js';
import { describeBooking } from '../utils/resource.js';
import { getUserBookings, displayStatus, cancelBooking, refundFor, rescheduleBooking } from '../utils/bookings.js';
import { slotStart, formatDate, slotLabel, money } from '../utils/dates.js';
import BookingCard from '../components/BookingCard.jsx';
import Modal from '../components/Modal.jsx';
import SlotPicker from '../components/SlotPicker.jsx';
import FeedbackModal from '../components/FeedbackModal.jsx';

export default function MyBookings() {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  const [cancelling, setCancelling] = useState(null);
  const [rescheduling, setRescheduling] = useState(null);
  const [rating, setRating] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newHour, setNewHour] = useState(null);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');

  const refresh = () => setVersion((v) => v + 1);

  // version is read so the list recalculates after every change
  const upcoming = version >= 0
    ? getUserBookings(user.id)
        .filter((b) => displayStatus(b) === 'Confirmed')
        .sort((a, b) => slotStart(a.date, a.hour) - slotStart(b.date, b.hour))
    : [];

  function confirmCancel() {
    const res = cancelBooking(cancelling.id);
    setCancelling(null);
    if (res.ok) setFlash(`Booking cancelled. Refund of ${money(res.refund.amount)} will reach you in 5-7 working days.`);
    refresh();
  }

  function openReschedule(b) {
    setRescheduling(b);
    setNewDate(b.date);
    setNewHour(null);
    setError('');
  }

  function confirmReschedule() {
    const res = rescheduleBooking(rescheduling.id, newDate, newHour);
    if (!res.ok) return setError(res.error);
    setRescheduling(null);
    setFlash('Booking rescheduled.');
    refresh();
  }

  return (
    <div className="container section">
      <div className="section-head">
        <h1>My bookings</h1>
        <p className="muted">Upcoming facility bookings and trainer sessions. Past and cancelled bookings are in <Link to="/history">History</Link>.</p>
      </div>

      {flash && <p className="alert alert-ok" role="status">{flash}</p>}

      {upcoming.length === 0 ? (
        <div className="empty">
          <h3>Nothing booked yet</h3>
          <p>Find a venue or a trainer and grab a slot.</p>
          <Link to="/sports" className="btn btn-dark">Browse venues</Link>
        </div>
      ) : (
        <div className="booking-list">
          {upcoming.map((b) => (
            <BookingCard key={b.id} booking={b} onCancel={setCancelling} onReschedule={openReschedule} onFeedback={setRating} />
          ))}
        </div>
      )}

      {cancelling && (
        <Modal title="Cancel this booking?" onClose={() => setCancelling(null)}>
          {(() => {
            const r = refundFor(cancelling);
            return (
              <>
                <p>{describeBooking(cancelling).title} on {formatDate(cancelling.date)}, {slotLabel(cancelling.hour)}.</p>
                <p className="alert alert-warn">
                  Refund: <strong>{money(r.amount)}</strong> ({r.pct}% of {money(cancelling.amount)}) under the cancellation policy.
                </p>
                <div className="modal-actions">
                  <button className="btn btn-outline" onClick={() => setCancelling(null)}>Keep booking</button>
                  <button className="btn btn-danger" onClick={confirmCancel}>Yes, cancel</button>
                </div>
              </>
            );
          })()}
        </Modal>
      )}

      {rescheduling && (
        <Modal title="Reschedule booking" onClose={() => setRescheduling(null)}>
          <p className="muted">{describeBooking(rescheduling).title}. Your original price stays the same.</p>
          <SlotPicker
            venue={rescheduling.kind === 'trainer' ? undefined : venueById(rescheduling.venueId)}
            trainer={rescheduling.kind === 'trainer' ? trainerById(rescheduling.trainerId) : undefined}
            date={newDate}
            hour={newHour}
            onDate={setNewDate}
            onHour={setNewHour}
            ignoreBookingId={rescheduling.id}
          />
          {error && <p className="error-text">{error}</p>}
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={() => setRescheduling(null)}>Close</button>
            <button className="btn btn-dark" disabled={newHour === null} onClick={confirmReschedule}>Confirm new slot</button>
          </div>
        </Modal>
      )}

      {rating && (
        <FeedbackModal booking={rating} name={describeBooking(rating).title} onClose={() => setRating(null)} onSaved={refresh} />
      )}
    </div>
  );
}
