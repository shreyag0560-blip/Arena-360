import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SPORTS, VENUES, AREAS, sportById } from '../data/facilities.js';
import { venueRating } from '../utils/bookings.js';
import { money } from '../utils/dates.js';

export default function Facilities() {
  const [params, setParams] = useSearchParams();
  const sport = params.get('sport') || 'all';
  const area = params.get('area') || 'all';
  const maxPrice = Number(params.get('max')) || 0;
  const q = params.get('q') || '';

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === 'all' || value === '0') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  }

  const results = useMemo(
    () =>
      VENUES.filter(
        (v) =>
          (sport === 'all' || v.sportId === sport) &&
          (area === 'all' || v.area === area) &&
          (!maxPrice || v.price <= maxPrice) &&
          (!q || `${v.name} ${v.area} ${sportById(v.sportId).name}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [sport, area, maxPrice, q]
  );

  return (
    <div className="container section">
      <div className="section-head">
        <h1>Find a venue</h1>
        <p className="muted">Pick a sport, narrow it down, then check live availability.</p>
      </div>

      <div className="chips" role="tablist" aria-label="Sports">
        <button className={`chip ${sport === 'all' ? 'active' : ''}`} onClick={() => update('sport', 'all')}>All sports</button>
        {SPORTS.map((s) => (
          <button key={s.id} className={`chip ${sport === s.id ? 'active' : ''}`} onClick={() => update('sport', s.id)}>
            {s.name}
          </button>
        ))}
      </div>

      <div className="filters">
        <label className="field">
          <span>Search</span>
          <input className="input" placeholder="Venue or area" value={q} onChange={(e) => update('q', e.target.value)} />
        </label>
        <label className="field">
          <span>Area</span>
          <select className="input" value={area} onChange={(e) => update('area', e.target.value)}>
            <option value="all">All areas</option>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Max price per hour</span>
          <select className="input" value={maxPrice} onChange={(e) => update('max', e.target.value)}>
            <option value="0">Any price</option>
            <option value="200">Up to {money(200)}</option>
            <option value="500">Up to {money(500)}</option>
            <option value="1000">Up to {money(1000)}</option>
          </select>
        </label>
      </div>

      <p className="muted result-count">{results.length} venue{results.length === 1 ? '' : 's'} found</p>

      {results.length === 0 ? (
        <div className="empty">
          <h3>No venues match those filters</h3>
          <p>Try a different area or a higher price limit.</p>
          <button className="btn btn-outline" onClick={() => setParams({})}>Clear filters</button>
        </div>
      ) : (
        <div className="venue-grid">
          {results.map((v) => {
            const rating = venueRating(v.id);
            return (
              <article key={v.id} className="venue">
                <div className="venue-top">
                  <span className="eyebrow">{sportById(v.sportId).name}</span>
                  <span className="rating">{rating ? `${rating.avg} / 5 (${rating.count})` : 'New'}</span>
                </div>
                <h3>{v.name}</h3>
                <p className="muted">{v.area} &middot; {v.surface}</p>
                <ul className="tags">
                  {v.amenities.map((a) => <li key={a}>{a}</li>)}
                </ul>
                <div className="venue-foot">
                  <p className="price">{money(v.price)}<small> / hour</small></p>
                  <Link to={`/book/${v.id}`} className="btn btn-dark btn-sm">Check slots</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
