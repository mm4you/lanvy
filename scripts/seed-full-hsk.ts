import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// BỘ TỪ VỰNG TIÊU CHUẨN MỞ RỘNG HSK 1-6 DÙNG CHO SEEDING NẠP SIÊU TỐC
const COMPREHENSIVE_HSK_DICTIONARY = [
  // --- HSK 1 ---
  { nameChinese: '爱', namePinyin: 'ài', nameVietnamese: 'Yêu, thích', hskLevel: 1, category: 'Tình cảm', exampleChinese: '我爱我的家人。', examplePinyin: 'Wǒ ài wǒ de jiārén.', exampleVietnamese: 'Tôi yêu gia đình tôi.' },
  { nameChinese: '八', namePinyin: 'bā', nameVietnamese: 'Số 8', hskLevel: 1, category: 'Con số', exampleChinese: '他八岁了。', examplePinyin: 'Tā bā suì le.', exampleVietnamese: 'Cậu ấy 8 tuổi rồi.' },
  { nameChinese: '爸爸', namePinyin: 'bàba', nameVietnamese: 'Bố, ba', hskLevel: 1, category: 'Gia đình', exampleChinese: '爸爸在看书。', examplePinyin: 'Bàba zài kànshū.', exampleVietnamese: 'Bố đang đọc sách.' },
  { nameChinese: '杯子', namePinyin: 'bēizi', nameVietnamese: 'Cái cốc', hskLevel: 1, category: 'Đồ dùng', exampleChinese: '桌子上有个杯子。', examplePinyin: 'Zhuōzi shàng yǒu ge bēizi.', exampleVietnamese: 'Trên bàn có cái cốc.' },
  { nameChinese: '北京', namePinyin: 'Běijīng', nameVietnamese: 'Bắc Kinh', hskLevel: 1, category: 'Địa danh', exampleChinese: '我去过北京。', examplePinyin: 'Wǒ qù guo Běijīng.', exampleVietnamese: 'Tôi từng đi Bắc Kinh.' },
  { nameChinese: '本', namePinyin: 'běn', nameVietnamese: 'Cuốn, quyển', hskLevel: 1, category: 'Lượng từ', exampleChinese: '一本书。', examplePinyin: 'Yì běn shū.', exampleVietnamese: 'Một cuốn sách.' },
  { nameChinese: '不客气', namePinyin: 'bú kèqi', nameVietnamese: 'Đừng khách sáo', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '不客气，这是应该的。', examplePinyin: 'Bú kèqi, zhè shì yīnggāi de.', exampleVietnamese: 'Không có chi, đây là việc nên làm.' },
  { nameChinese: '不', namePinyin: 'bù', nameVietnamese: 'Không', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '我不是学生。', examplePinyin: 'Wǒ bú shì xuéshēng.', exampleVietnamese: 'Tôi không phải là học sinh.' },
  { nameChinese: '菜', namePinyin: 'cài', nameVietnamese: 'Món ăn, rau', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '今天的菜很好吃。', examplePinyin: 'Jīntiān de cài hěn hǎochī.', exampleVietnamese: 'Món ăn hôm nay rất ngon.' },
  { nameChinese: '茶', namePinyin: 'chá', nameVietnamese: 'Trà', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '请喝热茶。', examplePinyin: 'Qǐng hē rè chá.', exampleVietnamese: 'Xin mời uống trà nóng.' },
  { nameChinese: '吃', namePinyin: 'chī', nameVietnamese: 'Ăn', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '我们一起吃饭吧。', examplePinyin: 'Wǒmen yìqǐ chīfàn ba.', exampleVietnamese: 'Chúng ta cùng ăn cơm nhé.' },
  { nameChinese: '出租车', namePinyin: 'chūzūchē', nameVietnamese: 'Xe taxi', hskLevel: 1, category: 'Giao thông', exampleChinese: '坐出租车去机场。', examplePinyin: 'Zuò chūzūchē qù jīchǎng.', exampleVietnamese: 'Đi taxi đến sân bay.' },
  { nameChinese: '打电话', namePinyin: 'dǎ diànhuà', nameVietnamese: 'Gọi điện thoại', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '给妈妈打电话。', examplePinyin: 'Gěi māma dǎ diànhuà.', exampleVietnamese: 'Gọi điện thoại cho mẹ.' },
  { nameChinese: '大', namePinyin: 'dà', nameVietnamese: 'Lớn, to', hskLevel: 1, category: 'Mô tả', exampleChinese: '这个苹果很大。', examplePinyin: 'Zhè ge píngguǒ hěn dà.', exampleVietnamese: 'Quả táo này rất to.' },

  // --- HSK 2 ---
  { nameChinese: '百', namePinyin: 'bǎi', nameVietnamese: 'Trăm (100)', hskLevel: 2, category: 'Con số', exampleChinese: '一百块钱。', examplePinyin: 'Yì bǎi kuài qián.', exampleVietnamese: 'Một trăm tệ.' },
  { nameChinese: '帮助', namePinyin: 'bāngzhù', nameVietnamese: 'Giúp đỡ', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '互相帮助。', examplePinyin: 'Hùxiāng bāngzhù.', exampleVietnamese: 'Giúp đỡ lẫn nhau.' },
  { nameChinese: '报纸', namePinyin: 'bàozhǐ', nameVietnamese: 'Báo chí', hskLevel: 2, category: 'Tin tức', exampleChinese: '爷爷天天看报纸。', examplePinyin: 'Yéye tiāntiān kàn bàozhǐ.', exampleVietnamese: 'Ông nội ngày nào cũng đọc báo.' },
  { nameChinese: '比', namePinyin: 'bǐ', nameVietnamese: 'So với', hskLevel: 2, category: 'Ngữ pháp', exampleChinese: '今天比昨天热。', examplePinyin: 'Jīntiān bǐ zuótiān rè.', exampleVietnamese: 'Hôm nay nóng hơn hôm qua.' },
  { nameChinese: '别', namePinyin: 'bié', nameVietnamese: 'Đừng', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '别担心。', examplePinyin: 'Bié dānxīn.', exampleVietnamese: 'Đừng lo lắng.' },
  { nameChinese: '长', namePinyin: 'cháng', nameVietnamese: 'Dài', hskLevel: 2, category: 'Mô tả', exampleChinese: '这根绳子很长。', examplePinyin: 'Zhè gēn shéngzi hěn cháng.', exampleVietnamese: 'Sợi dây này rất dài.' },

  // --- HSK 3 ---
  { nameChinese: '阿姨', namePinyin: 'āyí', nameVietnamese: 'Dì, cô', hskLevel: 3, category: 'Gia đình', exampleChinese: '阿姨好！', examplePinyin: 'Āyí hǎo!', exampleVietnamese: 'Chào cô ạ!' },
  { nameChinese: '矮', namePinyin: 'ǎi', nameVietnamese: 'Thấp, lùn', hskLevel: 3, category: 'Mô tả', exampleChinese: '弟弟有点矮。', examplePinyin: 'Dìdi yǒudiǎnr ǎi.', exampleVietnamese: 'Em trai hơi lùn.' },
  { nameChinese: '爱好', namePinyin: 'àihào', nameVietnamese: 'Sở thích', hskLevel: 3, category: 'Giải trí', exampleChinese: '我有很多爱好。', examplePinyin: 'Wǒ yǒu hěn duō àihào.', exampleVietnamese: 'Tôi có rất nhiều sở thích.' },
  { nameChinese: '安静', namePinyin: 'ānjìng', nameVietnamese: 'Yên tĩnh', hskLevel: 3, category: 'Mô tả', exampleChinese: '图书馆里很安静。', examplePinyin: 'Túshūguǎn lǐ hěn ānjìng.', exampleVietnamese: 'Trong thư viện rất yên tĩnh.' },

  // --- HSK 4 ---
  { nameChinese: '爱情', namePinyin: 'àiqíng', nameVietnamese: 'Tình yêu', hskLevel: 4, category: 'Tình cảm', exampleChinese: '真挚的爱情。', examplePinyin: 'Zhēnzhì de àiqíng.', exampleVietnamese: 'Tình yêu chân thành.' },
  { nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'An bài, sắp xếp', hskLevel: 4, category: 'Công việc', exampleChinese: '合理安排时间。', examplePinyin: 'Hélǐ ānpái shíjiān.', exampleVietnamese: 'Sắp xếp thời gian hợp lý.' },
  { nameChinese: '安全', namePinyin: 'ānquán', nameVietnamese: 'An toàn', hskLevel: 4, category: 'Đời sống', exampleChinese: '注意人身安全。', examplePinyin: 'Zhùyì rénshēn ānquán.', exampleVietnamese: 'Chú ý an toàn bản thân.' },

  // --- HSK 5 ---
  { nameChinese: '安慰', namePinyin: 'ānwèi', nameVietnamese: 'An ủi', hskLevel: 5, category: 'Tâm lý', exampleChinese: '温和地安慰朋友。', examplePinyin: 'Wēnhé de ānwèi péngyou.', exampleVietnamese: 'Nhẹ nhàng an ủi bạn bè.' },
  { nameChinese: '安装', namePinyin: 'ānzhuāng', nameVietnamese: 'Lắp đặt', hskLevel: 5, category: 'Công nghệ', exampleChinese: '安装新软件。', examplePinyin: 'Ānzhuāng xīn ruǎnjiàn.', exampleVietnamese: 'Lắp đặt phần mềm mới.' },

  // --- HSK 6 ---
  { nameChinese: '爱不释手', namePinyin: 'ài bú shì shǒu', nameVietnamese: 'Yêu thích không nỡ rời tay', hskLevel: 6, category: 'Tâm lý', exampleChinese: '对这本书爱不释手。', examplePinyin: 'Duì zhè běn shū ài bú shì shǒu.', exampleVietnamese: 'Đối với cuốn sách này thích không nỡ rời tay.' },
  { nameChinese: '爱戴', namePinyin: 'àidài', nameVietnamese: 'Kính yêu, tôn kính', hskLevel: 6, category: 'Giao tiếp', exampleChinese: '深受人们的爱戴。', examplePinyin: 'Shēn shòu rénmen de àidài.', exampleVietnamese: 'Được mọi người vô cùng kính yêu.' }
];

async function fastSeed() {
  console.log('⚡==================================================⚡');
  console.log('🚀 NẠP TỪ VỰNG NÀO - TỐC ĐỘ SIÊU TỐC KHÔNG DELAY 0.0s');
  console.log('⚡==================================================⚡\n');

  const start = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  let inserted = 0;
  for (const item of COMPREHENSIVE_HSK_DICTIONARY) {
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
    inserted++;
  }

  const duration = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`✅ Nạp hoàn tất trong ${duration}s! Đã thêm +${inserted} từ vựng mới.`);
  console.log(`📚 Tổng từ vựng độc bản hiện tại: ${existingSet.size} từ.\n`);
}

fastSeed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
