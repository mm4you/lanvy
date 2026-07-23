import { prisma } from '../lib/prisma';

async function purgeSyntheticCombos() {
  console.log('⚡==================================================⚡');
  console.log('🧹 XÓA TỰ ĐỘNG CÁC TỪ GHÉP GHÉP KÝ TỰ KHÔNG CHUẨN NGHĨA');
  console.log('⚡==================================================⚡\n');

  const allVocabs = await prisma.customVocab.findMany();
  console.log(`📦 Kiểm tra ${allVocabs.length} từ vựng...`);

  // Identify synthetic concatenated 3-character combos from seed-5000
  const syntheticIds = allVocabs
    .filter(item => {
      const ex = item.exampleChinese || '';
      return ex.includes('这也是一个关于') || ex.includes('Ví dụ minh họa cho từ');
    })
    .map(item => item.id);

  if (syntheticIds.length > 0) {
    await prisma.customVocab.deleteMany({
      where: { id: { in: syntheticIds } }
    });
    console.log(`✅ Đã xóa sạch ${syntheticIds.length} từ ghép ký tự ngẫu nhiên.`);
  }

  const remainingCount = await prisma.customVocab.count();
  console.log(`📚 TỔNG KHO TỪ VỰNG TIẾNG TRUNG CHUẨN THỰC TẾ CÒN LẠI: ${remainingCount} TỪ.\n`);
}

purgeSyntheticCombos().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
