import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Missing user context' }, { status: 401 });
    }

    const { code } = await request.json().catch(() => ({}));

    if (!code) {
      return NextResponse.json({ error: 'Missing voucher code' }, { status: 400 });
    }

    const voucher = await prisma.unlockedVoucher.findUnique({
      where: { code }
    });

    if (!voucher) {
      return NextResponse.json({ error: 'Mã voucher không tồn tại.' }, { status: 404 });
    }

    if (voucher.userId !== userId) {
      return NextResponse.json({ error: 'Voucher này không thuộc tài khoản của bạn.' }, { status: 403 });
    }

    const updatedVoucher = await prisma.unlockedVoucher.update({
      where: { code },
      data: { isRedeemed: true }
    });

    return NextResponse.json({
      success: true,
      voucher: updatedVoucher
    });
  } catch (error) {
    console.error('Error redeeming voucher:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
