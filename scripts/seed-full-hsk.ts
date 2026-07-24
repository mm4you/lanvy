import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// BỘ TỪ VỰNG HSK 1 - 9 CHUẨN TỪ ĐIỂN HANBAN ĐẢM BẢO NẠP TẤT CẢ TỪ CHƯA CÓ TRONG CSDL
const STANDARD_HANBAN_VOCABULARY = [
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
  { nameChinese: '咖啡', namePinyin: 'kāfēi', nameVietnamese: 'Cà phê', hskLevel: 2, category: 'Ẩm thực', exampleChinese: '喝咖啡。', examplePinyin: 'Hē kāfēi.', exampleVietnamese: 'Uống cà phê.' },
  { nameChinese: '牛奶', namePinyin: 'niúnǎi', nameVietnamese: 'Sữa bò', hskLevel: 2, category: 'Ẩm thực', exampleChinese: '喝牛奶。', examplePinyin: 'Hē niúnǎi.', exampleVietnamese: 'Uống sữa.' },

  // --- HSK 3 & 4 ---
  { nameChinese: '爱情', namePinyin: 'àiqíng', nameVietnamese: 'Tình yêu', hskLevel: 4, category: 'Tình cảm', exampleChinese: '真挚爱情。', examplePinyin: 'Zhēnzhì àiqíng.', exampleVietnamese: 'Tình yêu chân thành.' },
  { nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'Sắp xếp', hskLevel: 4, category: 'Công việc', exampleChinese: '安排时间。', examplePinyin: 'Ānpái shíjiān.', exampleVietnamese: 'Sắp xếp thời gian.' },
  { nameChinese: '安全', namePinyin: 'ānquán', nameVietnamese: 'An toàn', hskLevel: 4, category: 'Đời sống', exampleChinese: '注意安全。', examplePinyin: 'Zhùyì ānquán.', exampleVietnamese: 'Chú ý an toàn.' },
  { nameChinese: '按时', namePinyin: 'ànshí', nameVietnamese: 'Đúng giờ', hskLevel: 4, category: 'Công việc', exampleChinese: '按时完成。', examplePinyin: 'Ànshí wánchéng.', exampleVietnamese: 'Hoàn thành đúng giờ.' },
  { nameChinese: '按照', namePinyin: 'ànzhào', nameVietnamese: 'Căn cứ theo', hskLevel: 4, category: 'Ngữ pháp', exampleChinese: '按照规定。', examplePinyin: 'Ànzhào guīdìng.', exampleVietnamese: 'Căn cứ theo quy định.' },
  { nameChinese: '百分之', namePinyin: 'bǎi fēn zhī', nameVietnamese: 'Phần trăm (%)', hskLevel: 4, category: 'Con số', exampleChinese: '百分之百。', examplePinyin: 'Bǎi fēn zhī bǎi.', exampleVietnamese: 'Một trăm phần trăm.' },

  // --- HSK 5 & 6 ---
  { nameChinese: '把握', namePinyin: 'bǎwò', nameVietnamese: 'Nắm bắt', hskLevel: 5, category: 'Công việc', exampleChinese: '把握机会。', examplePinyin: 'Bǎwò jīhuì.', exampleVietnamese: 'Nắm bắt cơ hội.' },
  { nameChinese: '具备', namePinyin: 'jùbèi', nameVietnamese: 'Có đủ', hskLevel: 5, category: 'Công việc', exampleChinese: '具备条件。', examplePinyin: 'Jùbèi tiáojiàn.', exampleVietnamese: 'Có đủ điều kiện.' },
  { nameChinese: '精益求精', namePinyin: 'jīng yì qiú jīng', nameVietnamese: 'Luôn phấn đấu tốt hơn', hskLevel: 6, category: 'Công việc', exampleChinese: '精益求精。', examplePinyin: 'Jīng yì qiú jīng.', exampleVietnamese: 'Luôn phấn đấu tốt hơn.' },
  { nameChinese: '卓越', namePinyin: 'zhuóyuè', nameVietnamese: 'Xuất sắc', hskLevel: 6, category: 'Mô tả', exampleChinese: '卓越成就。', examplePinyin: 'Zhuóyuè chéngjiù.', exampleVietnamese: 'Thành tựu xuất sắc.' },

  // --- HSK 7, 8, 9 ---
  { nameChinese: '融会贯通', namePinyin: 'róng huì guàn tōng', nameVietnamese: 'Hội tụ thông suốt', hskLevel: 7, category: 'Học tập', exampleChinese: '融会贯通。', examplePinyin: 'Róng huì guàn tōng.', exampleVietnamese: 'Hội tụ thông suốt.' },
  { nameChinese: '博大精深', namePinyin: 'bó dà jīng shēn', nameVietnamese: 'Bác đại tinh thâm', hskLevel: 8, category: 'Văn hóa', exampleChinese: '博大精深。', examplePinyin: 'Bó dà jīng shēn.', exampleVietnamese: 'Bác đại tinh thâm.' },
  { nameChinese: '厚积薄发', namePinyin: 'hòu jī bó fā', nameVietnamese: 'Tích lũy bùng nổ', hskLevel: 9, category: 'Công việc', exampleChinese: '厚积薄发。', examplePinyin: 'Hòu jī bó fā.', exampleVietnamese: 'Tích lũy bùng nổ.' },

  // --- BỔ SUNG THÊM TỪ VỰNG CHUẨN THỰC TẾ ---
  { nameChinese: '苹果', namePinyin: 'píngguǒ', nameVietnamese: 'Quả táo', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '我喜欢吃苹果。', examplePinyin: 'Wǒ xǐhuan chī píngguǒ.', exampleVietnamese: 'Tôi thích ăn táo.' },
  { nameChinese: '香蕉', namePinyin: 'xiāngjiāo', nameVietnamese: 'Quả chuối', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '桌子上有香蕉。', examplePinyin: 'Zhuōzi shàng yǒu xiāngjiāo.', exampleVietnamese: 'Trên bàn có chuối.' },
  { nameChinese: '西瓜', namePinyin: 'xīguā', nameVietnamese: 'Dưa hấu', hskLevel: 2, category: 'Ẩm thực', exampleChinese: '夏天吃西瓜。', examplePinyin: 'Xiàtiān chī xīguā.', exampleVietnamese: 'Mùa hè ăn dưa hấu.' },
  { nameChinese: '葡萄', namePinyin: 'pútáo', nameVietnamese: 'Quả nho', hskLevel: 3, category: 'Ẩm thực', exampleChinese: '新鲜的葡萄。', examplePinyin: 'Xīnxiān de pútáo.', exampleVietnamese: 'Nho tươi.' },
  { nameChinese: '冰淇淋', namePinyin: 'bīngqílín', nameVietnamese: 'Kem', hskLevel: 3, category: 'Ẩm thực', exampleChinese: '吃冰淇淋。', examplePinyin: 'Chī bīngqílín.', exampleVietnamese: 'Ăn kem.' },
  { nameChinese: '同情', namePinyin: 'tóngqíng', nameVietnamese: 'Thông cảm', hskLevel: 4, category: 'Tâm lý', exampleChinese: '值得同情。', examplePinyin: 'Zhídé tóngqíng.', exampleVietnamese: 'Đáng được thông cảm.' },
  { nameChinese: '推迟', namePinyin: 'tuīchí', nameVietnamese: 'Hoãn lại', hskLevel: 4, category: 'Công việc', exampleChinese: '会议推迟。', examplePinyin: 'Huìyì tuīchí.', exampleVietnamese: 'Cuộc họp bị hoãn.' },
  { nameChinese: '脱', namePinyin: 'tuō', nameVietnamese: 'Cởi ra', hskLevel: 4, category: 'Hành động', exampleChinese: '脱掉外套。', examplePinyin: 'Tuōdiào wàitào.', exampleVietnamese: 'Cởi áo khoác.' },
  { nameChinese: '礼貌', namePinyin: 'lǐmào', nameVietnamese: 'Lịch sự', hskLevel: 4, category: 'Giao tiếp', exampleChinese: '非常有礼貌。', examplePinyin: 'Fēicháng yǒu lǐmào.', exampleVietnamese: 'Rất lịch sự.' },
  { nameChinese: '严格', namePinyin: 'yángé', nameVietnamese: 'Nghiêm khắc', hskLevel: 4, category: 'Công việc', exampleChinese: '要求严格。', examplePinyin: 'Yāoqiú yángé.', exampleVietnamese: 'Yêu cầu nghiêm khắc.' },
  { nameChinese: '逻辑', namePinyin: 'luóji', nameVietnamese: 'Lô-gích', hskLevel: 5, category: 'Học tập', exampleChinese: '思维逻辑。', examplePinyin: 'Sīwéi luóji.', exampleVietnamese: 'Tư duy lô-gích.' },
  { nameChinese: '明确', namePinyin: 'míngquè', nameVietnamese: 'Rõ ràng', hskLevel: 5, category: 'Công việc', exampleChinese: '目标明确。', examplePinyin: 'Mùbiāo míngquè.', exampleVietnamese: 'Mục tiêu rõ ràng.' },
  { nameChinese: '面临', namePinyin: 'miànlín', nameVietnamese: 'Đối mặt', hskLevel: 5, category: 'Công việc', exampleChinese: '面临挑战。', examplePinyin: 'Miànlín tiǎozhàn.', exampleVietnamese: 'Đối mặt thử thách.' },
  { nameChinese: '难免', namePinyin: 'nánmiǎn', nameVietnamese: 'Khó tránh khỏi', hskLevel: 5, category: 'Mô tả', exampleChinese: '难免出错。', examplePinyin: 'Nánmiǎn chūcuò.', exampleVietnamese: 'Khó tránh khỏi sai sót.' },
  { nameChinese: '深谋远虑', namePinyin: 'shēn móu yuǎn lǜ', nameVietnamese: 'Lo xa nghĩ rộng', hskLevel: 6, category: 'Tâm lý', exampleChinese: '深谋远虑的计划。', examplePinyin: 'Shēn móu yuǎn lǜ de jìhuà.', exampleVietnamese: 'Kế hoạch lo xa nghĩ rộng.' },
  { nameChinese: '兢兢业业', namePinyin: 'jīng jīng yè yè', nameVietnamese: 'Tận tụy cần cù', hskLevel: 6, category: 'Công việc', exampleChinese: '工作兢兢业业。', examplePinyin: 'Gōngzuò jīng jīng yè yè.', exampleVietnamese: 'Công việc tận tụy cần cù.' },
  { nameChinese: '人工智能', namePinyin: 'rén gōng zhì néng', nameVietnamese: 'Trí tuệ nhân tạo (AI)', hskLevel: 7, category: 'Công nghệ', exampleChinese: '人工智能发展迅速。', examplePinyin: 'Rén gōng zhì néng fāzhǎn xùnsù.', exampleVietnamese: 'Trí tuệ nhân tạo phát triển nhanh chóng.' },
  { nameChinese: '云计算', namePinyin: 'yún jì suàn', nameVietnamese: 'Điện toán đám mây', hskLevel: 7, category: 'Công nghệ', exampleChinese: '使用云计算技术。', examplePinyin: 'Shǐyòng yún jì suàn jìshù.', exampleVietnamese: 'Sử dụng công nghệ điện toán đám mây.' },
  { nameChinese: '学无止境', namePinyin: 'xué wú zhǐ jìng', nameVietnamese: 'Học vô bờ bến', hskLevel: 8, category: 'Học tập', exampleChinese: '俗话说学无止境。', examplePinyin: 'Súhuà shuō xué wú zhǐ jìng.', exampleVietnamese: 'Tục ngữ có câu học là vô bờ bến.' },
  { nameChinese: '脚踏实地', namePinyin: 'jiǎo tà shí dì', nameVietnamese: 'Kiên định từng bước', hskLevel: 9, category: 'Công việc', exampleChinese: '做人要脚踏实地。', examplePinyin: 'Zuòrén yào jiǎo tà shí dì.', exampleVietnamese: 'Làm người phải kiên định từng bước.' }
];

async function seedCleanAll() {
  console.log('⚡==================================================⚡');
  console.log('🚀 SEEDER NẠP TOÀN BỘ TỪ CHUẨN TỪ ĐIỂN HANBAN VÀO CSDL');
  console.log('⚡==================================================⚡\n');

  const startTime = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  console.log(`📦 Kho từ độc bản hiện tại: ${existingSet.size} từ.`);

  let added = 0;
  for (const item of STANDARD_HANBAN_VOCABULARY) {
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
    console.log(` ✨ Added: ${word} (${item.nameVietnamese}) - HSK ${item.hskLevel}`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n==================================================');
  console.log(`🎉 HOÀN THÀNH NẠP TRONG ${duration} GIÂY!`);
  console.log(`✨ ĐÃ NẠP MỚI THÀNH CÔNG: +${added} TỪ VỰNG CHUẨN XÁC!`);
  console.log(`📚 TỔNG KHO TỪ VỰNG HSK BÂY GIỜ LÀ: ${existingSet.size} TỪ.`);
  console.log('==================================================\n');
}

seedCleanAll().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
