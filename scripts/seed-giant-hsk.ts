import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// BỘ TỪ VỰNG HSK 1-6 KHỔNG LỒ (HÀNG TRĂM TỪ VỰNG CHUẨN XÁC)
const GIANT_HSK_DICTIONARY = [
  // --- HSK 1 ---
  { nameChinese: '爱', namePinyin: 'ài', nameVietnamese: 'Yêu, thích', hskLevel: 1, category: 'Tình cảm', exampleChinese: '我爱我的家。', examplePinyin: 'Wǒ ài wǒ de jiā.', exampleVietnamese: 'Tôi yêu gia đình tôi.' },
  { nameChinese: '八', namePinyin: 'bā', nameVietnamese: 'Số 8', hskLevel: 1, category: 'Con số', exampleChinese: '八个人。', examplePinyin: 'Bā ge rén.', exampleVietnamese: '8 người.' },
  { nameChinese: '爸爸', namePinyin: 'bàba', nameVietnamese: 'Bố, ba', hskLevel: 1, category: 'Gia đình', exampleChinese: '爸爸工作很忙。', examplePinyin: 'Bàba gōngzuò hěn máng.', exampleVietnamese: 'Bố công việc rất bận.' },
  { nameChinese: '杯子', namePinyin: 'bēizi', nameVietnamese: 'Cái cốc', hskLevel: 1, category: 'Đồ dùng', exampleChinese: '喝水用杯子。', examplePinyin: 'Hē shuǐ yòng bēizi.', exampleVietnamese: 'Uống nước dùng cái cốc.' },
  { nameChinese: '北京', namePinyin: 'Běijīng', nameVietnamese: 'Bắc Kinh', hskLevel: 1, category: 'Địa danh', exampleChinese: '北京很漂亮。', examplePinyin: 'Běijīng hěn piàoliang.', exampleVietnamese: 'Bắc Kinh rất đẹp.' },
  { nameChinese: '本', namePinyin: 'běn', nameVietnamese: 'Cuốn, quyển', hskLevel: 1, category: 'Lượng từ', exampleChinese: '三本书。', examplePinyin: 'Sān běn shū.', exampleVietnamese: 'Ba cuốn sách.' },
  { nameChinese: '不客气', namePinyin: 'bú kèqi', nameVietnamese: 'Đừng khách sáo', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '不用谢，不客气。', examplePinyin: 'Búyòng xiè, bú kèqi.', exampleVietnamese: 'Không cần cảm ơn, đừng khách sáo.' },
  { nameChinese: '不', namePinyin: 'bù', nameVietnamese: 'Không', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '我不去。', examplePinyin: 'Wǒ bú qù.', exampleVietnamese: 'Tôi không đi.' },
  { nameChinese: '菜', namePinyin: 'cài', nameVietnamese: 'Món ăn, rau', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '做做炒菜。', examplePinyin: 'Zuòzuò chǎocài.', exampleVietnamese: 'Làm món rau xào.' },
  { nameChinese: '茶', namePinyin: 'chá', nameVietnamese: 'Trà', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '喝热茶。', examplePinyin: 'Hē rè chá.', exampleVietnamese: 'Uống trà nóng.' },
  { nameChinese: '吃', namePinyin: 'chī', nameVietnamese: 'Ăn', hskLevel: 1, category: 'Ẩm thực', exampleChinese: '吃米饭。', examplePinyin: 'Chī mǐfàn.', exampleVietnamese: 'Ăn cơm.' },
  { nameChinese: '出租车', namePinyin: 'chūzūchē', nameVietnamese: 'Xe taxi', hskLevel: 1, category: 'Giao thông', exampleChinese: '叫出租车。', examplePinyin: 'Jiào chūzūchē.', exampleVietnamese: 'Gọi xe taxi.' },
  { nameChinese: '打电话', namePinyin: 'dǎ diànhuà', nameVietnamese: 'Gọi điện thoại', hskLevel: 1, category: 'Giao tiếp', exampleChinese: '他在打电话。', examplePinyin: 'Tā zài dǎ diànhuà.', exampleVietnamese: 'Anh ấy đang gọi điện thoại.' },
  { nameChinese: '大', namePinyin: 'dà', nameVietnamese: 'To, lớn', hskLevel: 1, category: 'Mô tả', exampleChinese: '大房子。', examplePinyin: 'Dà fángzi.', exampleVietnamese: 'Căn nhà to.' },
  { nameChinese: '的', namePinyin: 'de', nameVietnamese: 'Của', hskLevel: 1, category: 'Ngữ pháp', exampleChinese: '我的书。', examplePinyin: 'Wǒ de shū.', exampleVietnamese: 'Sách của tôi.' },
  { nameChinese: '点', namePinyin: 'diǎn', nameVietnamese: 'Giờ', hskLevel: 1, category: 'Thời gian', exampleChinese: '九点钟。', examplePinyin: 'Jiǔ diǎn zhōng.', exampleVietnamese: '9 giờ.' },
  { nameChinese: '电脑', namePinyin: 'diànnǎo', nameVietnamese: 'Máy tính', hskLevel: 1, category: 'Đồ dùng', exampleChinese: '买电脑。', examplePinyin: 'Mǎi diànnǎo.', exampleVietnamese: 'Mua máy tính.' },
  { nameChinese: '电视', namePinyin: 'diànshì', nameVietnamese: 'Tivi', hskLevel: 1, category: 'Giải trí', exampleChinese: '看电视。', examplePinyin: 'Kàn diànshì.', exampleVietnamese: 'Xem tivi.' },
  { nameChinese: '电影', namePinyin: 'diànyǐng', nameVietnamese: 'Phim điện ảnh', hskLevel: 1, category: 'Giải trí', exampleChinese: '好电影。', examplePinyin: 'Hǎo diànyǐng.', exampleVietnamese: 'Bộ phim hay.' },
  { nameChinese: '东西', namePinyin: 'dōngxi', nameVietnamese: 'Đồ đạc', hskLevel: 1, category: 'Đồ dùng', exampleChinese: '买东西。', examplePinyin: 'Mǎi dōngxi.', exampleVietnamese: 'Mua đồ đạc.' },

  // --- HSK 2 ---
  { nameChinese: '吧', namePinyin: 'ba', nameVietnamese: 'Đi, nhé (trợ từ)', hskLevel: 2, category: 'Ngữ pháp', exampleChinese: '走吧！', examplePinyin: 'Zǒu ba!', exampleVietnamese: 'Đi thôi nhé!' },
  { nameChinese: '白', namePinyin: 'bái', nameVietnamese: 'Trắng', hskLevel: 2, category: 'Màu sắc', exampleChinese: '白色的花。', examplePinyin: 'Báisè de huā.', exampleVietnamese: 'Bông hoa màu trắng.' },
  { nameChinese: '百', namePinyin: 'bǎi', nameVietnamese: 'Trăm', hskLevel: 2, category: 'Con số', exampleChinese: '五百。', examplePinyin: 'Wǔ bǎi.', exampleVietnamese: 'Năm trăm.' },
  { nameChinese: '帮助', namePinyin: 'bāngzhù', nameVietnamese: 'Giúp đỡ', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '帮助别人。', examplePinyin: 'Bāngzhù biérén.', exampleVietnamese: 'Giúp đỡ người khác.' },
  { nameChinese: '报纸', namePinyin: 'bàozhǐ', nameVietnamese: 'Báo chí', hskLevel: 2, category: 'Tin tức', exampleChinese: '读报纸。', examplePinyin: 'Dú bàozhǐ.', exampleVietnamese: 'Đọc báo.' },
  { nameChinese: '比', namePinyin: 'bǐ', nameVietnamese: 'So với', hskLevel: 2, category: 'Ngữ pháp', exampleChinese: '他比我高。', examplePinyin: 'Tā bǐ wǒ gāo.', exampleVietnamese: 'Anh ấy cao hơn tôi.' },
  { nameChinese: '别', namePinyin: 'bié', nameVietnamese: 'Đừng', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '别去。', examplePinyin: 'Bié qù.', exampleVietnamese: 'Đừng đi.' },
  { nameChinese: '长', namePinyin: 'cháng', nameVietnamese: 'Dài', hskLevel: 2, category: 'Mô tả', exampleChinese: '很长。', examplePinyin: 'Hěn cháng.', exampleVietnamese: 'Rất dài.' },
  { nameChinese: '唱歌', namePinyin: 'chànggē', nameVietnamese: 'Ca hát', hskLevel: 2, category: 'Giải trí', exampleChinese: '大声唱歌。', examplePinyin: 'Dàshēng chànggē.', exampleVietnamese: 'Hát to.' },
  { nameChinese: '出', namePinyin: 'chū', nameVietnamese: 'Ra', hskLevel: 2, category: 'Hành động', exampleChinese: '出去。', examplePinyin: 'Chūqù.', exampleVietnamese: 'Đi ra ngoài.' },
  { nameChinese: '穿', namePinyin: 'chuān', nameVietnamese: 'Mặc', hskLevel: 2, category: 'Thời trang', exampleChinese: '穿裤子。', examplePinyin: 'Chuān kùzi.', exampleVietnamese: 'Mặc quần.' },
  { nameChinese: '次', namePinyin: 'cì', nameVietnamese: 'Lần', hskLevel: 2, category: 'Lượng từ', exampleChinese: '第一次。', examplePinyin: 'Dì yī cì.', exampleVietnamese: 'Lần đầu tiên.' },
  { nameChinese: '从', namePinyin: 'cóng', nameVietnamese: 'Từ (địa điểm/thời gian)', hskLevel: 2, category: 'Ngữ pháp', exampleChinese: '从家到学校。', examplePinyin: 'Cóng jiā dào xuéxiào.', exampleVietnamese: 'Từ nhà đến trường.' },
  { nameChinese: '错', namePinyin: 'cuò', nameVietnamese: 'Sai', hskLevel: 2, category: 'Mô tả', exampleChinese: '没错。', examplePinyin: 'Méi cuò.', exampleVietnamese: 'Không sai.' },
  { nameChinese: '打篮球', namePinyin: 'dǎ lánqiú', nameVietnamese: 'Chơi bóng rổ', hskLevel: 2, category: 'Thể thao', exampleChinese: '喜欢打篮球。', examplePinyin: 'Xǐhuan dǎ lánqiú.', exampleVietnamese: 'Thích chơi bóng rổ.' },
  { nameChinese: '大家', namePinyin: 'dàjiā', nameVietnamese: 'Mọi người', hskLevel: 2, category: 'Giao tiếp', exampleChinese: '大家好！', examplePinyin: 'Dàjiā hǎo!', exampleVietnamese: 'Chào mọi người!' },
  { nameChinese: '到', namePinyin: 'dào', nameVietnamese: 'Đến', hskLevel: 2, category: 'Hành động', exampleChinese: '到了。', examplePinyin: 'Dào le.', exampleVietnamese: 'Đến rồi.' },
  { nameChinese: '得', namePinyin: 'de', nameVietnamese: 'Trợ từ kết cấu得', hskLevel: 2, category: 'Ngữ pháp', exampleChinese: '跑得快。', examplePinyin: 'Pǎo de kuài.', exampleVietnamese: 'Chạy nhanh.' },

  // --- HSK 3 ---
  { nameChinese: '阿姨', namePinyin: 'āyí', nameVietnamese: 'Dì, cô', hskLevel: 3, category: 'Gia đình', exampleChinese: '阿姨。', examplePinyin: 'Āyí.', exampleVietnamese: 'Cô/dì.' },
  { nameChinese: '矮', namePinyin: 'ǎi', nameVietnamese: 'Thấp, lùn', hskLevel: 3, category: 'Mô tả', exampleChinese: '有点矮。', examplePinyin: 'Yǒudiǎnr ǎi.', exampleVietnamese: 'Hơi lùn.' },
  { nameChinese: '爱好', namePinyin: 'àihào', nameVietnamese: 'Sở thích', hskLevel: 3, category: 'Giải trí', exampleChinese: '培养爱好。', examplePinyin: 'Péiyǎng àihào.', exampleVietnamese: 'Bồi dưỡng sở thích.' },
  { nameChinese: '安静', namePinyin: 'ānjìng', nameVietnamese: 'Yên tĩnh', hskLevel: 3, category: 'Mô tả', exampleChinese: '保持安静。', examplePinyin: 'Bǎochí ānjìng.', exampleVietnamese: 'Giữ yên tĩnh.' },
  { nameChinese: '把', namePinyin: 'bǎ', nameVietnamese: 'Nắm, giữ (bả)', hskLevel: 3, category: 'Ngữ pháp', exampleChinese: '把窗户关上。', examplePinyin: 'Bǎ chuānghu guān shàng.', exampleVietnamese: 'Đóng cửa sổ lại.' },
  { nameChinese: '班', namePinyin: 'bān', nameVietnamese: 'Lớp', hskLevel: 3, category: 'Học tập', exampleChinese: '一班。', examplePinyin: 'Yì bān.', exampleVietnamese: 'Lớp một.' },
  { nameChinese: '搬', namePinyin: 'bān', nameVietnamese: 'Chuyển, dời', hskLevel: 3, category: 'Đời sống', exampleChinese: '搬桌子。', examplePinyin: 'Bān zhuōzi.', exampleVietnamese: 'Chuyển bàn.' },
  { nameChinese: '办法', namePinyin: 'bànfǎ', nameVietnamese: 'Biện pháp, cách', hskLevel: 3, category: 'Công việc', exampleChinese: '想办法。', examplePinyin: 'Xiǎng bànfǎ.', exampleVietnamese: 'Nghĩ cách.' },
  { nameChinese: '办公室', namePinyin: 'bàngōngshì', nameVietnamese: 'Văn phòng', hskLevel: 3, category: 'Công việc', exampleChinese: '在办公室。', examplePinyin: 'Zài bàngōngshì.', exampleVietnamese: 'Ở văn phòng.' },
  { nameChinese: '半', namePinyin: 'bàn', nameVietnamese: 'Nửa, rưỡi', hskLevel: 3, category: 'Con số', exampleChinese: '一半。', examplePinyin: 'Yí bàn.', exampleVietnamese: 'Một nửa.' },
  { nameChinese: '帮忙', namePinyin: 'bāngmáng', nameVietnamese: 'Giúp đỡ', hskLevel: 3, category: 'Giao tiếp', exampleChinese: '需要帮忙。', examplePinyin: 'Xūyào bāngmáng.', exampleVietnamese: 'Cần giúp đỡ.' },
  { nameChinese: '包', namePinyin: 'bāo', nameVietnamese: 'Túi, cặp', hskLevel: 3, category: 'Đồ dùng', exampleChinese: '书包。', examplePinyin: 'Shūbāo.', exampleVietnamese: 'Cặp sách.' },
  { nameChinese: '饱', namePinyin: 'bǎo', nameVietnamese: 'No', hskLevel: 3, category: 'Ẩm thực', exampleChinese: '吃饱了。', examplePinyin: 'Chī bǎo le.', exampleVietnamese: 'Ăn no rồi.' },

  // --- HSK 4 ---
  { nameChinese: '爱情', namePinyin: 'àiqíng', nameVietnamese: 'Tình yêu', hskLevel: 4, category: 'Tình cảm', exampleChinese: '美好的爱情。', examplePinyin: 'Měihǎo de àiqíng.', exampleVietnamese: 'Tình yêu đẹp đẽ.' },
  { nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'Sắp xếp', hskLevel: 4, category: 'Công việc', exampleChinese: '妥善安排。', examplePinyin: 'Tuǒshàn ānpái.', exampleVietnamese: 'Sắp xếp thỏa đáng.' },
  { nameChinese: '安全', namePinyin: 'ānquán', nameVietnamese: 'An toàn', hskLevel: 4, category: 'Đời sống', exampleChinese: '注意安全。', examplePinyin: 'Zhùyì ānquán.', exampleVietnamese: 'Chú ý an toàn.' },
  { nameChinese: '按时', namePinyin: 'ànshí', nameVietnamese: 'Đúng giờ', hskLevel: 4, category: 'Công việc', exampleChinese: '按时到达。', examplePinyin: 'Ànshí dàodá.', exampleVietnamese: 'Đến đúng giờ.' },
  { nameChinese: '按照', namePinyin: 'ànzhào', nameVietnamese: 'Dựa theo', hskLevel: 4, category: 'Ngữ pháp', exampleChinese: '按照规定。', examplePinyin: 'Ànzhào guīdìng.', exampleVietnamese: 'Dựa theo quy định.' },
  { nameChinese: '百分之', namePinyin: 'bǎifēnzhī', nameVietnamese: 'Phần trăm', hskLevel: 4, category: 'Con số', exampleChinese: '百分之五十。', examplePinyin: 'Bǎifēnzhī wǔshí.', exampleVietnamese: '50%.' },
  { nameChinese: '棒', namePinyin: 'bàng', nameVietnamese: 'Giỏi, gậy', hskLevel: 4, category: 'Mô tả', exampleChinese: '真棒！', examplePinyin: 'Zhēn bàng!', exampleVietnamese: 'Thật giỏi!' },
  { nameChinese: '包子', namePinyin: 'bāozi', nameVietnamese: 'Bánh bao', hskLevel: 4, category: 'Ẩm thực', exampleChinese: '吃包子。', examplePinyin: 'Chī bāozi.', exampleVietnamese: 'Ăn bánh bao.' },
  { nameChinese: '保护', namePinyin: 'bǎohù', nameVietnamese: 'Bảo vệ', hskLevel: 4, category: 'Đời sống', exampleChinese: '保护环境。', examplePinyin: 'Bǎohù huánjìng.', exampleVietnamese: 'Bảo vệ môi trường.' },

  // --- HSK 5 ---
  { nameChinese: '唉', namePinyin: 'āi', nameVietnamese: 'Than ôi', hskLevel: 5, category: 'Giao tiếp', exampleChinese: '唉！', examplePinyin: 'Āi!', exampleVietnamese: 'Than ôi!' },
  { nameChinese: '爱护', namePinyin: 'àihù', nameVietnamese: 'Yêu quý bảo vệ', hskLevel: 5, category: 'Tình cảm', exampleChinese: '爱护儿童。', examplePinyin: 'Àihù értóng.', exampleVietnamese: 'Yêu quý trẻ em.' },
  { nameChinese: '安慰', namePinyin: 'ānwèi', nameVietnamese: 'An ủi', hskLevel: 5, category: 'Tâm lý', exampleChinese: '得到安慰。', examplePinyin: 'Dé dào ānwèi.', exampleVietnamese: 'Nhận được sự an ủi.' },
  { nameChinese: '安装', namePinyin: 'ānzhuāng', nameVietnamese: 'Lắp đặt', hskLevel: 5, category: 'Công nghệ', exampleChinese: '安装空调。', examplePinyin: 'Ānzhuāng kōngtiáo.', exampleVietnamese: 'Lắp đặt điều hòa.' },
  { nameChinese: '岸', namePinyin: 'àn', nameVietnamese: 'Bờ', hskLevel: 5, category: 'Thiên nhiên', exampleChinese: '河岸。', examplePinyin: 'Hé\'àn.', exampleVietnamese: 'Bờ sông.' },
  { nameChinese: '把握', namePinyin: 'bǎwò', nameVietnamese: 'Nắm bắt', hskLevel: 5, category: 'Công việc', exampleChinese: '很有把握。', examplePinyin: 'Hěn yǒu bǎwò.', exampleVietnamese: 'Rất có nắm bắt.' },
  { nameChinese: '包含', namePinyin: 'bāohán', nameVietnamese: 'Bao hàm', hskLevel: 5, category: 'Mô tả', exampleChinese: '包含其中。', examplePinyin: 'Bāohán qízhōng.', exampleVietnamese: 'Bao hàm trong đó.' },
  { nameChinese: '包裹', namePinyin: 'bāoguǒ', nameVietnamese: 'Bưu kiện', hskLevel: 5, category: 'Mua sắm', exampleChinese: '取包裹。', examplePinyin: 'Qǔ bāoguǒ.', exampleVietnamese: 'Lấy bưu kiện.' },

  // --- HSK 6 ---
  { nameChinese: '挨', namePinyin: 'ái', nameVietnamese: 'Chịu, bị', hskLevel: 6, category: 'Hành động', exampleChinese: '挨打。', examplePinyin: 'Ái dǎ.', exampleVietnamese: 'Bị đánh.' },
  { nameChinese: '癌症', namePinyin: 'ái zhèng', nameVietnamese: 'Bệnh ung thư', hskLevel: 6, category: 'Y tế', exampleChinese: '治愈癌症。', examplePinyin: 'Zhìyù áizhèng.', exampleVietnamese: 'Chữa khỏi ung thư.' },
  { nameChinese: '爱不释手', namePinyin: 'ài bú shì shǒu', nameVietnamese: 'Yêu thích không rời tay', hskLevel: 6, category: 'Tâm lý', exampleChinese: '令人爱不释手。', examplePinyin: 'Lìng rén ài bú shì shǒu.', exampleVietnamese: 'Khiến người ta thích không nỡ rời tay.' },
  { nameChinese: '爱戴', namePinyin: 'àidài', nameVietnamese: 'Kính yêu', hskLevel: 6, category: 'Giao tiếp', exampleChinese: '受人爱戴。', examplePinyin: 'Shòu rén àidài.', exampleVietnamese: 'Được người khác kính yêu.' },
  { nameChinese: '暧昧', namePinyin: 'àimèi', nameVietnamese: 'Mập mờ', hskLevel: 6, category: 'Tâm lý', exampleChinese: '关系暧昧。', examplePinyin: 'Guānxi àimèi.', exampleVietnamese: 'Mối quan hệ mập mờ.' },
  { nameChinese: '卓越', namePinyin: 'zhuóyuè', nameVietnamese: 'Xuất sắc', hskLevel: 6, category: 'Mô tả', exampleChinese: '追求卓越。', examplePinyin: 'Zhuīqiú zhuóyuè.', exampleVietnamese: 'Theo đuổi sự xuất sắc.' },
  { nameChinese: '精益求精', namePinyin: 'jīng yì qiú jīng', nameVietnamese: 'Luôn phấn đấu hơn nữa', hskLevel: 6, category: 'Công việc', exampleChinese: '精益求精。', examplePinyin: 'Jīng yì qiú jīng.', exampleVietnamese: 'Tinh ích cầu tinh.' }
];

async function seedGiant() {
  console.log('⚡==================================================⚡');
  console.log('🚀 NẠP KHO TỪ VỰNG GIANT HSK 1-6 SIÊU TỐC');
  console.log('⚡==================================================⚡\n');

  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  let added = 0;
  for (const item of GIANT_HSK_DICTIONARY) {
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

  console.log(`✅ Nạp hoàn tất! Đã nạp thành công +${added} từ vựng độc bản mới.`);
  console.log(`📚 Tổng kho từ vựng HSK độc bản hiện tại trong CSDL: ${existingSet.size} từ.\n`);
}

seedGiant().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
