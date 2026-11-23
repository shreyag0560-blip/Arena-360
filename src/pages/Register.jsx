import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PasswordChecklist from '../components/PasswordChecklist.jsx';
import { validateName, validateEmail, validatePhone, isStrongPassword } from '../utils/validators.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  function onChange(e) {
    let { name, value } = e.target;
    if (name === 'phone') value = value.replace(/\D/g, '').slice(0, 10);
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  }

  function validate(f) {
    const err = {};
    if (!validateName(f.name)) err.name = 'Enter your full name (letters only).';
    if (!validateEmail(f.email)) err.email = 'Enter a valid email address.';
    if (!validatePhone(f.phone)) err.phone = 'Enter a valid 10-digit mobile number.';
    if (!isStrongPassword(f.password)) err.password = 'Your password does not meet all the rules below.';
    if (f.confirm !== f.password) err.confirm = 'Passwords do not match.';
    return err;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setFormError('');
    const err = validate(form);
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    const res = await register(form);
    setBusy(false);
    if (!res.ok) return setFormError(res.error);
    navigate('/login', { state: { registered: true, email: form.email.trim().toLowerCase() } });
  }

  return (
    <section className="auth">
      <div className="auth-side">
        <p className="eyebrow eyebrow-light">New here?</p>
        <h1>Your court is<br />waiting.</h1>
        <p>Create an account to browse venues, check live slot availability and pay online in under two minutes.</p>
      </div>

      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <h2>Create your account</h2>
        {formError && <p className="alert alert-error" role="alert">{formError}</p>}

        <label className="field">
          <span>Full name</span>
          <input className={`input ${errors.name ? 'invalid' : ''}`} name="name" value={form.name} onChange={onChange} autoComplete="name" />
          {errors.name && <em className="error-text">{errors.name}</em>}
        </label>

        <div className="row">
          <label className="field">
            <span>Email</span>
            <input className={`input ${errors.email ? 'invalid' : ''}`} type="email" name="email" value={form.email} onChange={onChange} autoComplete="email" />
            {errors.email && <em className="error-text">{errors.email}</em>}
          </label>
          <label className="field">
            <span>Mobile number</span>
            <input className={`input ${errors.phone ? 'invalid' : ''}`} inputMode="numeric" name="phone" value={form.phone} onChange={onChange} autoComplete="tel" />
            {errors.phone && <em className="error-text">{errors.phone}</em>}
          </label>
        </div>

        <label className="field">
          <span>Password</span>
          <div className="pw-wrap">
            <input className={`input ${errors.password ? 'invalid' : ''}`} type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={onChange} autoComplete="new-password" />
            <button type="button" className="link-btn" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
          </div>
          {errors.password && <em className="error-text">{errors.password}</em>}
        </label>
        <PasswordChecklist password={form.password} />

        <label className="field">
          <span>Confirm password</span>
          <input className={`input ${errors.confirm ? 'invalid' : ''}`} type={showPw ? 'text' : 'password'} name="confirm" value={form.confirm} onChange={onChange} autoComplete="new-password" />
          {errors.confirm && <em className="error-text">{errors.confirm}</em>}
        </label>

        <button className="btn btn-dark btn-block" disabled={busy}>{busy ? 'Creating account...' : 'Register'}</button>
        <p className="switch">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </section>
  );
}
