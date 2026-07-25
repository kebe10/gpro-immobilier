import { db } from './db';
import { createHash } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'gpro-immobilier-jwt-secret-2026'
);

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
  const token = await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

export function invalidateToken(_token: string) {
  // JWT stateless - no server-side invalidation needed
  // Token expiry is handled by the JWT expiration claim
}
