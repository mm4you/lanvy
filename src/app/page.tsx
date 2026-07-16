'use client';

import { useState, useEffect, useRef } from 'react';
import { INGREDIENTS, ORDERS, VOCAB_LIST } from '../data/vocabulary';
import { GAME_ORDERS } from '../data/game-orders';
import OpenWorldGame from '../components/open-world-game';
import AuthPortal, { AuthenticatedUser } from '../components/auth-portal';
import { AdminUserLog, BrowserWindow, ChatMessage, Voucher } from '../types/game';
import { AvatarConfig, DEFAULT_AVATAR, normalizeAvatar } from '../data/avatar';
import PixelAvatar from '../components/pixel-avatar';
import { ArrowLeftIcon, BotIcon, CloseIcon, EditIcon } from '../components/ui-icons';

const OFFLINE_USER_ID = 'offline-guest';
const LOVE_EMAIL = 'nguyenthilanvy12a2@gmail.com';
const OFFLINE_PROGRESS_KEY = 'hsk_boba_offline_progress_v1';

export default function GamePage() {
  // Auth & Session state
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null);

  const isLoveUser = user?.email.toLowerCase() === LOVE_EMAIL;

  const [gameArea, setGameArea] = useState<'world' | 'boba'>('world');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);

  // Game state
  const orders = GAME_ORDERS;
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [unlockedVouchers, setUnlockedVouchers] = useState<Voucher[]>([]);
  const [gameMessage, setGameMessage] = useState<string>('Chào mừng bạn đến với Tiệm Trà Sữa HSK của chúng ta!');
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [customerState, setCustomerState] = useState<'entering' | 'idle' | 'leaving' | 'disappointed'>('entering');
  const [activeMistakes, setActiveMistakes] = useState<string[]>([]);

  // Shaking mini-game states
  const [isShakingGameActive, setIsShakingGameActive] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderDirection, setSliderDirection] = useState(1);
  const [shakingResult, setShakingResult] = useState<'perfect' | 'good' | 'miss' | null>(null);

  // Interactive states
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showIngredientHelp, setShowIngredientHelp] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showVoucherWallet, setShowVoucherWallet] = useState(false);
  const [showCoinShop, setShowCoinShop] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showVocabModal, setShowVocabModal] = useState(false);
  const [vocabTab, setVocabTab] = useState<'list' | 'flashcard'>('list');
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [comboCount, setComboCount] = useState(0);
  const [newlyUnlockedVoucher, setNewlyUnlockedVoucher] = useState<Voucher | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // 2D Movement States
  const [playerPos, setPlayerPos] = useState({ x: 5, y: 6 });
  const [playerDir, setPlayerDir] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [activeStation, setActiveStation] = useState<string | null>(null);

  // Custom naming & AI Assistant states
  const [characterName, setCharacterName] = useState('Lan Vy');
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [newNameInput, setNewNameInput] = useState('Lan Vy');
  const [explainWord, setExplainWord] = useState<string | null>(null);
  const [explanationText, setExplanationText] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Customer roleplay chat states
  const [showChatWithCustomer, setShowChatWithCustomer] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  // Admin Logs state
  const [showAdminLogsModal, setShowAdminLogsModal] = useState(false);
  const [adminLogsData, setAdminLogsData] = useState<AdminUserLog[] | null>(null);
  const [adminLogsLoading, setAdminLogsLoading] = useState(false);
  const [adminLogsError, setAdminLogsError] = useState('');

  // Refs
  const pressedKeys = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentOrder = orders[currentOrderIndex];

  // Synthesizer for 8-bit sound effects (no external files needed!)
  const playSfx = (type: 'click' | 'success' | 'error' | 'perfect' | 'levelUp' | 'flip') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as BrowserWindow).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
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
        playTone(523.25, now, 0.1, 0.08, 'square'); // C5
        playTone(659.25, now + 0.08, 0.1, 0.08, 'square'); // E5
        playTone(783.99, now + 0.16, 0.2, 0.08, 'square'); // G5
      } else if (type === 'error') {
        playTone(150, now, 0.15, 0.12, 'sawtooth');
        playTone(100, now + 0.08, 0.25, 0.12, 'sawtooth');
      } else if (type === 'perfect') {
        playTone(523.25, now, 0.06, 0.08, 'sine');
        playTone(659.25, now + 0.04, 0.06, 0.08, 'sine');
        playTone(783.99, now + 0.08, 0.06, 0.08, 'sine');
        playTone(1046.50, now + 0.12, 0.25, 0.08, 'sine'); // C6
      } else if (type === 'levelUp') {
        playTone(440, now, 0.1, 0.08, 'triangle'); // A4
        playTone(554.37, now + 0.1, 0.1, 0.08, 'triangle'); // C#5
        playTone(659.25, now + 0.2, 0.1, 0.08, 'triangle'); // E5
        playTone(880, now + 0.3, 0.35, 0.08, 'triangle'); // A5
      }
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger hearts on non-form elements to avoid focus issues
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setHearts(prev => [...prev, { id, x, y }]);
    
    playSfx('click');

    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    }, 800);
  };

  // Shaking mini-game slider loop hook
  useEffect(() => {
    if (!isShakingGameActive) return;
    const interval = setInterval(() => {
      setSliderValue((prev) => {
        const next = prev + 5 * sliderDirection;
        if (next >= 100) {
          setSliderDirection(-1);
          return 100;
        }
        if (next <= 0) {
          setSliderDirection(1);
          return 0;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isShakingGameActive, sliderDirection]);


  const COLS = 12;
  const ROWS = 10;

  const isWalkable = (x: number, y: number) => {
    if (x <= 0 || x >= COLS - 1 || y <= 0 || y >= ROWS - 1) return false;
    if (y === 2 && [2, 4, 6, 8, 10].includes(x)) return false;
    if (y === 6 && x === 2) return false;
    if (y === 6 && x === 9) return false;
    if (y === 4 && x >= 2 && x <= 9) return false;
    return true;
  };

  const getNearbyStation = () => {
    const { x, y } = playerPos;
    if (y === 3) {
      if (x === 2) return { id: 'tea', label: 'Quầy Trà Nền' };
      if (x === 4) return { id: 'topping', label: 'Quầy Topping' };
      if (x === 6) return { id: 'fruit', label: 'Quầy Trái Cây' };
      if (x === 8) return { id: 'sugar_ice', label: 'Quầy Đường / Đá' };
      if (x === 10) return { id: 'bookshelf', label: 'Sổ tay HSK' };
    }
    if (x === 2 && (y === 5 || y === 7)) return { id: 'shaker', label: 'Quầy Lắc Bình' };
    if (y === 6 && x === 3) return { id: 'shaker', label: 'Quầy Lắc Bình' };
    if (x === 9 && (y === 5 || y === 7)) return { id: 'register', label: 'Cửa hàng Xu Vàng' };
    if (y === 6 && x === 8) return { id: 'register', label: 'Cửa hàng Xu Vàng' };
    if (y === 5 && x === 5) return { id: 'order', label: 'Gọi món & Phục vụ' };
    return null;
  };

  const handleInteract = () => {
    const station = getNearbyStation();
    if (!station) return;
    playSfx('click');
    switch (station.id) {
      case 'tea':
        setActiveStation('tea');
        break;
      case 'topping':
        setActiveStation('topping');
        break;
      case 'fruit':
        setActiveStation('fruit');
        break;
      case 'sugar_ice':
        setActiveStation('sugar_ice');
        break;
      case 'bookshelf':
        setShowVocabModal(true);
        setVocabTab('list');
        break;
      case 'register':
        setShowCoinShop(true);
        break;
      case 'shaker':
        if (selectedIngredients.length === 0) {
          setGameMessage('Ly pha chế của bạn hiện đang trống. Hãy qua quầy trà nền, quầy topping và quầy trái cây để chọn món trước nhé!');
          setMessageType('error');
        } else {
          handleServe();
        }
        break;
      case 'order':
        setActiveStation('order');
        break;
      default:
        break;
    }
  };

  const handleInteractRef = useRef(handleInteract);
  useEffect(() => {
    handleInteractRef.current = handleInteract;
  });

  const handleCellClick = (x: number, y: number) => {
    if (isWalkable(x, y)) {
      setPlayerPos({ x, y });
    } else {
      const stations = [
        { x: 2, y: 2, id: 'tea' },
        { x: 4, y: 2, id: 'topping' },
        { x: 6, y: 2, id: 'fruit' },
        { x: 8, y: 2, id: 'sugar_ice' },
        { x: 10, y: 2, id: 'bookshelf' },
        { x: 2, y: 6, id: 'shaker' },
        { x: 9, y: 6, id: 'register' },
        { x: 5, y: 4, id: 'order' }
      ];
      const match = stations.find(s => s.x === x && s.y === y);
      if (match) {
        let targetX = playerPos.x;
        let targetY = playerPos.y;
        if (match.y === 2) {
          targetX = match.x;
          targetY = 3;
        } else if (match.id === 'shaker') {
          targetX = 3;
          targetY = 6;
        } else if (match.id === 'register') {
          targetX = 8;
          targetY = 6;
        } else if (match.id === 'order') {
          targetX = 5;
          targetY = 5;
        }
        if (isWalkable(targetX, targetY)) {
          setPlayerPos({ x: targetX, y: targetY });
          setTimeout(() => {
            switch (match.id) {
              case 'tea': setActiveStation('tea'); break;
              case 'topping': setActiveStation('topping'); break;
              case 'fruit': setActiveStation('fruit'); break;
              case 'sugar_ice': setActiveStation('sugar_ice'); break;
              case 'bookshelf': setShowVocabModal(true); break;
              case 'register': setShowCoinShop(true); break;
              case 'shaker': 
                if (selectedIngredients.length > 0) handleServe();
                else {
                  setGameMessage('Ly pha chế của bạn hiện đang trống. Hãy qua quầy trà nền, quầy topping và quầy trái cây để chọn món trước nhé!');
                  setMessageType('error');
                }
                break;
              case 'order': setActiveStation('order'); break;
            }
          }, 100);
        }
      }
    }
  };

  const playFootstepBeep = () => {
    if (typeof window !== 'undefined') {
      try {
        const ctx = new (window.AudioContext || (window as BrowserWindow).webkitAudioContext!)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        gain.gain.setValueAtTime(0.005, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch {}
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!user) return;
      const target = e.target as HTMLElement;
      if (['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
      
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
      }

      if (showCoinShop || showVocabModal || showVoucherWallet || showAdminLogsModal || gameCompleted) return;

      if (key === ' ' || key === 'spacebar') {
        handleInteractRef.current();
        return;
      }

      pressedKeys.current.add(key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      pressedKeys.current.delete(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [user, showCoinShop, showVocabModal, showVoucherWallet, showAdminLogsModal, gameCompleted, selectedIngredients]);

  useEffect(() => {
    if (!user || showCoinShop || showVocabModal || showVoucherWallet || showAdminLogsModal || gameCompleted) return;

    const interval = setInterval(() => {
      let dx = 0;
      let dy = 0;

      if (pressedKeys.current.has('w') || pressedKeys.current.has('arrowup')) dy = -1;
      if (pressedKeys.current.has('s') || pressedKeys.current.has('arrowdown')) dy = 1;
      if (pressedKeys.current.has('a') || pressedKeys.current.has('arrowleft')) dx = -1;
      if (pressedKeys.current.has('d') || pressedKeys.current.has('arrowright')) dx = 1;

      if (dx === 0 && dy === 0) return;

      let dir: 'up' | 'down' | 'left' | 'right' = playerDir;
      if (dx > 0) dir = 'right';
      else if (dx < 0) dir = 'left';
      else if (dy > 0) dir = 'down';
      else if (dy < 0) dir = 'up';

      setPlayerDir(dir);

      const nextX = playerPos.x + dx;
      const nextY = playerPos.y + dy;

      if (isWalkable(nextX, nextY)) {
        setPlayerPos({ x: nextX, y: nextY });
        playFootstepBeep();
      } else {
        if (dx !== 0 && dy !== 0) {
          if (isWalkable(playerPos.x + dx, playerPos.y)) {
            setPlayerPos({ x: playerPos.x + dx, y: playerPos.y });
            playFootstepBeep();
          } else if (isWalkable(playerPos.x, playerPos.y + dy)) {
            setPlayerPos({ x: playerPos.x, y: playerPos.y + dy });
            playFootstepBeep();
          }
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, [playerPos, playerDir, user, showCoinShop, showVocabModal, showVoucherWallet, showAdminLogsModal, gameCompleted]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedUserId = localStorage.getItem('boba_game_user_id');
      const savedUsername = localStorage.getItem('boba_game_username');
      const savedEmail = localStorage.getItem('boba_game_email');
      if (savedUserId && savedUsername) {
        const userData = { id: savedUserId, username: savedUsername, email: savedEmail || '' };
        setUser(userData);
        void fetchProgress(userData.id);
      }
      const savedAvatar = localStorage.getItem('hsk_avatar_config_v1');
      if (savedAvatar) {
        try { setAvatarConfig(normalizeAvatar(JSON.parse(savedAvatar) as Partial<AvatarConfig>)); } catch { localStorage.removeItem('hsk_avatar_config_v1'); }
      }
      const savedCharName = localStorage.getItem('boba_character_name');
      if (savedCharName) {
        setCharacterName(savedCharName);
        setNewNameInput(savedCharName);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Fetch progress from local storage for offline guests or from the signed online session.
  async function fetchProgress(userId: string) {
    setLoadingProgress(true);
    try {
      if (userId === OFFLINE_USER_ID) {
        const saved = localStorage.getItem(OFFLINE_PROGRESS_KEY);
        const data = saved ? JSON.parse(saved) : { score: 0, coins: 0, level: 1, vouchers: [] };
        setScore(data.score ?? 0);
        setCoins(data.coins ?? 0);
        setCurrentLevel(data.level ?? 1);
        setUnlockedVouchers(data.vouchers ?? []);
        const startingIndex = ((data.level ?? 1) - 1) * 3;
        if (startingIndex < ORDERS.length) setCurrentOrderIndex(startingIndex);
        return;
      }

      const res = await fetch('/api/progress');
      if (res.ok) {
        const data = await res.json();
        setScore(data.progress.score);
        setCoins(data.progress.coins);
        setCurrentLevel(data.progress.level);
        setUnlockedVouchers(data.vouchers);
        
        // Filter orders based on user level
        // Level 1: orders 1-3, Level 2: orders 4-6, Level 3: orders 7-9
        const startingIndex = (data.progress.level - 1) * 3;
        if (startingIndex < ORDERS.length) {
          setCurrentOrderIndex(startingIndex);
        }
      }
    } catch (e) {
      console.error('Failed to load user progress:', e);
    } finally {
      setLoadingProgress(false);
    }
  }

  // Local profile: gameplay never requires an account or a network request.
  const handleOfflinePlay = (requestedName?: string) => {
    const localName = requestedName?.trim() || 'Người học HSK';
    const offlineUser = { id: OFFLINE_USER_ID, username: localName, email: '' };
    localStorage.setItem('boba_game_user_id', offlineUser.id);
    localStorage.setItem('boba_game_username', offlineUser.username);
    localStorage.setItem('boba_game_email', '');
    localStorage.setItem('boba_character_name', localName);
    setCharacterName(localName);
    setNewNameInput(localName);
    setUser(offlineUser);
    setGameArea('world');
    void fetchProgress(offlineUser.id);
  };

  const handleOnlineAuthenticated = (authenticatedUser: AuthenticatedUser) => {
    localStorage.setItem('boba_game_user_id', authenticatedUser.id);
    localStorage.setItem('boba_game_username', authenticatedUser.username);
    localStorage.setItem('boba_game_email', authenticatedUser.email);
    setUser(authenticatedUser);
    setGameArea('world');
    void fetchProgress(authenticatedUser.id);
    if (authenticatedUser.email.toLowerCase() === LOVE_EMAIL) {
      setCharacterName('Lan Vy');
      setNewNameInput('Lan Vy');
      setGameMessage('Chào mừng Lan Vy! Thị trấn và những món quà riêng của Khang đã sẵn sàng.');
      setMessageType('success');
    } else {
      setCharacterName(authenticatedUser.username);
      setNewNameInput(authenticatedUser.username);
      setGameMessage('Chào mừng ' + authenticatedUser.username + ' đến HSK Pixel Town!');
      setMessageType('info');
    }
  };

  const handleLogout = async () => {
    if (user?.id !== OFFLINE_USER_ID) {
      await fetch('/api/logout', { method: 'POST' }).catch(() => undefined);
    }
    localStorage.removeItem('boba_game_user_id');
    localStorage.removeItem('boba_game_username');
    localStorage.removeItem('boba_game_email');
    setUser(null);
    setSelectedIngredients([]);
    setUnlockedVouchers([]);
    setNewlyUnlockedVoucher(null);
    setCurrentOrderIndex(0);
    setGameArea('world');
  };

  const handleOpenAdminLogs = async () => {
    setShowAdminLogsModal(true);
    setAdminLogsLoading(true);
    setAdminLogsError('');
    try {
      const res = await fetch('/api/admin/logs');
      if (res.ok) {
        const data = await res.json();
        setAdminLogsData(data.users || []);
      } else {
        const data = await res.json();
        setAdminLogsError(data.error || 'Lỗi khi tải dữ liệu logs.');
      }
    } catch {
      setAdminLogsError('Lỗi kết nối máy chủ.');
    } finally {
      setAdminLogsLoading(false);
    }
  };

  // Persist progress locally for offline guests and to PostgreSQL for signed-in users.
  const saveProgress = async (newScore: number, newCoins: number, newLevel: number, voucherToUnlock: Voucher | null = null) => {
    if (!user) return;
    if (user.id === OFFLINE_USER_ID) {
      const nextVouchers = voucherToUnlock && !unlockedVouchers.some((voucher) => voucher.code === voucherToUnlock.code)
        ? [...unlockedVouchers, { ...voucherToUnlock, id: voucherToUnlock.code, isRedeemed: false }]
        : unlockedVouchers;
      localStorage.setItem(OFFLINE_PROGRESS_KEY, JSON.stringify({ score: newScore, coins: newCoins, level: newLevel, vouchers: nextVouchers }));
      setUnlockedVouchers(nextVouchers);
      if (voucherToUnlock) setNewlyUnlockedVoucher(voucherToUnlock);
      return;
    }
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
        setUnlockedVouchers(data.vouchers);
        if (data.newVoucher) {
          setNewlyUnlockedVoucher(data.newVoucher);
        }
      }
    } catch (e) {
      console.error('Failed to sync progress:', e);
    }
  };

  // Audio Play (TTS Chinese)
  const playAudio = () => {
    if (!currentOrder) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setIsPlayingAudio(true);
    // Use Chinese (zh) TTS proxy
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(currentOrder.orderChinese)}&lang=zh`);
    audioRef.current = audio;
    audio.play().catch(e => {
      console.warn('Audio play failed:', e);
      setIsPlayingAudio(false);
    });

    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
  };

  // Voice Recording & Speech-to-Text
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleTranscribe(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setGameMessage('Đang lắng nghe phát âm tiếng Trung của bạn...');
      setMessageType('info');
    } catch {
      setGameMessage('Không thể truy cập Mic của bạn. Hãy cấp quyền mic nhé!');
      setMessageType('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Turn off microphone tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleTranscribe = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setGameMessage('Đang phân tích phát âm...');
    const formData = new FormData();
    formData.append('file', audioBlob);

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setIsTranscribing(false);

      if (res.ok && data.text) {
        const transcribed = data.text;
        const cleanedTranscribed = transcribed.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()？。，！；：\s]/g, '');
        const cleanedTarget = currentOrder.orderChinese.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()？。，！；：\s]/g, '');

        if (cleanedTranscribed.includes(cleanedTarget) || cleanedTarget.includes(cleanedTranscribed)) {
          // Speak success and autofill correct ingredients
          setGameMessage(`Phát âm chính xác! Bạn nói: "${transcribed}". Tự động thêm nguyên liệu!`);
          setMessageType('success');
          setSelectedIngredients(currentOrder.targetIngredients);
        } else {
          setGameMessage(`Chưa chính xác lắm. Bạn nói: "${transcribed}". Hãy nghe lại và thử lại nhé!`);
          setMessageType('error');
        }
      } else {
        setGameMessage(data.error || 'Nhận diện giọng nói thất bại.');
        setMessageType('error');
      }
    } catch (e) {
      console.error(e);
      setGameMessage('Lỗi kết nối đến máy chủ nhận diện.');
      setMessageType('error');
      setIsTranscribing(false);
    }
  };

  // Ingredient select
  const toggleIngredient = (nameChinese: string) => {
    setSelectedIngredients(prev => {
      if (prev.includes(nameChinese)) {
        return prev.filter(i => i !== nameChinese);
      } else {
        return [...prev, nameChinese];
      }
    });
  };

  // Clean shaker
  const clearCup = () => {
    setSelectedIngredients([]);
  };

  // Effect to handle customer entering animation on index changes
  useEffect(() => {
    if (!currentOrder) return;
    const enterTimer = window.setTimeout(() => setCustomerState('entering'), 0);
    const idleTimer = window.setTimeout(() => setCustomerState('idle'), 1000);
    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(idleTimer);
    };
  }, [currentOrder]);

  // Serve drink check
  const handleServe = () => {
    if (!currentOrder || customerState === 'leaving' || customerState === 'entering' || isShakingGameActive) return;

    // Check if ingredients match
    const isCorrect = 
      selectedIngredients.length === currentOrder.targetIngredients.length &&
      currentOrder.targetIngredients.every(item => selectedIngredients.includes(item));

    if (isCorrect) {
      setIsShakingGameActive(true);
      setSliderValue(0);
      setShakingResult(null);
      setGameMessage('Đang lắc trà sữa! Hãy bấm DỪNG LẮC khi kim chỉ đúng vào vùng màu xanh lá để đạt vị ngon xuất sắc nhé!');
      setMessageType('info');
      setActiveMistakes([]);
    } else {
      // Customer is disappointed
      setCustomerState('disappointed');
      setTimeout(() => {
        setCustomerState('idle');
      }, 800);

      // Analyze mistake details
      const targetSet = new Set(currentOrder.targetIngredients);
      const selectedSet = new Set(selectedIngredients);

      const missing = currentOrder.targetIngredients.filter(x => !selectedSet.has(x));
      const extra = selectedIngredients.filter(x => !targetSet.has(x));

      const mistakes: string[] = [];

      missing.forEach(item => {
        const ing = INGREDIENTS.find(i => i.nameChinese === item);
        if (ing) {
          if (ing.category === 'base') mistakes.push(`Thiếu trà nền: ${ing.nameChinese} (${ing.nameVietnamese})`);
          else if (ing.category === 'topping') mistakes.push(`Quên topping: ${ing.nameChinese} (${ing.nameVietnamese})`);
          else if (ing.category === 'sugar') mistakes.push(`Chưa chọn mức đường: ${ing.nameChinese} (${ing.nameVietnamese})`);
          else if (ing.category === 'ice') mistakes.push(`Chưa chọn mức đá: ${ing.nameChinese} (${ing.nameVietnamese})`);
        }
      });

      extra.forEach(item => {
        const ing = INGREDIENTS.find(i => i.nameChinese === item);
        if (ing) {
          if (ing.category === 'base') mistakes.push(`Nhầm lẫn trà nền: Bạn cho dư ${ing.nameChinese} (${ing.nameVietnamese})`);
          else if (ing.category === 'topping') mistakes.push(`Thừa topping không yêu cầu: ${ing.nameChinese} (${ing.nameVietnamese})`);
          else if (ing.category === 'sugar') mistakes.push(`Chọn sai mức đường: ${ing.nameChinese} (${ing.nameVietnamese})`);
          else if (ing.category === 'ice') mistakes.push(`Chọn sai mức đá: ${ing.nameChinese} (${ing.nameVietnamese})`);
        }
      });

      setActiveMistakes(mistakes);
      setGameMessage(currentOrder.failureMessage);
      setMessageType('error');
      setComboCount(0);
      playSfx('error');
    }
  };

  // Stop Shaking timing handler
  const handleStopShaking = () => {
    if (!isShakingGameActive || !currentOrder) return;

    let bonusScore = 100;
    let bonusCoins = 50;
    let resultType: 'perfect' | 'good' | 'miss' = 'good';
    let resultMessage = '';

    if (sliderValue >= 40 && sliderValue <= 60) {
      bonusScore = 150;
      bonusCoins = 75;
      resultType = 'perfect';
      resultMessage = 'PERFECT! Lắc sữa siêu đều tay! +150 Điểm, +75 Xu. ';
      setComboCount(prev => prev + 1);
      playSfx('perfect');
    } else if ((sliderValue >= 20 && sliderValue < 40) || (sliderValue > 60 && sliderValue <= 80)) {
      bonusScore = 100;
      bonusCoins = 50;
      resultType = 'good';
      resultMessage = 'GOOD! Hương vị vừa miệng! +100 Điểm, +50 Xu. ';
      setComboCount(prev => prev + 1);
      playSfx('success');
    } else {
      bonusScore = 50;
      bonusCoins = 25;
      resultType = 'miss';
      resultMessage = 'MISS! Lắc hơi lệch một chút rồi! +50 Điểm, +25 Xu. ';
      setComboCount(0);
      playSfx('error');
    }

    setShakingResult(resultType);
    setGameMessage(resultMessage + currentOrder.successMessage);
    setMessageType(resultType === 'miss' ? 'error' : 'success');

    setTimeout(() => {
      const nextScore = score + bonusScore;
      const nextCoins = coins + bonusCoins;
      
      setScore(nextScore);
      setCoins(nextCoins);
      setActiveMistakes([]);

      setCustomerState('leaving');

      let nextLevel = currentLevel;
      const nextOrderIndex = currentOrderIndex + 1;
      
      if (nextOrderIndex > 0 && nextOrderIndex % 3 === 0) {
        nextLevel = Math.min(3, currentLevel + 1);
        setCurrentLevel(nextLevel);
        setGameMessage(prev => prev + ` Chúc mừng Bà chủ đã đạt Cấp độ ${nextLevel}!`);
        playSfx('levelUp');
      }

      const voucherToUnlock = currentOrder.voucherReward || null;
      saveProgress(nextScore, nextCoins, nextLevel, voucherToUnlock);

      setTimeout(() => {
        setIsShakingGameActive(false);
        setShakingResult(null);
        setActiveStation(null);
        setPlayerPos({ x: 5, y: 6 });
        if (nextOrderIndex < orders.length) {
          setCurrentOrderIndex(nextOrderIndex);
          setSelectedIngredients([]);
        } else {
          setCurrentOrderIndex(nextOrderIndex);
          setSelectedIngredients([]);
          setGameCompleted(true);
          setGameMessage('Tuyệt vời! Bà chủ Vy đã hoàn thành toàn bộ các cấp độ trà sữa xuất sắc!');
        }
      }, 1200);
    }, 1500);
  };

  // Skip / Next Customer handler
  const handleNextCustomer = () => {
    if (customerState === 'leaving' || customerState === 'entering') return;
    
    setCustomerState('leaving');
    setActiveMistakes([]);
    
    setTimeout(() => {
      const nextIndex = currentOrderIndex + 1;
      setActiveStation(null);
      setPlayerPos({ x: 5, y: 6 });
      if (nextIndex < orders.length) {
        setCurrentOrderIndex(nextIndex);
        setSelectedIngredients([]);
        setShowTranslation(false);
        setChatHistory([]);
        setShowChatWithCustomer(false);
      } else {
        setCurrentOrderIndex(nextIndex);
        setSelectedIngredients([]);
        setGameCompleted(true);
        setGameMessage('Bà chủ Vy đã gặp hết tất cả khách hàng rồi!');
        setChatHistory([]);
        setShowChatWithCustomer(false);
      }
    }, 1000);
  };

  // Redeem voucher
  const handleRedeemVoucher = async (code: string) => {
    if (!user) return;
    if (user.id === OFFLINE_USER_ID) {
      const nextVouchers = unlockedVouchers.map((voucher) => voucher.code === code ? { ...voucher, isRedeemed: true } : voucher);
      setUnlockedVouchers(nextVouchers);
      localStorage.setItem(OFFLINE_PROGRESS_KEY, JSON.stringify({ score, coins, level: currentLevel, vouchers: nextVouchers }));
      return;
    }
    try {
      const res = await fetch('/api/vouchers/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });
      if (res.ok) {
        // Reload progress
        await fetchProgress(user.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Buy item from coin shop
  const handleBuyItem = async (type: 'hint' | 'voucher_milktea' | 'voucher_hug' | 'voucher_date') => {
    let cost = 0;
    let newVoucher = null;
    
    if (type === 'hint') {
      cost = 20;
      setShowIngredientHelp(true);
    } else if (type === 'voucher_milktea') {
      cost = 150;
      newVoucher = {
        title: "VOUCHER TRÀ SỮA MUA TẶNG",
        description: "Phiếu đổi 1 ly trà sữa Gongcha/KoiThé bất kỳ do anh Khang trực tiếp mua tặng bé.",
        code: `SHOP-BOBA-${Date.now()}`
      };
    } else if (type === 'voucher_hug') {
      cost = 100;
      newVoucher = {
        title: "VOUCHER KHANG ÔM BÉ",
        description: "Phiếu đổi 1 cái ôm siết chặt ấm áp từ bạn trai Nhựt Khang bất cứ lúc nào bé muốn.",
        code: `SHOP-HUG-${Date.now()}`
      };
    } else if (type === 'voucher_date') {
      cost = 200;
      newVoucher = {
        title: "VOUCHER BUỔI HẸN HÒ CÔNG CHÚA",
        description: "Phiếu đổi 1 ngày hẹn hò trọn vẹn do anh Khang lên lịch, làm xế xe và chiêu đãi bé từ A đến Z.",
        code: `SHOP-DATE-${Date.now()}`
      };
    }

    if (coins < cost) {
      alert("Bà chủ không đủ xu vàng rồi! Hãy pha thêm trà sữa để tích lũy thêm xu nhé!");
      return;
    }

    const nextCoins = coins - cost;
    setCoins(nextCoins);
    
    if (newVoucher) {
      await saveProgress(score, nextCoins, currentLevel, newVoucher);
      setShowCoinShop(false);
    } else {
      await saveProgress(score, nextCoins, currentLevel, null);
      alert("Đã mở khóa gợi ý nguyên liệu tiếng Việt! Giờ đây nghĩa tiếng Việt sẽ hiện trên quầy nguyên liệu.");
      setShowCoinShop(false);
    }
  };

  // Restart / Play again handler
  const handleRestartGame = async () => {
    setCurrentOrderIndex(0);
    setSelectedIngredients([]);
    setCurrentLevel(1);
    setGameCompleted(false);
    setCustomerState('entering');
    await saveProgress(score, coins, 1, null);
    setGameMessage('Chào mừng Bà chủ chơi lại từ đầu! Hãy tiếp đón khách hàng nhé.');
    setMessageType('info');
  };

  const handleExplainWord = async (wordToExplain: string) => {
    setExplainWord(wordToExplain);
    setExplanationText(null);
    setIsExplaining(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: wordToExplain })
      });
      if (res.ok) {
        const data = await res.json();
        setExplanationText(data.explanation);
      } else {
        setExplanationText('Có lỗi xảy ra khi kết nối với Trợ lý AI.');
      }
    } catch {
      setExplanationText('Không thể kết nối với Trợ lý AI. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !currentOrder) return;
    const msgText = chatInput.trim();
    setChatInput('');
    
    const userMsg: ChatMessage = { sender: 'player', text: msgText };
    const nextHistory = [...chatHistory, userMsg];
    setChatHistory(nextHistory);
    setIsChatting(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: currentOrder.customerName,
          message: msgText,
          history: chatHistory
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory([...nextHistory, {
          sender: 'customer',
          text: data.text,
          pinyin: data.pinyin,
          translation: data.translation
        }]);
      } else {
        setChatHistory([...nextHistory, {
          sender: 'customer',
          text: '...... (Có vẻ tôi đang bận suy nghĩ gì đó)',
          translation: 'Khách hàng tạm thời chưa trả lời được.'
        }]);
      }
    } catch {
      setChatHistory([...nextHistory, {
        sender: 'customer',
        text: '...... (Kết nối chập chờn)',
        translation: 'Lỗi kết nối mạng.'
      }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleChangeName = () => {
    if (!newNameInput.trim()) return;
    setCharacterName(newNameInput);
    localStorage.setItem('boba_character_name', newNameInput);
    setShowChangeNameModal(false);
    setGameMessage(`Đã đổi tên bà chủ thành ${newNameInput}!`);
    setMessageType('success');
  };

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const renderTeaIcon = (className = "w-6 h-6") => (
    <svg viewBox="0 0 32 32" className={`${className} pixelated inline`}>
      <rect x="6" y="4" width="20" height="24" fill="#4b5563" stroke="#1f2937" strokeWidth="2" />
      <rect x="8" y="6" width="16" height="6" fill="#1e293b" />
      <circle cx="11" cy="9" r="1.5" fill="#22c55e" />
      <circle cx="16" cy="9" r="1.5" fill="#3b82f6" />
      <circle cx="21" cy="9" r="1.5" fill="#ef4444" />
      <rect x="14" y="16" width="4" height="4" fill="#94a3b8" stroke="#1f2937" strokeWidth="1" />
      <rect x="8" y="24" width="16" height="3" fill="#334155" />
    </svg>
  );

  const renderToppingIcon = (className = "w-6 h-6") => (
    <svg viewBox="0 0 32 32" className={`${className} pixelated inline`}>
      <rect x="4" y="8" width="24" height="18" fill="#ca8a04" stroke="#1f2937" strokeWidth="2" />
      <rect x="6" y="12" width="6" height="5" fill="#f1f5f9" stroke="#1f2937" strokeWidth="1" />
      <circle cx="9" cy="14" r="1.5" fill="#1e293b" />
      <rect x="13" y="12" width="6" height="5" fill="#f1f5f9" stroke="#1f2937" strokeWidth="1" />
      <rect x="15" y="14" width="2" height="2" fill="#fbbf24" />
      <rect x="20" y="12" width="6" height="5" fill="#f1f5f9" stroke="#1f2937" strokeWidth="1" />
      <rect x="22" y="13" width="2" height="3" fill="#7f1d1d" />
    </svg>
  );

  const renderFruitIcon = (className = "w-6 h-6") => (
    <svg viewBox="0 0 32 32" className={`${className} pixelated inline`}>
      <rect x="4" y="10" width="24" height="16" fill="#854d0e" stroke="#1f2937" strokeWidth="2" />
      <line x1="4" y1="16" x2="28" y2="16" stroke="#1f2937" strokeWidth="1.5" />
      <line x1="4" y1="21" x2="28" y2="21" stroke="#1f2937" strokeWidth="1.5" />
      <circle cx="9" cy="8" r="3.5" fill="#ef4444" />
      <circle cx="16" cy="7" r="4.5" fill="#eab308" />
      <circle cx="23" cy="8" r="3.5" fill="#eab308" />
    </svg>
  );

  const renderIceIcon = (className = "w-6 h-6") => (
    <svg viewBox="0 0 32 32" className={`${className} pixelated inline`}>
      <rect x="6" y="4" width="20" height="24" fill="#0ea5e9" stroke="#1f2937" strokeWidth="2" />
      <rect x="8" y="6" width="16" height="8" fill="#e0f2fe" />
      <rect x="11" y="9" width="3" height="3" fill="#ffffff" />
      <rect x="17" y="8" width="3" height="3" fill="#ffffff" />
      <rect x="15" y="16" width="2" height="6" fill="#64748b" stroke="#1f2937" strokeWidth="1" />
    </svg>
  );

  const renderBookshelfIcon = (className = "w-6 h-6") => (
    <svg viewBox="0 0 32 32" className={`${className} pixelated inline`}>
      <rect x="4" y="4" width="24" height="24" fill="#78350f" stroke="#1f2937" strokeWidth="2" />
      <line x1="4" y1="13" x2="28" y2="13" stroke="#1f2937" strokeWidth="2" />
      <line x1="4" y1="21" x2="28" y2="21" stroke="#1f2937" strokeWidth="2" />
      <rect x="6" y="6" width="4" height="7" fill="#ef4444" stroke="#1f2937" strokeWidth="1" />
      <rect x="10" y="7" width="3" height="6" fill="#3b82f6" stroke="#1f2937" strokeWidth="1" />
      <rect x="13" y="5" width="4" height="8" fill="#eab308" stroke="#1f2937" strokeWidth="1" />
      <rect x="19" y="15" width="4" height="6" fill="#22c55e" stroke="#1f2937" strokeWidth="1" />
      <rect x="23" y="16" width="3" height="5" fill="#ec4899" stroke="#1f2937" strokeWidth="1" />
    </svg>
  );

  const renderShakerIcon = (className = "w-6 h-6") => (
    <svg viewBox="0 0 32 32" className={`${className} pixelated inline`}>
      <rect x="8" y="4" width="16" height="24" fill="#64748b" stroke="#1f2937" strokeWidth="2" />
      <path d="M12 10 L14 22 L18 22 L20 10 Z" fill="#94a3b8" stroke="#1f2937" strokeWidth="1.5" />
      <line x1="16" y1="4" x2="16" y2="9" stroke="#1f2937" strokeWidth="3" />
      <rect x="11" y="7" width="10" height="2" fill="#475569" />
    </svg>
  );

  const renderRegisterIcon = (className = "w-6 h-6") => (
    <svg viewBox="0 0 32 32" className={`${className} pixelated inline`}>
      <rect x="6" y="8" width="20" height="18" fill="#334155" stroke="#1f2937" strokeWidth="2" />
      <rect x="8" y="10" width="16" height="8" fill="#10b981" stroke="#1f2937" strokeWidth="1.5" />
      <rect x="10" y="12" width="6" height="2" fill="#ffffff" />
      <rect x="8" y="20" width="4" height="3" fill="#e2e8f0" stroke="#1f2937" strokeWidth="1" />
      <rect x="14" y="20" width="4" height="3" fill="#e2e8f0" stroke="#1f2937" strokeWidth="1" />
      <rect x="20" y="20" width="4" height="3" fill="#f59e0b" stroke="#1f2937" strokeWidth="1" />
    </svg>
  );

  const renderPencilIcon = (className = "w-3 h-3") => (
    <svg viewBox="0 0 24 24" className={`${className} inline-block`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );

  const renderHeartIcon = (className = "w-4 h-4") => (
    <svg viewBox="0 0 24 24" className={`${className} fill-current text-red-500 inline-block`} stroke="currentColor" strokeWidth="2">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );

  const renderAudioIcon = (className = "w-4 h-4") => (
    <svg viewBox="0 0 24 24" className={`${className} inline-block`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );

  const renderMicIcon = (className = "w-4 h-4") => (
    <svg viewBox="0 0 24 24" className={`${className} inline-block`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
    </svg>
  );

  const renderStopIcon = (className = "w-4 h-4") => (
    <svg viewBox="0 0 24 24" className={`${className} inline-block`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  );

  const renderNextIcon = (className = "w-4 h-4") => (
    <svg viewBox="0 0 24 24" className={`${className} inline-block`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  );

  const renderChartIcon = (className = "w-4 h-4") => (
    <svg viewBox="0 0 24 24" className={`${className} inline-block`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );

  const renderPlayerAvatar = () => (
    <PixelAvatar config={avatarConfig} direction={playerDir} className="h-full w-full" />
  );

  // Character SVGs (Pixel/Blocky Art styled via pure vector shapes)
  const renderCustomerSVG = (sprite: string) => {
    switch (sprite) {
      case 'cat':
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Ears (with 3D shading) */}
            <rect x="6" y="4" width="4" height="4" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
            <rect x="9" y="4" width="1" height="4" fill="#d97706" />
            <rect x="22" y="4" width="4" height="4" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
            <rect x="25" y="4" width="1" height="4" fill="#d97706" />
            {/* Head Voxel */}
            <rect x="6" y="8" width="20" height="16" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
            {/* Head 3D shade edge (right side) */}
            <rect x="24" y="9" width="2" height="14" fill="#d97706" />
            {/* White face panel */}
            <rect x="10" y="14" width="12" height="10" fill="#fffaf0" />
            <rect x="20" y="14" width="2" height="10" fill="#e5e5e0" /> {/* Face 3D shade */}
            {/* Eyes */}
            <rect x="10" y="12" width="2" height="4" fill="#1f2937" />
            <rect x="20" y="12" width="2" height="4" fill="#1f2937" />
            {/* Nose */}
            <rect x="15" y="16" width="2" height="2" fill="#ef4444" />
            {/* Blush */}
            <rect x="8" y="16" width="2" height="2" fill="#fca5a5" />
            <rect x="22" y="16" width="2" height="2" fill="#fca5a5" />
            {/* Body Voxel */}
            <rect x="10" y="24" width="12" height="6" fill="#d97706" stroke="#1f2937" strokeWidth="2" />
            <rect x="20" y="25" width="2" height="4" fill="#b45309" />
          </svg>
        );
      case 'panda':
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Ears */}
            <rect x="6" y="4" width="6" height="6" fill="#1f2937" stroke="#1f2937" strokeWidth="2" />
            <rect x="20" y="4" width="6" height="6" fill="#1f2937" stroke="#1f2937" strokeWidth="2" />
            {/* Head Voxel */}
            <rect x="6" y="8" width="20" height="16" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
            {/* Head 3D shade edge */}
            <rect x="24" y="9" width="2" height="14" fill="#e4e4e7" />
            {/* Eyes patches */}
            <rect x="8" y="12" width="4" height="4" fill="#1f2937" />
            <rect x="20" y="12" width="4" height="4" fill="#1f2937" />
            {/* Eyes pupils */}
            <rect x="9" y="13" width="2" height="2" fill="#ffffff" />
            <rect x="21" y="13" width="2" height="2" fill="#ffffff" />
            {/* Nose */}
            <rect x="15" y="17" width="2" height="2" fill="#1f2937" />
            {/* Body Voxel */}
            <rect x="8" y="24" width="16" height="6" fill="#1f2937" stroke="#1f2937" strokeWidth="2" />
            <rect x="22" y="25" width="2" height="4" fill="#09090b" />
          </svg>
        );
      case 'khang':
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Hair Voxel (with 3D highlights) */}
            <rect x="8" y="1" width="16" height="3" fill="#1f2937" />
            <rect x="6" y="3" width="20" height="6" fill="#1f2937" />
            <rect x="5" y="6" width="22" height="3" fill="#1f2937" />
            {/* Hair shade right */}
            <rect x="24" y="3" width="2" height="6" fill="#111827" />
            {/* Hair highlight top */}
            <rect x="10" y="2" width="6" height="1" fill="#4b5563" />
            {/* Sideburns */}
            <rect x="6" y="9" width="2" height="5" fill="#1f2937" />
            <rect x="24" y="9" width="2" height="5" fill="#1f2937" />
            {/* Face Voxel */}
            <rect x="8" y="8" width="16" height="16" fill="#fcd34d" stroke="#1f2937" strokeWidth="2" />
            {/* Face 3D shade edge */}
            <rect x="22" y="9" width="2" height="14" fill="#f59e0b" />
            {/* Eyes */}
            <rect x="10" y="13" width="2" height="2" fill="#1f2937" />
            <rect x="20" y="13" width="2" height="2" fill="#1f2937" />
            {/* Round glasses frames (3D shaded) */}
            <rect x="9" y="11" width="5" height="4" fill="none" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="18" y="11" width="5" height="4" fill="none" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="14" y="12" width="4" height="1.5" fill="#1f2937" />
            {/* Mouth */}
            <rect x="13" y="18" width="6" height="2" fill="#ef4444" />
            {/* Body (Dark blue crewneck t-shirt) */}
            <rect x="8" y="24" width="16" height="6" fill="#1e3b8b" stroke="#1f2937" strokeWidth="2" />
            {/* Shirt 3D shade */}
            <rect x="22" y="25" width="2" height="4" fill="#172554" />
          </svg>
        );
      case 'rabbit':
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Rabbit long floppy ears (with 3D depth) */}
            <rect x="5" y="4" width="4" height="10" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="6" y="5" width="2" height="8" fill="#fda4af" /> {/* inner ear */}
            <rect x="23" y="4" width="4" height="10" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="24" y="5" width="2" height="8" fill="#fda4af" /> {/* inner ear */}
            {/* Head Voxel */}
            <rect x="7" y="8" width="18" height="16" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
            {/* Head 3D shade edge */}
            <rect x="23" y="9" width="2" height="14" fill="#e4e4e7" />
            {/* Eyes (Cute anime eyes) */}
            <rect x="10" y="13" width="2" height="3" fill="#1f2937" />
            <rect x="20" y="13" width="2" height="3" fill="#1f2937" />
            <rect x="11" y="13" width="1" height="1" fill="#ffffff" />
            <rect x="21" y="13" width="1" height="1" fill="#ffffff" />
            {/* Pink cheeks */}
            <rect x="8" y="16" width="3" height="2" fill="#fecdd3" />
            <rect x="21" y="16" width="3" height="2" fill="#fecdd3" />
            {/* Nose & Mouth */}
            <rect x="15" y="17" width="2" height="1.5" fill="#f43f5e" />
            <rect x="14" y="19" width="4" height="1" fill="#1f2937" />
            {/* Body (Pink shirt) */}
            <rect x="9" y="24" width="14" height="6" fill="#f472b6" stroke="#1f2937" strokeWidth="2" />
            <rect x="21" y="25" width="2" height="4" fill="#db2777" />
          </svg>
        );
      case 'shiba':
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Shiba pointy ears */}
            <rect x="6" y="3" width="5" height="5" fill="#f59e0b" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="7" y="4" width="3" height="3" fill="#fffaf0" />
            <rect x="21" y="3" width="5" height="5" fill="#f59e0b" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="22" y="4" width="3" height="3" fill="#fffaf0" />
            {/* Head Voxel */}
            <rect x="6" y="8" width="20" height="16" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
            {/* Head 3D shade edge */}
            <rect x="24" y="9" width="2" height="14" fill="#d97706" />
            {/* White face cheeks panel */}
            <rect x="9" y="15" width="14" height="9" fill="#fffaf0" />
            <rect x="21" y="15" width="2" height="9" fill="#e5e5e0" />
            {/* Eyes with Shiba white dots eyebrows */}
            <rect x="10" y="13" width="2" height="2" fill="#1f2937" />
            <rect x="20" y="13" width="2" height="2" fill="#1f2937" />
            <rect x="10" y="11" width="2" height="1" fill="#fffaf0" /> {/* eyebrow */}
            <rect x="20" y="11" width="2" height="1" fill="#fffaf0" /> {/* eyebrow */}
            {/* Nose/Muzzle */}
            <rect x="14" y="16" width="4" height="3" fill="#1f2937" />
            <rect x="15" y="17" width="2" height="1" fill="#ffffff" />
            {/* Body with red scarf/collar */}
            <rect x="8" y="24" width="16" height="6" fill="#d97706" stroke="#1f2937" strokeWidth="2" />
            <rect x="22" y="25" width="2" height="4" fill="#b45309" />
            {/* Red scarf collar */}
            <rect x="8" y="24" width="16" height="2" fill="#dc2626" />
            <circle cx="16" cy="27" r="1.5" fill="#f59e0b" /> {/* Bell */}
          </svg>
        );
      case 'bear':
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Bear round ears */}
            <rect x="6" y="4" width="6" height="5" fill="#78350f" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="20" y="4" width="6" height="5" fill="#78350f" stroke="#1f2937" strokeWidth="1.5" />
            {/* Head Voxel */}
            <rect x="6" y="8" width="20" height="16" fill="#78350f" stroke="#1f2937" strokeWidth="2" />
            {/* Head 3D shade edge */}
            <rect x="24" y="9" width="2" height="14" fill="#451a03" />
            {/* Muzzle */}
            <rect x="12" y="15" width="8" height="6" fill="#fef3c7" stroke="#1f2937" strokeWidth="1" />
            <rect x="15" y="16" width="2" height="2" fill="#1f2937" /> {/* Nose */}
            {/* Eyes */}
            <rect x="10" y="12" width="2" height="2" fill="#1f2937" />
            <rect x="20" y="12" width="2" height="2" fill="#1f2937" />
            <rect x="11" y="12" width="1" height="1" fill="#ffffff" />
            <rect x="21" y="12" width="1" height="1" fill="#ffffff" />
            {/* Blush */}
            <rect x="8" y="15" width="2" height="2" fill="#fca5a5" />
            <rect x="22" y="15" width="2" height="2" fill="#fca5a5" />
            {/* Body Voxel (Green shirt) */}
            <rect x="8" y="24" width="16" height="6" fill="#15803d" stroke="#1f2937" strokeWidth="2" />
            <rect x="22" y="25" width="2" height="4" fill="#166534" />
          </svg>
        );
      case 'penguin': // Cute Penguin sprite
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Body base (round black blob) */}
            <rect x="7" y="6" width="18" height="18" fill="#1f2937" rx="6" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="9" y="24" width="14" height="2" fill="#1f2937" />
            {/* White belly/face panel */}
            <rect x="10" y="10" width="12" height="13" fill="#ffffff" rx="3" />
            {/* Eyes */}
            <rect x="12" y="12" width="2" height="3" fill="#1f2937" />
            <rect x="18" y="12" width="2" height="3" fill="#1f2937" />
            {/* Rosy cheeks */}
            <rect x="10" y="15" width="2" height="2" fill="#fca5a5" />
            <rect x="20" y="15" width="2" height="2" fill="#fca5a5" />
            {/* Orange beak */}
            <polygon points="14,15 18,15 16,18" fill="#f97316" stroke="#1f2937" strokeWidth="1" />
            {/* Cute yellow/red striped scarf */}
            <rect x="9" y="21" width="14" height="3" fill="#dc2626" stroke="#1f2937" strokeWidth="1" />
            <rect x="11" y="21" width="2" height="3" fill="#fbbf24" />
            <rect x="15" y="21" width="2" height="3" fill="#fbbf24" />
            <rect x="19" y="21" width="2" height="3" fill="#fbbf24" />
            <rect x="20" y="24" width="3" height="4" fill="#dc2626" stroke="#1f2937" strokeWidth="1" />
            {/* Feet */}
            <rect x="10" y="26" width="3" height="2" fill="#f97316" stroke="#1f2937" strokeWidth="1" />
            <rect x="19" y="26" width="3" height="2" fill="#f97316" stroke="#1f2937" strokeWidth="1" />
          </svg>
        );
      case 'dino': // Cute baby green dinosaur sprite
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Spikes on back */}
            <rect x="6" y="6" width="2" height="2" fill="#facc15" />
            <rect x="5" y="10" width="2" height="2" fill="#facc15" />
            <rect x="5" y="14" width="2" height="2" fill="#facc15" />
            <rect x="6" y="18" width="2" height="2" fill="#facc15" />
            {/* Head & body voxel (Green dino) */}
            <rect x="8" y="5" width="16" height="19" fill="#10b981" stroke="#1f2937" strokeWidth="2" rx="4" />
            {/* Dino belly (light green) */}
            <rect x="11" y="14" width="10" height="9" fill="#a7f3d0" rx="2" />
            {/* Cute eyes */}
            <rect x="12" y="9" width="2" height="3" fill="#1f2937" />
            <rect x="18" y="9" width="2" height="3" fill="#1f2937" />
            <rect x="13" y="9" width="1" height="1" fill="#ffffff" />
            <rect x="19" y="9" width="1" height="1" fill="#ffffff" />
            {/* Cheeks */}
            <rect x="10" y="12" width="2" height="1.5" fill="#fca5a5" />
            <rect x="20" y="12" width="2" height="1.5" fill="#fca5a5" />
            {/* Tiny cute smile */}
            <rect x="15" y="13" width="2" height="1" fill="#1f2937" />
            {/* Dino tail */}
            <rect x="6" y="20" width="3" height="3" fill="#10b981" stroke="#1f2937" strokeWidth="1" />
            {/* Feet */}
            <rect x="9" y="24" width="4" height="2" fill="#10b981" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="19" y="24" width="4" height="2" fill="#10b981" stroke="#1f2937" strokeWidth="1.5" />
          </svg>
        );
      case 'fox': // Cute little fox sprite
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Large pointed fox ears */}
            <rect x="6" y="3" width="6" height="6" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="8" y="5" width="3" height="3" fill="#fffaf0" />
            <rect x="20" y="3" width="6" height="6" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="21" y="5" width="3" height="3" fill="#fffaf0" />
            {/* Head voxel */}
            <rect x="7" y="8" width="18" height="15" fill="#f97316" stroke="#1f2937" strokeWidth="2" />
            {/* Muzzle cheeks (white side panels) */}
            <rect x="8" y="15" width="5" height="7" fill="#fffaf0" />
            <rect x="19" y="15" width="5" height="7" fill="#fffaf0" />
            {/* Tiny black nose */}
            <rect x="15" y="17" width="2" height="2" fill="#1f2937" />
            {/* Eyes (Cute closed eyes '^' style) */}
            <rect x="10" y="12" width="3" height="1" fill="#1f2937" />
            <rect x="11" y="11" width="1" height="1" fill="#1f2937" />
            <rect x="19" y="12" width="3" height="1" fill="#1f2937" />
            <rect x="20" y="11" width="1" height="1" fill="#1f2937" />
            {/* Pink cheeks */}
            <rect x="8" y="14" width="2" height="1.5" fill="#fca5a5" />
            <rect x="22" y="14" width="2" height="1.5" fill="#fca5a5" />
            {/* Body */}
            <rect x="9" y="23" width="14" height="6" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="11" y="23" width="10" height="6" fill="#fffaf0" />
          </svg>
        );
      case 'tien': // Tiên sprite (Chestnut brown ponytail hair, emerald green hair bow, sky blue dress)
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Hair base */}
            <rect x="7" y="2" width="18" height="9" fill="#a16207" />
            {/* Ponytail extension */}
            <rect x="4" y="6" width="4" height="12" fill="#a16207" />
            <rect x="3" y="9" width="2" height="8" fill="#854d0e" />
            {/* Hair highlight */}
            <rect x="9" y="3" width="10" height="1" fill="#ca8a04" />
            {/* Green bow */}
            <rect x="5" y="4" width="2" height="3" fill="#10b981" />
            <rect x="7" y="5" width="1" height="1" fill="#a7f3d0" />
            <rect x="8" y="4" width="2" height="3" fill="#10b981" />
            {/* Face */}
            <rect x="8" y="8" width="16" height="15" fill="#ffedd5" stroke="#1f2937" strokeWidth="2" />
            <rect x="22" y="9" width="2" height="13" fill="#fed7aa" />
            {/* Bangs */}
            <rect x="9" y="8" width="2" height="3" fill="#a16207" />
            <rect x="15" y="8" width="2" height="3" fill="#a16207" />
            <rect x="21" y="8" width="2" height="3" fill="#a16207" />
            {/* Eyes */}
            <rect x="10" y="13" width="2" height="3" fill="#1f2937" />
            <rect x="20" y="13" width="2" height="3" fill="#1f2937" />
            <rect x="9" y="12" width="4" height="1" fill="#78350f" />
            <rect x="19" y="12" width="4" height="1" fill="#78350f" />
            <rect x="11" y="13" width="1" height="1" fill="#ffffff" />
            <rect x="21" y="13" width="1" height="1" fill="#ffffff" />
            {/* Cheek blush */}
            <rect x="7" y="16" width="3" height="2" fill="#fda4af" />
            <rect x="22" y="16" width="3" height="2" fill="#fda4af" />
            {/* Lips */}
            <rect x="14" y="18" width="3" height="1" fill="#db2777" />
            {/* Neck & Star necklace */}
            <rect x="13" y="23" width="6" height="1" fill="#ffedd5" />
            <rect x="15" y="23.5" width="2" height="1" fill="#fbbf24" />
            {/* Outfit - Blue top */}
            <rect x="8" y="24" width="16" height="6" fill="#38bdf8" stroke="#1f2937" strokeWidth="2" />
            <rect x="22" y="25" width="2" height="4" fill="#0284c7" />
            <rect x="6" y="24" width="3" height="3" fill="#38bdf8" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="23" y="24" width="3" height="3" fill="#38bdf8" stroke="#1f2937" strokeWidth="1.5" />
          </svg>
        );
      case 'ngoc': // Ngọc sprite (Short purple bob hair, yellow star clip, yellow and orange floral top)
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Short purple hair */}
            <rect x="7" y="3" width="18" height="9" fill="#a855f7" />
            <rect x="6" y="9" width="2" height="8" fill="#a855f7" />
            <rect x="24" y="9" width="2" height="8" fill="#a855f7" />
            {/* Hair highlight */}
            <rect x="10" y="4" width="12" height="1" fill="#c084fc" />
            {/* Star clip */}
            <rect x="22" y="5" width="2" height="2" fill="#facc15" />
            {/* Face */}
            <rect x="8" y="8" width="16" height="15" fill="#ffedd5" stroke="#1f2937" strokeWidth="2" />
            <rect x="22" y="9" width="2" height="13" fill="#fed7aa" />
            {/* Straight bangs */}
            <rect x="8" y="8" width="16" height="3" fill="#a855f7" />
            {/* Eyes */}
            <rect x="10" y="13" width="2" height="3" fill="#1f2937" />
            <rect x="20" y="13" width="2" height="3" fill="#1f2937" />
            <rect x="11" y="13" width="1" height="1" fill="#ffffff" />
            <rect x="21" y="13" width="1" height="1" fill="#ffffff" />
            {/* Cheek blush */}
            <rect x="7" y="16" width="3" height="2" fill="#fda4af" />
            <rect x="22" y="16" width="3" height="2" fill="#fda4af" />
            {/* Open smile mouth */}
            <rect x="14" y="18" width="4" height="2" fill="#ef4444" stroke="#1f2937" strokeWidth="1" />
            {/* Neck */}
            <rect x="13" y="23" width="6" height="1" fill="#ffedd5" />
            {/* Yellow Top */}
            <rect x="8" y="24" width="16" height="6" fill="#fde047" stroke="#1f2937" strokeWidth="2" />
            <rect x="22" y="25" width="2" height="4" fill="#eab308" />
            {/* Orange flower dots */}
            <rect x="11" y="26" width="1" height="1" fill="#f97316" />
            <rect x="19" y="26" width="1" height="1" fill="#f97316" />
          </svg>
        );
      case 'vy':
        // falls through to default Lan Vy sprite
      default: // Lan Vy sprite (Long layered black hair with highlights, red bow, anime eyes, floral top)
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Hair Voxel base */}
            <rect x="6" y="2" width="20" height="9" fill="#18181b" />
            {/* Shaggy long hair side panels */}
            <rect x="4" y="10" width="4" height="14" fill="#18181b" />
            <rect x="24" y="10" width="4" height="14" fill="#18181b" />
            <rect x="3" y="13" width="2" height="8" fill="#18181b" />
            <rect x="27" y="13" width="2" height="8" fill="#18181b" />
            {/* Hair 3D shade right edge */}
            <rect x="25" y="3" width="1" height="8" fill="#09090b" />
            <rect x="26" y="10" width="2" height="14" fill="#09090b" />
            {/* Hair silky highlights on top */}
            <rect x="8" y="3" width="12" height="1" fill="#52525b" />
            
            {/* Cute red hair bow on the left side */}
            <rect x="5" y="4" width="2" height="2" fill="#ef4444" />
            <rect x="7" y="5" width="1" height="1" fill="#fecdd3" /> {/* knot */}
            <rect x="8" y="4" width="2" height="2" fill="#ef4444" />

            {/* Face Voxel (Soft peach skin) */}
            <rect x="8" y="8" width="16" height="15" fill="#ffedd5" stroke="#1f2937" strokeWidth="2" />
            {/* Face 3D shade edge */}
            <rect x="22" y="9" width="2" height="13" fill="#fed7aa" />
            {/* Wispy/airy bangs */}
            <rect x="9" y="8" width="1" height="4" fill="#18181b" />
            <rect x="12" y="8" width="2" height="3" fill="#18181b" />
            <rect x="16" y="8" width="1" height="4" fill="#18181b" />
            <rect x="20" y="8" width="2" height="3" fill="#18181b" />
            
            {/* Eyes (Anime double eyelids with eyelashes & shiny highlights) */}
            <rect x="10" y="13" width="2" height="3" fill="#1f2937" />
            <rect x="20" y="13" width="2" height="3" fill="#1f2937" />
            <rect x="9" y="12" width="4" height="1" fill="#78350f" />
            <rect x="19" y="12" width="4" height="1" fill="#78350f" />
            <rect x="9" y="13" width="1" height="1" fill="#1f2937" /> {/* Lash wing */}
            <rect x="21" y="13" width="1" height="1" fill="#1f2937" /> {/* Lash wing */}
            <rect x="11" y="13" width="1" height="1" fill="#ffffff" /> {/* Eye glint */}
            <rect x="21" y="13" width="1" height="1" fill="#ffffff" /> {/* Eye glint */}

            {/* Pink blush cheeks */}
            <rect x="7" y="16" width="3" height="2" fill="#fda4af" />
            <rect x="22" y="16" width="3" height="2" fill="#fda4af" />
            
            {/* Rosy lips (Tiny sweet smile) */}
            <rect x="14" y="18" width="3" height="1" fill="#db2777" />
            <rect x="15" y="19" width="1" height="1" fill="#db2777" />

            {/* Neckline & Red Heart Pendant Necklace */}
            <rect x="13" y="23" width="6" height="1" fill="#ffedd5" />
            <rect x="14.5" y="23.5" width="2" height="1" fill="#ef4444" /> {/* Heart pendant */}

            {/* Body (White puff top) */}
            <rect x="8" y="24" width="16" height="6" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
            <rect x="22" y="25" width="2" height="4" fill="#e4e4e7" /> {/* Body 3D shade */}
            {/* Puff sleeves */}
            <rect x="6" y="24" width="3" height="4" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="23" y="24" width="3" height="4" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="24" y="25" width="1" height="2" fill="#e4e4e7" />
            {/* Floral dots */}
            <rect x="10" y="26" width="1" height="1" fill="#f43f5e" />
            <rect x="19" y="25" width="1" height="1" fill="#f43f5e" />
            <rect x="15" y="27" width="1" height="1" fill="#f59e0b" />
          </svg>
        );
    }
  };

  // Visual 3D Isometric Voxel Boba Cup rendering
  const renderBobaCup = () => {
    const hasMilkTea = selectedIngredients.includes('奶茶');
    const hasGreenTea = selectedIngredients.includes('绿茶');
    const hasBlackTea = selectedIngredients.includes('红茶');
    const hasOolong = selectedIngredients.includes('乌龙茶');
    
    const hasTea = hasMilkTea || hasGreenTea || hasBlackTea || hasOolong;
    const hasBoba = selectedIngredients.includes('珍珠');
    const hasJelly = selectedIngredients.includes('椰果');
    const hasPudding = selectedIngredients.includes('布丁');
    const hasRedBean = selectedIngredients.includes('红豆');
    const hasIce = selectedIngredients.includes('少冰') || selectedIngredients.includes('多冰');
    
    // New fruit & foam variables
    const hasMilkFoam = selectedIngredients.includes('奶盖');
    const hasMango = selectedIngredients.includes('芒果');
    const hasPeach = selectedIngredients.includes('桃子');
    const hasStrawberry = selectedIngredients.includes('草莓');
    const hasLemon = selectedIngredients.includes('柠檬');

    // Liquid fill colors (Body & Top isometric face shading)
    let liquidColor = 'transparent';
    let liquidTopColor = 'transparent';
    if (hasMilkTea) {
      liquidColor = '#e3c6a1';
      liquidTopColor = '#f3ddc2';
    } else if (hasGreenTea) {
      liquidColor = '#a3e635';
      liquidTopColor = '#bef264';
    } else if (hasBlackTea) {
      liquidColor = '#f87171';
      liquidTopColor = '#fca5a5';
    } else if (hasOolong) {
      liquidColor = '#fb923c';
      liquidTopColor = '#fed7aa';
    }

    return (
      <svg viewBox="0 0 64 100" className="w-28 h-44 mx-auto">
        {/* 3D Glass Cup back rim ellipse */}
        <ellipse cx="32" cy="15" rx="20" ry="6" fill="transparent" stroke="#1f2937" strokeWidth="2.5" opacity="0.3" />
        
        {/* 3D Liquid Volume */}
        {hasTea && (
          <>
            {/* Liquid main cylinder body */}
            <path d="M13.7 35 L19 83 A13.5 4.2 0 0 0 45 83 L50.3 35 A18.3 5.5 0 0 1 13.7 35 Z" fill={liquidColor} />
            {/* Liquid top isometric ellipse */}
            <ellipse cx="32" cy="35" rx="18.3" ry="5.5" fill={liquidTopColor} stroke="#1f2937" strokeWidth="1.5" />
          </>
        )}

        {/* 3D Voxel Ice Cubes */}
        {hasIce && (
          <>
            {/* Ice 1 */}
            <g transform="translate(24, 42)">
              <polygon points="0,-3 6,0 0,3 -6,0" fill="#ffffff" stroke="#1f2937" strokeWidth="1.2" />
              <polygon points="-6,0 0,3 0,8 -6,5" fill="#e0f2fe" stroke="#1f2937" strokeWidth="1.2" />
              <polygon points="0,3 6,0 6,5 0,8" fill="#bae6fd" stroke="#1f2937" strokeWidth="1.2" />
            </g>
            {/* Ice 2 */}
            <g transform="translate(38, 54)">
              <polygon points="0,-3 6,0 0,3 -6,0" fill="#ffffff" stroke="#1f2937" strokeWidth="1.2" />
              <polygon points="-6,0 0,3 0,8 -6,5" fill="#e0f2fe" stroke="#1f2937" strokeWidth="1.2" />
              <polygon points="0,3 6,0 6,5 0,8" fill="#bae6fd" stroke="#1f2937" strokeWidth="1.2" />
            </g>
          </>
        )}

        {/* 3D Voxel Pudding */}
        {hasPudding && (
          <g transform="translate(32, 68)">
            <polygon points="0,-4 10,0 0,4 -10,0" fill="#fbbf24" stroke="#1f2937" strokeWidth="1.5" />
            <polygon points="-10,0 0,4 0,14 -10,10" fill="#d97706" stroke="#1f2937" strokeWidth="1.5" />
            <polygon points="0,4 10,0 10,10 0,14" fill="#b45309" stroke="#1f2937" strokeWidth="1.5" />
          </g>
        )}
        
        {/* 3D Red Beans */}
        {hasRedBean && (
          <g fill="#7f1d1d" stroke="#450a0a" strokeWidth="0.8">
            <circle cx="21" cy="78" r="3.2" />
            <circle cx="27" cy="80" r="3.2" />
            <circle cx="37" cy="78" r="3.2" />
            <circle cx="43" cy="77" r="3.2" />
            <circle cx="32" cy="74" r="3.2" />
          </g>
        )}

        {/* 3D Jellies (Stacked blocks) */}
        {hasJelly && (
          <g stroke="#9ca3af" strokeWidth="0.8">
            {/* Jelly 1 */}
            <g transform="translate(23, 72)">
              <polygon points="0,-2 4,0 0,2 -4,0" fill="#ffffff" />
              <polygon points="-4,0 0,2 0,5 -4,3" fill="#f3f4f6" />
              <polygon points="0,2 4,0 4,3 0,5" fill="#e5e7eb" />
            </g>
            {/* Jelly 2 */}
            <g transform="translate(36, 75)">
              <polygon points="0,-2 4,0 0,2 -4,0" fill="#ffffff" />
              <polygon points="-4,0 0,2 0,5 -4,3" fill="#f3f4f6" />
              <polygon points="0,2 4,0 4,3 0,5" fill="#e5e7eb" />
            </g>
          </g>
        )}

        {/* 3D Boba Pearls (Shaded Spheres) */}
        {hasBoba && (
          <g fill="#1f2937">
            {/* Pearl 1 */}
            <circle cx="20" cy="80" r="4" stroke="#111827" strokeWidth="1.2" />
            <circle cx="18.5" cy="78.5" r="1" fill="#9ca3af" />
            {/* Pearl 2 */}
            <circle cx="28" cy="82" r="4" stroke="#111827" strokeWidth="1.2" />
            <circle cx="26.5" cy="80.5" r="1" fill="#9ca3af" />
            {/* Pearl 3 */}
            <circle cx="36" cy="81" r="4" stroke="#111827" strokeWidth="1.2" />
            <circle cx="34.5" cy="79.5" r="1" fill="#9ca3af" />
            {/* Pearl 4 */}
            <circle cx="44" cy="79" r="4" stroke="#111827" strokeWidth="1.2" />
            <circle cx="42.5" cy="77.5" r="1" fill="#9ca3af" />
            {/* Pearl 5 */}
            <circle cx="25" cy="74" r="4" stroke="#111827" strokeWidth="1.2" />
            <circle cx="23.5" cy="72.5" r="1" fill="#9ca3af" />
            {/* Pearl 6 */}
            <circle cx="34" cy="74" r="4" stroke="#111827" strokeWidth="1.2" />
            <circle cx="32.5" cy="72.5" r="1" fill="#9ca3af" />
            {/* Pearl 7 */}
            <circle cx="30" cy="67" r="4" stroke="#111827" strokeWidth="1.2" />
            <circle cx="28.5" cy="65.5" r="1" fill="#9ca3af" />
          </g>
        )}

        {/* Milk Foam Layer */}
        {hasMilkFoam && hasTea && (
          <>
            <path d="M13.7 35 L15.5 28 A19.2 5.8 0 0 1 48.5 28 L50.3 35 A18.3 5.5 0 0 1 13.7 35 Z" fill="#ffffff" />
            <ellipse cx="32" cy="28" rx="19.2" ry="5.8" fill="#fffdfa" stroke="#1f2937" strokeWidth="1.2" />
          </>
        )}

        {/* Floating Fruits */}
        {hasMango && (
          <g fill="#facc15" stroke="#1f2937" strokeWidth="0.8">
            <rect x="22" y="52" width="5" height="5" rx="1" transform="rotate(15 22 52)" />
            <rect x="36" y="60" width="4" height="4" rx="1" transform="rotate(-10 36 60)" />
          </g>
        )}
        {hasPeach && (
          <g fill="#fecdd3" stroke="#1f2937" strokeWidth="0.8">
            <path d="M18 64 A4 4 0 0 1 24 68 Z" />
            <path d="M38 48 A3 3 0 0 1 42 52 Z" transform="rotate(30 38 48)" />
          </g>
        )}
        {hasStrawberry && (
          <g fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.8">
            <path d="M26 48 L29 45 L32 48 L29 52 Z" />
            <path d="M15 58 L17 55 L20 58 L17 62 Z" />
          </g>
        )}
        {hasLemon && (
          <g fill="#fbbf24" stroke="#1f2937" strokeWidth="0.8">
            <circle cx="28" cy="58" r="4.5" fill="#fef08a" stroke="#1f2937" strokeWidth="0.8" />
            <path d="M28 53.5 L28 62.5 M23.5 58 L32.5 58" stroke="#ca8a04" strokeWidth="0.5" />
          </g>
        )}

        {/* 3D Glass Cup walls & front rim */}
        <path d="M12 15 L19 83 A13.5 4.2 0 0 0 45 83 L52 15 A20 6 0 0 1 12 15 Z" fill="transparent" stroke="#1f2937" strokeWidth="3" />
        <ellipse cx="32" cy="15" rx="20" ry="6" fill="transparent" stroke="#1f2937" strokeWidth="3" />

        {/* 3D Straw */}
        <g>
          {/* Main straw shaft */}
          <path d="M28.5 2 L28.5 90 L34.5 90 L34.5 2 Z" fill="#f43f5e" stroke="#1f2937" strokeWidth="1.5" opacity="0.9" />
          {/* 3D shadow stripe */}
          <path d="M31.5 2 L31.5 90 L34.5 90 L34.5 2 Z" fill="#e11d48" opacity="0.4" />
          {/* Straw hollow opening ellipse */}
          <ellipse cx="31.5" cy="2" rx="3" ry="1" fill="#be123c" stroke="#1f2937" strokeWidth="1.5" />
        </g>
      </svg>
    );
  };

  // MAIN LAYOUT
  if (!user) {
    return (
      <AuthPortal
        onAuthenticated={handleOnlineAuthenticated}
        onOffline={handleOfflinePlay}
      />
    );
  }

  if (gameArea === 'world') {
    return (
      <OpenWorldGame
        playerName={characterName}
        score={score}
        coins={coins}
        avatarConfig={avatarConfig}
        onAvatarChange={(nextAvatar) => {
          setAvatarConfig(nextAvatar);
          localStorage.setItem('hsk_avatar_config_v1', JSON.stringify(nextAvatar));
        }}
        onEnterBoba={() => setGameArea('boba')}
        onLogout={() => void handleLogout()}
        onReward={(scoreReward, coinReward) => {
          const nextScore = score + scoreReward;
          const nextCoins = coins + coinReward;
          setScore(nextScore);
          setCoins(nextCoins);
          void saveProgress(nextScore, nextCoins, currentLevel);
        }}
      />
    );
  }

  return (
    <main onClick={handleScreenClick} className="min-h-screen bg-[#fffdf8] p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      {/* Header bar */}
      <div className="w-full max-w-4xl bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setGameArea("world")} className="mr-1 flex h-9 w-9 items-center justify-center border-2 border-[#1f2937] bg-white font-black shadow-[2px_2px_0_#1f2937]" title="Ra thị trấn" aria-label="Ra thị trấn"><ArrowLeftIcon /></button>
          <div className="w-8 h-8 rounded-full bg-[#f59e0b] border-2 border-[#1f2937] flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_#1f2937]">
            T
          </div>
          <div>
            <h1 className="font-serif font-black text-lg text-[#111827]">Tiệm Trà Sữa Của {characterName}</h1>
            <p className="text-xs text-[#5b6474] font-medium flex items-center gap-1">
              Bà chủ: <span className="font-bold text-[#1e3b8b]">{characterName}</span> ({user.username})
              <button 
                onClick={() => {
                  setNewNameInput(characterName);
                  setShowChangeNameModal(true);
                }} 
                className="text-xs text-[#0ea5e9] hover:underline border-none bg-transparent cursor-pointer ml-1 font-bold flex items-center gap-0.5"
                title="Đổi tên nhân vật"
              >
                {renderPencilIcon("w-3 h-3")} Đổi tên
              </button>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Level HSK Selector */}
          <div className="bg-[#fffdf8] border-2 border-[#1f2937] p-1.5 rounded-lg shadow-[2px_2px_0px_#1f2937] flex items-center gap-1">
            <span className="text-[10px] font-black text-[#5b6474] uppercase px-1">HSK:</span>
            {[
              { val: 1, label: "1-2-3" },
              { val: 2, label: "4" },
              { val: 3, label: "5-6" }
            ].map((lvl) => (
              <button
                key={lvl.val}
                onClick={async () => {
                  setCurrentLevel(lvl.val);
                  const idx = orders.findIndex(o => o.level === lvl.val);
                  if (idx !== -1) {
                    setCurrentOrderIndex(idx);
                  }
                  setSelectedIngredients([]);
                  await saveProgress(score, coins, lvl.val, null);
                }}
                className={`px-2 py-1 rounded text-xs font-black transition-all cursor-pointer border
                  ${currentLevel === lvl.val 
                    ? 'bg-[#f59e0b] text-[#111827] border-[#1f2937] shadow-[1px_1px_0px_#1f2937]' 
                    : 'bg-white hover:bg-gray-100 text-[#5b6474] border-transparent'}`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          <div className="bg-[#fffdf8] border-2 border-[#1f2937] px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#1f2937] text-center min-w-[80px]">
            <span className="text-[10px] font-black text-[#5b6474] uppercase block">Điểm số {comboCount > 1 ? ' · x' + comboCount : ''}</span>
            <span className="text-base font-black text-[#0ea5e9]">{score}</span>
          </div>

          <div className="bg-[#fffdf8] border-2 border-[#1f2937] px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#1f2937] text-center min-w-[80px]">
            <span className="text-[10px] font-black text-[#5b6474] uppercase block">Xu vàng</span>
            <span className="text-base font-black text-[#16a34a]">${coins}</span>
          </div>

          <button
            onClick={() => setShowVoucherWallet(true)}
            className="px-3 py-2 bg-[#f59e0b] border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Quà tặng ({unlockedVouchers.length})
          </button>

          <button
            onClick={() => {
              setShowVocabModal(true);
              setVocabTab('list');
              setCurrentFlashcardIdx(0);
              setFlashcardFlipped(false);
            }}
            className="px-3 py-2 bg-[#0ea5e9] text-white border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Sổ tay HSK
          </button>

          <button
            onClick={() => setShowCoinShop(true)}
            className="px-3 py-2 bg-[#16a34a] text-white border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cửa hàng ({coins} xu)
          </button>

          {user?.email?.toLowerCase() === 'ungnhutkhang53@gmail.com' && (
            <button
              onClick={handleOpenAdminLogs}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
            >
              {renderChartIcon("w-3.5 h-3.5")} Logs Admin
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-2.5 py-2 bg-[#dc2626] text-white border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase shadow-[2px_2px_0px_#1f2937] hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
          >
            Thoát
          </button>
        </div>
      </div>

      {loadingProgress ? (
        <div className="py-20 text-center">
          <p className="font-bold text-[#5b6474] animate-pulse">Đang tải tiến trình học tập...</p>
        </div>
      ) : !currentOrder ? (
        <div className="w-full max-w-4xl bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-12 text-center">
          <h2 className="text-3xl font-serif font-black text-[#16a34a] mb-4">Chúc mừng em đã hoàn thành xuất sắc!</h2>
          <p className="text-[#5b6474] font-bold mb-6">Em đã chinh phục toàn bộ 9 cấp độ học trà sữa tiếng Trung rồi nhé! Cùng mở ví quà tặng để xem phần thưởng của anh nha!</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setShowVoucherWallet(true)}
              className="px-6 py-3.5 bg-[#f59e0b] border-2 border-[#1f2937] rounded-xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#1f2937] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              MỞ VÍ QUÀ TẶNG CỦA ANH
            </button>
            <button
              onClick={handleRestartGame}
              className="px-6 py-3.5 bg-[#ca8a04] hover:bg-[#a16207] text-white border-2 border-[#1f2937] rounded-xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#1f2937] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              CHƠI LẠI TỪ ĐẦU
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Columns: 2D Shop Map & Active Station Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Order & Level Badge Info */}
            <div className="w-full flex justify-between items-center bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[4px_4px_0px_#1f2937] rounded-xl p-3">
              <span className="bg-[#f59e0b] text-[#111827] border-2 border-[#1f2937] shadow-[1.5px_1.5px_0px_#1f2937] font-black text-[9px] px-2.5 py-1 rounded uppercase tracking-wider">
                Order {currentOrderIndex + 1}/9
              </span>
              <span className="bg-[#0ea5e9] text-[#111827] border-2 border-[#1f2937] shadow-[1.5px_1.5px_0px_#1f2937] font-black text-[9px] px-2.5 py-1 rounded uppercase tracking-wider">
                Cấp độ: {currentOrder.level === 1 ? 'Dễ (HSK3)' : currentOrder.level === 2 ? 'Trung (HSK4/5)' : 'Khó (HSK5/6 & Love)'}
              </span>
            </div>

            {/* Cozy 2D Shop Map Panel */}
            <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-4 flex flex-col items-center">
              
              {/* Cozy 2D Grid map render */}
              <div className="w-full h-[400px] md:h-[450px] bg-[#eed9b3] border-[3px] border-[#1f2937] shadow-[4px_4px_0px_#1f2937] rounded-xl relative overflow-hidden select-none cozy-wood-floor">
                <div className="grid grid-cols-12 grid-rows-10 w-full h-full">
                  {Array.from({ length: 120 }).map((_, idx) => {
                    const x = idx % 12;
                    const y = Math.floor(idx / 12);
                    
                    let bgClass = "cozy-wood-tile"; 
                    let cellContent = null;

                    if (y === 0) {
                      bgClass = "cozy-brick-wall";
                    } else if (y === 9) {
                      bgClass = "bg-[#78350f] border-t-4 border-[#1f2937]";
                    } else if (x === 0 || x === 11) {
                      bgClass = "bg-[#4b5563] border-x border-[#1f2937]";
                    } else if (y === 2) {
                      if (x === 2) {
                        bgClass = "bg-[#ca8a04] border-2 border-[#1f2937] flex items-center justify-center shadow-[inset_1px_1px_4px_rgba(0,0,0,0.3)]";
                        cellContent = renderTeaIcon("w-9 h-9");
                      } else if (x === 4) {
                        bgClass = "bg-[#ca8a04] border-2 border-[#1f2937] flex items-center justify-center shadow-[inset_1px_1px_4px_rgba(0,0,0,0.3)]";
                        cellContent = renderToppingIcon("w-9 h-9");
                      } else if (x === 6) {
                        bgClass = "bg-[#ca8a04] border-2 border-[#1f2937] flex items-center justify-center shadow-[inset_1px_1px_4px_rgba(0,0,0,0.3)]";
                        cellContent = renderFruitIcon("w-9 h-9");
                      } else if (x === 8) {
                        bgClass = "bg-[#ca8a04] border-2 border-[#1f2937] flex items-center justify-center shadow-[inset_1px_1px_4px_rgba(0,0,0,0.3)]";
                        cellContent = renderIceIcon("w-9 h-9");
                      } else if (x === 10) {
                        bgClass = "bg-[#854d0e] border-2 border-[#1f2937] flex items-center justify-center shadow-[inset_1px_1px_4px_rgba(0,0,0,0.3)]";
                        cellContent = renderBookshelfIcon("w-9 h-9");
                      }
                    } else if (y === 6 && x === 2) {
                      bgClass = "bg-[#ca8a04] border-2 border-[#1f2937] flex items-center justify-center shadow-[inset_1px_1px_4px_rgba(0,0,0,0.3)]";
                      cellContent = renderShakerIcon("w-9 h-9");
                    } else if (y === 6 && x === 9) {
                      bgClass = "bg-[#f59e0b] border-2 border-[#1f2937] flex items-center justify-center shadow-[inset_1px_1px_4px_rgba(0,0,0,0.3)]";
                      cellContent = renderRegisterIcon("w-9 h-9");
                    } else if (y === 4 && x >= 2 && x <= 9) {
                      bgClass = "bg-[#78350f] border-t-2 border-b-2 border-x border-[#1f2937] shadow-md";
                    }

                    const isCustomerCell = y === 3 && x === 5;

                    return (
                      <div 
                        key={idx} 
                        onClick={() => handleCellClick(x, y)}
                        className={`${bgClass} relative cursor-pointer hover:brightness-105 flex items-center justify-center`}
                      >
                        {cellContent}
                        {isCustomerCell && currentOrder && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 scale-125">
                            {renderCustomerSVG(currentOrder.customerSprite)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Player Character */}
                <div 
                  className="absolute transition-all duration-150 ease-out flex flex-col items-center z-20 pointer-events-none"
                  style={{ 
                    left: `${(playerPos.x / 12) * 100}%`, 
                    top: `${(playerPos.y / 10) * 100}%`,
                    width: `${100 / 12}%`,
                    height: `${100 / 10}%`
                  }}
                >
                  <div className="w-12 h-12 -mt-4">
                    {renderPlayerAvatar()}
                  </div>
                </div>
              </div>

              {/* Interaction Guide Banner */}
              {(() => {
                const station = getNearbyStation();
                if (station) {
                  return (
                    <button
                      onClick={handleInteract}
                      className="w-full mt-3 p-2 bg-[#fde047] hover:bg-[#facc15] text-[#111827] font-black text-xs uppercase tracking-wider border-2 border-[#1f2937] rounded-lg shadow-[2px_2px_0px_#1f2937] active:scale-[0.98] transition-all animate-pulse cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {renderNextIcon("w-3.5 h-3.5")} Bấm vào đây hoặc nhấn SPACE để mở {station.label}!
                    </button>
                  );
                }
                return (
                  <p className="text-[10px] font-bold text-[#5b6474] mt-3 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-center w-full">
                    Hướng dẫn: Dùng phím WASD / Phím mũi tên để di chuyển Lan Vy, hoặc Click chuột trực tiếp lên quầy để đi nhanh.
                  </p>
                );
              })()}
            </div>

            {/* Active Station Panel */}
            <div className="w-full">
              {(() => {
                if (activeStation === 'tea') {
                  const teaBases = INGREDIENTS.filter(i => i.category === 'base');
                  return (
                    <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-5 w-full">
                      <div className="flex justify-between items-center mb-3 border-b-2 border-dashed border-[#1f2937] pb-2">
                        <h4 className="font-serif font-black text-sm text-[#111827] flex items-center gap-1.5">
                          {renderTeaIcon("w-5 h-5")} Quầy Trà Nền (Bases)
                        </h4>
                        <button 
                          onClick={() => setActiveStation(null)}
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 border-2 border-[#1f2937] rounded-md text-[9px] font-black uppercase shadow-[1px_1px_0px_#1f2937] cursor-pointer"
                        >
                          Quay lại đi bộ
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {teaBases.map((ing) => {
                          const isSelected = selectedIngredients.includes(ing.nameChinese);
                          return (
                            <button
                              key={ing.id}
                              onClick={() => toggleIngredient(ing.nameChinese)}
                              className={`p-3 border-2 border-[#1f2937] rounded-lg font-black text-center flex flex-col justify-center items-center transition-all cursor-pointer shadow-[2px_2px_0px_#1f2937] active:translate-y-0.5 active:shadow-none
                                ${isSelected ? 'bg-[#f59e0b] text-[#111827] -translate-y-0.5 shadow-[3px_3px_0px_#1f2937]' : 'bg-white text-[#111827] hover:-translate-y-0.5'}`}
                            >
                              <span className="text-lg font-serif">{ing.nameChinese}</span>
                              <span className="text-[10px] text-[#5b6474] font-bold mt-0.5 uppercase">{ing.nameVietnamese}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                if (activeStation === 'topping') {
                  const toppings = INGREDIENTS.filter(i => i.category === 'topping' || i.category === 'foam');
                  return (
                    <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-5 w-full">
                      <div className="flex justify-between items-center mb-3 border-b-2 border-dashed border-[#1f2937] pb-2">
                        <h4 className="font-serif font-black text-sm text-[#111827] flex items-center gap-1.5">
                          {renderToppingIcon("w-5 h-5")} Quầy Topping & Kem Sữa
                        </h4>
                        <button 
                          onClick={() => setActiveStation(null)}
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 border-2 border-[#1f2937] rounded-md text-[9px] font-black uppercase shadow-[1px_1px_0px_#1f2937] cursor-pointer"
                        >
                          Quay lại đi bộ
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {toppings.map((ing) => {
                          const isSelected = selectedIngredients.includes(ing.nameChinese);
                          return (
                            <button
                              key={ing.id}
                              onClick={() => toggleIngredient(ing.nameChinese)}
                              className={`p-3 border-2 border-[#1f2937] rounded-lg font-black text-center flex flex-col justify-center items-center transition-all cursor-pointer shadow-[2px_2px_0px_#1f2937] active:translate-y-0.5 active:shadow-none
                                ${isSelected ? 'bg-[#f59e0b] text-[#111827] -translate-y-0.5 shadow-[3px_3px_0px_#1f2937]' : 'bg-white text-[#111827] hover:-translate-y-0.5'}`}
                            >
                              <span className="text-lg font-serif">{ing.nameChinese}</span>
                              <span className="text-[9px] text-[#5b6474] font-bold mt-0.5 uppercase tracking-tighter">{ing.nameVietnamese}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                if (activeStation === 'fruit') {
                  const fruits = INGREDIENTS.filter(i => i.category === 'fruit');
                  return (
                    <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-5 w-full">
                      <div className="flex justify-between items-center mb-3 border-b-2 border-dashed border-[#1f2937] pb-2">
                        <h4 className="font-serif font-black text-sm text-[#111827] flex items-center gap-1.5">
                          {renderFruitIcon("w-5 h-5")} Quầy Trái Cây (Fruits)
                        </h4>
                        <button 
                          onClick={() => setActiveStation(null)}
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 border-2 border-[#1f2937] rounded-md text-[9px] font-black uppercase shadow-[1px_1px_0px_#1f2937] cursor-pointer"
                        >
                          Quay lại đi bộ
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {fruits.map((ing) => {
                          const isSelected = selectedIngredients.includes(ing.nameChinese);
                          return (
                            <button
                              key={ing.id}
                              onClick={() => toggleIngredient(ing.nameChinese)}
                              className={`p-3 border-2 border-[#1f2937] rounded-lg font-black text-center flex flex-col justify-center items-center transition-all cursor-pointer shadow-[2px_2px_0px_#1f2937] active:translate-y-0.5 active:shadow-none
                                ${isSelected ? 'bg-[#f59e0b] text-[#111827] -translate-y-0.5 shadow-[3px_3px_0px_#1f2937]' : 'bg-white text-[#111827] hover:-translate-y-0.5'}`}
                            >
                              <span className="text-lg font-serif">{ing.nameChinese}</span>
                              <span className="text-[10px] text-[#5b6474] font-bold mt-0.5 uppercase">{ing.nameVietnamese}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                if (activeStation === 'sugar_ice') {
                  const sugars = INGREDIENTS.filter(i => i.category === 'sugar');
                  const ices = INGREDIENTS.filter(i => i.category === 'ice');
                  return (
                    <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-5 w-full space-y-4">
                      <div className="flex justify-between items-center border-b-2 border-dashed border-[#1f2937] pb-2">
                        <h4 className="font-serif font-black text-sm text-[#111827] flex items-center gap-1.5">
                          {renderIceIcon("w-5 h-5")} Quầy Lượng Đường & Đá
                        </h4>
                        <button 
                          onClick={() => setActiveStation(null)}
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 border-2 border-[#1f2937] rounded-md text-[9px] font-black uppercase shadow-[1px_1px_0px_#1f2937] cursor-pointer"
                        >
                          Quay lại đi bộ
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-[10px] font-black text-gray-400 uppercase mb-2">Chọn mức Đường (Sugar):</h5>
                          <div className="grid grid-cols-3 gap-2">
                            {sugars.map((ing) => {
                              const isSelected = selectedIngredients.includes(ing.nameChinese);
                              return (
                                <button
                                  key={ing.id}
                                  onClick={() => toggleIngredient(ing.nameChinese)}
                                  className={`p-2 border-2 border-[#1f2937] rounded-lg font-black text-xs text-center transition-all cursor-pointer shadow-[1.5px_1.5px_0px_#1f2937] active:translate-y-0.5 active:shadow-none
                                    ${isSelected ? 'bg-[#fef08a] text-[#111827]' : 'bg-white text-[#111827] hover:bg-yellow-50'}`}
                                >
                                  <div className="font-serif">{ing.nameChinese}</div>
                                  <div className="text-[9px] text-gray-400 font-bold">{ing.nameVietnamese}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-[10px] font-black text-gray-400 uppercase mb-2">Chọn mức Đá (Ice):</h5>
                          <div className="grid grid-cols-3 gap-2">
                            {ices.map((ing) => {
                              const isSelected = selectedIngredients.includes(ing.nameChinese);
                              return (
                                <button
                                  key={ing.id}
                                  onClick={() => toggleIngredient(ing.nameChinese)}
                                  className={`p-2 border-2 border-[#1f2937] rounded-lg font-black text-xs text-center transition-all cursor-pointer shadow-[1.5px_1.5px_0px_#1f2937] active:translate-y-0.5 active:shadow-none
                                    ${isSelected ? 'bg-[#bfdbfe] text-[#111827]' : 'bg-white text-[#111827] hover:bg-blue-50'}`}
                                >
                                  <div className="font-serif">{ing.nameChinese}</div>
                                  <div className="text-[9px] text-gray-400 font-bold">{ing.nameVietnamese}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (activeStation === 'order') {
                  return (
                    <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-5 w-full space-y-4">
                      <div className="flex justify-between items-center border-b-2 border-dashed border-[#1f2937] pb-2">
                        <h4 className="font-serif font-black text-sm text-[#111827] flex items-center gap-1.5">
                          {renderRegisterIcon("w-5 h-5")} Gọi món & Phục vụ (Order)
                        </h4>
                        <button 
                          onClick={() => setActiveStation(null)}
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 border-2 border-[#1f2937] rounded-md text-[9px] font-black uppercase shadow-[1px_1px_0px_#1f2937] cursor-pointer"
                        >
                          Quay lại đi bộ
                        </button>
                      </div>

                      <div className="w-full bg-white border-2 border-[#1f2937] p-4 rounded-xl shadow-[3px_3px_0px_#1f2937] relative text-center">
                        <h3 className="text-xl md:text-2xl font-black text-[#111827] leading-relaxed select-all">
                          {currentOrder.orderChinese}
                        </h3>
                        {showPinyin && (
                          <p className="text-sm font-bold text-[#0ea5e9] mt-2 font-mono select-all">
                            {currentOrder.orderPinyin}
                          </p>
                        )}
                        {showTranslation && (
                          <p className="text-xs font-bold text-[#5b6474] mt-2 italic select-all">
                            {currentOrder.orderVietnamese}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 justify-center flex-wrap">
                        <button
                          onClick={playAudio}
                          className={`p-2 rounded-lg border-2 border-[#1f2937] font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_#1f2937] cursor-pointer flex items-center gap-1
                            ${isPlayingAudio ? 'bg-[#16a34a] text-white' : 'bg-white text-[#111827]'}`}
                        >
                          {renderAudioIcon("w-3.5 h-3.5")} Nghe đọc
                        </button>
                        <button
                          onClick={() => setShowPinyin(prev => !prev)}
                          className={`p-2 rounded-lg border-2 border-[#1f2937] font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_#1f2937] cursor-pointer
                            ${showPinyin ? 'bg-[#f59e0b] text-[#111827]' : 'bg-white text-[#111827]'}`}
                        >
                          Phiên âm
                        </button>
                        <button
                          onClick={() => setShowTranslation(prev => !prev)}
                          className={`p-2 rounded-lg border-2 border-[#1f2937] font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_#1f2937] cursor-pointer
                            ${showTranslation ? 'bg-[#f59e0b] text-[#111827]' : 'bg-white text-[#111827]'}`}
                        >
                          Dịch nghĩa
                        </button>
                        <button
                          onClick={() => handleExplainWord(currentOrder.orderChinese)}
                          className="p-2 rounded-lg border-2 border-[#1f2937] bg-[#0ea5e9] text-white font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_#1f2937] cursor-pointer flex items-center gap-1"
                        >
                          AI Giải Thích
                        </button>
                        <button
                          onClick={() => setShowChatWithCustomer(prev => !prev)}
                          className={`p-2 rounded-lg border-2 border-[#1f2937] font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_#1f2937] cursor-pointer flex items-center gap-1
                            ${showChatWithCustomer ? 'bg-[#a855f7] text-white' : 'bg-white text-[#111827]'}`}
                        >
                          Trò chuyện
                        </button>
                        <button
                          onClick={handleNextCustomer}
                          className="p-2 rounded-lg border-2 border-[#1f2937] bg-white text-[#1f2937] font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_#1f2937] cursor-pointer flex items-center gap-1"
                        >
                          {renderNextIcon("w-3.5 h-3.5")} Khách tiếp
                        </button>
                      </div>

                      {/* Customer Chat Logs Box */}
                      {showChatWithCustomer && (
                        <div className="bg-[#fffdf8] border-2 border-[#1f2937] p-3.5 rounded-xl space-y-3 flex flex-col max-h-[220px] overflow-hidden">
                          <h5 className="text-[10px] font-black text-purple-700 uppercase tracking-wider flex items-center gap-1">
                            Nhắn tin cùng {currentOrder.customerName}
                          </h5>
                          
                          {/* Messages list */}
                          <div className="flex-1 overflow-y-auto space-y-2 text-xs pr-1">
                            {chatHistory.length === 0 ? (
                              <div className="text-gray-400 italic text-center py-4">Bắt đầu câu chuyện với khách hàng...</div>
                            ) : (
                              chatHistory.map((chat, idx) => (
                                <div key={idx} className={`flex flex-col ${chat.sender === 'player' ? 'items-end' : 'items-start'}`}>
                                  <div className={`p-2 rounded-lg max-w-[85%] border border-[#1f2937] font-bold text-[11px] leading-relaxed
                                    ${chat.sender === 'player' ? 'bg-[#e9f5ff] text-[#111827] rounded-tr-none' : 'bg-white text-[#111827] rounded-tl-none'}`}
                                  >
                                    <div className={chat.sender === 'customer' ? 'font-serif text-sm' : ''}>{chat.text}</div>
                                    {chat.pinyin && <div className="text-[9px] text-[#0ea5e9] font-mono mt-0.5">{chat.pinyin}</div>}
                                    {chat.translation && <div className="text-[9px] text-[#5b6474] italic mt-0.5">{chat.translation}</div>}
                                  </div>
                                </div>
                              ))
                            )}
                            {isChatting && (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 animate-pulse">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                <span>{currentOrder.customerName} đang gõ...</span>
                              </div>
                            )}
                          </div>

                          {/* Chat input box */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendChatMessage();
                              }}
                              placeholder="Nhắn tin (bằng tiếng Trung hoặc tiếng Việt)..."
                              className="flex-1 px-3 py-1.5 border border-[#1f2937] bg-white rounded-lg text-[11px] font-bold focus:outline-none shadow-[1.5px_1.5px_0px_#1f2937]"
                              maxLength={100}
                              disabled={isChatting}
                            />
                            <button
                              onClick={handleSendChatMessage}
                              disabled={isChatting || !chatInput.trim()}
                              className="px-3 py-1.5 bg-[#a855f7] text-white border-2 border-[#1f2937] rounded-lg font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_#1f2937] disabled:opacity-50 active:translate-y-0.5 active:shadow-none cursor-pointer"
                            >
                              Gửi
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Luyện nói */}
                      <div className="bg-[#fffdf8] border-2 border-[#1f2937] p-3.5 rounded-xl flex items-center justify-between gap-4">
                        <div>
                          <h5 className="text-xs font-black text-[#111827] uppercase flex items-center gap-1">{renderMicIcon("w-4 h-4")} Luyện nói phát âm</h5>
                          <p className="text-[10px] text-[#5b6474] font-bold mt-0.5">Bấm nút micro để bắt đầu nói, hệ thống sẽ chấm điểm phát âm của bạn.</p>
                        </div>
                        <div>
                          {isRecording ? (
                            <button
                              onClick={stopRecording}
                              className="p-3 bg-[#dc2626] text-white border-2 border-[#1f2937] rounded-full animate-pulse shadow-[2px_2px_0px_#1f2937] cursor-pointer flex items-center justify-center"
                            >
                              {renderStopIcon("w-4 h-4")} Dừng
                            </button>
                          ) : (
                            <button
                              disabled={isTranscribing}
                              onClick={startRecording}
                              className="p-3 bg-[#0ea5e9] text-white border-2 border-[#1f2937] rounded-full shadow-[2px_2px_0px_#1f2937] hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center"
                            >
                              {renderMicIcon("w-4 h-4")} Nói
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Default null panel (Instructions)
                return (
                  <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-5 w-full text-center space-y-3">
                    <h4 className="font-serif font-black text-sm text-[#111827] uppercase tracking-wide">Quầy Chế Biến Trà Sữa</h4>
                    <p className="text-xs text-[#5b6474] font-bold leading-relaxed">
                      Hãy di chuyển nhân vật đến Máy trà, Quầy toppings, Quầy trái cây để chọn nguyên liệu. 
                      Đến Máy lắc bình để lắc phục vụ nước, hoặc quay lại Quầy Order để xem lại yêu cầu khách hàng nhé!
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-black pt-1">
                      <div className="bg-amber-50 border border-amber-300 rounded p-1.5 text-amber-800 flex items-center justify-center gap-1">{renderTeaIcon("w-4 h-4")} Máy Trà Nền</div>
                      <div className="bg-orange-50 border border-orange-300 rounded p-1.5 text-orange-800 flex items-center justify-center gap-1">{renderToppingIcon("w-4 h-4")} Quầy Topping</div>
                      <div className="bg-red-50 border border-red-300 rounded p-1.5 text-red-800 flex items-center justify-center gap-1">{renderFruitIcon("w-4 h-4")} Quầy Trái Cây</div>
                      <div className="bg-blue-50 border border-blue-300 rounded p-1.5 text-blue-800 flex items-center justify-center gap-1">{renderIceIcon("w-4 h-4")} Đường & Đá</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Right Column: Boba Cup preview & Serv/Clear controls + Feedback */}
          <div className="space-y-6">
            
            {/* Shaker Cup Panel */}
            <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-6 text-center flex flex-col justify-between min-h-[300px]">
              {isShakingGameActive ? (
                <div className="flex flex-col justify-between h-full w-full">
                  <div>
                    <h3 className="text-xs font-black text-[#dc2626] uppercase tracking-wider mb-2 animate-pulse">
                      LẮC ĐỀU BÌNH
                    </h3>
                    
                    <div className="my-2 animate-bounce-short">
                      {renderBobaCup()}
                    </div>
                    
                    <p className="text-[10px] font-bold text-[#5b6474]">
                      Canh kim chỉ đúng vùng màu xanh lá ở giữa để được điểm tối đa!
                    </p>
                  </div>

                  <div>
                    <div className="relative w-full h-6 bg-gray-200 border-2 border-[#1f2937] rounded-lg overflow-hidden my-3 shadow-[2px_2px_0px_#1f2937]">
                      <div className="absolute inset-0 flex">
                        <div className="w-[20%] bg-[#f87171] border-r-2 border-[#1f2937]"></div>
                        <div className="w-[20%] bg-[#fde047] border-r-2 border-[#1f2937]"></div>
                        <div className="w-[20%] bg-[#4ade80] border-r-2 border-[#1f2937] flex items-center justify-center">
                          <span className="text-[8px] font-black text-[#111827] uppercase tracking-tighter">Perfect</span>
                        </div>
                        <div className="w-[20%] bg-[#fde047] border-r-2 border-[#1f2937]"></div>
                        <div className="w-[20%] bg-[#f87171]"></div>
                      </div>
                      <div 
                        className="absolute top-0 bottom-0 w-2 bg-[#1f2937] border-x border-white" 
                        style={{ left: `calc(${sliderValue}% - 4px)` }}
                      ></div>
                    </div>

                    <div className="min-h-[24px]">
                      {shakingResult ? (
                        <span className={`text-xs font-black uppercase tracking-wider
                          ${shakingResult === 'perfect' ? 'text-[#16a34a] animate-bounce-short' : shakingResult === 'good' ? 'text-[#eab308]' : 'text-[#dc2626]'}`}>
                          {shakingResult === 'perfect' ? 'PERFECT!' : shakingResult === 'good' ? 'GOOD!' : 'MISS!'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#9ca3af] italic">
                          Lực lắc: {sliderValue}%
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={shakingResult !== null}
                    onClick={handleStopShaking}
                    className="w-full p-3 bg-[#eab308] hover:bg-[#ca8a04] disabled:opacity-50 text-[#111827] border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    {shakingResult !== null ? 'Đang rót nước...' : 'DỪNG LẮC & PHỤC VỤ'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col justify-between h-full w-full">
                  <div>
                    <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider mb-2">
                      Ly pha chế của bà chủ
                    </h3>

                    <div className="my-2">
                      {renderBobaCup()}
                    </div>
                  </div>

                  <div className="min-h-[50px] flex flex-wrap gap-1 justify-center items-center bg-[#fffdf8] border-2 border-[#1f2937] p-2 rounded-lg my-2">
                    {selectedIngredients.length === 0 ? (
                      <span className="text-[10px] font-bold text-[#9ca3af] italic">Ly rỗng</span>
                    ) : (
                      selectedIngredients.map((ing, idx) => (
                        <span 
                          key={idx}
                          className="bg-white text-[#111827] border border-[#1f2937] font-black text-[10px] px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#1f2937]"
                        >
                          {ing}
                        </span>
                      ))
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={clearCup}
                      className="p-2.5 bg-[#fffdf8] hover:bg-gray-100 text-[#111827] border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      Xóa ly
                    </button>
                    <button
                      onClick={handleServe}
                      className="p-2.5 bg-[#16a34a] hover:bg-green-700 text-white border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      Phục vụ
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shop feedback & errors */}
            <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-5 min-h-[145px] flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wide mb-1.5">Phản hồi của tiệm</h4>
                <p className={`text-sm font-bold leading-relaxed
                  ${messageType === 'success' ? 'text-[#16a34a]' : messageType === 'error' ? 'text-[#dc2626]' : 'text-[#111827]'}`}>
                  {gameMessage}
                </p>
              </div>

              {activeMistakes.length > 0 && (
                <div className="mt-4 border-t-2 border-dashed border-[#1f2937] pt-3">
                  <h5 className="text-[10px] font-black text-[#dc2626] uppercase tracking-wider mb-2 flex items-center gap-1">
                    Lỗi pha chế:
                  </h5>
                  <ul className="space-y-1 text-[11px] font-bold text-[#5b6474]">
                    {activeMistakes.map((mistake, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-[#dc2626] font-black">▪</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Love Voucher Modal / Pop-up when unlocked */}
      {newlyUnlockedVoucher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-[#fffaf0] border-[4px] border-[#1f2937] shadow-[10px_10px_0px_#1f2937] rounded-2xl p-6 text-center animate-bounce-short relative">
            <button
              onClick={() => setNewlyUnlockedVoucher(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-[#dc2626] text-white border-2 border-[#1f2937] rounded-lg font-black flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1f2937] active:scale-95"
            ><CloseIcon /></button>

            {/* Glowing pixels */}
            <div className="w-16 h-16 bg-[#f59e0b] border-3 border-[#1f2937] rounded-full mx-auto flex items-center justify-center shadow-[3px_3px_0px_#1f2937] mb-4">
              <svg className="w-8 h-8 text-[#111827]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3a2 2 0 100-4h-4m-6 4H4a2 2 0 110-4h4m6 16h-4" />
              </svg>
            </div>

            <h3 className="text-2xl font-serif font-black text-[#f59e0b] tracking-wider mb-2">QUÀ TẶNG ĐÃ MỞ KHÓA!</h3>
            <p className="text-xs text-[#5b6474] font-bold mb-4">Em đã xuất sắc chinh phục thử thách tình yêu và nhận được phần quà này:</p>

            {/* Voucher ticket */}
            <div className="bg-[#fffdf8] border-2 border-[#1f2937] p-4 rounded-xl shadow-[3px_3px_0px_#1f2937] text-left mb-6 relative overflow-hidden">
              {/* Ticket jagged edges */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fffaf0] border-2 border-[#1f2937]"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fffaf0] border-2 border-[#1f2937]"></div>
              
              <div className="pl-4 pr-4">
                <h4 className="font-serif font-black text-base text-[#111827]">{newlyUnlockedVoucher.title}</h4>
                <p className="text-xs font-bold text-[#5b6474] mt-1">{newlyUnlockedVoucher.description}</p>
                <div className="border-t-2 border-dashed border-[#1f2937] mt-3 pt-3 flex justify-between items-center">
                  <span className="text-[10px] font-black text-[#9ca3af] uppercase">Mã nhận quà</span>
                  <span className="font-mono font-black text-xs bg-[#fef08a] px-2 py-0.5 border border-[#1f2937] rounded">
                    {newlyUnlockedVoucher.code}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setNewlyUnlockedVoucher(null)}
              className="px-6 py-3 bg-[#16a34a] text-white border-2 border-[#1f2937] rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#1f2937] hover:translate-y-0.5 hover:shadow-none cursor-pointer"
            >
              Nhận phần quà
            </button>
          </div>
        </div>
      )}

      {/* Standalone Voucher Wallet Modal */}
      {showVoucherWallet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="max-w-lg w-full bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[8px_8px_0px_#1f2937] rounded-xl p-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowVoucherWallet(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-[#dc2626] text-white border-2 border-[#1f2937] rounded-lg font-black flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1f2937] active:scale-95"
            ><CloseIcon /></button>

            <h3 className="text-xl font-serif font-black text-[#111827] border-b-2 border-dashed border-[#1f2937] pb-3 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Ví quà tặng của Lan Vy ({unlockedVouchers.length})
            </h3>

            {unlockedVouchers.length === 0 ? (
              <div className="text-center py-10 bg-[#fffdf8] border-2 border-dashed border-[#1f2937] rounded-xl">
                <p className="text-sm font-bold text-[#5b6474]">Hiện chưa có quà tặng nào được mở khóa.</p>
                <p className="text-xs text-[#9ca3af] mt-1">Hãy giúp Nhựt Khang pha chế các công thức trà sữa ở Cấp độ 3 để nhận quà nha!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {unlockedVouchers.map((voucher) => (
                  <div 
                    key={voucher.id}
                    className={`border-2 border-[#1f2937] p-4 rounded-xl shadow-[3px_3px_0px_#1f2937] relative overflow-hidden transition-all
                      ${voucher.isRedeemed ? 'bg-gray-100 opacity-60' : 'bg-white'}`}
                  >
                    {/* Ticket cuts */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fffaf0] border-2 border-[#1f2937]"></div>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fffaf0] border-2 border-[#1f2937]"></div>

                    <div className="pl-4 pr-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className={`font-serif font-black text-base text-[#111827] ${voucher.isRedeemed ? 'line-through' : ''}`}>
                            {voucher.title}
                          </h4>
                          <p className="text-xs font-bold text-[#5b6474] mt-1">{voucher.description}</p>
                        </div>
                        {voucher.isRedeemed ? (
                          <span className="bg-[#1f2937] text-white border border-[#1f2937] font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wide">
                            Đã Đổi
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRedeemVoucher(voucher.code)}
                            className="bg-[#16a34a] text-white border-2 border-[#1f2937] font-black text-[10px] px-2 py-1 rounded shadow-[1.5px_1.5px_0px_#1f2937] hover:translate-y-0.5 hover:shadow-none cursor-pointer"
                          >
                            Đổi Quà
                          </button>
                        )}
                      </div>
                      
                      <div className="border-t-2 border-dashed border-[#1f2937] mt-3 pt-3 flex justify-between items-center">
                        <span className="text-[10px] font-black text-[#9ca3af] uppercase">Mã số</span>
                        <span className="font-mono font-black text-xs bg-[#fef08a] px-2 py-0.5 border border-[#1f2937] rounded">
                          {voucher.code}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coin Shop Modal */}
      {showCoinShop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="max-w-lg w-full bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[8px_8px_0px_#1f2937] rounded-xl p-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowCoinShop(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-[#dc2626] text-white border-2 border-[#1f2937] rounded-lg font-black flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1f2937] active:scale-95"
            ><CloseIcon /></button>

            <h3 className="text-xl font-serif font-black text-[#111827] border-b-2 border-dashed border-[#1f2937] pb-3 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isLoveUser ? 'Cửa hàng tình yêu của Vy' : 'Cửa hàng xu vàng'}
            </h3>
            
            <p className="text-xs text-[#5b6474] font-bold mb-4">
              Bà chủ đang có: <span className="text-[#16a34a] font-black">{coins} xu vàng</span>. {isLoveUser ? 'Hãy dùng xu tích lũy để mở khóa quà tặng ngọt ngào từ anh Khang!' : 'Hãy dùng xu tích lũy để mở khóa vật phẩm hỗ trợ!'}
            </p>

            <div className="space-y-4">
              {/* Item 1: Hint */}
              <div className="bg-white border-2 border-[#1f2937] p-4 rounded-xl shadow-[3px_3px_0px_#1f2937] flex justify-between items-center gap-4">
                <div>
                  <h4 className="font-serif font-black text-sm text-[#111827]">Gợi ý tiếng Việt nguyên liệu</h4>
                  <p className="text-[10px] font-bold text-[#5b6474] mt-0.5">Hiện vĩnh viễn tên tiếng Việt cho tất cả nguyên liệu trên quầy pha chế.</p>
                </div>
                <button
                  disabled={showIngredientHelp}
                  onClick={() => handleBuyItem('hint')}
                  className={`px-3 py-2 border-2 border-[#1f2937] font-black text-xs rounded shadow-[2px_2px_0px_#1f2937] hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer whitespace-nowrap
                    ${showIngredientHelp ? 'bg-gray-100 text-[#9ca3af] border-gray-300 shadow-none cursor-not-allowed' : 'bg-[#fef08a] hover:bg-[#fde047]'}`}
                >
                  {showIngredientHelp ? 'Đã có' : '20 Xu'}
                </button>
              </div>

              {/* Love-only items - chỉ hiện cho nguyenthilanvy12a2@gmail.com */}
              {isLoveUser && (<>
              {/* Item 2: Boba Real Voucher */}
              <div className="bg-white border-2 border-[#1f2937] p-4 rounded-xl shadow-[3px_3px_0px_#1f2937] flex justify-between items-center gap-4">
                <div>
                  <h4 className="font-serif font-black text-sm text-[#111827]">Thẻ Trà Sữa Đời Thực</h4>
                  <p className="text-[10px] font-bold text-[#5b6474] mt-0.5">Đổi 1 ly Gongcha hoặc KoiThé bất kỳ ngoài đời thật do anh Khang bao trọn gói.</p>
                </div>
                <button
                  onClick={() => handleBuyItem('voucher_milktea')}
                  className="px-3 py-2 bg-[#16a34a] text-white border-2 border-[#1f2937] font-black text-xs rounded shadow-[2px_2px_0px_#1f2937] hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer whitespace-nowrap"
                >
                  150 Xu
                </button>
              </div>

              {/* Item 3: Hug Voucher */}
              <div className="bg-white border-2 border-[#1f2937] p-4 rounded-xl shadow-[3px_3px_0px_#1f2937] flex justify-between items-center gap-4">
                <div>
                  <h4 className="font-serif font-black text-sm text-[#111827]">Thẻ Cái Ôm Siêu Ấm Áp</h4>
                  <p className="text-[10px] font-bold text-[#5b6474] mt-0.5">Đổi 1 cái ôm siết chặt từ bạn trai Nhựt Khang bất cứ lúc nào bé muốn.</p>
                </div>
                <button
                  onClick={() => handleBuyItem('voucher_hug')}
                  className="px-3 py-2 bg-[#f472b6] text-white border-2 border-[#1f2937] font-black text-xs rounded shadow-[2px_2px_0px_#1f2937] hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer whitespace-nowrap"
                >
                  100 Xu
                </button>
              </div>

              {/* Item 4: Date Voucher */}
              <div className="bg-white border-2 border-[#1f2937] p-4 rounded-xl shadow-[3px_3px_0px_#1f2937] flex justify-between items-center gap-4">
                <div>
                  <h4 className="font-serif font-black text-sm text-[#111827]">Thẻ Hẹn Hò Công Chúa</h4>
                  <p className="text-[10px] font-bold text-[#5b6474] mt-0.5">Đổi 1 buổi đi chơi lãng mạn do anh Khang lên lịch đưa đón và chiêu đãi.</p>
                </div>
                <button
                  onClick={() => handleBuyItem('voucher_date')}
                  className="px-3 py-2 bg-[#0ea5e9] text-white border-2 border-[#1f2937] font-black text-xs rounded shadow-[2px_2px_0px_#1f2937] hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer whitespace-nowrap"
                >
                  200 Xu
                </button>
              </div>
              </>)}
            </div>
          </div>
        </div>
      )}

      {/* Sổ tay HSK Modal */}
      {showVocabModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="max-w-2xl w-full bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[8px_8px_0px_#1f2937] rounded-xl p-6 relative max-h-[85vh] overflow-hidden flex flex-col">
            <button
              onClick={() => setShowVocabModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-[#dc2626] text-white border-2 border-[#1f2937] rounded-lg font-black flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1f2937] active:scale-95 z-10"
            ><CloseIcon /></button>

            <h3 className="text-xl font-serif font-black text-[#111827] border-b-2 border-dashed border-[#1f2937] pb-3 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0ea5e9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Sổ tay HSK của Vy
            </h3>

            {/* Modal Tabs */}
            <div className="flex gap-2 border-b-2 border-[#1f2937] pb-3 mb-4">
              <button
                onClick={() => setVocabTab('list')}
                className={`px-4 py-2 border-2 border-[#1f2937] font-black text-xs uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5
                  ${vocabTab === 'list' ? 'bg-[#0ea5e9] text-white' : 'bg-white text-[#111827]'}`}
              >
                {renderBookshelfIcon("w-3.5 h-3.5")} Sách từ vựng HSK
              </button>
              <button
                onClick={() => {
                  setVocabTab('flashcard');
                  setFlashcardFlipped(false);
                }}
                className={`px-4 py-2 border-2 border-[#1f2937] font-black text-xs uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5
                  ${vocabTab === 'flashcard' ? 'bg-[#f59e0b] text-[#111827]' : 'bg-white text-[#111827]'}`}
              >
                Thẻ Ghi Nhớ (Flashcards)
              </button>
            </div>

            {/* Tab contents */}
            {vocabTab === 'list' ? (
              <div className="flex-1 overflow-y-auto pr-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#1f2937] text-xs font-black text-[#5b6474] uppercase bg-gray-50">
                      <th className="py-2 px-3">Chữ Hán</th>
                      <th className="py-2 px-3">Phiên âm</th>
                      <th className="py-2 px-3">Nghĩa Việt</th>
                      <th className="py-2 px-3 text-center">HSK</th>
                      <th className="py-2 px-3 text-center">Nghe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2937]/10 text-sm font-bold text-[#111827]">
                    {VOCAB_LIST.map((vocab, index) => (
                      <tr key={index} className="hover:bg-amber-50/40">
                        <td className="py-2 px-3 font-serif text-lg font-bold flex items-center gap-1.5">
                          <span>{vocab.chinese}</span>
                          <button
                            onClick={() => handleExplainWord(vocab.chinese)}
                            className="px-1.5 py-0.5 bg-[#0ea5e9] text-white border border-[#1f2937] rounded text-[9px] font-black uppercase shadow-[1px_1px_0px_#1f2937] active:scale-95 transition-all cursor-pointer flex items-center gap-0.5"
                            title="Giải nghĩa từ vựng bằng AI"
                          >
                            AI
                          </button>
                        </td>
                        <td className="py-2 px-3 text-xs text-[#0ea5e9] font-mono">{vocab.pinyin}</td>
                        <td className="py-2 px-3 text-xs text-[#5b6474]">{vocab.vietnamese}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[9px] px-1.5 py-0.5 rounded font-mono">
                            {vocab.level}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => {
                              playSfx('click');
                              const audio = new Audio(`/api/tts?text=${encodeURIComponent(vocab.chinese)}&lang=zh`);
                              audio.play();
                            }}
                            className="p-1 bg-white hover:bg-gray-100 border border-[#1f2937] rounded shadow-[1px_1px_0px_#1f2937] active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            {renderAudioIcon("w-3.5 h-3.5")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-4 select-none">
                {/* Flashcard Wrapper (Interactive flip) */}
                <div 
                  onClick={() => {
                    playSfx('flip');
                    setFlashcardFlipped(prev => !prev);
                  }}
                  className="w-72 h-44 bg-white border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all relative overflow-hidden"
                >
                  {/* Badge */}
                  <div className="absolute top-2 left-3 bg-amber-100 border border-amber-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-black text-amber-800">
                    {VOCAB_LIST[currentFlashcardIdx].level}
                  </div>
                  <div className="absolute top-2 right-3 text-[9.5px] font-black text-gray-400">
                    {currentFlashcardIdx + 1}/{VOCAB_LIST.length}
                  </div>

                  {!flashcardFlipped ? (
                    <div className="text-center">
                      <h4 className="text-5xl font-serif font-black text-[#111827] tracking-wide mb-2 select-none">
                        {VOCAB_LIST[currentFlashcardIdx].chinese}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider select-none animate-pulse">Bấm để lật thẻ</p>
                    </div>
                  ) : (
                    <div className="text-center animate-fade-in">
                      <p className="text-lg font-mono font-black text-[#0ea5e9] select-none">
                        {VOCAB_LIST[currentFlashcardIdx].pinyin}
                      </p>
                      <h4 className="text-base font-bold text-[#111827] mt-3 px-2 select-none">
                        {VOCAB_LIST[currentFlashcardIdx].vietnamese}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSfx('click');
                          const audio = new Audio(`/api/tts?text=${encodeURIComponent(VOCAB_LIST[currentFlashcardIdx].chinese)}&lang=zh`);
                          audio.play();
                        }}
                        className="mt-3 px-3 py-1 bg-[#fef08a] hover:bg-[#fde047] border border-[#1f2937] rounded text-xs font-black shadow-[1px_1px_0px_#1f2937] active:scale-95 cursor-pointer inline-flex items-center gap-1"
                      >
                        {renderAudioIcon("w-3.5 h-3.5")} Nghe đọc
                      </button>
                    </div>
                  )}
                </div>

                {/* Navigation Controls */}
                <div className="flex gap-4 items-center mt-6">
                  <button
                    onClick={() => {
                      playSfx('click');
                      setFlashcardFlipped(false);
                      setCurrentFlashcardIdx(prev => (prev === 0 ? VOCAB_LIST.length - 1 : prev - 1));
                    }}
                    className="px-3 py-1.5 bg-[#fffdf8] hover:bg-gray-100 border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] active:translate-y-0.5 active:shadow-none cursor-pointer"
                  >
                    Trước
                  </button>

                  <button
                    onClick={() => {
                      playSfx('click');
                      setFlashcardFlipped(false);
                      setCurrentFlashcardIdx(prev => (prev === VOCAB_LIST.length - 1 ? 0 : prev + 1));
                    }}
                    className="px-3 py-2 bg-[#fffdf8] hover:bg-gray-100 border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] active:translate-y-0.5 active:shadow-none cursor-pointer"
                  >
                    Tiếp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Logs Modal */}
      {showAdminLogsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="max-w-4xl w-full bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[8px_8px_0px_#1f2937] rounded-xl p-6 relative max-h-[85vh] overflow-hidden flex flex-col">
            <button
              onClick={() => setShowAdminLogsModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-[#dc2626] text-white border-2 border-[#1f2937] rounded-lg font-black flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1f2937] active:scale-95 z-10"
            ><CloseIcon /></button>

            <h3 className="text-xl font-serif font-black text-[#111827] border-b-2 border-dashed border-[#1f2937] pb-3 mb-4 flex items-center gap-2">
              {renderChartIcon("w-5 h-5")} Nhật ký & Logs Hệ Thống (Admin)
            </h3>

            {adminLogsLoading ? (
              <div className="flex-1 flex items-center justify-center py-10 font-bold text-[#5b6474]">
                Đang tải dữ liệu logs từ PostgreSQL...
              </div>
            ) : adminLogsError ? (
              <div className="flex-1 flex items-center justify-center py-10 text-[#dc2626] font-bold">
                Lỗi: {adminLogsError}
              </div>
            ) : adminLogsData && adminLogsData.length > 0 ? (
              <div className="flex-1 overflow-y-auto pr-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f59e0b] border-2 border-[#1f2937] text-[#111827] font-black uppercase">
                      <th className="p-2 border-r-2 border-[#1f2937]">Tài khoản / Email</th>
                      <th className="p-2 border-r-2 border-[#1f2937] text-center">Tiến độ</th>
                      <th className="p-2 border-r-2 border-[#1f2937] text-center">Score / Xu</th>
                      <th className="p-2">Voucher Đã Mở Khóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminLogsData.map((usr) => (
                      <tr key={usr.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2 border-x-2 border-b-2 border-[#1f2937] font-bold text-[#111827]">
                          <div>{usr.username}</div>
                          <div className="text-[10px] text-gray-500 font-normal">{usr.email || 'Không có email'}</div>
                          <div className="text-[9px] text-gray-400 font-mono mt-0.5">ID: {usr.id}</div>
                        </td>
                        <td className="p-2 border-r-2 border-b-2 border-[#1f2937] text-center font-black text-amber-600">
                          Lvl {usr.progress?.level || 1}
                        </td>
                        <td className="p-2 border-r-2 border-b-2 border-[#1f2937] text-center">
                          <div className="font-bold text-[#0ea5e9]">{usr.progress?.score || 0} pts</div>
                          <div className="text-emerald-600 font-bold">${usr.progress?.coins || 0} xu</div>
                        </td>
                        <td className="p-2 border-r-2 border-b-2 border-[#1f2937]">
                          {usr.vouchers && usr.vouchers.length > 0 ? (
                            <div className="space-y-1">
                              {usr.vouchers.map((v) => (
                                <div key={v.id} className="bg-amber-50 border border-amber-200 rounded p-1 text-[10px]">
                                  <div className="font-bold text-amber-800">{v.title}</div>
                                  <div className="text-[9px] text-gray-600">{v.description}</div>
                                  <div className="flex justify-between items-center mt-0.5">
                                    <span className="font-mono bg-white px-1 border border-gray-300 rounded font-bold text-[#111827]">{v.code}</span>
                                    <span className={`text-[8px] px-1 rounded font-bold ${v.isRedeemed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                      {v.isRedeemed ? 'Đã đổi' : 'Chưa đổi'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Chưa mở khóa quà nào</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-10 text-gray-400 italic">
                Không tìm thấy tài khoản nào trong hệ thống.
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Explanation Modal */}
      {explainWord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="max-w-md w-full bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[8px_8px_0px_#1f2937] rounded-xl p-5 relative max-h-[80vh] flex flex-col overflow-hidden">
            <button
              onClick={() => setExplainWord(null)}
              className="absolute top-3 right-3 w-7 h-7 bg-[#dc2626] text-white border-2 border-[#1f2937] rounded-lg font-black flex items-center justify-center cursor-pointer shadow-[1.5px_1.5px_0px_#1f2937] active:scale-95"
            ><CloseIcon /></button>
            
            <h3 className="text-base font-serif font-black text-[#111827] border-b-2 border-dashed border-[#1f2937] pb-2 mb-3 flex items-center gap-2">
              <BotIcon /> Trợ lý AI Giải Nghĩa Từ: <span className="text-[#0ea5e9] font-serif">{explainWord}</span>
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs leading-relaxed font-medium text-[#374151]">
              {isExplaining ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2 text-[#5b6474]">
                  <div className="w-8 h-8 border-4 border-t-[#0ea5e9] border-gray-200 rounded-full animate-spin"></div>
                  <span className="font-bold animate-pulse">Bot AI đang suy ngẫm giải nghĩa...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap font-sans bg-white border border-gray-200 rounded-lg p-3.5 shadow-sm text-left">
                  {explanationText}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Change Name Modal */}
      {showChangeNameModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="max-w-sm w-full bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-5 relative text-center">
            <button
              onClick={() => setShowChangeNameModal(false)}
              className="absolute top-3 right-3 w-7 h-7 bg-[#dc2626] text-white border-2 border-[#1f2937] rounded-lg font-black flex items-center justify-center cursor-pointer shadow-[1.5px_1.5px_0px_#1f2937]"
            ><CloseIcon /></button>
            
            <h3 className="text-base font-serif font-black text-[#111827] mb-3">
              <EditIcon className="inline-block h-5 w-5 mr-1" /> Đặt Tên Bà Chủ Mới
            </h3>
            <p className="text-[11px] text-gray-500 font-bold mb-4">
              Nhập biệt danh hoặc tên riêng bạn muốn đặt cho nhân vật của mình:
            </p>
            
            <input
              type="text"
              value={newNameInput}
              onChange={(e) => setNewNameInput(e.target.value)}
              className="w-full p-2.5 border-2 border-[#1f2937] bg-white rounded-lg font-black text-sm text-center mb-4 focus:outline-none shadow-[2px_2px_0px_#1f2937]"
              maxLength={20}
              placeholder="Nhập tên..."
            />

            <button
              onClick={handleChangeName}
              className="w-full py-2 bg-[#16a34a] hover:bg-green-700 text-white border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Xác nhận đổi tên
            </button>
          </div>
        </div>
      )}

      {/* Floating Click Hearts */}
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute pointer-events-none select-none animate-heart-float z-50"
          style={{ left: h.x, top: h.y - 12 }}
        >
          {renderHeartIcon("w-6 h-6")}
        </span>
      ))}

      {/* Retro CSS animations style tag */}
      <style>{`
        @keyframes heartFloat {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) scale(1.3);
            opacity: 0;
          }
        }
        .animate-heart-float {
          animation: heartFloat 0.8s ease-out forwards;
        }
        @keyframes bounceShort {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-short {
          animation: bounceShort 1.5s ease-in-out infinite;
        }
        .cozy-wood-floor {
          background-color: #eed9b3;
          background-image: linear-gradient(90deg, transparent 50%, rgba(120,53,15,0.04) 50%),
                            linear-gradient(rgba(120,53,15,0.04) 50%, transparent 50%);
          background-size: 24px 24px;
        }
        .cozy-wood-tile {
          background-color: #eed9b3;
          border: 1px solid rgba(139, 92, 26, 0.15);
        }
        .cozy-brick-wall {
          background-color: #991b1b;
          background-image: linear-gradient(90deg, rgba(255,255,255,0.07) 50%, transparent 50%),
                            linear-gradient(transparent 50%, rgba(0,0,0,0.15) 50%);
          background-size: 20px 10px;
          border-bottom: 4px solid #1f2937;
        }
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
