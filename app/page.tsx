'use client';

import { useState, useEffect, useRef } from 'react';
import { FURNITURE_ITEMS, MATERIAL_ITEMS, DESIGN_CONTRACTS, FurnitureItem, MaterialItem, DesignContract, HSK_GRAMMAR_RULES, GENERAL_VOCAB_ITEMS } from '../data/vocabulary';
import RoomEditor, { renderFurnitureSVG } from '../components/RoomEditor';
import BlueprintQuiz from '../components/BlueprintQuiz';
import LoveInbox from '../components/LoveInbox';

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

  // Library subtab state
  const [librarySubTab, setLibrarySubTab] = useState<'furniture' | 'vocab' | 'grammar'>('furniture');

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
  const [vocabQuery, setVocabQuery] = useState('');
  const [vocabHskLevel, setVocabHskLevel] = useState<number>(1);
  const [generatedVocab, setGeneratedVocab] = useState<any[]>([]);
  const [vocabBotLoading, setVocabBotLoading] = useState(false);
  const [vocabBotMsg, setVocabBotMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCustomVocabs = async () => {
    try {
      const res = await fetch('/api/vocab/list');
      const data = await res.json();
      if (data.success) {
        setCustomVocabs(data.list || []);
      }
    } catch (e) {
      console.error("Failed to fetch custom vocabs", e);
    }
  };

  const handleGenerateVocab = async () => {
    if (!vocabQuery.trim()) {
      setVocabBotMsg({ type: 'error', text: 'Vui lòng nhập từ khóa hoặc danh sách từ.' });
      return;
    }
    setVocabBotLoading(true);
    setVocabBotMsg(null);
    try {
      const res = await fetch('/api/admin/vocab/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: vocabQuery, hskLevel: vocabHskLevel })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedVocab(data.vocabList.map((item: any) => ({ ...item, selected: true })));
      } else {
        setVocabBotMsg({ type: 'error', text: data.error || 'Lỗi khi tạo từ vựng.' });
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
        setVocabQuery('');
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

  // Sound effects synthesizer
  const playSfx = (type: 'click' | 'success' | 'error' | 'perfect' | 'levelUp' | 'flip') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playTone = (freq: number, start: number, duration: number, vol = 0.08, wave: OscillatorType = 'sine') => {
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
      if (savedCompleted) {
        try {
          setCompletedContracts(JSON.parse(savedCompleted));
        } catch (e) {}
      }
    }
  }, [user]);

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
      const newScore = score + contract.rewardScore;
      const newCoins = coins + contract.rewardCoins;
      
      setScore(newScore);
      setCoins(newCoins);
      playSfx('success');

      // Tự động lưu vào completed list
      const newCompleted = [...completedContracts, contract.id];
      saveCompletedContracts(newCompleted);

      // Tự động mở khóa voucher thưởng nếu có
      let nextVoucher = null;
      if (contract.voucherReward) {
        nextVoucher = {
          title: contract.voucherReward.title,
          description: contract.voucherReward.description,
          code: contract.voucherReward.code
        };
        playSfx('levelUp');
      }

      saveProgress(newScore, newCoins, level, nextVoucher);

      setContractSubmitMsg({
        type: 'success',
        text: `Tuyệt vời! Bản vẽ phòng của bạn đã chính xác và làm hài lòng khách hàng ${contract.clientName}! Bạn nhận được +${contract.rewardCoins} Xu, +${contract.rewardScore} Điểm!`
      });
      setContractSelectedItems([]);
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
    <main className="min-h-screen bg-[#fff0f3] text-[#1f2937] font-sans antialiased p-4">
      {/* 1. MÀN HÌNH ĐĂNG NHẬP / ĐĂNG KÝ */}
      {!user ? (
        <div className="max-w-md mx-auto my-16 bg-[#fffaf0] border-4 border-[#1f2937] rounded-3xl shadow-[4px_4px_0px_#1f2937] overflow-hidden p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-rose-100 border-4 border-[#1f2937] rounded-2xl mx-auto flex items-center justify-center text-rose-500">
              {renderPaletteIcon('w-10 h-10')}
            </div>
            <h1 className="text-2xl font-serif font-black text-[#1f2937] mt-3">Tiệm Thiết Kế Của Vy</h1>
            <p className="text-xs text-gray-500 font-bold mt-1">
              {authMode === 'login' ? 'Đăng nhập để vào thế giới thiết kế nội thất HSK' : 'Tạo tài khoản học tiếng Trung cùng Vy'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-gray-600 mb-1">Tên tài khoản:</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full p-2.5 border-2 border-[#1f2937] bg-white rounded-lg focus:outline-none text-sm font-bold shadow-[2px_2px_0px_#1f2937]"
                placeholder="Nhập username..."
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-black uppercase text-gray-600 mb-1">Địa chỉ Email:</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full p-2.5 border-2 border-[#1f2937] bg-white rounded-lg focus:outline-none text-sm font-bold shadow-[2px_2px_0px_#1f2937]"
                  placeholder="Nhập email..."
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase text-gray-600 mb-1">Mật khẩu:</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-2.5 border-2 border-[#1f2937] bg-white rounded-lg focus:outline-none text-sm font-bold shadow-[2px_2px_0px_#1f2937]"
                placeholder="Nhập mật khẩu..."
              />
            </div>

            {authError && (
              <p className="text-xs text-red-500 font-bold text-center bg-red-50 border border-red-200 p-2 rounded-lg">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-200 disabled:text-gray-400 text-white border-2 border-[#1f2937] rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              {authLoading ? 'Đang Xử Lý...' : authMode === 'login' ? 'Vào Atelier' : 'Đăng Ký Tài Khoản'}
            </button>
          </form>

          {/* GOOGLE LOGIN BUTTON */}
          <div className="mt-3">
            <a
              href="/api/auth/google/start"
              onClick={() => playSfx('click')}
              className="w-full py-3 bg-white hover:bg-gray-50 text-[#1f2937] border-2 border-[#1f2937] rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Đăng nhập bằng Google
            </a>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-dashed border-gray-300">
            <button
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setAuthError('');
                playSfx('click');
              }}
              className="text-xs font-black text-rose-600 hover:underline cursor-pointer"
            >
              {authMode === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </div>
      ) : (
        /* 2. GIAO DIỆN GAME CHÍNH SAU KHI LOGIN */
        <div className="max-w-6xl mx-auto space-y-6">
          {/* HEADER TRANG CHỦ */}
          <header className="bg-[#fffaf0] border-4 border-[#1f2937] rounded-2xl shadow-[4px_4px_0px_#1f2937] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-100 border-2 border-[#1f2937] rounded-full overflow-hidden flex items-center justify-center text-rose-500 shrink-0">
                {user.email?.toLowerCase() === LOVE_EMAIL ? (
                  renderClientAvatar('lan_vy', 'w-10 h-10')
                ) : user.email?.toLowerCase() === 'ungnhutkhang53@gmail.com' ? (
                  renderClientAvatar('khang', 'w-10 h-10')
                ) : (
                  renderPaletteIcon('w-7 h-7')
                )}
              </div>
              <div>
                <h1 className="text-lg font-serif font-black text-[#1f2937] flex items-center gap-2">
                  Atelier Thiết Kế HSK
                  {user.email?.toLowerCase() === LOVE_EMAIL && (
                    <span className="text-[10px] bg-rose-100 text-rose-700 border border-rose-300 px-2 py-0.5 rounded-full font-sans uppercase font-black tracking-wider flex items-center gap-1">
                      {renderHeartIcon('w-3 h-3 text-rose-500 fill-current')} Vy Của Khang
                    </span>
                  )}
                  {user.email?.toLowerCase() === 'ungnhutkhang53@gmail.com' && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 border border-blue-300 px-2 py-0.5 rounded-full font-sans uppercase font-black tracking-wider flex items-center gap-1">
                      Khang Của Vy
                    </span>
                  )}
                </h1>
                <p className="text-xs text-gray-500 font-bold">
                  {user.email?.toLowerCase() === LOVE_EMAIL ? (
                    <>Bà chủ: <span className="text-rose-600">Lan Vy</span></>
                  ) : user.email?.toLowerCase() === 'ungnhutkhang53@gmail.com' ? (
                    <>Ông chủ: <span className="text-blue-600">Nhựt Khang</span></>
                  ) : (
                    <>Chủ tiệm: <span className="text-rose-600">{user.username}</span></>
                  )}{' '}
                  // Chào mừng trở lại!
                </p>
              </div>
            </div>

            {/* Chỉ số tài khoản */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-black font-mono flex items-center">
                {renderCoinIcon()} Xu: {coins}
              </div>
              <div className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1.5 rounded-lg text-xs font-black font-mono flex items-center">
                {renderAwardIcon('w-4 h-4 text-blue-600 inline mr-1')} Điểm: {score}
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border-2 border-[#1f2937] text-xs font-black rounded-lg shadow-[2px_2px_0px_#1f2937] flex items-center gap-1.5 cursor-pointer"
              >
                {renderSignoutIcon()} Đăng Xuất
              </button>
            </div>
          </header>

          {/* THANH ĐIỀU HƯỚNG TABS CHÍNH */}
          <nav className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setActiveTab('studio');
                playSfx('click');
              }}
              className={`px-4 py-2 border-2 border-[#1f2937] font-serif font-black text-xs uppercase rounded-lg shadow-[2px_2px_0px_#1f2937] cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 ${
                activeTab === 'studio' ? 'bg-pink-500 text-white shadow-none translate-y-0.5' : 'bg-white text-[#1f2937]'
              }`}
            >
              {renderAwardIcon()} Hợp Đồng Thiết Kế
            </button>
            <button
              onClick={() => {
                setActiveTab('quiz');
                playSfx('click');
              }}
              className={`px-4 py-2 border-2 border-[#1f2937] font-serif font-black text-xs uppercase rounded-lg shadow-[2px_2px_0px_#1f2937] cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 ${
                activeTab === 'quiz' ? 'bg-pink-500 text-white shadow-none translate-y-0.5' : 'bg-white text-[#1f2937]'
              }`}
            >
              {renderBookIcon()} Bản Vẽ HSK
            </button>
            <button
              onClick={() => {
                setActiveTab('room');
                playSfx('click');
              }}
              className={`px-4 py-2 border-2 border-[#1f2937] font-serif font-black text-xs uppercase rounded-lg shadow-[2px_2px_0px_#1f2937] cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 ${
                activeTab === 'room' ? 'bg-pink-500 text-white shadow-none translate-y-0.5' : 'bg-white text-[#1f2937]'
              }`}
            >
              {renderHomeIcon()} Phòng Của Vy
            </button>
            <button
              onClick={() => {
                setActiveTab('love');
                playSfx('click');
              }}
              className={`px-4 py-2 border-2 border-[#1f2937] font-serif font-black text-xs uppercase rounded-lg shadow-[2px_2px_0px_#1f2937] cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 ${
                activeTab === 'love' ? 'bg-pink-500 text-white shadow-none translate-y-0.5' : 'bg-white text-[#1f2937]'
              }`}
            >
              {renderMailIcon()} Hòm Thư Tình Yêu
            </button>
            <button
              onClick={() => {
                setActiveTab('library');
                playSfx('click');
              }}
              className={`px-4 py-2 border-2 border-[#1f2937] font-serif font-black text-xs uppercase rounded-lg shadow-[2px_2px_0px_#1f2937] cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 ${
                activeTab === 'library' ? 'bg-pink-500 text-white shadow-none translate-y-0.5' : 'bg-white text-[#1f2937]'
              }`}
            >
              {renderBookIcon()} Từ điển & Ngữ pháp
            </button>
            {ADMIN_EMAILS.includes(user.email.toLowerCase()) && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  fetchAdminLogs();
                  playSfx('click');
                }}
                className={`px-4 py-2 border-2 border-[#1f2937] font-serif font-black text-xs uppercase rounded-lg shadow-[2px_2px_0px_#1f2937] cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin' ? 'bg-purple-600 text-white shadow-none translate-y-0.5' : 'bg-white text-[#1f2937]'
                }`}
              >
                {renderAIIcon()} Điều Khiển Admin
              </button>
            )}
          </nav>

          {/* NỘI DUNG TABS CHÍNH */}
          <div className="transition-all">
            {/* TAB 1: STUDIO HỢP ĐỒNG THIẾT KẾ CỦA KHÁCH HÀNG (NPC) */}
            {activeTab === 'studio' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-[#fffaf0] border-4 border-[#1f2937] rounded-2xl shadow-[4px_4px_0px_#1f2937] p-5 h-[460px] flex flex-col">
                  <h2 className="text-base font-serif font-black text-[#1f2937] border-b-2 border-dashed border-[#1f2937] pb-3 mb-3 flex items-center">
                    {renderClipboardIcon()} Danh Sách Hợp Đồng
                  </h2>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {DESIGN_CONTRACTS.filter(c => !c.isLoveContract).map((contract) => (
                      <div
                        key={contract.id}
                        onClick={() => {
                          setCurrentContract(contract);
                          setContractSubmitMsg(null);
                          setContractSelectedItems([]);
                          playSfx('click');
                        }}
                        className={`p-3 border-2 border-[#1f2937] rounded-xl flex items-center gap-3 cursor-pointer transition-all relative ${
                          currentContract?.id === contract.id
                            ? 'bg-rose-100 shadow-none translate-y-0.5'
                            : 'bg-white shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1f2937]'
                        }`}
                      >
                        <div className="shrink-0 bg-[#fffaf0] border-2 border-[#1f2937] w-12 h-12 rounded-xl flex items-center justify-center">
                          {renderClientAvatar(contract.clientSprite)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-serif font-black text-[#1f2937] truncate">{contract.title}</h3>
                          <p className="text-[10px] text-gray-500 font-bold mt-0.5">Khách hàng: {contract.clientName}</p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-black font-sans">
                              HSK Cấp {contract.level}
                            </span>
                            {completedContracts.includes(contract.id) && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-black font-sans">
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
                    <div className="bg-[#fffaf0] border-4 border-[#1f2937] rounded-2xl shadow-[4px_4px_0px_#1f2937] p-6 space-y-5">
                      <div className="flex items-center gap-3 border-b-2 border-dashed border-[#1f2937] pb-3">
                        <div className="w-12 h-12 bg-white border-2 border-[#1f2937] rounded-xl flex items-center justify-center shrink-0">
                          {renderClientAvatar(currentContract.clientSprite)}
                        </div>
                        <div>
                          <h3 className="text-base font-serif font-black text-[#1f2937]">Hợp đồng thiết kế từ: {currentContract.clientName}</h3>
                          <p className="text-xs text-gray-500 font-bold">Cấp độ yêu cầu: HSK Cấp {currentContract.level}</p>
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <h4 className="text-lg font-serif font-black text-rose-500">{currentContract.title}</h4>
                        <p className="text-xs text-gray-600 font-bold leading-relaxed">{currentContract.description}</p>
                      </div>

                      {/* KHU VỰC THƯ TỪ KHÁCH HÀNG BẰNG TIẾNG TRUNG */}
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-left">
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
                        <p className="text-xs font-bold text-gray-500">Dịch nghĩa: {currentContract.promptVietnamese}</p>
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
                          Phần thưởng: <span className="text-amber-600">{currentContract.rewardCoins} Xu</span> // <span className="text-blue-600">{currentContract.rewardScore} Điểm</span>
                        </div>
                        {!completedContracts.includes(currentContract.id) && (
                          <button
                            onClick={() => handleSubmitContract(currentContract)}
                            className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                          >
                            Nộp Bản Thiết Kế
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
                    <div className="bg-[#fffaf0] border-4 border-dashed border-[#1f2937] rounded-2xl p-16 text-center text-gray-400 font-bold">
                      Chọn một hợp đồng từ bảng danh sách bên trái để xem yêu cầu thiết kế của khách hàng.
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
              />
            )}

            {/* TAB 4: HÒM THƯ TÌNH YÊU (LOVE INBOX) */}
            {activeTab === 'love' && (
              <LoveInbox
                placedItems={placedItems}
                unlockedVouchers={unlockedVouchers}
                onUnlockVoucher={handleUnlockLoveVoucher}
                playSfx={playSfx}
              />
            )}

            {/* TAB 5: TỪ ĐIỂN VẬT LIỆU HSK (MATERIALS DICTIONARY) */}
            {activeTab === 'library' && (
              <div className="bg-[#fff5f6] border-4 border-[#1f2937] rounded-2xl shadow-[4px_4px_0px_#1f2937] p-6 space-y-6">
                <h2 className="text-xl font-serif font-black text-[#1f2937] border-b-2 border-dashed border-[#1f2937] pb-3 flex items-center justify-between">
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
                              onClick={() => handleExplainWord(item.nameChinese)}
                              className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-[#1f2937] text-[9.5px] font-black uppercase rounded cursor-pointer flex items-center gap-1 shadow-[1px_1px_0px_#1f2937]"
                            >
                              {renderAIIcon('w-3 h-3 text-blue-800')} Hỏi AI Mỏ Hỗn (BETA)
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {librarySubTab === 'vocab' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...GENERAL_VOCAB_ITEMS, ...customVocabs].map((item, idx) => {
                      return (
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
                              onClick={() => handleExplainWord(item.nameChinese)}
                              className="w-full py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-[#1f2937] text-[9.5px] font-black uppercase rounded cursor-pointer flex items-center justify-center gap-1 shadow-[1px_1px_0px_#1f2937]"
                            >
                              {renderAIIcon('w-3 h-3 text-blue-800')} Hỏi AI Mỏ Hỗn (BETA)
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
                      );
                    })}
                  </div>
                )}

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
              <div className="bg-[#fffaf0] border-4 border-[#1f2937] rounded-2xl shadow-[4px_4px_0px_#1f2937] p-6 space-y-6">
                <h2 className="text-xl font-serif font-black text-[#1f2937] border-b-2 border-dashed border-[#1f2937] pb-3 flex justify-between items-center">
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
                  <div className="border-t-2 border-dashed border-[#1f2937] pt-6 space-y-6">
                    <h3 className="text-lg font-serif font-black text-[#1f2937] flex items-center gap-2">
                      {renderAIIcon('w-6 h-6 text-blue-600')} Trợ Lý AI: Bot Tạo & Crawl Từ Vựng HSK (Admin Khang)
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* CỘT TRÁI: FORM CRAWL/GENERATE */}
                      <div className="lg:col-span-6 bg-white border-2 border-[#1f2937] p-5 rounded-xl shadow-[3px_3px_0px_#1f2937] space-y-4">
                        <h4 className="text-sm font-serif font-black text-[#1f2937] flex items-center gap-1.5">
                          {renderAIIcon('w-4 h-4 text-amber-500')} Nhập chủ đề hoặc danh sách chữ Hán cần tạo
                        </h4>
                        <p className="text-[11px] text-gray-500 font-bold">
                          Nhập chữ Hán (ví dụ: 苹果, 香蕉) hoặc chủ đề (ví dụ: Màu sắc, Thời tiết, Đồ ăn) để Bot AI tự động tìm Pinyin, nghĩa Việt và tạo câu ví dụ cực dễ thương cho Vy.
                        </p>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Cấp độ HSK:</label>
                            <select
                              value={vocabHskLevel}
                              onChange={(e) => setVocabHskLevel(Number(e.target.value))}
                              className="w-full p-2 border-2 border-[#1f2937] rounded-lg text-xs bg-[#fff5f6] font-black focus:outline-none cursor-pointer"
                            >
                              <option value={1}>HSK 1</option>
                              <option value={2}>HSK 2</option>
                              <option value={3}>HSK 3</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Yêu cầu từ vựng:</label>
                            <input
                              type="text"
                              value={vocabQuery}
                              onChange={e => setVocabQuery(e.target.value)}
                              placeholder="Ví dụ: Con vật, Trái cây, 电脑, 苹果..."
                              className="w-full p-2 border-2 border-[#1f2937] bg-white rounded-lg text-xs font-bold focus:outline-none"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleGenerateVocab}
                            disabled={vocabBotLoading}
                            className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white disabled:bg-gray-200 disabled:text-gray-400 border-2 border-[#1f2937] text-xs font-black rounded-lg shadow-[2px_2px_0px_#1f2937] active:shadow-none active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {vocabBotLoading ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Đang tạo...
                              </>
                            ) : (
                              'Khởi Chạy Bot Crawl'
                            )}
                          </button>
                        </div>

                        {vocabBotMsg && (
                          <p className={`text-[11px] font-bold p-2.5 rounded border text-center ${
                            vocabBotMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'
                          }`}>
                            {vocabBotMsg.text}
                          </p>
                        )}

                        {/* Hiển thị danh sách từ vựng vừa tạo được */}
                        {generatedVocab.length > 0 && (
                          <div className="space-y-3 pt-3 border-t border-dashed border-[#1f2937]">
                            <div className="flex justify-between items-center">
                              <h5 className="text-xs font-black uppercase text-gray-500">Kết quả Bot AI ({generatedVocab.length} từ)</h5>
                              <button
                                type="button"
                                onClick={handleSaveVocab}
                                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white border-2 border-[#1f2937] rounded-lg text-[10px] font-black uppercase cursor-pointer"
                              >
                                Lưu Vào Game
                              </button>
                            </div>

                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                              {generatedVocab.map((item, idx) => (
                                <div key={idx} className="p-2.5 bg-pink-50/50 border border-[#1f2937] rounded-lg flex items-start gap-2.5 text-left">
                                  <input
                                    type="checkbox"
                                    checked={item.selected}
                                    onChange={(e) => {
                                      const next = [...generatedVocab];
                                      next[idx].selected = e.target.checked;
                                      setGeneratedVocab(next);
                                    }}
                                    className="mt-1 accent-pink-500"
                                  />
                                  <div className="text-xs flex-1">
                                    <div className="font-serif font-black text-rose-600 flex items-center gap-1.5">
                                      <span>{item.nameChinese}</span>
                                      <span className="text-[10px] text-gray-500 font-sans">[{item.namePinyin}]</span>
                                      <span className="text-[9px] bg-rose-200 text-rose-800 px-1 py-0.2 rounded font-sans uppercase">HSK {item.hskLevel}</span>
                                    </div>
                                    <div className="font-bold text-gray-700">Nghĩa: {item.nameVietnamese}</div>
                                    {item.exampleChinese && (
                                      <div className="mt-1 text-[10.5px] text-gray-400 bg-white p-1.5 rounded border border-[#1f2937]/10">
                                        <p className="font-bold text-gray-500">Ví dụ: {item.exampleChinese}</p>
                                        <p className="text-[9.5px] italic text-blue-500">{item.examplePinyin}</p>
                                        <p className="text-[9.5px] text-gray-500 font-bold">Nghĩa ví dụ: {item.exampleVietnamese}</p>
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
                      <div className="lg:col-span-6 bg-white border-2 border-[#1f2937] p-5 rounded-xl shadow-[3px_3px_0px_#1f2937] space-y-3">
                        <h4 className="text-sm font-serif font-black text-[#1f2937] flex items-center justify-between">
                          <span>Kho từ vựng bổ sung trong CSDL ({customVocabs.length})</span>
                        </h4>
                        <p className="text-[11px] text-gray-500 font-bold">
                          Các từ vựng do bạn tạo sẽ lưu trữ tại đây và tự động gộp vào dải câu hỏi ngẫu nhiên trong phần giải Bản Vẽ của Vy.
                        </p>

                        {customVocabs.length === 0 ? (
                          <div className="py-12 border-2 border-dashed border-[#1f2937]/20 rounded-xl text-center text-gray-400 font-bold text-xs">
                            Hiện chưa có từ vựng bổ sung nào trong CSDL.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                            {customVocabs.map((item) => (
                              <div key={item.id} className="p-2.5 bg-gray-50 border border-[#1f2937] rounded-lg flex justify-between items-center text-left">
                                <div className="text-xs">
                                  <div className="font-serif font-black text-gray-800 flex items-center gap-1.5">
                                    <span>{item.nameChinese}</span>
                                    <span className="text-[10px] text-gray-400 font-sans">[{item.namePinyin}]</span>
                                    <span className="text-[9px] bg-gray-200 text-gray-700 px-1 py-0.2 rounded font-sans">HSK {item.hskLevel}</span>
                                  </div>
                                  <div className="font-bold text-gray-600 mt-0.5">Nghĩa: {item.nameVietnamese}</div>
                                  {item.exampleChinese && (
                                    <div className="text-[10px] text-gray-400 italic">
                                      Ví dụ: {item.exampleChinese} ({item.exampleVietnamese})
                                    </div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteVocab(item.id)}
                                  className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded text-[9px] font-black uppercase cursor-pointer"
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
        </div>
      )}

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
