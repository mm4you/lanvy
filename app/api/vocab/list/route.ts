import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '30', 10);
    const search = searchParams.get('search') || '';
    const level = searchParams.get('level') || '';
    const category = searchParams.get('category') || '';

    const where: any = {};
    if (search.trim()) {
      where.OR = [
        { wordChinese: { contains: search.trim(), mode: 'insensitive' } },
        { wordPinyin: { contains: search.trim(), mode: 'insensitive' } },
        { wordVietnamese: { contains: search.trim(), mode: 'insensitive' } }
      ];
    }
    if (level) {
      const parsedLevel = parseInt(level, 10);
      if (!isNaN(parsedLevel)) {
        where.hskLevel = parsedLevel;
      }
    }
    if (category) {
      where.category = category;
    }

    const [totalCount, list] = await Promise.all([
      prisma.customVocab.count({ where }),
      prisma.customVocab.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json({
      success: true,
      list,
      totalCount,
      totalPages,
      currentPage: page
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
