// Script to clean up nameChinese, namePinyin, and nameVietnamese fields in CustomVocab entries
// Run with `npx tsx scripts/clean_nameVietnamese.ts`
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  'Mua sắm & Shopping', 'Ẩm thực & Đi ăn tiệm', 'Màu sắc & Thiết kế',
  'Thời tiết & Thời gian', 'Gia đình & Nhà cửa', 'Phương hướng & Vị trí',
  'Sở thích & Hẹn hò', 'Động vật & Thú cưng', 'Học tập & Trường học',
  'Công việc & Văn phòng', 'Giao thông & Du lịch', 'Kiến trúc & Nội thất',
  'Cảm xúc & Mô tả', 'Giải trí & Thể thao'
];

function cleanString(str: string, category?: string): string {
  if (!str) return str;
  let cleaned = str;
  const cats = category ? [...CATEGORIES, category] : CATEGORIES;
  for (const cat of cats) {
    if (!cat) continue;
    const escaped = cat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\s*[-:：]?\\s*${escaped}\\s*`, 'gi');
    cleaned = cleaned.replace(pattern, '').trim();
  }
  return cleaned.trim();
}

function cleanChinese(str: string, category?: string): string {
  if (!str) return str;
  let cleaned = cleanString(str, category);
  // If Chinese string contains Latin characters or Vietnamese text (like 准备Sở thích & Hẹn hò), keep only Chinese characters
  const chineseMatch = cleaned.match(/^[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]+/);
  if (chineseMatch) {
    cleaned = chineseMatch[0].trim();
  }
  return cleaned;
}

async function cleanAllVocabs() {
  const allVocab = await prisma.customVocab.findMany();
  let count = 0;
  for (const vocab of allVocab) {
    const cChinese = cleanChinese(vocab.nameChinese, vocab.category);
    const cPinyin = cleanString(vocab.namePinyin, vocab.category);
    const cVietnamese = cleanString(vocab.nameVietnamese, vocab.category);

    if (
      cChinese !== vocab.nameChinese ||
      cPinyin !== vocab.namePinyin ||
      cVietnamese !== vocab.nameVietnamese
    ) {
      await prisma.customVocab.update({
        where: { id: vocab.id },
        data: {
          nameChinese: cChinese,
          namePinyin: cPinyin,
          nameVietnamese: cVietnamese,
        },
      });
      count++;
    }
  }
  console.log(`Cleaned ${count} database vocab entries.`);
}

cleanAllVocabs()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
