import fs from 'fs';
import path from 'path';

export interface VocabItem {
  id: string;
  nameChinese: string;
  namePinyin: string;
  nameVietnamese: string;
  hskLevel: number;
  theme: string;
  exampleChinese: string;
  examplePinyin: string;
  exampleVietnamese: string;
}

// Bộ dữ liệu mở rộng từ vựng chuẩn HSK 1, HSK 2, HSK 3 phong phú và cân bằng
const EXTRA_HSK_VOCABULARY: VocabItem[] = [
  // --- HSK 1 ---
  { id: 'hsk1_26', nameChinese: '妈妈', namePinyin: 'māma', nameVietnamese: 'Mẹ', hskLevel: 1, theme: 'Gia đình', exampleChinese: '我妈妈做饭很好吃。', examplePinyin: 'Wǒ māma zuòfàn hěn hǎochī.', exampleVietnamese: 'Mẹ tôi nấu ăn rất ngon.' },
  { id: 'hsk1_27', nameChinese: '爸爸', namePinyin: 'bàba', nameVietnamese: 'Bố, ba', hskLevel: 1, theme: 'Gia đình', exampleChinese: '爸爸看报纸。', examplePinyin: 'Bàba kàn bàozhǐ.', exampleVietnamese: 'Bố xem báo chí.' },
  { id: 'hsk1_28', nameChinese: '儿子', namePinyin: 'érzi', nameVietnamese: 'Con trai', hskLevel: 1, theme: 'Gia đình', exampleChinese: '我有一个儿子。', examplePinyin: 'Wǒ yǒu yí ge érzi.', exampleVietnamese: 'Tôi có một người con trai.' },
  { id: 'hsk1_29', nameChinese: '女儿', namePinyin: "nǚ'ér", nameVietnamese: 'Con gái', hskLevel: 1, theme: 'Gia đình', exampleChinese: '我的女儿喜欢看书。', examplePinyin: "Wǒ de nǚ'ér xǐhuan kànshū.", exampleVietnamese: 'Con gái của tôi thích đọc sách.' },
  { id: 'hsk1_30', nameChinese: '老师', namePinyin: 'lǎoshī', nameVietnamese: 'Thầy cô giáo', hskLevel: 1, theme: 'Học tập', exampleChinese: '王老师是我们的汉语老师。', examplePinyin: 'Wáng lǎoshī shì wǒmen de Hànyǔ lǎoshī.', exampleVietnamese: 'Thầy Vương là giáo viên tiếng Trung của chúng tôi.' },
  { id: 'hsk1_31', nameChinese: '朋友', namePinyin: 'péngyou', nameVietnamese: 'Bạn bè', hskLevel: 1, theme: 'Giao tiếp', exampleChinese: '我们是好朋友。', examplePinyin: 'Wǒmen shì hǎo péngyou.', exampleVietnamese: 'Chúng tôi là bạn tốt của nhau.' },
  { id: 'hsk1_32', nameChinese: '医生', namePinyin: 'yīshēng', nameVietnamese: 'Bác sĩ', hskLevel: 1, theme: 'Nghề nghiệp', exampleChinese: '在医院里有很多医生。', examplePinyin: 'Zài yīyuàn lǐ yǒu hěn duō yīshēng.', exampleVietnamese: 'Trong bệnh viện có rất nhiều bác sĩ.' },
  { id: 'hsk1_33', nameChinese: '苹果', namePinyin: 'píngguǒ', nameVietnamese: 'Quả táo', hskLevel: 1, theme: 'Ẩm thực', exampleChinese: '桌子上有一个大苹果。', examplePinyin: 'Zhuōzi shàng yǒu yí ge dà píngguǒ.', exampleVietnamese: 'Trên bàn có một quả táo to.' },
  { id: 'hsk1_34', nameChinese: '水', namePinyin: 'shuǐ', nameVietnamese: 'Nước uống', hskLevel: 1, theme: 'Ẩm thực', exampleChinese: '请喝一杯水。', examplePinyin: 'Qǐng hē yì bēi shuǐ.', exampleVietnamese: 'Xin hãy uống một cốc nước.' },
  { id: 'hsk1_35', nameChinese: '茶', namePinyin: 'chá', nameVietnamese: 'Trà, chè', hskLevel: 1, theme: 'Ẩm thực', exampleChinese: '中国人喜欢喝红茶。', examplePinyin: 'Zhōngguórén xǐhuan hē hóngchá.', exampleVietnamese: 'Người Trung Quốc thích uống hồng trà.' },
  { id: 'hsk1_36', nameChinese: '米饭', namePinyin: 'mǐfàn', nameVietnamese: 'Cơm trắng', hskLevel: 1, theme: 'Ẩm thực', exampleChinese: '中午我们吃米饭。', examplePinyin: 'Zhōngwǔ wǒmen chī mǐfàn.', exampleVietnamese: 'Buổi trưa chúng tôi ăn cơm.' },
  { id: 'hsk1_37', nameChinese: '菜', namePinyin: 'cài', nameVietnamese: 'Món ăn, rau', hskLevel: 1, theme: 'Ẩm thực', exampleChinese: '今天的菜很香。', examplePinyin: 'Jīntiān de cài hěn xiāng.', exampleVietnamese: 'Món ăn hôm nay rất thơm.' },
  { id: 'hsk1_38', nameChinese: '水果', namePinyin: 'shuǐguǒ', nameVietnamese: 'Hoa quả', hskLevel: 1, theme: 'Ẩm thực', exampleChinese: '多吃水果对身体好。', examplePinyin: 'Duō chī shuǐguǒ duì shēntǐ hǎo.', exampleVietnamese: 'Ăn nhiều hoa quả tốt cho sức khỏe.' },
  { id: 'hsk1_39', nameChinese: '猫', namePinyin: 'māo', nameVietnamese: 'Con mèo', hskLevel: 1, theme: 'Động vật', exampleChinese: '小猫在床上睡觉。', examplePinyin: 'Xiǎomāo zài chuáng shàng shuìjiào.', exampleVietnamese: 'Mèo con đang ngủ trên giường.' },
  { id: 'hsk1_40', nameChinese: '狗', namePinyin: 'gǒu', nameVietnamese: 'Con chó', hskLevel: 1, theme: 'Động vật', exampleChinese: '我家有一条可爱的小狗。', examplePinyin: "Wǒ jiā yǒu yì tiáo kě'ài de xiǎogǒu.", exampleVietnamese: 'Nhà tôi có một chú chó nhỏ đáng yêu.' },

  // --- HSK 2 ---
  { id: 'hsk2_31', nameChinese: '公共汽车', namePinyin: 'gōnggòng qìchē', nameVietnamese: 'Xe buýt', hskLevel: 2, theme: 'Giao thông', exampleChinese: '我坐公共汽车去学校。', examplePinyin: 'Wǒ zuò gōnggòng qìchē qù xuéxiào.', exampleVietnamese: 'Tôi đi xe buýt đến trường.' },
  { id: 'hsk2_32', nameChinese: '自行车', namePinyin: 'zìxíngchē', nameVietnamese: 'Xe đạp', hskLevel: 2, theme: 'Giao thông', exampleChinese: '骑自行车是一个好运动。', examplePinyin: 'Qí zìxíngchē shì yí ge hǎo yùndòng.', exampleVietnamese: 'Đi xe đạp là một môn thể thao tốt.' },
  { id: 'hsk2_33', nameChinese: '机场', namePinyin: 'jīchǎng', nameVietnamese: 'Sân bay', hskLevel: 2, theme: 'Du lịch', exampleChinese: '我们去机场接朋友。', examplePinyin: 'Wǒmen qù jīchǎng jiē péngyou.', exampleVietnamese: 'Chúng tôi đi sân bay đón bạn.' },
  { id: 'hsk2_34', nameChinese: '火车站', namePinyin: 'huǒchēzhàn', nameVietnamese: 'Ga tàu hỏa', hskLevel: 2, theme: 'Giao thông', exampleChinese: '火车站里的人很多。', examplePinyin: 'Huǒchēzhàn lǐ de rén hěn duō.', exampleVietnamese: 'Người ở ga tàu hỏa rất đông.' },
  { id: 'hsk2_35', nameChinese: '公司', namePinyin: 'gōngsī', nameVietnamese: 'Công ty', hskLevel: 2, theme: 'Công việc', exampleChinese: '我在一家建筑设计公司工作。', examplePinyin: 'Wǒ zài yì jiā jiànzhù shèjì gōngsī gōngzuò.', exampleVietnamese: 'Tôi làm việc ở một công ty thiết kế kiến trúc.' },
  { id: 'hsk2_36', nameChinese: '医院', namePinyin: 'yīyuàn', nameVietnamese: 'Bệnh viện', hskLevel: 2, theme: 'Đời sống', exampleChinese: '身体不舒服要去医院。', examplePinyin: 'Shēntǐ bù shūfu yào qù yīyuàn.', exampleVietnamese: 'Cơ thể không khỏe phải đi bệnh viện.' },
  { id: 'hsk2_37', nameChinese: '药', namePinyin: 'yào', nameVietnamese: 'Thuốc', hskLevel: 2, theme: 'Đời sống', exampleChinese: '吃药以后好好休息。', examplePinyin: 'Chī yào yǐhòu hǎohǎo xiūxi.', exampleVietnamese: 'Uống thuốc xong hãy nghỉ ngơi thật tốt.' },
  { id: 'hsk2_38', nameChinese: '身体', namePinyin: 'shēntǐ', nameVietnamese: 'Cơ thể, sức khỏe', hskLevel: 2, theme: 'Đời sống', exampleChinese: '祝你身体健康！', examplePinyin: 'Zhù nǐ shēntǐ jiànkāng!', exampleVietnamese: 'Chúc bạn sức khỏe dồi dào!' },
  { id: 'hsk2_39', nameChinese: '手表', namePinyin: 'shǒubiǎo', nameVietnamese: 'Đồng hồ đeo tay', hskLevel: 2, theme: 'Mua sắm', exampleChinese: '这块手表很精美。', examplePinyin: 'Zhè kuài shǒubiǎo hěn jīngměi.', exampleVietnamese: 'Chiếc đồng hồ này rất tinh xảo.' },
  { id: 'hsk2_40', nameChinese: '眼睛', namePinyin: 'yǎnjing', nameVietnamese: 'Mắt', hskLevel: 2, theme: 'Mô tả', exampleChinese: '要保护好自己的眼睛。', examplePinyin: 'Yào bǎohù hǎo zìjǐ de yǎnjing.', exampleVietnamese: 'Cần bảo vệ tốt đôi mắt của mình.' },
  { id: 'hsk2_41', nameChinese: '跑步', namePinyin: 'pǎobù', nameVietnamese: 'Chạy bộ', hskLevel: 2, theme: 'Thể thao', exampleChinese: '早上在公园里跑步。', examplePinyin: 'Zǎoshang zài gōngyuán lǐ pǎobù.', exampleVietnamese: 'Buổi sáng chạy bộ trong công viên.' },
  { id: 'hsk2_42', nameChinese: '游泳', namePinyin: 'yóuyǒng', nameVietnamese: 'Bơi lội', hskLevel: 2, theme: 'Thể thao', exampleChinese: '夏天我们喜欢去游泳。', examplePinyin: 'Xiàtiān wǒmen xǐhuan qù yóuyǒng.', exampleVietnamese: 'Mùa hè chúng tôi thích đi bơi.' },
  { id: 'hsk2_43', nameChinese: '踢足球', namePinyin: 'tī zúqiú', nameVietnamese: 'Đá bóng', hskLevel: 2, theme: 'Thể thao', exampleChinese: '男孩子们在操场踢足球。', examplePinyin: 'Nán háizimen zài cāochǎng tī zúqiú.', exampleVietnamese: 'Bọn con trai đang đá bóng ngoài sân vận động.' },
  { id: 'hsk2_44', nameChinese: '打篮球', namePinyin: 'dǎ lánqiú', nameVietnamese: 'Chơi bóng rổ', hskLevel: 2, theme: 'Thể thao', exampleChinese: '他很擅长打篮球。', examplePinyin: 'Tā hěn shàncháng dǎ lánqiú.', exampleVietnamese: 'Anh ấy rất giỏi chơi bóng rổ.' },
  { id: 'hsk2_45', nameChinese: '生病', namePinyin: 'shēngbìng', nameVietnamese: 'Bị bệnh', hskLevel: 2, theme: 'Đời sống', exampleChinese: '他生病了，不能去上课。', examplePinyin: 'Tā shēngbìng le, bù néng qù shàngkè.', exampleVietnamese: 'Anh ấy bị bệnh rồi, không thể đi học được.' },

  // --- HSK 3 ---
  { id: 'hsk3_31', nameChinese: '词典', namePinyin: 'cídiǎn', nameVietnamese: 'Từ điển', hskLevel: 3, theme: 'Học tập', exampleChinese: '查词典能帮助学习汉语。', examplePinyin: 'Chá cídiǎn néng bāngzhù xuéxí Hànyǔ.', exampleVietnamese: 'Tra từ điển có thể giúp ích cho việc học tiếng Trung.' },
  { id: 'hsk3_32', nameChinese: '地图', namePinyin: 'dìtú', nameVietnamese: 'Bản đồ', hskLevel: 3, theme: 'Du lịch', exampleChinese: '墙上挂着一张世界地图。', examplePinyin: 'Qiáng shàng guà zhe yì zhāng shìjiè dìtú.', exampleVietnamese: 'Trên tường treo một tấm bản đồ thế giới.' },
  { id: 'hsk3_33', nameChinese: '电梯', namePinyin: 'diàntī', nameVietnamese: 'Thang máy', hskLevel: 3, theme: 'Đồ dùng', exampleChinese: '我们坐电梯去十楼。', examplePinyin: 'Wǒmen zuò diàntī qù shí lóu.', exampleVietnamese: 'Chúng tôi đi thang máy lên tầng 10.' },
  { id: 'hsk3_34', nameChinese: '环境', namePinyin: 'huánjìng', nameVietnamese: 'Môi trường', hskLevel: 3, theme: 'Mô tả', exampleChinese: '这里的居住环境非常好。', examplePinyin: 'Zhèlǐ de jūzhù huánjìng fēicháng hǎo.', exampleVietnamese: 'Môi trường sống ở đây vô cùng tốt.' },
  { id: 'hsk3_35', nameChinese: '会议', namePinyin: 'huìyì', nameVietnamese: 'Cuộc họp', hskLevel: 3, theme: 'Công việc', exampleChinese: '下午两点有一个重要会议。', examplePinyin: 'Xiàwǔ liǎng diǎn yǒu yí ge zhòngyào huìyì.', exampleVietnamese: 'Chiều 2 giờ có một cuộc họp quan trọng.' },
  { id: 'hsk3_36', nameChinese: '空调', namePinyin: 'kōngtiáo', nameVietnamese: 'Máy điều hòa', hskLevel: 3, theme: 'Đồ dùng', exampleChinese: '夏天房间里开了空调很凉快。', examplePinyin: 'Xiàtiān fángjiān lǐ kāi le kōngtiáo hěn liángkuai.', exampleVietnamese: 'Mùa hè trong phòng bật điều hòa rất mát mẻ.' },
  { id: 'hsk3_37', nameChinese: '历史', namePinyin: 'lìshǐ', nameVietnamese: 'Lịch sử', hskLevel: 3, theme: 'Học tập', exampleChinese: '中国有悠久的历史文化。', examplePinyin: 'Zhōngguó yǒu yōujiǔ de lìshǐ wénhuà.', exampleVietnamese: 'Trung Quốc có văn hóa lịch sử lâu đời.' },
  { id: 'hsk3_38', nameChinese: '文化', namePinyin: 'wénhuà', nameVietnamese: 'Văn hóa', hskLevel: 3, theme: 'Học tập', exampleChinese: '各个国家的文化都很独特。', examplePinyin: 'Gège guójiā de wénhuà dōu hěn dútè.', exampleVietnamese: 'Văn hóa của mỗi quốc gia đều rất độc đáo.' },
  { id: 'hsk3_39', nameChinese: '新闻', namePinyin: 'xīnwén', nameVietnamese: 'Tin tức', hskLevel: 3, theme: 'Tin tức', exampleChinese: '晚上七点看电视新闻。', examplePinyin: 'Wǎnshang qī diǎn kàn diànshì xīnwén.', exampleVietnamese: 'Tối 7 giờ xem tin tức truyền hình.' },
  { id: 'hsk3_40', nameChinese: '校长', namePinyin: 'xiàozhǎng', nameVietnamese: 'Hiệu trưởng', hskLevel: 3, theme: 'Học tập', exampleChinese: '校长在大会上讲话。', examplePinyin: 'Xiàozhǎng zài dàhuì shàng jiǎnghuà.', exampleVietnamese: 'Hiệu trưởng phát biểu tại đại hội.' },
  { id: 'hsk3_41', nameChinese: '音乐', namePinyin: 'yīnyuè', nameVietnamese: 'Âm nhạc', hskLevel: 3, theme: 'Giải trí', exampleChinese: '听音乐能让人放松。', examplePinyin: 'Tīng yīnyuè néng ràng rén fàngsōng.', exampleVietnamese: 'Nghe nhạc có thể giúp con người thư giãn.' },
  { id: 'hsk3_42', nameChinese: '照片', namePinyin: 'zhàopiàn', nameVietnamese: 'Bức ảnh', hskLevel: 3, theme: 'Giải trí', exampleChinese: '这张照片拍得很美。', examplePinyin: 'Zhè zhāng zhàopiàn pāi de hěn měi.', exampleVietnamese: 'Bức ảnh này chụp rất đẹp.' },
  { id: 'hsk3_43', nameChinese: '相机', namePinyin: 'xiàngjī', nameVietnamese: 'Máy ảnh', hskLevel: 3, theme: 'Đồ dùng', exampleChinese: '用新相机拍风景。', examplePinyin: 'Yòng xīn xiàngjī pāi fēngjǐng.', exampleVietnamese: 'Dùng máy ảnh mới để chụp phong cảnh.' },
  { id: 'hsk3_44', nameChinese: '礼物', namePinyin: 'lǐwù', nameVietnamese: 'Món quà', hskLevel: 3, theme: 'Giao tiếp', exampleChinese: '非常喜欢你送给我的生日礼物。', examplePinyin: 'Fēicháng xǐhuan nǐ sòng gěi wǒ de shēngrì lǐwù.', exampleVietnamese: 'Vô cùng thích món quà sinh nhật bạn tặng tôi.' },
  { id: 'hsk3_45', nameChinese: '护照', namePinyin: 'hùzhào', nameVietnamese: 'Hộ chiếu', hskLevel: 3, theme: 'Du lịch', exampleChinese: '出国需要带好护照。', examplePinyin: 'Chūguó xūyào dài hǎo hùzhào.', exampleVietnamese: 'Đi nước ngoài cần mang theo hộ chiếu.' }
];

function escapeTsString(str: string): string {
  return str.replace(/'/g, "\\'");
}

async function pumpVocabularyBot() {
  console.log('🤖 BOT AI AUTOMATIC VOCABULARY PUMPER STARTED...');
  console.log('==================================================');

  const filePath = path.join(process.cwd(), 'data', 'vocabulary.ts');
  let fileContent = fs.readFileSync(filePath, 'utf8');

  // Clean out any previously broken auto-pumped section if present
  const marker = '// --- AUTO-PUMPED BOT VOCABULARY HSK 1-2-3 ---';
  if (fileContent.includes(marker)) {
    const parts = fileContent.split(marker);
    const endMarker = '  { id: \'gv1\',';
    const afterPart = parts[1].substring(parts[1].indexOf(endMarker));
    fileContent = parts[0] + afterPart;
  }

  // Count existing HSK items
  const countHsk1 = (fileContent.match(/hskLevel:\s*1/g) || []).length;
  const countHsk2 = (fileContent.match(/hskLevel:\s*2/g) || []).length;
  const countHsk3 = (fileContent.match(/hskLevel:\s*3/g) || []).length;

  console.log(`📊 Current HSK Vocab Count -> HSK 1: ${countHsk1} | HSK 2: ${countHsk2} | HSK 3: ${countHsk3}`);

  const targetMarker = 'export const GENERAL_VOCAB_ITEMS: GeneralVocabItem[] = [';
  const insertIndex = fileContent.indexOf(targetMarker);

  if (insertIndex === -1) {
    console.error('❌ Could not find GENERAL_VOCAB_ITEMS in data/vocabulary.ts');
    process.exit(1);
  }

  // Generate safely escaped TypeScript objects
  const newVocabEntries = EXTRA_HSK_VOCABULARY.map(item => {
    return `  { id: '${escapeTsString(item.id)}', nameChinese: '${escapeTsString(item.nameChinese)}', namePinyin: '${escapeTsString(item.namePinyin)}', nameVietnamese: '${escapeTsString(item.nameVietnamese)}', hskLevel: ${item.hskLevel}, theme: '${escapeTsString(item.theme)}', exampleChinese: '${escapeTsString(item.exampleChinese)}', examplePinyin: '${escapeTsString(item.examplePinyin)}', exampleVietnamese: '${escapeTsString(item.exampleVietnamese)}' },`;
  }).join('\n');

  const splitPos = insertIndex + targetMarker.length;
  const updatedContent = fileContent.slice(0, splitPos) + '\n  ' + marker + '\n' + newVocabEntries + '\n' + fileContent.slice(splitPos);

  fs.writeFileSync(filePath, updatedContent, 'utf8');

  const newHsk1 = (updatedContent.match(/hskLevel:\s*1/g) || []).length;
  const newHsk2 = (updatedContent.match(/hskLevel:\s*2/g) || []).length;
  const newHsk3 = (updatedContent.match(/hskLevel:\s*3/g) || []).length;

  console.log('✨ SUCCESS! Bot has successfully pumped balanced vocabulary across HSK 1-2-3!');
  console.log(`🚀 New Total HSK Vocab Count -> HSK 1: ${newHsk1} | HSK 2: ${newHsk2} | HSK 3: ${newHsk3}`);
  console.log('==================================================');
}

pumpVocabularyBot();
