import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';

export const GOOGLE_OAUTH_COOKIE = 'hsk_google_oauth';
export const GOOGLE_OAUTH_DURATION_SECONDS = 10 * 60;

interface OAuthStatePayload {
  state: string;
  codeVerifier: string;
  exp: number;
}

function getSigningSecret() {
  const secret = process.env.SESSION_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be configured in production.');
  }
  return secret ?? 'hsk-pixel-town-development-session-secret';
}

function sign(value: string) {
  return createHmac('sha256', getSigningSecret()).update(value).digest('base64url');
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createOAuthState(codeVerifier: string) {
  const payload: OAuthStatePayload = {
    state: randomBytes(32).toString('base64url'),
    codeVerifier,
    exp: Math.floor(Date.now() / 1000) + GOOGLE_OAUTH_DURATION_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return { state: payload.state, cookieValue: `${encoded}.${sign(encoded)}` };
}

export function readOAuthState(cookieValue: string | undefined, returnedState: string | null) {
  if (!cookieValue || !returnedState) return null;
  const [encoded, signature] = cookieValue.split('.');
  if (!encoded || !signature || !constantTimeEqual(signature, sign(encoded))) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as OAuthStatePayload;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    if (!constantTimeEqual(payload.state, returnedState) || !payload.codeVerifier) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getGoogleOAuthClient(origin: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;
  if (!clientId || !clientSecret) throw new Error('Google OAuth is not configured.');
  return {
    clientId,
    redirectUri,
    client: new OAuth2Client(clientId, clientSecret, redirectUri),
  };
}
