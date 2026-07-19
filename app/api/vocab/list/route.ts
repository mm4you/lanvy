import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const list = await prisma.customVocab.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, list });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
