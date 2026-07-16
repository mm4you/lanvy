export type BodyStyle = 'feminine' | 'masculine' | 'neutral';
export type HairStyle = 'short' | 'bob' | 'ponytail' | 'wave' | 'spiky';
export type OutfitStyle = 'apron' | 'casual' | 'hanfu' | 'varsity' | 'overalls';
export type AccessoryStyle = 'none' | 'glasses' | 'bow' | 'cap';

export interface AvatarConfig {
  bodyStyle: BodyStyle;
  skinTone: string;
  hairStyle: HairStyle;
  hairColor: string;
  outfit: OutfitStyle;
  accessory: AccessoryStyle;
  ownedItems: string[];
}

export interface CosmeticItem {
  id: string;
  type: 'hair' | 'outfit' | 'accessory';
  name: string;
  value: HairStyle | OutfitStyle | AccessoryStyle;
  price: number;
  color: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  bodyStyle: 'neutral',
  skinTone: '#f2bd91',
  hairStyle: 'short',
  hairColor: '#3f271d',
  outfit: 'apron',
  accessory: 'none',
  ownedItems: ['hair-short', 'hair-bob', 'outfit-apron', 'outfit-casual', 'accessory-none'],
};

export const SKIN_TONES = ['#f8d8ba', '#f2bd91', '#ce8f65', '#965f45', '#67412f'];
export const HAIR_COLORS = ['#231f20', '#5a3825', '#9a4f32', '#d49b45', '#294f73', '#74446d'];

export const COSMETICS: CosmeticItem[] = [
  { id: 'hair-short', type: 'hair', name: 'Tóc ngắn gọn', value: 'short', price: 0, color: '#5a3825' },
  { id: 'hair-bob', type: 'hair', name: 'Tóc bob mềm', value: 'bob', price: 0, color: '#9a4f32' },
  { id: 'hair-ponytail', type: 'hair', name: 'Tóc đuôi ngựa', value: 'ponytail', price: 80, color: '#d49b45' },
  { id: 'hair-wave', type: 'hair', name: 'Tóc dài gợn sóng', value: 'wave', price: 120, color: '#74446d' },
  { id: 'hair-spiky', type: 'hair', name: 'Tóc dựng năng động', value: 'spiky', price: 100, color: '#294f73' },
  { id: 'outfit-apron', type: 'outfit', name: 'Tạp dề chủ quán', value: 'apron', price: 0, color: '#ef5350' },
  { id: 'outfit-casual', type: 'outfit', name: 'Áo dạo phố', value: 'casual', price: 0, color: '#2563eb' },
  { id: 'outfit-hanfu', type: 'outfit', name: 'Hán phục lễ hội', value: 'hanfu', price: 180, color: '#db2777' },
  { id: 'outfit-varsity', type: 'outfit', name: 'Áo khoác học viện', value: 'varsity', price: 140, color: '#15803d' },
  { id: 'outfit-overalls', type: 'outfit', name: 'Yếm làm vườn', value: 'overalls', price: 120, color: '#ca8a04' },
  { id: 'accessory-none', type: 'accessory', name: 'Không phụ kiện', value: 'none', price: 0, color: '#ffffff' },
  { id: 'accessory-glasses', type: 'accessory', name: 'Kính tròn', value: 'glasses', price: 70, color: '#172033' },
  { id: 'accessory-bow', type: 'accessory', name: 'Nơ tóc đỏ', value: 'bow', price: 90, color: '#ef4444' },
  { id: 'accessory-cap', type: 'accessory', name: 'Mũ thị trấn', value: 'cap', price: 110, color: '#0e7490' },
];

export function normalizeAvatar(value: Partial<AvatarConfig> | null | undefined): AvatarConfig {
  return {
    ...DEFAULT_AVATAR,
    ...value,
    ownedItems: Array.from(new Set([...DEFAULT_AVATAR.ownedItems, ...(value?.ownedItems ?? [])])),
  };
}

