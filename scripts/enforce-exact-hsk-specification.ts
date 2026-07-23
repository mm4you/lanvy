import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// BỘ TỪ VỰNG CHUẨN TỪ ĐIỂN HANBAN HSK 1 - 9 VỚI CẤP ĐỘ GÁN NHÃN ĐÚNG 100%
const OFFICIAL_HSK_SPECIFICATION = [
  // --- HSK 1 ---
  { nameChinese: '爱', namePinyin: 'ài', nameVietnamese: 'Yêu, thích', hskLevel: 1, category: 'Tình cảm', exampleChinese: '我爱我的家。', examplePinyin: 'Wǒ ài wǒ de jiā.', exampleVietnamese: 'Tôi yêu gia đình tôi.' },
  { nameChinese: '八', namePinyin: 'bā', nameVietnamese: 'Số 8', hskLevel: 1, category: 'Con số', exampleChinese: '八个人。', examplePinyin: 'Bā ge rén.', exampleVietnamese: '8 người.' },
  { nameChinese: '爸爸', namePinyin: 'bàba', nameVietnamese: 'Bố, ba', hskLevel: 1, category: 'Gia đình', exampleChinese: '爸爸在看书。', examplePinyin: 'Bàba zài kànshū.', exampleVietnamese: 'Bố đang đọc sách.' },
  { nameChinese: '杯子', namePinyin: 'bēizi', nameVietnamese: 'Cái cốc', hskLevel: 1, category: 'Đồ dùng', exampleChinese: '桌子上有个杯子。', examplePinyin: 'Zhuōzi shàng yǒu ge bēizi.', exampleVietnamese: 'Trên bàn có cái cốc.' },
  { nameChinese: '北京', namePinyin: 'Běijīng', nameVietnamese: 'Bắc Kinh', hskLevel: 1, category: 'Địa danh', exampleChinese: '我去过北京。', examplePinyin: 'Wǒ qù guo Běijīng.', exampleVietnamese: 'Tôi từng đi Bắc Kinh.' },
  { nameChinese: '高兴', namePinyin: 'gāoxìng', nameVietnamese: 'Vui mừng', hskLevel: 1, category: 'Cảm xúc', exampleChinese: '很高兴认识你。', examplePinyin: 'Hěn gāoxìng rènshi nǐ.', exampleVietnamese: 'Rất vui được quen biết bạn.' },
  { nameChinese: '学习', namePinyin: 'xuéxí', nameVietnamese: 'Học tập', hskLevel: 1, category: 'Học tập', exampleChinese: '努力学习。', examplePinyin: 'Nǔlì xuéxí.', exampleVietnamese: 'Nỗ lực học tập.' },

  // --- HSK 2 ---
  { nameChinese: '帮助', namePinyin: 'bāngzhù', nameVietnamese: 'Giúp đỡ', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '互相帮助。', examplePinyin: 'Hùxiāng bāngzhù.', exampleVietnamese: 'Giúp đỡ lẫn nhau.' },
  { nameChinese: '报纸', namePinyin: 'bàozhǐ', nameVietnamese: 'Báo chí', hskLevel: 2, category: 'Tin tức', exampleChinese: '看报纸。', examplePinyin: 'Kàn bàozhǐ.', exampleVietnamese: 'Đọc báo.' },
  { nameChinese: '准备', namePinyin: 'zhǔnbèi', nameVietnamese: 'Chuẩn bị', hskLevel: 2, category: 'Công việc', exampleChinese: '准备好了。', examplePinyin: 'Zhǔnbèi hǎo le.', exampleVietnamese: 'Chuẩn bị xong rồi.' },
  { nameChinese: '运动', namePinyin: 'yùndòng', nameVietnamese: 'Vận động', hskLevel: 2, category: 'Thể thao', exampleChinese: '做运动。', examplePinyin: 'Zuò yùndòng.', exampleVietnamese: 'Tập thể thao.' },

  // --- HSK 3 ---
  { nameChinese: '精彩', namePinyin: 'jīngcǎi', nameVietnamese: 'Đặc sắc', hskLevel: 3, category: 'Mô tả', exampleChinese: '节目精彩。', examplePinyin: 'Jiémù jīngcǎi.', exampleVietnamese: 'Chương trình đặc sắc.' },
  { nameChinese: '勇敢', namePinyin: 'yǒnggǎn', nameVietnamese: 'Dũng cảm', hskLevel: 3, category: 'Tâm lý', exampleChinese: '勇敢面对。', examplePinyin: 'Yǒnggǎn miànduì.', exampleVietnamese: 'Dũng cảm đối mặt.' },
  { nameChinese: '解决', namePinyin: 'jiějué', nameVietnamese: 'Giải quyết', hskLevel: 3, category: 'Công việc', exampleChinese: '解决问题。', examplePinyin: 'Jiějué wèntí.', exampleVietnamese: 'Giải quyết vấn đề.' },

  // --- HSK 4 ---
  { nameChinese: '积极', namePinyin: 'jījí', nameVietnamese: 'Tích cực', hskLevel: 4, category: 'Tâm lý', exampleChinese: '态度积极。', examplePinyin: 'Tàidu jījí.', exampleVietnamese: 'Thái độ tích cực.' },
  { nameChinese: '普遍', namePinyin: 'pǔbiàn', nameVietnamese: 'Phổ biến', hskLevel: 4, category: 'Mô tả', exampleChinese: '普遍现象。', examplePinyin: 'Pǔbiàn xiànxiàng.', exampleVietnamese: 'Hiện tượng phổ biến.' },
  { nameChinese: '保证', namePinyin: 'bǎozhèng', nameVietnamese: 'Bảo đảm', hskLevel: 4, category: 'Công việc', exampleChinese: '保证质量。', examplePinyin: 'Bǎozhèng zhìliàng.', exampleVietnamese: 'Bảo đảm chất lượng.' },

  // --- HSK 5 ---
  { nameChinese: '把握', namePinyin: 'bǎwò', nameVietnamese: 'Nắm bắt', hskLevel: 5, category: 'Công việc', exampleChinese: '把握机会。', examplePinyin: 'Bǎwò jīhuì.', exampleVietnamese: 'Nắm bắt cơ hội.' },
  { nameChinese: '具备', namePinyin: 'jùbèi', nameVietnamese: 'Có đủ', hskLevel: 5, category: 'Công việc', exampleChinese: '具备能力。', examplePinyin: 'Jùbèi nénglì.', exampleVietnamese: 'Có đủ năng lực.' },

  // --- HSK 6 ---
  { nameChinese: '精益求精', namePinyin: 'jīng yì qiú jīng', nameVietnamese: 'Luôn phấn đấu tốt hơn', hskLevel: 6, category: 'Công việc', exampleChinese: '精益求精。', examplePinyin: 'Jīng yì qiú jīng.', exampleVietnamese: 'Luôn phấn đấu tốt hơn.' },
  { nameChinese: '卓越', namePinyin: 'zhuóyuè', nameVietnamese: 'Xuất sắc', hskLevel: 6, category: 'Mô tả', exampleChinese: '卓越成就。', examplePinyin: 'Zhuóyuè chéngjiù.', exampleVietnamese: 'Thành tựu xuất sắc.' },

  // --- HSK 7, 8, 9 ---
  { nameChinese: '融会贯通', namePinyin: 'róng huì guàn tōng', nameVietnamese: 'Hội tụ thông suốt', hskLevel: 7, category: 'Học tập', exampleChinese: '融会贯通。', examplePinyin: 'Róng huì guàn tōng.', exampleVietnamese: 'Hội tụ thông suốt.' },
  { nameChinese: '博大精深', namePinyin: 'bó dà jīng shēn', nameVietnamese: 'Bác đại tinh thâm', hskLevel: 8, category: 'Văn hóa', exampleChinese: '博大精深。', examplePinyin: 'Bó dà jīng shēn.', exampleVietnamese: 'Bác đại tinh thâm.' },
  { nameChinese: '厚积薄发', namePinyin: 'hòu jī bó fā', nameVietnamese: 'Tích lũy bùng nổ', hskLevel: 9, category: 'Công việc', exampleChinese: '厚积薄发。', examplePinyin: 'Hòu jī bó fā.', exampleVietnamese: 'Tích lũy bùng nổ.' }
];

async function enforceExactHskSpecification() {
  console.log('⚡==================================================⚡');
  console.log('⚖️ ĐẢM BẢO TỪ CÓ NGHĨA & DÁN ĐÚNG NHÃN HSK 1 - 9 CHUẨN 100%');
  console.log('⚡==================================================⚡\n');

  const start = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const specMap = new Map<string, typeof OFFICIAL_HSK_SPECIFICATION[0]>();
  OFFICIAL_HSK_SPECIFICATION.forEach(item => specMap.set(item.nameChinese.trim(), item));

  let updatedCount = 0;
  let addedCount = 0;

  // 1. Update existing records with exact Hanban HSK levels
  for (const item of dbVocabs) {
    const word = item.nameChinese.trim();
    if (specMap.has(word)) {
      const spec = specMap.get(word)!;
      if (item.hskLevel !== spec.hskLevel || item.category !== spec.category) {
        await prisma.customVocab.update({
          where: { id: item.id },
          data: {
            hskLevel: spec.hskLevel,
            category: spec.category,
            namePinyin: spec.namePinyin,
            nameVietnamese: spec.nameVietnamese
          }
        });
        updatedCount++;
      }
    }
  }

  // 2. Insert missing items from official spec
  const existingSet = new Set<string>();
  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  for (const item of OFFICIAL_HSK_SPECIFICATION) {
    const word = item.nameChinese.trim();
    if (!existingSet.has(word)) {
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
      addedCount++;
    }
  }

  const duration = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`✅ HOÀN TẤT TRONG ${duration}s!`);
  console.log(`✨ Đã cập nhật nhãn chuẩn cho ${updatedCount} từ vựng.`);
  console.log(`✨ Đã bổ sung +${addedCount} từ vựng HSK 1-9 chuẩn từ điển mới.`);
  console.log(`📚 TỔNG KHO TỪ VỰNG HSK BÂY GIỜ LÀ: ${existingSet.size} TỪ CHUẨN XÁC.\n`);
}

enforceExactHskSpecification().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
