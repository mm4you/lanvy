import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// BỘ TỪ VỰNG TIẾNG TRUNG CHUẨN HANBAN THỰC TẾ 100% (ĐƯỢC PHÂN LỌC KỸ LƯỠNG, CHIA THÀNH CÁC ĐỢT NẠP TỰ ĐỘNG)
const EXTENSIVE_CLEAN_HSK_POOL = [
  // --- HSK 1-3 REAL WORDS ---
  { nameChinese: '苹果', namePinyin: 'píngguǒ', nameVietnamese: 'Quả táo', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '我喜欢吃苹果。', examplePinyin: 'Wǒ xǐhuan chī píngguǒ.', exampleVietnamese: 'Tôi thích ăn táo.' },
  { nameChinese: '香蕉', namePinyin: 'xiāngjiāo', nameVietnamese: 'Quả chuối', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '桌子上有香蕉。', examplePinyin: 'Zhuōzi shàng yǒu xiāngjiāo.', exampleVietnamese: 'Trên bàn có chuối.' },
  { nameChinese: '西瓜', namePinyin: 'xīguā', nameVietnamese: 'Dưa hấu', hskLevel: 2, category: 'Ẩm thực', exampleChinese: '夏天吃西瓜。', examplePinyin: 'Xiàtiān chī xīguā.', exampleVietnamese: 'Mùa hè ăn dưa hấu.' },
  { nameChinese: '葡萄', namePinyin: 'pútáo', nameVietnamese: 'Quả nho', hskLevel: 3, category: 'Ẩm thực', exampleChinese: '新鲜的葡萄。', examplePinyin: 'Xīnxiān de pútáo.', exampleVietnamese: 'Nho tươi.' },
  { nameChinese: '冰淇淋', namePinyin: 'bīngqílín', nameVietnamese: 'Kem', hskLevel: 3, category: 'Ẩm thực', exampleChinese: '吃冰淇淋。', examplePinyin: 'Chī bīngqílín.', exampleVietnamese: 'Ăn kem.' },

  // --- HSK 4-6 REAL WORDS ---
  { nameChinese: '同情', namePinyin: 'tóngqíng', nameVietnamese: 'Đồng cảm, thông cảm', hskLevel: 4, category: 'Tâm lý', exampleChinese: '值得同情。', examplePinyin: 'Zhídé tóngqíng.', exampleVietnamese: 'Đáng được thông cảm.' },
  { nameChinese: '推迟', namePinyin: 'tuīchí', nameVietnamese: 'Hoãn lại, lùi lại', hskLevel: 4, category: 'Công việc', exampleChinese: '会议推迟。', examplePinyin: 'Huìyì tuīchí.', exampleVietnamese: 'Cuộc họp bị hoãn lại.' },
  { nameChinese: '脱', namePinyin: 'tuō', nameVietnamese: 'Cởi (áo/giày)', hskLevel: 4, category: 'Hành động', exampleChinese: '脱掉外套。', examplePinyin: 'Tuōdiào wàitào.', exampleVietnamese: 'Cởi áo khoác.' },
  { nameChinese: '礼貌', namePinyin: 'lǐmào', nameVietnamese: 'Lịch sự, lễ phép', hskLevel: 4, category: 'Giao tiếp', exampleChinese: '非常有礼貌。', examplePinyin: 'Fēicháng yǒu lǐmào.', exampleVietnamese: 'Rất có lịch sự.' },
  { nameChinese: '严格', namePinyin: 'yángé', nameVietnamese: 'Nghiêm khắc', hskLevel: 4, category: 'Công việc', exampleChinese: '要求严格。', examplePinyin: 'Yāoqiú yángé.', exampleVietnamese: 'Yêu cầu nghiêm khắc.' },

  { nameChinese: '逻辑', namePinyin: 'luóji', nameVietnamese: 'Lô-gích', hskLevel: 5, category: 'Học tập', exampleChinese: '思维逻辑。', examplePinyin: 'Sīwéi luóji.', exampleVietnamese: 'Tư duy lô-gích.' },
  { nameChinese: '明确', namePinyin: 'míngquè', nameVietnamese: 'Rõ ràng, minh xác', hskLevel: 5, category: 'Công việc', exampleChinese: '目标明确。', examplePinyin: 'Mùbiāo míngquè.', exampleVietnamese: 'Mục tiêu rõ ràng.' },
  { nameChinese: '面临', namePinyin: 'miànlín', nameVietnamese: 'Đối mặt với', hskLevel: 5, category: 'Công việc', exampleChinese: '面临挑战。', examplePinyin: 'Miànlín tiǎozhàn.', exampleVietnamese: 'Đối mặt với thử thách.' },
  { nameChinese: '难免', namePinyin: 'nánmiǎn', nameVietnamese: 'Khó tránh khỏi', hskLevel: 5, category: 'Mô tả', exampleChinese: '难免出错。', examplePinyin: 'Nánmiǎn chūcuò.', exampleVietnamese: 'Khó tránh khỏi sai sót.' },

  { nameChinese: '深谋远虑', namePinyin: 'shēn móu yuǎn lǜ', nameVietnamese: 'Lo xa nghĩ rộng', hskLevel: 6, category: 'Tâm lý', exampleChinese: '深谋远虑的计划。', examplePinyin: 'Shēn móu yuǎn lǜ de jìhuà.', exampleVietnamese: 'Kế hoạch lo xa nghĩ rộng.' },
  { nameChinese: '兢兢业业', namePinyin: 'jīng jīng yè yè', nameVietnamese: 'Tận tụy cần cù', hskLevel: 6, category: 'Công việc', exampleChinese: '工作兢兢业业。', examplePinyin: 'Gōngzuò jīng jīng yè yè.', exampleVietnamese: 'Công việc tận tụy cần cù.' },

  // --- HSK 7-9 REAL WORDS ---
  { nameChinese: '人工智能', namePinyin: 'rén gōng zhì néng', nameVietnamese: 'Trí tuệ nhân tạo (AI)', hskLevel: 7, category: 'Công nghệ', exampleChinese: '人工智能发展迅速。', examplePinyin: 'Rén gōng zhì néng fāzhǎn xùnsù.', exampleVietnamese: 'Trí tuệ nhân tạo phát triển nhanh chóng.' },
  { nameChinese: '云计算', namePinyin: 'yún jì suàn', nameVietnamese: 'Điện toán đám mây', hskLevel: 7, category: 'Công nghệ', exampleChinese: '使用云计算技术。', examplePinyin: 'Shǐyòng yún jì suàn jìshù.', exampleVietnamese: 'Sử dụng công nghệ điện toán đám mây.' },
  { nameChinese: '学无止境', namePinyin: 'xué wú zhǐ jìng', nameVietnamese: 'Học vô bờ bến', hskLevel: 8, category: 'Học tập', exampleChinese: '俗话说学无止境。', examplePinyin: 'Súhuà shuō xué wú zhǐ jìng.', exampleVietnamese: 'Tục ngữ có câu học là vô bờ bến.' },
  { nameChinese: '脚踏实地', namePinyin: 'jiǎo tà shí dì', nameVietnamese: 'Chân thực kiên định từng bước', hskLevel: 9, category: 'Công việc', exampleChinese: '做人要脚踏实地。', examplePinyin: 'Zuòrén yào jiǎo tà shí dì.', exampleVietnamese: 'Làm người phải kiên định từng bước.' }
];

async function seedFreshCleanWords() {
  console.log('⚡==================================================⚡');
  console.log('🚀 NẠP TỪ VỰNG CHUẨN TỪ ĐIỂN HANBAN 100% - KHÔNG RÁC');
  console.log('⚡==================================================⚡\n');

  const startTime = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  console.log(`📦 Kho từ độc bản hiện tại trước khi nạp: ${existingSet.size} từ.`);

  let added = 0;
  const TARGET_BATCH = 10; // Mỗi lần gõ lệnh nạp đúng 10 từ vựng chuẩn mới tinh chưa trùng

  for (const item of EXTENSIVE_CLEAN_HSK_POOL) {
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
    if (added >= TARGET_BATCH) break;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n==================================================');
  console.log(`🎉 NẠP THÀNH CÔNG TRONG ${duration} GIÂY!`);
  console.log(`✨ ĐÃ NẠP THÊM THÀNH CÔNG: +${added} TỪ VỰNG CHUẨN XÁC MỚI TINH!`);
  console.log(`📚 TỔNG KHO TỪ VỰNG HSK BÂY GIỜ LÀ: ${existingSet.size} TỪ.`);
  console.log('==================================================\n');
}

seedFreshCleanWords().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
