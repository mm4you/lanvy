import { CodeChallengeMethod } from 'google-auth-library';
import { NextRequest, NextResponse } from 'next/server';
import { GOOGLE_OAUTH_COOKIE, GOOGLE_OAUTH_DURATION_SECONDS, createOAuthState, getGoogleOAuthClient } from '@/lib/google-oauth';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const ip = (request.headers.get('x-forwarded-for') || '127.0.0.1').split(',')[0].trim();
    if (!rateLimit(`google-start:${ip}`, 20, 60000).success) {
      return NextResponse.redirect(new URL('/?auth_error=rate_limited', request.url));
    }

    const { client, redirectUri } = getGoogleOAuthClient(request.nextUrl.origin);
    const { codeVerifier, codeChallenge } = await client.generateCodeVerifierAsync();
    const { state, cookieValue } = createOAuthState(codeVerifier);
    const authorizationUrl = client.generateAuthUrl({
      access_type: 'online',
      scope: ['openid', 'email', 'profile'],
      prompt: 'select_account',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: CodeChallengeMethod.S256,
      redirect_uri: redirectUri,
    });

    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set({
      name: GOOGLE_OAUTH_COOKIE,
      value: cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/google',
      maxAge: GOOGLE_OAUTH_DURATION_SECONDS,
    });
    return response;
  } catch (error) {
    console.error('Google OAuth start error:', error);
    return NextResponse.redirect(new URL('/?auth_error=google_not_configured', request.url));
  }
}
