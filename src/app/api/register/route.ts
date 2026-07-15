import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for') || '127.0.0.1').split(',')[0].trim();
    const limiter = rateLimit(ip, 10, 60000); // 10 requests per minute

    if (!limiter.success) {
      return NextResponse.json({ error: 'Thao tác quá nhanh. Vui lòng thử lại sau.' }, { status: 429 });
    }

    const { username, password } = await request.json().catch(() => ({}));

    if (!username || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.' }, { status: 400 });
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: 'Tên tài khoản phải từ 3 đến 20 ký tự.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải từ 6 ký tự trở lên.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Tên tài khoản này đã được sử dụng.' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and initial progress in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username: username.toLowerCase(),
          password: hashedPassword
        }
      });

      await tx.progress.create({
        data: {
          userId: newUser.id,
          score: 0,
          coins: 0,
          level: 1
        }
      });

      return newUser;
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      username: user.username
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau.' }, { status: 500 });
  }
}
