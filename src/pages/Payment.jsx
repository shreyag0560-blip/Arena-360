import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { venueById } from '../data/facilities.js';
import { trainerById } from '../data/trainers.js';
import { createBooking } from '../utils/bookings.js';
import { formatDate, slotLabel, money } from '../utils/dates.js';
import { KEYS } from '../utils/storage.js';
import { validateCardNumber, validateCvv, validateExpiry, validateUpi } from '../utils/validators.js';

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Canara Bank'];

export default function Payment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pending = JSON.parse(sessionStorage.getItem(KEYS.pending) || 'null');

  const [tab, setTab] = useState('credit'); // credit | debit | online
  const [online, setOnline] = useState('upi'); // upi | netbanking
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [upi, setUpi] = useState('');
  const [bank, setBank] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | processing | failed
  const [message, setMessage] = useState('');

  if (!pending) return <Navigate to="/sports" replace />;
  const trainer = pending.kind === 'trainer' ? trainerById(pending.trainerId) : null;
  const venue = trainer ? null : venueById(pending.venueId);
  if (!trainer && !venue) return <Navigate to="/sports" replace />;

  function onCard(e) {
    let { name, value } = e.target;
    if (name === 'number') value = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 3);
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCard((c) => ({ ...c, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  }

  function validate() {
    const err = {};
    if (tab === 'online') {
      if (online === 'upi' && !validateUpi(upi)) err.upi = 'Enter a valid UPI ID, e.g. name@bank';
      if (online === 'netbanking' && !bank) err.bank = 'Select your bank.';
    } else {
      if (card.name.trim().length < 2) err.name = 'Enter the name on the card.';
      if (!validateCardNumber(card.number)) err.number = 'Card number must be 16 digits.';
      if (!validateExpiry(card.expiry)) err.expiry = 'Use a valid future date (MM/YY).';
      if (!validateCvv(card.cvv)) err.cvv = 'CVV must be 3 digits.';
    }
    return err;
  }

  function pay(e) {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    setStatus('processing');
    setMessage('');

    // Simulated gateway. In test mode: a card ending 0000 or a UPI ID starting "fail" is declined.
    setTimeout(() => {
      const declined =
        (tab !== 'online' && card.number.replace(/\s/g, '').endsWith('0000')) ||
        (tab === 'online' && online === 'upi' && upi.trim().toLowerCase().startsWith('fail'));

      if (declined) {
        setStatus('failed');
        setMessage('The bank declined this payment. No money was deducted.');
        return;
      }

      const method = tab === 'online' ? online : tab;
      const res = createBooking({ userId: user.id, venue, trainer, date: pending.date, hour: pending.hour, amount: pending.amount, method });
      if (!res.ok) {
        sessionStorage.removeItem(KEYS.pending);
        navigate(trainer ? `/trainers/${trainer.id}` : `/book/${venue.id}`, { replace: true });
        return;
      }
      sessionStorage.removeItem(KEYS.pending);
      navigate(`/confirmation/${res.booking.id}`, { replace: true });
    }, 1600);
  }

  const processing = status === 'processing';

  return (
    <div className="container section">
      <div className="book-layout">
        <form onSubmit={pay} noValidate>
          <h1>Payment</h1>

          {status === 'failed' && (
            <div className="alert alert-error" role="alert">
              <strong>Payment failed.</strong> {message} You can retry or switch to another method.
            </div>
          )}

          <div className="tabs" role="tablist">
            {[['credit', 'Credit card'], ['debit', 'Debit card'], ['online', 'Net banking / UPI']].map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'tab active' : 'tab'}
                onClick={() => { setTab(id); setErrors({}); setStatus('idle'); }} disabled={processing}>
                {label}
              </button>
            ))}
          </div>

          {tab !== 'online' ? (
            <div className="pay-panel">
              <label className="field">
                <span>Name on card</span>
                <input className={`input ${errors.name ? 'invalid' : ''}`} name="name" value={card.name} onChange={onCard} autoComplete="cc-name" />
                {errors.name && <em className="error-text">{errors.name}</em>}
              </label>
              <label className="field">
                <span>Card number</span>
                <input className={`input ${errors.number ? 'invalid' : ''}`} name="number" inputMode="numeric" placeholder="0000 0000 0000 0000" value={card.number} onChange={onCard} autoComplete="cc-number" />
                {errors.number && <em className="error-text">{errors.number}</em>}
              </label>
              <div className="row">
                <label className="field">
                  <span>Expiry</span>
                  <input className={`input ${errors.expiry ? 'invalid' : ''}`} name="expiry" placeholder="MM/YY" value={card.expiry} onChange={onCard} autoComplete="cc-exp" />
                  {errors.expiry && <em className="error-text">{errors.expiry}</em>}
                </label>
                <label className="field">
                  <span>CVV</span>
                  <input className={`input ${errors.cvv ? 'invalid' : ''}`} name="cvv" type="password" inputMode="numeric" value={card.cvv} onChange={onCard} autoComplete="cc-csc" />
                  {errors.cvv && <em className="error-text">{errors.cvv}</em>}
                </label>
              </div>
            </div>
          ) : (
            <div className="pay-panel">
              <div className="radio-row">
                <label><input type="radio" checked={online === 'upi'} onChange={() => { setOnline('upi'); setErrors({}); }} /> UPI</label>
                <label><input type="radio" checked={online === 'netbanking'} onChange={() => { setOnline('netbanking'); setErrors({}); }} /> Net banking</label>
              </div>
              {online === 'upi' ? (
                <label className="field">
                  <span>UPI ID</span>
                  <input className={`input ${errors.upi ? 'invalid' : ''}`} value={upi} onChange={(e) => { setUpi(e.target.value); setErrors({}); }} placeholder="name@bank" />
                  {errors.upi && <em className="error-text">{errors.upi}</em>}
                </label>
              ) : (
                <label className="field">
                  <span>Select bank</span>
                  <select className={`input ${errors.bank ? 'invalid' : ''}`} value={bank} onChange={(e) => { setBank(e.target.value); setErrors({}); }}>
                    <option value="">Choose your bank</option>
                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                  {errors.bank && <em className="error-text">{errors.bank}</em>}
                </label>
              )}
            </div>
          )}

          <button className="btn btn-dark btn-block" disabled={processing}>
            {processing ? 'Processing payment...' : status === 'failed' ? `Retry payment ${money(pending.amount)}` : `Pay ${money(pending.amount)}`}
          </button>
          <p className="fine">
            Demo mode: no real money moves. To test a failed payment, use a card ending in 0000 or a UPI ID starting with "fail".
          </p>
        </form>

        <aside className="summary">
          <h2>Order summary</h2>
          <dl className="facts stack">
            {trainer ? (
              <div><dt>Trainer</dt><dd>{trainer.name}</dd></div>
            ) : (
              <div><dt>Venue</dt><dd>{venue.name}, {venue.area}</dd></div>
            )}
            <div><dt>Date</dt><dd>{formatDate(pending.date)}</dd></div>
            <div><dt>Time</dt><dd>{slotLabel(pending.hour)}</dd></div>
          </dl>
          <p className="total"><span>Total</span><strong>{money(pending.amount)}</strong></p>
        </aside>
      </div>
    </div>
  );
}
