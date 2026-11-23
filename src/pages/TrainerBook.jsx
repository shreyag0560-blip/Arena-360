import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { trainerById, daysLabel } from '../data/trainers.js';
import { sportById } from '../data/facilities.js';
import SlotPicker from '../components/SlotPicker.jsx';
import { trainerRating, trainerReviews } from '../utils/bookings.js';
import { toISODate, formatDate, slotLabel, money, timeLabel } from '../utils/dates.js';
import { KEYS } from '../utils/storage.js';
import NotFound from './NotFound.jsx';
import { initials } from './Trainers.jsx';

export default function TrainerBook() {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const trainer = trainerById(trainerId);
  const [date, setDate] = useState(toISODate(new Date()));
  const [hour, setHour] = useState(null);

  if (!trainer) return <NotFound />;
  const rating = trainerRating(trainer);
  const reviews = trainerReviews(trainer.id);

  function proceed() {
    sessionStorage.setItem(
      KEYS.pending,
      JSON.stringify({ kind: 'trainer', trainerId: trainer.id, date, hour, amount: trainer.price })
    );
    navigate('/payment');
  }

  return (
    <div className="container section">
      <Link to={`/trainers?sport=${trainer.sportId}`} className="back">&larr; Back to trainers</Link>
      <div className="book-layout">
        <div>
          <div className="trainer-head big">
            <span className="avatar" aria-hidden="true">{initials(trainer.name)}</span>
            <div>
              <p className="eyebrow">{sportById(trainer.sportId).name} trainer</p>
              <h1>{trainer.name}</h1>
              <p className="muted">
                {trainer.experience} years experience &middot; <span className="rating">{rating.avg} / 5 ({rating.count} reviews)</span>
              </p>
            </div>
          </div>

          <p>{trainer.bio}</p>
          <ul className="tags">{trainer.certs.map((c) => <li key={c}>{c}</li>)}</ul>
          <p className="fine">Works {daysLabel(trainer.days)}, {timeLabel(trainer.from)} to {timeLabel(trainer.to)}</p>

          <h2 className="h-sm">Choose a date and time</h2>
          <SlotPicker trainer={trainer} date={date} hour={hour} onDate={setDate} onHour={setHour} />

          {reviews.length > 0 && (
            <>
              <h2 className="h-sm">Recent reviews</h2>
              {reviews.map((f) => (
                <blockquote key={f.bookingId} className="review">
                  <strong>{f.rating}/5</strong> {f.comment}
                </blockquote>
              ))}
            </>
          )}
        </div>

        <aside className="summary">
          <h2>Your session</h2>
          <dl className="facts stack">
            <div><dt>Trainer</dt><dd>{trainer.name}</dd></div>
            <div><dt>Date</dt><dd>{formatDate(date)}</dd></div>
            <div><dt>Time</dt><dd>{hour !== null ? slotLabel(hour) : 'Select a slot'}</dd></div>
          </dl>
          <p className="total"><span>Total</span><strong>{hour !== null ? money(trainer.price) : '-'}</strong></p>
          <button className="btn btn-dark btn-block" disabled={hour === null} onClick={proceed}>
            Continue to payment
          </button>
          <p className="fine">Free cancellation up to 24 hours before. 50% refund up to 2 hours before.</p>
        </aside>
      </div>
    </div>
  );
}
