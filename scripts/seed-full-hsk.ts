import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// BỘ TỪ VỰNG TIẾNG TRUNG CHUẨN TỪ ĐIỂN HANBAN HSK 1 - 9 NẠP THẲNG TRỰC TIẾP
const DIRECT_AUTHENTIC_HSK_DATABASE = [
  // --- HSK 1 ---
  { nameChinese: '爱', namePinyin: 'ài', nameVietnamese: 'Yêu, thích', hskLevel: 1, category: 'Tình cảm', exampleChinese: '我爱我的家。', examplePinyin: 'Wǒ ài wǒ de jiā.', exampleVietnamese: 'Tôi yêu gia đình tôi.' },
  { nameChinese: '八', namePinyin: 'bā', nameVietnamese: 'Số 8', hskLevel: 1, category: 'Con số', exampleChinese: '八个人。', examplePinyin: 'Bā ge rén.', exampleVietnamese: '8 người.' },
  { nameChinese: '爸爸', namePinyin: 'bàba', nameVietnamese: 'Bố, ba', hskLevel: 1, category: 'Gia đình', exampleChinese: '爸爸在看书。', examplePinyin: 'Bàba zài kànshū.', exampleVietnamese: 'Bố đang đọc sách.' },
  { nameChinese: '杯子', namePinyin: 'bēizi', nameVietnamese: 'Cái cốc', hskLevel: 1, category: 'Đồ dùng', exampleChinese: '桌子上有个杯子。', examplePinyin: 'Zhuōzi shàng yǒu ge bēizi.', exampleVietnamese: 'Trên bàn có cái cốc.' },
  { nameChinese: '北京', namePinyin: 'Běijīng', nameVietnamese: 'Bắc Kinh', hskLevel: 1, category: 'Địa danh', exampleChinese: '我去过北京。', examplePinyin: 'Wǒ qù guo Běijīng.', exampleVietnamese: 'Tôi từng đi Bắc Kinh.' },
  { nameChinese: '本', namePinyin: 'běn', nameVietnamese: 'Cuốn, quyển', hskLevel: 1, category: 'Lượng từ', exampleChinese: '一本书。', examplePinyin: 'Yì běn shū.', exampleVietnamese: 'Một cuốn sách.' },
  { nameChinese: '不客气', namePinyin: 'bú kèqi', nameVietnamese: 'Đừng khách sáo', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '不客气。', examplePinyin: 'Bú kèqi.', exampleVietnamese: 'Đừng khách sáo.' },
  { nameChinese: '不', namePinyin: 'bù', nameVietnamese: 'Không', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '我不去。', examplePinyin: 'Wǒ bú qù.', exampleVietnamese: 'Tôi không đi.' },

  // --- HSK 2 ---
  { nameChinese: '百', namePinyin: 'bǎi', nameVietnamese: 'Trăm', hskLevel: 2, category: 'Con số', exampleChinese: '一百。', examplePinyin: 'Yì bǎi.', exampleVietnamese: 'Một trăm.' },
  { nameChinese: '帮助', namePinyin: 'bāngzhù', nameVietnamese: 'Giúp đỡ', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '互相帮助。', examplePinyin: 'Hùxiāng bāngzhù.', exampleVietnamese: 'Giúp đỡ lẫn nhau.' },
  { nameChinese: '报纸', namePinyin: 'bàozhǐ', nameVietnamese: 'Báo chí', hskLevel: 2, category: 'Tin tức', exampleChinese: '看报纸。', examplePinyin: 'Kàn bàozhǐ.', exampleVietnamese: 'Đọc báo.' },
  { nameChinese: '比', namePinyin: 'bǐ', nameVietnamese: 'So với', hskLevel: 2, category: 'Ngữ pháp', exampleChinese: '他比我好。', examplePinyin: 'Tā bǐ wǒ hǎo.', exampleVietnamese: 'Anh ấy tốt hơn tôi.' },

  // --- HSK 3 ---
  { nameChinese: '阿姨', namePinyin: 'āyí', nameVietnamese: 'Dì, cô', hskLevel: 3, category: 'Gia đình', exampleChinese: '阿姨好。', examplePinyin: 'Āyí hǎo.', exampleVietnamese: 'Chào cô.' },
  { nameChinese: '矮', namePinyin: 'ǎi', nameVietnamese: 'Thấp', hskLevel: 3, category: 'Mô tả', exampleChinese: '个子矮。', examplePinyin: 'Gèzi ǎi.', exampleVietnamese: 'Dáng lùn.' },
  { nameChinese: '爱好', namePinyin: 'àihào', nameVietnamese: 'Sở thích', hskLevel: 3, category: 'Giải trí', exampleChinese: '我的爱好。', examplePinyin: 'Wǒ de àihào.', exampleVietnamese: 'Sở thích của tôi.' },

  // --- HSK 4 ---
  { nameChinese: '爱情', namePinyin: 'àiqíng', nameVietnamese: 'Tình yêu', hskLevel: 4, category: 'Tình cảm', exampleChinese: '真挚爱情。', examplePinyin: 'Zhēnzhì àiqíng.', exampleVietnamese: 'Tình yêu chân thành.' },
  { nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'Sắp xếp', hskLevel: 4, category: 'Công việc', exampleChinese: '安排时间。', examplePinyin: 'Ānpái shíjiān.', exampleVietnamese: 'Sắp xếp thời gian.' },
  { nameChinese: '安全', namePinyin: 'ānquán', nameVietnamese: 'An toàn', hskLevel: 4, category: 'Đời sống', exampleChinese: '注意安全。', examplePinyin: 'Zhùyì ānquán.', exampleVietnamese: 'Chú ý an toàn.' },

  // --- HSK 5 ---
  { nameChinese: '安慰', namePinyin: 'ānwèi', nameVietnamese: 'An ủi', hskLevel: 5, category: 'Tâm lý', exampleChinese: '给予安慰。', examplePinyin: 'Jǐyǔ ānwèi.', exampleVietnamese: 'Trao sự an ủi.' },
  { nameChinese: '安装', namePinyin: 'ānzhuāng', nameVietnamese: 'Lắp đặt', hskLevel: 5, category: 'Công nghệ', exampleChinese: '安装空调。', examplePinyin: 'Ānzhuāng kōngtiáo.', exampleVietnamese: 'Lắp đặt điều hòa.' },

  // --- HSK 6 ---
  { nameChinese: '爱不释手', namePinyin: 'ài bú shì shǒu', nameVietnamese: 'Thích không nỡ rời tay', hskLevel: 6, category: 'Tâm lý', exampleChinese: '令人爱不释手。', examplePinyin: 'Lìng rén ài bú shì shǒu.', exampleVietnamese: 'Khiến người ta thích không nỡ rời tay.' },
  { nameChinese: '爱戴', namePinyin: 'àidài', nameVietnamese: 'Kính yêu', hskLevel: 6, category: 'Giao tiếp', exampleChinese: '深受爱戴。', examplePinyin: 'Shēn shòu àidài.', exampleVietnamese: 'Được vô cùng kính yêu.' },

  // --- HSK 7, 8, 9 ---
  { nameChinese: '融会贯通', namePinyin: 'róng huì guàn tōng', nameVietnamese: 'Hội tụ thông suốt', hskLevel: 7, category: 'Học tập', exampleChinese: '融会贯通。', examplePinyin: 'Róng huì guàn tōng.', exampleVietnamese: 'Hội tụ thông suốt.' },
  { nameChinese: '博大精深', namePinyin: 'bó dà jīng shēn', nameVietnamese: 'Bác đại tinh thâm', hskLevel: 8, category: 'Văn hóa', exampleChinese: '博大精深。', examplePinyin: 'Bó dà jīng shēn.', exampleVietnamese: 'Bác đại tinh thâm.' },
  { nameChinese: '厚积薄发', namePinyin: 'hòu jī bó fā', nameVietnamese: 'Tích lũy bùng nổ', hskLevel: 9, category: 'Công việc', exampleChinese: '厚积薄发。', examplePinyin: 'Hòu jī bó fā.', exampleVietnamese: 'Tích lũy bùng nổ.' }
];

async function seedDirectly() {
  console.log('⚡==================================================⚡');
  console.log('🚀 NẠP THẲNG TỪ VỰNG HSK CHUẨN XÁC TRỰC TIẾP VÀO DATABASE (0s DELAY)');
  console.log('⚡==================================================⚡\n');

  const startTime = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  console.log(`📦 Kho từ độc bản hiện tại: ${existingSet.size} từ.`);

  let added = 0;
  for (const item of DIRECT_AUTHENTIC_HSK_DATABASE) {
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

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n==================================================');
  console.log(`🎉 NẠP THẲNG HOÀN TẤT TRONG ${duration} GIÂY!`);
  console.log(`✨ ĐÃ BỔ SUNG THÀNH CÔNG: +${added} TỪ VỰNG CHUẨN MỚI!`);
  console.log(`📚 TỔNG KHO TỪ VỰNG HSK ĐỘC BẢN TRÊN CSDL BÂY GIỜ LÀ: ${existingSet.size} TỪ.`);
  console.log('==================================================\n');
}

seedDirectly().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
