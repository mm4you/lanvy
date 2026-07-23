import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-api';

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Quyền truy cập bị từ chối.' }, { status: 403 });
    }

    const { vocabList } = await request.json();
    if (!vocabList || !Array.isArray(vocabList)) {
      return NextResponse.json({ error: 'Danh sách từ vựng không hợp lệ.' }, { status: 400 });
    }

    // Save all to database (skip duplicates)
    const savedItems = [];
    for (const item of vocabList) {
      if (!item.nameChinese || !item.namePinyin || !item.nameVietnamese) continue;
      const trimmedName = item.nameChinese.trim();

      const existing = await prisma.customVocab.findFirst({
        where: { nameChinese: trimmedName }
      });
      if (existing) continue;
      
      const saved = await prisma.customVocab.create({
        data: {
          nameChinese: trimmedName,
          namePinyin: item.namePinyin.trim(),
          nameVietnamese: item.nameVietnamese.trim(),
          hskLevel: Number(item.hskLevel) || 1,
          category: item.category?.trim() || 'Khác',
          exampleChinese: item.exampleChinese?.trim() || null,
          examplePinyin: item.examplePinyin?.trim() || null,
          exampleVietnamese: item.exampleVietnamese?.trim() || null,
        }
      });
      savedItems.push(saved);
    }

    return NextResponse.json({ success: true, count: savedItems.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
