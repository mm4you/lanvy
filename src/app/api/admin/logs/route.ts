import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
    }

    // Check if the user is the admin
    const adminUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!adminUser || adminUser.email.toLowerCase() !== 'ungnhutkhang53@gmail.com') {
      return NextResponse.json({ error: 'Quyền truy cập bị từ chối.' }, { status: 403 });
    }

    // Fetch all users with progress and vouchers
    const users = await prisma.user.findMany({
      include: {
        progress: true,
        vouchers: {
          orderBy: {
            unlockedAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Admin logs fetch error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống.' }, { status: 500 });
  }
}
