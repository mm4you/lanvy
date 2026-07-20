export interface ArchitectTerm {
  id: string;
  category: 'wood' | 'stone' | 'glass_metal' | 'fabric_leather' | 'lighting_cad';
  categoryNameVn: string;
  nameChinese: string;
  namePinyin: string;
  nameVietnamese: string;
  specification: string; // Quy cách kỹ thuật
  exampleChinese: string;
  examplePinyin: string;
  exampleVietnamese: string;
}

export const ARCHITECT_CATEGORIES = [
  { id: 'wood', label: 'Gỗ & Vật Liệu Gỗ (木材)' },
  { id: 'stone', label: 'Đá & Gạch (石材/瓷砖)' },
  { id: 'glass_metal', label: 'Kính & Kim Loại (玻璃/金属)' },
  { id: 'fabric_leather', label: 'Vải & Da (布艺/皮革)' },
  { id: 'lighting_cad', label: 'Chiếu Sáng & Bản Vẽ (灯光/图纸)' },
];

export const ARCHITECT_TERMS: ArchitectTerm[] = [
  // --- GỖ (木材) ---
  {
    id: 'arch_w1',
    category: 'wood',
    categoryNameVn: 'Gỗ & Vật Liệu Gỗ (木材)',
    nameChinese: '黑胡桃木',
    namePinyin: 'hēihútáo mù',
    nameVietnamese: 'Gỗ óc chó đen',
    specification: 'Gỗ tự nhiên cao cấp, vân đẹp mộc mạc, chuyên dùng tủ & bàn ăn sang trọng.',
    exampleChinese: '这款餐桌采用精选黑胡桃木打造。',
    examplePinyin: 'Zhè kuǎn cānzhuō cǎiòng jīngxuǎn hēihútáo mù dǎzào.',
    exampleVietnamese: 'Mẫu bàn ăn này được chế tác từ gỗ óc chó đen chọn lọc.'
  },
  {
    id: 'arch_w2',
    category: 'wood',
    categoryNameVn: 'Gỗ & Vật Liệu Gỗ (木材)',
    nameChinese: '橡木',
    namePinyin: 'xiàngmù',
    nameVietnamese: 'Gỗ sồi',
    specification: 'Gỗ sồi tự nhiên màu sáng, phù hợp phong cách Bắc Âu (Scandi) & Minimalist.',
    exampleChinese: '书房里定制了一整面橡木书架。',
    examplePinyin: 'Shūfáng lǐ dìngzhì le yì zhěng miàn xiàngmù shūjià.',
    exampleVietnamese: 'Trong phòng đọc sách thiết kế riêng một hệ kệ sách gỗ sồi kịch trần.'
  },
  {
    id: 'arch_w3',
    category: 'wood',
    categoryNameVn: 'Gỗ & Vật Liệu Gỗ (木材)',
    nameChinese: '中纤板 (MDF)',
    namePinyin: 'zhōngxiānbǎn',
    nameVietnamese: 'Gỗ công nghiệp MDF',
    specification: 'Ván sợi mật độ trung bình phủ Melamine chống ẩm, dùng làm cánh tủ hiện đại.',
    exampleChinese: '衣柜门板使用防潮中纤板。',
    examplePinyin: 'Yīguì ménbǎn shǐyòng fángcháo zhōngxiānbǎn.',
    exampleVietnamese: 'Cánh cửa tủ quần áo sử dụng gỗ MDF chống ẩm.'
  },
  {
    id: 'arch_w4',
    category: 'wood',
    categoryNameVn: 'Gỗ & Vật Liệu Gỗ (木材)',
    nameChinese: '实木贴皮',
    namePinyin: 'shímù tiēpí',
    nameVietnamese: 'Veneer gỗ tự nhiên',
    specification: 'Lớp láng gỗ thật phủ bề mặt cốt MDF, giữ vân gỗ tự nhiên với chi phí hợp lý.',
    exampleChinese: '背景墙采用实木贴皮工艺。',
    examplePinyin: 'Bèijǐngqiáng cǎiòng shímù tiēpí gōngyì.',
    exampleVietnamese: 'Mảng tường nhấn trang trí sử dụng công nghệ phủ Veneer gỗ tự nhiên.'
  },

  // --- ĐÁ & GẠCH (石材与瓷砖) ---
  {
    id: 'arch_s1',
    category: 'stone',
    categoryNameVn: 'Đá & Gạch (石材与瓷砖)',
    nameChinese: '大理石',
    namePinyin: 'dàlǐshí',
    nameVietnamese: 'Đá hoa cương / Cẩm thạch',
    specification: 'Vân đá tự nhiên lộng lẫy, bề mặt bóng mờ cao cấp dùng ốp mặt bếp & bàn trà.',
    exampleChinese: '客厅地面铺设了天然白色大理石。',
    examplePinyin: 'Kètīng dìmiàn pūshè le tiānrán báisè dàlǐshí.',
    exampleVietnamese: 'Sàn phòng khách lát đá cẩm thạch màu trắng tự nhiên.'
  },
  {
    id: 'arch_s2',
    category: 'stone',
    categoryNameVn: 'Đá & Gạch (石材与瓷砖)',
    nameChinese: '岩板',
    namePinyin: 'yánbǎn',
    nameVietnamese: 'Đá nung kết (Sintered Stone)',
    specification: 'Đá nhân tạo thế hệ mới chống trầy xước tuyệt đối, chịu nhiệt tốt.',
    exampleChinese: '岛台桌面选用超薄岩板。',
    examplePinyin: 'Dǎotái zhuōmiàn xuǎnyòng chāobáo yánbǎn.',
    exampleVietnamese: 'Mặt bàn đảo bếp ưu tiên lựa chọn đá nung kết siêu mỏng.'
  },
  {
    id: 'arch_s3',
    category: 'stone',
    categoryNameVn: 'Đá & Gạch (石材与瓷砖)',
    nameChinese: '微水泥',
    namePinyin: 'wēishuǐní',
    nameVietnamese: 'Bê tông vi sinh (Microcement)',
    specification: 'Lớp phủ xi măng siêu mỏng liền mạch, đặc trưng phong cách Wabi-sabi.',
    exampleChinese: '卧室墙面刷了灰色微水泥。',
    examplePinyin: 'Wòshì qiángmiàn shuā le huīsè wēishuǐní.',
    exampleVietnamese: 'Bức tường phòng ngủ được hoàn thiện bằng lớp xi măng vi sinh màu xám.'
  },

  // --- KÍNH & KIM LOẠI (玻璃与金属) ---
  {
    id: 'arch_g1',
    category: 'glass_metal',
    categoryNameVn: 'Kính & Kim Loại (玻璃与金属)',
    nameChinese: '长虹玻璃',
    namePinyin: 'chánghóng bōli',
    nameVietnamese: 'Kính sọc / Kính gợn sóng',
    specification: 'Kính gân sọc xuyên sáng mờ ảo, làm vách ngăn căn hộ cực kỳ nghệ thuật.',
    exampleChinese: '卫生间门采用黑色边框的长虹玻璃。',
    examplePinyin: 'Wèishēngjiān mén cǎiòng hēisè biānkuàng de chánghóng bōli.',
    exampleVietnamese: 'Cửa nhà vệ sinh dùng kính gợn sóng viền kim loại màu đen.'
  },
  {
    id: 'arch_g2',
    category: 'glass_metal',
    categoryNameVn: 'Kính & Kim Loại (玻璃与金属)',
    nameChinese: '拉丝黄铜',
    namePinyin: 'lāsī huángtóng',
    nameVietnamese: 'Đồng thau xước (Brushed Brass)',
    specification: 'Kim loại vàng xước mờ sang trọng, làm nẹp trang trí & tay nắm cửa.',
    exampleChinese: '拉丝黄铜线条增加了空间的轻奢感。',
    examplePinyin: 'Lāsī huángtóng xiàntiáo zēngjiā le kōngjiān de qīngshē gǎn.',
    exampleVietnamese: 'Các đường nẹp đồng thau xước tăng thêm cảm giác sang trọng hiện đại cho không gian.'
  },
  {
    id: 'arch_g3',
    category: 'glass_metal',
    categoryNameVn: 'Kính & Kim Loại (玻璃与金属)',
    nameChinese: '钢化玻璃',
    namePinyin: 'gānghuà bōli',
    nameVietnamese: 'Kính cường lực',
    specification: 'Kính chịu lực gấp 5 lần kính thường, an toàn tuyệt đối cho vách tắm & bàn trà.',
    exampleChinese: '茶几采用8毫米厚钢化玻璃。',
    examplePinyin: 'Chájī cǎiòng bā háomǐ hòu gānghuà bōli.',
    exampleVietnamese: 'Bàn trà dùng kính cường lực dày 8mm.'
  },

  // --- VẢI & DA (布艺与皮革) ---
  {
    id: 'arch_f1',
    category: 'fabric_leather',
    categoryNameVn: 'Vải & Da Nội Thất (布艺与皮革)',
    nameChinese: '意大利真皮',
    namePinyin: 'yìdàlì zhēnpí',
    nameVietnamese: 'Da bò Ý tự nhiên',
    specification: 'Da nhập khẩu cao cấp, độ bám êm ái, độ bền vượt trội theo thời gian.',
    exampleChinese: '主卧单人意式沙发包裹着意大利真皮。',
    examplePinyin: 'Zhǔwò dānrén yìshì shāfā bāoguǒ zhe Yìdàlì zhēnpí.',
    exampleVietnamese: 'Chiếc ghế sofa bọc da bò Ý tự nhiên êm ái.'
  },
  {
    id: 'arch_f2',
    category: 'fabric_leather',
    categoryNameVn: 'Vải & Da Nội Thất (布艺与皮革)',
    nameChinese: '羊羔绒 (Bouclé)',
    namePinyin: 'yánggāoróng',
    nameVietnamese: 'Vải xù lông cừu (Bouclé Fabric)',
    specification: 'Vải cuộn xù mềm mại mộc mạc, xu hướng nội thất hiện đại được ưa chuộng.',
    exampleChinese: '羊羔绒椅面非常柔软舒适。',
    examplePinyin: 'Yánggāoróng yǐmiàn fēicháng róuruǎn shūshì.',
    exampleVietnamese: 'Mặt ghế bọc vải xù lông cừu vô cùng mềm mại thoải mái.'
  },

  // --- CHIẾU SÁNG & CAD (照明与施工图例) ---
  {
    id: 'arch_l1',
    category: 'lighting_cad',
    categoryNameVn: 'Bản Vẽ CAD & Chiếu Sáng (照明与施工图例)',
    nameChinese: '无主灯设计',
    namePinyin: 'wú zhǔdēng shèjì',
    nameVietnamese: 'Thiết kế ánh sáng không đèn chính',
    specification: 'Xu hướng ánh sáng phân tầng: kết hợp đèn rọi âm trần, đèn hắt khe & rãnh nam dịch.',
    exampleChinese: '现代客厅流行无主灯设计。',
    examplePinyin: 'Xiàndài kètīng liúxíng wú zhǔdēng shèjì.',
    exampleVietnamese: 'Phòng khách hiện đại đang rất thịnh hành thiết kế ánh sáng không dùng đèn chính.'
  },
  {
    id: 'arch_l2',
    category: 'lighting_cad',
    categoryNameVn: 'Bản Vẽ CAD & Chiếu Sáng (照明与施工图例)',
    nameChinese: '平面布局图',
    namePinyin: 'píngmiàn bùjú tú',
    nameVietnamese: 'Bản vẽ mặt bằng bố trí nội thất (Floor Plan)',
    specification: 'Bản vẽ 2D thể hiện vị trí kích thước từng món đồ trong không gian kiến trúc.',
    exampleChinese: '请设计师确认平面布局图。',
    examplePinyin: 'Qǐng shèjìshī quèrèn píngmiàn bùjú tú.',
    exampleVietnamese: 'Xin mời kiến trúc sư xác nhận bản vẽ mặt bằng bố trí.'
  },
  {
    id: 'arch_l3',
    category: 'lighting_cad',
    categoryNameVn: 'Bản Vẽ CAD & Chiếu Sáng (照明与施工图例)',
    nameChinese: '筒灯与线型灯',
    namePinyin: 'tǒngdēng yǔ xiànxíngdēng',
    nameVietnamese: 'Đèn âm trần & Đèn LED định hình',
    specification: 'Đèn rọi điểm nhiệt độ màu 3000K ấm áp tạo điểm nhấn chiếu sáng tác phẩm nghệ thuật.',
    exampleChinese: '吊顶开槽嵌入了3000K暖色线型灯。',
    examplePinyin: 'Diàodǐng kāicáo qiànrù le 3000K nuǎnsè xiànxíngdēng.',
    exampleVietnamese: 'Trần thạch cao soi rãnh gắn dải đèn LED âm tường ánh sáng ấm 3000K.'
  }
];
