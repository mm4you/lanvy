import { prisma } from '@/lib/prisma';
import { getSessionUserId, isSameOrigin } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function redeemVoucher(request: Request) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
    const userId = getSessionUserId(request);
    if (!userId) return NextResponse.json({ error: 'Phiên đăng nhập không hợp lệ.' }, { status: 401 });

    const body = await request.json().catch(() => null) as { code?: unknown } | null;
    const code = typeof body?.code === 'string' ? body.code.trim() : '';
    if (!code || code.length > 100) return NextResponse.json({ error: 'Mã voucher không hợp lệ.' }, { status: 400 });

    const voucher = await prisma.unlockedVoucher.findUnique({ where: { code } });
    if (!voucher) return NextResponse.json({ error: 'Mã voucher không tồn tại.' }, { status: 404 });
    if (voucher.userId !== userId) return NextResponse.json({ error: 'Voucher này không thuộc tài khoản của bạn.' }, { status: 403 });

    const updatedVoucher = await prisma.unlockedVoucher.update({ where: { code }, data: { isRedeemed: true } });
    return NextResponse.json({ success: true, voucher: updatedVoucher });
  } catch (error) {
    console.error('Error redeeming voucher:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

