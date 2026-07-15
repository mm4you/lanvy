'use client';

import { useState, useEffect, useRef } from 'react';
import { INGREDIENTS, ORDERS, Ingredient, Order } from '../data/vocabulary';

export default function GamePage() {
  // Auth & Session state
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Game state
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [unlockedVouchers, setUnlockedVouchers] = useState<any[]>([]);
  const [gameMessage, setGameMessage] = useState<string>('Chào mừng Bà chủ Lan Vy đến với tiệm trà sữa của mình!');
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [customerState, setCustomerState] = useState<'entering' | 'idle' | 'leaving' | 'disappointed'>('entering');
  const [activeMistakes, setActiveMistakes] = useState<string[]>([]);

  // Interactive states
  const [showPinyin, setShowPinyin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showVoucherWallet, setShowVoucherWallet] = useState(false);
  const [newlyUnlockedVoucher, setNewlyUnlockedVoucher] = useState<any | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentOrder = orders[currentOrderIndex];

  // Try to load session from localStorage
  useEffect(() => {
    const savedUserId = localStorage.getItem('boba_game_user_id');
    const savedUsername = localStorage.getItem('boba_game_username');
    if (savedUserId && savedUsername) {
      const userData = { id: savedUserId, username: savedUsername };
      setUser(userData);
      fetchProgress(userData.id);
    }
  }, []);

  // Fetch progress and vouchers from DB
  const fetchProgress = async (userId: string) => {
    setLoadingProgress(true);
    try {
      const res = await fetch('/api/progress', {
        headers: { 'x-user-id': userId }
      });
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
  };

  // Auth actions
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      setAuthError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');

    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('boba_game_user_id', data.userId);
        localStorage.setItem('boba_game_username', data.username);
        const userData = { id: data.userId, username: data.username };
        setUser(userData);
        await fetchProgress(data.userId);
      } else {
        setAuthError(data.error || 'Có lỗi xảy ra.');
      }
    } catch (err) {
      setAuthError('Lỗi kết nối máy chủ.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('boba_game_user_id');
    localStorage.removeItem('boba_game_username');
    setUser(null);
    setSelectedIngredients([]);
    setUnlockedVouchers([]);
    setNewlyUnlockedVoucher(null);
    setCurrentOrderIndex(0);
  };

  // Sync progress & unlocks to DB
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
    } catch (e) {
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
    if (currentOrder) {
      setCustomerState('entering');
      const timer = setTimeout(() => {
        setCustomerState('idle');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentOrderIndex]);

  // Serve drink check
  const handleServe = () => {
    if (!currentOrder) return;

    // Check if ingredients match
    const isCorrect = 
      selectedIngredients.length === currentOrder.targetIngredients.length &&
      currentOrder.targetIngredients.every(item => selectedIngredients.includes(item));

    if (isCorrect) {
      const bonusScore = 100;
      const bonusCoins = 50;
      const nextScore = score + bonusScore;
      const nextCoins = coins + bonusCoins;
      
      setScore(nextScore);
      setCoins(nextCoins);
      setGameMessage(currentOrder.successMessage);
      setMessageType('success');
      setActiveMistakes([]);

      // Customer walks out happily
      setCustomerState('leaving');

      // Check level up (every 3 orders increases level)
      let nextLevel = currentLevel;
      const nextOrderIndex = currentOrderIndex + 1;
      
      if (nextOrderIndex > 0 && nextOrderIndex % 3 === 0) {
        nextLevel = Math.min(3, currentLevel + 1);
        setCurrentLevel(nextLevel);
        setGameMessage(prev => prev + ` Chúc mừng Bà chủ đã đạt Cấp độ ${nextLevel}!`);
      }

      // Check if this order has a voucher reward
      const voucherToUnlock = currentOrder.voucherReward || null;

      // Sync stats and vouchers
      saveProgress(nextScore, nextCoins, nextLevel, voucherToUnlock);

      // Go to next order after customer walks out
      setTimeout(() => {
        if (nextOrderIndex < orders.length) {
          setCurrentOrderIndex(nextOrderIndex);
          setSelectedIngredients([]);
          setShowPinyin(false);
          setShowTranslation(false);
        } else {
          setGameMessage('Tuyệt vời! Bà chủ Vy đã hoàn thành toàn bộ các cấp độ trà sữa xuất sắc!');
        }
      }, 1200);
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
    }
  };

  // Skip / Next Customer handler
  const handleNextCustomer = () => {
    if (customerState === 'leaving' || customerState === 'entering') return;
    
    setCustomerState('leaving');
    setActiveMistakes([]);
    
    setTimeout(() => {
      const nextIndex = currentOrderIndex + 1;
      if (nextIndex < orders.length) {
        setCurrentOrderIndex(nextIndex);
        setSelectedIngredients([]);
        setShowPinyin(false);
        setShowTranslation(false);
      } else {
        setGameMessage('Bà chủ Vy đã gặp hết tất cả khách hàng rồi!');
      }
    }, 1000);
  };

  // Redeem voucher
  const handleRedeemVoucher = async (code: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/vouchers/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
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

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Character SVGs (Pixel/Blocky Art styled via pure vector shapes)
  const renderCustomerSVG = (sprite: string) => {
    switch (sprite) {
      case 'cat':
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Ears */}
            <rect x="6" y="4" width="4" height="4" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
            <rect x="22" y="4" width="4" height="4" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
            {/* Head */}
            <rect x="6" y="8" width="20" height="16" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
            {/* White face panel */}
            <rect x="10" y="14" width="12" height="10" fill="#fffaf0" />
            {/* Eyes */}
            <rect x="10" y="12" width="2" height="4" fill="#1f2937" />
            <rect x="20" y="12" width="2" height="4" fill="#1f2937" />
            {/* Nose */}
            <rect x="15" y="16" width="2" height="2" fill="#ef4444" />
            {/* Blush */}
            <rect x="8" y="16" width="2" height="2" fill="#fca5a5" />
            <rect x="22" y="16" width="2" height="2" fill="#fca5a5" />
            {/* Body */}
            <rect x="10" y="24" width="12" height="6" fill="#d97706" stroke="#1f2937" strokeWidth="2" />
          </svg>
        );
      case 'panda':
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Ears */}
            <rect x="6" y="4" width="6" height="6" fill="#1f2937" stroke="#1f2937" strokeWidth="2" />
            <rect x="20" y="4" width="6" height="6" fill="#1f2937" stroke="#1f2937" strokeWidth="2" />
            {/* Head */}
            <rect x="6" y="8" width="20" height="16" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
            {/* Eyes patches */}
            <rect x="8" y="12" width="4" height="4" fill="#1f2937" />
            <rect x="20" y="12" width="4" height="4" fill="#1f2937" />
            {/* Eyes pupils */}
            <rect x="9" y="13" width="2" height="2" fill="#ffffff" />
            <rect x="21" y="13" width="2" height="2" fill="#ffffff" />
            {/* Nose */}
            <rect x="15" y="17" width="2" height="2" fill="#1f2937" />
            {/* Body */}
            <rect x="8" y="24" width="16" height="6" fill="#1f2937" stroke="#1f2937" strokeWidth="2" />
          </svg>
        );
      case 'khang':
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Voluminous wavy black hair */}
            <rect x="8" y="1" width="16" height="3" fill="#1f2937" />
            <rect x="6" y="3" width="20" height="6" fill="#1f2937" />
            <rect x="5" y="6" width="22" height="3" fill="#1f2937" />
            {/* Sideburns */}
            <rect x="6" y="9" width="2" height="5" fill="#1f2937" />
            <rect x="24" y="9" width="2" height="5" fill="#1f2937" />
            {/* Face (Warm skin tone) */}
            <rect x="8" y="8" width="16" height="16" fill="#fcd34d" stroke="#1f2937" strokeWidth="2" />
            {/* Eyes */}
            <rect x="10" y="13" width="2" height="2" fill="#1f2937" />
            <rect x="20" y="13" width="2" height="2" fill="#1f2937" />
            {/* Round glasses frames */}
            <rect x="9" y="11" width="5" height="4" fill="none" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="18" y="11" width="5" height="4" fill="none" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="14" y="12" width="4" height="1.5" fill="#1f2937" />
            {/* Mouth (Friendly smile) */}
            <rect x="13" y="18" width="6" height="2" fill="#ef4444" />
            {/* Body (Dark blue crewneck t-shirt) */}
            <rect x="8" y="24" width="16" height="6" fill="#1e3b8b" stroke="#1f2937" strokeWidth="2" />
          </svg>
        );
      default: // Lan Vy sprite based on photo (Long layered black hair, wispy bangs, floral top)
        return (
          <svg viewBox="0 0 32 32" className="w-32 h-32 pixelated mx-auto">
            {/* Long black hair base */}
            <rect x="6" y="2" width="20" height="9" fill="#18181b" />
            {/* Shaggy long hair side panels down to chest */}
            <rect x="4" y="10" width="4" height="14" fill="#18181b" />
            <rect x="24" y="10" width="4" height="14" fill="#18181b" />
            <rect x="3" y="13" width="2" height="8" fill="#18181b" />
            <rect x="27" y="13" width="2" height="8" fill="#18181b" />
            {/* Face (Fair peach skin tone) */}
            <rect x="8" y="8" width="16" height="15" fill="#ffedd5" stroke="#1f2937" strokeWidth="2" />
            {/* Wispy/airy bangs on forehead */}
            <rect x="9" y="8" width="1" height="4" fill="#18181b" />
            <rect x="12" y="8" width="2" height="3" fill="#18181b" />
            <rect x="16" y="8" width="1" height="4" fill="#18181b" />
            <rect x="20" y="8" width="2" height="3" fill="#18181b" />
            {/* Eyes (Big dark eyes with double eyelids) */}
            <rect x="10" y="13" width="2" height="3" fill="#1f2937" />
            <rect x="20" y="13" width="2" height="3" fill="#1f2937" />
            <rect x="9" y="12" width="4" height="1" fill="#78350f" />
            <rect x="19" y="12" width="4" height="1" fill="#78350f" />
            {/* Pink blush cheeks */}
            <rect x="7" y="16" width="3" height="2" fill="#fca5a5" />
            <rect x="22" y="16" width="3" height="2" fill="#fca5a5" />
            {/* Rosy lips */}
            <rect x="13" y="18" width="6" height="2" fill="#db2777" />
            {/* Neckline */}
            <rect x="13" y="23" width="6" height="1" fill="#ffedd5" />
            {/* Body (White puff-sleeved top with small pink floral dots) */}
            <rect x="8" y="24" width="16" height="6" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
            {/* Puff sleeves */}
            <rect x="6" y="24" width="3" height="4" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />
            <rect x="23" y="24" width="3" height="4" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />
            {/* Floral dots */}
            <rect x="10" y="26" width="1" height="1" fill="#f43f5e" />
            <rect x="19" y="25" width="1" height="1" fill="#f43f5e" />
            <rect x="15" y="27" width="1" height="1" fill="#f59e0b" />
          </svg>
        );
    }
  };

  // Visual Boba Cup rendering based on selected ingredients
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

    // Liquid fill color
    let liquidColor = 'transparent';
    if (hasMilkTea) liquidColor = '#f5e1c8'; // Milktea cream color
    else if (hasGreenTea) liquidColor = '#d9f99d'; // Green tea light green
    else if (hasBlackTea) liquidColor = '#fca5a5'; // Red/black tea amber red
    else if (hasOolong) liquidColor = '#fed7aa'; // Oolong golden color

    return (
      <svg viewBox="0 0 64 100" className="w-28 h-44 mx-auto">
        {/* Cup outline */}
        <path d="M12 10 L52 10 L44 85 L20 85 Z" fill="#ffffff" stroke="#1f2937" strokeWidth="3" opacity="0.3" />
        
        {/* Liquid Fill */}
        {hasTea && (
          <path d="M14 25 L50 25 L43 83 L21 83 Z" fill={liquidColor} />
        )}

        {/* Ice Cubes */}
        {hasIce && (
          <>
            <rect x="22" y="30" width="8" height="8" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" transform="rotate(15 26 34)" opacity="0.7" />
            <rect x="35" y="42" width="8" height="8" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" transform="rotate(-10 39 46)" opacity="0.7" />
          </>
        )}

        {/* Toppings (Pudding, Red Bean, Boba, Jelly) */}
        {hasPudding && (
          <path d="M22 65 C22 55, 42 55, 42 65 L40 82 L24 82 Z" fill="#fbbf24" stroke="#1f2937" strokeWidth="1.5" />
        )}
        
        {hasRedBean && (
          <>
            <circle cx="23" cy="74" r="3" fill="#7f1d1d" />
            <circle cx="28" cy="78" r="3" fill="#7f1d1d" />
            <circle cx="34" cy="73" r="3" fill="#7f1d1d" />
            <circle cx="39" cy="76" r="3" fill="#7f1d1d" />
          </>
        )}

        {hasJelly && (
          <>
            <rect x="22" y="70" width="5" height="5" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
            <rect x="34" y="76" width="5" height="5" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
            <rect x="28" y="72" width="5" height="5" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" />
          </>
        )}

        {hasBoba && (
          <>
            <circle cx="22" cy="78" r="4" fill="#1f2937" />
            <circle cx="30" cy="80" r="4" fill="#1f2937" />
            <circle cx="38" cy="78" r="4" fill="#1f2937" />
            <circle cx="26" cy="72" r="4" fill="#1f2937" />
            <circle cx="34" cy="72" r="4" fill="#1f2937" />
            <circle cx="30" cy="65" r="4" fill="#1f2937" />
          </>
        )}

        {/* Cup outline front rim */}
        <path d="M12 10 L52 10 L44 85 L20 85 Z" fill="transparent" stroke="#1f2937" strokeWidth="3" />

        {/* Straw */}
        <line x1="32" y1="2" x2="32" y2="90" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
        <line x1="32" y1="2" x2="32" y2="90" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" strokeDasharray="3,3" opacity="0.3" />
      </svg>
    );
  };

  // MAIN LAYOUT
  if (!user) {
    return (
      <main className="min-h-screen bg-[#fffdf8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[8px_8px_0px_#1f2937] rounded-2xl p-6 relative overflow-hidden">
          {/* Accent header */}
          <div className="bg-[#f59e0b] border-b-[3px] border-[#1f2937] -mx-6 -mt-6 p-4 mb-6">
            <h1 className="text-xl font-black text-[#111827] text-center tracking-wider font-serif">
              TRÀ SỮA BÀ CHỦ LAN VY
            </h1>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm font-bold text-[#5b6474]">
              Chào mừng Bà chủ Lan Vy! Hãy đăng nhập để quản lý tiệm trà sữa của riêng mình, tiếp đón vị khách đặc biệt Nhựt Khang và nhận những phần quà ngọt ngào nhé.
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#111827] uppercase tracking-wide mb-1">Tên tài khoản</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full p-3 border-2 border-[#1f2937] bg-white rounded-lg font-bold text-base focus:outline-none shadow-[2px_2px_0px_#1f2937]"
                placeholder="Nhập tên tài khoản..."
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#111827] uppercase tracking-wide mb-1">Mật khẩu</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3 border-2 border-[#1f2937] bg-white rounded-lg font-bold text-base focus:outline-none shadow-[2px_2px_0px_#1f2937]"
                placeholder="Nhập mật khẩu..."
              />
            </div>

            {authError && (
              <div className="bg-[#dc2626] text-white border-2 border-[#1f2937] p-2.5 rounded-lg text-xs font-bold shadow-[2px_2px_0px_#1f2937]">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full p-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#111827] border-2 border-[#1f2937] rounded-lg font-black text-sm uppercase tracking-wider transition-all hover:-translate-y-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_#1f2937] active:shadow-none cursor-pointer"
            >
              {authLoading ? 'Đang xử lý...' : authMode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
            </button>
          </form>

          <div className="mt-6 border-t-2 border-dashed border-[#1f2937] pt-4 text-center">
            <button
              onClick={() => {
                setAuthMode(prev => prev === 'login' ? 'register' : 'login');
                setAuthError('');
              }}
              className="text-xs font-black text-[#0ea5e9] hover:underline"
            >
              {authMode === 'login' ? 'Chưa có tài khoản? Tạo ngay tại đây' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf8] p-4 md:p-8 flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full max-w-4xl bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#f59e0b] border-2 border-[#1f2937] flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_#1f2937]">
            T
          </div>
          <div>
            <h1 className="font-serif font-black text-lg text-[#111827]">Trà Sữa Bà Chủ Lan Vy</h1>
            <p className="text-xs text-[#5b6474] font-medium">Chào bà chủ: <span className="font-bold text-[#1e3b8b]">{user.username}</span></p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-[#fffdf8] border-2 border-[#1f2937] px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#1f2937] text-center min-w-[70px]">
            <span className="text-[10px] font-black text-[#5b6474] uppercase block">Cấp độ</span>
            <span className="text-base font-black text-[#f59e0b]">{currentLevel}</span>
          </div>

          <div className="bg-[#fffdf8] border-2 border-[#1f2937] px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#1f2937] text-center min-w-[80px]">
            <span className="text-[10px] font-black text-[#5b6474] uppercase block">Điểm số</span>
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
          <button
            onClick={() => setShowVoucherWallet(true)}
            className="px-6 py-3.5 bg-[#f59e0b] border-2 border-[#1f2937] rounded-xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#1f2937] hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            MỞ VÍ QUÀ TẶNG CỦA ANH
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT & CENTER COLUMN: Character and Order board */}
          <div className="md:col-span-2 space-y-6">
            {/* Customer & Bubble area */}
            <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-6 flex flex-col items-center relative min-h-[300px] justify-between">
              
              {/* Top info badge */}
              <div className="w-full flex justify-between items-center border-b-2 border-dashed border-[#1f2937] pb-3 mb-4">
                <span className="bg-[#f59e0b] text-[#111827] border-2 border-[#1f2937] shadow-[1px_1px_0px_#1f2937] font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                  Order {currentOrderIndex + 1}/9
                </span>
                <span className="bg-[#0ea5e9] text-[#111827] border-2 border-[#1f2937] shadow-[1px_1px_0px_#1f2937] font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                  Cấp độ từ vựng: {currentOrder.level === 1 ? 'Dễ (HSK3)' : currentOrder.level === 2 ? 'Trung (HSK4/5)' : 'Khó (HSK5/6 & Love)'}
                </span>
              </div>

              {/* Pixel character graphic with dynamic movement class */}
              {(() => {
                let customerMotionClass = "transition-all duration-700 transform flex flex-col items-center ";
                if (customerState === 'entering') {
                  customerMotionClass += "-translate-x-24 opacity-0 scale-95";
                } else if (customerState === 'leaving') {
                  customerMotionClass += "translate-x-24 opacity-0 scale-95";
                } else if (customerState === 'disappointed') {
                  customerMotionClass += "translate-x-0 opacity-100 animate-pixel-shake";
                } else {
                  customerMotionClass += "translate-x-0 opacity-100 animate-pixel-idle";
                }

                const isKhang = currentOrder.customerSprite === 'khang';

                return (
                  <div className={`${customerMotionClass} mb-4 relative min-h-[170px] justify-end`}>
                    {isKhang ? (
                      <span className="bg-[#f43f5e] text-white border-2 border-[#1f2937] font-black text-[9px] px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_#1f2937] animate-pulse mb-1 z-10">
                        ❤️ BẠN TRAI BÀ CHỦ ❤️
                      </span>
                    ) : (
                      <span className="bg-[#1f2937] text-white border border-[#1f2937] font-black text-[9px] px-2 py-0.5 rounded shadow-[1px_1px_0px_#1f2937] mb-1 z-10">
                        Khách quý dễ thương
                      </span>
                    )}
                    {renderCustomerSVG(currentOrder.customerSprite)}
                    <span className="block text-center font-black text-xs mt-1.5 uppercase text-[#111827] tracking-wider">
                      {currentOrder.customerName}
                    </span>
                  </div>
                );
              })()}

              {/* Order Bubble */}
              <div className="w-full bg-white border-2 border-[#1f2937] p-4 rounded-xl shadow-[3px_3px_0px_#1f2937] relative text-center">
                {/* Speech arrow */}
                <div className="absolute left-1/2 -top-[10px] -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-[#1f2937] rotate-45"></div>
                
                <h3 className="text-xl md:text-2xl font-black text-[#111827] leading-relaxed select-all">
                  {currentOrder.orderChinese}
                </h3>

                {/* Optional Pinyin */}
                {showPinyin && (
                  <p className="text-sm font-bold text-[#0ea5e9] mt-2 font-mono select-all">
                    {currentOrder.orderPinyin}
                  </p>
                )}

                {/* Optional translation */}
                {showTranslation && (
                  <p className="text-xs font-bold text-[#5b6474] mt-2 italic select-all">
                    {currentOrder.orderVietnamese}
                  </p>
                )}
              </div>

              {/* Audio and help buttons */}
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                <button
                  onClick={playAudio}
                  className={`p-2 rounded-lg border-2 border-[#1f2937] font-black text-xs uppercase transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_#1f2937] cursor-pointer flex items-center gap-1
                    ${isPlayingAudio ? 'bg-[#16a34a] text-white' : 'bg-white text-[#111827]'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span>Nghe đọc</span>
                </button>

                <button
                  onClick={() => setShowPinyin(prev => !prev)}
                  className={`p-2 rounded-lg border-2 border-[#1f2937] font-black text-xs uppercase transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_#1f2937] cursor-pointer
                    ${showPinyin ? 'bg-[#f59e0b] text-[#111827]' : 'bg-white text-[#111827]'}`}
                >
                  Phiên âm
                </button>

                <button
                  onClick={() => setShowTranslation(prev => !prev)}
                  className={`p-2 rounded-lg border-2 border-[#1f2937] font-black text-xs uppercase transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_#1f2937] cursor-pointer
                    ${showTranslation ? 'bg-[#f59e0b] text-[#111827]' : 'bg-white text-[#111827]'}`}
                >
                  Dịch nghĩa
                </button>

                <button
                  onClick={handleNextCustomer}
                  className="p-2 rounded-lg border-2 border-[#1f2937] bg-white text-[#1f2937] font-black text-xs uppercase transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_#1f2937] cursor-pointer flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  <span>Khách tiếp</span>
                </button>
              </div>
            </div>

            {/* Speaking voice evaluation */}
            <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wide">Luyện phát âm câu nói của khách</h4>
                <p className="text-xs text-[#5b6474] font-medium mt-0.5">Nhấp nút bên phải để ghi âm giọng nói tiếng Trung của bạn nhé.</p>
              </div>

              <div className="flex gap-2">
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="p-3 bg-[#dc2626] text-white border-2 border-[#1f2937] rounded-full animate-pulse shadow-[2px_2px_0px_#1f2937] hover:translate-y-0.5 hover:shadow-none cursor-pointer"
                    title="Dừng ghi âm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  </button>
                ) : (
                  <button
                    disabled={isTranscribing}
                    onClick={startRecording}
                    className="p-3 bg-[#0ea5e9] text-white border-2 border-[#1f2937] rounded-full shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
                    title="Bấm để luyện nói"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Kitchen counter / Ingredients list */}
            <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-6">
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider mb-4 pb-2 border-b-2 border-dashed border-[#1f2937]">
                Quầy nguyên liệu pha chế (Chữ Hán)
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {INGREDIENTS.map((ingredient) => {
                  const isSelected = selectedIngredients.includes(ingredient.nameChinese);
                  let categoryColor = 'bg-[#fffdf8]';
                  if (ingredient.category === 'base') categoryColor = 'hover:bg-[#f5e1c8]';
                  else if (ingredient.category === 'topping') categoryColor = 'hover:bg-[#fed7aa]';
                  else if (ingredient.category === 'sugar') categoryColor = 'hover:bg-[#fef08a]';
                  else if (ingredient.category === 'ice') categoryColor = 'hover:bg-[#bfdbfe]';

                  return (
                    <button
                      key={ingredient.id}
                      onClick={() => toggleIngredient(ingredient.nameChinese)}
                      className={`p-3.5 border-2 border-[#1f2937] rounded-lg font-black text-center flex flex-col justify-center items-center transition-all select-none cursor-pointer shadow-[2px_2px_0px_#1f2937] active:translate-y-0.5 active:shadow-none
                        ${isSelected 
                          ? 'bg-[#f59e0b] text-[#111827] -translate-y-0.5 shadow-[3px_3px_0px_#1f2937]' 
                          : `${categoryColor} text-[#111827] hover:-translate-y-0.5`
                        }`}
                    >
                      <span className="text-lg font-serif">{ingredient.nameChinese}</span>
                      <span className="text-[10px] font-bold text-[#5b6474] mt-0.5 uppercase tracking-wide">
                        {ingredient.nameVietnamese}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Shaker Cup & Control dashboard */}
          <div className="space-y-6">
            {/* Shaker / Cup visualizer */}
            <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-6 text-center flex flex-col justify-between min-h-[300px]">
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider mb-2">
                Ly pha chế của bạn
              </h3>

              <div className="my-4">
                {renderBobaCup()}
              </div>

              {/* Selected ingredients raw chips list */}
              <div className="min-h-[60px] flex flex-wrap gap-1 justify-center items-center bg-[#fffdf8] border-2 border-[#1f2937] p-2 rounded-lg">
                {selectedIngredients.length === 0 ? (
                  <span className="text-[10px] font-bold text-[#9ca3af] italic">Trống</span>
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

              {/* Controls */}
              <div className="grid grid-cols-2 gap-3 mt-4">
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

            {/* Notification / Feedback dialog */}
            <div className="bg-[#fffaf0] border-[3px] border-[#1f2937] shadow-[6px_6px_0px_#1f2937] rounded-xl p-5 min-h-[145px] flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wide mb-1.5">Phản hồi của tiệm</h4>
                <p className={`text-sm font-bold leading-relaxed
                  ${messageType === 'success' ? 'text-[#16a34a]' : messageType === 'error' ? 'text-[#dc2626]' : 'text-[#111827]'}`}>
                  {gameMessage}
                </p>
              </div>

              {/* Active mistakes list explanation */}
              {activeMistakes.length > 0 && (
                <div className="mt-4 border-t-2 border-dashed border-[#1f2937] pt-3">
                  <h5 className="text-[10px] font-black text-[#dc2626] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
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
            >
              ✕
            </button>

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
            >
              ✕
            </button>

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
    </main>
  );
}
