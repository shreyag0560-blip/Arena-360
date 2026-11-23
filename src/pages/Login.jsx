import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { validateEmail } from '../utils/validators.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) return setError('Enter a valid email address.');
    if (!password) return setError('Enter your password.');
    setBusy(true);
    const res = await login({ email, password });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    navigate(location.state?.from || '/sports', { replace: true });
  }

  return (
    <section className="auth">
      <div className="auth-side">
        <p className="eyebrow eyebrow-light">Welcome back</p>
        <h1>Game on.</h1>
        <p>Log in to see live slots, manage your bookings and pick up where you left off.</p>
      </div>

      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <h2>Log in</h2>
        {location.state?.registered && !error && (
          <p className="alert alert-ok">Account created. Log in to continue.</p>
        )}
        {error && <p className="alert alert-error" role="alert">{error}</p>}

        <label className="field">
          <span>Email</span>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>

        <label className="field">
          <span>Password</span>
          <div className="pw-wrap">
            <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            <button type="button" className="link-btn" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
          </div>
        </label>

        <button className="btn btn-dark btn-block" disabled={busy}>{busy ? 'Checking...' : 'Log in'}</button>
        <p className="switch">New to Arena 360? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  );
}
