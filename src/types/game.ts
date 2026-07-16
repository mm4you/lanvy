export interface Voucher {
  id?: string;
  title: string;
  description: string;
  code: string;
  isRedeemed?: boolean;
  unlockedAt?: string;
}

export interface ChatMessage {
  sender: 'player' | 'customer';
  text: string;
  pinyin?: string;
  translation?: string;
}

export interface AdminProgress {
  score: number;
  coins: number;
  level: number;
}

export interface AdminUserLog {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  progress: AdminProgress | null;
  vouchers: Voucher[];
}

export type BrowserWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

