import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getBooking, METHOD_LABELS } from '../utils/bookings.js';
import { venueById, sportById } from '../data/facilities.js';
import { trainerById } from '../data/trainers.js';
import { formatDate, slotLabel, money } from '../utils/dates.js';
import NotFound from './NotFound.jsx';

export default function Confirmation() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const booking = getBooking(bookingId);
  if (!booking || booking.userId !== user.id) return <NotFound />;
  const isTrainer = booking.kind === 'trainer';
  const trainer = isTrainer ? trainerById(booking.trainerId) : null;
  const venue = isTrainer ? null : venueById(booking.venueId);

  return (
    <div className="container section narrow">
      <div className="receipt">
        <p className="eyebrow">{isTrainer ? 'Training session confirmed' : 'Booking confirmed'}</p>
        <h1>You're in.</h1>
        <p className="muted">A copy of this receipt is saved under My bookings.</p>

        <dl className="facts stack receipt-facts">
          <div><dt>Reference</dt><dd><strong>{booking.id}</strong></dd></div>
          <div><dt>Sport</dt><dd>{sportById(booking.sportId).name}</dd></div>
          {isTrainer ? (
            <div><dt>Trainer</dt><dd>{trainer.name}</dd></div>
          ) : (
            <div><dt>Venue</dt><dd>{venue.name}, {venue.area}</dd></div>
          )}
          <div><dt>Date</dt><dd>{formatDate(booking.date)}</dd></div>
          <div><dt>Time</dt><dd>{slotLabel(booking.hour)}</dd></div>
          <div><dt>Paid</dt><dd>{money(booking.amount)} via {METHOD_LABELS[booking.method]}</dd></div>
        </dl>

        <div className="receipt-actions">
          <Link to="/bookings" className="btn btn-dark">View my bookings</Link>
          <Link to={isTrainer ? '/trainers' : '/sports'} className="btn btn-outline">Book another</Link>
          <button className="btn btn-outline" onClick={() => window.print()}>Print receipt</button>
        </div>
      </div>
    </div>
  );
}
