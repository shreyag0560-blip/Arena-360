import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { SPORTS } from '../data/facilities.js';
import { validateName, validatePhone } from '../utils/validators.js';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [sports, setSports] = useState(user.sports || []);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const toggle = (id) => {
    setSaved(false);
    setSports((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  function onSubmit(e) {
    e.preventDefault();
    const err = {};
    if (!validateName(name)) err.name = 'Enter your full name (letters only).';
    if (!validatePhone(phone)) err.phone = 'Enter a valid 10-digit mobile number.';
    setErrors(err);
    if (Object.keys(err).length) return;
    updateProfile({ name: name.trim(), phone, sports });
    setSaved(true);
  }

  return (
    <div className="container section narrow">
      <div className="section-head">
        <h1>Your profile</h1>
        <p className="muted">Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
      </div>

      <form className="card" onSubmit={onSubmit} noValidate>
        {saved && <p className="alert alert-ok" role="status">Profile saved.</p>}

        <label className="field">
          <span>Full name</span>
          <input className={`input ${errors.name ? 'invalid' : ''}`} value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} />
          {errors.name && <em className="error-text">{errors.name}</em>}
        </label>

        <div className="row">
          <label className="field">
            <span>Email</span>
            <input className="input" value={user.email} disabled />
          </label>
          <label className="field">
            <span>Mobile number</span>
            <input className={`input ${errors.phone ? 'invalid' : ''}`} inputMode="numeric" value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setSaved(false); }} />
            {errors.phone && <em className="error-text">{errors.phone}</em>}
          </label>
        </div>

        <fieldset className="field">
          <legend>Preferred sports</legend>
          <div className="chips">
            {SPORTS.map((s) => (
              <label key={s.id} className={`chip chip-check ${sports.includes(s.id) ? 'active' : ''}`}>
                <input type="checkbox" checked={sports.includes(s.id)} onChange={() => toggle(s.id)} />
                {s.name}
              </label>
            ))}
          </div>
        </fieldset>

        <button className="btn btn-dark">Save changes</button>
      </form>
    </div>
  );
}
