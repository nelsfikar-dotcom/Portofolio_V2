import { cookies } from 'next/headers';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { connection } from 'next/server';

const SESSION_COOKIE = 'porto_admin_session';
const SECRET = process.env.AUTH_SECRET || 'dzulfikar-portfolio-secure-session-key-2026';

function signValue(value: string): string {
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(value);
  const signature = hmac.digest('base64url');
  return `${value}.${signature}`;
}

function verifySignedValue(signedValue: string): string | null {
  const lastDot = signedValue.lastIndexOf('.');
  if (lastDot === -1) return null;

  const value = signedValue.substring(0, lastDot);
  const signature = signedValue.substring(lastDot + 1);

  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(value);
  const expectedSig = hmac.digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSig);

  if (
    sigBuffer.length === expectedSigBuffer.length &&
    crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)
  ) {
    return value;
  }
  return null;
}

export async function loginAdmin(email: string, passwordPlain: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!admin) {
    return { success: false, error: 'Email atau password tidak valid.' };
  }

  const isValid = await bcrypt.compare(passwordPlain, admin.passwordHash);
  if (!isValid) {
    return { success: false, error: 'Email atau password tidak valid.' };
  }

  // Session valid 7 hari
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const sessionPayload = JSON.stringify({ userId: admin.id, email: admin.email, expiresAt });
  const signedToken = signValue(sessionPayload);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return { success: true, admin: { id: admin.id, email: admin.email } };
}

export async function getAdminSession() {
  // Menandai pembacaan session sebagai dynamic execution di request-time
  await connection();

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const rawPayload = verifySignedValue(sessionCookie.value);
    if (!rawPayload) return null;

    const session = JSON.parse(rawPayload);
    if (!session?.expiresAt || Date.now() > session.expiresAt) {
      return null;
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true },
    });

    return admin;
  } catch {
    return null;
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}