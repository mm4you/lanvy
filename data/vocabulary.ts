export interface FurnitureItem {
  id: string;
  nameChinese: string;
  namePinyin: string;
  nameVietnamese: string;
  category: 'bed' | 'table' | 'chair' | 'decor' | 'light' | 'plant' | 'rug';
  cost: number;
  width: number; // Kích thước trên lưới (ô)
  height: number;
  color?: string;
}

export interface MaterialItem {
  id: string;
  nameChinese: string;
  namePinyin: string;
  nameVietnamese: string;
  category: 'wood' | 'stone' | 'glass' | 'fabric' | 'metal';
  cost: number;
}

export interface DesignContract {
  id: number;
  level: number;
  clientName: string;
  clientSprite: string; // 'panda' | 'cat' | 'shiba' | 'khang'
  title: string;
  description: string;
  promptChinese: string; // Yêu cầu bằng tiếng Trung để Vy dịch/học
  promptPinyin: string;
  promptVietnamese: string;
  targetRequirements: string[]; // Danh sách các ID nội thất bắt buộc phải có trong phòng
  rewardCoins: number;
  rewardScore: number;
  isLoveContract?: boolean;
  voucherReward?: {
    title: string;
    description: string;
    code: string;
  };
}

export const FURNITURE_ITEMS: FurnitureItem[] = [
  // GIƯỜNG (Beds)
  { id: 'single_bed', nameChinese: '单人床', namePinyin: 'dānrén chuáng', nameVietnamese: 'Giường đơn', category: 'bed', cost: 100, width: 2, height: 2, color: '#f59e0b' },
  { id: 'double_bed', nameChinese: '双人床', namePinyin: 'shuāngrén chuáng', nameVietnamese: 'Giường đôi', category: 'bed', cost: 250, width: 2, height: 3, color: '#ef4444' },
  { id: 'sofa_bed', nameChinese: '沙发床', namePinyin: 'shāfā chuáng', nameVietnamese: 'Giường sofa', category: 'bed', cost: 180, width: 2, height: 2, color: '#3b82f6' },

  // BÀN (Tables)
  { id: 'wood_table', nameChinese: '木桌', namePinyin: 'mù zhuō', nameVietnamese: 'Bàn gỗ', category: 'table', cost: 80, width: 2, height: 1, color: '#b45309' },
  { id: 'glass_table', nameChinese: '玻璃桌', namePinyin: 'bōli zhuō', nameVietnamese: 'Bàn kính', category: 'table', cost: 120, width: 2, height: 1, color: '#38bdf8' },
  { id: 'study_desk', nameChinese: '书桌', namePinyin: 'shūzhuō', nameVietnamese: 'Bàn học/làm việc', category: 'table', cost: 150, width: 2, height: 2, color: '#854d0e' },
  { id: 'coffee_table', nameChinese: '茶几', namePinyin: 'chájī', nameVietnamese: 'Bàn trà nhỏ', category: 'table', cost: 60, width: 1, height: 1, color: '#d97706' },

  // GHẾ (Chairs)
  { id: 'wood_chair', nameChinese: '木椅', namePinyin: 'mù yǐ', nameVietnamese: 'Ghế gỗ', category: 'chair', cost: 40, width: 1, height: 1, color: '#d97706' },
  { id: 'sofa', nameChinese: '沙发', namePinyin: 'shāfā', nameVietnamese: 'Ghế sofa', category: 'chair', cost: 180, width: 2, height: 1, color: '#10b981' },
  { id: 'office_chair', nameChinese: '办公椅', namePinyin: 'bàngōng yǐ', nameVietnamese: 'Ghế xoay văn phòng', category: 'chair', cost: 90, width: 1, height: 1, color: '#4b5563' },
  { id: 'armchair', nameChinese: '单人沙发', namePinyin: 'dānrén shāfā', nameVietnamese: 'Ghế bành', category: 'chair', cost: 110, width: 1, height: 1, color: '#f43f5e' },

  // ĐÈN (Lights)
  { id: 'desk_lamp', nameChinese: '台灯', namePinyin: 'táidēng', nameVietnamese: 'Đèn bàn', category: 'light', cost: 30, width: 1, height: 1, color: '#eab308' },
  { id: 'floor_lamp', nameChinese: '落地灯', namePinyin: 'luòdìdēng', nameVietnamese: 'Đèn sàn/đứng', category: 'light', cost: 70, width: 1, height: 1, color: '#fbbf24' },
  { id: 'chandelier', nameChinese: '吊灯', namePinyin: 'diàodēng', nameVietnamese: 'Đèn chùm', category: 'light', cost: 220, width: 1, height: 1, color: '#fef08a' },

  // CÂY CẢNH (Plants)
  { id: 'potted_plant', nameChinese: '盆栽', namePinyin: 'pénzāi', nameVietnamese: 'Chậu cây cảnh', category: 'plant', cost: 30, width: 1, height: 1, color: '#22c55e' },
  { id: 'cactus', nameChinese: '仙人掌', namePinyin: 'xiānrénzhǎng', nameVietnamese: 'Cây xương rồng', category: 'plant', cost: 20, width: 1, height: 1, color: '#15803d' },
  { id: 'bamboo', nameChinese: '富贵竹', namePinyin: 'fùguìzhú', nameVietnamese: 'Cây phát lộc/trúc', category: 'plant', cost: 50, width: 1, height: 1, color: '#16a34a' },

  // TRANG TRÍ (Decor)
  { id: 'bookshelf', nameChinese: '书架', namePinyin: 'shūjià', nameVietnamese: 'Kệ sách', category: 'decor', cost: 120, width: 2, height: 1, color: '#78350f' },
  { id: 'wardrobe', nameChinese: '衣柜', namePinyin: 'yīguì', nameVietnamese: 'Tủ quần áo', category: 'decor', cost: 260, width: 2, height: 2, color: '#451a03' },
  { id: 'painting', nameChinese: '画儿', namePinyin: 'huàr', nameVietnamese: 'Tranh treo tường', category: 'decor', cost: 90, width: 1, height: 1, color: '#a855f7' },
  { id: 'carpet', nameChinese: '地毯', namePinyin: 'dìtǎn', nameVietnamese: 'Thảm trải sàn', category: 'rug', cost: 60, width: 2, height: 2, color: '#ec4899' },
  { id: 'mirror', nameChinese: '镜子', namePinyin: 'jìngzi', nameVietnamese: 'Gương soi', category: 'decor', cost: 70, width: 1, height: 1, color: '#e0f2fe' }
];

export const MATERIAL_ITEMS: MaterialItem[] = [
  { id: 'oak_wood', nameChinese: '橡木', namePinyin: 'xiàngmù', nameVietnamese: 'Gỗ sồi', category: 'wood', cost: 50 },
  { id: 'walnut_wood', nameChinese: '胡桃木', namePinyin: 'hútáomù', nameVietnamese: 'Gỗ óc chó', category: 'wood', cost: 70 },
  { id: 'marble', nameChinese: '大理石', namePinyin: 'dàlǐshí', nameVietnamese: 'Đá cẩm thạch', category: 'stone', cost: 90 },
  { id: 'tempered_glass', nameChinese: '钢化玻璃', namePinyin: 'gānghuà bōli', nameVietnamese: 'Kính cường lực', category: 'glass', cost: 40 },
  { id: 'stainless_steel', nameChinese: '不锈钢', namePinyin: 'bùxiūgāng', nameVietnamese: 'Thép không gỉ', category: 'metal', cost: 60 },
  { id: 'cotton_fabric', nameChinese: '棉布', namePinyin: 'miánbù', nameVietnamese: 'Vải cotton', category: 'fabric', cost: 30 }
];

export const DESIGN_CONTRACTS: DesignContract[] = [
  // CẤP ĐỘ 1: Nhiệm vụ cơ bản
  {
    id: 1,
    level: 1,
    clientName: 'Tiên',
    clientSprite: 'tien',
    title: 'Phòng ngủ học tập màu sắc',
    description: 'Tiên cần thiết kế lại phòng ngủ kết hợp góc học tập của mình. Cô ấy cần một chiếc giường đơn và một chiếc bàn học lớn.',
    promptChinese: '我要一张单人床和一个书桌。',
    promptPinyin: 'Wǒ yào yì zhāng dānrén chuáng hé yí ge shūzhuō.',
    promptVietnamese: 'Tôi muốn một chiếc giường đơn và một chiếc bàn học.',
    targetRequirements: ['single_bed', 'study_desk'],
    rewardCoins: 100,
    rewardScore: 100,
    voucherReward: {
      title: 'CHỨNG CHỈ KIẾN TRÚC SƯ TẬP SỰ',
      description: 'Hoàn thành bản thiết kế đầu tiên! Vy được nhận ngay mã quà tặng khởi đầu này.',
      code: 'ATELIER-START-100'
    }
  },
  {
    id: 2,
    level: 1,
    clientName: 'Ngọc',
    clientSprite: 'ngoc',
    title: 'Góc đọc sách bình yên',
    description: 'Ngọc thích đọc sách bên cạnh cây xanh. Cô ấy cần một chiếc kệ sách lớn và một chậu cây cảnh đặt bên cạnh.',
    promptChinese: '我需要一个书架和一个盆栽。',
    promptPinyin: 'Wǒ xūyào yí ge shūjià hé yí ge pénzāi.',
    promptVietnamese: 'Tôi cần một chiếc kệ sách và một chậu cây cảnh.',
    targetRequirements: ['bookshelf', 'potted_plant'],
    rewardCoins: 120,
    rewardScore: 150
  },

  // CẤP ĐỘ 2: Nhiệm vụ nâng cao
  {
    id: 3,
    level: 2,
    clientName: 'Vy',
    clientSprite: 'vy',
    title: 'Góc làm việc yên bình',
    description: 'Vy cần thiết kế một góc làm việc yên tĩnh và ấm áp. Cô ấy muốn một chiếc bàn gỗ, một chiếc ghế bành êm ái và một chiếc đèn đứng để chiếu sáng ấm.',
    promptChinese: '请给我一个木桌，一个单人沙发和一个落地灯。',
    promptPinyin: 'Qǐng gěi wǒ yí ge mù zhuō, yí ge dānrén shāfā hé yí ge luòdìdēng.',
    promptVietnamese: 'Xin hãy cho tôi một chiếc bàn gỗ, một chiếc ghế bành và một chiếc đèn đứng.',
    targetRequirements: ['wood_table', 'armchair', 'floor_lamp'],
    rewardCoins: 180,
    rewardScore: 250
  },
  {
    id: 4,
    level: 2,
    clientName: 'Vy',
    clientSprite: 'vy',
    title: 'Góc làm việc tiện nghi',
    description: 'Vy bắt đầu làm việc tại nhà. Cô ấy cần một chiếc bàn làm việc, một chiếc ghế xoay văn phòng thoải mái và một cây xương rồng nhỏ trang trí góc bàn.',
    promptChinese: '我想要一个书桌，一个办公椅和一个仙人掌。',
    promptPinyin: 'Wǒ xiǎng yào yí ge shūzhuō, yí ge bàngōng yǐ hé yí ge xiānrénzhǎng.',
    promptVietnamese: 'Tôi muốn có một chiếc bàn học, một chiếc ghế văn phòng và một cây xương rồng.',
    targetRequirements: ['study_desk', 'office_chair', 'cactus'],
    rewardCoins: 200,
    rewardScore: 300
  },

  // CẤP ĐỘ 3: Hợp đồng đặc biệt từ Khang dành cho Vy
  {
    id: 5,
    level: 3,
    clientName: 'Nhựt Khang',
    clientSprite: 'khang',
    title: 'Phòng tân hôn trong mơ',
    description: 'Khang muốn Vy thiết kế một phòng ngủ đôi tuyệt đẹp cho hai đứa mình. Căn phòng cần có một giường đôi ấm áp, một chiếc đèn chùm lộng lẫy và một tấm thảm trải sàn màu hồng.',
    promptChinese: '亲爱的，我想要一个双人床，一个吊灯和一个地毯。',
    promptPinyin: 'Qīn\'ài de, wǒ xiǎng yào yì zhāng shuāngrén chuáng, yí ge diàodēng hé yí ge dìtǎn.',
    promptVietnamese: 'Em yêu, anh muốn có một chiếc giường đôi, một chiếc đèn chùm và một tấm thảm.',
    targetRequirements: ['double_bed', 'chandelier', 'carpet'],
    rewardCoins: 300,
    rewardScore: 500,
    isLoveContract: true,
    voucherReward: {
      title: 'VOUCHER TRÀ SỮA VÔ HẠN CỦA KHANG',
      description: 'Vy nhận được voucher độc quyền từ Khang: Mua 1 ly trà sữa đời thực Khang sẽ tặng 1 ly kèm cái ôm ấm áp!',
      code: 'LOVE-VY-BOBA-FOREVER'
    }
  },
  {
    id: 6,
    level: 3,
    clientName: 'Nhựt Khang',
    clientSprite: 'khang',
    title: 'Góc ban công ngắm sao',
    description: 'Khang muốn Vy trang trí ban công để tối tối hai đứa cùng ngắm sao. Ban công cần có một bộ ghế sofa đơn, một chiếc bàn trà gỗ ấm cúng và một bức tranh phong cảnh lãng mạn.',
    promptChinese: '我们做一个阳台吧，需要一个单人沙发，一个木桌和一幅画儿。',
    promptPinyin: 'Wǒmen zuò yí ge yángtái ba, xūyào yí ge dānrén shāfā, yí ge mù zhuō hé yì fú huàr.',
    promptVietnamese: 'Chúng ta làm một ban công nhé, cần một chiếc ghế bành, một bàn gỗ và một bức tranh.',
    targetRequirements: ['armchair', 'wood_table', 'painting'],
    rewardCoins: 350,
    rewardScore: 600,
    isLoveContract: true,
    voucherReward: {
      title: 'VOUCHER ĐI DẠO PHỐ ĐÊM',
      description: 'Vy được quyền yêu cầu Khang chở đi hóng gió ngắm phố bất kỳ tối nào trong tuần.',
      code: 'LOVE-STAR-WALK-NIGHT'
    }
  }
];

export interface GeneralVocabItem {
  id: string;
  nameChinese: string;
  namePinyin: string;
  nameVietnamese: string;
  hskLevel: number;
  theme?: string;
  exampleChinese?: string;
  examplePinyin?: string;
  exampleVietnamese?: string;
}

export interface GrammarRuleItem {
  id: string;
  title: string;
  structure: string;
  explanation: string;
  exampleChinese: string;
  examplePinyin: string;
  exampleVietnamese: string;
  level: number;
}

export const GENERAL_VOCAB_ITEMS: GeneralVocabItem[] = [
  // HSK 1
  { id: 'gv1', nameChinese: '爱', namePinyin: 'ài', nameVietnamese: 'Yêu, thích', hskLevel: 1, theme: 'Tình cảm', exampleChinese: '我爱我的妈妈。', examplePinyin: 'Wǒ ài wǒ de māma.', exampleVietnamese: 'Tôi yêu mẹ của tôi.' },
  { id: 'gv2', nameChinese: '爱好', namePinyin: 'àihào', nameVietnamese: 'Sở thích', hskLevel: 1, theme: 'Sở thích', exampleChinese: '我的爱好是看书。', examplePinyin: 'Wǒ de àihào shì kànshū.', exampleVietnamese: 'Sở thích của tôi là đọc sách.' },
  { id: 'gv3', nameChinese: '杯子', namePinyin: 'bēizi', nameVietnamese: 'Cái cốc, tách', hskLevel: 1, theme: 'Đồ dùng', exampleChinese: '桌子上有一个杯子。', examplePinyin: 'Zhuōzi shàng yǒu yí ge bēizi.', exampleVietnamese: 'Trên bàn có một cái cốc.' },
  { id: 'gv4', nameChinese: '电脑', namePinyin: 'diànnǎo', nameVietnamese: 'Máy vi tính', hskLevel: 1, theme: 'Công việc', exampleChinese: '我用电脑学习汉语。', examplePinyin: 'Wǒ yòng diànnǎo xuéxí Hànyǔ.', exampleVietnamese: 'Tôi dùng máy tính để học tiếng Trung.' },
  { id: 'gv5', nameChinese: '电视', namePinyin: 'diànshì', nameVietnamese: 'Tivi', hskLevel: 1, theme: 'Giải trí', exampleChinese: '我和家人一起看电视。', examplePinyin: 'Wǒ hé jiārén yìqǐ kàn diànshì.', exampleVietnamese: 'Tôi và gia đình cùng xem tivi.' },
  { id: 'gv6', nameChinese: '电影', namePinyin: 'diànyǐng', nameVietnamese: 'Phim điện ảnh', hskLevel: 1, theme: 'Giải trí', exampleChinese: '这部电影很好看。', examplePinyin: 'Zhè bù diànyǐng hěn hǎokàn.', exampleVietnamese: 'Bộ phim này rất hay.' },
  { id: 'gv7', nameChinese: '东西', namePinyin: 'dōngxi', nameVietnamese: 'Đồ đạc, vật phẩm', hskLevel: 1, theme: 'Đồ dùng', exampleChinese: '你在买什么东西？', examplePinyin: 'Nǐ zài mǎi shénme dōngxi?', exampleVietnamese: 'Bạn đang mua đồ đạc gì thế?' },
  { id: 'gv8', nameChinese: '高兴', namePinyin: 'gāoxìng', nameVietnamese: 'Vui mừng', hskLevel: 1, theme: 'Cảm xúc', exampleChinese: '认识你很高兴！', examplePinyin: 'Rènshi nǐ hěn gāoxìng!', exampleVietnamese: 'Rất vui được làm quen với bạn!' },
  { id: 'gv9', nameChinese: '工作', namePinyin: 'gōngzuò', nameVietnamese: 'Công việc, làm việc', hskLevel: 1, theme: 'Công việc', exampleChinese: '我的工作很忙。', examplePinyin: 'Wǒ de gōngzuò hěn máng.', exampleVietnamese: 'Công việc của tôi rất bận.' },
  { id: 'gv10', nameChinese: '汉语', namePinyin: 'Hànyǔ', nameVietnamese: 'Tiếng Trung', hskLevel: 1, theme: 'Học tập', exampleChinese: '汉语很有意思。', examplePinyin: 'Hànyǔ hěn yǒu yìsi.', exampleVietnamese: 'Tiếng Trung rất thú vị.' },
  { id: 'gv11', nameChinese: '漂亮', namePinyin: 'piàoliang', nameVietnamese: 'Xinh đẹp', hskLevel: 1, theme: 'Mô tả', exampleChinese: '你的衣服真漂亮！', examplePinyin: 'Nǐ de yīfu zhēn piàoliang!', exampleVietnamese: 'Quần áo của bạn thật đẹp!' },
  { id: 'gv12', nameChinese: '认识', namePinyin: 'rènshi', nameVietnamese: 'Nhận biết, làm quen', hskLevel: 1, theme: 'Giao tiếp', exampleChinese: '我们很早以前就认识了。', examplePinyin: 'Wǒmen hěn zǎo yǐqián jiù rènshi le.', exampleVietnamese: 'Chúng tôi quen biết nhau từ rất sớm.' },
  { id: 'gv13', nameChinese: '学生', namePinyin: 'xuéshēng', nameVietnamese: 'Học sinh', hskLevel: 1, theme: 'Học tập', exampleChinese: '我是这所学校的学生。', examplePinyin: 'Wǒ shì zhè suǒ xuéxiào de xuéshēng.', exampleVietnamese: 'Tôi là học sinh của ngôi trường này.' },
  { id: 'gv14', nameChinese: '学习', namePinyin: 'xuéxí', nameVietnamese: 'Học tập', hskLevel: 1, theme: 'Học tập', exampleChinese: '大家都在努力学习。', examplePinyin: 'Dàjiā dōu zài nǔlì xuéxí.', exampleVietnamese: 'Mọi người đều đang cố gắng học tập.' },
  { id: 'gv15', nameChinese: '学校', namePinyin: 'xuéxiào', nameVietnamese: 'Trường học', hskLevel: 1, theme: 'Học tập', exampleChinese: '我们的学校很大。', examplePinyin: 'Wǒmen de xuéxiào hěn dà.', exampleVietnamese: 'Trường học của chúng tôi rất lớn.' },
  { id: 'gv16', nameChinese: '衣服', namePinyin: 'yīfu', nameVietnamese: 'Quần áo', hskLevel: 1, theme: 'Đồ dùng', exampleChinese: '我想买一件新衣服。', examplePinyin: 'Wǒ xiǎng mǎi yí jiàn xīn yīfu.', exampleVietnamese: 'Tôi muốn mua một bộ quần áo mới.' },
  { id: 'gv17', nameChinese: '桌子', namePinyin: 'zhuōzi', nameVietnamese: 'Cái bàn', hskLevel: 1, theme: 'Đồ nội thất', exampleChinese: '房间里有一张木桌子。', examplePinyin: 'Fángjiān lǐ yǒu yì zhāng mù zhuōzi.', exampleVietnamese: 'Trong phòng có một chiếc bàn gỗ.' },
  { id: 'gv18', nameChinese: '椅子', namePinyin: 'yǐzi', nameVietnamese: 'Cái ghế', hskLevel: 1, theme: 'Đồ nội thất', exampleChinese: '请坐在椅子上。', examplePinyin: 'Qǐng zuò zài yǐzi shàng.', exampleVietnamese: 'Xin mời ngồi trên ghế.' },
  { id: 'gv19', nameChinese: '天气', namePinyin: 'tiānqì', nameVietnamese: 'Thời tiết', hskLevel: 1, theme: 'Thời tiết', exampleChinese: ' today 今天的天气非常好。', examplePinyin: 'Jīntiān de tiānqì fēicháng hǎo.', exampleVietnamese: 'Thời tiết hôm nay vô cùng tốt.' },
  { id: 'gv20', nameChinese: '喜欢', namePinyin: 'xǐhuan', nameVietnamese: 'Thích, yêu thích', hskLevel: 1, theme: 'Tình cảm', exampleChinese: '我很喜欢吃中国菜。', examplePinyin: 'Wǒ hěn xǐhuan chī Zhōngguó cài.', exampleVietnamese: 'Tôi rất thích ăn món ăn Trung Quốc.' },
  { id: 'gv21', nameChinese: '谢谢', namePinyin: 'xièxie', nameVietnamese: 'Cảm ơn', hskLevel: 1, theme: 'Giao tiếp', exampleChinese: '非常谢谢你的帮助！', examplePinyin: 'Fēicháng xièxie nǐ de bāngzhù!', exampleVietnamese: 'Vô cùng cảm ơn sự giúp đỡ của bạn!' },
  { id: 'gv22', nameChinese: '再见', namePinyin: 'zàijiàn', nameVietnamese: 'Tạm biệt', hskLevel: 1, theme: 'Giao tiếp', exampleChinese: '老师，再见！', examplePinyin: 'Lǎoshī, zàijiàn!', exampleVietnamese: 'Thầy cô giáo, tạm biệt!' },
  { id: 'gv23', nameChinese: '昨天', namePinyin: 'zuótiān', nameVietnamese: 'Hôm qua', hskLevel: 1, theme: 'Thời gian', exampleChinese: '昨天我去图书馆了。', examplePinyin: 'Zuótiān wǒ qù túshūguǎn le.', exampleVietnamese: 'Hôm qua tôi đã đi thư viện.' },
  { id: 'gv24', nameChinese: '今天', namePinyin: 'jīntiān', nameVietnamese: 'Hôm nay', hskLevel: 1, theme: 'Thời gian', exampleChinese: '今天我们要开会。', examplePinyin: 'Jīntiān wǒmen yào kāihuì.', exampleVietnamese: 'Hôm nay chúng tôi phải họp.' },
  { id: 'gv25', nameChinese: '明天', namePinyin: 'míngtiān', nameVietnamese: 'Ngày mai', hskLevel: 1, theme: 'Thời gian', exampleChinese: '明天我们一起去公园吧。', examplePinyin: 'Míngtiān wǒmen yìqǐ qù gōngyuán ba.', exampleVietnamese: 'Ngày mai chúng ta cùng đi công viên nhé.' },

  // HSK 2
  { id: 'gv26', nameChinese: '爱情', namePinyin: 'àiqíng', nameVietnamese: 'Tình yêu', hskLevel: 2, theme: 'Tình cảm', exampleChinese: '他们的爱情故事很感人。', examplePinyin: 'Tāmen de àiqíng gùshi hěn gǎnrén.', exampleVietnamese: 'Câu chuyện tình yêu của họ rất cảm động.' },
  { id: 'gv27', nameChinese: '安静', namePinyin: 'ānjìng', nameVietnamese: 'Yên tĩnh', hskLevel: 2, theme: 'Mô tả', exampleChinese: '图书馆里非常安静。', examplePinyin: 'Túshūguǎn lǐ fēicháng ānjìng.', exampleVietnamese: 'Trong thư viện vô cùng yên tĩnh.' },
  { id: 'gv28', nameChinese: '白色', namePinyin: 'báisè', nameVietnamese: 'Màu trắng', hskLevel: 2, theme: 'Màu sắc', exampleChinese: '我喜欢穿白色的衬衫。', examplePinyin: 'Wǒ xǐhuan chuān báisè de chènshān.', exampleVietnamese: 'Tôi thích mặc áo sơ mi màu trắng.' },
  { id: 'gv29', nameChinese: '帮助', namePinyin: 'bāngzhù', nameVietnamese: 'Giúp đỡ', hskLevel: 2, theme: 'Giao tiếp', exampleChinese: '谢谢你一直以来的帮助。', examplePinyin: 'Xièxie nǐ yìzhí yǐlái de bāngzhù.', exampleVietnamese: 'Cảm ơn sự giúp đỡ của bạn trong suốt thời gian qua.' },
  { id: 'gv30', nameChinese: '报纸', namePinyin: 'bàozhǐ', nameVietnamese: 'Báo chí', hskLevel: 2, theme: 'Tin tức', exampleChinese: '爸爸早上喜欢看报纸。', examplePinyin: 'Bàba zǎoshang xǐhuan kàn bàozhǐ.', exampleVietnamese: 'Bố tôi thích đọc báo vào buổi sáng.' },
  { id: 'gv31', nameChinese: '唱歌', namePinyin: 'chànggē', nameVietnamese: 'Ca hát', hskLevel: 2, theme: 'Giải trí', exampleChinese: '周末我们一起去唱歌吧。', examplePinyin: 'Zhōumò wǒmen yìqǐ qù chànggē ba.', exampleVietnamese: 'Cuối tuần chúng ta cùng đi hát hò nhé.' },
  { id: 'gv32', nameChinese: '穿', namePinyin: 'chuān', nameVietnamese: 'Mặc quần áo', hskLevel: 2, theme: 'Đời sống', exampleChinese: '天气冷了，多穿衣服。', examplePinyin: 'Tiānqì lěng le, duō chuān yīfu.', exampleVietnamese: 'Trời lạnh rồi, mặc thêm nhiều quần áo vào.' },
  { id: 'gv33', nameChinese: '错', namePinyin: 'cuò', nameVietnamese: 'Sai, nhầm lẫn', hskLevel: 2, theme: 'Mô tả', exampleChinese: '这个问题你做错了。', examplePinyin: 'Zhè ge wèntí nǐ zuò cuò le.', exampleVietnamese: 'Câu hỏi này bạn làm sai rồi.' },
  { id: 'gv34', nameChinese: '大家', namePinyin: 'dàjiā', nameVietnamese: 'Mọi người', hskLevel: 2, theme: 'Giao tiếp', exampleChinese: '请大家安静，准备开会。', examplePinyin: 'Qǐng dàjiā ānjìng, zhǔnbèi kāihuì.', exampleVietnamese: 'Xin mọi người trật tự, chuẩn bị họp.' },
  { id: 'gv35', nameChinese: '懂', namePinyin: 'dǒng', nameVietnamese: 'Hiểu', hskLevel: 2, theme: 'Học tập', exampleChinese: '这句话你听懂了吗？', examplePinyin: 'Zhè jù huà nǐ tīng dǒng le ma?', exampleVietnamese: 'Câu nói này bạn nghe có hiểu không?' },
  { id: 'gv36', nameChinese: '房间', namePinyin: 'fángjiān', nameVietnamese: 'Căn phòng', hskLevel: 2, theme: 'Đồ nội thất', exampleChinese: '我的房间收拾得很干净。', examplePinyin: 'Wǒ de fángjiān shōushi de hěn gānjìng.', exampleVietnamese: 'Căn phòng của tôi dọn dẹp rất sạch sẽ.' },
  { id: 'gv37', nameChinese: '非常', namePinyin: 'fēicháng', nameVietnamese: 'Vô cùng', hskLevel: 2, theme: 'Mô tả', exampleChinese: '今天天气非常好。', examplePinyin: 'Jīntiān tiānqì fēicháng hǎo.', exampleVietnamese: 'Thời tiết hôm nay vô cùng tốt.' },
  { id: 'gv38', nameChinese: '贵', namePinyin: 'guì', nameVietnamese: 'Đắt đỏ', hskLevel: 2, theme: 'Mua sắm', exampleChinese: '这件衣服太贵了。', examplePinyin: 'Zhè jiàn yīfu tài guì le.', exampleVietnamese: 'Bộ quần áo này đắt quá.' },
  { id: 'gv39', nameChinese: '孩子', namePinyin: 'háizi', nameVietnamese: 'Trẻ con', hskLevel: 2, theme: 'Gia đình', exampleChinese: '孩子们在花园里玩耍。', examplePinyin: 'Háizimen zài huāyuán lǐ wánshuǎ.', exampleVietnamese: 'Bọn trẻ đang vui chơi trong khu vườn.' },
  { id: 'gv40', nameChinese: '好吃', namePinyin: 'hǎochī', nameVietnamese: 'Ngon miệng', hskLevel: 2, theme: 'Ăn uống', exampleChinese: '妈妈做的菜非常好吃。', examplePinyin: 'Māma zuò de cài fēicháng hǎochī.', exampleVietnamese: 'Món ăn mẹ nấu rất là ngon.' },
  { id: 'gv41', nameChinese: '黑色', namePinyin: 'hēisè', nameVietnamese: 'Màu đen', hskLevel: 2, theme: 'Màu sắc', exampleChinese: '他买了一辆黑色的汽车。', examplePinyin: 'Tā mǎi le yí liàng hēisè de qìchē.', exampleVietnamese: 'Anh ấy đã mua một chiếc xe ô tô màu đen.' },
  { id: 'gv42', nameChinese: '红色', namePinyin: 'hóngsè', nameVietnamese: 'Màu đỏ', hskLevel: 2, theme: 'Màu sắc', exampleChinese: '过年的时候大家喜欢红色。', examplePinyin: 'Guònián de shíhou dàjiā xǐhuan hóngsè.', exampleVietnamese: 'Mỗi khi Tết đến mọi người rất thích màu đỏ.' },
  { id: 'gv43', nameChinese: '回答', namePinyin: 'huídá', nameVietnamese: 'Trả lời', hskLevel: 2, theme: 'Giao tiếp', exampleChinese: '请回答我的问题。', examplePinyin: 'Qǐng huídá wǒ de wèntí.', exampleVietnamese: 'Xin hãy trả lời câu hỏi của tôi.' },
  { id: 'gv44', nameChinese: '介绍', namePinyin: 'jièshào', nameVietnamese: 'Giới thiệu', hskLevel: 2, theme: 'Giao tiếp', exampleChinese: '让我给你介绍一下新朋友。', examplePinyin: 'Ràng wǒ gěi nǐ jièshào yíxià xīn péngyou.', exampleVietnamese: 'Để tôi giới thiệu người bạn mới cho bạn nhé.' },
  { id: 'gv45', nameChinese: '咖啡', namePinyin: 'kāfēi', nameVietnamese: 'Cà phê', hskLevel: 2, theme: 'Ăn uống', exampleChinese: '早上我习惯喝一杯热咖啡。', examplePinyin: 'Zǎoshang wǒ xíguàn hē yì bēi rè kāfēi.', exampleVietnamese: 'Buổi sáng tôi có thói quen uống một cốc cà phê nóng.' },
  { id: 'gv46', nameChinese: '开始', namePinyin: 'kāishǐ', nameVietnamese: 'Bắt đầu', hskLevel: 2, theme: 'Học tập', exampleChinese: '会议在八点钟正式开始。', examplePinyin: 'Huìyì zài bā diǎn zhōng zhèngshì kāishǐ.', exampleVietnamese: 'Cuộc họp chính thức bắt đầu lúc 8 giờ.' },
  { id: 'gv47', nameChinese: '快乐', namePinyin: 'kuàilè', nameVietnamese: 'Vui vẻ', hskLevel: 2, theme: 'Cảm xúc', exampleChinese: '祝你生日快乐！', examplePinyin: 'Zhù nǐ shēngrì kuàilè!', exampleVietnamese: 'Chúc bạn sinh nhật vui vẻ!' },
  { id: 'gv48', nameChinese: '累', namePinyin: 'lèi', nameVietnamese: 'Mệt mỏi', hskLevel: 2, theme: 'Cảm xúc', exampleChinese: '工作了一整天，我很累。', examplePinyin: 'Gōngzuò le yì zhěng tiān, wǒ hěn lèi.', exampleVietnamese: 'Làm việc cả một ngày dài, tôi rất mệt.' },
  { id: 'gv49', nameChinese: '便宜', namePinyin: 'piányi', nameVietnamese: 'Giá rẻ', hskLevel: 2, theme: 'Mua sắm', exampleChinese: '超市里的水果很便宜。', examplePinyin: 'Chāoshì lǐ de shuǐguǒ hěn piányi.', exampleVietnamese: 'Hoa quả trong siêu thị rất rẻ.' },
  { id: 'gv50', nameChinese: '希望', namePinyin: 'xīwàng', nameVietnamese: 'Hy vọng', hskLevel: 2, theme: 'Cảm xúc', exampleChinese: '希望你考试取得好成绩。', examplePinyin: 'Xīwàng nǐ kǎoshì qǔdé hǎo chéngjì.', exampleVietnamese: 'Hy vọng bạn thi đạt thành tích tốt.' },
  { id: 'gv51', nameChinese: '休息', namePinyin: 'xiūxi', nameVietnamese: 'Nghỉ ngơi', hskLevel: 2, theme: 'Đời sống', exampleChinese: '累了就早点儿休息吧。', examplePinyin: 'Lèi le jiù zǎodiǎnr xiūxi ba.', exampleVietnamese: 'Mệt rồi thì đi nghỉ sớm đi nhé.' },
  { id: 'gv52', nameChinese: '颜色', namePinyin: 'yánsè', nameVietnamese: 'Màu sắc', hskLevel: 2, theme: 'Màu sắc', exampleChinese: '你喜欢什么颜色的桌子？', examplePinyin: 'Nǐ xǐhuan shénme yánsè de zhuōzi?', exampleVietnamese: 'Bạn thích bàn màu sắc gì?' },
  { id: 'gv53', nameChinese: '眼睛', namePinyin: 'yǎnjing', nameVietnamese: 'Đôi mắt', hskLevel: 2, theme: 'Mô tả', exampleChinese: '她的眼睛又大又亮。', examplePinyin: 'Tā de yǎnjing yòu dà yòu liàng.', exampleVietnamese: 'Đôi mắt cô ấy vừa to vừa sáng.' },
  { id: 'gv54', nameChinese: '准备', namePinyin: 'zhǔnbèi', nameVietnamese: 'Chuẩn bị', hskLevel: 2, theme: 'Công việc', exampleChinese: '我已经准备好出发了。', examplePinyin: 'Wǒ yǐjīng zhǔnbèi hǎo chūfā le.', exampleVietnamese: 'Tôi đã chuẩn bị sẵn sàng để xuất phát.' },
  { id: 'gv55', nameChinese: '知道', namePinyin: 'zhīdào', nameVietnamese: 'Biết, hiểu rõ', hskLevel: 2, theme: 'Giao tiếp', exampleChinese: '我知道这件事怎么处理。', examplePinyin: 'Wǒ zhīdào zhè jiàn shì zěnme chǔlǐ.', exampleVietnamese: 'Tôi biết việc này xử lý như thế nào.' },

  // HSK 3
  { id: 'gv56', nameChinese: '办法', namePinyin: 'bànfǎ', nameVietnamese: 'Biện pháp', hskLevel: 3, theme: 'Công việc', exampleChinese: '这个办法非常有效。', examplePinyin: 'Zhè ge bànfǎ fēicháng yǒuxiào.', exampleVietnamese: 'Biện pháp này vô cùng hiệu quả.' },
  { id: 'gv57', nameChinese: '办公室', namePinyin: 'bàngōngshì', nameVietnamese: 'Phòng làm việc', hskLevel: 3, theme: 'Công việc', exampleChinese: '我们在办公室开会。', examplePinyin: 'Wǒmen zài bàngōngshì kāihuì.', exampleVietnamese: 'Chúng tôi họp trong phòng làm việc.' },
  { id: 'gv58', nameChinese: '笔记本', namePinyin: 'bǐjìběn', nameVietnamese: 'Sổ ghi chép', hskLevel: 3, theme: 'Học tập', exampleChinese: '请把要点记在笔记本上。', examplePinyin: 'Qǐng bǎ yàodiǎn jì zài bǐjìběn shàng.', exampleVietnamese: 'Xin hãy ghi các ý chính vào sổ ghi chép.' },
  { id: 'gv59', nameChinese: '冰箱', namePinyin: 'bīngxiāng', nameVietnamese: 'Tủ lạnh', hskLevel: 3, theme: 'Đồ dùng', exampleChinese: '冰箱里有很多新鲜水果。', examplePinyin: 'Bīngxiāng lǐ yǒu hěn duō xīnxiān shuǐguǒ.', exampleVietnamese: 'Trong tủ lạnh có rất nhiều hoa quả tươi.' },
  { id: 'gv60', nameChinese: '聪明', namePinyin: 'cōngming', nameVietnamese: 'Thông minh', hskLevel: 3, theme: 'Mô tả', exampleChinese: '这个孩子非常聪明。', examplePinyin: 'Zhè ge háizi fēicháng cōngming.', exampleVietnamese: 'Đứa trẻ này rất thông minh.' },
  { id: 'gv61', nameChinese: '经常', namePinyin: 'jīngcháng', nameVietnamese: 'Thường xuyên', hskLevel: 3, theme: 'Đời sống', exampleChinese: '我经常去公园跑步。', examplePinyin: 'Wǒ jīngcháng qù gōngyuán pǎobù.', exampleVietnamese: 'Tôi thường xuyên đi công viên chạy bộ.' },
  { id: 'gv62', nameChinese: '简单', namePinyin: 'jiǎndān', nameVietnamese: 'Đơn giản', hskLevel: 3, theme: 'Mô tả', exampleChinese: '这道题其实很简单。', examplePinyin: 'Zhè dào tí qíshí hěn jiǎndān.', exampleVietnamese: 'Bài tập này thực ra rất đơn giản.' },
  { id: 'gv63', nameChinese: '努力', namePinyin: 'nǔlì', nameVietnamese: 'Nỗ lực cố gắng', hskLevel: 3, theme: 'Học tập', exampleChinese: '只要努力，就一定能成功。', examplePinyin: 'Zhǐyào nǔlì, jiù yídìng néng chénggōng.', exampleVietnamese: 'Chỉ cần nỗ lực, nhất định sẽ thành công.' },
  { id: 'gv64', nameChinese: '热情', namePinyin: 'rèqíng', nameVietnamese: 'Nhiệt tình', hskLevel: 3, theme: 'Giao tiếp', exampleChinese: '大家热情地欢迎新同事。', examplePinyin: 'Dàjiā rèqíng de huānyíng xīn tóngshì.', exampleVietnamese: 'Mọi người nhiệt tình chào đón đồng nghiệp mới.' },
  { id: 'gv65', nameChinese: '世界', namePinyin: 'shìjiè', nameVietnamese: 'Thế giới', hskLevel: 3, theme: 'Đời sống', exampleChinese: '我想去环游世界。', examplePinyin: 'Wǒ xiǎng qù huányóu shìjiè.', exampleVietnamese: 'Tôi muốn đi du lịch vòng quanh thế giới.' },
  { id: 'gv66', nameChinese: '习惯', namePinyin: 'xíguàn', nameVietnamese: 'Thói quen', hskLevel: 3, theme: 'Đời sống', exampleChinese: '早起是一个好习惯。', examplePinyin: 'Zǎoqǐ shì yí ge hǎo xíguàn.', exampleVietnamese: 'Dậy sớm là một thói quen tốt.' },
  { id: 'gv67', nameChinese: '选择', namePinyin: 'xuǎnzé', nameVietnamese: 'Lựa chọn', hskLevel: 3, theme: 'Công việc', exampleChinese: '这是你自己的选择。', examplePinyin: 'Zhè shì nǐ zìjǐ de xuǎnzé.', exampleVietnamese: 'Đây là sự lựa chọn của chính bạn.' },
  { id: 'gv68', nameChinese: '要求', namePinyin: 'yāoqiú', nameVietnamese: 'Yêu cầu', hskLevel: 3, theme: 'Công việc', exampleChinese: '老板提出了更高的要求。', examplePinyin: 'Lǎobǎn tíchū le gèng gāo de yāoqiú.', exampleVietnamese: 'Sếp đã đưa ra những yêu cầu cao hơn.' },
  { id: 'gv69', nameChinese: '影响', namePinyin: 'yǐngxiǎng', nameVietnamese: 'Ảnh hưởng', hskLevel: 3, theme: 'Mô tả', exampleChinese: '环境对人的影响很大。', examplePinyin: 'Huánjìng duì rén de yǐngxiǎng hěn dà.', exampleVietnamese: 'Môi trường có ảnh hưởng rất lớn tới con người.' },
  { id: 'gv70', nameChinese: '游戏', namePinyin: 'yóuxì', nameVietnamese: 'Trò chơi', hskLevel: 3, theme: 'Giải trí', exampleChinese: '我们一起玩电脑游戏吧。', examplePinyin: 'Wǒmen yìqǐ wán diànnǎo yóuxì ba.', exampleVietnamese: 'Chúng ta cùng chơi game vi tính nhé.' },
  { id: 'gv71', nameChinese: '愿意', namePinyin: 'yuànyì', nameVietnamese: 'Sẵn lòng', hskLevel: 3, theme: 'Tình cảm', exampleChinese: '我愿意帮助你。', examplePinyin: 'Wǒ yuànyì bāngzhù nǐ.', exampleVietnamese: 'Tôi sẵn lòng giúp đỡ bạn.' },
  { id: 'gv72', nameChinese: '着急', namePinyin: 'zhāojí', nameVietnamese: 'Sốt ruột, lo lắng', hskLevel: 3, theme: 'Cảm xúc', exampleChinese: '别着急，慢慢来。', examplePinyin: 'Bié zhāojí, mànman lái.', exampleVietnamese: 'Đừng lo lắng, từ từ làm nhé.' },
  { id: 'gv73', nameChinese: '重要', namePinyin: 'zhòngyào', nameVietnamese: 'Quan trọng', hskLevel: 3, theme: 'Mô tả', exampleChinese: '健康比金钱更重要。', examplePinyin: 'Jiànkāng bǐ jīnqián gèng zhòngyào.', exampleVietnamese: 'Sức khỏe quan trọng hơn tiền bạc.' },
  { id: 'gv74', nameChinese: '注意', namePinyin: 'zhùyì', nameVietnamese: 'Chú ý', hskLevel: 3, theme: 'Giao tiếp', exampleChinese: '过马路要多加注意。', examplePinyin: 'Guò mǎlù yào duō jiā zhùyì.', exampleVietnamese: 'Sang đường phải hết sức chú ý.' },
  { id: 'gv75', nameChinese: '满意', namePinyin: 'mǎnyì', nameVietnamese: 'Hài lòng', hskLevel: 3, theme: 'Cảm xúc', exampleChinese: '客户对我们的设计非常满意。', examplePinyin: 'Kèhù duì wǒmen de shèjì fēicháng mǎnyì.', exampleVietnamese: 'Khách hàng vô cùng hài lòng với thiết kế của chúng tôi.' }
];

export const HSK_GRAMMAR_RULES: GrammarRuleItem[] = [
  {
    id: 'g1',
    title: 'Trợ từ sở hữu "的" (de)',
    structure: 'Định ngữ + 的 + Trung tâm ngữ',
    explanation: 'Dùng để biểu thị mối quan hệ sở hữu, tính chất hạn định của định ngữ với trung tâm ngữ phía sau.',
    exampleChinese: '这是我的书。',
    examplePinyin: 'Zhè shì wǒ de shū.',
    exampleVietnamese: 'Đây là sách của tôi.',
    level: 1
  },
  {
    id: 'g2',
    title: 'Câu hỏi dùng trợ từ "吗" (ma)',
    structure: 'Chủ ngữ + Vị ngữ + 吗？',
    explanation: 'Đặt ở cuối câu trần thuật để biến câu đó thành câu nghi vấn (Có/Không).',
    exampleChinese: '你好吗？',
    examplePinyin: 'Nǐ hǎo ma?',
    exampleVietnamese: 'Bạn khỏe không?',
    level: 1
  },
  {
    id: 'g3',
    title: 'Đại từ nghi vấn "什么" (shénme)',
    structure: 'Động từ + 什么 (+ Danh từ)？',
    explanation: 'Dùng hỏi về sự vật, đồ đạc: "Cái gì", "Gì".',
    exampleChinese: '你喜欢吃什么菜？',
    examplePinyin: 'Nǐ xǐhuān chī shénme cài?',
    exampleVietnamese: 'Bạn thích ăn món ăn gì?',
    level: 1
  },
  {
    id: 'g4',
    title: 'Biểu thị sự so sánh "比" (bǐ)',
    structure: 'A + 比 + B + Tính từ',
    explanation: 'Dùng để so sánh tính chất giữa hai đối tượng A và B (A hơn B về thuộc tính nào đó).',
    exampleChinese: '今天比昨天热。',
    examplePinyin: 'Jīntiān bǐ zuótiān rè.',
    exampleVietnamese: 'Hôm nay nóng hơn hôm qua.',
    level: 2
  },
  {
    id: 'g5',
    title: 'Cấu trúc nhượng bộ "虽然...但是..." (suīrán...dànshì...)',
    structure: 'Chủ ngữ + 虽然...， Chế ngữ + 但是...',
    explanation: 'Liên kết câu phức chỉ mối quan hệ tương phản phản bác: "Tuy... nhưng...".',
    exampleChinese: '虽然汉语很难，但是我很喜欢。',
    examplePinyin: 'Suīrán Hànyǔ hěn nán, dànshì wǒ hěn xǐhuān.',
    exampleVietnamese: 'Tuy tiếng Trung rất khó, nhưng tôi rất thích.',
    level: 2
  },
  {
    id: 'g6',
    title: 'Cấu trúc nguyên nhân - kết quả "因为...所以..." (yīnwèi...suǒyǐ...)',
    structure: '因为...， 所以...',
    explanation: 'Biểu thị mối quan hệ nhân quả trong câu phức: "Bởi vì... cho nên...".',
    exampleChinese: '因为下雨，所以我们没去学校。',
    examplePinyin: 'Yīnwèi xià yǔ, suǒyǐ wǒmen méi qù xuéxiào.',
    exampleVietnamese: 'Bởi vì trời mưa, cho nên chúng tôi không đi học.',
    level: 2
  }
];
