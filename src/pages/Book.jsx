import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { venueById, sportById } from '../data/facilities.js';
import SlotPicker from '../components/SlotPicker.jsx';
import { getPrice } from '../utils/availability.js';
import { toISODate, formatDate, slotLabel, money } from '../utils/dates.js';
import { write, KEYS } from '../utils/storage.js';
import NotFound from './NotFound.jsx';

export default function Book() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const venue = venueById(venueId);
  const [date, setDate] = useState(toISODate(new Date()));
  const [hour, setHour] = useState(null);

  if (!venue) return <NotFound />;
  const amount = hour !== null ? getPrice(venue, hour) : 0;

  function proceed() {
    // Held in sessionStorage until the payment step finishes
    sessionStorage.setItem(KEYS.pending, JSON.stringify({ venueId: venue.id, date, hour, amount }));
    navigate('/payment');
  }

  return (
    <div className="container section">
      <Link to={`/sports?sport=${venue.sportId}`} className="back">&larr; Back to venues</Link>
      <div className="book-layout">
        <div>
          <p className="eyebrow">{sportById(venue.sportId).name}</p>
          <h1>{venue.name}</h1>
          <p className="muted">{venue.area} &middot; {venue.surface}</p>
          <ul className="tags">{venue.amenities.map((a) => <li key={a}>{a}</li>)}</ul>

          <h2 className="h-sm">Choose a date and time</h2>
          <SlotPicker venue={venue} date={date} hour={hour} onDate={setDate} onHour={setHour} />
        </div>

        <aside className="summary">
          <h2>Your booking</h2>
          <dl className="facts stack">
            <div><dt>Venue</dt><dd>{venue.name}</dd></div>
            <div><dt>Date</dt><dd>{formatDate(date)}</dd></div>
            <div><dt>Time</dt><dd>{hour !== null ? slotLabel(hour) : 'Select a slot'}</dd></div>
          </dl>
          <p className="total"><span>Total</span><strong>{hour !== null ? money(amount) : '-'}</strong></p>
          <button className="btn btn-dark btn-block" disabled={hour === null} onClick={proceed}>
            Continue to payment
          </button>
          <p className="fine">Free cancellation up to 24 hours before. 50% refund up to 2 hours before.</p>
        </aside>
      </div>
    </div>
  );
}
