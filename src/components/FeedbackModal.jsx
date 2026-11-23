import { useState } from 'react';
import Modal from './Modal.jsx';
import { getFeedbackFor, saveFeedback } from '../utils/bookings.js';

export default function FeedbackModal({ booking, name, onClose, onSaved }) {
  const existing = getFeedbackFor(booking.id);
  const [rating, setRating] = useState(existing ? existing.rating : 0);
  const [comment, setComment] = useState(existing ? existing.comment : '');
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!rating) return setError('Please pick a star rating.');
    saveFeedback({
      bookingId: booking.id,
      userId: booking.userId,
      venueId: booking.venueId,
      trainerId: booking.trainerId,
      rating,
      comment: comment.trim(),
    });
    onSaved();
    onClose();
  }

  return (
    <Modal title={`Rate ${name}`} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className="stars" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              className={n <= rating ? 'star on' : 'star'}
              onClick={() => { setRating(n); setError(''); }}
            >
              &#9733;
            </button>
          ))}
        </div>
        <label className="field">
          <span>Comments (optional)</span>
          <textarea
            className="input"
            rows="4"
            maxLength="300"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the surface, lighting, staff?"
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Not now</button>
          <button type="submit" className="btn btn-dark">Submit feedback</button>
        </div>
      </form>
    </Modal>
  );
}
