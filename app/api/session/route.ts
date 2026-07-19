import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserId } from '@/lib/session';

export async function GET(request: Request) {
  const userId = getSessionUserId(request);
  if (!userId) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true },
  });
  if (!user) return NextResponse.json({ error: 'Phiên không hợp lệ.' }, { status: 401 });
  return NextResponse.json({ success: true, user });
}
