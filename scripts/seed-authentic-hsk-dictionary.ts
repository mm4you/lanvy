import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// KHO TỪ VỰNG TIẾNG TRUNG CHUẨN TỪ ĐIỂN 100% (KHÔNG GHÉP CHỮ NGẪU NHIÊN)
const AUTHENTIC_HSK_VOCAB = [
  // HSK 1 - 2
  { nameChinese: '高兴', namePinyin: 'gāoxìng', nameVietnamese: 'Vui mừng', hskLevel: 1, category: 'Cảm xúc', exampleChinese: '认识你很高兴。', examplePinyin: 'Rènshi nǐ hěn gāoxìng.', exampleVietnamese: 'Rất vui được quen biết bạn.' },
  { nameChinese: '学习', namePinyin: 'xuéxí', nameVietnamese: 'Học tập', hskLevel: 1, category: 'Học tập', exampleChinese: '好好学习，天天向上。', examplePinyin: 'Hǎohǎo xuéxí, tiāntiān xiàngshàng.', exampleVietnamese: 'Học tập thật tốt, mỗi ngày vươn lên.' },
  { nameChinese: '准备', namePinyin: 'zhǔnbèi', nameVietnamese: 'Chuẩn bị', hskLevel: 2, category: 'Công việc', exampleChinese: '我们准备出发。', examplePinyin: 'Wǒmen zhǔnbèi chūfā.', exampleVietnamese: 'Chúng tôi chuẩn bị xuất phát.' },
  { nameChinese: '运动', namePinyin: 'yùndòng', nameVietnamese: 'Vận động, thể thao', hskLevel: 2, category: 'Thể thao', exampleChinese: '多做运动对身体好。', examplePinyin: 'Duō zuò yùndòng duì shēntǐ hǎo.', exampleVietnamese: 'Tập thể thao nhiều tốt cho sức khỏe.' },
  { nameChinese: '报纸', namePinyin: 'bàozhǐ', nameVietnamese: 'Tờ báo', hskLevel: 2, category: 'Đời sống', exampleChinese: '爸爸在看报纸。', examplePinyin: 'Bàba zài kàn bàozhǐ.', exampleVietnamese: 'Bố đang đọc báo.' },

  // HSK 3 - 4
  { nameChinese: '精彩', namePinyin: 'jīngcǎi', nameVietnamese: 'Đặc sắc, tuyệt vời', hskLevel: 3, category: 'Giải trí', exampleChinese: '这场比赛非常精彩。', examplePinyin: 'Zhè chǎng bǐsài fēicháng jīngcǎi.', exampleVietnamese: 'Trận đấu này rất đặc sắc.' },
  { nameChinese: '勇敢', namePinyin: 'yǒnggǎn', nameVietnamese: 'Dũng cảm', hskLevel: 3, category: 'Tâm lý', exampleChinese: '我们要勇敢面对困难。', examplePinyin: 'Wǒmen yào yǒnggǎn miànduì kùnnan.', exampleVietnamese: 'Chúng ta phải dũng cảm đối mặt khó khăn.' },
  { nameChinese: '积极', namePinyin: 'jījí', nameVietnamese: 'Tích cực', hskLevel: 4, category: 'Tâm lý', exampleChinese: '保持积极乐观的心态。', examplePinyin: 'Bǎochí jījí lèguān de xīntài.', exampleVietnamese: 'Giữ thái độ tích cực lạc quan.' },
  { nameChinese: '普遍', namePinyin: 'pǔbiàn', nameVietnamese: 'Phổ biến', hskLevel: 4, category: 'Mô tả', exampleChinese: '这是社会上的普遍现象。', examplePinyin: 'Zhè shì shèhuì shàng de pǔbiàn xiànxiàng.', exampleVietnamese: 'Đây là hiện tượng phổ biến trong xã hội.' },
  { nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'Sắp xếp, an bài', hskLevel: 4, category: 'Công việc', exampleChinese: '合理安排工作时间。', examplePinyin: 'Hélǐ ānpái gōngzuò shíjiān.', exampleVietnamese: 'Sắp xếp hợp lý thời gian làm việc.' },
  { nameChinese: '保证', namePinyin: 'bǎozhèng', nameVietnamese: 'Đảm bảo, cam kết', hskLevel: 4, category: 'Công việc', exampleChinese: '我保证按时完成任务。', examplePinyin: 'Wǒ bǎozhèng ànshí wánchéng rènwu.', exampleVietnamese: 'Tôi đảm bảo hoàn thành nhiệm vụ đúng giờ.' },

  // HSK 5 - 6
  { nameChinese: '把握', namePinyin: 'bǎwò', nameVietnamese: 'Nắm bắt', hskLevel: 5, category: 'Công việc', exampleChinese: '把握住千载难逢的机会。', examplePinyin: 'Bǎwò zhù qiānzǎinánféng de jīhuì.', exampleVietnamese: 'Nắm bắt cơ hội nghìn năm có một.' },
  { nameChinese: '具备', namePinyin: 'jùbèi', nameVietnamese: 'Có đủ, trang bị', hskLevel: 5, category: 'Công việc', exampleChinese: '具备丰富的专业知识。', examplePinyin: 'Jùbèi fēngfù de zhuānyè zhīshi.', exampleVietnamese: 'Có đủ kiến thức chuyên môn phong phú.' },
  { nameChinese: '精益求精', namePinyin: 'jīng yì qiú jīng', nameVietnamese: 'Luôn hoàn thiện tốt hơn', hskLevel: 6, category: 'Công việc', exampleChinese: '对待技术精益求精。', examplePinyin: 'Duìdài jìshù jīng yì qiú jīng.', exampleVietnamese: 'Đối với kỹ thuật luôn phấn đấu hoàn thiện tốt hơn.' },
  { nameChinese: '卓越', namePinyin: 'zhuóyuè', nameVietnamese: 'Xuất sắc, vượt trội', hskLevel: 6, category: 'Mô tả', exampleChinese: '取得了卓越的成就。', examplePinyin: 'Qǔdé le zhuóyuè de chéngjiù.', exampleVietnamese: 'Đạt được thành tựu xuất sắc.' },

  // HSK 7 - 9 (Nâng Cao & Thành Ngữ)
  { nameChinese: '融会贯通', namePinyin: 'róng huì guàn tōng', nameVietnamese: 'Hội tụ và thông suốt', hskLevel: 7, category: 'Học tập', exampleChinese: '把知识融会贯通。', examplePinyin: 'Bǎ zhīshi róng huì guàn tōng.', exampleVietnamese: 'Thấu hiểu hội tụ thông suốt kiến thức.' },
  { nameChinese: '博大精深', namePinyin: 'bó dà jīng shēn', nameVietnamese: 'Bác đại tinh thâm', hskLevel: 8, category: 'Văn hóa', exampleChinese: '中华文化博大精深。', examplePinyin: 'Zhōnghuá wénhuà bó dà jīng shēn.', exampleVietnamese: 'Văn hóa Trung Hoa bác đại tinh thâm.' },
  { nameChinese: '厚积薄发', namePinyin: 'hòu jī bó fā', nameVietnamese: 'Tích lũy sâu rộng bùng nổ mạnh mẽ', hskLevel: 9, category: 'Công việc', exampleChinese: '经过多年的厚积薄发。', examplePinyin: 'Jīngguò duōnián de hòu jī bó fā.', exampleVietnamese: 'Trải qua nhiều năm tích lũy bùng nổ mạnh mẽ.' }
];

async function seedAuthenticOnly() {
  console.log('⚡==================================================⚡');
  console.log('🚀 NẠP TỪ VỰNG CHUẨN TỪ ĐIỂN TIẾNG TRUNG 100%');
  console.log('⚡==================================================⚡\n');

  const start = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  let added = 0;
  for (const item of AUTHENTIC_HSK_VOCAB) {
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

  const duration = ((Date.now() - start) / 1000).toFixed(2);
  console.log('==================================================');
  console.log(`🎉 NẠP THÀNH CÔNG RỰC RỠ TRONG ${duration} GIÂY!`);
  console.log(`✨ ĐÃ NẠP THÊM: +${added} TỪ VỰNG CHUẨN TỪ ĐIỂN!`);
  console.log(`📚 TỔNG KHO TỪ VỰNG HSK CHUẨN XÁC BÂY GIỜ LÀ: ${existingSet.size} TỪ.`);
  console.log('==================================================\n');
}

seedAuthenticOnly().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
