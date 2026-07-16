import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GOOGLE_OAUTH_COOKIE, getGoogleOAuthClient, readOAuthState } from '@/lib/google-oauth';
import { setSessionCookie } from '@/lib/session';

function authError(request: NextRequest, code: string) {
  const response = NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(code)}`, request.url));
  response.cookies.set({ name: GOOGLE_OAUTH_COOKIE, value: '', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/auth/google', maxAge: 0 });
  return response;
}

function sanitizeUsername(name: string, email: string) {
  const source = name.trim() || email.split('@')[0] || 'learner';
  const normalized = source.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const safe = normalized.replace(/[^a-z0-9_]/g, '').slice(0, 16);
  return safe.length >= 3 ? safe : `hsk${randomBytes(3).toString('hex')}`;
}

async function uniqueUsername(name: string, email: string) {
  const base = sanitizeUsername(name, email);
  let candidate = base;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const existing = await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } });
    if (!existing) return candidate;
    candidate = `${base.slice(0, 13)}${randomBytes(3).toString('hex')}`.slice(0, 20);
  }
  return `hsk${randomBytes(8).toString('hex')}`.slice(0, 20);
}

export async function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get('error');
  if (error) return authError(request, error === 'access_denied' ? 'google_cancelled' : 'google_failed');

  const code = request.nextUrl.searchParams.get('code');
  const returnedState = request.nextUrl.searchParams.get('state');
  const savedState = readOAuthState(request.cookies.get(GOOGLE_OAUTH_COOKIE)?.value, returnedState);
  if (!code || !savedState) return authError(request, 'invalid_oauth_state');

  try {
    const { client, clientId, redirectUri } = getGoogleOAuthClient(request.nextUrl.origin);
    const { tokens } = await client.getToken({ code, codeVerifier: savedState.codeVerifier, redirect_uri: redirectUri });
    if (!tokens.id_token) return authError(request, 'missing_id_token');

    const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: clientId });
    const profile = ticket.getPayload();
    const email = profile?.email?.trim().toLowerCase();
    if (!profile?.sub || !email || !profile.email_verified) return authError(request, 'unverified_google_account');

    const existingGoogleUser = await prisma.user.findUnique({ where: { googleSub: profile.sub } });
    const existingEmailUser = existingGoogleUser ?? await prisma.user.findUnique({ where: { email } });
    if (existingEmailUser?.googleSub && existingEmailUser.googleSub !== profile.sub) {
      return authError(request, 'account_link_conflict');
    }

    const username = existingEmailUser?.username ?? await uniqueUsername(profile.name ?? '', email);
    const user = await prisma.$transaction(async (tx) => {
      const linkedUser = existingEmailUser
        ? await tx.user.update({ where: { id: existingEmailUser.id }, data: { googleSub: profile.sub } })
        : await tx.user.create({ data: { username, email, password: null, googleSub: profile.sub } });
      await tx.progress.upsert({ where: { userId: linkedUser.id }, create: { userId: linkedUser.id }, update: {} });
      return linkedUser;
    });

    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set({ name: GOOGLE_OAUTH_COOKIE, value: '', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/auth/google', maxAge: 0 });
    return setSessionCookie(response, user.id);
  } catch (oauthError) {
    console.error('Google OAuth callback error:', oauthError);
    return authError(request, 'google_failed');
  }
}
