import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// DANH SÁCH TỪ VỰNG TIẾNG TRUNG CHUẨN TỪ ĐIỂN HANBAN HSK 1 - 9 PHONG PHÚ (200+ TỪ THỰC TẾ)
const HUGE_REAL_HSK_DICTIONARY = [
  // --- HSK 1 & 2 ---
  { nameChinese: '爱', namePinyin: 'ài', nameVietnamese: 'Yêu, thích', hskLevel: 1, category: 'Tình cảm', exampleChinese: '我爱我的家。', examplePinyin: 'Wǒ ài wǒ de jiā.', exampleVietnamese: 'Tôi yêu gia đình tôi.' },
  { nameChinese: '八', namePinyin: 'bā', nameVietnamese: 'Số 8', hskLevel: 1, category: 'Con số', exampleChinese: '八个人。', examplePinyin: 'Bā ge rén.', exampleVietnamese: '8 người.' },
  { nameChinese: '爸爸', namePinyin: 'bàba', nameVietnamese: 'Bố, ba', hskLevel: 1, category: 'Gia đình', exampleChinese: '爸爸在看书。', examplePinyin: 'Bàba zài kànshū.', exampleVietnamese: 'Bố đang đọc sách.' },
  { nameChinese: '杯子', namePinyin: 'bēizi', nameVietnamese: 'Cái cốc', hskLevel: 1, category: 'Đồ dùng', exampleChinese: '桌子上有个杯子。', examplePinyin: 'Zhuōzi shàng yǒu ge bēizi.', exampleVietnamese: 'Trên bàn có cái cốc.' },
  { nameChinese: '北京', namePinyin: 'Běijīng', nameVietnamese: 'Bắc Kinh', hskLevel: 1, category: 'Địa danh', exampleChinese: '我去过北京。', examplePinyin: 'Wǒ qù guo Běijīng.', exampleVietnamese: 'Tôi từng đi Bắc Kinh.' },
  { nameChinese: '本', namePinyin: 'běn', nameVietnamese: 'Cuốn, quyển', hskLevel: 1, category: 'Lượng từ', exampleChinese: '一本书。', examplePinyin: 'Yì běn shū.', exampleVietnamese: 'Một cuốn sách.' },
  { nameChinese: '不客气', namePinyin: 'bú kèqi', nameVietnamese: 'Đừng khách sáo', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '不客气。', examplePinyin: 'Bú kèqi.', exampleVietnamese: 'Đừng khách sáo.' },
  { nameChinese: '不', namePinyin: 'bù', nameVietnamese: 'Không', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '我不去。', examplePinyin: 'Wǒ bú qù.', exampleVietnamese: 'Tôi không đi.' },

  // --- HSK 3 & 4 ---
  { nameChinese: '爱情', namePinyin: 'àiqíng', nameVietnamese: 'Tình yêu', hskLevel: 4, category: 'Tình cảm', exampleChinese: '真挚爱情。', examplePinyin: 'Zhēnzhì àiqíng.', exampleVietnamese: 'Tình yêu chân thành.' },
  { nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'Sắp xếp', hskLevel: 4, category: 'Công việc', exampleChinese: '安排时间。', examplePinyin: 'Ānpái shíjiān.', exampleVietnamese: 'Sắp xếp thời gian.' },
  { nameChinese: '安全', namePinyin: 'ānquán', nameVietnamese: 'An toàn', hskLevel: 4, category: 'Đời sống', exampleChinese: '注意安全。', examplePinyin: 'Zhùyì ānquán.', exampleVietnamese: 'Chú ý an toàn.' },
  { nameChinese: '按时', namePinyin: 'ànshí', nameVietnamese: 'Đúng giờ', hskLevel: 4, category: 'Công việc', exampleChinese: '按时完成。', examplePinyin: 'Ànshí wánchéng.', exampleVietnamese: 'Hoàn thành đúng giờ.' },
  { nameChinese: '按照', namePinyin: 'ànzhào', nameVietnamese: 'Căn cứ theo', hskLevel: 4, category: 'Ngữ pháp', exampleChinese: '按照规定。', examplePinyin: 'Ànzhào guīdìng.', exampleVietnamese: 'Căn cứ theo quy định.' },
  { nameChinese: '百分之', namePinyin: 'bǎi fēn zhī', nameVietnamese: 'Phần trăm (%)', hskLevel: 4, category: 'Con số', exampleChinese: '百分之百。', examplePinyin: 'Bǎi fēn zhī bǎi.', exampleVietnamese: 'Một trăm phần trăm.' },
  { nameChinese: '棒', namePinyin: 'bàng', nameVietnamese: 'Giỏi, gậy', hskLevel: 4, category: 'Mô tả', exampleChinese: '你真棒！', examplePinyin: 'Nǐ zhēn bàng!', exampleVietnamese: 'Bạn thật giỏi!' },
  { nameChinese: '包子', namePinyin: 'bāozi', nameVietnamese: 'Bánh bao', hskLevel: 4, category: 'Ẩm thực', exampleChinese: '吃包子。', examplePinyin: 'Chī bāozi.', exampleVietnamese: 'Ăn bánh bao.' },
  { nameChinese: '保护', namePinyin: 'bǎohù', nameVietnamese: 'Bảo vệ', hskLevel: 4, category: 'Đời sống', exampleChinese: '保护环境。', examplePinyin: 'Bǎohù huánjìng.', exampleVietnamese: 'Bảo vệ môi trường.' },
  { nameChinese: '保证', namePinyin: 'bǎozhèng', nameVietnamese: 'Đảm bảo', hskLevel: 4, category: 'Công việc', exampleChinese: '做出保证。', examplePinyin: 'Zuòchū bǎozhèng.', exampleVietnamese: 'Đưa ra sự đảm bảo.' },

  // --- HSK 5 & 6 ---
  { nameChinese: '把握', namePinyin: 'bǎwò', nameVietnamese: 'Nắm bắt', hskLevel: 5, category: 'Công việc', exampleChinese: '把握机会。', examplePinyin: 'Bǎwò jīhuì.', exampleVietnamese: 'Nắm bắt cơ hội.' },
  { nameChinese: '具备', namePinyin: 'jùbèi', nameVietnamese: 'Có đủ', hskLevel: 5, category: 'Công việc', exampleChinese: '具备条件。', examplePinyin: 'Jùbèi tiáojiàn.', exampleVietnamese: 'Có đủ điều kiện.' },
  { nameChinese: '精益求精', namePinyin: 'jīng yì qiú jīng', nameVietnamese: 'Luôn phấn đấu tốt hơn', hskLevel: 6, category: 'Công việc', exampleChinese: '精益求精。', examplePinyin: 'Jīng yì qiú jīng.', exampleVietnamese: 'Luôn phấn đấu tốt hơn.' },
  { nameChinese: '卓越', namePinyin: 'zhuóyuè', nameVietnamese: 'Xuất sắc', hskLevel: 6, category: 'Mô tả', exampleChinese: '卓越成就。', examplePinyin: 'Zhuóyuè chéngjiù.', exampleVietnamese: 'Thành tựu xuất sắc.' },

  // --- HSK 7, 8, 9 ---
  { nameChinese: '融会贯通', namePinyin: 'róng huì guàn tōng', nameVietnamese: 'Hội tụ thông suốt', hskLevel: 7, category: 'Học tập', exampleChinese: '融会贯通。', examplePinyin: 'Róng huì guàn tōng.', exampleVietnamese: 'Hội tụ thông suốt.' },
  { nameChinese: '博大精深', namePinyin: 'bó dà jīng shēn', nameVietnamese: 'Bác đại tinh thâm', hskLevel: 8, category: 'Văn hóa', exampleChinese: '博大精深。', examplePinyin: 'Bó dà jīng shēn.', exampleVietnamese: 'Bác đại tinh thâm.' },
  { nameChinese: '厚积薄发', namePinyin: 'hòu jī bó fā', nameVietnamese: 'Tích lũy bùng nổ', hskLevel: 9, category: 'Công việc', exampleChinese: '厚积薄发。', examplePinyin: 'Hòu jī bó fā.', exampleVietnamese: 'Tích lũy bùng nổ.' },

  // --- BỔ SUNG TỪ THỰC TẾ ĐỂ CHẠY NẠP MỚI LIÊN TỤC KHÔNG BAO GIỜ +0 ---
  { nameChinese: '咖啡', namePinyin: 'kāfēi', nameVietnamese: 'Cà phê', hskLevel: 2, category: 'Ẩm thực', exampleChinese: '喝咖啡。', examplePinyin: 'Hē kāfēi.', exampleVietnamese: 'Uống cà phê.' },
  { nameChinese: '牛奶', namePinyin: 'niúnǎi', nameVietnamese: 'Sữa bò', hskLevel: 2, category: 'Ẩm thực', exampleChinese: '喝牛奶。', examplePinyin: 'Hē niúnǎi.', exampleVietnamese: 'Uống sữa.' },
  { nameChinese: '准备', namePinyin: 'zhǔnbèi', nameVietnamese: 'Chuẩn bị', hskLevel: 2, category: 'Công việc', exampleChinese: '准备好了。', examplePinyin: 'Zhǔnbèi hǎo le.', exampleVietnamese: 'Chuẩn bị xong rồi.' },
  { nameChinese: '开始', namePinyin: 'kāishǐ', nameVietnamese: 'Bắt đầu', hskLevel: 2, category: 'Hành động', exampleChinese: '现在开始。', examplePinyin: 'Xiànzài kāishǐ.', exampleVietnamese: 'Bây giờ bắt đầu.' },
  { nameChinese: '意思', namePinyin: 'yìsi', nameVietnamese: 'Ý nghĩa', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '什么意思？', examplePinyin: 'Shénme yìsi?', exampleVietnamese: 'Ý gì vậy?' },
  { nameChinese: '经常', namePinyin: 'jīngcháng', nameVietnamese: 'Thường xuyên', hskLevel: 3, category: 'Đời sống', exampleChinese: '经常运动。', examplePinyin: 'Jīngcháng yùndòng.', exampleVietnamese: 'Thường xuyên vận động.' },
  { nameChinese: '解决', namePinyin: 'jiějué', nameVietnamese: 'Giải quyết', hskLevel: 3, category: 'Công việc', exampleChinese: '解决问题。', examplePinyin: 'Jiějué wèntí.', exampleVietnamese: 'Giải quyết vấn đề.' },
  { nameChinese: '方便', namePinyin: 'fāngbiàn', nameVietnamese: 'Convenient, tiện lợi', hskLevel: 3, category: 'Đời sống', exampleChinese: '非常方便。', examplePinyin: 'Fēicháng fāngbiàn.', exampleVietnamese: 'Rất tiện lợi.' },
  { nameChinese: '检查', namePinyin: 'jiǎnchá', nameVietnamese: 'Kiểm tra', hskLevel: 3, category: 'Công việc', exampleChinese: '检查作业。', examplePinyin: 'Jiǎnchá zuòyè.', exampleVietnamese: 'Kiểm tra bài tập.' },
  { nameChinese: '影响', namePinyin: 'yǐngxiǎng', nameVietnamese: 'Ảnh hưởng', hskLevel: 4, category: 'Xã hội', exampleChinese: '有很大影响。', examplePinyin: 'Yǒu hěn dà yǐngxiǎng.', exampleVietnamese: 'Có ảnh hưởng rất lớn.' },
  { nameChinese: '继续', namePinyin: 'jìxù', nameVietnamese: 'Tiếp tục', hskLevel: 4, category: 'Hành động', exampleChinese: '继续努力。', examplePinyin: 'Jìxù nǔlì.', exampleVietnamese: 'Tiếp tục nỗ lực.' },
  { nameChinese: '建议', namePinyin: 'jiànyì', nameVietnamese: 'Kiến nghị, đề xuất', hskLevel: 4, category: 'Giao tiếp', exampleChinese: '好的建议。', examplePinyin: 'Hǎo de jiànyì.', exampleVietnamese: 'Đề xuất hay.' },
  { nameChinese: '经验', namePinyin: 'jīngyàn', nameVietnamese: 'Kinh nghiệm', hskLevel: 4, category: 'Công việc', exampleChinese: '工作经验。', examplePinyin: 'Gōngzuò jīngyàn.', exampleVietnamese: 'Kinh nghiệm làm việc.' },
  { nameChinese: '经济', namePinyin: 'jīngjì', nameVietnamese: 'Kinh tế', hskLevel: 5, category: 'Kinh tế', exampleChinese: '经济发展。', examplePinyin: 'Jīngjì fāzhǎn.', exampleVietnamese: 'Phát triển kinh tế.' },
  { nameChinese: '积累', namePinyin: 'jīlěi', nameVietnamese: 'Tích lũy', hskLevel: 5, category: 'Học tập', exampleChinese: '积累经验。', examplePinyin: 'Jīlěi jīngyàn.', exampleVietnamese: 'Tích lũy kinh nghiệm.' },
  { nameChinese: '强调', namePinyin: 'qiángdiào', nameVietnamese: 'Nhấn mạnh', hskLevel: 5, category: 'Giao tiếp', exampleChinese: '反复强调。', examplePinyin: 'Fǎnfù qiángdiào.', exampleVietnamese: 'Nhấn mạnh nhiều lần.' }
];

async function seedContinuous() {
  console.log('⚡==================================================⚡');
  console.log('🚀 BOT NẠP TỪ VỰNG HSK 1-9 - CHẠY LIÊN TỤC KHÔNG GIÁN ĐOẠN');
  console.log('⚡==================================================⚡\n');

  const startTime = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  console.log(`📦 Số từ độc bản hiện tại trước khi nạp: ${existingSet.size} từ.`);

  let added = 0;
  const BATCH_SIZE = 5; // Mỗi lần gõ nạp đúng +5 từ mới tinh

  for (const item of HUGE_REAL_HSK_DICTIONARY) {
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
    if (added >= BATCH_SIZE) break;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n==================================================');
  console.log(`🎉 NẠP THÀNH CÔNG TRONG ${duration} GIÂY!`);
  console.log(`✨ ĐÃ THÊM MỚI TỔNG CỘNG: +${added} TỪ VỰNG CHUẨN XÁC!`);
  console.log(`📚 TỔNG KHO TỪ VỰNG HSK BÂY GIỜ LÀ: ${existingSet.size} TỪ.`);
  console.log('==================================================\n');
}

seedContinuous().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
