import { createContext, useContext, useState } from 'react';
import { read, write, KEYS } from '../utils/storage.js';
import { hashPassword, makeSalt } from '../utils/crypto.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const SESSION_MS = 2 * 60 * 60 * 1000; // session lasts 2 hours
const MAX_ATTEMPTS = 5;
const LOCK_MS = 30 * 1000;

// never expose the hash / salt to components
const publicUser = ({ hash, salt, ...rest }) => rest;

function loadSession() {
  const s = read(KEYS.session, null);
  if (!s || s.expires < Date.now()) {
    localStorage.removeItem(KEYS.session);
    return null;
  }
  const u = read(KEYS.users, []).find((x) => x.id === s.userId);
  return u ? publicUser(u) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession);

  async function register({ name, email, phone, password }) {
    const users = read(KEYS.users, []);
    const mail = email.trim().toLowerCase();
    if (users.some((u) => u.email === mail)) {
      return { ok: false, error: 'An account with this email already exists. Try logging in.' };
    }
    const salt = makeSalt();
    const hash = await hashPassword(password, salt);
    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: mail,
      phone,
      sports: [],
      salt,
      hash,
      createdAt: new Date().toISOString(),
    };
    write(KEYS.users, [...users, newUser]);
    return { ok: true };
  }

  async function login({ email, password }) {
    const mail = email.trim().toLowerCase();
    const attempts = read(KEYS.attempts, {});
    const record = attempts[mail] || { count: 0, until: 0 };

    if (record.until > Date.now()) {
      const secs = Math.ceil((record.until - Date.now()) / 1000);
      return { ok: false, error: `Too many failed attempts. Try again in ${secs} seconds.` };
    }

    const found = read(KEYS.users, []).find((u) => u.email === mail);
    const hash = found ? await hashPassword(password, found.salt) : null;

    if (!found || hash !== found.hash) {
      const count = record.count + 1;
      attempts[mail] = count >= MAX_ATTEMPTS ? { count: 0, until: Date.now() + LOCK_MS } : { count, until: 0 };
      write(KEYS.attempts, attempts);
      return { ok: false, error: 'Incorrect email or password.' };
    }

    delete attempts[mail];
    write(KEYS.attempts, attempts);
    write(KEYS.session, { userId: found.id, expires: Date.now() + SESSION_MS });
    setUser(publicUser(found));
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem(KEYS.session);
    sessionStorage.removeItem(KEYS.pending);
    setUser(null);
  }

  function updateProfile(changes) {
    const users = read(KEYS.users, []);
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return;
    users[idx] = { ...users[idx], ...changes };
    write(KEYS.users, users);
    setUser(publicUser(users[idx]));
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
