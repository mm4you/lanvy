import { clearSessionCookie } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
  return clearSessionCookie(NextResponse.json({ success: true }));
}

