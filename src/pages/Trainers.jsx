import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SPORTS, sportById } from '../data/facilities.js';
import { TRAINERS, daysLabel } from '../data/trainers.js';
import { trainerRating } from '../utils/bookings.js';
import { nextDays, toISODate, money, timeLabel } from '../utils/dates.js';

export const initials = (name) => name.split(' ').map((p) => p[0]).join('').slice(0, 2);

export default function Trainers() {
  const [params, setParams] = useSearchParams();
  const sport = params.get('sport') || 'all';
  const minExp = Number(params.get('exp')) || 0;
  const minRating = Number(params.get('rating')) || 0;
  const maxPrice = Number(params.get('max')) || 0;
  const date = params.get('date') || '';
  const days = useMemo(() => nextDays(7), []);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === 'all' || value === '0') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  }

  const results = TRAINERS.map((t) => ({ t, r: trainerRating(t) })).filter(
    ({ t, r }) =>
      (sport === 'all' || t.sportId === sport) &&
      t.experience >= minExp &&
      Number(r.avg) >= minRating &&
      (!maxPrice || t.price <= maxPrice) &&
      (!date || t.days.includes(new Date(`${date}T00:00:00`).getDay()))
  );

  return (
    <div className="container section">
      <div className="section-head">
        <h1>Find a trainer</h1>
        <p className="muted">Search by sport, experience, rating, price and the day you want to train.</p>
      </div>

      <div className="chips" role="tablist" aria-label="Sports">
        <button className={`chip ${sport === 'all' ? 'active' : ''}`} onClick={() => update('sport', 'all')}>All sports</button>
        {SPORTS.map((s) => (
          <button key={s.id} className={`chip ${sport === s.id ? 'active' : ''}`} onClick={() => update('sport', s.id)}>
            {s.name}
          </button>
        ))}
      </div>

      <div className="filters filters-4">
        <label className="field">
          <span>Experience</span>
          <select className="input" value={minExp} onChange={(e) => update('exp', e.target.value)}>
            <option value="0">Any</option>
            <option value="3">3+ years</option>
            <option value="5">5+ years</option>
            <option value="8">8+ years</option>
          </select>
        </label>
        <label className="field">
          <span>Rating</span>
          <select className="input" value={minRating} onChange={(e) => update('rating', e.target.value)}>
            <option value="0">Any</option>
            <option value="4">4.0 and above</option>
            <option value="4.5">4.5 and above</option>
          </select>
        </label>
        <label className="field">
          <span>Price per session</span>
          <select className="input" value={maxPrice} onChange={(e) => update('max', e.target.value)}>
            <option value="0">Any price</option>
            <option value="500">Up to {money(500)}</option>
            <option value="800">Up to {money(800)}</option>
            <option value="1000">Up to {money(1000)}</option>
          </select>
        </label>
        <label className="field">
          <span>Available on</span>
          <select className="input" value={date} onChange={(e) => update('date', e.target.value)}>
            <option value="">Any day</option>
            {days.map((d) => (
              <option key={toISODate(d)} value={toISODate(d)}>
                {d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="muted result-count">{results.length} trainer{results.length === 1 ? '' : 's'} found</p>

      {results.length === 0 ? (
        <div className="empty">
          <h3>No trainers match those filters</h3>
          <p>Try a lower experience or rating, or a different day.</p>
          <button className="btn btn-outline" onClick={() => setParams({})}>Clear filters</button>
        </div>
      ) : (
        <div className="venue-grid">
          {results.map(({ t, r }) => (
            <article key={t.id} className="venue trainer">
              <div className="trainer-head">
                <span className="avatar" aria-hidden="true">{initials(t.name)}</span>
                <div>
                  <h3>{t.name}</h3>
                  <p className="eyebrow">{sportById(t.sportId).name} trainer</p>
                </div>
              </div>
              <p className="muted">
                {t.experience} years experience &middot; <span className="rating">{r.avg} / 5 ({r.count})</span>
              </p>
              <ul className="tags">
                {t.certs.map((c) => <li key={c}>{c}</li>)}
              </ul>
              <p className="fine">{daysLabel(t.days)}, {timeLabel(t.from)} to {timeLabel(t.to)}</p>
              <div className="venue-foot">
                <p className="price">{money(t.price)}<small> / session</small></p>
                <Link to={`/trainers/${t.id}`} className="btn btn-dark btn-sm">View &amp; book</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
