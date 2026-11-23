import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setOpen(false);

  function handleLogout() {
    logout();
    close();
    navigate('/login');
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={close}>
          Arena<span>360</span>
        </Link>

        <button className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span></span><span></span><span></span>
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {user ? (
            <>
              <NavLink to="/sports" onClick={close}>Venues</NavLink>
              <NavLink to="/trainers" onClick={close}>Trainers</NavLink>
              <NavLink to="/bookings" onClick={close}>My bookings</NavLink>
              <NavLink to="/history" onClick={close}>History</NavLink>
              <NavLink to="/profile" onClick={close}>{user.name.split(' ')[0]}</NavLink>
              <button className="btn btn-ghost-light btn-sm" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Log in</NavLink>
              <Link to="/register" className="btn btn-lime btn-sm" onClick={close}>Create account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
