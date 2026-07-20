import nodemailer from 'nodemailer';

export async function sendResetPasswordEmail(email: string, code: string) {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = process.env.SMTP_PORT || '465';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM || 'Studio Vocab Support <ieltsvocab939@gmail.com>';

  const isConfigured = smtpHost && smtpPort && smtpUser && smtpPass;

  if (isConfigured) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort === '465', // true for 465
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: smtpFrom,
      to: email,
      subject: '[Studio Vocab] Mã xác minh đặt lại mật khẩu của bạn',
      text: `Mã xác minh đặt lại mật khẩu Atelier HSK của bạn là: ${code} (Hiệu lực 5 phút).`,
      html: `
        <div style="font-family: 'Space Grotesk', sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 4px solid #1f2937; border-radius: 20px; background-color: #fffdf8; box-shadow: 6px 6px 0 #1f2937;">
          <div style="text-align: center; margin-bottom: 16px;">
            <div style="display: inline-block; background-color: #fbbf24; color: #1f2937; padding: 6px 14px; border: 3px solid #1f2937; border-radius: 10px; font-weight: 900; font-size: 13px; text-transform: uppercase; box-shadow: 3px 3px 0 #1f2937;">
              Studio Vocab • Atelier HSK
            </div>
          </div>
          <h2 style="font-family: serif; color: #1f2937; border-bottom: 3px dashed #1f2937; padding-bottom: 12px; margin-top: 10px; text-align: center; font-size: 24px;">Xác Minh Đặt Lại Mật Khẩu</h2>
          <p style="font-size: 14px; color: #374151; margin-bottom: 6px; font-weight: bold;">
            Bạn đã yêu cầu khôi phục mật khẩu tài khoản Atelier HSK. Vui lòng sử dụng mã OTP bên dưới:
          </p>
          <div style="background-color: #e11d48; color: #ffffff; font-family: monospace; font-size: 36px; font-weight: 900; text-align: center; padding: 16px; border: 4px solid #1f2937; border-radius: 12px; margin: 20px 0; letter-spacing: 8px; box-shadow: 4px 4px 0 #1f2937;">
            ${code}
          </div>
          <p style="font-size: 13px; color: #4b5563; margin-bottom: 4px; font-weight: 600;">
            Mã OTP này có hiệu lực trong vòng <strong>5 phút</strong>. Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email.
          </p>
          <div style="margin-top: 24px; padding-top: 12px; border-t: 2px dashed #d1d5db; text-align: center; font-size: 11px; color: #6b7280; font-family: monospace;">
            © 2026 STUDIO VOCAB SYSTEM. ALL RIGHTS RESERVED.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } else {
    console.log('[DEV MODE EMAIL CODE]:', code, 'SENT TO:', email);
  }
}
