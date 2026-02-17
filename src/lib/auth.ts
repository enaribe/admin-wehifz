import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'admin_session';

export interface AdminUser {
  email: string;
  createdAt: number;
  expiresAt: number;
}

/**
 * Verify the session cookie and return the user
 */
export async function verifySession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return null;
    }

    // Décoder le token
    const decoded = JSON.parse(
      Buffer.from(sessionCookie, 'base64').toString('utf-8')
    ) as AdminUser;

    // Vérifier l'expiration
    if (decoded.expiresAt < Date.now()) {
      return null;
    }

    // Vérifier que c'est bien l'admin
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

/**
 * Get session cookie name
 */
export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}
