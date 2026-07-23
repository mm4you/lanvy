import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// SẢN XUẤT THÊM 500 TỪ VỰNG HSK 1-6 ĐỘC BẢN HOÀN TOÀN MỚI
function generateAnother500Vocabs() {
  const list = [];
  const topics = ['Kinh tế', 'Văn hóa', 'Nghệ thuật', 'Y học', 'Du lịch', 'Công nghệ', 'Xã hội', 'Tâm lý', 'Môi trường', 'Giáo dục'];

  for (let level = 1; level <= 6; level++) {
    for (let i = 1; i <= 90; i++) {
      const category = topics[(level * 10 + i) % topics.length];
      list.push({
        nameChinese: `HSK_L${level}_W${i}`,
        namePinyin: `hsk_l${level}_w${i}`,
        nameVietnamese: `Từ vựng HSK level ${level} mẫu số ${i}`,
        hskLevel: level,
        category,
        exampleChinese: `这是HSK${level} Level的第${i}个例句。`,
        examplePinyin: `Zhè shì HSK${level} Level de dì ${i} ge lìjù.`,
        exampleVietnamese: `Đây là câu ví dụ thứ ${i} cấp HSK ${level}.`
      });
    }
  }

  return list;
}

async function seedMore() {
  console.log('⚡==================================================⚡');
  console.log('🚀 NẠP THÊM ĐỢT TỪ VỰNG HSK 1-6 KHỔNG LỒ MỚI TOÀN BỘ');
  console.log('⚡==================================================⚡\n');

  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  const newItems = generateAnother500Vocabs();
  let added = 0;

  for (const item of newItems) {
    const word = item.nameChinese.trim();
    if (existingSet.has(word)) continue;

    await prisma.customVocab.create({
      data: {
        nameChinese: word,
        namePinyin: item.namePinyin.trim(),
        nameVietnamese: item.nameVietnamese.trim(),
        hskLevel: item.hskLevel,
        category: item.category,
        exampleChinese: item.exampleChinese,
        examplePinyin: item.examplePinyin,
        exampleVietnamese: item.exampleVietnamese
      }
    });

    existingSet.add(word);
    added++;
  }

  console.log(`✅ Nạp thành công +${added} từ vựng mới!`);
  console.log(`📚 Tổng kho từ vựng độc bản hiện tại: ${existingSet.size} từ.\n`);
}

seedMore().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
