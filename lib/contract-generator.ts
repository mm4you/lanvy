import { DesignContract, FURNITURE_ITEMS, FurnitureItem } from '../data/vocabulary';

const CLIENT_NAMES = [
  'Linh', 'Minh', 'An', 'Hoa', 'Tuấn', 'Đức', 'Phương', 'Nam', 
  'Trang', 'Hùng', 'Vy', 'Nhựt Khang', 'Bảo', 'Mai', 'Thảo'
];

const CLIENT_SPRITES = ['tien', 'ngoc', 'vy', 'khang', 'panda', 'cat', 'shiba'];

const TITLE_TEMPLATES = [
  'Phòng ngủ tối giản',
  'Góc đọc sách hiện đại',
  'Căn phòng nhỏ ấm cúng',
  'Góc làm việc tiện nghi',
  'Phòng khách mộng mơ',
  'Góc thư giãn ngày hè',
  'Không gian sống xanh',
  'Phòng học tập ngăn nắp',
  'Căn phòng phong cách nhẹ nhàng',
  'Góc nghỉ ngơi lãng mạn'
];

/**
 * Hàm sinh tự động hợp đồng thiết kế mới dựa trên bộ từ vựng HSK
 */
export function generateDynamicContract(customId?: number, levelMultiplier: number = 1): DesignContract {
  const contractId = customId || Date.now();
  const clientName = CLIENT_NAMES[Math.floor(Math.random() * CLIENT_NAMES.length)];
  const clientSprite = CLIENT_SPRITES[Math.floor(Math.random() * CLIENT_SPRITES.length)];
  const title = TITLE_TEMPLATES[Math.floor(Math.random() * TITLE_TEMPLATES.length)];

  // Random chọn 2 hoặc 3 món nội thất không trùng nhau
  const itemCount = Math.random() > 0.4 ? 3 : 2;
  const shuffledItems = [...FURNITURE_ITEMS].sort(() => 0.5 - Math.random());
  const selectedItems: FurnitureItem[] = shuffledItems.slice(0, itemCount);

  const targetRequirements = selectedItems.map(i => i.id);

  // Tạo câu tiếng Trung, Pinyin & Tiếng Việt dựa trên mẫu câu HSK
  let promptChinese = '';
  let promptPinyin = '';
  let promptVietnamese = '';

  const itemNamesZh = selectedItems.map(i => i.nameChinese);
  const itemNamesPy = selectedItems.map(i => i.namePinyin);
  const itemNamesVn = selectedItems.map(i => i.nameVietnamese);

  const patternIndex = Math.floor(Math.random() * 3);

  if (itemCount === 2) {
    if (patternIndex === 0) {
      promptChinese = `我要一个${itemNamesZh[0]}和一个${itemNamesZh[1]}。`;
      promptPinyin = `Wǒ yào yí ge ${itemNamesPy[0]} hé yí ge ${itemNamesPy[1]}.`;
      promptVietnamese = `Tôi muốn một ${itemNamesVn[0]} và một ${itemNamesVn[1]}.`;
    } else if (patternIndex === 1) {
      promptChinese = `我需要一个${itemNamesZh[0]}和一个${itemNamesZh[1]}。`;
      promptPinyin = `Wǒ xūyào yí ge ${itemNamesPy[0]} hé yí ge ${itemNamesPy[1]}.`;
      promptVietnamese = `Tôi cần một ${itemNamesVn[0]} và một ${itemNamesVn[1]}.`;
    } else {
      promptChinese = `请给我一个${itemNamesZh[0]}和一个${itemNamesZh[1]}。`;
      promptPinyin = `Qǐng gěi wǒ yí ge ${itemNamesPy[0]} hé yí ge ${itemNamesPy[1]}.`;
      promptVietnamese = `Xin hãy cho tôi một ${itemNamesVn[0]} và một ${itemNamesVn[1]}.`;
    }
  } else {
    if (patternIndex === 0) {
      promptChinese = `我想要一个${itemNamesZh[0]}，一个${itemNamesZh[1]}和一个${itemNamesZh[2]}。`;
      promptPinyin = `Wǒ xiǎng yào yí ge ${itemNamesPy[0]}, yí ge ${itemNamesPy[1]} hé yí ge ${itemNamesPy[2]}.`;
      promptVietnamese = `Tôi muốn có một ${itemNamesVn[0]}, một ${itemNamesVn[1]} và một ${itemNamesVn[2]}.`;
    } else if (patternIndex === 1) {
      promptChinese = `请给我一个${itemNamesZh[0]}，一个${itemNamesZh[1]} và 一个${itemNamesZh[2]}。`.replace('và', '和');
      promptPinyin = `Qǐng gěi wǒ yí ge ${itemNamesPy[0]}, yí ge ${itemNamesPy[1]} hé yí ge ${itemNamesPy[2]}.`;
      promptVietnamese = `Xin hãy cho tôi một ${itemNamesVn[0]}, một ${itemNamesVn[1]} và một ${itemNamesVn[2]}.`;
    } else {
      promptChinese = `我需要一个${itemNamesZh[0]}，一个${itemNamesZh[1]}和一个${itemNamesZh[2]}。`;
      promptPinyin = `Wǒ xūyào yí ge ${itemNamesPy[0]}, yí ge ${itemNamesPy[1]} hé yí ge ${itemNamesPy[2]}.`;
      promptVietnamese = `Tôi cần một ${itemNamesVn[0]}, một ${itemNamesVn[1]} và một ${itemNamesVn[2]}.`;
    }
  }

  const level = Math.min(3, Math.max(1, Math.floor(Math.random() * levelMultiplier) + 1));
  const baseReward = itemCount === 2 ? 140 : 220;
  const rewardCoins = baseReward + Math.floor(Math.random() * 50);
  const rewardScore = Math.floor(rewardCoins * 1.25);

  const description = `${clientName} cần thiết kế một không gian nhỏ thích hợp. ${clientName} muốn có: ${itemNamesVn.join(', ')}.`;

  return {
    id: contractId,
    level,
    clientName,
    clientSprite,
    title: `${title} (${clientName})`,
    description,
    promptChinese,
    promptPinyin,
    promptVietnamese,
    targetRequirements,
    rewardCoins,
    rewardScore
  };
}
