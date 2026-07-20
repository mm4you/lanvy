import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendResetPasswordEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
    }

    const { action, email, code, password } = body;

    if (!email) {
      return NextResponse.json({ error: 'Vui lòng nhập địa chỉ email.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Gửi mã OTP xác minh qua Email
    if (action === 'send_code') {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: cleanEmail },
            { username: cleanEmail }
          ]
        }
      });

      if (!user) {
        return NextResponse.json({ error: 'Không tìm thấy tài khoản tương ứng với thông tin này.' }, { status: 404 });
      }

      if (!user.email) {
        return NextResponse.json({ error: 'Tài khoản này chưa đăng ký địa chỉ email để nhận OTP.' }, { status: 400 });
      }

      // Tạo mã OTP 6 số ngẫu nhiên
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Xóa mã cũ và lưu mã OTP mới có hiệu lực trong 5 phút
      await prisma.verificationToken.deleteMany({
        where: { identifier: user.email.toLowerCase() }
      });

      await prisma.verificationToken.create({
        data: {
          identifier: user.email.toLowerCase(),
          token: verificationCode,
          expires: new Date(Date.now() + 5 * 60 * 1000)
        }
      });

      // Gửi mail bằng SMTP
      await sendResetPasswordEmail(user.email.toLowerCase(), verificationCode);

      return NextResponse.json({
        success: true,
        message: 'Mã xác minh OTP đã được gửi đến email của bạn.',
        emailTarget: user.email
      });
    }

    // 2. Xác minh mã OTP
    if (action === 'verify_code') {
      if (!code) {
        return NextResponse.json({ error: 'Vui lòng nhập mã OTP.' }, { status: 400 });
      }

      const tokenRecord = await prisma.verificationToken.findFirst({
        where: {
          identifier: cleanEmail,
          token: code.trim()
        }
      });

      if (!tokenRecord) {
        return NextResponse.json({ error: 'Mã OTP không chính xác.' }, { status: 400 });
      }

      if (tokenRecord.expires < new Date()) {
        return NextResponse.json({ error: 'Mã OTP đã hết hạn.' }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: 'Xác minh OTP thành công.' });
    }

    // 3. Đặt lại mật khẩu mới
    if (action === 'reset_password') {
      if (!code || !password) {
        return NextResponse.json({ error: 'Thiếu thông tin OTP hoặc mật khẩu mới.' }, { status: 400 });
      }

      if (password.length < 6) {
        return NextResponse.json({ error: 'Mật khẩu phải chứa ít nhất 6 ký tự.' }, { status: 400 });
      }

      const tokenRecord = await prisma.verificationToken.findFirst({
        where: {
          identifier: cleanEmail,
          token: code.trim()
        }
      });

      if (!tokenRecord || tokenRecord.expires < new Date()) {
        return NextResponse.json({ error: 'Mã OTP không hợp lệ hoặc đã hết hạn.' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.$transaction([
        prisma.user.update({
          where: { email: cleanEmail },
          data: { password: hashedPassword }
        }),
        prisma.verificationToken.deleteMany({
          where: { identifier: cleanEmail }
        })
      ]);

      return NextResponse.json({ success: true, message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.' });
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ.' }, { status: 400 });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi hệ thống khi khôi phục mật khẩu.' }, { status: 500 });
  }
}
