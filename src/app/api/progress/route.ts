import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Missing user context' }, { status: 401 });
    }

    const progress = await prisma.progress.findUnique({
      where: { userId }
    });

    const vouchers = await prisma.unlockedVoucher.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' }
    });

    return NextResponse.json({
      progress: progress || { score: 0, coins: 0, level: 1 },
      vouchers: vouchers || []
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Missing user context' }, { status: 401 });
    }

    const { score, coins, level, newVoucher } = await request.json().catch(() => ({}));

    // Update progress
    const updatedProgress = await prisma.progress.upsert({
      where: { userId },
      update: {
        score: score ?? undefined,
        coins: coins ?? undefined,
        level: level ?? undefined
      },
      create: {
        userId,
        score: score ?? 0,
        coins: coins ?? 0,
        level: level ?? 1
      }
    });

    let unlockedVoucher = null;
    // If a new boba/date voucher was unlocked, save it
    if (newVoucher && newVoucher.code) {
      try {
        unlockedVoucher = await prisma.unlockedVoucher.upsert({
          where: { code: newVoucher.code },
          update: {},
          create: {
            userId,
            title: newVoucher.title,
            description: newVoucher.description,
            code: newVoucher.code,
            isRedeemed: false
          }
        });
      } catch (e) {
        console.warn('Voucher already unlocked or error saving:', e);
        // Fetch existing if duplicate
        unlockedVoucher = await prisma.unlockedVoucher.findUnique({
          where: { code: newVoucher.code }
        });
      }
    }

    const allVouchers = await prisma.unlockedVoucher.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
      newVoucher: unlockedVoucher,
      vouchers: allVouchers
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
