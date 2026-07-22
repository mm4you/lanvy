'use client';

import { useState, useEffect, useRef } from 'react';
import { FURNITURE_ITEMS, MATERIAL_ITEMS, DESIGN_CONTRACTS, FurnitureItem, MaterialItem, DesignContract, HSK_GRAMMAR_RULES, GENERAL_VOCAB_ITEMS } from '../data/vocabulary';
import dynamic from 'next/dynamic';
import { renderFurnitureSVG } from '../components/RoomEditor';
import { generateDynamicContract } from '../lib/contract-generator';
import { bgmPlayer } from '../lib/bgmPlayer';
import { checkAndRewardDailyStreak, getBookmarkedIds, toggleBookmark } from '../lib/bookmarksAndStreak';

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

const AIChatBubbleModal = dynamic(() => import('../components/AIChatBubbleModal'), {
  loading: () => null
});

const DailyAttendanceModal = dynamic(() => import('../components/DailyAttendanceModal'), {
  loading: () => null
});

const PixelPet = dynamic(() => import('../components/PixelPet').then(m => m.PixelPet), {
  loading: () => null
});

const NotebookModal = dynamic(() => import('../components/NotebookModal'), {
  loading: () => null
});

const LuckyWheelModal = dynamic(() => import('../components/LuckyWheelModal'), {
  loading: () => null
});

const LeaderboardModal = dynamic(() => import('../components/LeaderboardModal'), {
  loading: () => null
});

const LearningStatsModal = dynamic(() => import('../components/LearningStatsModal'), {
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

function renderSunIcon(className = 'w-5 h-5 text-yellow-400') {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18z" />
    </svg>
  );
}

function renderMoonIcon(className = 'w-5 h-5 text-slate-600 dark:text-slate-300') {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21 12.79A9 9 0 0 1 12.21 3c-.13 0-.26 0-.39.01A7 7 0 0 0 12 21a9 9 0 0 0 9-8.21z" />
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
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <rect x="4" y="8" width="16" height="12" rx="3" fill="currentColor" fillOpacity="0.15" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V5a3 3 0 016 0v3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
      <rect x="7" y="14" width="10" height="5" rx="2" strokeLinecap="round" strokeLinejoin="round" />
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

function renderChatIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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

function renderFlameIcon(className = 'w-4 h-4 text-amber-500') {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22C16.4183 22 20 18.4183 20 14C20 10.3 17.5 7.2 14 5.7C14 8.5 11.5 10 10 11C8.5 12 7.5 13 7.5 15C7.5 15.5 7.7 16 8 16.5C6.8 15.7 6 14.4 6 13C4.8 14.5 4 16.4 4 18.5C4 20.4 5.6 22 7.5 22C8 22 9.5 21.5 10.5 20.5C10 20 9.5 19.3 9.5 18.5C9.5 17.1 10.6 16 12 16C13.4 16 14.5 17.1 14.5 18.5C14.5 19.5 13.9 20.4 13 21C14 21.8 15.4 22 17 22"
        fill="url(#flame-grad-global)"
      />
      <defs>
        <linearGradient id="flame-grad-global" x1="12" y1="4" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF4D4D" />
          <stop offset="0.5" stopColor="#FF8000" />
          <stop offset="1" stopColor="#FFCC00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function renderMusicIcon(isPlaying: boolean, className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  );
}

function renderStarIcon(isFilled: boolean, className = 'w-4 h-4') {
  return (
    <svg className={className} fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      localStorage.setItem('boba_game_theme', next ? 'dark' : 'light');
      return next;
    });
    if (playSfx) playSfx('click');
  };

  // Persistent Inventory State
  const [userInventory, setUserInventory] = useState<{
    powerup_5050: number;
    powerup_skip: number;
    blueprint_rare: number;
  }>({
    powerup_5050: 1,
    powerup_skip: 1,
    blueprint_rare: 0,
  });

  useEffect(() => {
    const savedInv = localStorage.getItem('hsk_user_inventory');
    if (savedInv) {
      try {
        setUserInventory(JSON.parse(savedInv));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hsk_user_inventory', JSON.stringify(userInventory));
  }, [userInventory]);

  // Navigation tab & grouped dropdown state
  const [activeTab, setActiveTab] = useState<'studio' | 'quiz' | 'room' | 'love' | 'library' | 'admin' | 'flashcards'>('studio');
  const [openNavGroup, setOpenNavGroup] = useState<'study' | 'studio' | 'personal' | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isMobileStudyOpen, setIsMobileStudyOpen] = useState(false);
  const [loveSubTab, setLoveSubTab] = useState<'contracts' | 'chat' | 'wallet'>('wallet');

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
  const [showNotebookModal, setShowNotebookModal] = useState<boolean>(false);

  const allContracts = [...DESIGN_CONTRACTS, ...dynamicContracts];

  // Library subtab state
  const [librarySubTab, setLibrarySubTab] = useState<'furniture' | 'vocab' | 'grammar' | 'bookmarked'>('furniture');
  const [selectedLibraryTheme, setSelectedLibraryTheme] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [streakData, setStreakData] = useState<{ streakCount: number; lastLoginDate: string; claimedToday: boolean }>({ streakCount: 1, lastLoginDate: '', claimedToday: false });
  const [streakToastMsg, setStreakToastMsg] = useState<string | null>(null);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);

  const [showDailyAttendanceModal, setShowDailyAttendanceModal] = useState<boolean>(false);
  const [showLuckyWheelModal, setShowLuckyWheelModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showLearningStatsModal, setShowLearningStatsModal] = useState<boolean>(false);

  useEffect(() => {
    // Check Daily Streak
    const { streakData: sData, justClaimedReward, rewardCoins } = checkAndRewardDailyStreak();
    setStreakData(sData);
    setBookmarkedIds(getBookmarkedIds());

    const todayStr = new Date().toISOString().split('T')[0];
    const lastModalShown = localStorage.getItem('hsk_last_attendance_modal_date');
    // Automatically pop up Daily Attendance Modal ONLY on first daily visit
    if (lastModalShown !== todayStr) {
      setShowDailyAttendanceModal(true);
      localStorage.setItem('hsk_last_attendance_modal_date', todayStr);
    }
  }, []);

  const handleClaimDailyAttendance = () => {
    const { streakData: sData, rewardCoins } = checkAndRewardDailyStreak();
    const todayStr = new Date().toISOString().split('T')[0];
    setStreakData({ ...sData, claimedToday: true });
    localStorage.setItem('hsk_last_attendance_modal_date', todayStr);

    if (rewardCoins > 0) {
      setCoins((prev) => prev + rewardCoins);
      setStreakToastMsg(`Chúc mừng! Bạn đã điểm danh Ngày ${sData.streakCount} và nhận +${rewardCoins} Xu!`);
      setTimeout(() => setStreakToastMsg(null), 5000);
    }
    playSfx('success');
  };

  const toggleBGM = () => {
    const status = bgmPlayer.toggle();
    setIsBgmPlaying(status);
    playSfx('click');
  };

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
  const [vocabHskGroup, setVocabHskGroup] = useState<'hsk123' | 'hsk456'>('hsk123');
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
              body: JSON.stringify({ query: th, category: th, hskGroup: vocabHskGroup })
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
          setVocabBotMsg({ type: 'success', text: `Đã tự động bơm thành công ${combined.length} từ vựng thuộc nhóm ${vocabHskGroup === 'hsk456' ? 'HSK 4-5-6 Nâng Cao' : 'HSK 1-2-3 Cơ Bản'} phủ kín tất cả chủ đề!` });
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
          body: JSON.stringify({ query: finalTheme, category: finalTheme, hskGroup: vocabHskGroup })
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
    <main className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      isDarkMode ? 'dark bg-[#090d16] text-slate-100' : 'bg-slate-100 text-slate-900'
    } p-3 sm:p-4 md:p-6 pb-24 md:pb-6`}>
      {/* 1. MÀN HÌNH ĐĂNG NHẬP / ĐĂNG KÝ NEO-BRUTALIST ĐÚNG CHUẨN IELTS VOCAB BIẾN TẤU CHO HSK VOCAB */}
      {!user ? (
        <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-[#fffaf0] text-slate-900 select-none">
          
          {/* CỘT TRÁI: BRANDING & MINH HỌA PIXEL 2D CHUẨN CHẤT IELTS VOCAB (CHỈ NỔI TRÊN DESKTOP) */}
          <div className="hidden md:flex md:w-1/2 bg-amber-400 border-r-4 border-[#1f2937] flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1f2937_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
            
            {/* Top Header Badge */}
            <div className="z-10 text-left">
              <div className="inline-block border-4 border-[#1f2937] bg-white rounded-xl px-4 py-2 font-mono font-black text-xs uppercase shadow-[3px_3px_0_#1f2937]">
                HSK Vocabulary & 2D Interior Studio
              </div>
            </div>

            {/* Central Illustration and Title */}
            <div className="z-10 my-auto flex flex-col gap-6 max-w-lg text-left">
              
              {/* Neo-brutalist Pixel Book & Furniture SVG Illustration */}
              <div className="mb-2">
                <svg className="w-48 h-48 text-[#1f2937] drop-shadow-xs" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Isometric Desk */}
                  <path d="M30 130 L130 130 L110 160 L10 160 Z" fill="#1f2937" />
                  <rect x="20" y="115" width="110" height="25" rx="4" fill="#ffffff" stroke="#1f2937" strokeWidth="4" />
                  <line x1="20" y1="128" x2="130" y2="128" stroke="#1f2937" strokeWidth="4" />
                  
                  {/* HSK Flashcards Stack */}
                  <rect x="35" y="85" width="70" height="25" rx="4" fill="#38bdf8" stroke="#1f2937" strokeWidth="4" />
                  <line x1="35" y1="97" x2="105" y2="97" stroke="#1f2937" strokeWidth="3" />
                  
                  <rect x="45" y="65" width="70" height="25" rx="4" fill="#fbbf24" stroke="#1f2937" strokeWidth="4" />
                  <line x1="45" y1="77" x2="115" y2="77" stroke="#1f2937" strokeWidth="3" />

                  {/* Sparkle Badges */}
                  <path d="M150 40 L154 52 L166 56 L154 60 L150 72 L146 60 L134 56 L146 52 Z" fill="#f43f5e" stroke="#1f2937" strokeWidth="3" />
                  <path d="M25 50 L28 58 L36 60 L28 62 L25 70 L22 62 L14 60 L22 58 Z" fill="#10b981" stroke="#1f2937" strokeWidth="2" />
                </svg>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-serif font-black text-[#1f2937] leading-tight">
                Chinh Phục HSK 1-6 <br />
                <span className="underline decoration-wavy decoration-rose-500 underline-offset-8">
                  Với Phòng Pixel 2D
                </span>
              </h2>

              <p className="text-[#1f2937] font-bold leading-relaxed border-l-4 border-[#1f2937] pl-4">
                Học từ vựng HSK hiệu quả với phương pháp Lặp lại Ngắt quãng kết hợp Studio Thiết kế Pixel 2D.
              </p>

              {/* Feature Chips with Vector SVG Icons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-white border-2 border-[#1f2937] shadow-[2px_2px_0_#1f2937] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-amber-500 fill-current" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h7v8l10-12h-7V2z" />
                  </svg>
                  Flashcards HSK 1-6
                </span>
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-white border-2 border-[#1f2937] shadow-[2px_2px_0_#1f2937] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Studio Nội Thất 2D
                </span>
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-white border-2 border-[#1f2937] shadow-[2px_2px_0_#1f2937] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pixel Pet Thông Minh
                </span>
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="z-10 pt-6 border-t-4 border-[#1f2937] border-dashed">
              <p className="text-xs font-mono font-black text-[#1f2937] uppercase tracking-wider">
                © 2026 HSK VOCABULARY STUDIO. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>

          {/* CỘT PHẢI: FORM ĐĂNG NHẬP / ĐĂNG KÝ BRUTALIST CHUẨN XÁC NỔI TRÊN NỀN KEM */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 min-h-screen bg-[#fffaf0]">
            
            {/* Background Orbs */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-sky-300/30 rounded-full blur-3xl pointer-events-none" />

            {/* MAIN PANEL CARD */}
            <div className="max-w-md w-full relative z-10 flex flex-col p-8 sm:p-10 bg-[#fffdf8] border-4 border-[#1f2937] shadow-[8px_8px_0_#1f2937] rounded-3xl text-[#1f2937]">
              
              {/* LOGO BADGE */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-400 border-3 border-[#1f2937] p-2.5 shadow-[3px_3px_0_#1f2937] flex items-center justify-center">
                  <img src="/logo.svg" alt="HSK Vocab Logo" className="w-12 h-12 object-contain" />
                </div>
              </div>

              {/* TITLE */}
              <h1 className="text-3xl font-serif font-black text-[#1f2937] text-center mb-1">
                HSK Vocab
              </h1>
              <p className="text-gray-600 text-xs font-bold text-center mb-6">
                Hệ thống yêu cầu đăng nhập để cá nhân hóa tiến trình học từ vựng HSK.
              </p>

              {/* TOGGLE TAB BRUTALIST */}
              <div className="flex border-3 border-[#1f2937] rounded-xl overflow-hidden mb-6 shadow-[3px_3px_0_#1f2937]">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); playSfx('click'); }}
                  className={`flex-1 py-2.5 font-mono font-black text-xs uppercase transition-colors cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-sky-500 text-white border-r-3 border-[#1f2937]'
                      : 'bg-white text-gray-500 hover:bg-gray-100 border-r-3 border-[#1f2937]'
                  }`}
                >
                  Đăng Nhập
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); playSfx('click'); }}
                  className={`flex-1 py-2.5 font-mono font-black text-xs uppercase transition-colors cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-sky-500 text-white'
                      : 'bg-white text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Tạo Tài Khoản
                </button>
              </div>

              {/* AUTH FORM */}
              <form onSubmit={handleAuth} className="flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-[#1f2937] uppercase">Tên Tài Khoản</label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Nhập tên tài khoản..."
                    className="w-full bg-white border-3 border-[#1f2937] p-3.5 rounded-xl font-bold text-sm text-[#1f2937] placeholder-gray-400 shadow-[2px_2px_0_#1f2937] focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  />
                </div>

                {authMode === 'register' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-[#1f2937] uppercase">Địa Chỉ Email</label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-white border-3 border-[#1f2937] p-3.5 rounded-xl font-bold text-sm text-[#1f2937] placeholder-gray-400 shadow-[2px_2px_0_#1f2937] focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-[#1f2937] uppercase">Mật Khẩu</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setShowForgotModal(true); setForgotStep('request'); setForgotMsg(null); playSfx('click'); }}
                        className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
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
                    placeholder="••••••••"
                    className="w-full bg-white border-3 border-[#1f2937] p-3.5 rounded-xl font-bold text-sm text-[#1f2937] placeholder-gray-400 shadow-[2px_2px_0_#1f2937] focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  />
                </div>

                {authError && (
                  <p className="text-xs font-bold text-rose-700 bg-rose-100 border-2 border-rose-400 p-3 rounded-xl text-center">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="mt-2 bg-amber-400 hover:bg-amber-500 text-[#1f2937] py-3.5 font-mono font-black text-sm uppercase rounded-xl border-3 border-[#1f2937] shadow-[4px_4px_0_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer w-full flex items-center justify-center gap-2"
                >
                  {authLoading ? 'Đang Xử Lý...' : authMode === 'login' ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản Mới'}
                </button>
              </form>

              <div className="border-t-2 border-dashed border-[#1f2937] w-full my-5 relative flex items-center justify-center">
                <span className="bg-[#fffdf8] px-3 text-xs font-black text-[#1f2937] uppercase absolute">HOẶC</span>
              </div>

              {/* GOOGLE LOGIN BUTTON BRUTALIST */}
              <a
                href="/api/auth/google/start"
                onClick={() => playSfx('click')}
                className="bg-white hover:bg-amber-50 text-[#1f2937] border-3 border-[#1f2937] w-full py-3.5 text-xs font-black rounded-xl shadow-[3px_3px_0_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Tiếp tục với Google
              </a>
            </div>

            {/* MODAL KHÔI PHỤC MẬT KHẨU OTP */}
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
        </div>
      ) : (
        /* 2. GIAO DIỆN GAME CHÍNH SAU KHI LOGIN */
        <div className="max-w-6xl mx-auto space-y-5 pb-36 md:pb-12">
          {/* HEADER & NAV BAR UNIFIED MODERN CONTAINER */}
          <header className={`rounded-2xl p-4 sm:p-5 flex flex-col gap-4 transition-all duration-300 shadow-xs border ${
            isDarkMode 
              ? 'bg-slate-900 text-slate-100 border-slate-800' 
              : 'bg-white text-slate-900 border-slate-200'
          }`}>
            {/* HÀNG 1: LOGO & TÊN WEB (TRÁI) - TÀI KHOẢN POPUP MENU (PHẢI) */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-3">
              {/* LOGO & TÊN BRAND HSK VOCAB (PHONG CÁCH TỐI GIẢN HIỆN ĐẠI DỄ NHÌN NHƯ IELTS VOCAB) */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center shrink-0 drop-shadow-xs">
                  <img src="/logo.svg" alt="HSK Vocab Logo" className="w-9 h-9 object-contain" />
                </div>
                <div className="flex flex-col text-left">
                  <h1 className={`text-base sm:text-lg font-black tracking-tight leading-tight ${
                    isDarkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    HSK Vocab
                  </h1>
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 -mt-0.5">
                    HSK Vocabulary Studio
                  </span>
                </div>
              </div>

              {/* NÚT ĐỔI GIAO DIỆN SÁNG/TỐI (ĐẶT Ở NGOÀI) & NÚT TÀI KHOẢN TÍCH HỢP POPUP MENU */}
              <div className="flex items-center gap-2">
                {/* NÚT ĐỔI THEME SÁNG / TỐI NẰM Ở NGOÀI NỔI BẬT */}
                <button
                  type="button"
                  aria-label="Toggle dark mode"
                  onClick={() => {
                    toggleDarkMode();
                    playSfx('click');
                  }}
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0 shadow-xs active:scale-95"
                  title={isDarkMode ? 'Đang Ban Đêm (Bấm để chuyển sang Ban Ngày)' : 'Đang Ban Ngày (Bấm để chuyển sang Ban Đêm)'}
                >
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                      <path d="M12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-600 dark:text-slate-300">
                      <path d="M21 12.79A9 9 0 0 1 12.21 3c-.13 0-.26 0-.39.01A7 7 0 0 0 12 21a9 9 0 0 0 9-8.21z" />
                    </svg>
                  )}
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                      playSfx('click');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs active:scale-95"
                  >
                    <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 max-w-[100px] sm:max-w-[140px] truncate">
                      {user.username || user.email?.split('@')[0]}
                    </span>

                    {user.email?.toLowerCase() === LOVE_EMAIL && (
                      <span className="hidden sm:inline-flex text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider items-center gap-1">
                        {renderHeartIcon('w-3 h-3 text-rose-500 fill-current')} Vy Của Khang
                      </span>
                    )}
                    {user.email?.toLowerCase() === 'ungnhutkhang53@gmail.com' && (
                      <span className="hidden sm:inline-flex text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider items-center gap-1">
                        Khang Của Vy
                      </span>
                    )}

                    <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* POPUP MENU KHI NHẤP VÀO TÊN TÀI KHOẢN */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                      {/* THÔNG TIN CHỦ TIỆM */}
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user.username}</p>
                        <p className="text-[10px] text-slate-500 font-mono truncate">{user.email}</p>
                      </div>

                      {/* BẢNG ĐIỂM DÀNH HÀNG NGÀY / STREAK */}
                      <div
                        onClick={() => {
                          setShowDailyAttendanceModal(true);
                          setIsProfileMenuOpen(false);
                          playSfx('click');
                        }}
                        className="p-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl border border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs font-mono font-bold text-rose-700 dark:text-rose-300 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-1.5">
                          {renderFlameIcon('w-4 h-4 text-rose-500')}
                          <span>Điểm Danh Streak:</span>
                        </div>
                        <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{streakData.streakCount} Ngày</span>
                      </div>

                      {/* DÀN NÚT TIỆN ÍCH */}
                      <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            setShowNotebookModal(true);
                            setIsProfileMenuOpen(false);
                            playSfx('click');
                          }}
                          className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                        >
                          {renderBookIcon('w-4 h-4 text-emerald-500')}
                          <span>Sổ Tay Cá Nhân</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowFeedbackModal(true);
                            setIsProfileMenuOpen(false);
                            setFeedbackMsg(null);
                            playSfx('click');
                          }}
                          className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                        >
                          {renderChatIcon('w-4 h-4 text-cyan-500')}
                          <span>Góp Ý & Báo Lỗi</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowArchitectModal(true);
                            setIsProfileMenuOpen(false);
                            playSfx('click');
                          }}
                          className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                        >
                          {renderClipboardIcon()}
                          <span>Specs Kiến Trúc</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full text-left p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-bold flex items-center gap-2.5 text-rose-600 dark:text-rose-400 transition cursor-pointer"
                        >
                          {renderSignoutIcon()}
                          <span>Đăng Xuất (Thoát)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* STREAK TOAST BANNER */}
            {streakToastMsg && (
              <div className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs p-3 rounded-xl flex items-center justify-between shadow-md animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2">
                  {renderFlameIcon('w-5 h-5 text-white animate-bounce')}
                  <span>{streakToastMsg}</span>
                </div>
                <button
                  onClick={() => setStreakToastMsg(null)}
                  className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* HÀNG 2: THANH MENU ĐIỀU HƯỚNG (TRÁI) & CHỈ SỐ THỐNG KÊ (PHẢI) */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-0.5">
              {/* THANH ĐIỀU HƯỚNG NHÓM CHỨC NĂNG */}
              <nav className="w-full md:w-auto hidden md:flex items-center gap-3 shrink-0 relative">
              {/* NHÓM 1: HỌC TẬP HSK */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenNavGroup(openNavGroup === 'study' ? null : 'study')}
                  className={`px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 border ${
                    ['quiz', 'flashcards', 'library'].includes(activeTab)
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {renderBookIcon('w-4 h-4')}
                  <span>Học Tập HSK</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${openNavGroup === 'study' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openNavGroup === 'study' && (
                  <div className={`absolute top-full left-0 mt-2 w-56 border rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150 ${
                    isDarkMode ? 'bg-[#1e1e1e] text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-200'
                  }`}>
                    <button
                      onClick={() => { setActiveTab('quiz'); setOpenNavGroup(null); playSfx('click'); }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                        activeTab === 'quiz' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {renderBookIcon('w-4 h-4 text-blue-500')}
                      <div>
                        <p className="font-bold">Chế Tạo Bản Vẽ HSK</p>
                        <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Chế tạo mảnh bản vẽ nội thất & trả lời quiz HSK</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('flashcards' as any); setOpenNavGroup(null); playSfx('click'); }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                        activeTab === ('flashcards' as any) ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {renderBookIcon('w-4 h-4 text-amber-500')}
                      <div>
                        <p className="font-bold">Flashcards HSK 3D</p>
                        <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Lật thẻ thông minh có ví dụ & audio</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('library'); setOpenNavGroup(null); playSfx('click'); }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                        activeTab === 'library' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {renderBookIcon('w-4 h-4 text-purple-500')}
                      <div>
                        <p className="font-bold">Thư Viện Từ Điển</p>
                        <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Tra cứu ngữ pháp & từ vựng HSK 1-3</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* NHÓM 2: STUDIO & PHÒNG 2D */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenNavGroup(openNavGroup === 'studio' ? null : 'studio')}
                  className={`px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 border ${
                    ['studio', 'room'].includes(activeTab) || showPetShopModal
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {renderHomeIcon('w-4 h-4')}
                  <span>Studio & Phòng</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${openNavGroup === 'studio' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openNavGroup === 'studio' && (
                  <div className={`absolute top-full left-0 mt-2 w-56 border rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150 ${
                    isDarkMode ? 'bg-[#1e1e1e] text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-200'
                  }`}>
                    <button
                      onClick={() => { setActiveTab('studio'); setOpenNavGroup(null); playSfx('click'); }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                        activeTab === 'studio' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {renderAwardIcon('w-4 h-4 text-rose-500')}
                      <div>
                        <p className="font-bold">Studio Hợp Đồng</p>
                        <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Nhận đơn hàng thiết kế phòng NPC</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('room'); setOpenNavGroup(null); playSfx('click'); }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                        activeTab === 'room' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {renderHomeIcon('w-4 h-4 text-emerald-500')}
                      <div>
                        <p className="font-bold">{isVy ? 'Phòng Vy' : `Phòng ${user?.username || 'Của Bạn'}`}</p>
                        <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Trang trí phòng Pixel 2D cá nhân</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { setShowPetShopModal(true); setOpenNavGroup(null); playSfx('click'); }}
                      className="w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      {renderShoppingBagIcon('w-4 h-4 text-amber-500')}
                      <div>
                        <p className="font-bold">Cửa Hàng Pet & Nội Thất</p>
                        <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Mua thú cưng & đồ dùng Pixel</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* NÚT SỔ TAY CÁ NHÂN (NOTEBOOKS) ĐƯA RA NGOÀI ĐỘC LẬP */}
              <button
                type="button"
                onClick={() => { setShowNotebookModal(true); playSfx('click'); }}
                className="px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 border bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900/80 shadow-xs active:scale-95"
                title="Mở Sổ Tay Từ Vựng HSK Cá Nhân"
              >
                {renderBookIcon('w-4 h-4 text-emerald-600 dark:text-emerald-400')}
                <span>Sổ Tay Cá Nhân</span>
              </button>

              {/* NHÓM 3: CÁ NHÂN & QUÀ TẶNG */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenNavGroup(openNavGroup === 'personal' ? null : 'personal')}
                  className={`px-4 py-2 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 border ${
                    ['love', 'admin'].includes(activeTab)
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {renderVoucherIcon('w-4 h-4')}
                  <span>Cá Nhân & Quà</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${openNavGroup === 'personal' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openNavGroup === 'personal' && (
                  <div className={`absolute top-full left-0 mt-2 w-56 border rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150 ${
                    isDarkMode ? 'bg-[#1e1e1e] text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-200'
                  }`}>
                    <button
                      onClick={() => { setActiveTab('love'); setLoveSubTab('wallet'); setOpenNavGroup(null); playSfx('click'); }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                        activeTab === 'love' && loveSubTab !== 'chat' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {renderVoucherIcon('w-4 h-4 text-pink-500')}
                      <div>
                        <p className="font-bold">{isVy ? 'Thử Thách & Túi Đồ' : 'Túi Đồ Cá Nhân'}</p>
                        <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Quản lý vật phẩm & Voucher</p>
                      </div>
                    </button>

                    {ADMIN_EMAILS.includes(user.email.toLowerCase()) && (
                      <button
                        onClick={() => { setActiveTab('admin'); fetchAdminLogs(); setOpenNavGroup(null); playSfx('click'); }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                          activeTab === 'admin' ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {renderAIIcon('w-4 h-4 text-purple-500')}
                        <div>
                          <p className="font-bold">Bảng Admin</p>
                          <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Quản lý từ vựng & nhật ký</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </nav>

            {/* CHỈ SỐ THỐNG KÊ GỌN GÀNG (CHỈ HIỆN ICON + GIÁ TRỊ) & CÁC NÚT TÍNH NĂNG NÂNG CẤP */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-auto">
              {/* NÚT VÒNG QUAY MAY MẮN */}
              <button
                type="button"
                onClick={() => { setShowLuckyWheelModal(true); playSfx('click'); }}
                className="p-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-800 rounded-full text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition active:scale-95 shadow-xs"
                title="Vòng Quay May Mắn HSK (50 Xu)"
              >
                {renderTargetIcon('w-4 h-4 text-amber-600 dark:text-amber-400')}
              </button>

              {/* NÚT BẢNG XẾP HẠNG TOP HỌC VIÊN */}
              <button
                type="button"
                onClick={() => { setShowLeaderboardModal(true); playSfx('click'); }}
                className="p-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 border border-purple-300 dark:border-purple-800 rounded-full text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition active:scale-95 shadow-xs"
                title="Bảng Xếp Hạng Top Học Viên HSK"
              >
                {renderTrophyIcon('w-4 h-4 text-purple-600 dark:text-purple-400')}
              </button>

              {/* NÚT BÁO CÁO THỐNG KÊ TIẾN ĐỘ */}
              <button
                type="button"
                onClick={() => { setShowLearningStatsModal(true); playSfx('click'); }}
                className="p-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 border border-blue-300 dark:border-blue-800 rounded-full text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition active:scale-95 shadow-xs"
                title="Thống Kê Tiến Độ Học Tập HSK"
              >
                {renderChartBarIcon('w-4 h-4 text-blue-600 dark:text-blue-400')}
              </button>

              {/* BADGE XU */}
              <div className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2.5 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1 shadow-xs" title="Số Xu hiện có">
                {renderCoinIcon()}
                <span>{coins}</span>
              </div>

              {/* BADGE ĐIỂM */}
              <div className="bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-2.5 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1 shadow-xs" title="Tổng Điểm kinh nghiệm tích lũy">
                {renderAwardIcon('w-3.5 h-3.5 text-blue-600 dark:text-blue-400')}
                <span>{score}</span>
              </div>

              {/* BADGE STREAK */}
              <div
                onClick={() => {
                  setShowDailyAttendanceModal(true);
                  playSfx('click');
                }}
                className="bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800 px-2.5 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1 shadow-xs cursor-pointer transition active:scale-95"
                title="Bấm để mở Bảng Điểm Danh Streak Hàng Ngày"
              >
                {renderFlameIcon('w-3.5 h-3.5 text-rose-500')}
                <span>{streakData.streakCount}</span>
              </div>
            </div>
          </div>
        </header>

          {/* NỘI DUNG TABS CHÍNH */}
          <div className="transition-all">
            {/* TAB 1: STUDIO HỢP ĐỒNG THIẾT KẾ CỦA KHÁCH HÀNG (NPC) */}
            {activeTab === 'studio' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className={`lg:col-span-4 border rounded-2xl shadow-xs p-5 h-[460px] flex flex-col ${
                  isDarkMode ? 'bg-[#1e1e1e] text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-200'
                }`}>
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
                          <p className={`text-[10px] font-bold mt-0.5 ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-800'
                          }`}>Khách hàng: {contract.clientName}</p>
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
                    <div className={`border rounded-2xl shadow-xs p-6 space-y-5 ${
                      isDarkMode ? 'bg-[#1e1e1e] text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-3 border-b border-dashed border-slate-200 dark:border-slate-800 pb-3">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shrink-0">
                          {renderClientAvatar(currentContract.clientSprite)}
                        </div>
                        <div>
                          <h3 className={`text-base font-extrabold ${
                            isDarkMode ? 'text-slate-100' : 'text-slate-900'
                          }`}>Hợp đồng thiết kế từ: {currentContract.clientName}</h3>
                          <p className={`text-xs font-bold ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-800'
                          }`}>Cấp độ yêu cầu: HSK Cấp {currentContract.level}</p>
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <h4 className="text-lg font-bold text-rose-600 dark:text-rose-400">{currentContract.title}</h4>
                        <p className={`text-xs font-bold leading-relaxed ${
                          isDarkMode ? 'text-slate-200' : 'text-slate-900'
                        }`}>{currentContract.description}</p>
                      </div>

                      {/* KHU VỰC THƯ TỪ KHÁCH HÀNG BẰNG TIẾNG TRUNG */}
                      <div className={`p-4 border rounded-xl space-y-2 text-left ${
                        isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full font-black uppercase font-sans">
                            Yêu cầu từ khách hàng (Tiếng Trung):
                          </span>
                          <button
                            onClick={() => handlePlayTTS(currentContract.promptChinese)}
                            className="p-1 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer"
                          >
                            {renderAudioIcon('w-4 h-4 text-slate-700 dark:text-slate-200')}
                          </button>
                        </div>
                        <p className="text-base font-serif font-bold text-slate-900 dark:text-slate-100">{currentContract.promptChinese}</p>
                        <p className="text-xs font-bold text-blue-600 font-sans">{currentContract.promptPinyin}</p>
                        {showStudioHint ? (
                          <div className="pt-1.5 border-t border-dashed border-amber-300 flex justify-between items-start gap-4">
                            <p className={`text-xs font-bold ${
                              isDarkMode ? 'text-slate-300' : 'text-slate-800'
                            }`}>Dịch nghĩa: {currentContract.promptVietnamese}</p>
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
                        <h5 className={`text-xs font-black uppercase tracking-wider ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-900'
                        }`}>
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
                            <span className={`text-[11px] font-extrabold italic z-10 ${
                              isDarkMode ? 'text-slate-300' : 'text-slate-900'
                            }`}>Vy hãy nhấp chọn các đồ nội thất ở danh mục bên dưới!</span>
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
                        <h5 className={`text-xs font-black uppercase tracking-wider ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-900'
                        }`}>Danh mục đồ nội thất để Vy lựa chọn:</h5>
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
                        <div className={`text-xs font-black text-left ${
                          isDarkMode ? 'text-slate-200' : 'text-slate-900'
                        }`}>
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
                    <div className={`border border-dashed rounded-2xl p-12 text-center font-bold space-y-3 shadow-xs ${
                      isDarkMode ? 'bg-[#1e1e1e] text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300'
                    }`}>
                      <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        {renderClipboardIcon('w-6 h-6 text-rose-500')}
                      </div>
                      <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Vui lòng chọn một hợp đồng</p>
                      <p className={`text-xs max-w-sm mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
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
                userInventory={userInventory}
                setUserInventory={setUserInventory}
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
                isVy={isVy}
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
                initialTab={loveSubTab}
              />
            )}

            {/* TAB 5: TỪ ĐIỂN VẬT LIỆU HSK (MATERIALS DICTIONARY) */}
            {activeTab === 'library' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl p-6 space-y-6 shadow-xs">
                <h2 className="text-xl font-bold border-b border-dashed border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between text-slate-900 dark:text-slate-100">
                  <span>Từ Điển Vật Liệu & Ngữ Pháp HSK</span>
                </h2>

                {/* Sub-tab selection */}
                <div className="flex gap-3 mb-4 flex-wrap">
                  <button
                    onClick={() => { setLibrarySubTab('furniture'); playSfx('click'); }}
                    className={`px-4 py-2 border font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer ${
                      librarySubTab === 'furniture' ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Từ điển Nội Thất HSK
                  </button>
                  <button
                    onClick={() => { setLibrarySubTab('vocab'); playSfx('click'); }}
                    className={`px-4 py-2 border font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer ${
                      librarySubTab === 'vocab' ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Từ vựng HSK ({GENERAL_VOCAB_ITEMS.length + customVocabs.length})
                  </button>
                  <button
                    onClick={() => { setLibrarySubTab('grammar'); playSfx('click'); }}
                    className={`px-4 py-2 border font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer ${
                      librarySubTab === 'grammar' ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Sổ tay Ngữ pháp
                  </button>
                  <button
                    onClick={() => { setLibrarySubTab('bookmarked'); setBookmarkedIds(getBookmarkedIds()); playSfx('click'); }}
                    className={`px-4 py-2 border font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      librarySubTab === 'bookmarked' ? 'bg-amber-500 text-white border-amber-600' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                    }`}
                  >
                    {renderStarIcon(true, 'w-4 h-4 text-amber-400')}
                    Sổ Từ Khó Ôn Tập ({bookmarkedIds.length})
                  </button>
                  <button
                    onClick={() => { setShowNotebookModal(true); playSfx('click'); }}
                    className="px-4 py-2 border font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 flex items-center gap-1.5 hover:bg-rose-100"
                  >
                    {renderBookIcon('w-4 h-4 text-rose-500')}
                    Sổ Tay Cá Nhân (Notebooks)
                  </button>
                </div>

                {librarySubTab === 'furniture' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hskGroupedFurniture.map((item) => {
                      const isUnlocked = unlockedItems.includes(item.id);
                      
                      return (
                        <div
                          key={item.id}
                          className={`p-3 border rounded-xl flex items-center justify-between transition-all ${
                            isUnlocked 
                              ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-xs' 
                              : 'bg-slate-100/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-1 flex items-center justify-center shrink-0">
                              {renderFurnitureSVG(item.id, 0, 'w-10 h-10')}
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <span>{item.nameVietnamese}</span>
                                <span className="text-[9px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-1.5 py-0.2 rounded font-mono font-bold">
                                  HSK {item.hsk}
                                </span>
                              </h4>
                              <p className="text-sm font-bold text-rose-600 dark:text-rose-400 font-serif flex items-center gap-1.5">
                                <span>{item.nameChinese}</span>
                                <button
                                  onClick={() => handlePlayTTS(item.nameChinese)}
                                  className="p-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 border border-slate-300 dark:border-slate-700 rounded cursor-pointer"
                                >
                                  {renderAudioIcon('w-3 h-3 text-slate-700 dark:text-slate-300')}
                                </button>
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold font-mono">{item.namePinyin}</p>
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {librarySubTab === 'bookmarked' && (() => {
                  const allVocabs = [...GENERAL_VOCAB_ITEMS, ...customVocabs];
                  const bookmarkedList = allVocabs.filter((v) => bookmarkedIds.includes(v.id));

                  if (bookmarkedList.length === 0) {
                    return (
                      <div className="py-12 text-center bg-amber-50/50 dark:bg-amber-950/20 border-2 border-dashed border-amber-300 dark:border-amber-800 rounded-2xl space-y-2">
                        {renderStarIcon(true, 'w-8 h-8 text-amber-400 mx-auto')}
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Sổ từ khó của bạn đang trống</p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Khi làm Quiz hoặc lật Flashcards, hãy bấm biểu tượng Ngôi sao để lưu lại các từ cần luyện tập thêm nhé!
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-950/50 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                          Bạn đã lưu <span className="font-black text-amber-600 dark:text-amber-400">{bookmarkedList.length}</span> từ vựng khó cần ôn tập
                        </span>
                        <button
                          onClick={() => {
                            setActiveTab('flashcards' as any);
                            playSfx('click');
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer transition-all active:scale-95"
                        >
                          Ôn Tập Bằng Flashcard
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bookmarkedList.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-xs space-y-2.5 flex flex-col justify-between"
                          >
                            <div className="space-y-1 text-left">
                              <div className="flex justify-between items-center border-b border-dashed border-slate-200 dark:border-slate-700 pb-2">
                                <h4 className="text-base font-serif font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                                  <span>{item.nameChinese}</span>
                                  <button
                                    onClick={() => handlePlayTTS(item.nameChinese)}
                                    className="p-0.5 bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 border border-slate-300 dark:border-slate-600 rounded cursor-pointer"
                                  >
                                    {renderAudioIcon('w-3.5 h-3.5 text-slate-800 dark:text-slate-200')}
                                  </button>
                                </h4>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-1.5 py-0.2 rounded font-sans font-bold">
                                    HSK {item.hskLevel}
                                  </span>
                                  <button
                                    onClick={() => {
                                      const res = toggleBookmark(item.id);
                                      setBookmarkedIds(res.allIds);
                                      playSfx('click');
                                    }}
                                    className="text-amber-500 hover:text-amber-600 p-0.5 cursor-pointer"
                                    title="Bỏ lưu từ khó"
                                  >
                                    {renderStarIcon(true, 'w-4 h-4')}
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold font-mono">{item.namePinyin}</p>
                              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Nghĩa: {item.nameVietnamese}</p>
                            </div>

                            <button
                              onClick={() => setSelectedVoiceWord({ wordChinese: item.nameChinese, wordPinyin: item.namePinyin, wordVietnamese: item.nameVietnamese })}
                              className="w-full py-1.5 bg-pink-100 dark:bg-pink-950/60 hover:bg-pink-200 text-pink-900 dark:text-pink-300 border border-pink-300 dark:border-pink-800 text-[10px] font-bold uppercase rounded-lg cursor-pointer flex items-center justify-center gap-1 shadow-xs transition"
                            >
                              Luyện Phát Âm AI
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === 'admin' && ADMIN_EMAILS.includes(user.email.toLowerCase()) && (
              <div className={`border rounded-2xl p-6 space-y-6 shadow-xs ${
                isDarkMode ? 'bg-[#1e1e1e] text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-200'
              }`}>
                <h2 className="text-xl font-bold border-b border-dashed border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-center text-slate-900 dark:text-slate-100">
                  <span>Bảng Điều Khiển Admin (Khang & Vy)</span>
                  <button
                    onClick={fetchAdminLogs}
                    className="px-3 py-1 bg-white hover:bg-gray-100 border border-[#1f2937] rounded-lg text-xs font-black cursor-pointer transition-all text-slate-900"
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
                  <div className={`border-t border-dashed pt-6 space-y-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-300'}`}>
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                      {renderAIIcon('w-6 h-6 text-blue-600 dark:text-blue-400')} Trợ Lý AI: Bot Tạo & Crawl Từ Vựng HSK (Admin Khang)
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* CỘT TRÁI: FORM CRAWL/GENERATE */}
                      <div className={`lg:col-span-6 border p-5 rounded-2xl shadow-xs space-y-4 ${
                        isDarkMode ? 'bg-[#1e1e1e] text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-200'
                      }`}>
                        <h4 className="text-sm font-bold flex items-center gap-1.5">
                          {renderAIIcon('w-4 h-4 text-amber-500')} Nhập chủ đề hoặc danh sách chữ Hán cần tạo
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Nhập chữ Hán (ví dụ: 苹果, 香蕉) hoặc chủ đề (ví dụ: Màu sắc, Thời tiết, Đồ ăn) để Bot AI tự động tìm Pinyin, nghĩa Việt và tạo câu ví dụ cho Vy.
                        </p>

                        <div className="space-y-3">
                          <div className={`p-3 border rounded-xl text-xs ${isDarkMode ? 'bg-pink-950/40 border-pink-900/60 text-pink-200' : 'bg-pink-50 border-pink-200 text-pink-900'}`}>
                            <b>Tự động cân bằng HSK 1-2-3 (Giống IELTS):</b> Bot AI sẽ tự động tạo bộ 9 từ vựng thuộc chủ đề được chọn (cân bằng 3 từ HSK 1, 3 từ HSK 2 và 3 từ HSK 3).
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>Chọn nhóm cấp độ HSK bơm từ:</label>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <button
                                type="button"
                                onClick={() => setVocabHskGroup('hsk123')}
                                className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                  vocabHskGroup === 'hsk123'
                                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <span>Nhóm HSK 1 - 2 - 3 (Cơ Bản)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setVocabHskGroup('hsk456')}
                                className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                  vocabHskGroup === 'hsk456'
                                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <span>Nhóm HSK 4 - 5 - 6 (Nâng Cao)</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>Chủ đề từ vựng cần tạo:</label>
                            <select
                              value={vocabTheme}
                              onChange={(e) => setVocabTheme(e.target.value)}
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

      {/* POPUP DRAWER "HỌC" (STUDY) - TRƯỢT TỪ DƯỚI LÊN */}
      {isMobileStudyOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileStudyOpen(false)} />
          {/* Drawer */}
          <div className={`absolute bottom-0 left-0 right-0 rounded-t-3xl border-t-[3px] border-[var(--line)] p-5 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] space-y-3 animate-in slide-in-from-bottom duration-200 ${
            isDarkMode ? 'bg-[#1e1e1e] text-slate-100' : 'bg-[#fffaf0] text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black uppercase tracking-wider">Học Tập HSK</h3>
              <button
                onClick={() => setIsMobileStudyOpen(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm cursor-pointer transition ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                }`}
              >
                X
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* QUIZ */}
              <button
                onClick={() => { setActiveTab('quiz'); setIsMobileStudyOpen(false); playSfx('click'); if (navigator.vibrate) navigator.vibrate(15); }}
                className={`p-4 border-2 border-[var(--line)] rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                  activeTab === 'quiz'
                    ? 'bg-blue-100 dark:bg-blue-950/50 shadow-[3px_3px_0_var(--line)]'
                    : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 shadow-[3px_3px_0_var(--line)]' : 'bg-white hover:bg-rose-50 shadow-[3px_3px_0_var(--line)]'
                }`}
              >
                {renderBookIcon('w-6 h-6 text-blue-500')}
                <span className="text-[10px] font-black">Quiz Bản Vẽ</span>
              </button>

              {/* FLASHCARDS */}
              <button
                onClick={() => { setActiveTab('flashcards' as any); setIsMobileStudyOpen(false); playSfx('click'); if (navigator.vibrate) navigator.vibrate(15); }}
                className={`p-4 border-2 border-[var(--line)] rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                  activeTab === ('flashcards' as any)
                    ? 'bg-amber-100 dark:bg-amber-950/50 shadow-[3px_3px_0_var(--line)]'
                    : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 shadow-[3px_3px_0_var(--line)]' : 'bg-white hover:bg-rose-50 shadow-[3px_3px_0_var(--line)]'
                }`}
              >
                {renderBookIcon('w-6 h-6 text-amber-500')}
                <span className="text-[10px] font-black">Flashcards 3D</span>
              </button>

              {/* THƯ VIỆN TỪ ĐIỂN */}
              <button
                onClick={() => { setActiveTab('library'); setIsMobileStudyOpen(false); playSfx('click'); if (navigator.vibrate) navigator.vibrate(15); }}
                className={`p-4 border-2 border-[var(--line)] rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 col-span-2 ${
                  activeTab === 'library'
                    ? 'bg-purple-100 dark:bg-purple-950/50 shadow-[3px_3px_0_var(--line)]'
                    : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 shadow-[3px_3px_0_var(--line)]' : 'bg-white hover:bg-rose-50 shadow-[3px_3px_0_var(--line)]'
                }`}
              >
                {renderBookIcon('w-6 h-6 text-purple-500')}
                <span className="text-[10px] font-black">Thư Viện HSK</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP DRAWER "THÊM" (MORE) - TRƯỢT TỪ DƯỚI LÊN KIEU IELTS VOCAB */}
      {isMobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileMoreOpen(false)} />
          {/* Drawer */}
          <div className={`absolute bottom-0 left-0 right-0 rounded-t-3xl border-t-[3px] border-[var(--line)] p-5 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] space-y-3 animate-in slide-in-from-bottom duration-200 ${
            isDarkMode ? 'bg-[#1e1e1e] text-slate-100' : 'bg-[#fffaf0]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black uppercase tracking-wider">Tiện Ích Khác</h3>
              <button
                onClick={() => setIsMobileMoreOpen(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm cursor-pointer transition ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                }`}
              >
                X
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* CỬA HÀNG SHOP */}
              <button
                onClick={() => { setShowPetShopModal(true); setIsMobileMoreOpen(false); playSfx('click'); if (navigator.vibrate) navigator.vibrate(15); }}
                className={`p-4 border-2 border-[var(--line)] rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 shadow-[3px_3px_0_var(--line)]' : 'bg-white hover:bg-rose-50 shadow-[3px_3px_0_var(--line)]'
                }`}
              >
                {renderShoppingBagIcon('w-6 h-6 text-amber-500')}
                <span className="text-[10px] font-black">Shop & Nội Thất</span>
              </button>

              {/* VOUCHER */}
              <button
                onClick={() => { setActiveTab('love'); setLoveSubTab(isVy ? 'contracts' : 'wallet'); setIsMobileMoreOpen(false); playSfx('click'); if (navigator.vibrate) navigator.vibrate(15); }}
                className={`p-4 border-2 border-[var(--line)] rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                  activeTab === 'love' && loveSubTab !== 'chat'
                    ? 'bg-purple-100 dark:bg-purple-950/50 shadow-[3px_3px_0_var(--line)]'
                    : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 shadow-[3px_3px_0_var(--line)]' : 'bg-white hover:bg-rose-50 shadow-[3px_3px_0_var(--line)]'
                }`}
              >
                {renderVoucherIcon('w-6 h-6 text-purple-500')}
                <span className="text-[10px] font-black">{isVy ? 'Túi Đồ Vy' : 'Túi Đồ Cá Nhân'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THANH ĐIỀU HƯỚNG MOBILE KÍN KHÍT 100% CHUẨN IELTS VOCAB (ZERO GAP BOTTOM BAR) */}
      {user && (
        <div className={`md:hidden fixed bottom-0 left-0 right-0 z-[45] border-t-[3px] border-[var(--line)] shadow-[0_-6px_20px_rgba(0,0,0,0.15)] pb-[env(safe-area-inset-bottom,16px)] ${
          isDarkMode ? 'bg-[#1e1e1e] text-slate-100' : 'bg-[#fffaf0] text-slate-900'
        }`}>
          <nav className="flex items-center justify-around h-16">
            {/* TAB 1: STUDIO */}
            <button
              onClick={() => {
                setActiveTab('studio');
                playSfx('click');
                if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all cursor-pointer ${
                activeTab === 'studio' ? 'text-rose-500 font-extrabold scale-105' : isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              <div className={activeTab === 'studio' ? 'text-rose-500 scale-110 transition-transform' : 'text-current'}>
                {renderAwardIcon('w-5 h-5')}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${activeTab === 'studio' ? 'text-rose-500' : 'text-current'}`}>
                Studio
              </span>
            </button>

            {/* TAB 2: HỌC */}
            <button
              onClick={() => {
                setIsMobileStudyOpen(true);
                playSfx('click');
                if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all cursor-pointer ${
                ['quiz', 'flashcards', 'library'].includes(activeTab as string) || isMobileStudyOpen
                  ? 'text-blue-500 font-extrabold scale-105'
                  : isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              <div className={['quiz', 'flashcards', 'library'].includes(activeTab as string) || isMobileStudyOpen ? 'text-blue-500 scale-110 transition-transform' : 'text-current'}>
                {renderBookIcon('w-5 h-5')}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                ['quiz', 'flashcards', 'library'].includes(activeTab as string) || isMobileStudyOpen ? 'text-blue-500' : 'text-current'
              }`}>
                Học
              </span>
            </button>

            {/* TAB 3: PHÒNG */}
            <button
              onClick={() => {
                setActiveTab('room');
                playSfx('click');
                if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all cursor-pointer ${
                activeTab === 'room' ? 'text-emerald-500 font-extrabold scale-105' : isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              <div className={activeTab === 'room' ? 'text-emerald-500 scale-110 transition-transform' : 'text-current'}>
                {renderHomeIcon('w-5 h-5')}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${activeTab === 'room' ? 'text-emerald-500' : 'text-current'}`}>
                Phòng
              </span>
            </button>

            {/* TAB 4: SHOP */}
            <button
              onClick={() => {
                setShowPetShopModal(true);
                playSfx('click');
                if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all cursor-pointer ${
                showPetShopModal ? 'text-amber-500 font-extrabold scale-105' : isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              <div className={showPetShopModal ? 'text-amber-500 scale-110 transition-transform' : 'text-current'}>
                {renderShoppingBagIcon('w-5 h-5 text-amber-500')}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${showPetShopModal ? 'text-amber-500' : 'text-current'}`}>
                Shop
              </span>
            </button>

            {/* TAB 5: THÊM */}
            <button
              onClick={() => {
                setIsMobileMoreOpen(true);
                playSfx('click');
                if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all cursor-pointer relative ${
                isMobileMoreOpen || (activeTab === 'love')
                  ? 'text-purple-500 font-extrabold scale-105'
                  : isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              <div className={isMobileMoreOpen || (activeTab === 'love') ? 'text-purple-500 scale-110 transition-transform' : 'text-current'}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                isMobileMoreOpen || (activeTab === 'love') ? 'text-purple-500' : 'text-current'
              }`}>
                Thêm
              </span>
            </button>
          </nav>

          {/* SOLID SAFE AREA FILLER TO ELIMINATE SAFARI BOTTOM GAP 100% */}
          <div className={`w-full h-[env(safe-area-inset-bottom,32px)] min-h-[32px] ${
            isDarkMode ? 'bg-[#1e1e1e]' : 'bg-[#fffaf0]'
          }`} />
          {/* SOLID WALL BACKDROP EXTENDING 160PX BELOW THE VIEWPORT */}
          <div className={`absolute top-full left-0 right-0 h-40 pointer-events-none ${
            isDarkMode ? 'bg-[#1e1e1e]' : 'bg-[#fffaf0]'
          }`} />
        </div>
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

      {/* BONG BÓNG CHAT AI NỔI Ở GÓC MÀN HÌNH (FLOATING AI CHAT WIDGET) */}
      {user && (
        <AIChatBubbleModal
          user={user}
          isVy={isVy}
          onPlayTTS={handlePlayTTS}
          playSfx={playSfx}
          isDarkMode={isDarkMode}
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

      {/* SỔ TAY TỪ VỰNG HSK CÁ NHÂN MODAL */}
      <NotebookModal
        isOpen={showNotebookModal}
        onClose={() => setShowNotebookModal(false)}
        playSfx={playSfx}
        onPlayAudio={handlePlayTTS}
        onSelectNotebookToStudy={(wordIds, notebookName) => {
          setShowNotebookModal(false);
          setActiveTab('flashcards' as any);
        }}
      />

      {/* POPUP BẢNG ĐIỂM DÀNH HÀNG NGÀY / STREAK MODAL */}
      <DailyAttendanceModal
        isOpen={showDailyAttendanceModal}
        onClose={() => setShowDailyAttendanceModal(false)}
        streakCount={streakData.streakCount}
        claimedToday={streakData.claimedToday}
        onClaimAttendance={handleClaimDailyAttendance}
        isDarkMode={isDarkMode}
      />

      {/* POPUP VÒNG QUAY MAY MẮN HSK */}
      <LuckyWheelModal
        isOpen={showLuckyWheelModal}
        onClose={() => setShowLuckyWheelModal(false)}
        coins={coins}
        setCoins={setCoins}
        playSfx={playSfx}
        isDarkMode={isDarkMode}
      />

      {/* POPUP BẢNG XẾP HẠNG TOP HỌC VIÊN */}
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        userScore={score}
        userStreak={streakData.streakCount}
        username={user?.username || 'Chủ Tiệm HSK'}
        isDarkMode={isDarkMode}
      />

      {/* POPUP BÁO CÁO THỐNG KÊ TIẾN ĐỘ HỌC TẬP */}
      <LearningStatsModal
        isOpen={showLearningStatsModal}
        onClose={() => setShowLearningStatsModal(false)}
        userScore={score}
        streakCount={streakData.streakCount}
        unlockedItems={unlockedItems}
        isDarkMode={isDarkMode}
      />

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

function renderTargetIcon(className = 'w-4 h-4 text-amber-500') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function renderTrophyIcon(className = 'w-4 h-4 text-purple-500') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M5 3v5a4 4 0 004 4h6a4 4 0 004-4V3M5 3H3v3a3 3 0 003 3h1m12-6h2a3 3 0 013 3v0a3 3 0 01-3 3h-1M9 12v3a3 3 0 003 3h0a3 3 0 003-3v-3M12 18v3m-3 0h6" />
    </svg>
  );
}

function renderChartBarIcon(className = 'w-4 h-4 text-blue-500') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
