'use client';

import { useState, useEffect, useRef } from 'react';
import { FURNITURE_ITEMS, MATERIAL_ITEMS, DESIGN_CONTRACTS, FurnitureItem, MaterialItem, DesignContract, HSK_GRAMMAR_RULES, GENERAL_VOCAB_ITEMS } from '../data/vocabulary';
import dynamic from 'next/dynamic';
import { renderFurnitureSVG } from '../components/RoomEditor';
import { generateDynamicContract } from '../lib/contract-generator';

const RoomEditor = dynamic(() => import('../components/RoomEditor'), {
  loading: () => <div className="py-16 text-center text-xs font-black font-serif opacity-70 animate-pulse">Đang tải Tiệm Thiết Kế...</div>
});

const BlueprintQuiz = dynamic(() => import('../components/BlueprintQuiz'), {
  loading: () => <div className="py-16 text-center text-xs font-black font-serif opacity-70 animate-pulse">Đang tải Bản Vẽ HSK...</div>
});

const LoveInbox = dynamic(() => import('../components/LoveInbox'), {
  loading: () => <div className="py-16 text-center text-xs font-black font-serif opacity-70 animate-pulse">Đang tải Ví Voucher & Thư Tình...</div>
});

const FlashcardViewer = dynamic(() => import('../components/FlashcardViewer'), {
  loading: () => <div className="py-16 text-center text-xs font-black font-serif opacity-70 animate-pulse">Đang tải Flashcard HSK...</div>
});

const ArrangementModal = dynamic(() => import('../components/ArrangementModal').then(m => m.ArrangementModal), {
  loading: () => null
});

const VoiceRoastModal = dynamic(() => import('../components/VoiceRoastModal').then(m => m.VoiceRoastModal), {
  loading: () => null
});

const ArchitectGlossaryModal = dynamic(() => import('../components/ArchitectGlossaryModal').then(m => m.ArchitectGlossaryModal), {
  loading: () => null
});

const PixelPet = dynamic(() => import('../components/PixelPet').then(m => m.PixelPet), {
  loading: () => null
});

interface PlacedItem {
  id: string;
  itemTypeId: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
}

// Các Icon SVG dùng chung thay thế cho Emojis
function renderCoinIcon(className = 'w-4 h-4 text-amber-500 inline mr-1') {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <circle cx="12" cy="12" r="8" fill="#fef08a" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function renderSunIcon(className = 'w-4 h-4 text-amber-500') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function renderMoonIcon(className = 'w-4 h-4 text-indigo-400') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function renderShoppingBagIcon(className = 'w-4 h-4 text-amber-500') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function renderClipboardIcon(className = 'w-5 h-5 text-gray-500 inline mr-1') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function renderHeartIcon(className = 'w-6 h-6') {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function renderBookIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function renderMailIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
    </svg>
  );
}

function renderVoucherIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v12m-9-12v12M3 9a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4V9z" />
    </svg>
  );
}

function renderHomeIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function renderAwardIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function renderAudioIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
}

function renderAIIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function getVocabCategory(item: any): string {
  if (item.category) return item.category;
  
  const text = (item.nameVietnamese || '') + ' ' + (item.nameChinese || '');
  if (text.includes('Yêu') || text.includes('thích') || text.includes('Sở thích') || text.includes('Tình yêu') || text.includes('Ca hát') || text.includes('Cảm ơn') || text.includes('Tạm biệt') || text.includes('quen') || text.includes('爱') || text.includes('谢谢') || text.includes('歌')) {
    return 'Sở thích & Hẹn hò';
  }
  if (text.includes('cốc') || text.includes('bàn') || text.includes('ghế') || text.includes('vi tính') || text.includes('Tivi') || text.includes('phòng') || text.includes('nhà') || text.includes('cửa') || text.includes('Trường học') || text.includes('Màu') || text.includes('trắng') || text.includes('Quần áo') || text.includes('杯') || text.includes('桌') || text.includes('椅') || text.includes('电') || text.includes('白') || text.includes('衣')) {
    return 'Gia đình & Nhà cửa';
  }
  if (text.includes('Học') || text.includes('Công việc') || text.includes('Tiếng Trung') || text.includes('Giúp') || text.includes('Báo') || text.includes('học') || text.includes('viên') || text.includes('gặp') || text.includes('biết') || text.includes('汉语') || text.includes('学') || text.includes('工') || text.includes('报')) {
    return 'Học tập & Công việc';
  }
  if (text.includes('Thời tiết') || text.includes('Hôm qua') || text.includes('Hôm nay') || text.includes('Ngày mai') || text.includes('thời gian') || text.includes('phút') || text.includes('giờ') || text.includes('天') || text.includes('昨') || text.includes('今') || text.includes('明') || text.includes('时')) {
    return 'Thời tiết & Thời gian';
  }
  return 'Tổng hợp HSK (Mặc định)';
}

function renderSignoutIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

// Avatar vẽ bằng SVG siêu cute
function renderClientAvatar(sprite: string, className = 'w-12 h-12') {
  switch (sprite) {
    case 'panda':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="17" r="11" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
          <circle cx="8" cy="8" r="4.5" fill="#1f2937" />
          <circle cx="24" cy="8" r="4.5" fill="#1f2937" />
          <ellipse cx="10" cy="15" rx="3.5" ry="4.5" fill="#1f2937" />
          <ellipse cx="22" cy="15" rx="3.5" ry="4.5" fill="#1f2937" />
          <circle cx="10" cy="14" r="1" fill="#ffffff" />
          <circle cx="22" cy="14" r="1" fill="#ffffff" />
          <polygon points="14,20 18,20 16,22" fill="#1f2937" />
        </svg>
      );
    case 'cat':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="18" r="10.5" fill="#94a3b8" stroke="#1f2937" strokeWidth="2" />
          <polygon points="6,10 12,14 6,16" fill="#64748b" stroke="#1f2937" strokeWidth="2" />
          <polygon points="26,10 20,14 26,16" fill="#64748b" stroke="#1f2937" strokeWidth="2" />
          <circle cx="12" cy="17" r="2" fill="#1f2937" />
          <circle cx="20" cy="17" r="2" fill="#1f2937" />
          <polygon points="15,20 17,20 16,21.5" fill="#f43f5e" />
          <line x1="8" y1="19" x2="4" y2="18" stroke="#1f2937" strokeWidth="1.5" />
          <line x1="24" y1="19" x2="28" y2="18" stroke="#1f2937" strokeWidth="1.5" />
        </svg>
      );
    case 'shiba':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="18" r="10.5" fill="#f97316" stroke="#1f2937" strokeWidth="2" />
          <polygon points="6,9 13,12 8,16" fill="#ea580c" stroke="#1f2937" strokeWidth="2" />
          <polygon points="26,9 19,12 24,16" fill="#ea580c" stroke="#1f2937" strokeWidth="2" />
          <ellipse cx="11" cy="16" rx="4" ry="5.5" fill="#ffffff" />
          <ellipse cx="21" cy="16" rx="4" ry="5.5" fill="#ffffff" />
          <circle cx="12" cy="16" r="2.2" fill="#1f2937" />
          <circle cx="20" cy="16" r="2.2" fill="#1f2937" />
          <ellipse cx="16" cy="19" rx="2.5" ry="1.8" fill="#1f2937" />
        </svg>
      );
    case 'khang':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          {/* Tóc đen */}
          <path d="M 6 12 C 6 6, 26 6, 26 12 Z" fill="#1f2937" />
          <circle cx="16" cy="18" r="9" fill="#fed7aa" stroke="#1f2937" strokeWidth="2" />
          {/* Mái tóc */}
          <path d="M 6 12 Q 16 6 26 12 Q 18 13 16 11 Q 14 13 6 12" fill="#1f2937" stroke="#1f2937" strokeWidth="1.5" />
          {/* Kính cận tròn */}
          <circle cx="12" cy="17" r="3.2" fill="none" stroke="#1f2937" strokeWidth="2" />
          <circle cx="20" cy="17" r="3.2" fill="none" stroke="#1f2937" strokeWidth="2" />
          <line x1="15" y1="17" x2="17" y2="17" stroke="#1f2937" strokeWidth="2" />
          {/* Mắt */}
          <circle cx="12" cy="17" r="1" fill="#1f2937" />
          <circle cx="20" cy="17" r="1" fill="#1f2937" />
          <path d="M 14 22 Q 16 23.5 18 22" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'tien':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          {/* Short brown hair */}
          <path d="M 6 13 C 6 6, 26 6, 26 13 Z" fill="#7c2d12" />
          <circle cx="16" cy="18" r="9" fill="#fed7aa" stroke="#1f2937" strokeWidth="2" />
          {/* Hair bangs */}
          <path d="M 6 13 Q 16 7 26 13 Q 20 14 18 11 Q 13 15 6 13" fill="#7c2d12" stroke="#1f2937" strokeWidth="1.5" />
          {/* Flower hair clip */}
          <circle cx="9" cy="11" r="2" fill="#fbbf24" stroke="#1f2937" strokeWidth="1" />
          <circle cx="7.5" cy="9.5" r="1.2" fill="#ffffff" />
          <circle cx="10.5" cy="9.5" r="1.2" fill="#ffffff" />
          <circle cx="7.5" cy="12.5" r="1.2" fill="#ffffff" />
          <circle cx="10.5" cy="12.5" r="1.2" fill="#ffffff" />
          {/* Eyes */}
          <circle cx="12" cy="17" r="1.2" fill="#1f2937" />
          <circle cx="20" cy="17" r="1.2" fill="#1f2937" />
          {/* Blushing cheeks */}
          <ellipse cx="9" cy="19" rx="1.5" ry="1" fill="#fecdd3" />
          <ellipse cx="23" cy="19" rx="1.5" ry="1" fill="#fecdd3" />
          {/* Smile */}
          <path d="M 14 21 Q 16 22.5 18 21" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'ngoc':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          {/* Ponytail extension */}
          <path d="M 23 11 C 28 8, 30 18, 25 21 C 23 18, 23 13, 23 11 Z" fill="#1e293b" stroke="#1f2937" strokeWidth="1.5" />
          {/* Head */}
          <circle cx="16" cy="18" r="9" fill="#fed7aa" stroke="#1f2937" strokeWidth="2" />
          {/* Black hair */}
          <path d="M 6 13 C 6 6, 26 6, 26 13 Z" fill="#1e293b" />
          <path d="M 6 13 Q 16 8 26 13 Q 19 13 16 11 Q 12 14 6 13" fill="#1e293b" stroke="#1f2937" strokeWidth="1.5" />
          {/* Glasses */}
          <rect x="9" y="14" width="6" height="5" rx="1.5" fill="none" stroke="#1f2937" strokeWidth="2" />
          <rect x="17" y="14" width="6" height="5" rx="1.5" fill="none" stroke="#1f2937" strokeWidth="2" />
          <line x1="15" y1="16" x2="17" y2="16" stroke="#1f2937" strokeWidth="2" />
          {/* Eyes inside glasses */}
          <circle cx="12" cy="16.5" r="0.8" fill="#1f2937" />
          <circle cx="20" cy="16.5" r="0.8" fill="#1f2937" />
          {/* Smile */}
          <path d="M 14 22 Q 16 23.5 18 22" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'vy':
    case 'lan_vy':
      return (
        <img src="/lanvy-avatar.png" alt="Lan Vy" className={`${className} rounded-full object-cover border-2 border-pink-300`} />
      );
    default:
      return (
        <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center font-bold text-[#1f2937]">
          K
        </div>
      );
  }
}

export default function Home() {
  // Auth state
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const LOVE_EMAIL = 'nguyenthilanvy12a2@gmail.com';

  // Game data state
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(100);
  const [level, setLevel] = useState(1);
  const [unlockedItems, setUnlockedItems] = useState<string[]>(['single_bed', 'wood_table', 'wood_chair']);
  const [unlockedVouchers, setUnlockedVouchers] = useState<any[]>([]);

  // Room customization state
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [wallpaper, setWallpaper] = useState<string>('cream_white');
  const [floorType, setFloorType] = useState<string>('cozy_wood');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // PWA install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    playSfx('click');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('Để thêm ứng dụng vào Màn hình chính:\n\n- Trên Android / Chrome: Bấm nút (...) trên góc trình duyệt -> Chọn "Thêm vào màn hình chính" (Add to Home screen).\n- Trên iPhone / Safari: Bấm nút Chia sẻ (Share) -> Chọn "Thêm vào Màn hình chính" (Add to Home Screen).');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('boba_game_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('boba_game_theme', next ? 'dark' : 'light');
    playSfx('click');
  };

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'studio' | 'quiz' | 'room' | 'love' | 'library' | 'admin'>('studio');

  // AI assistant states
  const [explainWord, setExplainWord] = useState<string | null>(null);
  const [explanationText, setExplanationText] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Contracts state
  const [currentContract, setCurrentContract] = useState<DesignContract | null>(null);
  const [contractSubmitMsg, setContractSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [completedContracts, setCompletedContracts] = useState<number[]>([]);
  const [contractSelectedItems, setContractSelectedItems] = useState<string[]>([]);
  const [showStudioHint, setShowStudioHint] = useState(false);
  const [dynamicContracts, setDynamicContracts] = useState<DesignContract[]>([]);
  const [showArrangementModal, setShowArrangementModal] = useState<boolean>(false);
  const [showPetShopModal, setShowPetShopModal] = useState<boolean>(false);
  const [selectedVoiceWord, setSelectedVoiceWord] = useState<{ wordChinese: string; wordPinyin: string; wordVietnamese: string } | null>(null);

  const allContracts = [...DESIGN_CONTRACTS, ...dynamicContracts];

  // Library subtab state
  const [librarySubTab, setLibrarySubTab] = useState<'furniture' | 'vocab' | 'grammar'>('furniture');
  const [selectedLibraryTheme, setSelectedLibraryTheme] = useState<string>('all');
  const isVy = user?.username.toLowerCase().includes('vy') || user?.email.toLowerCase() === 'nguyenthilanvy12a2@gmail.com';

  // Admin state & functions
  const ADMIN_EMAILS = ['ungnhutkhang53@gmail.com'];
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [selectedUserForVoucher, setSelectedUserForVoucher] = useState<string | null>(null);
  const [customVoucherTitle, setCustomVoucherTitle] = useState('');
  const [customVoucherDesc, setCustomVoucherDesc] = useState('');
  const [customVoucherCode, setCustomVoucherCode] = useState('');
  const [adminVoucherMsg, setAdminVoucherMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Admin Vocab Bot state
  const [customVocabs, setCustomVocabs] = useState<any[]>([]);
  const [vocabTheme, setVocabTheme] = useState('Mua sắm & Shopping');
  const [vocabCustomTheme, setVocabCustomTheme] = useState('');
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [libraryPage, setLibraryPage] = useState(1);
  const [generatedVocab, setGeneratedVocab] = useState<any[]>([]);
  const [showArchitectModal, setShowArchitectModal] = useState(false);
  const [vocabBotLoading, setVocabBotLoading] = useState(false);
  const [vocabBotMsg, setVocabBotMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotMsg, setForgotMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg(null);

    try {
      if (forgotStep === 'request') {
        const res = await fetch('/api/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send_code', email: forgotEmail }),
        });
        const data = await res.json();
        if (data.success) {
          setForgotMsg({ type: 'success', text: data.message });
          setForgotStep('verify');
        } else {
          setForgotMsg({ type: 'error', text: data.error || 'Lỗi gửi yêu cầu OTP.' });
        }
      } else if (forgotStep === 'verify') {
        const res = await fetch('/api/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verify_code', email: forgotEmail, code: forgotOtp }),
        });
        const data = await res.json();
        if (data.success) {
          setForgotMsg({ type: 'success', text: 'Mã OTP chính xác! Nhập mật khẩu mới bên dưới.' });
          setForgotStep('reset');
        } else {
          setForgotMsg({ type: 'error', text: data.error || 'Mã OTP không đúng.' });
        }
      } else if (forgotStep === 'reset') {
        const res = await fetch('/api/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'reset_password', email: forgotEmail, code: forgotOtp, password: forgotNewPass }),
        });
        const data = await res.json();
        if (data.success) {
          alert('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.');
          setShowForgotModal(false);
          setForgotStep('request');
          setForgotEmail('');
          setForgotOtp('');
          setForgotNewPass('');
          setAuthMode('login');
        } else {
          setForgotMsg({ type: 'error', text: data.error || 'Đặt lại mật khẩu thất bại.' });
        }
      }
    } catch (e: any) {
      setForgotMsg({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setForgotLoading(false);
    }
  };

  const fetchCustomVocabs = async () => {
    try {
      const res = await fetch('/api/vocab/list?limit=10000');
      const data = await res.json();
      if (data.success) {
        setCustomVocabs(data.list || []);
      }
    } catch (e) {
      console.error("Failed to fetch custom vocabs", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCustomVocabs();
    }
  }, [user]);

  const handleGenerateVocab = async () => {
    setVocabBotLoading(true);
    setVocabBotMsg(null);
    try {
      if (vocabTheme === 'all_themes') {
        const ALL_THEMES = [
          'Mua sắm & Shopping',
          'Ẩm thực & Đi ăn tiệm',
          'Màu sắc & Thiết kế',
          'Thời tiết & Thời gian',
          'Gia đình & Nhà cửa',
          'Phương hướng & Vị trí',
          'Sở thích & Hẹn hò',
          'Động vật & Thú cưng',
          'Học tập & Trường học',
          'Công việc & Văn phòng',
          'Giao thông & Du lịch',
          'Kiến trúc & Nội thất',
          'Cảm xúc & Mô tả',
          'Giải trí & Thể thao'
        ];

        let combined: any[] = [];
        for (const th of ALL_THEMES) {
          try {
            const res = await fetch('/api/admin/vocab/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: th, category: th })
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.vocabList)) {
              combined = [...combined, ...data.vocabList];
            }
          } catch (e) {
            console.error(`Error generating theme ${th}:`, e);
          }
        }
        if (combined.length > 0) {
          setGeneratedVocab(combined.map((item: any) => ({ ...item, selected: true })));
          setVocabBotMsg({ type: 'success', text: `Đã tự động bơm thành công ${combined.length} từ vựng phủ kín 14 chủ đề!` });
        } else {
          setVocabBotMsg({ type: 'error', text: 'Lỗi khi tạo từ vựng tổng hợp.' });
        }
      } else {
        const finalTheme = vocabTheme === 'custom' ? vocabCustomTheme : vocabTheme;
        if (!finalTheme.trim()) {
          setVocabBotMsg({ type: 'error', text: 'Vui lòng chọn hoặc nhập chủ đề từ vựng.' });
          setVocabBotLoading(false);
          return;
        }
        const res = await fetch('/api/admin/vocab/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: finalTheme, category: finalTheme })
        });
        const data = await res.json();
        if (data.success) {
          setGeneratedVocab(data.vocabList.map((item: any) => ({ ...item, selected: true })));
        } else {
          setVocabBotMsg({ type: 'error', text: data.error || 'Lỗi khi tạo từ vựng.' });
        }
      }
    } catch (e) {
      setVocabBotMsg({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setVocabBotLoading(false);
    }
  };

  const handleSaveVocab = async () => {
    const toSave = generatedVocab.filter(item => item.selected);
    if (toSave.length === 0) {
      setVocabBotMsg({ type: 'error', text: 'Chưa chọn từ vựng nào để lưu.' });
      return;
    }
    setVocabBotLoading(true);
    try {
      const res = await fetch('/api/admin/vocab/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocabList: toSave })
      });
      const data = await res.json();
      if (data.success) {
        setVocabBotMsg({ type: 'success', text: `Đã lưu thành công ${data.count} từ vào game!` });
        setGeneratedVocab([]);
        setVocabCustomTheme('');
        await fetchCustomVocabs();
      } else {
        setVocabBotMsg({ type: 'error', text: data.error || 'Lỗi khi lưu.' });
      }
    } catch (e) {
      setVocabBotMsg({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setVocabBotLoading(false);
    }
  };

  const handleDeleteVocab = async (id: string) => {
    try {
      const res = await fetch('/api/admin/vocab/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        await fetchCustomVocabs();
      }
    } catch (e) {
      console.error("Failed to delete vocab", e);
    }
  };

  const fetchAdminLogs = async () => {
    setAdminLoading(true);
    try {
      const res = await fetch('/api/admin/logs', {
        headers: { 'x-user-id': user?.id || '' }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleIssueVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForVoucher || !customVoucherTitle || !customVoucherDesc || !customVoucherCode) {
      setAdminVoucherMsg({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin.' });
      return;
    }
    try {
      const res = await fetch('/api/admin/voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || ''
        },
        body: JSON.stringify({
          userId: selectedUserForVoucher,
          title: customVoucherTitle,
          description: customVoucherDesc,
          code: customVoucherCode
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminVoucherMsg({ type: 'success', text: 'Tạo và gửi voucher thành công!' });
        setCustomVoucherTitle('');
        setCustomVoucherDesc('');
        setCustomVoucherCode('');
        await fetchAdminLogs();
      } else {
        setAdminVoucherMsg({ type: 'error', text: data.error || 'Có lỗi xảy ra khi tạo voucher.' });
      }
    } catch (e) {
      setAdminVoucherMsg({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    }
  };

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState('Góp ý giao diện');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackContact, setFeedbackContact] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackLoading(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          content: feedbackContent,
          contactEmail: feedbackContact,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg({ type: 'success', text: data.message });
        setFeedbackContent('');
        setTimeout(() => setShowFeedbackModal(false), 2000);
      } else {
        setFeedbackMsg({ type: 'error', text: data.error || 'Gửi góp ý thất bại.' });
      }
    } catch (e) {
      setFeedbackMsg({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Sound effects synthesizer
  const playSfx = (type: 'click' | 'success' | 'error' | 'perfect' | 'levelUp' | 'flip' | 'meow' | 'bark' | 'squeak' | 'grunt') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playTone = (freq: number, start: number, duration: number, vol = 0.06, wave: OscillatorType = 'sine') => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(vol, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      const now = ctx.currentTime;
      if (type === 'click') {
        playTone(500, now, 0.05, 0.04, 'triangle');
      } else if (type === 'flip') {
        playTone(300, now, 0.04, 0.06, 'sine');
        playTone(600, now + 0.04, 0.08, 0.06, 'sine');
      } else if (type === 'meow') {
        // Tiếng mèo kêu Meow Pixel ngọt ngào với pitch glide 2 bước
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.32);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.09, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'bark') {
        // Tiếng chó Shiba sủa gâu gâu lanh lảnh (2 tiếng sủa nhịp nhàng)
        [0, 0.12].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(460, now + offset);
          osc.frequency.exponentialRampToValueAtTime(180, now + offset + 0.08);
          gain.gain.setValueAtTime(0.1, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.09);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.09);
        });
      } else if (type === 'squeak') {
        // Tiếng thỏ chíp chíp cao & đáng yêu
        [0, 0.09].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, now + offset);
          osc.frequency.exponentialRampToValueAtTime(1900, now + offset + 0.05);
          gain.gain.setValueAtTime(0.08, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.07);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.07);
        });
      } else if (type === 'grunt') {
        // Tiếng gấu trúc nhai lá trúc / ủn ỉn ấm áp
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'success') {
        playTone(523.25, now, 0.1, 0.08, 'square');
        playTone(659.25, now + 0.08, 0.1, 0.08, 'square');
        playTone(783.99, now + 0.16, 0.2, 0.08, 'square');
      } else if (type === 'error') {
        playTone(150, now, 0.15, 0.12, 'sawtooth');
        playTone(100, now + 0.08, 0.25, 0.12, 'sawtooth');
      } else if (type === 'perfect') {
        playTone(523.25, now, 0.06, 0.08, 'sine');
        playTone(659.25, now + 0.04, 0.06, 0.08, 'sine');
        playTone(783.99, now + 0.08, 0.06, 0.08, 'sine');
        playTone(1046.50, now + 0.12, 0.25, 0.08, 'sine');
      } else if (type === 'levelUp') {
        playTone(440, now, 0.1, 0.08, 'triangle');
        playTone(554.37, now + 0.1, 0.1, 0.08, 'triangle');
        playTone(659.25, now + 0.2, 0.1, 0.08, 'triangle');
        playTone(880, now + 0.3, 0.35, 0.08, 'triangle');
      }
    } catch (e) {}
  };

  // Sync Progress to Neon DB
  const saveProgress = async (newScore: number, newCoins: number, newLevel: number, voucherToUnlock: any = null) => {
    if (!user) return;
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          score: newScore,
          coins: newCoins,
          level: newLevel,
          newVoucher: voucherToUnlock
        })
      });
      if (res.ok) {
        const data = await res.json();
        setUnlockedVouchers(data.vouchers || []);
      }
    } catch (e) {
      console.error('Failed to sync progress:', e);
    }
  };

  const loadProgress = async (userId: string) => {
    try {
      const res = await fetch('/api/progress', {
        headers: { 'x-user-id': userId }
      });
      if (res.ok) {
        const data = await res.json();
        setScore(data.progress.score);
        setCoins(data.progress.coins);
        setLevel(data.progress.level);
        setUnlockedVouchers(data.vouchers || []);
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
  };

  // Load and save room customization to localStorage (isolated per user)
  useEffect(() => {
    if (user) {
      const savedRoom = localStorage.getItem(`room_placed_items_${user.id}`);
      if (savedRoom) {
        try {
          setPlacedItems(JSON.parse(savedRoom));
        } catch (e) {}
      }
      const savedWall = localStorage.getItem(`room_wallpaper_${user.id}`);
      if (savedWall) setWallpaper(savedWall);
      const savedFloor = localStorage.getItem(`room_floor_${user.id}`);
      if (savedFloor) setFloorType(savedFloor);

      const savedCompleted = localStorage.getItem(`room_completed_contracts_${user.id}`);
      let currentCompletedList: number[] = [];
      if (savedCompleted) {
        try {
          currentCompletedList = JSON.parse(savedCompleted);
          setCompletedContracts(currentCompletedList);
        } catch (e) {}
      }

      const savedDynamic = localStorage.getItem(`room_dynamic_contracts_${user.id}`);
      let loadedDynamic: DesignContract[] = [];
      if (savedDynamic) {
        try {
          loadedDynamic = JSON.parse(savedDynamic);
          setDynamicContracts(loadedDynamic);
        } catch (e) {}
      }

      // Tự động sinh 2 hợp đồng động nếu tất cả hợp đồng tĩnh đã hoàn thành
      const totalAvailable = [...DESIGN_CONTRACTS, ...loadedDynamic].filter(c => !c.isLoveContract);
      const isAllDone = totalAvailable.length > 0 && totalAvailable.every(c => currentCompletedList.includes(c.id));
      if (isAllDone || loadedDynamic.length === 0) {
        const gen1 = generateDynamicContract(Date.now(), 2);
        const gen2 = generateDynamicContract(Date.now() + 1, 2);
        const newDynamic = [...loadedDynamic, gen1, gen2];
        setDynamicContracts(newDynamic);
        localStorage.setItem(`room_dynamic_contracts_${user.id}`, JSON.stringify(newDynamic));
      }
    }
  }, [user]);

  const handleCreateNewContract = () => {
    playSfx('click');
    const newContract = generateDynamicContract(Date.now(), 2);
    const updatedDynamic = [...dynamicContracts, newContract];
    setDynamicContracts(updatedDynamic);
    if (user) {
      localStorage.setItem(`room_dynamic_contracts_${user.id}`, JSON.stringify(updatedDynamic));
    }
    setCurrentContract(newContract);
    setContractSubmitMsg({
      type: 'success',
      text: `Khách hàng mới (${newContract.clientName}) vừa gửi hợp đồng thiết kế "${newContract.title}"!`
    });
  };

  const saveCompletedContracts = (newCompleted: number[]) => {
    if (user) {
      localStorage.setItem(`room_completed_contracts_${user.id}`, JSON.stringify(newCompleted));
    }
    setCompletedContracts(newCompleted);
  };

  useEffect(() => {
    if (user && placedItems.length > 0) {
      localStorage.setItem(`room_placed_items_${user.id}`, JSON.stringify(placedItems));
    }
  }, [placedItems, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`room_wallpaper_${user.id}`, wallpaper);
      localStorage.setItem(`room_floor_${user.id}`, floorType);
    }
  }, [wallpaper, floorType, user]);

  // Auth checking on mount (checks session cookie first, falls back to localStorage)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/session');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            const userData = { id: data.user.id, username: data.user.username, email: data.user.email || '' };
            setUser(userData);
            localStorage.setItem('boba_game_user_id', userData.id);
            localStorage.setItem('boba_game_username', userData.username);
            localStorage.setItem('boba_game_email', userData.email);
            loadProgress(userData.id);
            return;
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }

      // Fallback to localStorage if cookie session check fails
      const savedUserId = localStorage.getItem('boba_game_user_id');
      const savedUsername = localStorage.getItem('boba_game_username');
      const savedEmail = localStorage.getItem('boba_game_email');
      if (savedUserId && savedUsername) {
        const userData = { id: savedUserId, username: savedUsername, email: savedEmail || '' };
        setUser(userData);
        loadProgress(userData.id);
      }
    };

    checkSession();
    fetchCustomVocabs();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput || (authMode === 'register' && !emailInput)) {
      setAuthError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');

    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
    try {
      const body: any = { username: usernameInput, password: passwordInput };
      if (authMode === 'register') body.email = emailInput;
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem('boba_game_user_id', data.userId);
        localStorage.setItem('boba_game_username', data.username);
        localStorage.setItem('boba_game_email', data.email || '');
        const userData = { id: data.userId, username: data.username, email: data.email || '' };
        setUser(userData);
        await loadProgress(data.userId);
      } else {
        setAuthError(data.error || 'Đăng nhập không thành công.');
      }
    } catch (err) {
      setAuthError('Lỗi kết nối đến máy chủ.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('boba_game_user_id');
    localStorage.removeItem('boba_game_username');
    localStorage.removeItem('boba_game_email');
    setUser(null);
    setPlacedItems([]);
    setUnlockedVouchers([]);
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {}
  };

  // AI Word Explainer trigger
  const handleExplainWord = async (word: string) => {
    playSfx('click');
    setExplainWord(word);
    setExplanationText(null);
    setIsExplaining(true);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
      });
      const data = await res.json();
      if (res.ok && data.explanation) {
        setExplanationText(data.explanation);
      } else {
        setExplanationText('Lỗi kết nối AI hoặc thiếu dữ liệu.');
      }
    } catch (e) {
      setExplanationText('Không thể tải phân tích từ AI.');
    } finally {
      setIsExplaining(false);
    }
  };

  // Phát âm chữ Hán
  const handlePlayTTS = (text: string) => {
    playSfx('click');
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(text)}&lang=zh`);
    audio.play().catch((e) => console.warn('TTS playback failed', e));
  };

  // Kiểm tra yêu cầu của hợp đồng thiết kế bình thường
  const checkContractCompletion = (contract: DesignContract) => {
    const hasAll = contract.targetRequirements.every(reqId => contractSelectedItems.includes(reqId));
    const noExtra = contractSelectedItems.every(reqId => contract.targetRequirements.includes(reqId));
    return hasAll && noExtra;
  };

  // Nộp hợp đồng thiết kế bình thường
  const handleSubmitContract = (contract: DesignContract) => {
    playSfx('click');

    if (completedContracts.includes(contract.id)) {
      setContractSubmitMsg({
        type: 'error',
        text: 'Hợp đồng này đã được hoàn thành trước đó rồi.'
      });
      return;
    }

    const completed = checkContractCompletion(contract);

    if (completed) {
      // Mở modal sắp xếp nội thất & đánh giá thẩm mỹ từ khách hàng
      setShowArrangementModal(true);
    } else {
      const missing = contract.targetRequirements
        .filter(reqId => !contractSelectedItems.includes(reqId))
        .map(reqId => FURNITURE_ITEMS.find(i => i.id === reqId)?.nameVietnamese || reqId);

      const extra = contractSelectedItems
        .filter(reqId => !contract.targetRequirements.includes(reqId))
        .map(reqId => FURNITURE_ITEMS.find(i => i.id === reqId)?.nameVietnamese || reqId);

      let errorText = 'Bản vẽ chưa chính xác Vy ơi! ';
      if (missing.length > 0) {
        errorText += `Còn thiếu đồ: ${missing.join(', ')}. `;
      }
      if (extra.length > 0) {
        errorText += `Bị thừa đồ không yêu cầu: ${extra.join(', ')}.`;
      }

      setContractSubmitMsg({
        type: 'error',
        text: errorText
      });
      playSfx('error');
    }
  };

  // Hoàn tất sắp xếp trong ArrangementModal và nhận thưởng (kèm bonus thẩm mỹ)
  const handleCompleteArrangement = (
    stars: number,
    bonusCoins: number,
    bonusScore: number,
    feedbackMsg: string
  ) => {
    if (!currentContract) return;

    const totalCoins = currentContract.rewardCoins + bonusCoins;
    const totalScore = currentContract.rewardScore + bonusScore;

    const newScore = score + totalScore;
    const newCoins = coins + totalCoins;

    setScore(newScore);
    setCoins(newCoins);

    // Lưu vào completed list
    const newCompleted = [...completedContracts, currentContract.id];
    saveCompletedContracts(newCompleted);

    // Mở khóa voucher thưởng nếu có
    let nextVoucher = null;
    if (currentContract.voucherReward) {
      nextVoucher = {
        title: currentContract.voucherReward.title,
        description: currentContract.voucherReward.description,
        code: currentContract.voucherReward.code
      };
      playSfx('levelUp');
    }

    saveProgress(newScore, newCoins, level, nextVoucher);

    const starsText = stars === 3 ? '⭐⭐⭐' : stars === 2 ? '⭐⭐' : '⭐';
    setContractSubmitMsg({
      type: 'success',
      text: `${feedbackMsg} Vy nhận được tổng cộng +${totalCoins} Xu (+${bonusCoins} Xu Bonus Thẩm Mỹ ${starsText}) và +${totalScore} Điểm!`
    });

    setContractSelectedItems([]);
    setShowArrangementModal(false);

    // Tự động kiểm tra nếu hoàn thành hết hợp đồng hiện có -> Tự động sinh hợp đồng mới
    const remaining = [...DESIGN_CONTRACTS, ...dynamicContracts].filter(
      c => !c.isLoveContract && !newCompleted.includes(c.id)
    );

    if (remaining.length === 0) {
      const autoGen = generateDynamicContract(Date.now(), 2);
      const updated = [...dynamicContracts, autoGen];
      setDynamicContracts(updated);
      if (user) {
        localStorage.setItem(`room_dynamic_contracts_${user.id}`, JSON.stringify(updated));
      }
    }
  };

  // Mở khóa Voucher tình yêu gửi từ LoveInbox
  const handleUnlockLoveVoucher = (contract: DesignContract) => {
    const newScore = score + contract.rewardScore;
    const newCoins = coins + contract.rewardCoins;
    setScore(newScore);
    setCoins(newCoins);

    const nextVoucher = contract.voucherReward ? {
      title: contract.voucherReward.title,
      description: contract.voucherReward.description,
      code: contract.voucherReward.code
    } : null;

    saveProgress(newScore, newCoins, level, nextVoucher);
  };

  // Phân bổ danh mục HSK của Sổ tay
  const hskGroupedFurniture = FURNITURE_ITEMS.map(item => {
    const levels: { [key: string]: number } = {
      wood_chair: 1, wood_table: 1, mirror: 1,
      study_desk: 2, single_bed: 2, desk_lamp: 2, painting: 2, office_chair: 2, potted_plant: 2,
      double_bed: 3, sofa: 3, coffee_table: 3, bookshelf: 3, carpet: 3,
      cactus: 3, floor_lamp: 3, sofa_bed: 3, wardrobe: 3, bamboo: 3, chandelier: 3
    };
    return { ...item, hsk: levels[item.id] || 1 };
  });

  return (
    <main className="min-h-screen font-sans antialiased transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-3 sm:p-4 md:p-6 pb-24 md:pb-6">
      {/* 1. MÀN HÌNH ĐĂNG NHẬP / ĐĂNG KÝ (COPY 100% GIAO DIỆN IELTS VOCAB HTTPS://IELTS.VOCAB.UMTERS.CLUB/) */}
      {!user ? (
        <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
          {/* CỘT TRÁI TRÊN DESKTOP: LÒ LUYỆN TỪ VỰNG HSK */}
          <div className="hidden md:flex md:w-1/2 bg-amber-400 border-r-4 border-black flex-col justify-between p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
            <div className="z-10">
              <div className="inline-block border-4 border-black bg-white rounded-lg px-3 py-1.5 font-mono font-black text-xs uppercase shadow-[2px_2px_0_#000] text-black">
                Chinese HSK Vocabulary Studio
              </div>
            </div>
            <div className="z-10 my-auto flex flex-col gap-6 max-w-md">
              <div className="mb-2">
                <div className="w-28 h-28 bg-white border-4 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0_#000]">
                  <img src="/logo.svg" alt="Game Logo" className="w-22 h-22 drop-shadow-md hover:scale-105 transition-transform" />
                </div>
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif font-black text-black leading-tight">
                Tiệm Thiết Kế HSK
              </h2>
              <p className="text-black font-bold leading-relaxed border-l-4 border-black pl-4">
                Học từ vựng HSK 1-3 thông minh qua phương pháp sắp xếp nội thất pixel, lặp lại ngắt quãng tối ưu và rèn luyện phản xạ phát âm cùng thú cưng 2D.
              </p>
            </div>
            <div className="z-10 pt-6 border-t-4 border-black border-dashed">
              <p className="text-xs font-mono font-black text-black uppercase tracking-wider">
                © 2026 CHINESE HSK VOCABULARY STUDIO. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>

          {/* CỘT PHẢI: FORM ĐĂNG NHẬP / ĐĂNG KÝ CHUẨN IELTS VOCAB */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 min-h-screen">
            <div className="max-w-md w-full relative z-10 flex flex-col p-8 md:p-10 bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0_#000] text-black">
              <div className="flex justify-center mb-3">
                <img src="/logo.svg" alt="Game Logo" className="w-20 h-20 drop-shadow-md hover:scale-105 transition-transform" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-black text-center mb-2">
                Atelier HSK
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm font-bold text-center mb-6">
                Hệ thống yêu cầu đăng nhập để cá nhân hóa tiến trình học tập tiếng Trung HSK của bạn.
              </p>

              {/* TOGGLE TAB ĐĂNG NHẬP / ĐĂNG KÝ CHUẨN IELTS VOCAB */}
              <div className="flex border-4 border-black rounded-lg overflow-hidden mb-6 shadow-[2px_2px_0_#000]">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); playSfx('click'); }}
                  className={`flex-1 py-2 font-mono font-bold text-sm uppercase transition-colors cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-blue-600 text-white border-r-4 border-black'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); playSfx('click'); }}
                  className={`flex-1 py-2 font-mono font-bold text-sm uppercase transition-colors cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-blue-600 text-white border-l-4 border-black'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Đăng ký
                </button>
              </div>

              <form onSubmit={handleAuth} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs font-bold text-black uppercase">Tên tài khoản</label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Nhập tên tài khoản..."
                    className="w-full border-4 border-black p-3 font-mono font-bold text-sm rounded bg-white text-black focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0_#000] focus:shadow-[4px_4px_0_#000] transition-all"
                  />
                </div>

                {authMode === 'register' && (
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold text-black uppercase">Địa chỉ Email</label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full border-4 border-black p-3 font-mono font-bold text-sm rounded bg-white text-black focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0_#000] focus:shadow-[4px_4px_0_#000] transition-all"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-xs font-bold text-black uppercase">Mật khẩu</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setShowForgotModal(true); setForgotStep('request'); setForgotMsg(null); playSfx('click'); }}
                        className="text-xs font-mono font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                      >
                        Quên mật khẩu?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="******"
                    className="w-full border-4 border-black p-3 font-mono font-bold text-sm rounded bg-white text-black focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0_#000] focus:shadow-[4px_4px_0_#000] transition-all"
                  />
                </div>

                {authError && (
                  <p className="text-xs font-mono font-bold text-rose-600 bg-rose-50 border-2 border-rose-400 p-2 rounded text-center">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 font-mono font-bold text-sm uppercase rounded w-full flex items-center justify-center gap-2 border-4 border-black shadow-[3px_3px_0_#000] active:translate-y-0.5 transition-all cursor-pointer"
                >
                  {authLoading ? 'Đang Xử Lý...' : authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
                </button>
              </form>

              <div className="border-t-2 border-dashed border-gray-300 w-full my-5 relative flex items-center justify-center">
                <span className="bg-white px-3 text-xs font-mono font-bold text-gray-400 uppercase absolute">Hoặc</span>
              </div>

              {/* GOOGLE LOGIN BUTTON CHUẨN IELTS VOCAB */}
              <a
                href="/api/auth/google/start"
                onClick={() => playSfx('click')}
                className="bg-white hover:bg-amber-100 text-black w-full py-3 text-sm uppercase font-mono font-bold flex items-center justify-center gap-3 transition-colors duration-300 shadow-[3px_3px_0_#000] border-4 border-black rounded cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Đăng nhập bằng Google
              </a>
            </div>
          </div>

          {/* MODAL KHÔI PHỤC MẬT KHẨU OTP (NEO-BRUTALISM) */}
          {showForgotModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
              <div className="bg-[#fffdf8] border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0_#000] max-w-md w-full space-y-4 text-black text-left relative">
                <div className="flex justify-between items-center border-b-4 border-black pb-3">
                  <h3 className="font-serif font-black text-xl flex items-center gap-2">
                    Khôi Phục Mật Khẩu
                  </h3>
                  <button
                    onClick={() => { setShowForgotModal(false); playSfx('click'); }}
                    className="w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white font-mono font-black border-2 border-black rounded-lg shadow-[2px_2px_0_#000] flex items-center justify-center cursor-pointer"
                  >
                    X
                  </button>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  {forgotStep === 'request' && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-700 leading-relaxed">
                        Nhập địa chỉ Email hoặc Tên tài khoản của bạn để nhận mã xác minh OTP qua Email (Studio Vocab Support):
                      </p>
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-xs font-bold uppercase">Email / Tên tài khoản</label>
                        <input
                          type="text"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="email@example.com hoặc username"
                          className="w-full border-4 border-black p-3 font-mono font-bold text-sm rounded bg-white text-black focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0_#000]"
                        />
                      </div>
                    </div>
                  )}

                  {forgotStep === 'verify' && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-700 leading-relaxed">
                        Mã OTP 6 số đã được gửi tới email của bạn. Vui lòng kiểm tra Hòm Thư (Inbox/Spam) và nhập bên dưới:
                      </p>
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-xs font-bold uppercase">Mã Xác Minh OTP (6 số)</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={forgotOtp}
                          onChange={(e) => setForgotOtp(e.target.value)}
                          placeholder="123456"
                          className="w-full border-4 border-black p-3 font-mono font-black text-center text-xl tracking-widest rounded bg-amber-50 text-black focus:outline-none shadow-[2px_2px_0_#000]"
                        />
                      </div>
                    </div>
                  )}

                  {forgotStep === 'reset' && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-700 leading-relaxed">
                        Xác minh OTP thành công! Vui lòng nhập mật khẩu mới cho tài khoản:
                      </p>
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-xs font-bold uppercase">Mật khẩu mới</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={forgotNewPass}
                          onChange={(e) => setForgotNewPass(e.target.value)}
                          placeholder="Mật khẩu mới (ít nhất 6 ký tự)..."
                          className="w-full border-4 border-black p-3 font-mono font-bold text-sm rounded bg-white text-black focus:outline-none shadow-[2px_2px_0_#000]"
                        />
                      </div>
                    </div>
                  )}

                  {forgotMsg && (
                    <div className={`p-2.5 border-2 border-black rounded text-xs font-mono font-bold ${
                      forgotMsg.type === 'success' ? 'bg-green-100 text-green-800 border-green-700' : 'bg-rose-100 text-rose-800 border-rose-700'
                    }`}>
                      {forgotMsg.text}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-black font-mono font-bold text-xs uppercase border-3 border-black rounded shadow-[2px_2px_0_#000] cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase border-3 border-black rounded shadow-[2px_2px_0_#000] cursor-pointer"
                    >
                      {forgotLoading ? 'Đang gửi...' : forgotStep === 'request' ? 'Gửi Mã OTP' : forgotStep === 'verify' ? 'Xác Nhận OTP' : 'Đổi Mật Khẩu'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 2. GIAO DIỆN GAME CHÍNH SAU KHI LOGIN */
        <div className="max-w-6xl mx-auto space-y-5">
          {/* HEADER & NAV BAR UNIFIED MODERN CONTAINER */}
          <header className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 transition-all duration-300 shadow-xs">
            {/* THÀNH PHẦN TRÊN: LOGO, TÊN DỰ ÁN, CHỈ SỐ XU & CÁC NÚT THAO TÁC */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-amber-400/20 dark:bg-amber-400/10 rounded-xl overflow-hidden flex items-center justify-center text-rose-600 shrink-0 border border-amber-300/40">
                  {user.email?.toLowerCase() === LOVE_EMAIL ? (
                    renderClientAvatar('lan_vy', 'w-10 h-10')
                  ) : user.email?.toLowerCase() === 'ungnhutkhang53@gmail.com' ? (
                    renderClientAvatar('khang', 'w-10 h-10')
                  ) : (
                    renderPaletteIcon('w-7 h-7')
                  )}
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <img src="/logo.svg" alt="Logo" className="w-8 h-8 inline-block object-contain" />
                    Atelier Thiết Kế HSK
                    {user.email?.toLowerCase() === LOVE_EMAIL && (
                      <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        {renderHeartIcon('w-3 h-3 text-rose-500 fill-current')} Vy Của Khang
                      </span>
                    )}
                    {user.email?.toLowerCase() === 'ungnhutkhang53@gmail.com' && (
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        Khang Của Vy
                      </span>
                    )}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {user.email?.toLowerCase() === LOVE_EMAIL ? (
                      <>Bà chủ: <span className="text-rose-600 dark:text-rose-400 font-bold">Lan Vy</span></>
                    ) : user.email?.toLowerCase() === 'ungnhutkhang53@gmail.com' ? (
                      <>Ông chủ: <span className="text-blue-600 dark:text-blue-400 font-bold">Nhựt Khang</span></>
                    ) : (
                      <>Chủ tiệm: <span className="text-rose-600 dark:text-rose-400 font-bold">{user.username}</span></>
                    )}{' '}
                    | Chào mừng trở lại!
                  </p>
                </div>
              </div>

              {/* CHỈ SỐ XU & CÁC NÚT THAO TÁC */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-3 py-1.5 rounded-full text-xs font-bold font-mono flex items-center shadow-xs">
                  {renderCoinIcon()} Xu: {coins}
                </div>
                <div className="bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-3 py-1.5 rounded-full text-xs font-bold font-mono flex items-center shadow-xs">
                  {renderAwardIcon('w-4 h-4 text-blue-600 dark:text-blue-400 inline mr-1')} Điểm: {score}
                </div>

                {/* NÚT GẠT CHẾ ĐỘ SÁNG / TỐI CAPSULE MODERN 2 ICON SVG (CHỈ DÙNG SVG, CỐ ĐỊNH Ở GÓC TRÊN BÊN PHẢI) */}
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="fixed top-4 right-4 z-50 flex items-center justify-between w-14 h-7 p-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-300 dark:border-slate-700 shadow-md cursor-pointer shrink-0 transition-all active:scale-95"
                  title={isDarkMode ? 'Đang Ban Đêm (Bấm để sang Ban Ngày)' : 'Đang Ban Ngày (Bấm để sang Ban Đêm)'}
                >
                  <div className="z-0 pl-0.5">{renderSunIcon('w-3.5 h-3.5 text-amber-500')}</div>
                  <div className="z-0 pr-0.5">{renderMoonIcon('w-3.5 h-3.5 text-indigo-400')}</div>
                  
                  <div
                    className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center transform transition-transform duration-300 z-10 ${
                      isDarkMode ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  >
                    {isDarkMode ? renderMoonIcon('w-3.5 h-3.5 text-indigo-400') : renderSunIcon('w-3.5 h-3.5 text-amber-500')}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowArchitectModal(true);
                    playSfx('click');
                  }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-mono font-bold rounded-lg shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  Specs
                </button>
                <button
                  onClick={() => {
                    setShowFeedbackModal(true);
                    setFeedbackMsg(null);
                    playSfx('click');
                  }}
                  className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold rounded-lg shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  Góp Ý
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-mono font-bold rounded-lg shadow-xs cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                >
                  {renderSignoutIcon()} Thoát
                </button>
              </div>
            </div>

            {/* THANH ĐIỀU HƯỚNG TABS CHÍNH (DESKTOP: THANH PILL TRÊN, MOBILE: THANH BOTTOM DOCK BÊN DƯỚI) */}
            <nav className="w-full hidden md:flex items-center gap-2 overflow-x-auto scrollbar-none snap-x shrink-0">
              <button
                onClick={() => { setActiveTab('studio'); playSfx('click'); }}
                className={`px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'studio'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {renderAwardIcon(activeTab === 'studio' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-rose-500')}
                <span>Studio</span>
              </button>

              <button
                onClick={() => { setActiveTab('quiz'); playSfx('click'); }}
                className={`px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'quiz'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {renderBookIcon(activeTab === 'quiz' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-blue-500')}
                <span>Quiz HSK</span>
              </button>

              <button
                onClick={() => { setActiveTab('flashcards' as any); playSfx('click'); }}
                className={`px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === ('flashcards' as any)
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {renderBookIcon(activeTab === ('flashcards' as any) ? 'w-4 h-4 text-white' : 'w-4 h-4 text-amber-500')}
                <span>Flashcards HSK</span>
              </button>

              <button
                onClick={() => { setActiveTab('room'); playSfx('click'); }}
                className={`px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'room'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {renderHomeIcon(activeTab === 'room' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-emerald-500')}
                <span>{isVy ? 'Phòng Vy' : `Phòng ${user?.username || 'Của Bạn'}`}</span>
              </button>

              <button
                onClick={() => { setShowPetShopModal(true); playSfx('click'); }}
                className={`px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                  showPetShopModal
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {renderShoppingBagIcon(showPetShopModal ? 'w-4 h-4 text-white' : 'w-4 h-4 text-amber-500')}
                <span>Cửa Hàng</span>
              </button>

              <button
                onClick={() => { setActiveTab('love'); playSfx('click'); }}
                className={`px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'love'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {renderVoucherIcon(activeTab === 'love' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-pink-500')}
                <span>{isVy ? 'Thư Tình' : 'Ví Voucher'}</span>
              </button>

              <button
                onClick={() => { setActiveTab('library'); playSfx('click'); }}
                className={`px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'library'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {renderBookIcon(activeTab === 'library' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-purple-500')}
                <span>Thư Viện</span>
              </button>

              {ADMIN_EMAILS.includes(user.email.toLowerCase()) && (
                <button
                  onClick={() => { setActiveTab('admin'); fetchAdminLogs(); playSfx('click'); }}
                  className={`px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                    activeTab === 'admin'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {renderAIIcon(activeTab === 'admin' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-purple-500')}
                  <span>Admin</span>
                </button>
              )}
            </nav>
          </header>

          {/* NỘI DUNG TABS CHÍNH */}
          <div className="transition-all">
            {/* TAB 1: STUDIO HỢP ĐỒNG THIẾT KẾ CỦA KHÁCH HÀNG (NPC) */}
            {activeTab === 'studio' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl shadow-xs p-5 h-[460px] flex flex-col">
                  <div className="flex items-center justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-3 mb-3">
                    <h2 className="text-base font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                      {renderClipboardIcon()} Danh Sách Hợp Đồng
                    </h2>
                    <button
                      onClick={handleCreateNewContract}
                      className="bg-amber-400 hover:bg-amber-500 text-slate-950 border border-slate-300 dark:border-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xs active:scale-95 transition flex items-center gap-1 shrink-0 cursor-pointer"
                      title="Tự động sinh hợp đồng mới từ khách hàng mới"
                    >
                      Hợp đồng mới
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {allContracts.filter(c => !c.isLoveContract && !completedContracts.includes(c.id)).map((contract) => (
                      <div
                        key={contract.id}
                        onClick={() => {
                          setCurrentContract(contract);
                          setContractSubmitMsg(null);
                          setContractSelectedItems([]);
                          setShowStudioHint(false);
                          playSfx('click');
                        }}
                        className={`p-3 border rounded-xl flex items-center gap-3 cursor-pointer transition-all relative ${
                          currentContract?.id === contract.id
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-rose-500'
                        }`}
                      >
                        <div className="shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-12 h-12 rounded-xl flex items-center justify-center">
                          {renderClientAvatar(contract.clientSprite)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-bold truncate">{contract.title}</h3>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">Khách hàng: {contract.clientName}</p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-1.5 py-0.2 rounded font-bold">
                              HSK Cấp {contract.level}
                            </span>
                            {completedContracts.includes(contract.id) && (
                              <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                                Đã hoàn thành
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CHI TIẾT HỢP ĐỒNG ĐÃ CHỌN */}
                <div className="lg:col-span-8">
                  {currentContract ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl shadow-xs p-6 space-y-5">
                      <div className="flex items-center gap-3 border-b border-dashed border-slate-200 dark:border-slate-800 pb-3">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shrink-0">
                          {renderClientAvatar(currentContract.clientSprite)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Hợp đồng thiết kế từ: {currentContract.clientName}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Cấp độ yêu cầu: HSK Cấp {currentContract.level}</p>
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <h4 className="text-lg font-bold text-rose-600 dark:text-rose-400">{currentContract.title}</h4>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{currentContract.description}</p>
                      </div>

                      {/* KHU VỰC THƯ TỪ KHÁCH HÀNG BẰNG TIẾNG TRUNG */}
                      <div className="p-4 border rounded-xl space-y-2 text-left bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full font-black uppercase font-sans">
                            Yêu cầu từ khách hàng (Tiếng Trung):
                          </span>
                          <button
                            onClick={() => handlePlayTTS(currentContract.promptChinese)}
                            className="p-1 bg-white hover:bg-amber-100 border border-[#1f2937] rounded-lg cursor-pointer"
                          >
                            {renderAudioIcon('w-4 h-4 text-[#1f2937]')}
                          </button>
                        </div>
                        <p className="text-base font-serif font-black text-[#1f2937]">{currentContract.promptChinese}</p>
                        <p className="text-xs font-bold text-blue-600 font-sans">{currentContract.promptPinyin}</p>
                        {showStudioHint ? (
                          <div className="pt-1.5 border-t border-dashed border-amber-300 flex justify-between items-start gap-4">
                            <p className="text-xs font-bold text-gray-500">Dịch nghĩa: {currentContract.promptVietnamese}</p>
                            <button
                              onClick={() => {
                                playSfx('click');
                                setShowStudioHint(false);
                              }}
                              className="text-[9px] font-black text-rose-600 uppercase hover:underline shrink-0 cursor-pointer"
                            >
                              Ẩn gợi ý
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              playSfx('click');
                              setShowStudioHint(true);
                            }}
                            className="text-[10px] font-black text-blue-600 uppercase hover:underline flex items-center gap-1.5 cursor-pointer"
                          >
                            {renderAwardIcon('w-3.5 h-3.5 text-blue-600')} Xem Gợi Ý Nghĩa Tiếng Việt
                          </button>
                        )}
                      </div>

                      {/* PHÒNG PHÁC THẢO CHỌN ĐỒ */}
                      <div className="space-y-2 text-left">
                        <h5 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                          Phòng phác thảo ảo (Vy hãy chọn đồ vật ở dưới để thêm vào phòng):
                        </h5>
                        <div className="h-32 bg-pink-900/5 border-2 border-[#1f2937] rounded-xl flex items-center justify-center gap-4 relative overflow-hidden p-3">
                          {/* Lưới ô vuông mờ phong cách blueprint */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(31,41,55,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(31,41,55,0.04)_1px,transparent_1px)] bg-[size:12px_12px]" />
                          
                          {completedContracts.includes(currentContract.id) ? (
                            <div className="flex flex-col items-center gap-1.5 z-10">
                              <span className="text-xs font-black text-emerald-600 uppercase border-2 border-emerald-600 px-3 py-1 rounded bg-white rotate-[-2deg] shadow-sm">
                                [ Đã Nộp & Nhận Thưởng ]
                              </span>
                            </div>
                          ) : contractSelectedItems.length === 0 ? (
                            <span className="text-[11px] text-gray-400 font-bold italic z-10">Vy hãy nhấp chọn các đồ nội thất ở danh mục bên dưới!</span>
                          ) : (
                            <div className="flex gap-3 overflow-x-auto max-w-full z-10 py-1 px-2">
                              {contractSelectedItems.map((itemId) => {
                                const item = FURNITURE_ITEMS.find(i => i.id === itemId);
                                return (
                                  <div key={itemId} className="flex flex-col items-center bg-white border border-[#1f2937] p-1.5 rounded-lg shadow-[1px_1px_0px_#1f2937] shrink-0">
                                    {renderFurnitureSVG(itemId, 0, 'w-8 h-8')}
                                    <span className="text-[9px] font-black text-[#1f2937] mt-1">{item?.nameVietnamese}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CHI TIẾT YÊU CẦU ĐỒ NỘI THẤT */}
                      <div className="space-y-2 text-left">
                        <h5 className="text-xs font-black text-gray-500 uppercase tracking-wider">Danh mục đồ nội thất để Vy lựa chọn:</h5>
                        {completedContracts.includes(currentContract.id) ? (
                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800">
                            Bạn đã hoàn thành xuất sắc thử thách này và rinh trọn vẹn phần thưởng!
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[220px] overflow-y-auto pr-1">
                            {FURNITURE_ITEMS.map((item) => {
                              const isSelected = contractSelectedItems.includes(item.id);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    playSfx('click');
                                    if (isSelected) {
                                      setContractSelectedItems(prev => prev.filter(id => id !== item.id));
                                    } else {
                                      setContractSelectedItems(prev => [...prev, item.id]);
                                    }
                                  }}
                                  className={`p-2 border border-[#1f2937] rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center relative ${
                                    isSelected
                                      ? 'bg-rose-100 border-rose-500 shadow-none translate-y-0.5'
                                      : 'bg-white hover:bg-rose-50 shadow-[1.5px_1.5px_0px_#1f2937]'
                                  }`}
                                >
                                  <div className="w-8 h-8 flex items-center justify-center">
                                    {renderFurnitureSVG(item.id, 0, 'w-6 h-6')}
                                  </div>
                                  <span className="text-[9px] font-black text-[#1f2937] leading-tight truncate w-full">{item.nameVietnamese}</span>
                                  <span className="text-[8px] font-bold text-pink-600 font-serif">{item.nameChinese}</span>
                                  
                                  {isSelected && (
                                    <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-rose-500 rounded-full border border-white flex items-center justify-center text-white text-[7px] font-black">
                                      ✓
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* BUTTON NỘP HỢP ĐỒNG */}
                      <div className="pt-4 border-t border-dashed border-[#1f2937] flex justify-between items-center">
                        <div className="text-xs font-black text-gray-600 text-left">
                          Phần thưởng: <span className="text-amber-600">{currentContract.rewardCoins} Xu</span> • <span className="text-blue-600">{currentContract.rewardScore} Điểm</span>
                        </div>
                        {!completedContracts.includes(currentContract.id) && (
                          <button
                            onClick={() => handleSubmitContract(currentContract)}
                            className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                          >
                            TIẾN HÀNH SẮP XẾP & NỘP BẢN THIẾT KẾ
                          </button>
                        )}
                      </div>

                      {/* HIỂN THỊ THÔNG BÁO NỘP */}
                      {contractSubmitMsg && (
                        <div
                          className={`p-3 rounded-lg border text-xs font-bold ${
                            contractSubmitMsg.type === 'success'
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : 'bg-red-50 border-red-200 text-red-700'
                          }`}
                        >
                          {contractSubmitMsg.text}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-700 dark:text-slate-300 font-bold space-y-3 shadow-xs">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        {renderClipboardIcon('w-6 h-6 text-rose-500')}
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Vui lòng chọn một hợp đồng</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Chọn một hợp đồng từ bảng danh sách bên trái để xem yêu cầu thiết kế và thử thách HSK của khách hàng.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: BẢN VẼ HSK (BLUEPRINT QUIZ) */}
            {activeTab === 'quiz' && (
              <BlueprintQuiz
                unlockedItems={unlockedItems}
                setUnlockedItems={setUnlockedItems}
                coins={coins}
                setCoins={setCoins}
                playSfx={playSfx}
                onExplainWord={handleExplainWord}
                customVocabs={customVocabs}
                isDarkMode={isDarkMode}
              />
            )}

            {/* TAB FLASHCARDS HSK 3D (GIỐNG IELTS VOCAB) */}
            {activeTab === ('flashcards' as any) && (
              <FlashcardViewer
                customVocabs={customVocabs}
                onPlayAudio={handlePlayTTS}
                playSfx={playSfx}
                isDarkMode={isDarkMode}
              />
            )}

            {/* TAB 3: PHÒNG CỦA VY (ROOM EDITOR) */}
            {activeTab === 'room' && (
              <RoomEditor
                unlockedItems={unlockedItems}
                placedItems={placedItems}
                setPlacedItems={setPlacedItems}
                coins={coins}
                setCoins={setCoins}
                playSfx={playSfx}
                wallpaper={wallpaper}
                setWallpaper={setWallpaper}
                floorType={floorType}
                setFloorType={setFloorType}
                currentContract={currentContract}
                onSubmitContract={handleSubmitContract}
                contractSubmitMsg={contractSubmitMsg}
                onPlayTTS={handlePlayTTS}
                isDarkMode={isDarkMode}
              />
            )}

            {/* TAB 4: HÒM THƯ / VÍ VOUCHER & AI CHAT (LOVE INBOX) */}
            {activeTab === 'love' && (
              <LoveInbox
                user={user}
                isVy={isVy}
                placedItems={placedItems}
                unlockedVouchers={unlockedVouchers}
                onUnlockVoucher={handleUnlockLoveVoucher}
                playSfx={playSfx}
                isDarkMode={isDarkMode}
              />
            )}

            {/* TAB 5: TỪ ĐIỂN VẬT LIỆU HSK (MATERIALS DICTIONARY) */}
            {activeTab === 'library' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl p-6 space-y-6 shadow-xs">
                <h2 className="text-xl font-bold border-b border-dashed border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between text-slate-900 dark:text-slate-100">
                  <span>Từ Điển Vật Liệu & Ngữ Pháp HSK 1-2-3</span>
                </h2>

                {/* Sub-tab selection */}
                <div className="flex gap-3 mb-4 flex-wrap">
                  <button
                    onClick={() => { setLibrarySubTab('furniture'); playSfx('click'); }}
                    className={`px-4 py-2 border-2 border-[#1f2937] font-serif font-black text-xs rounded-xl shadow-[2px_2px_0px_#1f2937] transition-all cursor-pointer ${
                      librarySubTab === 'furniture' ? 'bg-pink-500 text-white shadow-none translate-y-0.5' : 'bg-white text-[#1f2937]'
                    }`}
                  >
                    Từ điển Nội Thất HSK
                  </button>
                  <button
                    onClick={() => { setLibrarySubTab('vocab'); playSfx('click'); }}
                    className={`px-4 py-2 border-2 border-[#1f2937] font-serif font-black text-xs rounded-xl shadow-[2px_2px_0px_#1f2937] transition-all cursor-pointer ${
                      librarySubTab === 'vocab' ? 'bg-pink-500 text-white shadow-none translate-y-0.5' : 'bg-white text-[#1f2937]'
                    }`}
                  >
                    Từ vựng HSK 1-2-3 ({GENERAL_VOCAB_ITEMS.length + customVocabs.length})
                  </button>
                  <button
                    onClick={() => { setLibrarySubTab('grammar'); playSfx('click'); }}
                    className={`px-4 py-2 border-2 border-[#1f2937] font-serif font-black text-xs rounded-xl shadow-[2px_2px_0px_#1f2937] transition-all cursor-pointer ${
                      librarySubTab === 'grammar' ? 'bg-pink-500 text-white shadow-none translate-y-0.5' : 'bg-white text-[#1f2937]'
                    }`}
                  >
                    Sổ tay Ngữ pháp
                  </button>
                </div>

                {librarySubTab === 'furniture' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hskGroupedFurniture.map((item) => {
                      const isUnlocked = unlockedItems.includes(item.id);
                      
                      return (
                        <div
                          key={item.id}
                          className={`p-3 border-2 border-[#1f2937] rounded-xl flex items-center justify-between transition-all ${
                            isUnlocked ? 'bg-white shadow-[2px_2px_0px_#1f2937]' : 'bg-pink-50/40 border-pink-200 opacity-80'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 border-2 border-[#1f2937] bg-[#fff5f6] rounded-lg p-1 flex items-center justify-center shrink-0">
                              {renderFurnitureSVG(item.id, 0, 'w-10 h-10')}
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-serif font-black text-[#1f2937] flex items-center gap-1.5">
                                <span>{item.nameVietnamese}</span>
                                <span className="text-[9px] bg-pink-100 text-pink-800 border border-pink-200 px-1.5 py-0.2 rounded font-sans font-black">
                                  HSK {item.hsk}
                                </span>
                              </h4>
                              <p className="text-sm font-black text-pink-600 font-serif flex items-center gap-1.5">
                                <span>{item.nameChinese}</span>
                                <button
                                  onClick={() => handlePlayTTS(item.nameChinese)}
                                  className="p-0.5 bg-pink-50 hover:bg-pink-100 border border-gray-300 rounded cursor-pointer"
                                >
                                  {renderAudioIcon('w-3 h-3 text-[#1f2937]')}
                                </button>
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold font-mono">{item.namePinyin}</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            {isUnlocked ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded font-black text-center">
                                Sở Hữu
                              </span>
                            ) : (
                              <span className="text-[10px] bg-gray-200 text-gray-500 border border-gray-300 px-1.5 py-0.5 rounded font-black text-center">
                                Chưa Mở
                              </span>
                            )}
                            <button
                              onClick={() => setSelectedVoiceWord({ wordChinese: item.nameChinese, wordPinyin: item.namePinyin, wordVietnamese: item.nameVietnamese })}
                              className="px-2 py-1 bg-pink-100 hover:bg-pink-200 text-pink-900 border border-[#1f2937] text-[9.5px] font-black uppercase rounded cursor-pointer flex items-center gap-1 shadow-[1px_1px_0px_#1f2937] transition"
                            >
                              <svg className="w-3 h-3 text-pink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                              </svg>
                              Luyện Phát Âm
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {librarySubTab === 'vocab' && (() => {
                  const allVocabs = [...GENERAL_VOCAB_ITEMS, ...customVocabs];
                  const searchLower = librarySearchQuery.trim().toLowerCase();

                  const searchFiltered = allVocabs.filter(item => {
                    if (!searchLower) return true;
                    return (
                      item.nameChinese.toLowerCase().includes(searchLower) ||
                      item.namePinyin.toLowerCase().includes(searchLower) ||
                      item.nameVietnamese.toLowerCase().includes(searchLower) ||
                      (item.theme && item.theme.toLowerCase().includes(searchLower))
                    );
                  });

                  const uniqueCategories = Array.from(new Set(searchFiltered.map(item => getVocabCategory(item))));

                  const filteredVocabs = selectedLibraryTheme === 'all'
                    ? searchFiltered
                    : searchFiltered.filter(item => getVocabCategory(item) === selectedLibraryTheme);

                  const ITEMS_PER_PAGE = 30;
                  const totalCount = filteredVocabs.length;
                  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
                  const safePage = Math.min(libraryPage, totalPages);

                  const paginatedVocabs = filteredVocabs.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

                  const groupedVocabs: { [key: string]: any[] } = {};
                  paginatedVocabs.forEach((item) => {
                    const cat = getVocabCategory(item);
                    if (!groupedVocabs[cat]) {
                      groupedVocabs[cat] = [];
                    }
                    groupedVocabs[cat].push(item);
                  });

                  return (
                    <div className="space-y-4">
                      {/* BẢNG CHỦ ĐỀ & CHẾ ĐỘ AI CHẤM ĐIỂM ĐỘC LẬP & TRA CỨU */}
                      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-3 rounded-2xl border-2 border-[#1f2937] shadow-[2px_2px_0px_#1f2937]">
                        {/* 1. Ô TRA CỨU TỪ VỰNG */}
                        <div className="flex-1 flex gap-2 items-center bg-[#fff5f6] px-3 py-2 rounded-xl border border-[#1f2937]">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            value={librarySearchQuery}
                            onChange={(e) => {
                              setLibrarySearchQuery(e.target.value);
                              setLibraryPage(1);
                            }}
                            placeholder="Tra cứu từ vựng chữ Hán, Pinyin hoặc nghĩa tiếng Việt..."
                            className="w-full text-xs font-bold bg-transparent focus:outline-none"
                          />
                          {librarySearchQuery && (
                            <button onClick={() => { setLibrarySearchQuery(''); setLibraryPage(1); }} className="text-xs text-gray-400 font-bold hover:text-gray-600 px-1 cursor-pointer">
                              ✕
                            </button>
                          )}
                        </div>

                        {/* 2. NÚT AI MỎ HỖN LUYỆN PHÁT ÂM ĐỘC LẬP */}
                        <button
                          onClick={() => {
                            playSfx('click');
                            setSelectedVoiceWord({
                              wordChinese: '室内设计',
                              wordPinyin: 'shìnèi shèjì',
                              wordVietnamese: 'Thiết kế nội thất'
                            });
                          }}
                          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-serif font-black text-xs uppercase rounded-xl border-2 border-[#1f2937] shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          AI Mỏ Hỗn Luyện Phát Âm (Độc Lập)
                        </button>
                      </div>

                      {/* BỘ LỌC CHỦ ĐỀ THƯ VIỆN */}
                      <div className="flex gap-1.5 flex-wrap pb-3 border-b-2 border-dashed border-pink-200">
                        <button
                          onClick={() => {
                            setSelectedLibraryTheme('all');
                            setLibraryPage(1);
                            playSfx('click');
                          }}
                          className={`px-3 py-1 border-2 border-[#1f2937] font-black text-[10px] uppercase rounded-lg shadow-[1px_1px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                            selectedLibraryTheme === 'all'
                              ? 'bg-pink-500 text-white shadow-none translate-y-0.5'
                              : 'bg-white text-[#1f2937]'
                          }`}
                        >
                          Tất cả ({searchFiltered.length})
                        </button>
                        {uniqueCategories.map((cat) => {
                          const count = searchFiltered.filter(item => getVocabCategory(item) === cat).length;
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setSelectedLibraryTheme(cat);
                                setLibraryPage(1);
                                playSfx('click');
                              }}
                              className={`px-3 py-1 border-2 border-[#1f2937] font-black text-[10px] uppercase rounded-lg shadow-[1px_1px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                                selectedLibraryTheme === cat
                                  ? 'bg-pink-500 text-white shadow-none translate-y-0.5'
                                  : 'bg-white text-[#1f2937]'
                              }`}
                            >
                              {cat} ({count})
                            </button>
                          );
                        })}
                      </div>

                      {Object.entries(groupedVocabs).map(([categoryName, items]) => (
                        <div key={categoryName} className="space-y-3 text-left">
                          <div className="flex items-center gap-2 border-b-2 border-dashed border-[#1f2937] pb-1.5 mt-2">
                            <span className="text-[10px] font-black px-2 py-0.5 bg-pink-500 text-white rounded border border-[#1f2937] shadow-[1px_1px_0px_#1f2937]">
                              {items.length} từ
                            </span>
                            <h3 className="text-sm font-serif font-black text-[#1f2937]">{categoryName}</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item, idx) => (
                              <div
                                key={item.id || idx}
                                className="p-4 bg-white border-2 border-[#1f2937] rounded-xl shadow-[2px_2px_0px_#1f2937] flex flex-col justify-between space-y-3"
                              >
                                <div className="space-y-1.5 text-left">
                                  <div className="flex justify-between items-center border-b border-dashed border-pink-200 pb-1.5">
                                    <h4 className="text-sm font-serif font-black text-rose-600 flex items-center gap-1.5">
                                      <span>{item.nameChinese}</span>
                                      <button
                                        onClick={() => handlePlayTTS(item.nameChinese)}
                                        className="p-0.5 bg-pink-50 hover:bg-pink-100 border border-gray-300 rounded cursor-pointer"
                                      >
                                        {renderAudioIcon('w-3 h-3 text-[#1f2937]')}
                                      </button>
                                    </h4>
                                    <span className="text-[9px] bg-pink-100 text-pink-800 border border-pink-200 px-1.5 py-0.2 rounded font-sans font-black">
                                      HSK {item.hskLevel}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 font-bold font-mono">{item.namePinyin}</p>
                                  <button
                                    onClick={() => setSelectedVoiceWord({ wordChinese: item.nameChinese, wordPinyin: item.namePinyin, wordVietnamese: item.nameVietnamese })}
                                    className="w-full py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-900 border border-[#1f2937] text-[10px] font-black uppercase rounded cursor-pointer flex items-center justify-center gap-1.5 shadow-[1px_1px_0px_#1f2937] transition"
                                  >
                                    <svg className="w-3.5 h-3.5 text-pink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                    Luyện Phát Âm (AI Roast)
                                  </button>
                                  <p className="text-xs font-black text-[#1f2937]">Nghĩa: {item.nameVietnamese}</p>
                                  {item.exampleChinese && (
                                    <div className="mt-2 p-2 bg-[#fffaf0] rounded border border-dashed border-pink-200/60 text-[10.5px]">
                                      <p className="font-bold text-gray-600">Ví dụ: {item.exampleChinese}</p>
                                      <p className="text-blue-500 italic text-[9.5px]">{item.examplePinyin}</p>
                                      <p className="text-gray-500 font-bold text-[9.5px]">Nghĩa ví dụ: {item.exampleVietnamese}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* THANH PHÂN TRANG CHUẨN 100% IELTS VOCAB */}
                      {totalPages > 1 && (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 bg-white dark:bg-slate-900 p-4 border-3 border-[#1f2937] dark:border-slate-700 shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#020617] rounded-2xl w-full text-black dark:text-slate-100">
                          <p className="text-xs font-mono font-bold text-gray-600 dark:text-slate-400">
                            Hiển thị từ <span className="font-black text-black dark:text-white">{(safePage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-black text-black dark:text-white">{Math.min(safePage * ITEMS_PER_PAGE, totalCount)}</span> trên <span className="font-black text-black dark:text-white">{totalCount}</span> từ vựng
                          </p>

                          <div className="flex items-center gap-1.5 flex-wrap justify-center">
                            {/* Prev Button */}
                            <button
                              disabled={safePage === 1}
                              onClick={() => {
                                setLibraryPage((prev) => Math.max(prev - 1, 1));
                                playSfx('click');
                              }}
                              className="w-9 h-9 flex items-center justify-center border-2 border-[#1f2937] dark:border-slate-600 rounded-lg font-mono font-black text-xs bg-gray-100 dark:bg-slate-800 text-black dark:text-white shadow-[2px_2px_0_#000] disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                              title="Trang trước"
                            >
                              &lt;
                            </button>

                            {/* Page Numbers */}
                            {getLibraryPageNumbers(safePage, totalPages).map((p, idx) => {
                              if (p === '...') {
                                return (
                                  <span key={`dots-${idx}`} className="w-8 h-9 flex items-center justify-center font-mono font-bold text-gray-400">
                                    ...
                                  </span>
                                );
                              }

                              const isCurrent = p === safePage;
                              return (
                                <button
                                  key={`page-${p}`}
                                  onClick={() => {
                                    setLibraryPage(p as number);
                                    playSfx('click');
                                  }}
                                  className={`w-9 h-9 flex items-center justify-center border-2 border-[#1f2937] dark:border-slate-600 rounded-lg font-mono font-black text-xs transition-all cursor-pointer ${
                                    isCurrent
                                      ? 'bg-sky-500 text-white shadow-[2px_2px_0_#000]'
                                      : 'bg-white dark:bg-slate-800 text-black dark:text-slate-100 shadow-[2px_2px_0_#000] hover:bg-amber-100 dark:hover:bg-slate-700'
                                  }`}
                                >
                                  {p}
                                </button>
                              );
                            })}

                            {/* Next Button */}
                            <button
                              disabled={safePage === totalPages}
                              onClick={() => {
                                setLibraryPage((prev) => Math.min(prev + 1, totalPages));
                                playSfx('click');
                              }}
                              className="w-9 h-9 flex items-center justify-center border-2 border-[#1f2937] dark:border-slate-600 rounded-lg font-mono font-black text-xs bg-gray-100 dark:bg-slate-800 text-black dark:text-white shadow-[2px_2px_0_#000] disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                              title="Trang sau"
                            >
                              &gt;
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {librarySubTab === 'grammar' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {HSK_GRAMMAR_RULES.map((rule) => (
                      <div key={rule.id} className="p-4 bg-white border-2 border-[#1f2937] rounded-xl shadow-[3px_3px_0px_#1f2937] space-y-3">
                        <div className="flex justify-between items-center border-b border-dashed border-pink-200 pb-2">
                          <h4 className="text-xs font-serif font-black text-pink-600">{rule.title}</h4>
                          <span className="text-[9px] bg-pink-100 text-pink-800 border border-pink-200 px-2 py-0.5 rounded font-black font-sans">
                            HSK {rule.level}
                          </span>
                        </div>
                        <p className="text-[11.5px] font-black text-gray-500">
                          Cấu trúc: <code className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded font-mono font-bold">{rule.structure}</code>
                        </p>
                        <p className="text-xs font-bold text-[#1f2937] leading-relaxed">{rule.explanation}</p>
                        
                        <div className="p-2.5 bg-pink-50/20 rounded-lg border border-pink-100 space-y-1">
                          <p className="text-sm font-serif font-black text-[#1f2937] flex items-center gap-1.5">
                            <span>{rule.exampleChinese}</span>
                            <button
                              onClick={() => handlePlayTTS(rule.exampleChinese)}
                              className="p-0.5 bg-white border border-gray-300 rounded cursor-pointer"
                            >
                              {renderAudioIcon('w-3 h-3 text-[#1f2937]')}
                            </button>
                          </p>
                          <p className="text-[10px] text-blue-600 font-bold font-sans">{rule.examplePinyin}</p>
                          <p className="text-[10.5px] text-gray-500 font-bold">Dịch nghĩa: {rule.exampleVietnamese}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'admin' && ADMIN_EMAILS.includes(user.email.toLowerCase()) && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl p-6 space-y-6 shadow-xs">
                <h2 className="text-xl font-bold border-b border-dashed border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-center text-slate-900 dark:text-slate-100">
                  <span>Bảng Điều Khiển Admin (Khang & Vy)</span>
                  <button
                    onClick={fetchAdminLogs}
                    className="px-3 py-1 bg-white hover:bg-gray-100 border border-[#1f2937] rounded-lg text-xs font-black cursor-pointer transition-all"
                  >
                    Tải Lại CSDL
                  </button>
                </h2>

                {adminLoading ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Danh sách người dùng */}
                    <div className="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      <h3 className="text-xs font-black uppercase text-gray-400">Danh sách tài khoản Vy & Hệ thống ({adminUsers.length})</h3>
                      {adminUsers.map(u => (
                        <div key={u.id} className="p-4 bg-white border-2 border-[#1f2937] rounded-xl shadow-[2px_2px_0px_#1f2937] space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-black text-rose-600">{u.username}</h4>
                              <p className="text-[11px] text-gray-500 font-bold">{u.email}</p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedUserForVoucher(u.id);
                                setAdminVoucherMsg(null);
                                playSfx('click');
                              }}
                              className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white border-2 border-[#1f2937] font-black text-[10px] uppercase rounded-lg shadow-[1px_1px_0px_#1f2937] cursor-pointer"
                            >
                              Tặng Voucher
                            </button>
                          </div>
                          
                          {/* Tiến trình */}
                          <div className="grid grid-cols-3 gap-2 p-2 bg-[#fffaf0] rounded-lg border border-[#1f2937] text-[10.5px] font-black text-[#1f2937] text-center">
                            <div>Xu: {u.progress?.coins || 0}</div>
                            <div>Điểm: {u.progress?.score || 0}</div>
                            <div>Cấp: {u.progress?.level || 1}</div>
                          </div>

                          {/* Danh sách voucher đã có */}
                          {u.vouchers && u.vouchers.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-gray-400 uppercase">Voucher đã sở hữu:</span>
                              <div className="flex gap-1.5 flex-wrap">
                                {u.vouchers.map((v: any) => (
                                  <span key={v.id} className="text-[9.5px] px-2 py-0.5 bg-green-50 text-green-700 border border-green-300 rounded font-mono font-bold" title={v.description}>
                                    {v.code}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Form tặng Voucher */}
                    <div className="lg:col-span-5 bg-white border-2 border-[#1f2937] p-5 rounded-xl shadow-[3px_3px_0px_#1f2937] h-fit">
                      <h3 className="text-sm font-serif font-black text-[#1f2937] mb-3">Tặng Voucher Đặc Quyền</h3>
                      
                      {selectedUserForVoucher ? (
                        <form onSubmit={handleIssueVoucher} className="space-y-3">
                          <div className="text-xs font-bold text-gray-500 bg-amber-50 p-2 rounded border border-amber-200">
                            Người nhận: <span className="font-black text-rose-600">{adminUsers.find(u => u.id === selectedUserForVoucher)?.username}</span>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Tiêu đề Voucher:</label>
                            <input
                              type="text"
                              value={customVoucherTitle}
                              onChange={e => setCustomVoucherTitle(e.target.value)}
                              placeholder="Ví dụ: Voucher Trà sữa ôm ấm..."
                              className="w-full p-2 border-2 border-[#1f2937] bg-white rounded-lg text-xs font-bold focus:outline-none"
                              maxLength={100}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Mô tả đặc quyền:</label>
                            <textarea
                              value={customVoucherDesc}
                              onChange={e => setCustomVoucherDesc(e.target.value)}
                              placeholder="Mô tả cụ thể đặc quyền dành cho Vy..."
                              className="w-full p-2 border-2 border-[#1f2937] bg-white rounded-lg text-xs font-bold focus:outline-none h-16 resize-none"
                              maxLength={500}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Mã Voucher (Duy nhất):</label>
                            <input
                              type="text"
                              value={customVoucherCode}
                              onChange={e => setCustomVoucherCode(e.target.value)}
                              placeholder="Ví dụ: KHANG-OM-VY"
                              className="w-full p-2 border-2 border-[#1f2937] bg-white rounded-lg text-xs font-bold focus:outline-none"
                              maxLength={100}
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setSelectedUserForVoucher(null)}
                              className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 border-2 border-[#1f2937] text-xs font-black rounded-lg cursor-pointer"
                            >
                              Hủy
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white border-2 border-[#1f2937] text-xs font-black rounded-lg shadow-[2px_2px_0px_#1f2937] active:shadow-none active:translate-y-0.5 transition-all cursor-pointer"
                            >
                              Gửi Tặng
                            </button>
                          </div>

                          {adminVoucherMsg && (
                            <p className={`text-[11px] font-bold p-2 rounded border text-center ${
                              adminVoucherMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                              {adminVoucherMsg.text}
                            </p>
                          )}
                        </form>
                      ) : (
                        <div className="text-center py-12 text-gray-400 font-bold text-xs">
                          Chọn nút "Tặng Voucher" của một tài khoản bên trái để bắt đầu tạo quà tặng đặc cách.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PHẦN 2: BOT AI CRAWL TỪ VỰNG & QUẢN LÝ (CHO KHANG) */}
                  <div className="border-t border-dashed border-slate-300 dark:border-slate-800 pt-6 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {renderAIIcon('w-6 h-6 text-blue-600 dark:text-blue-400')} Trợ Lý AI: Bot Tạo & Crawl Từ Vựng HSK (Admin Khang)
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* CỘT TRÁI: FORM CRAWL/GENERATE */}
                      <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4 text-slate-900 dark:text-slate-100">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {renderAIIcon('w-4 h-4 text-amber-500')} Nhập chủ đề hoặc danh sách chữ Hán cần tạo
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Nhập chữ Hán (ví dụ: 苹果, 香蕉) hoặc chủ đề (ví dụ: Màu sắc, Thời tiết, Đồ ăn) để Bot AI tự động tìm Pinyin, nghĩa Việt và tạo câu ví dụ cho Vy.
                        </p>

                        <div className="space-y-3">
                          <div className="p-3 bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/60 rounded-xl text-xs text-pink-900 dark:text-pink-200">
                            <b>Tự động cân bằng HSK 1-2-3 (Giống IELTS):</b> Bot AI sẽ tự động tạo bộ 9 từ vựng thuộc chủ đề được chọn (cân bằng 3 từ HSK 1, 3 từ HSK 2 và 3 từ HSK 3).
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Chủ đề từ vựng cần tạo:</label>
                            <select
                              value={vocabTheme}
                              onChange={(e) => setVocabTheme(e.target.value)}
                              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                            >
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="all_themes">TỰ ĐỘNG BƠM TẤT CẢ 14+ CHỦ ĐỀ (FULL THEMES)</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Mua sắm & Shopping">Mua sắm & Shopping</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Ẩm thực & Đi ăn tiệm">Ẩm thực & Đi ăn tiệm</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Màu sắc & Thiết kế">Màu sắc & Thiết kế</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Thời tiết & Thời gian">Thời tiết & Thời gian</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Gia đình & Nhà cửa">Gia đình & Nhà cửa</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Phương hướng & Vị trí">Phương hướng & Vị trí</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Sở thích & Hẹn hò">Sở thích & Hẹn hò</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Động vật & Thú cưng">Động vật & Thú cưng</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Học tập & Trường học">Học tập & Trường học</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Công việc & Văn phòng">Công việc & Văn phòng</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Giao thông & Du lịch">Giao thông & Du lịch</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Kiến trúc & Nội thất">Kiến trúc & Nội thất</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Cảm xúc & Mô tả">Cảm xúc & Mô tả</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="Giải trí & Thể thao">Giải trí & Thể thao</option>
                              <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" value="custom">Chủ đề tùy chọn tự nhập...</option>
                            </select>
                          </div>

                          {vocabTheme === 'custom' && (
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Nhập chủ đề tùy chọn:</label>
                              <input
                                type="text"
                                value={vocabCustomTheme}
                                onChange={e => setVocabCustomTheme(e.target.value)}
                                placeholder="Ví dụ: Đồ ăn ngọt, Đi uống trà sữa..."
                                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                              />
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={handleGenerateVocab}
                            disabled={vocabBotLoading}
                            className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                          >
                            {vocabBotLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Đang tạo từ vựng...
                              </>
                            ) : (
                              'Khởi Chạy Bot Crawl'
                            )}
                          </button>
                        </div>

                        {vocabBotMsg && (
                          <p className={`text-xs font-bold p-3 rounded-xl border text-center ${
                            vocabBotMsg.type === 'success' 
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
                              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                          }`}>
                            {vocabBotMsg.text}
                          </p>
                        )}

                        {/* Hiển thị danh sách từ vựng vừa tạo được */}
                        {generatedVocab.length > 0 && (
                          <div className="space-y-3 pt-3 border-t border-dashed border-slate-300 dark:border-slate-800">
                            <div className="flex justify-between items-center">
                              <h5 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Kết quả Bot AI ({generatedVocab.length} từ)</h5>
                              <button
                                type="button"
                                onClick={handleSaveVocab}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase cursor-pointer transition-all active:scale-95"
                              >
                                Lưu Vào Game
                              </button>
                            </div>

                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                              {generatedVocab.map((item, idx) => (
                                <div key={idx} className="p-3 bg-pink-50/60 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start gap-3 text-left">
                                  <input
                                    type="checkbox"
                                    checked={item.selected}
                                    onChange={(e) => {
                                      const next = [...generatedVocab];
                                      next[idx].selected = e.target.checked;
                                      setGeneratedVocab(next);
                                    }}
                                    className="mt-1 accent-rose-500 w-4 h-4"
                                  />
                                  <div className="text-xs flex-1">
                                    <div className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                                      <span className="text-sm">{item.nameChinese}</span>
                                      <span className="text-xs text-slate-500 dark:text-slate-400">[{item.namePinyin}]</span>
                                      <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 px-1.5 py-0.5 rounded font-mono uppercase">HSK {item.hskLevel}</span>
                                    </div>
                                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">Nghĩa: {item.nameVietnamese}</div>
                                    {item.exampleChinese && (
                                      <div className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                                        <p className="font-bold text-slate-700 dark:text-slate-300">Ví dụ: {item.exampleChinese}</p>
                                        <p className="italic text-blue-600 dark:text-blue-400">{item.examplePinyin}</p>
                                        <p className="font-bold text-slate-600 dark:text-slate-400">Dịch: {item.exampleVietnamese}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CỘT PHẢI: DANH SÁCH TỪ VỰNG DƯỚI CSDL */}
                      <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-3 text-slate-900 dark:text-slate-100">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                          <span>Kho từ vựng bổ sung trong CSDL ({customVocabs.length})</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Các từ vựng do bạn tạo sẽ lưu trữ tại đây và tự động gộp vào dải câu hỏi ngẫu nhiên trong phần giải Bản Vẽ của Vy.
                        </p>

                        {customVocabs.length === 0 ? (
                          <div className="py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-center text-slate-400 font-bold text-xs">
                            Hiện chưa có từ vựng bổ sung nào trong CSDL.
                          </div>
                        ) : (
                          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                            {customVocabs.map((item) => (
                              <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center text-left">
                                <div className="text-xs">
                                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <span className="text-sm">{item.nameChinese}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">[{item.namePinyin}]</span>
                                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-1.5 py-0.5 rounded font-mono">HSK {item.hskLevel}</span>
                                  </div>
                                  <div className="font-bold text-slate-700 dark:text-slate-300 mt-1">Nghĩa: {item.nameVietnamese}</div>
                                  {item.exampleChinese && (
                                    <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                                      Ví dụ: {item.exampleChinese} ({item.exampleVietnamese})
                                    </div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteVocab(item.id)}
                                  className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-all"
                                >
                                  Xóa
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              </div>
            )}
          </div>

      {/* OVERLAY MODAL: AI EXPLAIN WORD */}
      {explainWord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="max-w-md w-full bg-[#fffaf0] border-4 border-[#1f2937] rounded-3xl p-6 shadow-[4px_4px_0px_#1f2937] relative">
            <button
              onClick={() => setExplainWord(null)}
              className="absolute top-4 right-4 p-1.5 bg-gray-100 border border-gray-300 rounded-lg text-xs font-black text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Đóng
            </button>

            <h3 className="text-lg font-serif font-black text-[#1f2937] border-b-2 border-dashed border-[#1f2937] pb-3 mb-4 flex items-center gap-1.5">
              {renderAIIcon('w-5 h-5 text-blue-500')} AI Giải Nghĩa Từ: "{explainWord}"
            </h3>

            {isExplaining ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-500 font-bold">AI đang phân tích cấu tạo chữ và ví dụ...</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 text-xs leading-relaxed font-medium">
                {explanationText ? (
                  <div className="prose prose-sm max-w-none text-[#1f2937]">
                    {explanationText.split('\n').map((line, idx) => (
                      <p key={idx} className="my-1.5">
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500 font-bold">Lỗi không thể tải dữ liệu phân tích.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL SẮP XẾP NỘI THẤT 2D & ĐÁNH GIÁ THẨM MỸ */}
      {showArrangementModal && currentContract && (
        <ArrangementModal
          contract={currentContract}
          selectedItemIds={contractSelectedItems}
          onClose={() => setShowArrangementModal(false)}
          onComplete={handleCompleteArrangement}
          playSfx={playSfx}
        />
      )}

      {/* MODAL AI MỎ HỖN CHẤM ĐIỂM GIỌNG NÓI */}
      {selectedVoiceWord && (
        <VoiceRoastModal
          wordChinese={selectedVoiceWord.wordChinese}
          wordPinyin={selectedVoiceWord.wordPinyin}
          wordVietnamese={selectedVoiceWord.wordVietnamese}
          onClose={() => setSelectedVoiceWord(null)}
          playSfx={playSfx}
        />
      )}

      {/* THANH ĐIỀU HƯỚNG DÀNH RIÊNG CHO MOBILE (BOTTOM DOCK CAPSULE) */}
      {user && (
        <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-full shadow-xl p-1.5 flex items-center justify-around md:hidden transition-all">
          <button
            onClick={() => { setActiveTab('studio'); playSfx('click'); }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'studio' 
                ? 'bg-rose-500 text-white font-bold shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {renderAwardIcon(activeTab === 'studio' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-rose-500')}
            <span className="text-[10px] font-bold mt-0.5">Studio</span>
          </button>

          <button
            onClick={() => { setActiveTab('quiz'); playSfx('click'); }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'quiz' 
                ? 'bg-rose-500 text-white font-bold shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {renderBookIcon(activeTab === 'quiz' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-blue-500')}
            <span className="text-[10px] font-bold mt-0.5">Quiz</span>
          </button>

          <button
            onClick={() => { setActiveTab('room'); playSfx('click'); }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'room' 
                ? 'bg-rose-500 text-white font-bold shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {renderHomeIcon(activeTab === 'room' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-emerald-500')}
            <span className="text-[10px] font-bold mt-0.5">Phòng</span>
          </button>

          <button
            onClick={() => { setShowPetShopModal(true); playSfx('click'); }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all cursor-pointer ${
              showPetShopModal 
                ? 'bg-amber-500 text-white font-bold shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {renderShoppingBagIcon(showPetShopModal ? 'w-4 h-4 text-white' : 'w-4 h-4 text-amber-500')}
            <span className="text-[10px] font-bold mt-0.5">Shop</span>
          </button>

          <button
            onClick={() => { setActiveTab('love'); playSfx('click'); }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all cursor-pointer ${
              activeTab === 'love' 
                ? 'bg-rose-500 text-white font-bold shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {renderVoucherIcon(activeTab === 'love' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-pink-500')}
            <span className="text-[10px] font-bold mt-0.5">Voucher</span>
          </button>

          {ADMIN_EMAILS.includes(user.email.toLowerCase()) && (
            <button
              onClick={() => { setActiveTab('admin'); fetchAdminLogs(); playSfx('click'); }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'admin' 
                  ? 'bg-purple-600 text-white font-bold shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {renderAIIcon(activeTab === 'admin' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-purple-500')}
              <span className="text-[10px] font-bold mt-0.5">Admin</span>
            </button>
          )}
        </nav>
      )}

      {/* THÚ CƯNG PIXEL 2D ĐI DẠO MÀN HÌNH BÊN NGOÀI (CHỈ HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP) */}
      {user && (
        <PixelPet 
          coins={coins} 
          setCoins={setCoins} 
          onPlayTTS={handlePlayTTS} 
          playSfx={playSfx} 
          isDarkMode={isDarkMode} 
          externalShowShop={showPetShopModal}
          onToggleShop={setShowPetShopModal}
          isVy={isVy}
          isKhang={user?.email?.toLowerCase() === 'ungnhutkhang53@gmail.com'}
        />
      )}

      {/* MODAL SỔ TAY THUẬT NGỮ KIẾN TRÚC & VẬT LIỆU HSK (FOR VY) */}
      <ArchitectGlossaryModal
        isOpen={showArchitectModal}
        onClose={() => setShowArchitectModal(false)}
        onPlayTTS={handlePlayTTS}
      />

      {/* MODAL GÓP Ý FEEDBACK DÙNG CHUNG SMTP STUDIO VOCAB */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#fffdf8] dark:bg-slate-900 border-4 border-black dark:border-slate-700 p-6 rounded-2xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#020617] max-w-md w-full space-y-4 text-black dark:text-slate-100 text-left relative">
            <div className="flex justify-between items-center border-b-4 border-black dark:border-slate-700 pb-3">
              <h3 className="font-serif font-black text-xl flex items-center gap-2 text-rose-600 dark:text-rose-400">
                Góp Ý & Phản Hồi Tính Năng
              </h3>
              <button
                onClick={() => { setShowFeedbackModal(false); playSfx('click'); }}
                className="w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white font-mono font-black border-2 border-black dark:border-slate-700 rounded-lg shadow-[2px_2px_0_#000] flex items-center justify-center cursor-pointer"
              >
                X
              </button>
            </div>

            <form onSubmit={handleSendFeedback} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs font-bold uppercase">Loại phản hồi</label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full border-4 border-black dark:border-slate-700 p-2.5 font-mono font-bold text-sm rounded bg-white dark:bg-slate-800 text-black dark:text-slate-100 focus:outline-none shadow-[2px_2px_0_#000]"
                >
                  <option value="Góp ý giao diện">Góp ý giao diện & trải nghiệm</option>
                  <option value="Báo lỗi tính năng">Báo lỗi (Bug Report)</option>
                  <option value="Đề xuất tính năng mới">Đề xuất tính năng mới</option>
                  <option value="Khác">Góp ý khác</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs font-bold uppercase">Email liên hệ của bạn (tùy chọn)</label>
                <input
                  type="email"
                  value={feedbackContact}
                  onChange={(e) => setFeedbackContact(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full border-4 border-black dark:border-slate-700 p-2.5 font-mono font-bold text-sm rounded bg-white dark:bg-slate-800 text-black dark:text-slate-100 focus:outline-none shadow-[2px_2px_0_#000]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs font-bold uppercase">Nội dung góp ý chi tiết *</label>
                <textarea
                  required
                  rows={4}
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  placeholder="Nhập ý kiến góp ý của bạn để giúp Studio Vocab nâng cấp hoàn thiện hơn..."
                  className="w-full border-4 border-black dark:border-slate-700 p-3 font-sans font-bold text-sm rounded bg-white dark:bg-slate-800 text-black dark:text-slate-100 focus:outline-none shadow-[2px_2px_0_#000]"
                />
              </div>

              {feedbackMsg && (
                <div className={`p-2.5 border-2 border-black rounded text-xs font-mono font-bold ${
                  feedbackMsg.type === 'success' ? 'bg-green-100 text-green-800 border-green-700' : 'bg-rose-100 text-rose-800 border-rose-700'
                }`}>
                  {feedbackMsg.text}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 py-2.5 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-black dark:text-slate-200 font-mono font-bold text-xs uppercase border-3 border-black dark:border-slate-700 rounded shadow-[2px_2px_0_#000] cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={feedbackLoading}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-mono font-bold text-xs uppercase border-3 border-black dark:border-slate-700 rounded shadow-[2px_2px_0_#000] cursor-pointer"
                >
                  {feedbackLoading ? 'Đang gửi...' : 'Gửi Thư Góp Ý'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
      )}

      {/* Retro CSS animations style tag */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>
    </main>
  );
}

// Icon Palette bổ trợ
function renderPaletteIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );
}

// Hàm phân trang chuẩn 100% IELTS Vocab
function getLibraryPageNumbers(current: number, total: number) {
  const pages: (number | string)[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);

    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push('...');
    pages.push(total);
  }
  return pages;
}
