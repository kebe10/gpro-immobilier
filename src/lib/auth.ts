import { db } from './db';
import { createHash, randomBytes } from 'crypto';

// Simple token-based auth (no external deps needed)
const sessions = new Map<string, { userId: string; expires: number }>();

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function createAdmin(email: string, password: string, name: string) {
  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) return existing;
  return db.adminUser.create({
    data: { email, passwordHash: hashPassword(password), name },
  });
}

export async function loginAdmin(email: string, password: string) {
  const user = await db.adminUser.findUnique({ where: { email } });
  if (!user || user.passwordHash !== hashPassword(password)) {
    return null;
  }
  const token = randomBytes(32).toString('hex');
  sessions.set(token, { userId: user.id, expires: Date.now() + 24 * 60 * 60 * 1000 });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export function verifyToken(token: string) {
  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { userId: session.userId };
}

export function invalidateToken(token: string) {
  sessions.delete(token);
}
