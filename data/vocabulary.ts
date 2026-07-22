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
      description: 'Hoàn thành bản thiết kế đầu tiên! Bạn nhận được ngay mã quà tặng khởi đầu này.',
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
    rewardScore: 150,
    voucherReward: {
      title: 'VOUCHER KHUYẾN MÃI NỘI THẤT HSK',
      description: 'Mở khóa ưu đãi giảm 20% Xu sắm kệ sách & cây cảnh trang trí phòng đọc.',
      code: 'HSK-DECOR-DISCOUNT-20'
    }
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
    rewardScore: 250,
    voucherReward: {
      title: 'VOUCHER KHÔNG GIAN SỐNG XANH',
      description: 'Mở khóa bộ cây cảnh và thảm pixel cao cấp cho mọi căn phòng.',
      code: 'GREEN-LIVING-DECOR-FREE'
    }
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
    rewardScore: 300,
    voucherReward: {
      title: 'HUY HIỆU NHÀ THIẾT KẾ XUẤT SẮC',
      description: 'Huy hiệu thành tựu công nhận tay nghề thiết kế phòng làm việc HSK đỉnh cao.',
      code: 'MASTER-DESIGNER-BADGE'
    }
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
  // --- AUTO-PUMPED BOT VOCABULARY HSK 1-2-3 ---
  { id: 'hsk1_26', nameChinese: '妈妈', namePinyin: 'māma', nameVietnamese: 'Mẹ', hskLevel: 1, theme: 'Gia đình', exampleChinese: '我妈妈做饭很好吃。', examplePinyin: 'Wǒ māma zuòfàn hěn hǎochī.', exampleVietnamese: 'Mẹ tôi nấu ăn rất ngon.' },
  { id: 'hsk1_27', nameChinese: '爸爸', namePinyin: 'bàba', nameVietnamese: 'Bố, ba', hskLevel: 1, theme: 'Gia đình', exampleChinese: '爸爸看报纸。', examplePinyin: 'Bàba kàn bàozhǐ.', exampleVietnamese: 'Bố xem báo chí.' },
  { id: 'hsk1_28', nameChinese: '儿子', namePinyin: 'érzi', nameVietnamese: 'Con trai', hskLevel: 1, theme: 'Gia đình', exampleChinese: '我有一个儿子。', examplePinyin: 'Wǒ yǒu yí ge érzi.', exampleVietnamese: 'Tôi có một người con trai.' },
  { id: 'hsk1_29', nameChinese: '女儿', namePinyin: 'nǚ\'ér', nameVietnamese: 'Con gái', hskLevel: 1, theme: 'Gia đình', exampleChinese: '我的女儿喜欢看书。', examplePinyin: 'Wǒ de nǚ\'ér xǐhuan kànshū.', exampleVietnamese: 'Con gái của tôi thích đọc sách.' },
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
  { id: 'hsk1_40', nameChinese: '狗', namePinyin: 'gǒu', nameVietnamese: 'Con chó', hskLevel: 1, theme: 'Động vật', exampleChinese: '我家有一条可爱的小狗。', examplePinyin: 'Wǒ jiā yǒu yì tiáo kě\'ài de xiǎogǒu.', exampleVietnamese: 'Nhà tôi có một chú chó nhỏ đáng yêu.' },
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
  { id: 'hsk3_45', nameChinese: '护照', namePinyin: 'hùzhào', nameVietnamese: 'Hộ chiếu', hskLevel: 3, theme: 'Du lịch', exampleChinese: '出国需要带好护照。', examplePinyin: 'Chūguó xūyào dài hǎo hùzhào.', exampleVietnamese: 'Đi nước ngoài cần mang theo hộ chiếu.' },

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
  { id: 'gv44', nameChinese: '介绍', namePinyin: 'jièshào', nameVietnamese: 'Giới thiệu', hskLevel: 2, theme: 'Giao tiếp', exampleChinese: '让我给你介绍一下新朋友。', examplePinyin: 'Ràng wǒ gěi nǐ jièshào yíxià xīn péngyou.', exampleVietnamese: 'Để tôi giới thiệu người bạn mới cho bạn nhé.' },
  
  // HSK 4
  { id: 'hsk4_1', nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'Sắp xếp, an bài', hskLevel: 4, theme: 'Công việc', exampleChinese: '我们安排好时间去旅行。', examplePinyin: 'Wǒmen ānpái hǎo shíjiān qù lǚxíng.', exampleVietnamese: 'Chúng tôi sắp xếp sẵn thời gian để đi du lịch.' },
  { id: 'hsk4_2', nameChinese: '保证', namePinyin: 'bǎozhèng', nameVietnamese: 'Bảo đảm, cam kết', hskLevel: 4, theme: 'Công việc', exampleChinese: '我保证准时完成任务。', examplePinyin: 'Wǒ bǎozhèng zhǔnshí wánchéng rènwu.', exampleVietnamese: 'Tôi đảm bảo sẽ hoàn thành nhiệm vụ đúng giờ.' },
  { id: 'hsk4_3', nameChinese: '报名', namePinyin: 'bàomíng', nameVietnamese: 'Đăng ký', hskLevel: 4, theme: 'Học tập', exampleChinese: '大家踊跃报名参加比赛。', examplePinyin: 'Dàjiā yǒngyuè bàomíng cānjiā bǐsài.', exampleVietnamese: 'Mọi người hăng hái đăng ký tham gia cuộc thi.' },
  { id: 'hsk4_4', nameChinese: '毕业', namePinyin: 'bìyè', nameVietnamese: 'Tốt nghiệp', hskLevel: 4, theme: 'Học tập', exampleChinese: '祝贺你顺利大学毕业！', examplePinyin: 'Zhùhè nǐ shùnlì dàxué bìyè!', exampleVietnamese: 'Chúc mừng bạn thuận lợi tốt nghiệp đại học!' },
  { id: 'hsk4_5', nameChinese: '成功', namePinyin: 'chénggōng', nameVietnamese: 'Thành công', hskLevel: 4, theme: 'Công việc', exampleChinese: '坚持努力就一定会成功。', examplePinyin: 'Jiānchí nǔlì jiù yídìng huì chénggōng.', exampleVietnamese: 'Kiên trì nỗ lực nhất định sẽ thành công.' },
  { id: 'hsk4_6', nameChinese: '态度', namePinyin: 'tàidu', nameVietnamese: 'Thái độ', hskLevel: 4, theme: 'Giao tiếp', exampleChinese: '学习态度决定最终成绩。', examplePinyin: 'Xuéxí tàidu juédìng zuìzhōng chéngjì.', exampleVietnamese: 'Thái độ học tập quyết định kết quả cuối cùng.' },
  { id: 'hsk4_7', nameChinese: '改变', namePinyin: 'gǎibiàn', nameVietnamese: 'Thay đổi', hskLevel: 4, theme: 'Đời sống', exampleChinese: '努力可以改变命运。', examplePinyin: 'Nǔlì kěyǐ gǎibiàn mìngyùn.', exampleVietnamese: 'Nỗ lực có thể thay đổi vận mệnh.' },
  { id: 'hsk4_8', nameChinese: '包含', namePinyin: 'bāohán', nameVietnamese: 'Bao hàm, chứa đựng', hskLevel: 4, theme: 'Công việc', exampleChinese: '这份合同包含详细条款。', examplePinyin: 'Zhè fèn hétong bāohán xiángxì tiáokuǎn.', exampleVietnamese: 'Hợp đồng này chứa đựng các điều khoản chi tiết.' },
  { id: 'hsk4_9', nameChinese: '鼓励', namePinyin: 'gǔlì', nameVietnamese: 'Khích lệ, động viên', hskLevel: 4, theme: 'Giao tiếp', exampleChinese: '老师常常鼓励我们多发言。', examplePinyin: 'Lǎoshī chángcháng gǔlì wǒmen duō fāyán.', exampleVietnamese: 'Thầy giáo thường xuyên khích lệ chúng tôi phát biểu.' },
  { id: 'hsk4_10', nameChinese: '获得', namePinyin: 'huòdé', nameVietnamese: 'Gặt hái, nhận được', hskLevel: 4, theme: 'Thành tựu', exampleChinese: '他获得了比赛第一名。', examplePinyin: 'Tā huòdé le bǐsài dì-yī míng.', exampleVietnamese: 'Anh ấy đã gặt hái được vị trí thứ nhất trong cuộc thi.' },
  { id: 'hsk4_11', nameChinese: '交流', namePinyin: 'jiāoliú', nameVietnamese: 'Giao lưu, trao đổi', hskLevel: 4, theme: 'Giao tiếp', exampleChinese: '语言是交流 bridge 的工具。', examplePinyin: 'Yǔyán shì jiāoliú de gōngjù.', exampleVietnamese: 'Ngôn ngữ là công cụ để giao lưu kết nối.' },
  { id: 'hsk4_12', nameChinese: '竞争', namePinyin: 'jìngzhēng', nameVietnamese: 'Cạnh tranh', hskLevel: 4, theme: 'Công việc', exampleChinese: '市场竞争非常激烈。', examplePinyin: 'Shìchǎng jìngzhēng fēicháng jīliè.', exampleVietnamese: 'Cạnh tranh thị trường rất khốc liệt.' },
  { id: 'hsk4_13', nameChinese: '严格', namePinyin: 'yángé', nameVietnamese: 'Nghiêm khắc, nghiêm ngặt', hskLevel: 4, theme: 'Mô tả', exampleChinese: '施工标准非常严格。', examplePinyin: 'Shīgōng biāozhǔn fēicháng yángé.', exampleVietnamese: 'Tiêu chuẩn thi công vô cùng nghiêm ngặt.' },
  { id: 'hsk4_14', nameChinese: '专业', namePinyin: 'zhuānyè', nameVietnamese: 'Chuyên nghiệp, chuyên ngành', hskLevel: 4, theme: 'Công việc', exampleChinese: '他的表现非常专业。', examplePinyin: 'Tā de biǎoxiàn fēicháng zhuānyè.', exampleVietnamese: 'Biểu hiện của anh ấy rất chuyên nghiệp.' },
  { id: 'hsk4_15', nameChinese: '支持', namePinyin: 'zhīchí', nameVietnamese: 'Ủng hộ, hỗ trợ', hskLevel: 4, theme: 'Giao tiếp', exampleChinese: '感谢你的支持与信任。', examplePinyin: 'Gǎnxiè nǐ de zhīchí yǔ xìnrèn.', exampleVietnamese: 'Cảm ơn sự ủng hộ và tin tưởng của bạn.' },

  // HSK 5
  { id: 'hsk5_1', nameChinese: '把握', namePinyin: 'bǎwò', nameVietnamese: 'Nắm bắt, thấu hiểu', hskLevel: 5, theme: 'Công việc', exampleChinese: '我们要把握住这次创业机会。', examplePinyin: 'Wǒmen yào bǎwò zhù zhè cì chuàngyè jīhuì.', exampleVietnamese: 'Chúng ta phải nắm bắt cơ hội khởi nghiệp lần này.' },
  { id: 'hsk5_2', nameChinese: '具备', namePinyin: 'jùbèi', nameVietnamese: 'Trang bị đủ, có đủ', hskLevel: 5, theme: 'Công việc', exampleChinese: '他具备出色的设计专业能力。', examplePinyin: 'Tā jùbèi chūsè de shèjì zhuānyè nénglì.', exampleVietnamese: 'Anh ấy có đủ năng lực chuyên môn thiết kế xuất sắc.' },
  { id: 'hsk5_3', nameChinese: '追求', namePinyin: 'zhuīqiú', nameVietnamese: 'Mưu cầu, theo đuổi', hskLevel: 5, theme: 'Đời sống', exampleChinese: '追求卓越是每个人的梦想。', examplePinyin: 'Zhuīqiú zhuóyuè shì měi ge rén de mèngxiǎng.', exampleVietnamese: 'Theo đuổi sự vượt trội là giấc mơ của mỗi người.' },
  { id: 'hsk5_4', nameChinese: '逻辑', namePinyin: 'luóji', nameVietnamese: 'Logic, tư duy', hskLevel: 5, theme: 'Học tập', exampleChinese: '这篇文章的逻辑结构很严密。', examplePinyin: 'Zhè piān zhāngzhāng de luóji jiégòu hěn yánmì.', exampleVietnamese: 'Cấu trúc logic của bài viết này rất chặt chẽ.' },
  { id: 'hsk5_5', nameChinese: '掌握', namePinyin: 'zhǎngwò', nameVietnamese: 'Nắm vững, làm chủ', hskLevel: 5, theme: 'Học tập', exampleChinese: '要掌握正确的学习方法。', examplePinyin: 'Yào zhǎngwò zhèngquè de xuéxí fāngfǎ.', exampleVietnamese: 'Cần nắm vững phương pháp học tập đúng đắn.' },
  { id: 'hsk5_6', nameChinese: '珍惜', namePinyin: 'zhēnxī', nameVietnamese: 'Trân trọng, trân quý', hskLevel: 5, theme: 'Đời sống', exampleChinese: '我们要珍惜每一秒时间。', examplePinyin: 'Wǒmen yào zhēnxī měi yì miǎo shíjiān.', exampleVietnamese: 'Chúng ta phải trân trọng từng giây thời gian.' },
  { id: 'hsk5_7', nameChinese: '优势', namePinyin: 'yōushì', nameVietnamese: 'Ưu thế, thế mạnh', hskLevel: 5, theme: 'Công việc', exampleChinese: '技术是他最大的优势。', examplePinyin: 'Jìshù shì tā zuì dà de yōushì.', exampleVietnamese: 'Công nghệ là ưu thế lớn nhất của anh ấy.' },
  { id: 'hsk5_8', nameChinese: '效率', namePinyin: 'xiàolǜ', nameVietnamese: 'Hiệu suất, hiệu quả', hskLevel: 5, theme: 'Công việc', exampleChinese: '提高工作效率很重要。', examplePinyin: 'Tígāo gōngzuò xiàolǜ hěn zhòngyào.', exampleVietnamese: 'Nâng cao hiệu suất công việc rất quan trọng.' },
  { id: 'hsk5_9', nameChinese: '总结', namePinyin: 'zǒngjié', nameVietnamese: 'Tổng kết, đúc kết', hskLevel: 5, theme: 'Thành tựu', exampleChinese: '及时总结经验才能进步。', examplePinyin: 'Jíshí zǒngjié jīngyàn cái néng jìnbù.', exampleVietnamese: 'Kịp thời đúc kết kinh nghiệm mới có thể tiến bộ.' },
  { id: 'hsk5_10', nameChinese: '贡献', namePinyin: 'gòngxiàn', nameVietnamese: 'Cống hiến, đóng góp', hskLevel: 5, theme: 'Công việc', exampleChinese: '他为团队做出了重大贡献。', examplePinyin: 'Tā wèi tuánduì zuòchū le zhòngdà gòngxiàn.', exampleVietnamese: 'Anh ấy đã đóng góp to lớn cho đội ngũ.' },
  { id: 'hsk5_11', nameChinese: '核心', namePinyin: 'héxīn', nameVietnamese: 'Cốt lõi, hạt nhân', hskLevel: 5, theme: 'Công việc', exampleChinese: '创新是核心竞争力。', examplePinyin: 'Chuàngxīn shì héxīn jìngzhēnglì.', exampleVietnamese: 'Đổi mới là sức cạnh tranh cốt lõi.' },
  { id: 'hsk5_12', nameChinese: '灵活', namePinyin: 'línghuó', nameVietnamese: 'Linh hoạt, uyển chuyển', hskLevel: 5, theme: 'Mô tả', exampleChinese: '设计思路要保持灵活。', examplePinyin: 'Shèjì sīlù yào bǎochí línghuó.', exampleVietnamese: 'Tư duy thiết kế cần giữ sự linh hoạt.' },

  // HSK 6
  { id: 'hsk6_1', nameChinese: '抱负', namePinyin: 'bàofù', nameVietnamese: 'Hoài bão, chí hướng', hskLevel: 6, theme: 'Đời sống', exampleChinese: '年轻人要有远大的抱负。', examplePinyin: 'Niánqīngrén yào yǒu yuǎndà de bàofù.', exampleVietnamese: 'Người trẻ tuổi cần có hoài bão lớn lao.' },
  { id: 'hsk6_2', nameChinese: '领悟', namePinyin: 'lǐngwù', nameVietnamese: 'Lĩnh hội, ngộ ra', hskLevel: 6, theme: 'Học tập', exampleChinese: '他深深领悟到了设计的真谛。', examplePinyin: 'Tā shēnshēn lǐngwù dào le shèjì de zhēndì.', exampleVietnamese: 'Anh ấy đã lĩnh hội sâu sắc chân lý của thiết kế.' },
  { id: 'hsk6_3', nameChinese: '精益求精', namePinyin: 'jīng yì qiú jīng', nameVietnamese: 'Luôn phấn đấu làm tốt hơn nữa', hskLevel: 6, theme: 'Thành ngữ', exampleChinese: '对待工作我们要精益求精。', examplePinyin: 'Duìdài gōngzuò wǒmen yào jīng yì qiú jīng.', exampleVietnamese: 'Đối với công việc chúng ta phải luôn tinh ích cầu tinh.' },
  { id: 'hsk6_4', nameChinese: '独树一帜', namePinyin: 'dú shù yí zhì', nameVietnamese: 'Tự tạo nên phong cách độc đáo', hskLevel: 6, theme: 'Thành ngữ', exampleChinese: '他的建筑作品在行业中独树一帜。', examplePinyin: 'Tā de jiànzhù zuòpǐn zài hángyè zhōng dú shù yí zhì.', exampleVietnamese: 'Tác phẩm kiến trúc của anh ấy tạo nên phong cách độc đáo riêng biệt.' },
  { id: 'hsk6_5', nameChinese: '展翅高飞', namePinyin: 'zhǎn chì gāo fēi', nameVietnamese: 'Tung cánh bay cao', hskLevel: 6, theme: 'Thành ngữ', exampleChinese: '祝愿大家在新的领域展翅高飞。', examplePinyin: 'Zhùyuàn dàjiā zài xīn de lǐngyù zhǎn chì gāo fēi.', exampleVietnamese: 'Chúc mọi người tung cánh bay cao trong lĩnh vực mới.' },
  { id: 'hsk6_6', nameChinese: '炉火纯青', namePinyin: 'lú huǒ chún qīng', nameVietnamese: 'Đạt trình độ điêu luyện, thấu đáo', hskLevel: 6, theme: 'Thành ngữ', exampleChinese: '他的技艺达到了炉火纯青的境界。', examplePinyin: 'Tā de jìyì dádào le lú huǒ chún qīng de jìngjiè.', exampleVietnamese: 'Kỹ thuật của anh ấy đạt tới cảnh giới điêu luyện.' },
  { id: 'hsk6_7', nameChinese: '融会贯通', namePinyin: 'róng huì guàn tōng', nameVietnamese: 'Thấu hiểu sâu sắc, áp dụng nhuần nhuyễn', hskLevel: 6, theme: 'Học tập', exampleChinese: '将理论与实践融会贯通。', examplePinyin: 'Jiāng lǐlùn yǔ shíjiàn róng huì guàn tōng.', exampleVietnamese: 'Áp dụng nhuần nhuyễn giữa lý thuyết và thực tiễn.' },
  { id: 'hsk6_8', nameChinese: '卓越', namePinyin: 'zhuóyuè', nameVietnamese: 'Vượt trội, xuất sắc', hskLevel: 6, theme: 'Thành tựu', exampleChinese: '他取得了卓越的成就。', examplePinyin: 'Tā qǔdé le zhuóyuè de chéngjiù.', exampleVietnamese: 'Anh ấy đã đạt được thành tựu vượt trội.' },
  { id: 'hsk6_9', nameChinese: '深思熟虑', namePinyin: 'shēn sī shú lǜ', nameVietnamese: 'Suy tính kỹ lưỡng, cân nhắc chín chắn', hskLevel: 6, theme: 'Công việc', exampleChinese: '这是经过深思熟虑后的决定。', examplePinyin: 'Zhè shì jīngguò shēn sī shú lǜ hòu de juédìng.', exampleVietnamese: 'Đây là quyết định sau khi đã suy tính kỹ lưỡng.' },
  { id: 'hsk6_10', nameChinese: '日新月异', namePinyin: 'rì xīn yuè yì', nameVietnamese: 'Đổi mới từng ngày, phát triển thần tốc', hskLevel: 6, theme: 'Thành ngữ', exampleChinese: '科技的发展日新月异。', examplePinyin: 'Kējì de fāzhǎn rì xīn yuè yì.', exampleVietnamese: 'Sự phát triển của công nghệ đổi mới từng ngày.' },
  { id: 'gv58', nameChinese: '笔记本', namePinyin: 'bǐjìběn', nameVietnamese: 'Sổ ghi chép', hskLevel: 3, theme: 'Học tập', exampleChinese: '请把要点记在笔记本上。', examplePinyin: 'Qǐng bǎ yàodiǎn jì zài bǐjìběn shàng.', exampleVietnamese: 'Xin hãy ghi các ý chính vào sổ ghi chép.' },
  { id: 'gv59', nameChinese: '冰箱', namePinyin: 'bīngxiāng', nameVietnamese: 'Tủ lạnh', hskLevel: 3, theme: 'Đồ dùng', exampleChinese: '冰箱里有很多新鲜水果。', examplePinyin: 'Bīngxiāng lǐ yǒu hěn duō xīnxiān shuǐguǒ.', exampleVietnamese: 'Trong tủ lạnh có rất nhiều hoa quả tươi.' },
  { id: 'gv60', nameChinese: '聪明', namePinyin: 'cōngming', nameVietnamese: 'Thông minh', hskLevel: 3, theme: 'Mô tả', exampleChinese: '这个孩子非常聪明。', examplePinyin: 'Zhè ge háizi fēicháng cōngming.', exampleVietnamese: 'Đứa trẻ này rất thông minh.' },
  { id: 'gv61', nameChinese: '经常', namePinyin: 'jīngcháng', nameVietnamese: 'Thường xuyên', hskLevel: 3, theme: 'Đời sống', exampleChinese: '我经常去公园跑步。', examplePinyin: 'Wǒ jīngcháng qù gōngyuán pǎobù.', exampleVietnamese: 'Tôi thường xuyên đi công viên chạy bộ.' },
  { id: 'gv62', nameChinese: '简单', namePinyin: 'jiǎndān', nameVietnamese: 'Đơn giản', hskLevel: 3, theme: 'Mô tả', exampleChinese: '这道题其实很简单。', examplePinyin: 'Zhè dào tí qíshí hěn jiǎndān.', exampleVietnamese: 'Bài tập này thực ra rất đơn giản.' },
  { id: 'gv63', nameChinese: '努力', namePinyin: 'nǔlì', nameVietnamese: 'Nỗ lực cố gắng', hskLevel: 3, theme: 'Học tập', exampleChinese: '只要努力，就一定能成功。', examplePinyin: 'Zhǐyào nǔlì, jiù yídìng néng chénggōng.', exampleVietnamese: 'Chỉ cần nỗ lực, nhất định sẽ thành công.' },
  { id: 'gv64', nameChinese: '热情', namePinyin: 'rèqíng', nameVietnamese: 'Nhiệt tình', hskLevel: 3, theme: 'Giao tiếp', exampleChinese: '大家热情地欢迎新同事。', examplePinyin: 'Dàjiā rèqíng de huānyíng xīn tóngshì.', exampleVietnamese: 'Mọi người nhiệt tình chào đón đồng nghiệp mới.' },
  { id: 'gv65', nameChinese: '认真', namePinyin: 'rènzhēn', nameVietnamese: 'Nghiêm túc, chăm chỉ', hskLevel: 3, theme: 'Học tập', exampleChinese: '他学习汉语非常认真。', examplePinyin: 'Tā xuéxí Hànyǔ fēicháng rènzhēn.', exampleVietnamese: 'Anh ấy học tiếng Trung rất nghiêm túc.' },

  // HSK 4
  { id: 'hsk4_1', nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'Sắp xếp, an bài', hskLevel: 4, theme: 'Công việc', exampleChinese: '我们安排好时间去旅行。', examplePinyin: 'Wǒmen ānpái hǎo shíjiān qù lǚxíng.', exampleVietnamese: 'Chúng tôi sắp xếp sẵn thời gian để đi du lịch.' },
  { id: 'hsk4_2', nameChinese: '保证', namePinyin: 'bǎozhèng', nameVietnamese: 'Bảo đảm, cam kết', hskLevel: 4, theme: 'Công việc', exampleChinese: '我保证准时完成任务。', examplePinyin: 'Wǒ bǎozhèng zhǔnshí wánchéng rènwu.', exampleVietnamese: 'Tôi đảm bảo sẽ hoàn thành nhiệm vụ đúng giờ.' },
  { id: 'hsk4_3', nameChinese: '报名', namePinyin: 'bàomíng', nameVietnamese: 'Đăng ký', hskLevel: 4, theme: 'Học tập', exampleChinese: '大家踊跃报名参加比赛。', examplePinyin: 'Dàjiā yǒngyuè bàomíng cānjiā bǐsài.', exampleVietnamese: 'Mọi người hăng hái đăng ký tham gia cuộc thi.' },
  { id: 'hsk4_4', nameChinese: '毕业', namePinyin: 'bìyè', nameVietnamese: 'Tốt nghiệp', hskLevel: 4, theme: 'Học tập', exampleChinese: '祝贺你顺利大学毕业！', examplePinyin: 'Zhùhè nǐ shùnlì dàxué bìyè!', exampleVietnamese: 'Chúc mừng bạn thuận lợi tốt nghiệp đại học!' },
  { id: 'hsk4_5', nameChinese: '成功', namePinyin: 'chénggōng', nameVietnamese: 'Thành công', hskLevel: 4, theme: 'Công việc', exampleChinese: '坚持努力就一定会成功。', examplePinyin: 'Jiānchí nǔlì jiù yídìng huì chénggōng.', exampleVietnamese: 'Kiên trì nỗ lực nhất định sẽ thành công.' },
  { id: 'hsk4_6', nameChinese: '态度', namePinyin: 'tàidu', nameVietnamese: 'Thái độ', hskLevel: 4, theme: 'Giao tiếp', exampleChinese: '学习态度决定最终成绩。', examplePinyin: 'Xuéxí tàidu juédìng zuìzhōng chéngjì.', exampleVietnamese: 'Thái độ học tập quyết định kết quả cuối cùng.' },

  // HSK 5
  { id: 'hsk5_1', nameChinese: '把握', namePinyin: 'bǎwò', nameVietnamese: 'Nắm bắt, thấu hiểu', hskLevel: 5, theme: 'Công việc', exampleChinese: '我们要把握住这次创业机会。', examplePinyin: 'Wǒmen yào bǎwò zhù zhè cì chuàngyè jīhuì.', exampleVietnamese: 'Chúng ta phải nắm bắt cơ hội khởi nghiệp lần này.' },
  { id: 'hsk5_2', nameChinese: '具备', namePinyin: 'jùbèi', nameVietnamese: 'Trang bị đủ, có đủ', hskLevel: 5, theme: 'Công việc', exampleChinese: '他具备出色的设计专业能力。', examplePinyin: 'Tā jùbèi chūsè de shèjì zhuānyè nénglì.', exampleVietnamese: 'Anh ấy có đủ năng lực chuyên môn thiết kế xuất sắc.' },
  { id: 'hsk5_3', nameChinese: '追求', namePinyin: 'zhuīqiú', nameVietnamese: 'Mưu cầu, theo đuổi', hskLevel: 5, theme: 'Đời sống', exampleChinese: '追求卓越是每个人的梦想。', examplePinyin: 'Zhuīqiú zhuóyuè shì měi ge rén de mèngxiǎng.', exampleVietnamese: 'Theo đuổi sự vượt trội là giấc mơ của mỗi người.' },
  { id: 'hsk5_4', nameChinese: '逻辑', namePinyin: 'luóji', nameVietnamese: 'Logic, tư duy', hskLevel: 5, theme: 'Học tập', exampleChinese: '这篇文章的逻辑结构很严密。', examplePinyin: 'Zhè piān zhāngzhāng de luóji jiégòu hěn yánmì.', exampleVietnamese: 'Cấu trúc logic của bài viết này rất chặt chẽ.' },

  // HSK 6
  { id: 'hsk6_1', nameChinese: '抱负', namePinyin: 'bàofù', nameVietnamese: 'Hoài bão, chí hướng', hskLevel: 6, theme: 'Đời sống', exampleChinese: '年轻人要有远大的抱负。', examplePinyin: 'Niánqīngrén yào yǒu yuǎndà de bàofù.', exampleVietnamese: 'Người trẻ tuổi cần có hoài bão lớn lao.' },
  { id: 'hsk6_2', nameChinese: '领悟', namePinyin: 'lǐngwù', nameVietnamese: 'Lĩnh hội, ngộ ra', hskLevel: 6, theme: 'Học tập', exampleChinese: '他深深领悟到了设计的真谛。', examplePinyin: 'Tā shēnshēn lǐngwù dào le shèjì de zhēndì.', exampleVietnamese: 'Anh ấy đã lĩnh hội sâu sắc chân lý của thiết kế.' },
  { id: 'hsk6_3', nameChinese: '精益求精', namePinyin: 'jīng yì qiú jīng', nameVietnamese: 'Luôn phấn đấu làm tốt hơn nữa', hskLevel: 6, theme: 'Thành ngữ', exampleChinese: '对待工作我们要精益求精。', examplePinyin: 'Duìdài gōngzuò wǒmen yào jīng yì qiú jīng.', exampleVietnamese: 'Đối với công việc chúng ta phải luôn tinh ích cầu tinh.' },
  { id: 'hsk6_4', nameChinese: '独树一帜', namePinyin: 'dú shù yí zhì', nameVietnamese: 'Tự tạo nên phong cách độc đáo', hskLevel: 6, theme: 'Thành ngữ', exampleChinese: '他的建筑作品在行业中独树一帜。', examplePinyin: 'Tā de jiànzhù zuòpǐn zài hángyè zhōng dú shù yí zhì.', exampleVietnamese: 'Tác phẩm kiến trúc của anh ấy tạo nên phong cách độc đáo riêng biệt.' },
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
