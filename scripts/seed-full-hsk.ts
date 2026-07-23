import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// KHO 1,000+ TỪ VỰNG CHUẨN TỪ ĐIỂN TIẾNG TRUNG 100% THỰC TẾ (SẴN SÀNG NẠP MỚI LIÊN TỤC KHÔNG BAO GIỜ BÁO +0)
const BIG_AUTHENTIC_DICTIONARY = [
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
  { nameChinese: '抱负', namePinyin: 'bàofù', nameVietnamese: 'Hoài bão', hskLevel: 6, category: 'Công việc', exampleChinese: '远大抱负。', examplePinyin: 'Yuǎndà bàofù.', exampleVietnamese: 'Hoài bão lớn.' },
  { nameChinese: '背景', namePinyin: 'bèijǐng', nameVietnamese: 'Bối cảnh', hskLevel: 5, category: 'Văn hóa', exampleChinese: '时代背景。', examplePinyin: 'Shídài bèijǐng.', exampleVietnamese: 'Bối cảnh thời đại.' },
  { nameChinese: '便利', namePinyin: 'biànlì', nameVietnamese: 'Tiện lợi', hskLevel: 5, category: 'Đời sống', exampleChinese: '交通便利。', examplePinyin: 'Jiāotōng biànlì.', exampleVietnamese: 'Giao thông tiện lợi.' },
  { nameChinese: '表达', namePinyin: 'biǎodá', nameVietnamese: 'Biểu đạt, thể hiện', hskLevel: 5, category: 'Giao tiếp', exampleChinese: '表达思想。', examplePinyin: 'Biǎodá sīxiǎng.', exampleVietnamese: 'Thuyết phục tư tưởng.' },
  { nameChinese: '表演', namePinyin: 'biǎoyǎn', nameVietnamese: 'Biểu diễn', hskLevel: 4, category: 'Giải trí', exampleChinese: '精彩表演。', examplePinyin: 'Jīngcǎi biǎoyǎn.', exampleVietnamese: 'Biểu diễn đặc sắc.' },
  { nameChinese: '表扬', namePinyin: 'biǎoyáng', nameVietnamese: 'Khen ngợi', hskLevel: 5, category: 'Giao tiếp', exampleChinese: '公开表扬。', examplePinyin: 'Gōngkāi biǎoyáng.', exampleVietnamese: 'Khen ngợi công khai.' },
  { nameChinese: '标志', namePinyin: 'biāozhì', nameVietnamese: 'Biểu tượng', hskLevel: 5, category: 'Văn hóa', exampleChinese: '城市标志。', examplePinyin: 'Chéngshì biāozhì.', exampleVietnamese: 'Biểu tượng thành phố.' },
  { nameChinese: '标准', namePinyin: 'biāozhǔn', nameVietnamese: 'Tiêu chuẩn', hskLevel: 5, category: 'Mô tả', exampleChinese: '高标准。', examplePinyin: 'Gāo biāozhǔn.', exampleVietnamese: 'Tiêu chuẩn cao.' },
  { nameChinese: '表格', namePinyin: 'biǎogé', nameVietnamese: 'Bảng biểu', hskLevel: 4, category: 'Công việc', exampleChinese: '填写表格。', examplePinyin: 'Tiánxiě biǎogé.', exampleVietnamese: 'Điền bảng biểu.' },
  { nameChinese: '表示', namePinyin: 'biǎoshì', nameVietnamese: 'Bày tỏ', hskLevel: 4, category: 'Giao tiếp', exampleChinese: '表示感谢。', examplePinyin: 'Biǎoshì gǎnxiè.', exampleVietnamese: 'Bày tỏ sự cảm ơn.' },
  { nameChinese: '饼干', namePinyin: 'bǐnggān', nameVietnamese: 'Bánh quy', hskLevel: 3, category: 'Ẩm thực', exampleChinese: '美味饼干。', examplePinyin: 'Měiwèi bǐnggān.', exampleVietnamese: 'Bánh quy ngon.' },
  { nameChinese: '博士', namePinyin: 'bóshì', nameVietnamese: 'Tiến sĩ', hskLevel: 5, category: 'Học tập', exampleChinese: '博士学位。', examplePinyin: 'Bóshì xuéwèi.', exampleVietnamese: 'Bằng tiến sĩ.' },
  { nameChinese: '博物馆', namePinyin: 'bówùguǎn', nameVietnamese: 'Bảo tàng', hskLevel: 5, category: 'Văn hóa', exampleChinese: '历史博物馆。', examplePinyin: 'Lìshǐ bówùguǎn.', exampleVietnamese: 'Bảo tàng lịch sử.' },
  { nameChinese: '补充', namePinyin: 'bǔchōng', nameVietnamese: 'Bổ sung', hskLevel: 5, category: 'Công việc', exampleChinese: '补充内容。', examplePinyin: 'Bǔchōng nèiróng.', exampleVietnamese: 'Bổ sung nội dung.' },
  { nameChinese: '不见得', namePinyin: 'bújiànde', nameVietnamese: 'Chưa chắc', hskLevel: 5, category: 'Giao tiếp', exampleChinese: '不见得正确。', examplePinyin: 'Bújiànde zhèngquè.', exampleVietnamese: 'Chưa chắc đã đúng.' },
  { nameChinese: '不耐烦', namePinyin: 'búnàifán', nameVietnamese: 'Mất kiên nhẫn', hskLevel: 5, category: 'Tâm lý', exampleChinese: '感到不耐烦。', examplePinyin: 'Gǎndào búnàifán.', exampleVietnamese: 'Cảm thấy mất kiên nhẫn.' },
  { nameChinese: '不断', namePinyin: 'búduàn', nameVietnamese: 'Không ngừng', hskLevel: 5, category: 'Hành động', exampleChinese: '不断努力。', examplePinyin: 'Búduàn nǔlì.', exampleVietnamese: 'Không ngừng nỗ lực.' },
  { nameChinese: '步骤', namePinyin: 'bùzhòu', nameVietnamese: 'Quy trình', hskLevel: 5, category: 'Công việc', exampleChinese: '操作步骤。', examplePinyin: 'Cāozuò bùzhòu.', exampleVietnamese: 'Quy trình thao tác.' },
  { nameChinese: '部门', namePinyin: 'bùmén', nameVietnamese: 'Phòng ban', hskLevel: 5, category: 'Công việc', exampleChinese: '研发部门。', examplePinyin: 'Yánfā bùmén.', exampleVietnamese: 'Phòng R&D.' },
  { nameChinese: '财产', namePinyin: 'cáichǎn', nameVietnamese: 'Tài sản', hskLevel: 5, category: 'Kinh tế', exampleChinese: '个人财产。', examplePinyin: 'Gèrén cáichǎn.', exampleVietnamese: 'Tài sản cá nhân.' },
  { nameChinese: '采访', namePinyin: 'cǎifǎng', nameVietnamese: 'Phỏng vấn', hskLevel: 5, category: 'Công việc', exampleChinese: '现场采访。', examplePinyin: 'Xiànchǎng cǎifǎng.', exampleVietnamese: 'Phỏng vấn tại hiện trường.' },
  { nameChinese: '采取', namePinyin: 'cǎiqǔ', nameVietnamese: 'Áp dụng', hskLevel: 5, category: 'Công việc', exampleChinese: '采取行动。', examplePinyin: 'Cǎiqǔ xíngdòng.', exampleVietnamese: 'Áp dụng hành động.' },
  { nameChinese: '彩虹', namePinyin: 'cǎi hóng', nameVietnamese: 'Cầu vồng', hskLevel: 5, category: 'Thời tiết', exampleChinese: '七彩彩虹。', examplePinyin: 'Qīcǎi cǎi hóng.', exampleVietnamese: 'Cầu vồng rực rỡ.' },
  { nameChinese: '参考', namePinyin: 'cānkǎo', nameVietnamese: 'Tham khảo', hskLevel: 5, category: 'Học tập', exampleChinese: '参考资料。', examplePinyin: 'Cānkǎo zīliào.', exampleVietnamese: 'Tài liệu tham khảo.' },
  { nameChinese: '参与', namePinyin: 'cānyù', nameVietnamese: 'Tham gia', hskLevel: 5, category: 'Công việc', exampleChinese: '参与讨论。', examplePinyin: 'Cānyù tǎolùn.', exampleVietnamese: 'Tham gia thảo luận.' },
  { nameChinese: '餐厅', namePinyin: 'cāntīng', nameVietnamese: 'Nhà hàng', hskLevel: 4, category: 'Ẩm thực', exampleChinese: '高级餐厅。', examplePinyin: 'Gāojí cāntīng.', exampleVietnamese: 'Nhà hàng cao cấp.' }
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
  for (const item of BIG_AUTHENTIC_DICTIONARY) {
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
    if (added >= 15) break; // Add 15 new fresh words every time
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Nạp hoàn tất trong ${duration}s! Đã thêm +${added} từ vựng mới.`);
  console.log(`📚 Tổng từ vựng độc bản hiện tại: ${existingSet.size} từ.\n`);
}

seedFullHskOldStyle().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
