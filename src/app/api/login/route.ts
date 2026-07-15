import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for') || '127.0.0.1').split(',')[0].trim();
    const limiter = rateLimit(ip, 15, 60000); // 15 requests per minute

    if (!limiter.success) {
      return NextResponse.json({ error: 'Thao tác quá nhanh. Vui lòng thử lại sau.' }, { status: 429 });
    }

    const { username, password } = await request.json().catch(() => ({}));

    if (!username || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'Tên tài khoản hoặc mật khẩu không chính xác.' }, { status: 400 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Tên tài khoản hoặc mật khẩu không chính xác.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      username: user.username
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau.' }, { status: 500 });
  }
}
