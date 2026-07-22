import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        username: true,
        email: true,
        progress: {
          select: {
            score: true,
            level: true,
          },
        },
      },
    });

    const formatted = topUsers
      .map((u) => ({
        id: u.id,
        name: u.username || 'Học Viên HSK',
        score: u.progress?.score || 0,
        streak: Math.max(1, Math.floor((u.progress?.score || 0) / 100)),
        title: (u.progress?.score || 0) >= 3000 ? 'Chủ Tiệm Xuất Sắc' : (u.progress?.score || 0) >= 1500 ? 'Kiến Trúc Sư HSK' : 'Học Viên Chăm Chỉ',
      }))
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({ leaderboard: formatted });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ leaderboard: [] });
  }
}
