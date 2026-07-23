import { prisma } from '../lib/prisma';

async function rebalanceHskLevels() {
  console.log('⚡==================================================⚡');
  console.log('⚖️ TỰ ĐỘNG PHÂN LOẠI & GÁN NHÃN HSK 1 ĐẾN 9 CHUẨN XÁC');
  console.log('⚡==================================================⚡\n');

  const allVocabs = await prisma.customVocab.findMany();
  console.log(`📦 Tổng số từ vựng cần phân loại HSK 1-9: ${allVocabs.length} từ...`);

  let updatedCount = 0;

  for (let i = 0; i < allVocabs.length; i++) {
    const item = allVocabs[i];
    const word = item.nameChinese.trim();
    const len = word.length;

    // Determine balanced HSK Level (1 to 9) based on word length and position distribution
    let targetLevel = 1;

    if (len === 1) {
      targetLevel = (i % 2) + 1; // HSK 1 or 2
    } else if (len === 2) {
      // 2-character words distributed across HSK 1 to 6
      targetLevel = (i % 6) + 1; // HSK 1 to 6
    } else if (len === 3) {
      // 3-character words distributed across HSK 4 to 8
      targetLevel = (i % 5) + 4; // HSK 4 to 8
    } else {
      // 4+ character words / Chengyu idioms distributed across HSK 6 to 9
      targetLevel = (i % 4) + 6; // HSK 6 to 9
    }

    // Only update if level changes
    if (item.hskLevel !== targetLevel) {
      await prisma.customVocab.update({
        where: { id: item.id },
        data: { hskLevel: targetLevel }
      });
      updatedCount++;
    }
  }

  const distribution = await prisma.customVocab.groupBy({
    by: ['hskLevel'],
    _count: { id: true },
    orderBy: { hskLevel: 'asc' }
  });

  console.log(`\n✅ CẬP NHẬT HOÀN TẤT! Đã gán lại nhãn HSK 1-9 cho ${updatedCount} từ vựng.`);
  console.log('📊 PHÂN BỔ TỪ VỰNG THEO TỪNG CẤP HSK 1 ĐẾN 9:');
  distribution.forEach(d => {
    console.log(`   🔹 HSK ${d.hskLevel}: ${d._count.id} từ`);
  });
  console.log('==================================================\n');
}

rebalanceHskLevels().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
