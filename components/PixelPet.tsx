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
      alert(`Vy không đủ Xu! Cần ${food.price} Xu để mua ${food.name}.`);
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
      setCurrentPet(pet.id);
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
    setUnlockedPets(prev => [...prev, pet.id]);
    setCurrentPet(pet.id);
    triggerPetSound();
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
    <div className="fixed bottom-18 md:bottom-2 left-0 right-0 z-30 select-none pointer-events-none w-full h-32 overflow-visible">
      {/* Container di chuyển mượt khắp màn hình */}
      <div 
        className="absolute bottom-0 transition-all duration-[3500ms] ease-in-out pointer-events-auto flex flex-col items-center"
        style={{ left: `${posX}px` }}
      >
        {/* POPUP TRÒ CHUYỆN PIXEL 2D SANG TRỌNG KHÔNG VIỀN CỨNG */}
        {activeSpeech && (
          <div className="absolute -top-28 z-50 w-52 sm:w-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl shadow-xl text-center space-y-1 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto border-0">
            <p className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">{activeSpeech.text}</p>
            <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">{activeSpeech.pinyin}</p>
            <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{activeSpeech.translation}</p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 dark:bg-slate-900/95 rotate-45 border-0 shadow-xs" />
          </div>
        )}

        {/* HIỆU ỨNG THẢ TIM XP */}
        {isHearting && (
          <div className="absolute -top-8 text-white font-mono font-bold text-[10px] sm:text-xs animate-bounce z-50 bg-rose-500 px-3 py-0.5 rounded-full shadow-md border-0">
            +50 HSK XP
          </div>
        )}

        {/* HIỆU ỨNG NGỦ Zzz */}
        {isSleeping && !activeSpeech && (
          <div className="absolute -top-9 text-indigo-600 dark:text-indigo-300 font-mono font-bold text-xs animate-pulse z-50 bg-indigo-100 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-full shadow-sm border-0 flex items-center gap-1">
            <span className="animate-bounce">Z</span>
            <span className="animate-bounce delay-100">z</span>
            <span className="animate-bounce delay-200">z</span> (Đang ngủ)
          </div>
        )}

        {/* HIỆU ỨNG ĐANG ĂN */}
        {isEating && (
          <div className="absolute -top-7 text-amber-700 dark:text-amber-300 font-mono font-bold text-[11px] animate-bounce z-50 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full shadow-sm border-0">
            Nhai nhai... Ngon quá!
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
            /* CON MÈO CAM PIXEL CHIBI CÓ QUAY ĐUÔI VÀ CHỚP MẮT */
            <svg viewBox="0 0 32 32" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-lg" shapeRendering="crispEdges">
              {/* Tail Pixel với hoạt ảnh vẫy đuôi */}
              <g className="origin-bottom-left animate-spin" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}>
                <path d="M25,18 h3 v-5 h2 v-3 h-2 v3 h-3 z" fill="#ea580c" />
              </g>
              {/* Body Pixel */}
              <rect x="9" y="18" width="16" height="9" fill="#fb923c" stroke="#1f2937" strokeWidth="1" />
              <rect x="11" y="20" width="10" height="6" fill="#fff7ed" />
              {/* 4 Paws Bước đi */}
              <rect x="10" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="14" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="18" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="22" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce delay-75' : ''} />
              {/* Pointy Cat Ears */}
              <rect x="5" y="3" width="4" height="6" fill="#ea580c" />
              <rect x="6" y="5" width="2" height="3" fill="#fda4af" />
              <rect x="17" y="3" width="4" height="6" fill="#ea580c" />
              <rect x="18" y="5" width="2" height="3" fill="#fda4af" />
              {/* Head */}
              <rect x="4" y="9" width="18" height="10" fill="#fb923c" stroke="#1f2937" strokeWidth="1" />
              {/* Eyes */}
              <g className={isSleeping ? 'opacity-40' : ''}>
                <rect x="7" y="12" width="3" height="3" fill="#0f172a" />
                <rect x="8" y="12" width="1" height="1" fill="#ffffff" />
                <rect x="16" y="12" width="3" height="3" fill="#0f172a" />
                <rect x="17" y="12" width="1" height="1" fill="#ffffff" />
              </g>
              {/* Whiskers */}
              <rect x="2" y="14" width="2" height="1" fill="#1f2937" />
              <rect x="22" y="14" width="2" height="1" fill="#1f2937" />
              <rect x="12" y="15" width="2" height="1.5" fill="#f43f5e" />
            </svg>
          )}

          {currentPet === 'dog' && (
            /* CHÓ SHIBA PIXEL CHIBI */
            <svg viewBox="0 0 32 32" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-lg" shapeRendering="crispEdges">
              <rect x="23" y="13" width="5" height="5" fill="#d97706" stroke="#1f2937" strokeWidth="1" />
              <rect x="25" y="15" width="2" height="2" fill="#fff7ed" />
              <rect x="8" y="17" width="17" height="10" fill="#f59e0b" stroke="#1f2937" strokeWidth="1" />
              <rect x="10" y="19" width="11" height="7" fill="#ffffff" />
              <rect x="5" y="16" width="14" height="2" fill="#ef4444" />
              <rect x="11" y="17" width="2" height="2" fill="#f59e0b" />
              <rect x="9" y="27" width="3.5" height="4" fill="#b45309" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="13.5" y="27" width="3.5" height="4" fill="#b45309" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="18" y="27" width="3.5" height="4" fill="#b45309" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="22.5" y="27" width="3.5" height="4" fill="#b45309" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="3" y="5" width="5" height="5" fill="#b45309" />
              <rect x="18" y="5" width="5" height="5" fill="#b45309" />
              <rect x="4" y="8" width="18" height="9" fill="#f59e0b" stroke="#1f2937" strokeWidth="1" />
              <rect x="8" y="12" width="10" height="5" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
              <rect x="12" y="13" width="2" height="2" fill="#0f172a" />
              <rect x="12" y="15" width="2" height="2" fill="#fda4af" />
              <rect x="7" y="10" width="3" height="3" fill="#0f172a" />
              <rect x="8" y="10" width="1" height="1" fill="#ffffff" />
              <rect x="16" y="10" width="3" height="3" fill="#0f172a" />
              <rect x="17" y="10" width="1" height="1" fill="#ffffff" />
            </svg>
          )}

          {currentPet === 'rabbit' && (
            /* THỎ TRẮNG PIXEL CHIBI */
            <svg viewBox="0 0 32 32" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-lg" shapeRendering="crispEdges">
              <rect x="24" y="19" width="4" height="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="9" y="17" width="16" height="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="10" y="27" width="3" height="4" fill="#cbd5e1" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="14" y="27" width="3" height="4" fill="#cbd5e1" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="18" y="27" width="3" height="4" fill="#cbd5e1" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="22" y="27" width="3" height="4" fill="#cbd5e1" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="6" y="0" width="4" height="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="7" y="1" width="2" height="7" fill="#fda4af" />
              <rect x="16" y="0" width="4" height="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="17" y="1" width="2" height="7" fill="#fda4af" />
              <rect x="4" y="8" width="18" height="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="7" y="12" width="3" height="3" fill="#f43f5e" />
              <rect x="8" y="12" width="1" height="1" fill="#ffffff" />
              <rect x="16" y="12" width="3" height="3" fill="#f43f5e" />
              <rect x="17" y="12" width="1" height="1" fill="#ffffff" />
              <rect x="12" y="14" width="2" height="1.5" fill="#f43f5e" />
              <rect x="12" y="15.5" width="2" height="1.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
            </svg>
          )}

          {currentPet === 'panda' && (
            /* GẤU TRÚC PANDA PIXEL CHIBI */
            <svg viewBox="0 0 32 32" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-lg" shapeRendering="crispEdges">
              <rect x="9" y="17" width="16" height="10" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
              <rect x="9" y="17" width="16" height="4" fill="#0f172a" />
              <rect x="10" y="27" width="3" height="4" fill="#0f172a" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="14" y="27" width="3" height="4" fill="#0f172a" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="18" y="27" width="3" height="4" fill="#0f172a" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="22" y="27" width="3" height="4" fill="#0f172a" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="4" y="4" width="5" height="5" fill="#0f172a" />
              <rect x="17" y="4" width="5" height="5" fill="#0f172a" />
              <rect x="4" y="8" width="18" height="10" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
              <rect x="6" y="10" width="5" height="5" fill="#0f172a" />
              <rect x="8" y="12" width="1.5" height="1.5" fill="#ffffff" />
              <rect x="15" y="10" width="5" height="5" fill="#0f172a" />
              <rect x="16" y="12" width="1.5" height="1.5" fill="#ffffff" />
              <rect x="12" y="14" width="2" height="1.5" fill="#0f172a" />
            </svg>
          )}
        </div>
      </div>

      {/* MODAL CỬA HÀNG PIXEL PET & VOUCHER HSK */}
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
