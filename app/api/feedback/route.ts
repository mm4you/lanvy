import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
    }

    const { type, content, contactEmail } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Vui lòng nhập nội dung góp ý.' }, { status: 400 });
    }

    // Lấy thông tin user hiện tại nếu có phiên đăng nhập
    const userId = getSessionUserId(req);
    let userDisplay = 'Khách vãng lai';
    let userEmail = contactEmail || 'Chưa cung cấp';

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, email: true }
      });
      if (user) {
        userDisplay = `${user.username} (ID: ${userId})`;
        userEmail = contactEmail || user.email || 'Chưa cung cấp';
      }
    }

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = process.env.SMTP_PORT || '465';
    const smtpUser = process.env.SMTP_USER || 'ieltsvocab939@gmail.com';
    const smtpPass = process.env.SMTP_PASSWORD || 'gpfrycmjtiezljgp';
    const smtpFrom = process.env.SMTP_FROM || 'Studio Vocab Support <ieltsvocab939@gmail.com>';
    const receiverEmail = process.env.FEEDBACK_RECEIVER_EMAIL || smtpUser;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort === '465',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: smtpFrom,
      to: receiverEmail,
      subject: `[Atelier HSK Góp Ý] ${type || 'Phản hồi từ người dùng'} - ${userDisplay}`,
      html: `
        <div style="font-family: 'Space Grotesk', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 4px solid #1f2937; border-radius: 20px; background-color: #fffdf8; box-shadow: 6px 6px 0 #1f2937;">
          <div style="display: inline-block; background-color: #fbbf24; color: #1f2937; padding: 6px 14px; border: 3px solid #1f2937; border-radius: 10px; font-weight: 900; font-size: 13px; text-transform: uppercase; margin-bottom: 16px;">
            Atelier HSK • Thư Góp Ý Từ Người Dùng
          </div>
          <h2 style="font-family: serif; color: #1f2937; border-bottom: 3px dashed #1f2937; padding-bottom: 10px; margin-top: 0;">Loại phản hồi: ${type || 'Góp ý chung'}</h2>
          
          <div style="margin: 16px 0; padding: 14px; background-color: #fef08a; border: 3px solid #1f2937; border-radius: 12px;">
            <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #1f2937;">Người gửi: ${userDisplay}</p>
            <p style="margin: 0; font-size: 13px; font-weight: bold; color: #1f2937;">Email liên hệ: ${userEmail}</p>
          </div>

          <div style="background-color: #ffffff; padding: 16px; border: 3px solid #1f2937; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #111827; white-space: pre-wrap;">
${content.trim()}
          </div>

          <div style="margin-top: 20px; text-align: center; font-size: 11px; color: #6b7280; font-family: monospace;">
            © 2026 STUDIO VOCAB FEEDBACK SYSTEM
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Cảm ơn bạn! Thư góp ý đã được gửi thành công.' });
  } catch (error: any) {
    console.error('Feedback API Error:', error);
    return NextResponse.json({ error: 'Không thể gửi email góp ý. Vui lòng thử lại sau.' }, { status: 500 });
  }
}
