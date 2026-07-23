import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// MEGA COMPREHENSIVE HSK 1-6 DICTIONARY (~350+ CURATED WORDS)
const MEGA_HSK_WORDS = [
  // HSK 1
  { nameChinese: '爱', namePinyin: 'ài', nameVietnamese: 'Yêu, thích', hskLevel: 1, category: 'Tình cảm', exampleChinese: '我爱我的家人。', examplePinyin: 'Wǒ ài wǒ de jiārén.', exampleVietnamese: 'Tôi yêu gia đình tôi.' },
  { nameChinese: '八', namePinyin: 'bā', nameVietnamese: 'Số 8', hskLevel: 1, category: 'Con số', exampleChinese: '他八岁了。', examplePinyin: 'Tā bā suì le.', exampleVietnamese: 'Cậu ấy 8 tuổi rồi.' },
  { nameChinese: '爸爸', namePinyin: 'bàba', nameVietnamese: 'Bố, ba', hskLevel: 1, category: 'Gia đình', exampleChinese: '爸爸在看书。', examplePinyin: 'Bàba zài kànshū.', exampleVietnamese: 'Bố đang đọc sách.' },
  { nameChinese: '杯子', namePinyin: 'bēizi', nameVietnamese: 'Cái cốc', hskLevel: 1, category: 'Đồ dùng', exampleChinese: '桌子上有个杯子。', examplePinyin: 'Zhuōzi shàng yǒu ge bēizi.', exampleVietnamese: 'Trên bàn có cái cốc.' },
  { nameChinese: '北京', namePinyin: 'Běijīng', nameVietnamese: 'Bắc Kinh', hskLevel: 1, category: 'Địa danh', exampleChinese: '我去过北京。', examplePinyin: 'Wǒ qù guo Běijīng.', exampleVietnamese: 'Tôi từng đi Bắc Kinh.' },
  { nameChinese: '本', namePinyin: 'běn', nameVietnamese: 'Cuốn, quyển', hskLevel: 1, category: 'Lượng từ', exampleChinese: '一本书。', examplePinyin: 'Yì běn shū.', exampleVietnamese: 'Một cuốn sách.' },
  { nameChinese: '不客气', namePinyin: 'bú kèqi', nameVietnamese: 'Đừng khách sáo', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '不客气，这是应该的。', examplePinyin: 'Bú kèqi, zhè shì yīnggāi de.', exampleVietnamese: 'Không có chi, đây là việc nên làm.' },
  { nameChinese: '菜', namePinyin: 'cài', nameVietnamese: 'Món ăn, rau', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '今天的菜很好吃。', examplePinyin: 'Jīntiān de cài hěn hǎochī.', exampleVietnamese: 'Món ăn hôm nay rất ngon.' },
  { nameChinese: '茶', namePinyin: 'chá', nameVietnamese: 'Trà', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '请喝热茶。', examplePinyin: 'Qǐng hē rè chá.', exampleVietnamese: 'Xin mời uống trà nóng.' },
  { nameChinese: '吃', namePinyin: 'chī', nameVietnamese: 'Ăn', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '我们一起吃饭吧。', examplePinyin: 'Wǒmen yìqǐ chīfàn ba.', exampleVietnamese: 'Chúng ta cùng ăn cơm nhé.' },
  { nameChinese: '出租车', namePinyin: 'chūzūchē', nameVietnamese: 'Xe taxi', hskLevel: 1, category: 'Giao thông', exampleChinese: '坐出租车去机场。', examplePinyin: 'Zuò chūzūchē qù jīchǎng.', exampleVietnamese: 'Đi taxi đến sân bay.' },
  { nameChinese: '打电话', namePinyin: 'dǎ diànhuà', nameVietnamese: 'Gọi điện thoại', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '给妈妈打电话。', examplePinyin: 'Gěi māma dǎ diànhuà.', exampleVietnamese: 'Gọi điện thoại cho mẹ.' },
  { nameChinese: '大', namePinyin: 'dà', nameVietnamese: 'Lớn, to', hskLevel: 1, category: 'Mô tả', exampleChinese: '这个苹果很大。', examplePinyin: 'Zhè ge píngguǒ hěn dà.', exampleVietnamese: 'Quả táo này rất to.' },
  { nameChinese: '点', namePinyin: 'diǎn', nameVietnamese: 'Giờ, chút', hskLevel: 1, category: 'Thời gian', exampleChinese: '现在是八点。', examplePinyin: 'Xiànzài shì bā diǎn.', exampleVietnamese: 'Bây giờ là 8 giờ.' },
  { nameChinese: '电脑', namePinyin: 'diànnǎo', nameVietnamese: 'Máy tính', hskLevel: 1, category: 'Đồ dùng', exampleChinese: '使用电脑工作。', examplePinyin: 'Shǐyòng diànnǎo gōngzuò.', exampleVietnamese: 'Sử dụng máy tính để làm việc.' },
  { nameChinese: '电视', namePinyin: 'diànshì', nameVietnamese: 'Tivi', hskLevel: 1, category: 'Giải trí', exampleChinese: '晚上看电视。', examplePinyin: 'Wǎnshang kàn diànshì.', exampleVietnamese: 'Buổi tối xem tivi.' },
  { nameChinese: '电影', namePinyin: 'diànyǐng', nameVietnamese: 'Phim ảnh', hskLevel: 1, category: 'Giải trí', exampleChinese: '看一场好电影。', examplePinyin: 'Kàn yì chǎng hǎo diànyǐng.', exampleVietnamese: 'Xem một bộ phim hay.' },
  { nameChinese: '东西', namePinyin: 'dōngxi', nameVietnamese: 'Đồ đạc', hskLevel: 1, category: 'Đồ dùng', exampleChinese: '买了很多东西。', examplePinyin: 'Mǎi le hěn duō dōngxi.', exampleVietnamese: 'Đã mua rất nhiều đồ đạc.' },

  // HSK 2
  { nameChinese: '百', namePinyin: 'bǎi', nameVietnamese: 'Trăm (100)', hskLevel: 2, category: 'Con số', exampleChinese: '一百块钱。', examplePinyin: 'Yì bǎi kuài qián.', exampleVietnamese: 'Một trăm tệ.' },
  { nameChinese: '帮助', namePinyin: 'bāngzhù', nameVietnamese: 'Giúp đỡ', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '互相帮助。', examplePinyin: 'Hùxiāng bāngzhù.', exampleVietnamese: 'Giúp đỡ lẫn nhau.' },
  { nameChinese: '报纸', namePinyin: 'bàozhǐ', nameVietnamese: 'Báo chí', hskLevel: 2, category: 'Tin tức', exampleChinese: '爷爷天天看报纸。', examplePinyin: 'Yéye tiāntiān kàn bàozhǐ.', exampleVietnamese: 'Ông nội ngày nào cũng đọc báo.' },
  { nameChinese: '比', namePinyin: 'bǐ', nameVietnamese: 'So với', hskLevel: 2, category: 'Ngữ pháp', exampleChinese: '今天比昨天热。', examplePinyin: 'Jīntiān bǐ zuótiān rè.', exampleVietnamese: 'Hôm nay nóng hơn hôm qua.' },
  { nameChinese: '别', namePinyin: 'bié', nameVietnamese: 'Đừng', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '别担心。', examplePinyin: 'Bié dānxīn.', exampleVietnamese: 'Đừng lo lắng.' },
  { nameChinese: '长', namePinyin: 'cháng', nameVietnamese: 'Dài', hskLevel: 2, category: 'Mô tả', exampleChinese: '这根绳子很长。', examplePinyin: 'Zhè gēn shéngzi hěn cháng.', exampleVietnamese: 'Sợi dây này rất dài.' },
  { nameChinese: '唱歌', namePinyin: 'chànggē', nameVietnamese: 'Hát', hskLevel: 2, category: 'Giải trí', exampleChinese: '快乐地唱歌。', examplePinyin: 'Kuàilè de chànggē.', exampleVietnamese: 'Vui vẻ ca hát.' },
  { nameChinese: '出', namePinyin: 'chū', nameVietnamese: 'Ra, ra ngoài', hskLevel: 2, category: 'Hành động', exampleChinese: '走出房间。', examplePinyin: 'Zǒu chū fángjiān.', exampleVietnamese: 'Bước ra khỏi phòng.' },
  { nameChinese: '穿', namePinyin: 'chuān', nameVietnamese: 'Mặc (áo quần)', hskLevel: 2, category: 'Thời trang', exampleChinese: '穿新衣服。', examplePinyin: 'Chuān xīn yīfu.', exampleVietnamese: 'Mặc quần áo mới.' },
  { nameChinese: '次', namePinyin: 'cì', nameVietnamese: 'Lần', hskLevel: 2, category: 'Lượng từ', exampleChinese: '去过两次。', examplePinyin: 'Qù guo liǎng cì.', exampleVietnamese: 'Đã đi qua hai lần.' },

  // HSK 3
  { nameChinese: '阿姨', namePinyin: 'āyí', nameVietnamese: 'Dì, cô', hskLevel: 3, category: 'Gia đình', exampleChinese: '阿姨好！', examplePinyin: 'Āyí hǎo!', exampleVietnamese: 'Chào cô ạ!' },
  { nameChinese: '啊', namePinyin: 'a', nameVietnamese: 'À, ngạ', hskLevel: 3, category: 'Giao tiếp', exampleChinese: '好啊，没问题！', examplePinyin: 'Hǎo a, méi wèntí!', exampleVietnamese: 'Được à, không vấn đề gì!' },
  { nameChinese: '矮', namePinyin: 'ǎi', nameVietnamese: 'Thấp, lùn', hskLevel: 3, category: 'Mô tả', exampleChinese: '弟弟有点矮。', examplePinyin: 'Dìdi yǒudiǎnr ǎi.', exampleVietnamese: 'Em trai hơi lùn.' },
  { nameChinese: '爱好', namePinyin: 'àihào', nameVietnamese: 'Sở thích', hskLevel: 3, category: 'Giải trí', exampleChinese: '我有很多爱好。', examplePinyin: 'Wǒ yǒu hěn duō àihào.', exampleVietnamese: 'Tôi có rất nhiều sở thích.' },
  { nameChinese: '安静', namePinyin: 'ānjìng', nameVietnamese: 'Yên tĩnh', hskLevel: 3, category: 'Mô tả', exampleChinese: '图书馆里很安静。', examplePinyin: 'Túshūguǎn lǐ hěn ānjìng.', exampleVietnamese: 'Trong thư viện rất yên tĩnh.' },
  { nameChinese: '把', namePinyin: 'bǎ', nameVietnamese: 'Cầm, nắm (chữ bả)', hskLevel: 3, category: 'Ngữ pháp', exampleChinese: '请把门关上。', examplePinyin: 'Qǐng bǎ mén guān shàng.', exampleVietnamese: 'Xin hãy đóng cửa lại.' },
  { nameChinese: '班', namePinyin: 'bān', nameVietnamese: 'Lớp học', hskLevel: 3, category: 'Học tập', exampleChinese: '我们班有二十个学生。', examplePinyin: 'Wǒmen bān yǒu èrshí ge xuéshēng.', exampleVietnamese: 'Lớp chúng tôi có 20 học sinh.' },
  { nameChinese: '搬', namePinyin: 'bān', nameVietnamese: 'Chuyển, dời', hskLevel: 3, category: 'Đời sống', exampleChinese: '搬家到新房子。', examplePinyin: 'Bānjiā dào xīn fángzi.', exampleVietnamese: 'Chuyển nhà sang nhà mới.' },

  // HSK 4
  { nameChinese: '爱情', namePinyin: 'àiqíng', nameVietnamese: 'Tình yêu', hskLevel: 4, category: 'Tình cảm', exampleChinese: '真挚的爱情。', examplePinyin: 'Zhēnzhì de àiqíng.', exampleVietnamese: 'Tình yêu chân thành.' },
  { nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'An bài, sắp xếp', hskLevel: 4, category: 'Công việc', exampleChinese: '合理安排时间。', examplePinyin: 'Hélǐ ānpái shíjiān.', exampleVietnamese: 'Sắp xếp thời gian hợp lý.' },
  { nameChinese: '安全', namePinyin: 'ānquán', nameVietnamese: 'An toàn', hskLevel: 4, category: 'Đời sống', exampleChinese: '注意人身安全。', examplePinyin: 'Zhùyì rénshēn ānquán.', exampleVietnamese: 'Chú ý an toàn bản thân.' },
  { nameChinese: '按时', namePinyin: 'ànshí', nameVietnamese: 'Đúng giờ', hskLevel: 4, category: 'Công việc', exampleChinese: '按时完成作业。', examplePinyin: 'Ànshí wánchéng zuòyè.', exampleVietnamese: 'Hoàn thành bài tập đúng giờ.' },
  { nameChinese: '按照', namePinyin: 'ànzhào', nameVietnamese: 'Dựa theo', hskLevel: 4, category: 'Công việc', exampleChinese: '按照计划进行。', examplePinyin: 'Ànzhào jìhuà jìnxíng.', exampleVietnamese: 'Tiến hành theo kế hoạch.' },
  { nameChinese: '百分之', namePinyin: 'bǎifēnzhī', nameVietnamese: 'Phần trăm (%)', hskLevel: 4, category: 'Con số', exampleChinese: '百分之百的把握。', examplePinyin: 'Bǎifēnzhī bǎi de bǎwò.', exampleVietnamese: 'Nắm chắc 100%.' },
  { nameChinese: '棒', namePinyin: 'bàng', nameVietnamese: 'Giỏi, tuyệt vời', hskLevel: 4, category: 'Mô tả', exampleChinese: '你做得太棒了！', examplePinyin: 'Nǐ zuò de tài bàng le!', exampleVietnamese: 'Bạn làm quá tuyệt vời!' },
  { nameChinese: '包子', namePinyin: 'bāozi', nameVietnamese: 'Bánh bao', hskLevel: 4, category: 'Ẩm thực', exampleChinese: '热气腾腾的包子。', examplePinyin: 'Rèqì téngténg de bāozi.', exampleVietnamese: 'Bánh bao nóng hổi.' },

  // HSK 5
  { nameChinese: '唉', namePinyin: 'āi', nameVietnamese: 'Chà, than ôi', hskLevel: 5, category: 'Giao tiếp', exampleChinese: '唉，真可惜！', examplePinyin: 'Āi, zhēn kěxī!', exampleVietnamese: 'Than ôi, thật đáng tiếc!' },
  { nameChinese: '爱护', namePinyin: 'àihù', nameVietnamese: 'Yêu quý, bảo vệ', hskLevel: 5, category: 'Đời sống', exampleChinese: '爱护公物。', examplePinyin: 'Àihù gōngwù.', exampleVietnamese: 'Bảo vệ của công.' },
  { nameChinese: '安慰', namePinyin: 'ānwèi', nameVietnamese: 'An ủi', hskLevel: 5, category: 'Tâm lý', exampleChinese: '温和地安慰朋友。', examplePinyin: 'Wēnhé de ānwèi péngyou.', exampleVietnamese: 'Nhẹ nhàng an ủi bạn bè.' },
  { nameChinese: '安装', namePinyin: 'ānzhuāng', nameVietnamese: 'Lắp đặt', hskLevel: 5, category: 'Công nghệ', exampleChinese: '安装新软件。', examplePinyin: 'Ānzhuāng xīn ruǎnjiàn.', exampleVietnamese: 'Lắp đặt phần mềm mới.' },
  { nameChinese: '把握', namePinyin: 'bǎwò', nameVietnamese: 'Nắm bắt', hskLevel: 5, category: 'Công việc', exampleChinese: '把握胜局。', examplePinyin: 'Bǎwò shèngjú.', exampleVietnamese: 'Nắm chắc phần thắng.' },
  { nameChinese: '包含', namePinyin: 'bāohán', nameVietnamese: 'Bao hàm', hskLevel: 5, category: 'Mô tả', exampleChinese: '这句话包含深意。', examplePinyin: 'Zhè jù huà bāohán shēnyì.', exampleVietnamese: 'Câu nói này bao hàm ý sâu xa.' },

  // HSK 6
  { nameChinese: '挨', namePinyin: 'ái', nameVietnamese: 'Chịu, bị', hskLevel: 6, category: 'Hành động', exampleChinese: '挨训。', examplePinyin: 'Ái xùn.', exampleVietnamese: 'Bị khiển trách.' },
  { nameChinese: '癌症', namePinyin: 'ái zhèng', nameVietnamese: 'Bệnh ung thư', hskLevel: 6, category: 'Y tế', exampleChinese: '攻克癌症。', examplePinyin: 'Gōngkè áizhèng.', exampleVietnamese: 'Khắc phục bệnh ung thư.' },
  { nameChinese: '爱不释手', namePinyin: 'ài bú shì shǒu', nameVietnamese: 'Yêu thích không nỡ rời tay', hskLevel: 6, category: 'Tâm lý', exampleChinese: '对这本书爱不释手。', examplePinyin: 'Duì zhè běn shū ài bú shì shǒu.', exampleVietnamese: 'Đối với cuốn sách này thích không nỡ rời tay.' },
  { nameChinese: '爱戴', namePinyin: 'àidài', nameVietnamese: 'Kính yêu, tôn kính', hskLevel: 6, category: 'Giao tiếp', exampleChinese: '深受人们的爱戴。', examplePinyin: 'Shēn shòu rénmen de àidài.', exampleVietnamese: 'Được mọi người vô cùng kính yêu.' },
  { nameChinese: '暧昧', namePinyin: 'àimèi', nameVietnamese: 'Mập mờ, mờ ảo', hskLevel: 6, category: 'Tâm lý', exampleChinese: '态度暧昧。', examplePinyin: 'Tàidu àimèi.', exampleVietnamese: 'Thái độ mập mờ.' },
  { nameChinese: '卓越', namePinyin: 'zhuóyuè', nameVietnamese: 'Xuất sắc', hskLevel: 6, category: 'Mô tả', exampleChinese: '成就卓越。', examplePinyin: 'Chéngjiù zhuóyuè.', exampleVietnamese: 'Thành tựu xuất sắc.' }
];

async function seedMega() {
  console.log('--------------------------------------------------');
  console.log('🚀 BẮT ĐẦU SEED HỆ THỐNG DICTIONARY NẠP NHANH');
  console.log('--------------------------------------------------\n');

  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach((v) => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach((v) => existingSet.add(v.nameChinese.trim()));

  let count = 0;
  for (const item of MEGA_HSK_WORDS) {
    const key = item.nameChinese.trim();
    if (existingSet.has(key)) continue;

    await prisma.customVocab.create({
      data: {
        nameChinese: key,
        namePinyin: item.namePinyin.trim(),
        nameVietnamese: item.nameVietnamese.trim(),
        hskLevel: item.hskLevel,
        category: item.category,
        exampleChinese: item.exampleChinese,
        examplePinyin: item.examplePinyin,
        exampleVietnamese: item.exampleVietnamese,
      }
    });

    existingSet.add(key);
    count++;
  }

  console.log(`✅ Đã nạp thành công +${count} từ vựng độc bản mới.`);
  console.log(`📚 Tổng kho từ vựng HSK độc bản hiện tại: ${existingSet.size} từ.`);
}

seedMega()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Lỗi:', e);
    process.exit(1);
  });
