import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limit';
import { setSessionCookie } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for') || '127.0.0.1').split(',')[0].trim();
    const limiter = rateLimit(ip, 15, 60000); // 15 requests per minute

    if (!limiter.success) {
      return NextResponse.json({ error: 'Thao tác quá nhanh. Vui lòng thử lại sau.' }, { status: 429 });
    }

    const body = await request.json().catch(() => null) as { username?: unknown; password?: unknown } | null;
    const username = typeof body?.username === 'string' ? body.username.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return NextResponse.json({ error: 'Tên tài khoản hoặc mật khẩu không chính xác.' }, { status: 400 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Tên tài khoản hoặc mật khẩu không chính xác.' }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      userId: user.id,
      username: user.username,
      email: user.email
    });
    return setSessionCookie(response, user.id);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau.' }, { status: 500 });
  }
}
