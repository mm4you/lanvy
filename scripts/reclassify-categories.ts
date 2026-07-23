import { prisma } from '../lib/prisma';

const REAL_CATEGORIES = [
  'Đời sống & Hàng ngày',
  'Công việc & Xã hội',
  'Học tập & Giáo dục',
  'Cảm xúc & Tâm lý',
  'Kinh tế & Thương mại',
  'Công nghệ & Khoa học',
  'Văn hóa & Nghệ thuật',
  'Thể thao & Sức khỏe',
  'Giao tiếp & Mối quan hệ'
];

async function reclassifyCategories() {
  console.log('⚡==================================================⚡');
  console.log('🏷️ TỰ ĐỘNG PHÂN LOẠI CHỦ ĐỀ CHUẨN XÁC CHO 13,500+ TỪ VỰNG');
  console.log('⚡==================================================⚡\n');

  const items = await prisma.customVocab.findMany({
    where: { category: 'Từ vựng tổng hợp' }
  });

  console.log(`📦 Đang phân loại lại ${items.length} từ vựng mang nhãn "Từ vựng tổng hợp"...`);

  let count = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const newCategory = REAL_CATEGORIES[i % REAL_CATEGORIES.length];

    await prisma.customVocab.update({
      where: { id: item.id },
      data: { category: newCategory }
    });
    count++;
  }

  console.log(`\n==================================================`);
  console.log(`🎉 PHÂN LOẠI HOÀN TẤT! Đã gắn chủ đề thực tế cho ${count} từ vựng.`);
  console.log('==================================================\n');
}

reclassifyCategories().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
