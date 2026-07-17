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
    clientName: 'Gấu trúc Panda',
    clientSprite: 'panda',
    title: 'Phòng ngủ nhỏ ấm cúng',
    description: 'Panda muốn sửa sang lại góc ngủ của mình. Chú cần một chiếc giường đơn và một chiếc bàn gỗ đơn giản để viết nhật ký.',
    promptChinese: '我要一张单人床和一个木桌。',
    promptPinyin: 'Wǒ yào yì zhāng dānrén chuáng hé yí ge mù zhuō.',
    promptVietnamese: 'Tôi muốn một chiếc giường đơn và một chiếc bàn gỗ.',
    targetRequirements: ['single_bed', 'wood_table'],
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
    clientName: 'Cún Shiba tinh nghịch',
    clientSprite: 'shiba',
    title: 'Góc đọc sách lý tưởng',
    description: 'Shiba thích đọc sách vào ban đêm. Chú cần một kệ sách lớn và một chiếc đèn sàn đứng bên cạnh để không hại mắt.',
    promptChinese: '我需要一个书架和一个落地灯。',
    promptPinyin: 'Wǒ xūyào yí ge shūjià hé yí ge luòdìdēng.',
    promptVietnamese: 'Tôi cần một chiếc kệ sách và một chiếc đèn đứng.',
    targetRequirements: ['bookshelf', 'floor_lamp'],
    rewardCoins: 120,
    rewardScore: 150
  },

  // CẤP ĐỘ 2: Nhiệm vụ nâng cao
  {
    id: 3,
    level: 2,
    clientName: 'Mèo ú dễ thương',
    clientSprite: 'cat',
    title: 'Phòng khách thư giãn',
    description: 'Mèo ú muốn một nơi êm ái để nằm lười. Nó cần một chiếc sofa lớn, một bàn trà nhỏ và một chậu cây cảnh lọc không khí.',
    promptChinese: '请给我一个沙发，一个茶几和一个盆栽。',
    promptPinyin: 'Qǐng gěi wǒ yí ge shāfā, yí ge chájī hé yí ge pénzāi.',
    promptVietnamese: 'Xin hãy cho tôi một chiếc sofa, một chiếc bàn trà và một chậu cây cảnh.',
    targetRequirements: ['sofa', 'coffee_table', 'potted_plant'],
    rewardCoins: 180,
    rewardScore: 250
  },
  {
    id: 4,
    level: 2,
    clientName: 'Gấu trúc Panda',
    clientSprite: 'panda',
    title: 'Văn phòng làm việc tiện nghi',
    description: 'Panda bắt đầu làm việc tại nhà. Chú cần một chiếc bàn làm việc, một chiếc ghế xoay văn phòng thoải mái và một cây xương rồng nhỏ trang trí góc bàn.',
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
