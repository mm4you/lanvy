import { prisma } from '@/lib/prisma';
import { getSessionUserId, isSameOrigin } from '@/lib/session';
import { NextResponse } from 'next/server';

interface VoucherInput {
  title: string;
  description: string;
  code: string;
}

function boundedInteger(value: unknown, minimum: number, maximum: number) {
  if (typeof value !== 'number' || !Number.isInteger(value)) return undefined;
  return Math.min(maximum, Math.max(minimum, value));
}

function parseVoucher(value: unknown): VoucherInput | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Record<string, unknown>;
  if (typeof input.title !== 'string' || typeof input.description !== 'string' || typeof input.code !== 'string') return null;
  if (!input.title.trim() || !input.code.trim() || input.title.length > 100 || input.description.length > 500 || input.code.length > 100) return null;
  return { title: input.title.trim(), description: input.description.trim(), code: input.code.trim() };
}

export async function getProgress(request: Request) {
  try {
    const userId = getSessionUserId(request);
    if (!userId) return NextResponse.json({ error: 'Phiên đăng nhập không hợp lệ.' }, { status: 401 });

    const [progress, vouchers] = await Promise.all([
      prisma.progress.findUnique({ where: { userId } }),
      prisma.unlockedVoucher.findMany({ where: { userId }, orderBy: { unlockedAt: 'desc' } }),
    ]);

    return NextResponse.json({
      progress: progress ?? { score: 0, coins: 0, level: 1 },
      vouchers,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

export async function updateProgress(request: Request) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
    const userId = getSessionUserId(request);
    if (!userId) return NextResponse.json({ error: 'Phiên đăng nhập không hợp lệ.' }, { status: 401 });

    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!body) return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
    const score = boundedInteger(body.score, 0, 10_000_000);
    const coins = boundedInteger(body.coins, 0, 10_000_000);
    const level = boundedInteger(body.level, 1, 3);
    const newVoucher = parseVoucher(body.newVoucher);

    const updatedProgress = await prisma.progress.upsert({
      where: { userId },
      update: { score, coins, level },
      create: { userId, score: score ?? 0, coins: coins ?? 0, level: level ?? 1 },
    });

    let unlockedVoucher = null;
    if (newVoucher) {
      const existing = await prisma.unlockedVoucher.findUnique({ where: { code: newVoucher.code } });
      if (existing && existing.userId !== userId) {
        return NextResponse.json({ error: 'Mã quà tặng đã được sử dụng.' }, { status: 409 });
      }
      unlockedVoucher = existing ?? await prisma.unlockedVoucher.create({
        data: { userId, ...newVoucher, isRedeemed: false },
      });
    }

    const vouchers = await prisma.unlockedVoucher.findMany({ where: { userId }, orderBy: { unlockedAt: 'desc' } });
    return NextResponse.json({ success: true, progress: updatedProgress, newVoucher: unlockedVoucher, vouchers });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ.' }, { status: 500 });
  }
}

