// Password rules shown live on the registration form.
export const passwordRules = [
  { id: 'len', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'nums', label: 'At least 2 numbers (0-9)', test: (p) => (p.match(/\d/g) || []).length >= 2 },
  {
    id: 'special',
    label: 'One special character (@ # $ % & * !)',
    test: (p) => /[^A-Za-z0-9\s]/.test(p),
  },
];

export const isStrongPassword = (p) => passwordRules.every((r) => r.test(p));
export const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
export const validatePhone = (p) => /^[6-9]\d{9}$/.test(p);
export const validateName = (n) => /^[A-Za-z][A-Za-z .'-]{1,49}$/.test(n.trim());

// Payment field checks
export const validateCardNumber = (n) => /^\d{16}$/.test(n.replace(/\s/g, ''));
export const validateCvv = (c) => /^\d{3}$/.test(c);
export const validateUpi = (u) => /^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(u.trim());

export function validateExpiry(value) {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth >= new Date();
}
