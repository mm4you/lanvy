export interface Order {
  id: number;
  level: number; // 1: HSK 3 (Basic), 2: HSK 4/5 (Medium), 3: HSK 5/6 & Love (Advanced)
  customerName: string;
  customerSprite: string; // 'khang' | 'cat' | 'panda' | 'girl'
  orderChinese: string;
  orderPinyin: string;
  orderVietnamese: string;
  targetIngredients: string[]; // List of ingredients that must be clicked
  successMessage: string;
  failureMessage: string;
  isLoveOrder?: boolean;
  voucherReward?: {
    title: string;
    description: string;
    code: string;
  };
}

export interface Ingredient {
  id: string;
  nameChinese: string;
  nameVietnamese: string;
  category: 'base' | 'topping' | 'sugar' | 'ice' | 'fruit' | 'foam';
}

export const INGREDIENTS: Ingredient[] = [
  // Trà nền (Bases)
  { id: 'milktea', nameChinese: '奶茶', nameVietnamese: 'Trà sữa', category: 'base' },
  { id: 'greentea', nameChinese: '绿茶', nameVietnamese: 'Trà xanh', category: 'base' },
  { id: 'blacktea', nameChinese: '红茶', nameVietnamese: 'Hồng trà', category: 'base' },
  { id: 'oolong', nameChinese: '乌龙茶', nameVietnamese: 'Trà ô long', category: 'base' },

  // Toppings
  { id: 'boba', nameChinese: '珍珠', nameVietnamese: 'Trân châu', category: 'topping' },
  { id: 'jelly', nameChinese: '椰果', nameVietnamese: 'Thạch dừa', category: 'topping' },
  { id: 'pudding', nameChinese: '布丁', nameVietnamese: 'Pudding', category: 'topping' },
  { id: 'redbean', nameChinese: '红豆', nameVietnamese: 'Đậu đỏ', category: 'topping' },

  // Trái cây (Fruits)
  { id: 'mango', nameChinese: '芒果', nameVietnamese: 'Xoài', category: 'fruit' },
  { id: 'peach', nameChinese: '桃子', nameVietnamese: 'Đào', category: 'fruit' },
  { id: 'strawberry', nameChinese: '草莓', nameVietnamese: 'Dâu tây', category: 'fruit' },
  { id: 'lemon', nameChinese: '柠檬', nameVietnamese: 'Chanh', category: 'fruit' },

  // Kem sữa (Foam)
  { id: 'milkfoam', nameChinese: '奶盖', nameVietnamese: 'Kem sữa', category: 'foam' },

  // Đường (Sugar levels)
  { id: 'sugar_less', nameChinese: '少糖', nameVietnamese: 'Ít đường (70%)', category: 'sugar' },
  { id: 'sugar_half', nameChinese: '半糖', nameVietnamese: 'Nửa đường (50%)', category: 'sugar' },
  { id: 'sugar_none', nameChinese: '无糖', nameVietnamese: 'Không đường (0%)', category: 'sugar' },

  // Đá (Ice levels)
  { id: 'ice_none', nameChinese: '去冰', nameVietnamese: 'Không đá (0%)', category: 'ice' },
  { id: 'ice_less', nameChinese: '少冰', nameVietnamese: 'Ít đá (30%)', category: 'ice' },
  { id: 'ice_normal', nameChinese: '多冰', nameVietnamese: 'Nhiều đá (100%)', category: 'ice' }
];

export const ORDERS: Order[] = [
  // LEVEL 1: HSK 3 - Món cơ bản
  {
    id: 1,
    level: 1,
    customerName: 'Tiên',
    customerSprite: 'tien',
    orderChinese: '我要一杯珍珠奶茶。',
    orderPinyin: 'Wǒ xiǎng yào yì bēi zhēnzhū nǎichá.',
    orderVietnamese: 'Tôi muốn một ly trà sữa trân châu.',
    targetIngredients: ['奶茶', '珍珠'],
    successMessage: 'Ngon quá! Đúng món trân châu khoái khẩu của tôi rồi!',
    failureMessage: 'Hình như thiếu trân châu hoặc trà sữa rồi bạn ơi...'
  },
  {
    id: 2,
    level: 1,
    customerName: 'Ngọc',
    customerSprite: 'ngoc',
    orderChinese: '我想喝椰果绿茶。',
    orderPinyin: 'Wǒ xiǎng hē yēguǒ lùchá.',
    orderVietnamese: 'Tôi muốn uống trà xanh thạch dừa.',
    targetIngredients: ['绿茶', '椰果'],
    successMessage: 'Cảm ơn chủ quán! Thạch dừa dai ngon tuyệt!',
    failureMessage: 'Uống nhầm vị rồi, mình gọi trà xanh thạch dừa mà.'
  },
  {
    id: 3,
    level: 1,
    customerName: 'Nhựt Khang',
    customerSprite: 'khang',
    orderChinese: '给我一杯红豆红茶。',
    orderPinyin: 'Gěi wǒ yì bēi hóngdòu hóngchá.',
    orderVietnamese: 'Cho tôi một ly hồng trà đậu đỏ.',
    targetIngredients: ['红茶', '红豆'],
    successMessage: 'Đậu đỏ bùi ngọt, hồng trà thơm lắm!',
    failureMessage: 'Hồng trà đậu đỏ của mình đâu rồi bạn ơi?'
  },

  // LEVEL 2: HSK 4/5 - Tùy chọn đường đá chi tiết
  {
    id: 4,
    level: 2,
    customerName: 'Vy',
    customerSprite: 'vy',
    orderChinese: '我要一杯半糖、去冰的珍珠奶茶。',
    orderPinyin: 'Wǒ yào yì bēi bàn táng, qù bīng de zhēnzhū nǎichá.',
    orderVietnamese: 'Tôi muốn một ly trà sữa trân châu nửa đường, không đá.',
    targetIngredients: ['奶茶', '珍珠', '半糖', '去冰'],
    successMessage: 'Chế biến chuẩn xác ghê! Không đá ít ngọt uống rất vừa miệng!',
    failureMessage: 'Mình dặn nửa đường không đá mà vị này lạ quá...'
  },
  {
    id: 5,
    level: 2,
    customerName: 'Nhựt Khang',
    customerSprite: 'khang',
    orderChinese: '请给我一杯少糖、少冰的椰果绿茶。',
    orderPinyin: 'Qǐng gěi wǒ yì bēi shǎo táng, shǎo bīng de yēguǒ lùchá.',
    orderVietnamese: 'Làm ơn cho tôi một ly trà xanh thạch dừa ít đường, ít đá.',
    targetIngredients: ['绿茶', '椰果', '少糖', '少冰'],
    successMessage: 'Tuyệt vời! Ít đường ít đá uống thanh mát tốt cho sức khỏe!',
    failureMessage: 'Hơi sai sai về lượng đường hoặc đá rồi thì phải.'
  },
  {
    id: 6,
    level: 2,
    customerName: 'Ngọc',
    customerSprite: 'ngoc',
    orderChinese: '我要一杯无糖、多冰的红豆红茶，加布丁。',
    orderPinyin: 'Wǒ yào yì bēi wú táng, duō bīng de hóngdòu hóngchá, jiā bùdīng.',
    orderVietnamese: 'Tôi muốn một ly hồng trà đậu đỏ không đường, nhiều đá, thêm pudding.',
    targetIngredients: ['红茶', '红豆', '布丁', '无糖', '多冰'],
    successMessage: 'Quá ngon! Đậu đỏ đã ngọt sẵn nên không đường là chuẩn bài!',
    failureMessage: 'Hình như thiếu bánh pudding hoặc chưa đúng độ đường đá rồi.'
  },

  // LEVEL 3: HSK 5/6 & Love - Độc đáo, ngọt ngào cá nhân hóa
  {
    id: 7,
    level: 3,
    customerName: 'Nhựt Khang',
    customerSprite: 'khang',
    orderChinese: '我想喝一杯少糖的珍珠奶茶，因为你已经足够甜了。',
    orderPinyin: 'Wǒ xiǎng hē yì bēi shǎo táng de zhēnzhū nǎichá, yīnwèi nǐ yǐjīng zúgòu tián le.',
    orderVietnamese: 'Anh muốn uống một ly trà sữa trân châu ít đường, bởi vì em đã đủ ngọt ngào rồi.',
    targetIngredients: ['奶茶', '珍珠', '少糖'],
    successMessage: 'Hihi đúng vị anh thích rồi! Cảm ơn bạn nhỏ của anh nhé!',
    failureMessage: 'Huhu trà sữa chưa ngọt như tình yêu của anh rồi!',
    isLoveOrder: true,
    voucherReward: {
      title: 'VOUCHER TRÀ SỮA ĐỜI THỰC',
      description: 'Phiếu đổi 1 ly trà sữa Gongcha/KoiThé bất kỳ do anh Khang mua tặng.',
      code: 'BOBA-LOVE-100-VY'
    }
  },
  {
    id: 8,
    level: 3,
    customerName: 'Nhựt Khang',
    customerSprite: 'khang',
    orderChinese: '今天你学得很好，我想送你一份特别的礼物。',
    orderPinyin: 'Jīntiān nǐ xué de hěn hǎo, wǒ xiǎng sòng nǐ yí fèn tèbié de lǐwù.',
    orderVietnamese: 'Hôm nay em học rất tốt, anh muốn tặng em một phần quà đặc biệt.',
    targetIngredients: ['奶茶', '布丁', '半糖', '去冰'],
    successMessage: 'Bất ngờ chưa! Mở phần quà đặc biệt bên dưới nhé!',
    failureMessage: 'Làm sai công thức quà tặng rồi em ơi!',
    isLoveOrder: true,
    voucherReward: {
      title: 'VOUCHER PHIM ẢNH HẸN HÒ',
      description: 'Phiếu đổi 1 buổi đi xem phim CGV cuối tuần kèm bắp nước do anh Khang tháp tùng.',
      code: 'MOVIE-DATE-CGV-VY'
    }
  },
  {
    id: 9,
    level: 3,
    customerName: 'Vy',
    customerSprite: 'vy',
    orderChinese: '听说学好汉语可以得到杯奶茶，是真的吗？',
    orderPinyin: 'Tīng shuō xué hǎo Hànyǔ kěyǐ dé dào bēi nǎichá, shì zhēn de ma?',
    orderVietnamese: 'Nghe nói học giỏi tiếng Trung có thể nhận được trà sữa, là thật hả?',
    targetIngredients: ['乌龙茶', '布丁', '半糖', '少冰'],
    successMessage: 'Đúng vậy nha! Nhận voucher trà sữa từ anh Khang ngay đi nào!',
    failureMessage: 'Oolong sữa thạch dừa của em sai vị rồi!',
    isLoveOrder: true,
    voucherReward: {
      title: 'VOUCHER ĂN ĐỒ TRUNG HOA',
      description: 'Phiếu đổi 1 bữa tiệc sủi cảo/lẩu Haidilao no nê do anh Khang bao trọn gói.',
      code: 'HAIDILAO-FEAST-VY'
    }
  }
];

export interface VocabWord {
  chinese: string;
  pinyin: string;
  vietnamese: string;
  level: string;
}

export const VOCAB_LIST: VocabWord[] = [
  // HSK 1-3 basic words
  { chinese: "我", pinyin: "wǒ", vietnamese: "Tôi / Ta / Anh / Em", level: "HSK 1" },
  { chinese: "想", pinyin: "xiǎng", vietnamese: "Muốn / Nghĩ / Nhớ", level: "HSK 1" },
  { chinese: "喝", pinyin: "hē", vietnamese: "Uống", level: "HSK 1" },
  { chinese: "要", pinyin: "yào", vietnamese: "Muốn / Cần", level: "HSK 1" },
  { chinese: "一杯", pinyin: "yì bēi", vietnamese: "Một ly / Một cốc", level: "HSK 1" },
  { chinese: "给", pinyin: "gěi", vietnamese: "Cho / Đưa cho", level: "HSK 1" },
  { chinese: "绿茶", pinyin: "lùchá", vietnamese: "Trà xanh", level: "HSK 1" },
  { chinese: "红茶", pinyin: "hóngchá", vietnamese: "Hồng trà", level: "HSK 1" },
  { chinese: "奶茶", pinyin: "nǎichá", vietnamese: "Trà sữa", level: "HSK 1" },
  { chinese: "珍珠", pinyin: "zhēnzhū", vietnamese: "Trân châu", level: "HSK 2" },
  { chinese: "椰果", pinyin: "yēguǒ", vietnamese: "Thạch dừa", level: "HSK 2" },
  { chinese: "少糖", pinyin: "shǎo táng", vietnamese: "Ít đường", level: "HSK 3" },
  { chinese: "半糖", pinyin: "bàn táng", vietnamese: "Nửa đường (50%)", level: "HSK 3" },
  { chinese: "无糖", pinyin: "wú táng", vietnamese: "Không đường (0%)", level: "HSK 3" },
  { chinese: "去冰", pinyin: "qù bīng", vietnamese: "Không đá (0%)", level: "HSK 3" },
  { chinese: "少冰", pinyin: "shǎo bīng", vietnamese: "Ít đá", level: "HSK 3" },
  { chinese: "多冰", pinyin: "duō bīng", vietnamese: "Nhiều đá", level: "HSK 3" },
  // HSK 4-5 words
  { chinese: "请", pinyin: "qǐng", vietnamese: "Xin mời / Làm ơn", level: "HSK 1" },
  { chinese: "布丁", pinyin: "bùdīng", vietnamese: "Pudding", level: "HSK 4" },
  { chinese: "红豆", pinyin: "hóngdòu", vietnamese: "Đậu đỏ", level: "HSK 4" },
  { chinese: "乌龙茶", pinyin: "wūlóngchá", vietnamese: "Trà ô long", level: "HSK 4" },
  { chinese: "加", pinyin: "jiā", vietnamese: "Thêm / Cộng", level: "HSK 4" },
  { chinese: "because", pinyin: "yīnwèi", vietnamese: "Bởi vì", level: "HSK 3" }, // standard HSK3 translation
  { chinese: "因为", pinyin: "yīnwèi", vietnamese: "Bởi vì", level: "HSK 3" },
  { chinese: "已经", pinyin: "yǐjīng", vietnamese: "Đã (xảy ra)", level: "HSK 3" },
  { chinese: "足够", pinyin: "zúgòu", vietnamese: "Đầy đủ / Đủ", level: "HSK 4" },
  { chinese: "甜", pinyin: "tián", vietnamese: "Ngọt / Ngọt ngào", level: "HSK 2" },
  // HSK 5-6 words
  { chinese: "今天", pinyin: "jīntiān", vietnamese: "Hôm nay", level: "HSK 1" },
  { chinese: "汉语", pinyin: "Hànyǔ", vietnamese: "Tiếng Trung / Hán ngữ", level: "HSK 1" },
  { chinese: "可以", pinyin: "kěyǐ", vietnamese: "Có thể / Được phép", level: "HSK 2" },
  { chinese: "特别", pinyin: "tèbié", vietnamese: "Đặc biệt", level: "HSK 3" },
  { chinese: "礼物", pinyin: "lǐwù", vietnamese: "Món quà", level: "HSK 3" },
  { chinese: "听说", pinyin: "tīngshuō", vietnamese: "Nghe nói", level: "HSK 4" },
  { chinese: "得到", pinyin: "dédào", vietnamese: "Nhận được / Đạt được", level: "HSK 4" },
  { chinese: "是真的吗", pinyin: "shì zhēn de ma", vietnamese: "Có thật không?", level: "HSK 2" },
  // Trái cây & Kem sữa (New words!)
  { chinese: "芒果", pinyin: "mángguǒ", vietnamese: "Xoài", level: "HSK 4" },
  { chinese: "桃子", pinyin: "táozi", vietnamese: "Đào", level: "HSK 4" },
  { chinese: "草莓", pinyin: "cǎoméi", vietnamese: "Dâu tây", level: "HSK 4" },
  { chinese: "柠檬", pinyin: "níngméng", vietnamese: "Chanh", level: "HSK 4" },
  { chinese: "奶盖", pinyin: "nǎigài", vietnamese: "Kem sữa (Lớp bọt sữa béo ngậy)", level: "HSK 4" }
];
