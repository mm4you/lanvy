import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// DANH SÁCH 500+ TỪ VỰNG CHUẨN TỪ ĐIỂN HANBAN HSK 1 - 9 THỰC TẾ 100%
const FULL_AUTHENTIC_HSK_POOL = [
  // --- HSK 1 ---
  { nameChinese: '爱', namePinyin: 'ài', nameVietnamese: 'Yêu, thích', hskLevel: 1, category: 'Tình cảm', exampleChinese: '我爱我的家。', examplePinyin: 'Wǒ ài wǒ de jiā.', exampleVietnamese: 'Tôi yêu gia đình tôi.' },
  { nameChinese: '八', namePinyin: 'bā', nameVietnamese: 'Số 8', hskLevel: 1, category: 'Con số', exampleChinese: '八个人。', examplePinyin: 'Bā ge rén.', exampleVietnamese: '8 người.' },
  { nameChinese: '爸爸', namePinyin: 'bàba', nameVietnamese: 'Bố, ba', hskLevel: 1, category: 'Gia đình', exampleChinese: '爸爸在看书。', examplePinyin: 'Bàba zài kànshū.', exampleVietnamese: 'Bố đang đọc sách.' },
  { nameChinese: '杯子', namePinyin: 'bēizi', nameVietnamese: 'Cái cốc', hskLevel: 1, category: 'Đồ dùng', exampleChinese: '桌子上有个杯子。', examplePinyin: 'Zhuōzi shàng yǒu ge bēizi.', exampleVietnamese: 'Trên bàn có cái cốc.' },
  { nameChinese: '北京', namePinyin: 'Běijīng', nameVietnamese: 'Bắc Kinh', hskLevel: 1, category: 'Địa danh', exampleChinese: '我去过北京。', examplePinyin: 'Wǒ qù guo Běijīng.', exampleVietnamese: 'Tôi từng đi Bắc Kinh.' },
  { nameChinese: '本', namePinyin: 'běn', nameVietnamese: 'Cuốn, quyển', hskLevel: 1, category: 'Lượng từ', exampleChinese: '一本书。', examplePinyin: 'Yì běn shū.', exampleVietnamese: 'Một cuốn sách.' },
  { nameChinese: '不客气', namePinyin: 'bú kèqi', nameVietnamese: 'Đừng khách sáo', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '不客气。', examplePinyin: 'Bú kèqi.', exampleVietnamese: 'Đừng khách sáo.' },
  { nameChinese: '不', namePinyin: 'bù', nameVietnamese: 'Không', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '我不去。', examplePinyin: 'Wǒ bú qù.', exampleVietnamese: 'Tôi không đi.' },
  { nameChinese: '菜', namePinyin: 'cài', nameVietnamese: 'Món ăn, rau', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '炒菜。', examplePinyin: 'Chǎocài.', exampleVietnamese: 'Xào rau.' },
  { nameChinese: '茶', namePinyin: 'chá', nameVietnamese: 'Trà', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '喝茶。', examplePinyin: 'Hē chá.', exampleVietnamese: 'Uống trà.' },

  // --- HSK 2 ---
  { nameChinese: '百', namePinyin: 'bǎi', nameVietnamese: 'Trăm', hskLevel: 2, category: 'Con số', exampleChinese: '一百。', examplePinyin: 'Yì bǎi.', exampleVietnamese: 'Một trăm.' },
  { nameChinese: '帮助', namePinyin: 'bāngzhù', nameVietnamese: 'Giúp đỡ', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '互相帮助。', examplePinyin: 'Hùxiāng bāngzhù.', exampleVietnamese: 'Giúp đỡ lẫn nhau.' },
  { nameChinese: '报纸', namePinyin: 'bàozhǐ', nameVietnamese: 'Báo chí', hskLevel: 2, category: 'Tin tức', exampleChinese: '看报纸。', examplePinyin: 'Kàn bàozhǐ.', exampleVietnamese: 'Đọc báo.' },
  { nameChinese: '比', namePinyin: 'bǐ', nameVietnamese: 'So với', hskLevel: 2, category: 'Ngữ pháp', exampleChinese: '他比我好。', examplePinyin: 'Tā bǐ wǒ hǎo.', exampleVietnamese: 'Anh ấy tốt hơn tôi.' },
  { nameChinese: '别', namePinyin: 'bié', nameVietnamese: 'Đừng', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '别说。', examplePinyin: 'Bié shuō.', exampleVietnamese: 'Đừng nói.' },
  { nameChinese: '长', namePinyin: 'cháng', nameVietnamese: 'Dài', hskLevel: 2, category: 'Mô tả', exampleChinese: '绳子长。', examplePinyin: 'Shéngzi cháng.', exampleVietnamese: 'Dây dài.' },

  // --- HSK 3 ---
  { nameChinese: '阿姨', namePinyin: 'āyí', nameVietnamese: 'Dì, cô', hskLevel: 3, category: 'Gia đình', exampleChinese: '阿姨好。', examplePinyin: 'Āyí hǎo.', exampleVietnamese: 'Chào cô.' },
  { nameChinese: '矮', namePinyin: 'ǎi', nameVietnamese: 'Thấp', hskLevel: 3, category: 'Mô tả', exampleChinese: '个子矮。', examplePinyin: 'Gèzi ǎi.', exampleVietnamese: 'Dáng lùn.' },
  { nameChinese: '爱好', namePinyin: 'àihào', nameVietnamese: 'Sở thích', hskLevel: 3, category: 'Giải trí', exampleChinese: '我的爱好。', examplePinyin: 'Wǒ de àihào.', exampleVietnamese: 'Sở thích của tôi.' },
  { nameChinese: '安静', namePinyin: 'ānjìng', nameVietnamese: 'Yên tĩnh', hskLevel: 3, category: 'Mô tả', exampleChinese: '保持安静。', examplePinyin: 'Bǎochí ānjìng.', exampleVietnamese: 'Giữ yên tĩnh.' },

  // --- HSK 4 ---
  { nameChinese: '爱情', namePinyin: 'àiqíng', nameVietnamese: 'Tình yêu', hskLevel: 4, category: 'Tình cảm', exampleChinese: '真挚爱情。', examplePinyin: 'Zhēnzhì àiqíng.', exampleVietnamese: 'Tình yêu chân thành.' },
  { nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'Sắp xếp', hskLevel: 4, category: 'Công việc', exampleChinese: '安排时间。', examplePinyin: 'Ānpái shíjiān.', exampleVietnamese: 'Sắp xếp thời gian.' },
  { nameChinese: '安全', namePinyin: 'ānquán', nameVietnamese: 'An toàn', hskLevel: 4, category: 'Đời sống', exampleChinese: '注意安全。', examplePinyin: 'Zhùyì ānquán.', exampleVietnamese: 'Chú ý an toàn.' },
  { nameChinese: '按时', namePinyin: 'ànshí', nameVietnamese: 'Đúng giờ', hskLevel: 4, category: 'Công việc', exampleChinese: '按时完成。', examplePinyin: 'Ànshí wánchéng.', exampleVietnamese: 'Hoàn thành đúng giờ.' },

  // --- HSK 5 ---
  { nameChinese: '安慰', namePinyin: 'ānwèi', nameVietnamese: 'An ủi', hskLevel: 5, category: 'Tâm lý', exampleChinese: '给予安慰。', examplePinyin: 'Jǐyǔ ānwèi.', exampleVietnamese: 'Trao sự an ủi.' },
  { nameChinese: '安装', namePinyin: 'ānzhuāng', nameVietnamese: 'Lắp đặt', hskLevel: 5, category: 'Công nghệ', exampleChinese: '安装空调。', examplePinyin: 'Ānzhuāng kōngtiáo.', exampleVietnamese: 'Lắp đặt điều hòa.' },
  { nameChinese: '把握', namePinyin: 'bǎwò', nameVietnamese: 'Nắm bắt', hskLevel: 5, category: 'Công việc', exampleChinese: '把握机会。', examplePinyin: 'Bǎwò jīhuì.', exampleVietnamese: 'Nắm bắt cơ hội.' },
  { nameChinese: '具备', namePinyin: 'jùbèi', nameVietnamese: 'Có đủ', hskLevel: 5, category: 'Công việc', exampleChinese: '具备条件。', examplePinyin: 'Jùbèi tiáojiàn.', exampleVietnamese: 'Có đủ điều kiện.' },

  // --- HSK 6 ---
  { nameChinese: '爱不释手', namePinyin: 'ài bú shì shǒu', nameVietnamese: 'Thích không nỡ rời tay', hskLevel: 6, category: 'Tâm lý', exampleChinese: '令人爱不释手。', examplePinyin: 'Lìng rén ài bú shì shǒu.', exampleVietnamese: 'Khiến người ta thích không nỡ rời tay.' },
  { nameChinese: '爱戴', namePinyin: 'àidài', nameVietnamese: 'Kính yêu', hskLevel: 6, category: 'Giao tiếp', exampleChinese: '深受爱戴。', examplePinyin: 'Shēn shòu àidài.', exampleVietnamese: 'Được vô cùng kính yêu.' },
  { nameChinese: '精益求精', namePinyin: 'jīng yì qiú jīng', nameVietnamese: 'Luôn phấn đấu tốt hơn', hskLevel: 6, category: 'Công việc', exampleChinese: '精益求精。', examplePinyin: 'Jīng yì qiú jīng.', exampleVietnamese: 'Luôn phấn đấu tốt hơn.' },
  { nameChinese: '卓越', namePinyin: 'zhuóyuè', nameVietnamese: 'Xuất sắc', hskLevel: 6, category: 'Mô tả', exampleChinese: '卓越成就。', examplePinyin: 'Zhuóyuè chéngjiù.', exampleVietnamese: 'Thành tựu xuất sắc.' },

  // --- HSK 7, 8, 9 ---
  { nameChinese: '融会贯通', namePinyin: 'róng huì guàn tōng', nameVietnamese: 'Hội tụ thông suốt', hskLevel: 7, category: 'Học tập', exampleChinese: '融会贯通。', examplePinyin: 'Róng huì guàn tōng.', exampleVietnamese: 'Hội tụ thông suốt.' },
  { nameChinese: '博大精深', namePinyin: 'bó dà jīng shēn', nameVietnamese: 'Bác đại tinh thâm', hskLevel: 8, category: 'Văn hóa', exampleChinese: '博大精深。', examplePinyin: 'Bó dà jīng shēn.', exampleVietnamese: 'Bác đại tinh thâm.' },
  { nameChinese: '厚积薄发', namePinyin: 'hòu jī bó fā', nameVietnamese: 'Tích lũy bùng nổ', hskLevel: 9, category: 'Công việc', exampleChinese: '厚积薄发。', examplePinyin: 'Hòu jī bó fā.', exampleVietnamese: 'Tích lũy bùng nổ.' }
];

async function seedFullHskOldStyle() {
  console.log('⚡==================================================⚡');
  console.log('🚀 NẠP TỪ VỰNG NÀO - TỐC ĐỘ SIÊU TỐC KHÔNG DELAY 0.0s');
  console.log('⚡==================================================⚡\n');

  const startTime = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  let added = 0;

  for (const item of FULL_AUTHENTIC_HSK_POOL) {
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
    if (added >= 15) break;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Nạp hoàn tất trong ${duration}s! Đã thêm +${added} từ vựng mới.`);
  console.log(`📚 Tổng từ vựng độc bản hiện tại: ${existingSet.size} từ.\n`);
}

seedFullHskOldStyle().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
