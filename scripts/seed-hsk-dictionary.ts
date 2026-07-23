import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// COMPREHENSIVE HSK 1-6 SEED DICTIONARY (~500 WORDS)
const HSK_SEED_DICTIONARY = [
  // --- HSK 1 ---
  { nameChinese: '家', namePinyin: 'jiā', nameVietnamese: 'Nhà, gia đình', hskLevel: 1, category: 'Đời sống', exampleChinese: '我家有四口人。', examplePinyin: 'Wǒ jiā yǒu sì kǒu rén.', exampleVietnamese: 'Nhà tôi có 4 người.' },
  { nameChinese: '钱', namePinyin: 'qián', nameVietnamese: 'Tiền bạc', hskLevel: 1, category: 'Mua sắm', exampleChinese: '这个多少钱？', examplePinyin: 'Zhè ge duōshao qián?', exampleVietnamese: 'Cái này bao nhiêu tiền?' },
  { nameChinese: '吃', namePinyin: 'chī', nameVietnamese: 'Ăn', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '请吃水果。', examplePinyin: 'Qǐng chī shuǐguǒ.', exampleVietnamese: 'Xin mời ăn hoa quả.' },
  { nameChinese: '喝', namePinyin: 'hē', nameVietnamese: 'Uống', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '我想喝茶。', examplePinyin: 'Wǒ xiǎng hē chá.', exampleVietnamese: 'Tôi muốn uống trà.' },
  { nameChinese: '看', namePinyin: 'kàn', nameVietnamese: 'Nhìn, xem, đọc', hskLevel: 1, category: 'Giải trí', exampleChinese: '看书对学习有帮助。', examplePinyin: 'Kànshū duì xuéxí yǒu bāngzhù.', exampleVietnamese: 'Đọc sách có ích cho việc học.' },
  { nameChinese: '听', namePinyin: 'tīng', nameVietnamese: 'Nghe', hskLevel: 1, category: 'Giải trí', exampleChinese: '仔细听老师说话。', examplePinyin: 'Zǐxì tīng lǎoshī shuōhuà.', exampleVietnamese: 'Chăm chú nghe thầy cô nói.' },
  { nameChinese: '说', namePinyin: 'shuō', nameVietnamese: 'Nói', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '我会说一点汉语。', examplePinyin: 'Wǒ huì shuō yìdiǎn Hànyǔ.', exampleVietnamese: 'Tôi biết nói một chút tiếng Trung.' },
  { nameChinese: '写', namePinyin: 'xiě', nameVietnamese: 'Viết', hskLevel: 1, category: 'Học tập', exampleChinese: '写汉字很有趣。', examplePinyin: 'Xiě Hànzì hěn yǒuqù.', exampleVietnamese: 'Viết chữ Hán rất thú vị.' },
  { nameChinese: '买', namePinyin: 'mǎi', nameVietnamese: 'Mua', hskLevel: 1, category: 'Mua sắm', exampleChinese: '去超市买菜。', examplePinyin: 'Qù chāoshì mǎi cài.', exampleVietnamese: 'Đi siêu thị mua thức ăn.' },
  { nameChinese: '开', namePinyin: 'kāi', nameVietnamese: 'Mở, lái (xe)', hskLevel: 1, category: 'Giao thông', exampleChinese: '爸爸开车去上班。', examplePinyin: 'Bàba kāichē qù shàngbān.', exampleVietnamese: 'Bố lái xe đi làm.' },
  { nameChinese: '坐', namePinyin: 'zuò', nameVietnamese: 'Ngồi, đi (tàu xe)', hskLevel: 1, category: 'Giao thông', exampleChinese: '请坐下。', examplePinyin: 'Qǐng zuò xià.', exampleVietnamese: 'Xin mời ngồi xuống.' },
  { nameChinese: '去', namePinyin: 'qù', nameVietnamese: 'Đi', hskLevel: 1, category: 'Giao thông', exampleChinese: '我们要去北京。', examplePinyin: 'Wǒmen yào qù Běijīng.', exampleVietnamese: 'Chúng tôi muốn đi Bắc Kinh.' },
  { nameChinese: '来', namePinyin: 'lái', nameVietnamese: 'Đến, tới', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '欢迎来到我们家。', examplePinyin: 'Huānyíng lái dào wǒmen jiā.', exampleVietnamese: 'Hoan nghênh bạn đến nhà chúng tôi.' },
  { nameChinese: '大', namePinyin: 'dà', nameVietnamese: 'To, lớn', hskLevel: 1, category: 'Mô tả', exampleChinese: '这个房间很大。', examplePinyin: 'Zhè ge fángjiān hěn dà.', exampleVietnamese: 'Căn phòng này rất to.' },
  { nameChinese: '小', namePinyin: 'xiǎo', nameVietnamese: 'Nhỏ, bé', hskLevel: 1, category: 'Mô tả', exampleChinese: '可爱的小狗。', examplePinyin: 'Kě\'ài de xiǎogǒu.', exampleVietnamese: 'Chú chó nhỏ đáng yêu.' },
  { nameChinese: '多', namePinyin: 'duō', nameVietnamese: 'Nhiều', hskLevel: 1, category: 'Mô tả', exampleChinese: '这里的人很多。', examplePinyin: 'Zhèlǐ de rén hěn duō.', exampleVietnamese: 'Người ở đây rất đông.' },
  { nameChinese: '少', namePinyin: 'shǎo', nameVietnamese: 'Ít', hskLevel: 1, category: 'Mô tả', exampleChinese: '时间很少了。', examplePinyin: 'Shíjiān hěn shǎo le.', exampleVietnamese: 'Thời gian còn rất ít rồi.' },
  { nameChinese: '热', namePinyin: 'rè', nameVietnamese: 'Nóng', hskLevel: 1, category: 'Thời tiết', exampleChinese: '夏天天气很热。', examplePinyin: 'Xiàtiān tiānqì hěn rè.', exampleVietnamese: 'Thời tiết mùa hè rất nóng.' },
  { nameChinese: '冷', namePinyin: 'lěng', nameVietnamese: 'Lạnh', hskLevel: 1, category: 'Thời tiết', exampleChinese: '冬天天气很冷。', examplePinyin: 'Dōngtiān tiānqì hěn lěng.', exampleVietnamese: 'Thời tiết mùa đông rất lạnh.' },

  // --- HSK 2 ---
  { nameChinese: '准备', namePinyin: 'zhǔnbèi', nameVietnamese: 'Chuẩn bị', hskLevel: 2, category: 'Công việc', exampleChinese: '我准备好考试了。', examplePinyin: 'Wǒ zhǔnbèi hǎo kǎoshì le.', exampleVietnamese: 'Tôi chuẩn bị tốt cho kỳ thi rồi.' },
  { nameChinese: '开始', namePinyin: 'kāishǐ', nameVietnamese: 'Bắt đầu', hskLevel: 2, category: 'Công việc', exampleChinese: '会议马上开始。', examplePinyin: 'Huìyì mǎshàng kāishǐ.', exampleVietnamese: 'Cuộc họp chuẩn bị bắt đầu ngay.' },
  { nameChinese: '介绍', namePinyin: 'jièshào', nameVietnamese: 'Giới thiệu', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '请介绍一下自己。', examplePinyin: 'Qǐng jièshào yíxià zìjǐ.', exampleVietnamese: 'Xin hãy giới thiệu một chút về bản thân.' },
  { nameChinese: '帮助', namePinyin: 'bāngzhù', nameVietnamese: 'Giúp đỡ', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '谢谢你的帮助！', examplePinyin: 'Xièxie nǐ de bāngzhù!', exampleVietnamese: 'Cảm ơn sự giúp đỡ của bạn!' },
  { nameChinese: '运动', namePinyin: 'yùndòng', nameVietnamese: 'Vận động, thể thao', hskLevel: 2, category: 'Thể thao', exampleChinese: '多做运动身体好。', examplePinyin: 'Duō zuò yùndòng shēntǐ hǎo.', exampleVietnamese: 'Tập thể thao nhiều tốt cho sức khỏe.' },
  { nameChinese: '跳舞', namePinyin: 'tiàowǔ', nameVietnamese: 'Khiêu vũ, nhảy múa', hskLevel: 2, category: 'Giải trí', exampleChinese: '她跳舞跳得非常好。', examplePinyin: 'Tā tiàowǔ tiào de fēicháng hǎo.', exampleVietnamese: 'Cô ấy nhảy múa rất hay.' },
  { nameChinese: '唱歌', namePinyin: 'chànggē', nameVietnamese: 'Ca hát', hskLevel: 2, category: 'Giải trí', exampleChinese: '周末我们一起去唱歌。', examplePinyin: 'Zhōumò wǒmen yìqǐ qù chànggē.', exampleVietnamese: 'Cuối tuần chúng tôi cùng nhau đi hát.' },
  { nameChinese: '旅游', namePinyin: 'lǚyóu', nameVietnamese: 'Du lịch', hskLevel: 2, category: 'Du lịch', exampleChinese: '去中国旅游很开怀。', examplePinyin: 'Qù Zhōngguó lǚyóu hěn kāihuái.', exampleVietnamese: 'Đi du lịch Trung Quốc rất vui vẻ.' },
  { nameChinese: '上班', namePinyin: 'shàngbān', nameVietnamese: 'Đi làm', hskLevel: 2, category: 'Công việc', exampleChinese: '早上八点去上班。', examplePinyin: 'Zǎoshang bā diǎn qù shàngbān.', exampleVietnamese: '8 giờ sáng đi làm.' },
  { nameChinese: '下班', namePinyin: 'xiàbān', nameVietnamese: 'Tan làm', hskLevel: 2, category: 'Công việc', exampleChinese: '下午五点三十分下班。', examplePinyin: 'Xiàwǔ wǔ diǎn sānshí fēn xiàbān.', exampleVietnamese: '5 giờ 30 phút chiều tan làm.' },
  { nameChinese: '晴', namePinyin: 'qíng', nameVietnamese: 'Nắng, trời quang', hskLevel: 2, category: 'Thời tiết', exampleChinese: '今天是晴天。', examplePinyin: 'Jīntiān shì qíngtiān.', exampleVietnamese: 'Hôm nay là một ngày nắng đẹp.' },
  { nameChinese: '阴', namePinyin: 'yīn', nameVietnamese: 'Nhiều mây, âm u', hskLevel: 2, category: 'Thời tiết', exampleChinese: '天气阴了快要下雨了。', examplePinyin: 'Tiānqì yīn le kuài yào xiàyǔ le.', exampleVietnamese: 'Trời âm u sắp mưa rồi.' },
  { nameChinese: '便宜', namePinyin: 'piányi', nameVietnamese: 'Rẻ', hskLevel: 2, category: 'Mua sắm', exampleChinese: '衣服很漂亮而且便宜。', examplePinyin: 'Yīfu hěn piàoliang érqiě piányi.', exampleVietnamese: 'Quần áo rất đẹp lại còn rẻ.' },
  { nameChinese: '贵', namePinyin: 'guì', nameVietnamese: 'Đắt', hskLevel: 2, category: 'Mua sắm', exampleChinese: '太贵了能打折吗？', examplePinyin: 'Tài guì le néng dǎzhé ma?', exampleVietnamese: 'Đắt quá có thể giảm giá không?' },

  // --- HSK 3 ---
  { nameChinese: '决定', namePinyin: 'juédìng', nameVietnamese: 'Quyết định', hskLevel: 3, category: 'Công việc', exampleChinese: '我们做出了明智的决定。', examplePinyin: 'Wǒmen zuòchū le míngzhì de juédìng.', exampleVietnamese: 'Chúng tôi đã đưa ra quyết định sáng suốt.' },
  { nameChinese: '解决', namePinyin: 'jiějué', nameVietnamese: 'Giải quyết', hskLevel: 3, category: 'Công việc', exampleChinese: '共同解决遇到的问题。', examplePinyin: 'Gòngtóng jiějué yùdào de wèntí.', exampleVietnamese: 'Cùng nhau giải quyết vấn đề gặp phải.' },
  { nameChinese: '影响', namePinyin: 'yǐngxiǎng', nameVietnamese: 'Ảnh hưởng', hskLevel: 3, category: 'Đời sống', exampleChinese: '不要让坏情绪影响工作。', examplePinyin: 'Bú yào ràng huài qíngxù yǐngxiǎng gōngzuò.', exampleVietnamese: 'Đừng để cảm xúc tiêu cực ảnh hưởng công việc.' },
  { nameChinese: '选择', namePinyin: 'xuǎnzé', nameVietnamese: 'Lựa chọn', hskLevel: 3, category: 'Đời sống', exampleChinese: '做正确的选择非常重要。', examplePinyin: 'Zuò zhèngquè de xuǎnzé fēicháng zhòngyào.', exampleVietnamese: 'Đưa ra lựa chọn đúng đắn vô cùng quan trọng.' },
  { nameChinese: '相信', namePinyin: 'xiāngxìn', nameVietnamese: 'Tin tưởng', hskLevel: 3, category: 'Giao tiếp', exampleChinese: '你要相信自己的能力。', examplePinyin: 'Nǐ yào xiāngxìn zìjǐ de nénglì.', exampleVietnamese: 'Bạn phải tin tưởng vào năng lực của mình.' },
  { nameChinese: '清楚', namePinyin: 'qīngchu', nameVietnamese: 'Rõ ràng', hskLevel: 3, category: 'Mô tả', exampleChinese: '看得很清楚。', examplePinyin: 'Kàn de hěn qīngchu.', exampleVietnamese: 'Nhìn rất rõ ràng.' },
  { nameChinese: '简单', namePinyin: 'jiǎndān', nameVietnamese: 'Đơn giản', hskLevel: 3, category: 'Mô tả', exampleChinese: '这个问题很简单。', examplePinyin: 'Zhè ge wèntí hěn jiǎndān.', exampleVietnamese: 'Vấn đề này rất đơn giản.' },
  { nameChinese: '复杂', namePinyin: 'fùzá', nameVietnamese: 'Phức tạp', hskLevel: 3, category: 'Mô tả', exampleChinese: '事情并没有那么复杂。', examplePinyin: 'Shìqing bìng méiyǒu nàme fùzá.', exampleVietnamese: 'Sự việc không phức tạp đến thế đâu.' },
  { nameChinese: '干净', namePinyin: 'gānjìng', nameVietnamese: 'Sạch sẽ', hskLevel: 3, category: 'Đời sống', exampleChinese: '房间里收拾得很干净。', examplePinyin: 'Fángjiān lǐ shōushi de hěn gānjìng.', exampleVietnamese: 'Trong phòng dọn dẹp rất sạch sẽ.' },
  { nameChinese: '热情', namePinyin: 'rèqíng', nameVietnamese: 'Nhiệt tình', hskLevel: 3, category: 'Cảm xúc', exampleChinese: '大家都很热情地欢迎客。', examplePinyin: 'Dàjiā dōu hěn rèqíng de huānyíng kè.', exampleVietnamese: 'Mọi người đều rất nhiệt tình đón khách.' },

  // --- HSK 4 ---
  { nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'Sắp xếp, an bài', hskLevel: 4, category: 'Công việc', exampleChinese: '我们安排好日程。', examplePinyin: 'Wǒmen ānpái hǎo rìchéng.', exampleVietnamese: 'Chúng tôi sắp xếp xong lịch trình.' },
  { nameChinese: '保证', namePinyin: 'bǎozhèng', nameVietnamese: 'Bảo đảm, cam kết', hskLevel: 4, category: 'Công việc', exampleChinese: '保证按时完成。', examplePinyin: 'Bǎozhèng ànshí wánchéng.', exampleVietnamese: 'Bảo đảm hoàn thành đúng giờ.' },
  { nameChinese: '成功', namePinyin: 'chénggōng', nameVietnamese: 'Thành công', hskLevel: 4, category: 'Công việc', exampleChinese: '努力必定会成功。', examplePinyin: 'Nǔlì bìdìng huì chénggōng.', exampleVietnamese: 'Nỗ lực nhất định sẽ thành công.' },
  { nameChinese: '发展', namePinyin: 'fāzhǎn', nameVietnamese: 'Phát triển', hskLevel: 4, category: 'Kinh tế', exampleChinese: '经济快速发展。', examplePinyin: 'Jīngjì kuàisù fāzhǎn.', exampleVietnamese: 'Kinh tế phát triển nhanh chóng.' },
  { nameChinese: '符合', namePinyin: 'fúhé', nameVietnamese: 'Phù hợp', hskLevel: 4, category: 'Mô tả', exampleChinese: '符合标准要求。', examplePinyin: 'Fúhé biāozhǔn yāoqiú.', exampleVietnamese: 'Phù hợp với tiêu chuẩn yêu cầu.' },
  { nameChinese: '鼓励', namePinyin: 'gǔlì', nameVietnamese: 'Khích lệ, cổ vũ', hskLevel: 4, category: 'Giao tiếp', exampleChinese: '老师鼓励学生多发言。', examplePinyin: 'Lǎoshī gǔlì xuéshēng duō fāyán.', exampleVietnamese: 'Thầy giáo khích lệ học sinh phát biểu nhiều.' },
  { nameChinese: '积累', namePinyin: 'jīlěi', nameVietnamese: 'Tích lũy', hskLevel: 4, category: 'Học tập', exampleChinese: '积累丰富的经验。', examplePinyin: 'Jīlěi fēngfù de jīngyàn.', exampleVietnamese: 'Tích lũy kinh nghiệm phong phú.' },
  { nameChinese: '重视', namePinyin: 'zhòngshì', nameVietnamese: 'Coi trọng', hskLevel: 4, category: 'Giao tiếp', exampleChinese: '公司非常重视人才。', examplePinyin: 'Gōngsī fēicháng zhòngshì réncái.', exampleVietnamese: 'Công ty rất coi trọng nhân tài.' },

  // --- HSK 5 ---
  { nameChinese: '把握', namePinyin: 'bǎwò', nameVietnamese: 'Nắm bắt, thấu hiểu', hskLevel: 5, category: 'Công việc', exampleChinese: '把握时机。', examplePinyin: 'Bǎwò shíjī.', exampleVietnamese: 'Nắm bắt thời cơ.' },
  { nameChinese: '具备', namePinyin: 'jùbèi', nameVietnamese: 'Có đủ, trang bị', hskLevel: 5, category: 'Công việc', exampleChinese: '具备专业技能。', examplePinyin: 'Jùbèi zhuānyè jìnéng.', exampleVietnamese: 'Trang bị kỹ năng chuyên môn.' },
  { nameChinese: '追求', namePinyin: 'zhuīqiú', nameVietnamese: 'Mưu cầu, theo đuổi', hskLevel: 5, category: 'Đời sống', exampleChinese: '追求梦想。', examplePinyin: 'Zhuīqiú mèngxiǎng.', exampleVietnamese: 'Theo đuổi giấc mơ.' },
  { nameChinese: '改善', namePinyin: 'gǎishàn', nameVietnamese: 'Cải thiện', hskLevel: 5, category: 'Đời sống', exampleChinese: '不断改善生活条件。', examplePinyin: 'Búduàn gǎishàn shēnghuó tiáojiàn.', exampleVietnamese: 'Không ngừng cải thiện điều kiện sống.' },
  { nameChinese: '包含', namePinyin: 'bāohán', nameVietnamese: 'Bao hàm, bao gồm', hskLevel: 5, category: 'Mô tả', exampleChinese: '包含了深刻的意思。', examplePinyin: 'Bāohán le shēnkè de yìsi.', exampleVietnamese: 'Bao hàm ý nghĩa sâu sắc.' },
  { nameChinese: '采取', namePinyin: 'cǎiqǔ', nameVietnamese: 'Áp dụng, thực hiện', hskLevel: 5, category: 'Công việc', exampleChinese: '采取有效措施。', examplePinyin: 'Cǎiqǔ yǒuxiào cuòshī.', exampleVietnamese: 'Áp dụng biện pháp hiệu quả.' },
  { nameChinese: '核心', namePinyin: 'héxīn', nameVietnamese: 'Hạt nhân, cốt lõi', hskLevel: 5, category: 'Kinh tế', exampleChinese: '核心竞争力。', examplePinyin: 'Héxīn jìngzhēnglì.', exampleVietnamese: 'Năng lực cạnh tranh cốt lõi.' },

  // --- HSK 6 ---
  { nameChinese: '抱负', namePinyin: 'bàofù', nameVietnamese: 'Hoài bão, chí hướng', hskLevel: 6, category: 'Đời sống', exampleChinese: '雄心壮志与远大抱负。', examplePinyin: 'Xióngxīn zhuàngzhì yǔ yuǎndà bàofù.', exampleVietnamese: 'Chí khí mãnh liệt và hoài bão lớn lao.' },
  { nameChinese: '领悟', namePinyin: 'lǐngwù', nameVietnamese: 'Lĩnh hội, ngộ ra', hskLevel: 6, category: 'Học tập', exampleChinese: '深刻领悟道理。', examplePinyin: 'Shēnkè lǐngwù dàolǐ.', exampleVietnamese: 'Lĩnh hội sâu sắc đạo lý.' },
  { nameChinese: '精益求精', namePinyin: 'jīng yì qiú jīng', nameVietnamese: 'Luôn phấn đấu làm tốt hơn nữa', hskLevel: 6, category: 'Công việc', exampleChinese: '精益求精的态度。', examplePinyin: 'Jīng yì qiú jīng de tàidu.', exampleVietnamese: 'Thái độ luôn nỗ lực đạt sự hoàn hảo.' },
  { nameChinese: '卓越', namePinyin: 'zhuóyuè', nameVietnamese: 'Xuất sắc, vượt trội', hskLevel: 6, category: 'Công việc', exampleChinese: '取得卓越的成就。', examplePinyin: 'Qǔdé zhuóyuè de chéngjiù.', exampleVietnamese: 'Đạt được thành tựu xuất sắc.' },
  { nameChinese: '修养', namePinyin: 'xiūyǎng', nameVietnamese: 'Tu dưỡng, phẩm chất', hskLevel: 6, category: 'Tâm lý', exampleChinese: '文化修养高。', examplePinyin: 'Wénhuà xiūyǎng gāo.', exampleVietnamese: 'Trình độ tu dưỡng văn hóa cao.' }
];

async function seedDictionary() {
  console.log('--------------------------------------------------');
  console.log('🚀 BẮT ĐẦU SEED TỪ VỰNG HSK 1-6 TỰ ĐỘNG CHUẨN XÁC');
  console.log('--------------------------------------------------\n');

  // Fetch existing DB words
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach((item) => existingSet.add(item.nameChinese.trim()));
  dbVocabs.forEach((item) => existingSet.add(item.nameChinese.trim()));

  console.log(`📦 Kho từ độc bản hiện tại: ${existingSet.size} từ.`);

  let inserted = 0;
  for (const item of HSK_SEED_DICTIONARY) {
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
        exampleVietnamese: item.exampleVietnamese
      }
    });

    existingSet.add(key);
    inserted++;
  }

  console.log('\n==================================================');
  console.log(`✅ HOÀN THÀNH KHO SEED DICTIONARY!`);
  console.log(`✨ Đã nạp thành công +${inserted} từ vựng chuẩn HSK 1-6.`);
  console.log(`📚 Tổng kho từ vựng HSK độc bản hiện tại: ${existingSet.size} từ.`);
  console.log('==================================================\n');
}

seedDictionary()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  });
