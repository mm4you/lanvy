import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-api';

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Quyền truy cập bị từ chối.' }, { status: 403 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID từ vựng.' }, { status: 400 });
    }

    await prisma.customVocab.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
