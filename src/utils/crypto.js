// Passwords are never stored as plain text: we salt + hash them with SHA-256.
// (A real production app would do this on a server with bcrypt/argon2.)
export function makeSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(salt + password);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
