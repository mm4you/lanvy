import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-api';

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Quyen truy cap bi tu choi.' }, { status: 403 });
    }

    const { userId, title, description, code } = await request.json();

    if (!userId || !title || !description || !code) {
      return NextResponse.json({ error: 'Thieu tham so bat buoc.' }, { status: 400 });
    }

    // Check if the voucher code already exists to prevent duplicate key constraint
    const existing = await prisma.unlockedVoucher.findUnique({
      where: { code: code.trim() }
    });

    if (existing) {
      return NextResponse.json({ error: 'Ma voucher nay da ton tai trong he thong.' }, { status: 409 });
    }

    const newVoucher = await prisma.unlockedVoucher.create({
      data: {
        userId,
        title: title.trim(),
        description: description.trim(),
        code: code.trim(),
        isRedeemed: false
      }
    });

    return NextResponse.json({ success: true, voucher: newVoucher });
  } catch (error: any) {
    console.error('Admin issue voucher error:', error);
    return NextResponse.json({ error: error.message || 'Loi he thong.' }, { status: 500 });
  }
}
