import { prisma } from '@/lib/prisma';
import { getSessionUserId } from '@/lib/session';
import { NextResponse } from 'next/server';

export const ADMIN_EMAILS = ['ungnhutkhang53@gmail.com', 'nguyenthilanvy12a2@gmail.com'];

export async function requireAdmin(request: Request) {
  const userId = getSessionUserId(request);
  if (!userId) return null;
  return prisma.user.findFirst({
    where: { id: userId, email: { in: ADMIN_EMAILS } },
    select: { id: true, username: true, email: true },
  });
}

export async function getAdminLogs(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return NextResponse.json({ error: 'Quyền truy cập bị từ chối.' }, { status: 403 });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        progress: true,
        vouchers: { orderBy: { unlockedAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Admin logs fetch error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống.' }, { status: 500 });
  }
}

