import React, { useState, useEffect } from 'react';

interface PixelPetProps {
  coins?: number;
  setCoins?: (c: number) => void;
  onPlayTTS?: (text: string) => void;
  playSfx?: (type: any) => void;
  isDarkMode?: boolean;
  externalShowShop?: boolean;
  onToggleShop?: (show: boolean) => void;
  isVy?: boolean;
  isKhang?: boolean;
}

type PetType = 'cat' | 'dog' | 'rabbit' | 'panda';

const PET_PHRASES: Record<PetType, Array<{ text: string; pinyin: string; translation: string }>> = {
  cat: [
    { text: 'Meow~ meow~', pinyin: 'māo māo', translation: 'Mèo kêu meo meo nũng nịu đòi vuốt ve' },
    { text: 'Meow! meow!', pinyin: 'māo māo', translation: 'Mèo dụi đầu cọ cọ vào chân chủ nhân' }
  ],
  dog: [
    { text: 'Woof! woof!', pinyin: 'wāng wāng', translation: 'Chó Shiba vẫy đuôi gâu gâu mừng rỡ' },
    { text: 'Arf! arf!', pinyin: 'wāng wāng', translation: 'Chú chó Shiba lật ngửa bụng đòi xoa' }
  ],
  rabbit: [
    { text: 'Chíp chíp~', pinyin: 'jī jī', translation: 'Thỏ con tai dài ngoắc tai nhút nhát' },
    { text: 'Nhai nhai~', pinyin: 'jī jī', translation: 'Thỏ trắng tung tăng nhảy chân nheo mắt' }
  ],
  panda: [
    { text: 'Khịt khịt~', pinyin: 'xīng māo', translation: 'Gấu trúc béo tròn ngơ ngác nhai lá trúc' },
    { text: 'Ủn ỉn~', pinyin: 'xīng māo', translation: 'Gấu trúc Panda lăn quay ra đất đáng yêu' }
  ]
};

const PET_FOODS = [
  { id: 'fish', name: 'Cá Tươi (鲜鱼)', price: 15, phrase: { text: 'Meow meow~', pinyin: 'māo māo', translation: 'Mèo liếm mép thưởng thức đĩa cá tươi ngon!' } },
  { id: 'can', name: 'Pate Đóng Hộp (罐头)', price: 30, phrase: { text: 'Woof woof~', pinyin: 'wāng wāng', translation: 'Thú cưng nhai pate ngon lành thỏa mãn!' } },
  { id: 'bone', name: 'Xương Bò Thơm (牛骨)', price: 20, phrase: { text: 'Arf arf~', pinyin: 'wāng wāng', translation: 'Gặm cục xương bò thơm phức đầy hào hứng!' } }
];

const PET_CATALOG: Array<{ id: PetType; name: string; price: number; desc: string }> = [
  { id: 'cat', name: 'Mèo Cam Chibi Pixel', price: 0, desc: 'Mèo cam múp mạp 2D Pixel' },
  { id: 'dog', name: 'Chó Shiba Vàng Pixel', price: 0, desc: 'Chú chó Shiba vẫy đuôi 2D Pixel' },
  { id: 'rabbit', name: 'Thỏ Trắng Chibi Pixel', price: 50, desc: 'Thỏ tai dài tai hồng nhảy tung tăng' },
  { id: 'panda', name: 'Gấu Trúc Panda Quốc Bảo', price: 100, desc: 'Gấu trúc Panda mắt quầng đáng yêu' }
];

const VOUCHER_ITEMS_VY = [
  { id: 'v_milktea', name: 'Voucher Trà Sữa Size L', price: 50, desc: 'Nhựt Khang bao 1 ly trà sữa tự chọn' },
  { id: 'v_movie', name: 'Voucher Đi Xem Phim Rạp', price: 100, desc: 'Bao 1 buổi xem phim rạp ngọt ngào' },
  { id: 'v_hug', name: 'Voucher 100 Cái Ôm Ấm Cúng', price: 20, desc: 'Đổi lấy cái ôm thật chặt từ Khang' }
];

const VOUCHER_ITEMS_KHANG = [
  { id: 'v_praise', name: 'Voucher Đổi 1 Lời Khen Ngọt Ngào', price: 30, desc: 'Đổi 1 lời khen nức nở từ Lan Vy' },
  { id: 'v_tea', name: 'Voucher Trà Chanh Chém Gió', price: 50, desc: 'Lan Vy bao 1 ly nước ép/trà chanh' },
  { id: 'v_dish', name: 'Voucher Miễn Phạt Rửa Bát', price: 100, desc: 'Khang được miễn làm việc nhà 1 ngày' }
];

const VOUCHER_ITEMS_GENERAL = [
  { id: 'v_x2xp', name: 'Voucher Nhân Đôi HSK XP', price: 30, desc: 'Nhận gấp đôi điểm kinh nghiệm cho 5 bài Quiz HSK' },
  { id: 'v_discount', name: 'Voucher Giảm Giá Nội Thất 50%', price: 50, desc: 'Giảm 50% giá mở khóa toàn bộ nội thất' },
  { id: 'v_giftbox', name: 'Voucher Hộp Quà Bí Mật HSK', price: 100, desc: 'Thưởng ngẫu nhiên 200 Xu & 3 Thức ăn Thú cưng' }
];

const PET_ACCESSORIES = [
  { id: 'hat', name: 'Mũ Rơm Du Lịch', price: 25, desc: 'Chiếc mũ rơm che nắng xinh xắn' },
  { id: 'glasses', name: 'Kính Tròn Học Giả', price: 35, desc: 'Kính mắt tròn tri thức cho Pet' },
  { id: 'bow', name: 'Vòng Cổ Nơ Hồng', price: 20, desc: 'Nơ hồng xinh xắn trên cổ Pet' },
  { id: 'balloon', name: 'Bong Bóng Trái Tim', price: 40, desc: 'Bong bóng trái tim bay theo sau' }
];

export const PixelPet: React.FC<PixelPetProps> = ({
  coins = 100,
  setCoins,
  onPlayTTS,
  playSfx,
  isDarkMode = false,
  externalShowShop,
  onToggleShop,
  isVy = false,
  isKhang = false
}) => {
  const [currentPet, setCurrentPet] = useState<PetType>('cat');
  const [unlockedPets, setUnlockedPets] = useState<PetType[]>(['cat', 'dog']);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPet = localStorage.getItem('hsk_selected_pet') as PetType;
      if (savedPet && ['cat', 'dog', 'rabbit', 'panda'].includes(savedPet)) {
        setCurrentPet(savedPet);
      }
      const savedUnlocked = localStorage.getItem('hsk_unlocked_pets');
      if (savedUnlocked) {
        try {
          const parsed = JSON.parse(savedUnlocked);
          if (Array.isArray(parsed) && parsed.length > 0) setUnlockedPets(parsed);
        } catch (e) {}
      }
    }
  }, []);

  const selectPet = (petId: PetType) => {
    setCurrentPet(petId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hsk_selected_pet', petId);
    }
  };
  const [activeSpeech, setActiveSpeech] = useState<{ text: string; pinyin: string; translation: string } | null>(null);
  const [isHearting, setIsHearting] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isEating, setIsEating] = useState(false);
  
  // TAMAGOTCHI MOOD BARS
  const [hunger, setHunger] = useState(85);
  const [happiness, setHappiness] = useState(90);
  const [energy, setEnergy] = useState(80);

  // ACCESSORIES & EVOLUTION STAGE
  const [equippedAccessory, setEquippedAccessory] = useState<string>('none');
  const [unlockedAccessories, setUnlockedAccessories] = useState<string[]>([]);

  // EVOLUTION STAGE: 1 = Baby, 2 = Student (Backpack & Scarf), 3 = Master (Sunglasses & Crown)
  const petStage = coins >= 300 ? 3 : coins >= 100 ? 2 : 1;

  const [internalShowShop, setInternalShowShop] = useState(false);
  const showShop = externalShowShop !== undefined ? externalShowShop : internalShowShop;
  const setShowShop = (val: boolean) => {
    setInternalShowShop(val);
    if (onToggleShop) onToggleShop(val);
  };
  const [shopTab, setShopTab] = useState<'food' | 'pet' | 'accessory' | 'voucher'>('food');
  const [purchasedVouchers, setPurchasedVouchers] = useState<string[]>([]);

  const activeVoucherList = isVy 
    ? VOUCHER_ITEMS_VY 
    : isKhang 
    ? VOUCHER_ITEMS_KHANG 
    : VOUCHER_ITEMS_GENERAL;

  const voucherTabTitle = isVy 
    ? 'Voucher Vy' 
    : isKhang 
    ? 'Voucher Khang' 
    : 'Voucher HSK';

  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [isWalking, setIsWalking] = useState(false);

  // Tự động cho thú cưng di chuyển tự do khắp chiều rộng màn hình phía dưới
  useEffect(() => {
    if (showShop) return;

    const updateWander = () => {
      // 25% cơ hội thú cưng ngơi nghỉ đi ngủ Zzz
      if (Math.random() < 0.25 && !isJumping && !isEating) {
        setIsSleeping(true);
        setIsWalking(false);
        setTimeout(() => setIsSleeping(false), 4500);
        return;
      }

      setIsSleeping(false);
      const screenW = typeof window !== 'undefined' ? window.innerWidth - 100 : 800;
      const nextTarget = Math.floor(Math.random() * Math.max(200, screenW - 60)) + 20;

      setPosX(prev => {
        setDirection(nextTarget < prev ? 'left' : 'right');
        return nextTarget;
      });
      setIsWalking(true);
      setTimeout(() => setIsWalking(false), 3500);
    };

    // Khởi tạo vị trí ban đầu ngẫu nhiên
    if (posX === 0 && typeof window !== 'undefined') {
      setPosX(Math.floor(Math.random() * (window.innerWidth - 200)) + 50);
    }

    const interval = setInterval(updateWander, 5500);
    return () => clearInterval(interval);
  }, [showShop, isJumping, isEating]);

  const triggerPetSound = () => {
    if (!playSfx) return;
    if (currentPet === 'cat') playSfx('meow');
    else if (currentPet === 'dog') playSfx('bark');
    else if (currentPet === 'rabbit') playSfx('squeak');
    else if (currentPet === 'panda') playSfx('grunt');
    else playSfx('perfect');
  };

  const handlePetClick = () => {
    triggerPetSound();

    // Kích hoạt animation nhảy cẫng vui sướng
    setIsSleeping(false);
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 1000);

    const phrases = PET_PHRASES[currentPet];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setActiveSpeech(randomPhrase);
    setIsHearting(true);

    setTimeout(() => setIsHearting(false), 1500);
    setTimeout(() => setActiveSpeech(null), 3500);
  };

  const handleFeedPet = (food: typeof PET_FOODS[0]) => {
    if (coins < food.price) {
      if (playSfx) playSfx('error');
      alert(`Bạn không đủ Xu! Cần ${food.price} Xu để mua ${food.name}.`);
      return;
    }

    if (setCoins) setCoins(coins - food.price);
    triggerPetSound();

    setIsSleeping(false);
    setIsEating(true);
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 1200);
    setTimeout(() => setIsEating(false), 3000);

    setActiveSpeech(food.phrase);
    setIsHearting(true);

    setTimeout(() => setIsHearting(false), 1800);
    setTimeout(() => setActiveSpeech(null), 3500);
    setShowShop(false);
  };

  const handleUnlockPet = (pet: typeof PET_CATALOG[0]) => {
    if (unlockedPets.includes(pet.id)) {
      selectPet(pet.id);
      triggerPetSound();
      return;
    }

    if (coins < pet.price) {
      if (playSfx) playSfx('error');
      alert(`Vy cần ${pet.price} Xu để mở khóa ${pet.name}!`);
      return;
    }

    if (setCoins) setCoins(coins - pet.price);
    if (playSfx) playSfx('levelUp');
    const newUnlocked = [...unlockedPets, pet.id];
    setUnlockedPets(newUnlocked);
    selectPet(pet.id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hsk_unlocked_pets', JSON.stringify(newUnlocked));
    }
    alert(`Chúc mừng Vy đã mở khóa thú cưng ${pet.name}!`);
  };

  const handleBuyVoucher = (v: typeof VOUCHER_ITEMS_VY[0]) => {
    if (coins < v.price) {
      if (playSfx) playSfx('error');
      alert(`Vy cần ${v.price} Xu để đổi ${v.name}!`);
      return;
    }

    if (setCoins) setCoins(coins - v.price);
    if (playSfx) playSfx('levelUp');
    setPurchasedVouchers(prev => [...prev, v.name]);
    alert(`Chúc mừng Vy đã đổi thành công: ${v.name}!`);
  };

  return (
    <div className="fixed bottom-16 sm:bottom-16 md:bottom-2 left-0 right-0 z-30 select-none pointer-events-none w-full h-32 overflow-visible">
      {/* Container di chuyển mượt khắp màn hình */}
      <div 
        className="absolute bottom-0 transition-all duration-[3500ms] ease-in-out pointer-events-auto flex flex-col items-center"
        style={{ left: `${posX}px` }}
      >
        {/* STAGE & QUICK PET SWITCHER TOOLBAR */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-40">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100 text-[10px] font-mono font-bold drop-shadow-md whitespace-nowrap bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-amber-500 font-extrabold">Cấp {petStage}</span>
            <span className="text-slate-300 dark:text-slate-700 font-normal">|</span>
            <span className="text-rose-500 font-extrabold">No {hunger}%</span>
            <span className="text-slate-300 dark:text-slate-700 font-normal">|</span>
            {/* Quick Pet Swapper */}
            <div className="flex items-center gap-1 ml-0.5">
              <button
                type="button"
                onClick={() => selectPet('cat')}
                className={`px-1 py-0.5 rounded transition text-[11px] ${currentPet === 'cat' ? 'bg-orange-500 text-white font-bold scale-110' : 'hover:bg-slate-100 dark:hover:bg-slate-800 opacity-70'}`}
                title="Đổi sang Mèo Cam"
              >
                🐱
              </button>
              <button
                type="button"
                onClick={() => selectPet('dog')}
                className={`px-1 py-0.5 rounded transition text-[11px] ${currentPet === 'dog' ? 'bg-amber-500 text-white font-bold scale-110' : 'hover:bg-slate-100 dark:hover:bg-slate-800 opacity-70'}`}
                title="Đổi sang Chó Shiba"
              >
                🐶
              </button>
              <button
                type="button"
                onClick={() => selectPet('rabbit')}
                className={`px-1 py-0.5 rounded transition text-[11px] ${currentPet === 'rabbit' ? 'bg-rose-400 text-white font-bold scale-110' : 'hover:bg-slate-100 dark:hover:bg-slate-800 opacity-70'}`}
                title="Đổi sang Thỏ Trắng"
              >
                🐰
              </button>
              <button
                type="button"
                onClick={() => selectPet('panda')}
                className={`px-1 py-0.5 rounded transition text-[11px] ${currentPet === 'panda' ? 'bg-slate-800 text-white font-bold scale-110' : 'hover:bg-slate-100 dark:hover:bg-slate-800 opacity-70'}`}
                title="Đổi sang Gấu Trúc Panda"
              >
                🐼
              </button>
            </div>
          </div>
        </div>

        {/* POPUP TRÒ CHUYỆN PIXEL 2D SANG TRỌNG KHÔNG VIỀN CỨNG */}
        {activeSpeech && (
          <div className="absolute -top-28 z-50 w-52 sm:w-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl shadow-xl text-center space-y-1 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto border-0">
            <p className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">{activeSpeech.text}</p>
            <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">{activeSpeech.pinyin}</p>
            <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{activeSpeech.translation}</p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 dark:bg-slate-900/95 rotate-45 border-0 shadow-xs" />
          </div>
        )}

        {/* HIỆU ỨNG THẢ TIM XP KHÔNG KHUNG BỌC */}
        {isHearting && (
          <div className="absolute -top-8 text-rose-500 font-mono font-bold text-xs animate-bounce z-50 drop-shadow-md">
            +50 HSK XP
          </div>
        )}

        {/* HIỆU ỨNG NGỦ Zzz KHÔNG KHUNG BỌC */}
        {isSleeping && !activeSpeech && (
          <div className="absolute -top-9 text-indigo-500 dark:text-indigo-400 font-mono font-bold text-xs animate-pulse z-50 flex items-center gap-1 drop-shadow-md">
            <span className="animate-bounce">Z</span>
            <span className="animate-bounce delay-100">z</span>
            <span className="animate-bounce delay-200">z</span> (Đang ngủ)
          </div>
        )}

        {/* HIỆU ỨNG ĐANG ĂN KHÔNG KHUNG BỌC */}
        {isEating && (
          <div className="absolute -top-8 text-amber-500 font-mono font-bold text-xs animate-bounce z-50 drop-shadow-md">
            Nhai nhai... 😋
          </div>
        )}

        {/* CƠ THỂ PIXEL PET VỚI HOẠT ẢNH HOẠT ĐỘNG VUI VẺ */}
        <div 
          onClick={handlePetClick}
          className={`relative group cursor-pointer transition-transform duration-300 hover:scale-125 ${
            direction === 'left' ? '-scale-x-100' : ''
          } ${isJumping ? 'animate-bounce -translate-y-4' : isWalking ? 'animate-pulse' : ''}`}
          title="Bấm vào thú cưng Pixel để trò chuyện!"
        >
          {currentPet === 'cat' && (
            /* SIÊU MÈO CAM TABBY KAWAII CHIBI CÓ VẰN VẬỆT & RÂU MÈO */
            <svg viewBox="0 0 32 32" className="w-14 h-14 sm:w-18 sm:h-18 drop-shadow-xl overflow-visible">
              {/* Fluffy Cat Tail */}
              <path d="M25,22 C29,20 31,14 29,10 C27,8 25,11 25,16 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.2" className="animate-pulse origin-bottom" />
              {/* Cute Round Cat Body */}
              <ellipse cx="16" cy="22" rx="9" ry="7" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
              <ellipse cx="16" cy="23" rx="6" ry="4" fill="#fff7ed" />
              {/* Soft Paws */}
              <circle cx="10" cy="27.5" r="2" fill="#fff7ed" stroke="#c2410c" strokeWidth="1" className={isWalking ? 'animate-bounce' : ''} />
              <circle cx="14" cy="27.5" r="2" fill="#fff7ed" stroke="#c2410c" strokeWidth="1" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <circle cx="18" cy="27.5" r="2" fill="#fff7ed" stroke="#c2410c" strokeWidth="1" className={isWalking ? 'animate-bounce' : ''} />
              <circle cx="22" cy="27.5" r="2" fill="#fff7ed" stroke="#c2410c" strokeWidth="1" className={isWalking ? 'animate-bounce delay-75' : ''} />
              {/* Pointy Cat Ears */}
              <path d="M6,12 L9,3 L13,10 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.2" />
              <path d="M7.5,11 L9.5,5 L11.5,10 Z" fill="#fda4af" />
              <path d="M19,10 L23,3 L26,12 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.2" />
              <path d="M20.5,10 L22.5,5 L24.5,11 Z" fill="#fda4af" />
              {/* Round Cat Head */}
              <circle cx="16" cy="14" r="8.5" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
              {/* Tabby Stripes on forehead */}
              <path d="M16,7 L16,10 M14,8 L14,10 M18,8 L18,10" stroke="#c2410c" strokeWidth="1.2" strokeLinecap="round" />
              {/* Cat Muzzle */}
              <ellipse cx="16" cy="16" rx="4" ry="2.5" fill="#fff7ed" />
              {/* Whiskers */}
              <path d="M7,15 L12,16 M7,17 L12,17 M20,16 L25,15 M20,17 L25,17" stroke="#c2410c" strokeWidth="0.9" />
              {/* Blush Cheeks */}
              <ellipse cx="9.5" cy="16" rx="1.5" ry="0.9" fill="#f43f5e" opacity="0.6" />
              <ellipse cx="22.5" cy="16" rx="1.5" ry="0.9" fill="#f43f5e" opacity="0.6" />
              {/* Anime Cat Eyes */}
              {!isSleeping ? (
                <>
                  <ellipse cx="11.5" cy="13.5" rx="2" ry="2.5" fill="#0f172a" />
                  <circle cx="12.2" cy="12.5" r="0.8" fill="#ffffff" />
                  <ellipse cx="20.5" cy="13.5" rx="2" ry="2.5" fill="#0f172a" />
                  <circle cx="21.2" cy="12.5" r="0.8" fill="#ffffff" />
                </>
              ) : (
                <>
                  <path d="M10,14 Q11.5,12 13,14" stroke="#0f172a" strokeWidth="1.5" fill="none" />
                  <path d="M19,14 Q20.5,12 22,14" stroke="#0f172a" strokeWidth="1.5" fill="none" />
                </>
              )}
              {/* Nose & Cat Mouth w */}
              <polygon points="15.2,15 16.8,15 16,15.8" fill="#f43f5e" />
              <path d="M14.5,16.2 Q15.5,17.2 16,16.2 Q16.5,17.2 17.5,16.2" stroke="#c2410c" strokeWidth="1" fill="none" strokeLinecap="round" />
            </svg>
          )}

          {currentPet === 'dog' && (
            /* SIÊU CHÓ SHIBA VÀNG CHIBI CÓ LÔNG BỤNG TRẮNG & LÔNG MÀY */
            <svg viewBox="0 0 32 32" className="w-14 h-14 sm:w-18 sm:h-18 drop-shadow-xl overflow-visible">
              {/* Curly Shiba Tail */}
              <path d="M24,20 C27,17 27,13 25,12 C23,11 22,14 24,18 Z" fill="#eab308" stroke="#a16207" strokeWidth="1.5" className="animate-pulse" />
              {/* Shiba Body */}
              <ellipse cx="16" cy="22" rx="9" ry="7" fill="#eab308" stroke="#a16207" strokeWidth="1.5" />
              <ellipse cx="16" cy="23" rx="6" ry="4.5" fill="#ffffff" />
              {/* Paws */}
              <circle cx="10" cy="27.5" r="2" fill="#ffffff" stroke="#a16207" strokeWidth="1" className={isWalking ? 'animate-bounce' : ''} />
              <circle cx="14" cy="27.5" r="2" fill="#ffffff" stroke="#a16207" strokeWidth="1" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <circle cx="18" cy="27.5" r="2" fill="#ffffff" stroke="#a16207" strokeWidth="1" className={isWalking ? 'animate-bounce' : ''} />
              <circle cx="22" cy="27.5" r="2" fill="#ffffff" stroke="#a16207" strokeWidth="1" className={isWalking ? 'animate-bounce delay-75' : ''} />
              {/* Perky Folded Ears */}
              <path d="M6,10 L9,3 L13,10 Z" fill="#ca8a04" stroke="#a16207" strokeWidth="1.2" />
              <path d="M19,10 L23,3 L26,10 Z" fill="#ca8a04" stroke="#a16207" strokeWidth="1.2" />
              {/* Shiba Head */}
              <circle cx="16" cy="14" r="8.5" fill="#eab308" stroke="#a16207" strokeWidth="1.5" />
              <ellipse cx="16" cy="16.5" rx="5" ry="3.5" fill="#ffffff" stroke="#a16207" strokeWidth="1" />
              {/* White Eyebrow Dots */}
              <circle cx="11.5" cy="10" r="1.2" fill="#ffffff" />
              <circle cx="20.5" cy="10" r="1.2" fill="#ffffff" />
              {/* Blush */}
              <ellipse cx="9" cy="15" rx="1.5" ry="0.9" fill="#fda4af" opacity="0.8" />
              <ellipse cx="23" cy="15" rx="1.5" ry="0.9" fill="#fda4af" opacity="0.8" />
              {/* Eyes */}
              {!isSleeping ? (
                <>
                  <circle cx="11.5" cy="13" r="1.8" fill="#0f172a" />
                  <circle cx="12" cy="12.3" r="0.7" fill="#ffffff" />
                  <circle cx="20.5" cy="13" r="1.8" fill="#0f172a" />
                  <circle cx="21" cy="12.3" r="0.7" fill="#ffffff" />
                </>
              ) : (
                <>
                  <path d="M10,13.5 Q11.5,12 13,13.5" stroke="#0f172a" strokeWidth="1.5" fill="none" />
                  <path d="M19,13.5 Q20.5,12 22,13.5" stroke="#0f172a" strokeWidth="1.5" fill="none" />
                </>
              )}
              {/* Shiba Snout & Smile */}
              <ellipse cx="16" cy="15" rx="1.3" ry="1" fill="#0f172a" />
              <path d="M15,16 Q16,17 17,16" stroke="#0f172a" strokeWidth="1" fill="none" />
            </svg>
          )}

          {currentPet === 'rabbit' && (
            /* SIÊU THỎ TRẮNG TAI CỰC DÀI KAWAII CÓ MẮT NGỌC BÍCH HỒNG */
            <svg viewBox="0 0 32 32" className="w-14 h-14 sm:w-18 sm:h-18 drop-shadow-xl overflow-visible">
              {/* Round Fluffy Bunny Tail */}
              <circle cx="25" cy="22" r="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
              {/* Rabbit Body */}
              <ellipse cx="16" cy="23" rx="8.5" ry="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Paws */}
              <circle cx="10" cy="28" r="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className={isWalking ? 'animate-bounce' : ''} />
              <circle cx="14" cy="28" r="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <circle cx="18" cy="28" r="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className={isWalking ? 'animate-bounce' : ''} />
              <circle cx="22" cy="28" r="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" className={isWalking ? 'animate-bounce delay-75' : ''} />
              {/* GIANT TALL RABBIT EARS */}
              <g className="animate-pulse origin-bottom">
                <rect x="8.5" y="-3" width="4" height="15" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
                <rect x="9.5" y="-1.5" width="2" height="12" rx="1" fill="#fda4af" />
                <rect x="19.5" y="-3" width="4" height="15" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
                <rect x="20.5" y="-1.5" width="2" height="12" rx="1" fill="#fda4af" />
              </g>
              {/* Rabbit Head */}
              <circle cx="16" cy="15" r="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Pink Cheeks */}
              <ellipse cx="9" cy="16.5" rx="2" ry="1.2" fill="#f43f5e" opacity="0.6" />
              <ellipse cx="23" cy="16.5" rx="2" ry="1.2" fill="#f43f5e" opacity="0.6" />
              {/* Shiny Ruby Eyes */}
              {!isSleeping ? (
                <>
                  <circle cx="11.5" cy="14" r="2.2" fill="#f43f5e" />
                  <circle cx="12.3" cy="13.2" r="0.9" fill="#ffffff" />
                  <circle cx="20.5" cy="14" r="2.2" fill="#f43f5e" />
                  <circle cx="21.3" cy="13.2" r="0.9" fill="#ffffff" />
                </>
              ) : (
                <>
                  <path d="M10,14.5 Q11.5,13 13,14.5" stroke="#f43f5e" strokeWidth="1.5" fill="none" />
                  <path d="M19,14.5 Q20.5,13 22,14.5" stroke="#f43f5e" strokeWidth="1.5" fill="none" />
                </>
              )}
              {/* Nose & Front Tooth */}
              <polygon points="15.2,15.8 16.8,15.8 16,16.5" fill="#f43f5e" />
              <rect x="15.4" y="16.5" width="1.2" height="1.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
            </svg>
          )}

          {currentPet === 'panda' && (
            /* SIÊU GẤU TRÚC PANDA KAWAII CHIBI CÓ QUẦNG MẮT ĐEN & CÀNH TRÚC BẢO VỆ */
            <svg viewBox="0 0 32 32" className="w-14 h-14 sm:w-18 sm:h-18 drop-shadow-xl overflow-visible">
              {/* Panda Body */}
              <ellipse cx="16" cy="22" rx="9" ry="7" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
              {/* Black Vest/Shoulder band */}
              <path d="M7,20 C10,17 22,17 25,20 C24,26 8,26 7,20 Z" fill="#0f172a" />
              {/* Black Paws */}
              <circle cx="10" cy="27.5" r="2" fill="#0f172a" className={isWalking ? 'animate-bounce' : ''} />
              <circle cx="14" cy="27.5" r="2" fill="#0f172a" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <circle cx="18" cy="27.5" r="2" fill="#0f172a" className={isWalking ? 'animate-bounce' : ''} />
              <circle cx="22" cy="27.5" r="2" fill="#0f172a" className={isWalking ? 'animate-bounce delay-75' : ''} />
              {/* Round Black Panda Ears */}
              <circle cx="8" cy="7.5" r="3.5" fill="#0f172a" />
              <circle cx="24" cy="7.5" r="3.5" fill="#0f172a" />
              {/* White Panda Head */}
              <circle cx="16" cy="14" r="8.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
              {/* Big Black Oval Eye Patches */}
              <ellipse cx="10.5" cy="13.5" rx="3" ry="2.2" fill="#0f172a" transform="rotate(-15, 10.5, 13.5)" />
              <circle cx="10.8" cy="13.2" r="1" fill="#ffffff" />
              <ellipse cx="21.5" cy="13.5" rx="3" ry="2.2" fill="#0f172a" transform="rotate(15, 21.5, 13.5)" />
              <circle cx="21.2" cy="13.2" r="1" fill="#ffffff" />
              {/* Blush */}
              <ellipse cx="8.5" cy="16.5" rx="1.8" ry="1" fill="#fda4af" opacity="0.8" />
              <ellipse cx="23.5" cy="16.5" rx="1.8" ry="1" fill="#fda4af" opacity="0.8" />
              <ellipse cx="16" cy="15.5" rx="1.3" ry="1" fill="#0f172a" />
              {/* Green Bamboo stick in mouth */}
              <path d="M12,18 L21,15" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>
      {showShop && (
        <div 
          onClick={() => setShowShop(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 pointer-events-auto cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-3xl shadow-2xl max-w-md w-full space-y-3 text-left text-slate-900 dark:text-slate-100 relative cursor-default"
          >
            {/* HEADER MODAL */}
            <div className="flex justify-between items-center border-b border-dashed border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  Cửa Hàng Pixel Pet & Voucher HSK
                </span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  Số Xu hiện tại: <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">{coins} Xu</span>
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setShowShop(false)} 
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full font-bold text-sm cursor-pointer flex items-center justify-center shrink-0 transition-all active:scale-95"
                title="Đóng cửa hàng"
              >
                ✕
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShopTab('food')}
                className={`py-1 text-[10px] sm:text-[11px] font-bold rounded-lg transition cursor-pointer ${
                  shopTab === 'food' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Thức Ăn
              </button>
              <button
                onClick={() => setShopTab('pet')}
                className={`py-1 text-[10px] sm:text-[11px] font-bold rounded-lg transition cursor-pointer ${
                  shopTab === 'pet' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Đổi Pet
              </button>
              <button
                onClick={() => setShopTab('accessory')}
                className={`py-1 text-[10px] sm:text-[11px] font-bold rounded-lg transition cursor-pointer ${
                  shopTab === 'accessory' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Phụ Kiện
              </button>
              <button
                onClick={() => setShopTab('voucher')}
                className={`py-1 text-[10px] sm:text-[11px] font-bold rounded-lg transition cursor-pointer ${
                  shopTab === 'voucher' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Voucher
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {shopTab === 'food' && (
                <>
                  {PET_FOODS.map(food => (
                    <button
                      key={food.id}
                      onClick={() => handleFeedPet(food)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800/90 hover:bg-amber-50 dark:hover:bg-slate-700/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-left flex justify-between items-center text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">{food.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Thưởng thoại tiếng Trung & +50 XP</div>
                      </div>
                      <span className="text-xs bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full font-mono font-bold border border-amber-300">
                        {food.price} Xu
                      </span>
                    </button>
                  ))}
                </>
              )}

              {shopTab === 'accessory' && (
                <>
                  {PET_ACCESSORIES.map(acc => {
                    const isUnlocked = unlockedAccessories.includes(acc.id);
                    const isEquipped = equippedAccessory === acc.id;

                    return (
                      <div
                        key={acc.id}
                        className="p-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl flex justify-between items-center text-xs shadow-xs"
                      >
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">{acc.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{acc.desc}</div>
                        </div>
                        {isEquipped ? (
                          <button
                            onClick={() => setEquippedAccessory('none')}
                            className="text-[10px] bg-slate-700 text-white font-bold px-2.5 py-1 rounded-full border border-slate-600 cursor-pointer"
                          >
                            Tháo Ra
                          </button>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => setEquippedAccessory(acc.id)}
                            className="text-[10px] bg-purple-600 text-white font-bold px-2.5 py-1 rounded-full border border-purple-700 cursor-pointer"
                          >
                            Trang Bị
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (coins < acc.price) {
                                alert(`Cần ${acc.price} Xu để mua ${acc.name}!`);
                                return;
                              }
                              if (setCoins) setCoins(coins - acc.price);
                              setUnlockedAccessories(prev => [...prev, acc.id]);
                              setEquippedAccessory(acc.id);
                            }}
                            className="text-[10px] bg-amber-400 text-amber-950 font-bold px-2.5 py-1 rounded-full border border-amber-300 cursor-pointer"
                          >
                            Mua ({acc.price} Xu)
                          </button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}

              {shopTab === 'pet' && (
                <>
                  {PET_CATALOG.map(pet => {
                    const isUnlocked = unlockedPets.includes(pet.id);
                    const isSelected = currentPet === pet.id;

                    return (
                      <div
                        key={pet.id}
                        className="p-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl flex justify-between items-center text-xs shadow-xs"
                      >
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">{pet.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{pet.desc}</div>
                        </div>
                        {isSelected ? (
                          <span className="text-[10px] bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-full border border-emerald-600">
                            Đang Dùng
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => handleUnlockPet(pet)}
                            className="text-[10px] bg-amber-400 text-amber-950 hover:bg-amber-500 font-bold px-2.5 py-1 rounded-full border border-amber-300 cursor-pointer"
                          >
                            Sử Dụng
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnlockPet(pet)}
                            className="text-[10px] bg-rose-500 text-white hover:bg-rose-600 font-bold px-2.5 py-1 rounded-full border border-rose-600 cursor-pointer flex items-center gap-1"
                          >
                            Mở Khóa ({pet.price} Xu)
                          </button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}

              {shopTab === 'voucher' && (
                <>
                  {activeVoucherList.map(v => {
                    const isBought = purchasedVouchers.includes(v.name);

                    return (
                      <div
                        key={v.id}
                        className="p-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl flex justify-between items-center text-xs shadow-xs"
                      >
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">{v.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{v.desc}</div>
                        </div>
                        {isBought ? (
                          <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-2.5 py-1 rounded-full border border-indigo-300">
                            Đã Sở Hữu
                          </span>
                        ) : (
                          <button
                            onClick={() => handleBuyVoucher(v)}
                            className="text-[10px] bg-indigo-600 text-white hover:bg-indigo-700 font-bold px-2.5 py-1 rounded-full border border-indigo-700 cursor-pointer"
                          >
                            Đổi ({v.price} Xu)
                          </button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
