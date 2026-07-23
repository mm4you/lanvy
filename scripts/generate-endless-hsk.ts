import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// BỘ TỪ VỰNG TIẾNG TRUNG HSK 1-6 CHUẨN XÁC 100% (KHÔNG CHỨA MÃ, SỐ HAY KÝ TỰ LẠ)
const REAL_HSK_VOCABULARY_LIST = [
  // HSK 1-2
  { nameChinese: '高兴', namePinyin: 'gāoxìng', nameVietnamese: 'Vui mừng, phấn khởi', hskLevel: 1, category: 'Cảm xúc', exampleChinese: '认识你很高兴。', examplePinyin: 'Rènshi nǐ hěn gāoxìng.', exampleVietnamese: 'Rất vui được quen biết bạn.' },
  { nameChinese: '学习', namePinyin: 'xuéxí', nameVietnamese: 'Học tập', hskLevel: 1, category: 'Học tập', exampleChinese: '努力学习汉语。', examplePinyin: 'Nǔlì xuéxí Hànyǔ.', exampleVietnamese: 'Nỗ lực học tập tiếng Trung.' },
  { nameChinese: '准备', namePinyin: 'zhǔnbèi', nameVietnamese: 'Chuẩn bị', hskLevel: 2, category: 'Công việc', exampleChinese: '准备好了吗？', examplePinyin: 'Zhǔnbèi hǎo le ma?', exampleVietnamese: 'Đã chuẩn bị xong chưa?' },
  { nameChinese: '运动', namePinyin: 'yùndòng', nameVietnamese: 'Vận động, thể thao', hskLevel: 2, category: 'Thể thao', exampleChinese: '天天做运动。', examplePinyin: 'Tiāntiān zuò yùndòng.', exampleVietnamese: 'Ngày nào cũng tập thể thao.' },

  // HSK 3-4
  { nameChinese: '精彩', namePinyin: 'jīngcǎi', nameVietnamese: 'Đặc sắc, tuyệt vời', hskLevel: 3, category: 'Mô tả', exampleChinese: '表演非常精彩。', examplePinyin: 'Biǎoyǎn fēicháng jīngcǎi.', exampleVietnamese: 'Buổi biểu diễn vô cùng đặc sắc.' },
  { nameChinese: '勇敢', namePinyin: 'yǒnggǎn', nameVietnamese: 'Dũng cảm', hskLevel: 3, category: 'Tâm lý', exampleChinese: '勇敢地面对困难。', examplePinyin: 'Yǒnggǎn de miànduì kùnnan.', exampleVietnamese: 'Dũng cảm đối mặt với khó khăn.' },
  { nameChinese: '积极', namePinyin: 'jījí', nameVietnamese: 'Tích cực', hskLevel: 4, category: 'Tâm lý', exampleChinese: '保持积极的心态。', examplePinyin: 'Bǎochí jījí de xīntài.', exampleVietnamese: 'Giữ thái độ tích cực.' },
  { nameChinese: '普遍', namePinyin: 'pǔbiàn', nameVietnamese: 'Phổ biến', hskLevel: 4, category: 'Mô tả', exampleChinese: '这是一种普遍现象。', examplePinyin: 'Zhè shì yì zhǒng pǔbiàn xiànxiàng.', exampleVietnamese: 'Đây là một hiện tượng phổ biến.' },

  // HSK 5-6
  { nameChinese: '精益求精', namePinyin: 'jīng yì qiú jīng', nameVietnamese: 'Luôn phấn đấu hoàn hảo', hskLevel: 6, category: 'Công việc', exampleChinese: '对工作精益求精。', examplePinyin: 'Duì gōngzuò jīng yì qiú jīng.', exampleVietnamese: 'Đối với công việc luôn phấn đấu tốt hơn.' },
  { nameChinese: '卓越', namePinyin: 'zhuóyuè', nameVietnamese: 'Xuất sắc, vượt trội', hskLevel: 6, category: 'Mô tả', exampleChinese: '取得卓越成绩。', examplePinyin: 'Qǔdé zhuóyuè chéngjì.', exampleVietnamese: 'Đạt được thành tích xuất sắc.' }
];

async function seedCleanVocab() {
  console.log('⚡==================================================⚡');
  console.log('✨ CLEAN VOCAB BOT - NẠP TỪ VỰNG CHUẨN XÁC 100% (KHÔNG MÃ/SỐ)');
  console.log('⚡==================================================⚡\n');

  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  let added = 0;
  for (const item of REAL_HSK_VOCABULARY_LIST) {
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

  console.log(`✅ Đã nạp +${added} từ vựng chuẩn mới.`);
  console.log(`📚 Tổng từ vựng độc bản hiện tại: ${existingSet.size} từ.\n`);
}

seedCleanVocab().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
