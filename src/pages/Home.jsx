import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { SPORTS, VENUES, AREAS } from '../data/facilities.js';
import { TRAINERS } from '../data/trainers.js';
import { describeBooking } from '../utils/resource.js';
import { getUserBookings, displayStatus } from '../utils/bookings.js';
import { formatDate, slotLabel, slotStart } from '../utils/dates.js';

const STEPS = [
  ['Pick a sport', 'Filter venues or trainers by sport, price, area and rating.'],
  ['Check the slots', 'See which hours are free, booked or priced at peak rates.'],
  ['Pay online', 'Card, UPI or net banking. Your booking is confirmed instantly.'],
  ['Manage it', 'Reschedule or cancel from My bookings, and rate the venue after.'],
];

export default function Home() {
  const { user } = useAuth();
  const next = user
    ? getUserBookings(user.id)
        .filter((b) => displayStatus(b) === 'Confirmed')
        .sort((a, b) => slotStart(a.date, a.hour) - slotStart(b.date, b.hour))[0]
    : null;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow eyebrow-light">Bengaluru &middot; 6 AM to 10 PM</p>
          <h1>Book the court.<br />Skip the phone calls.</h1>
          <p className="lead">
            {SPORTS.length} sports, {VENUES.length} venues across {AREAS.length} neighbourhoods. Pick a slot, pay, play.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/sports" className="btn btn-lime">Find a venue</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-lime">Create account</Link>
                <Link to="/login" className="btn btn-ghost-light">I already have one</Link>
              </>
            )}
          </div>
        </div>
        <div className="court-lines" aria-hidden="true"><i></i><i></i><i></i></div>
      </section>

      {next && (
        <section className="container">
          <div className="next-up">
            <div>
              <p className="eyebrow">Your next session</p>
              <h3>{describeBooking(next).title}</h3>
              <p className="muted">{formatDate(next.date)} &middot; {slotLabel(next.hour)}</p>
            </div>
            <Link to="/bookings" className="btn btn-outline">Manage</Link>
          </div>
        </section>
      )}

      <section className="container section">
        <div className="section-head">
          <h2>Choose your game</h2>
          <p className="muted">Tap a sport to see venues near you.</p>
        </div>
        <div className="sport-grid">
          {SPORTS.map((s, i) => (
            <Link key={s.id} to={`/sports?sport=${s.id}`} className={`sport-tile tone-${i % 5}`}>
              <span className="sport-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.name}</h3>
              <p>{s.blurb}</p>
              <span className="sport-count">{VENUES.filter((v) => v.sportId === s.id).length} venues</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="coach-band">
          <div>
            <p className="eyebrow">Personal training</p>
            <h2>Book a coach, not just a court</h2>
            <p>{TRAINERS.length} trainers across {SPORTS.length} sports. Compare experience, ratings and price, then book a session.</p>
          </div>
          <Link to="/trainers" className="btn btn-dark">Find a trainer</Link>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>How it works</h2>
        </div>
        <ol className="steps">
          {STEPS.map(([title, text], i) => (
            <li key={title}>
              <span className="step-num">{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
