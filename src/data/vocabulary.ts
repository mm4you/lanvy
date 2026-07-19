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
  { id: 'gv1', nameChinese: '爱', namePinyin: 'ài', nameVietnamese: 'Yêu, thích', hskLevel: 1 },
  { id: 'gv2', nameChinese: '爱好', namePinyin: 'àihào', nameVietnamese: 'Sở thích', hskLevel: 1 },
  { id: 'gv3', nameChinese: '杯子', namePinyin: 'bēizi', nameVietnamese: 'Cái cốc, tách', hskLevel: 1 },
  { id: 'gv4', nameChinese: '电脑', namePinyin: 'diànnǎo', nameVietnamese: 'Máy vi tính', hskLevel: 1 },
  { id: 'gv5', nameChinese: '电视', namePinyin: 'diànshì', nameVietnamese: 'Tivi, truyền hình', hskLevel: 1 },
  { id: 'gv6', nameChinese: '电影', namePinyin: 'diànyǐng', nameVietnamese: 'Phim điện ảnh', hskLevel: 1 },
  { id: 'gv7', nameChinese: '东西', namePinyin: 'dōngxi', nameVietnamese: 'Đồ đạc, vật phẩm', hskLevel: 1 },
  { id: 'gv8', nameChinese: '高兴', namePinyin: 'gāoxìng', nameVietnamese: 'Vui mừng, phấn khởi', hskLevel: 1 },
  { id: 'gv9', nameChinese: '工作', namePinyin: 'gōngzuò', nameVietnamese: 'Công việc, làm việc', hskLevel: 1 },
  { id: 'gv10', nameChinese: '汉语', namePinyin: 'Hànyǔ', nameVietnamese: 'Tiếng Trung', hskLevel: 1 },
  { id: 'gv11', nameChinese: '漂亮', namePinyin: 'piàoliang', nameVietnamese: 'Xinh đẹp, đẹp đẽ', hskLevel: 1 },
  { id: 'gv12', nameChinese: '认识', namePinyin: 'rènshi', nameVietnamese: 'Nhận biết, làm quen', hskLevel: 1 },
  { id: 'gv13', nameChinese: '学生', namePinyin: 'xuéshēng', nameVietnamese: 'Học sinh, sinh viên', hskLevel: 1 },
  { id: 'gv14', nameChinese: '学习', namePinyin: 'xuéxí', nameVietnamese: 'Học tập, nghiên cứu', hskLevel: 1 },
  { id: 'gv15', nameChinese: '学校', namePinyin: 'xuéxiào', nameVietnamese: 'Trường học', hskLevel: 1 },
  { id: 'gv16', nameChinese: '衣服', namePinyin: 'yīfu', nameVietnamese: 'Quần áo', hskLevel: 1 },
  { id: 'gv17', nameChinese: '桌子', namePinyin: 'zhuōzi', nameVietnamese: 'Cái bàn', hskLevel: 1 },
  { id: 'gv18', nameChinese: '椅子', namePinyin: 'yǐzi', nameVietnamese: 'Cái ghế', hskLevel: 1 },
  { id: 'gv19', nameChinese: '天气', namePinyin: 'tiānqì', nameVietnamese: 'Thời tiết', hskLevel: 1 },
  { id: 'gv20', nameChinese: '喜欢', namePinyin: 'xǐhuan', nameVietnamese: 'Thích, yêu thích', hskLevel: 1 },
  { id: 'gv21', nameChinese: '谢谢', namePinyin: 'xièxie', nameVietnamese: 'Cảm ơn', hskLevel: 1 },
  { id: 'gv22', nameChinese: '再见', namePinyin: 'zàijiàn', nameVietnamese: 'Tạm biệt', hskLevel: 1 },
  { id: 'gv23', nameChinese: '昨天', namePinyin: 'zuótiān', nameVietnamese: 'Hôm qua', hskLevel: 1 },
  { id: 'gv24', nameChinese: '今天', namePinyin: 'jīntiān', nameVietnamese: 'Hôm nay', hskLevel: 1 },
  { id: 'gv25', nameChinese: '明天', namePinyin: 'míngtiān', nameVietnamese: 'Ngày mai', hskLevel: 1 },

  // HSK 2
  { id: 'gv26', nameChinese: '爱情', namePinyin: 'àiqíng', nameVietnamese: 'Tình yêu', hskLevel: 2 },
  { id: 'gv27', nameChinese: '安静', namePinyin: 'ānjìng', nameVietnamese: 'Yên tĩnh, tĩnh lặng', hskLevel: 2 },
  { id: 'gv28', nameChinese: '白色', namePinyin: 'báisè', nameVietnamese: 'Màu trắng', hskLevel: 2 },
  { id: 'gv29', nameChinese: '帮助', namePinyin: 'bāngzhù', nameVietnamese: 'Giúp đỡ', hskLevel: 2 },
  { id: 'gv30', nameChinese: '报纸', namePinyin: 'bàozhǐ', nameVietnamese: 'Báo chí', hskLevel: 2 },
  { id: 'gv31', nameChinese: '唱歌', namePinyin: 'chànggē', nameVietnamese: 'Ca hát', hskLevel: 2 },
  { id: 'gv32', nameChinese: '穿', namePinyin: 'chuān', nameVietnamese: 'Mặc (quần áo), đeo (kính)', hskLevel: 2 },
  { id: 'gv33', nameChinese: '错', namePinyin: 'cuò', nameVietnamese: 'Sai, nhầm lẫn', hskLevel: 2 },
  { id: 'gv34', nameChinese: '大家', namePinyin: 'dàjiā', nameVietnamese: 'Mọi người, cả nhà', hskLevel: 2 },
  { id: 'gv35', nameChinese: '懂', namePinyin: 'dǒng', nameVietnamese: 'Hiểu, thông suốt', hskLevel: 2 },
  { id: 'gv36', nameChinese: '房间', namePinyin: 'fángjiān', nameVietnamese: 'Căn phòng', hskLevel: 2 },
  { id: 'gv37', nameChinese: '非常', namePinyin: 'fēicháng', nameVietnamese: 'Rất, vô cùng', hskLevel: 2 },
  { id: 'gv38', nameChinese: '贵', namePinyin: 'guì', nameVietnamese: 'Đắt, quý báu', hskLevel: 2 },
  { id: 'gv39', nameChinese: '孩子', namePinyin: 'háizi', nameVietnamese: 'Trẻ con, con cái', hskLevel: 2 },
  { id: 'gv40', nameChinese: '好吃', namePinyin: 'hǎochī', nameVietnamese: 'Ngon (ăn)', hskLevel: 2 },
  { id: 'gv41', nameChinese: '黑色', namePinyin: 'hēisè', nameVietnamese: 'Màu đen', hskLevel: 2 },
  { id: 'gv42', nameChinese: '红色', namePinyin: 'hóngsè', nameVietnamese: 'Màu đỏ', hskLevel: 2 },
  { id: 'gv43', nameChinese: '回答', namePinyin: 'huídá', nameVietnamese: 'Trả lời', hskLevel: 2 },
  { id: 'gv44', nameChinese: '介绍', namePinyin: 'jièshào', nameVietnamese: 'Giới thiệu', hskLevel: 2 },
  { id: 'gv45', nameChinese: '咖啡', namePinyin: 'kāfēi', nameVietnamese: 'Cà phê', hskLevel: 2 },
  { id: 'gv46', nameChinese: '开始', namePinyin: 'kāishǐ', nameVietnamese: 'Bắt đầu', hskLevel: 2 },
  { id: 'gv47', nameChinese: '快乐', namePinyin: 'kuàilè', nameVietnamese: 'Vui vẻ, hạnh phúc', hskLevel: 2 },
  { id: 'gv48', nameChinese: '累', namePinyin: 'lèi', nameVietnamese: 'Mệt mỏi', hskLevel: 2 },
  { id: 'gv49', nameChinese: '便宜', namePinyin: 'piányi', nameVietnamese: 'Rẻ, giá hời', hskLevel: 2 },
  { id: 'gv50', nameChinese: '希望', namePinyin: 'xīwàng', nameVietnamese: 'Hy vọng', hskLevel: 2 },
  { id: 'gv51', nameChinese: '休息', namePinyin: 'xiūxi', nameVietnamese: 'Nghỉ ngơi', hskLevel: 2 },
  { id: 'gv52', nameChinese: '颜色', namePinyin: 'yánsè', nameVietnamese: 'Màu sắc', hskLevel: 2 },
  { id: 'gv53', nameChinese: '眼睛', namePinyin: 'yǎnjing', nameVietnamese: 'Mắt, đôi mắt', hskLevel: 2 },
  { id: 'gv54', nameChinese: '准备', namePinyin: 'zhǔnbèi', nameVietnamese: 'Chuẩn bị', hskLevel: 2 },
  { id: 'gv55', nameChinese: '知道', namePinyin: 'zhīdào', nameVietnamese: 'Biết, hiểu rõ', hskLevel: 2 },

  // HSK 3
  { id: 'gv56', nameChinese: '办法', namePinyin: 'bànfǎ', nameVietnamese: 'Biện pháp, cách thức', hskLevel: 3 },
  { id: 'gv57', nameChinese: '办公室', namePinyin: 'bàngōngshì', nameVietnamese: 'Phòng làm việc', hskLevel: 3 },
  { id: 'gv58', nameChinese: '笔记本', namePinyin: 'bǐjìběn', nameVietnamese: 'Vở ghi chép, máy tính xách tay', hskLevel: 3 },
  { id: 'gv59', nameChinese: '冰箱', namePinyin: 'bīngxiāng', nameVietnamese: 'Tủ lạnh', hskLevel: 3 },
  { id: 'gv60', nameChinese: '聪明', namePinyin: 'cōngming', nameVietnamese: 'Thông minh, nhạy bén', hskLevel: 3 },
  { id: 'gv61', nameChinese: '经常', namePinyin: 'jīngcháng', nameVietnamese: 'Thường xuyên', hskLevel: 3 },
  { id: 'gv62', nameChinese: '简单', namePinyin: 'jiǎndān', nameVietnamese: 'Đơn giản, dễ dàng', hskLevel: 3 },
  { id: 'gv63', nameChinese: '努力', namePinyin: 'nǔlì', nameVietnamese: 'Nỗ lực, cố gắng', hskLevel: 3 },
  { id: 'gv64', nameChinese: '热情', namePinyin: 'rèqíng', nameVietnamese: 'Nhiệt tình, hiếu khách', hskLevel: 3 },
  { id: 'gv65', nameChinese: '世界', namePinyin: 'shìjiè', nameVietnamese: 'Thế giới', hskLevel: 3 },
  { id: 'gv66', nameChinese: '习惯', namePinyin: 'xíguàn', nameVietnamese: 'Thói quen, quen với', hskLevel: 3 },
  { id: 'gv67', nameChinese: '选择', namePinyin: 'xuǎnzé', nameVietnamese: 'Lựa chọn', hskLevel: 3 },
  { id: 'gv68', nameChinese: '要求', namePinyin: 'yāoqiú', nameVietnamese: 'Yêu cầu, đòi hỏi', hskLevel: 3 },
  { id: 'gv69', nameChinese: '影响', namePinyin: 'yǐngxiǎng', nameVietnamese: 'Ảnh hưởng, tác động', hskLevel: 3 },
  { id: 'gv70', nameChinese: '游戏', namePinyin: 'yóuxì', nameVietnamese: 'Trò chơi, game', hskLevel: 3 },
  { id: 'gv71', nameChinese: '愿意', namePinyin: 'yuànyì', nameVietnamese: 'Sẵn lòng, đồng ý', hskLevel: 3 },
  { id: 'gv72', nameChinese: '着急', namePinyin: 'zhāojí', nameVietnamese: 'Sốt ruột, lo lắng', hskLevel: 3 },
  { id: 'gv73', nameChinese: '重要', namePinyin: 'zhòngyào', nameVietnamese: 'Quan trọng, cốt lõi', hskLevel: 3 },
  { id: 'gv74', nameChinese: '注意', namePinyin: 'zhùyì', nameVietnamese: 'Chú ý, để tâm', hskLevel: 3 },
  { id: 'gv75', nameChinese: '满意', namePinyin: 'mǎnyì', nameVietnamese: 'Hài lòng, ưng ý', hskLevel: 3 }
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
