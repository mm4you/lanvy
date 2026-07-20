import React, { useState, useEffect } from 'react';

interface PixelPetProps {
  coins?: number;
  setCoins?: (c: number) => void;
  onPlayTTS?: (text: string) => void;
  playSfx?: (type: any) => void;
  isDarkMode?: boolean;
}

type PetType = 'cat' | 'dog' | 'rabbit' | 'panda';

const PET_PHRASES: Record<PetType, Array<{ text: string; pinyin: string; translation: string }>> = {
  cat: [
    { text: '喵！主人今天真棒！', pinyin: 'Miāo! Zhǔrén jīntiān zhēn bàng!', translation: 'Meow! Chủ nhân hôm nay thật tuyệt vời!' },
    { text: '我想吃鱼肉。', pinyin: 'Wǒ xiǎng chī yúròu.', translation: 'Tớ muốn ăn cá ngừ tươi ngon!' },
    { text: '你做得非常好！加油！', pinyin: 'Nǐ zuò de fēicháng hǎo! Jiāyóu!', translation: 'Bạn làm rất tốt! Cố lên nhé!' }
  ],
  dog: [
    { text: '汪汪！欢迎回家！', pinyin: 'Wāngwāng! Huānyíng huíjiā!', translation: 'Gâu gâu! Mừng bạn đã về nhà!' },
    { text: '今天天气真好！', pinyin: 'Jīntiān tiānqì zhēn hǎo!', translation: 'Thời tiết hôm nay thật đẹp!' },
    { text: '我们一起玩吧！', pinyin: 'Wǒmen yìqǐ wán ba!', translation: 'Chúng ta cùng chơi nhé!' }
  ],
  rabbit: [
    { text: '兔子喜欢吃胡萝卜！', pinyin: 'Tùzi xǐhuan chī húluóbo!', translation: 'Thỏ con thích ăn củ cà rốt tươi ngon!' },
    { text: '蹦蹦跳跳真开心！', pinyin: 'Bèngbèng tiàotiào zhēn kāixīn!', translation: 'Nhảy nhót tung tăng thật là vui quá!' }
  ],
  panda: [
    { text: '大熊猫喜欢吃竹子！', pinyin: 'Dàxióngmāo xǐhuan chī zhúzi!', translation: 'Gấu trúc béo thích ăn măng trúc thơm!' },
    { text: '我是中国国宝！', pinyin: 'Wǒ shì Zhōngguó guóbǎo!', translation: 'Tớ là quốc bảo tiếng Trung của Vy đấy!' }
  ]
};

const PET_FOODS = [
  { id: 'fish', name: 'Cá Tươi (鲜鱼)', price: 15, phrase: { text: '谢谢主人的大鲜鱼！真好吃！', pinyin: 'Xièxie zhǔrén de dà xiānyú! Zhēn hǎochī!', translation: 'Cảm ơn món cá tươi của chủ nhân! Món ăn ngon tuyệt!' } },
  { id: 'can', name: 'Pate Đóng Hộp (罐头)', price: 30, phrase: { text: '肉罐头太香了！爱死你了！', pinyin: 'Ròuguàntou tài xiāng le! Ài sǐ nǐ le!', translation: 'Pate thịt thơm phức luôn! Yêu chủ nhân nhất đời!' } },
  { id: 'bone', name: 'Xương Bò Thơm (牛骨)', price: 20, phrase: { text: '好香的牛骨头！太满足了！', pinyin: 'Hǎo xiāng de niúgǔtou! Tài mǎnzú le!', translation: 'Cục xương bò thơm phức! Thật thỏa mãn quá!' } }
];

const PET_CATALOG: Array<{ id: PetType; name: string; price: number; desc: string }> = [
  { id: 'cat', name: 'Mèo Cam Chibi Pixel', price: 0, desc: 'Mèo cam múp mạp 2D Pixel' },
  { id: 'dog', name: 'Chó Shiba Vàng Pixel', price: 0, desc: 'Chú chó Shiba vẫy đuôi 2D Pixel' },
  { id: 'rabbit', name: 'Thỏ Trắng Chibi Pixel', price: 50, desc: 'Thỏ tai dài tai hồng nhảy tung tăng' },
  { id: 'panda', name: 'Gấu Trúc Panda Quốc Bảo', price: 100, desc: 'Gấu trúc Panda mắt quầng đáng yêu' }
];

const VOUCHER_ITEMS = [
  { id: 'v_milktea', name: 'Voucher Trà Sữa Size L', price: 50, desc: 'Nhựt Khang bao 1 ly trà sữa tự chọn' },
  { id: 'v_movie', name: 'Voucher Đi Xem Phim Rạp', price: 100, desc: 'Bao 1 buổi xem phim rạp ngọt ngào' },
  { id: 'v_hug', name: 'Voucher 100 Cái Ôm Ấm Cúng', price: 20, desc: 'Đổi lấy cái ôm thật chặt từ Khang' }
];

export const PixelPet: React.FC<PixelPetProps> = ({
  coins = 100,
  setCoins,
  onPlayTTS,
  playSfx,
  isDarkMode = false
}) => {
  const [currentPet, setCurrentPet] = useState<PetType>('cat');
  const [unlockedPets, setUnlockedPets] = useState<PetType[]>(['cat', 'dog']);
  const [activeSpeech, setActiveSpeech] = useState<{ text: string; pinyin: string; translation: string } | null>(null);
  const [isHearting, setIsHearting] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState<'food' | 'pet' | 'voucher'>('food');
  const [purchasedVouchers, setPurchasedVouchers] = useState<string[]>([]);

  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [isWalking, setIsWalking] = useState(false);

  // Tự động cho thú cưng bước đi dạo mượt mà qua lại liên tục
  useEffect(() => {
    if (showShop) return;

    const interval = setInterval(() => {
      setPosX(prev => {
        const nextTarget = prev > 0 ? -120 : 20;
        setDirection(nextTarget > prev ? 'right' : 'left');
        setIsWalking(true);
        setTimeout(() => setIsWalking(false), 2500);
        return nextTarget;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [showShop]);

  const handlePetClick = () => {
    if (playSfx) playSfx('perfect');

    const phrases = PET_PHRASES[currentPet];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setActiveSpeech(randomPhrase);
    setIsHearting(true);

    if (onPlayTTS) {
      onPlayTTS(randomPhrase.text);
    }

    setTimeout(() => setIsHearting(false), 1500);
    setTimeout(() => setActiveSpeech(null), 4000);
  };

  const handleFeedPet = (food: typeof PET_FOODS[0]) => {
    if (coins < food.price) {
      if (playSfx) playSfx('error');
      alert(`Vy không đủ Xu! Cần ${food.price} Xu để mua ${food.name}.`);
      return;
    }

    if (setCoins) setCoins(coins - food.price);
    if (playSfx) playSfx('levelUp');

    setActiveSpeech(food.phrase);
    setIsHearting(true);
    if (onPlayTTS) onPlayTTS(food.phrase.text);

    setTimeout(() => setIsHearting(false), 1800);
    setTimeout(() => setActiveSpeech(null), 4500);
    setShowShop(false);
  };

  const handleUnlockPet = (pet: typeof PET_CATALOG[0]) => {
    if (unlockedPets.includes(pet.id)) {
      setCurrentPet(pet.id);
      if (playSfx) playSfx('click');
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
    alert(`Chúc mừng Vy đã mở khóa thú cưng ${pet.name}!`);
  };

  const handleBuyVoucher = (v: typeof VOUCHER_ITEMS[0]) => {
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
    <div className="fixed bottom-3 right-4 sm:bottom-4 sm:right-6 z-40 select-none pointer-events-auto">
      {/* POPUP TRÒ CHUYỆN PIXEL 2D SẮC NÉT (SPEECH BUBBLE) */}
      {activeSpeech && (
        <div 
          className="absolute -top-28 left-1/2 -translate-x-1/2 z-50 w-48 sm:w-56 bg-white dark:bg-slate-800 border-3 border-[#1f2937] dark:border-slate-600 p-2.5 rounded-2xl shadow-[4px_4px_0px_#1f2937] text-center space-y-1 animate-in fade-in zoom-in-95 duration-200"
          style={{ transform: `translate(${posX}px, ${posY - 50}px)` }}
        >
          <p className="text-xs font-serif font-black text-rose-600 dark:text-rose-400">{activeSpeech.text}</p>
          <p className="text-[10px] font-mono text-gray-500 dark:text-slate-400">{activeSpeech.pinyin}</p>
          <p className="text-[10px] font-bold text-gray-800 dark:text-slate-200">&gt; {activeSpeech.translation}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-b-3 border-r-3 border-[#1f2937] dark:border-slate-600 rotate-45" />
        </div>
      )}

      {/* HIỆU ỨNG THẢ TIM XP KHI TƯƠNG TÁC */}
      {isHearting && (
        <div 
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-rose-500 font-black text-[10px] sm:text-xs animate-bounce z-50 bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-700 px-2 py-0.5 rounded-full shadow"
          style={{ transform: `translate(${posX}px, ${posY - 25}px)` }}
        >
          +50 HSK XP
        </div>
      )}

      {/* KHU VỰC BƯỚC ĐI CỦA THÚ CƯNG PIXEL 2D (COMPACT ON MOBILE) */}
      <div 
        className="flex flex-col items-center gap-1 transition-all duration-1000 ease-in-out cursor-pointer"
        style={{ transform: `translate(${posX}px, ${posY}px)` }}
      >
        <div 
          onClick={handlePetClick}
          className={`relative group cursor-pointer transition-transform hover:scale-110 ${direction === 'left' ? '-scale-x-100' : ''}`}
          title="Bấm vào thú cưng Pixel để trò chuyện tiếng Trung!"
        >
          {currentPet === 'cat' && (
            /* CON MÈO 2D PIXEL CHIBI */
            <svg viewBox="0 0 32 32" className="w-10 h-10 sm:w-15 sm:h-15 drop-shadow-md" shapeRendering="crispEdges">
              <path d="M26,18 h2 v-4 h2 v-4 h-2 v4 h-2 z" fill="#f97316" />
              <rect x="10" y="18" width="16" height="9" fill="#fb923c" stroke="#1f2937" strokeWidth="1" />
              <rect x="12" y="20" width="10" height="6" fill="#fff7ed" />
              <rect x="11" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="15" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="19" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="23" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="6" y="4" width="4" height="6" fill="#ea580c" />
              <rect x="7" y="6" width="2" height="3" fill="#fda4af" />
              <rect x="16" y="4" width="4" height="6" fill="#ea580c" />
              <rect x="17" y="6" width="2" height="3" fill="#fda4af" />
              <rect x="5" y="9" width="16" height="11" fill="#fb923c" stroke="#1f2937" strokeWidth="1" />
              <rect x="8" y="13" width="3" height="3" fill="#0f172a" />
              <rect x="9" y="13" width="1" height="1" fill="#ffffff" />
              <rect x="15" y="13" width="3" height="3" fill="#0f172a" />
              <rect x="16" y="13" width="1" height="1" fill="#ffffff" />
              <rect x="6" y="16" width="2" height="1.5" fill="#f472b6" />
              <rect x="18" y="16" width="2" height="1.5" fill="#f472b6" />
              <rect x="12" y="16" width="2" height="1.5" fill="#f43f5e" />
            </svg>
          )}

          {currentPet === 'dog' && (
            /* CHÚ CHÓ SHIBA 2D PIXEL CHIBI */
            <svg viewBox="0 0 32 32" className="w-10 h-10 sm:w-15 sm:h-15 drop-shadow-md" shapeRendering="crispEdges">
              <rect x="25" y="14" width="4" height="4" fill="#d97706" />
              <rect x="10" y="18" width="16" height="9" fill="#f59e0b" stroke="#1f2937" strokeWidth="1" />
              <rect x="12" y="20" width="12" height="6" fill="#ffffff" />
              <rect x="11" y="27" width="3" height="4" fill="#b45309" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="15" y="27" width="3" height="4" fill="#b45309" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="19" y="27" width="3" height="4" fill="#b45309" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="23" y="27" width="3" height="4" fill="#b45309" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="6" y="4" width="4" height="5" fill="#b45309" />
              <rect x="16" y="4" width="4" height="5" fill="#b45309" />
              <rect x="5" y="9" width="16" height="11" fill="#f59e0b" stroke="#1f2937" strokeWidth="1" />
              <rect x="9" y="14" width="8" height="5" fill="#ffffff" />
              <rect x="8" y="12" width="3" height="3" fill="#0f172a" />
              <rect x="9" y="12" width="1" height="1" fill="#ffffff" />
              <rect x="15" y="12" width="3" height="3" fill="#0f172a" />
              <rect x="16" y="12" width="1" height="1" fill="#ffffff" />
              <rect x="12" y="15" width="2" height="2" fill="#0f172a" />
            </svg>
          )}

          {currentPet === 'rabbit' && (
            /* THỎ TRẮNG 2D PIXEL CHIBI */
            <svg viewBox="0 0 32 32" className="w-10 h-10 sm:w-15 sm:h-15 drop-shadow-md" shapeRendering="crispEdges">
              <rect x="25" y="20" width="3" height="3" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
              <rect x="10" y="18" width="16" height="9" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
              <rect x="11" y="27" width="3" height="4" fill="#e2e8f0" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="15" y="27" width="3" height="4" fill="#e2e8f0" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="19" y="27" width="3" height="4" fill="#e2e8f0" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="23" y="27" width="3" height="4" fill="#e2e8f0" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="7" y="2" width="3" height="8" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
              <rect x="8" y="3" width="1" height="6" fill="#fda4af" />
              <rect x="15" y="2" width="3" height="8" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
              <rect x="16" y="3" width="1" height="6" fill="#fda4af" />
              <rect x="5" y="9" width="16" height="11" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
              <rect x="8" y="13" width="3" height="3" fill="#f43f5e" />
              <rect x="9" y="13" width="1" height="1" fill="#ffffff" />
              <rect x="15" y="13" width="3" height="3" fill="#f43f5e" />
              <rect x="16" y="13" width="1" height="1" fill="#ffffff" />
            </svg>
          )}

          {currentPet === 'panda' && (
            /* GẤU TRÚC PANDA 2D PIXEL CHIBI */
            <svg viewBox="0 0 32 32" className="w-10 h-10 sm:w-15 sm:h-15 drop-shadow-md" shapeRendering="crispEdges">
              <rect x="10" y="18" width="16" height="9" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
              <rect x="11" y="27" width="3" height="4" fill="#0f172a" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="15" y="27" width="3" height="4" fill="#0f172a" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="19" y="27" width="3" height="4" fill="#0f172a" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="23" y="27" width="3" height="4" fill="#0f172a" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="5" y="5" width="4" height="4" fill="#0f172a" />
              <rect x="16" y="5" width="4" height="4" fill="#0f172a" />
              <rect x="5" y="8" width="16" height="11" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
              <rect x="7" y="11" width="4" height="4" fill="#0f172a" />
              <rect x="8" y="12" width="1" height="1" fill="#ffffff" />
              <rect x="14" y="11" width="4" height="4" fill="#0f172a" />
              <rect x="15" y="12" width="1" height="1" fill="#ffffff" />
            </svg>
          )}
        </div>

        {/* NÚT MO PHỎNG ĐỔI & MUA ĐỒ KHU VỰC PIXEL PET */}
        <div className="flex gap-1.5 items-center bg-white/95 dark:bg-slate-800/95 border-2 border-[#1f2937] dark:border-slate-600 px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_#1f2937]">
          <button
            onClick={() => setShowShop(true)}
            className="text-[9px] sm:text-[10px] font-black text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            Cửa Hàng Pixel Pet
          </button>
        </div>
      </div>

      {/* MODAL CỬA HÀNG PIXEL PET & VOUCHER HSK (FIXED BACKDROP) */}
      {showShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#fffaf0] dark:bg-slate-900 border-4 border-[#1f2937] dark:border-slate-700 p-4 sm:p-5 rounded-3xl shadow-[6px_6px_0px_#1f2937] max-w-md w-full space-y-3 text-left text-[#1f2937] dark:text-slate-100">
            {/* HEADER MODAL */}
            <div className="flex justify-between items-center border-b-2 border-dashed border-[#1f2937] dark:border-slate-700 pb-2">
              <div>
                <span className="text-sm sm:text-base font-serif font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  Cửa Hàng Pixel Pet & Voucher HSK
                </span>
                <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400">Số Xu hiện tại: <span className="text-amber-600 dark:text-amber-400 font-mono font-black">{coins} Xu</span></p>
              </div>
              <button 
                onClick={() => setShowShop(false)} 
                className="w-7 h-7 bg-white dark:bg-slate-800 border-2 border-[#1f2937] dark:border-slate-600 rounded-full font-black text-xs hover:bg-rose-500 hover:text-white cursor-pointer flex items-center justify-center shrink-0"
              >
                ✕
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="grid grid-cols-3 gap-1 bg-amber-100 dark:bg-slate-800 p-1 rounded-xl border border-[#1f2937] dark:border-slate-700">
              <button
                onClick={() => setShopTab('food')}
                className={`py-1 text-[11px] font-black rounded-lg transition ${
                  shopTab === 'food' ? 'bg-amber-400 text-amber-950 shadow' : 'text-gray-700 dark:text-slate-300'
                }`}
              >
                Thức Ăn HSK
              </button>
              <button
                onClick={() => setShopTab('pet')}
                className={`py-1 text-[11px] font-black rounded-lg transition ${
                  shopTab === 'pet' ? 'bg-rose-500 text-white shadow' : 'text-gray-700 dark:text-slate-300'
                }`}
              >
                Đổi Pet 2D
              </button>
              <button
                onClick={() => setShopTab('voucher')}
                className={`py-1 text-[11px] font-black rounded-lg transition ${
                  shopTab === 'voucher' ? 'bg-indigo-600 text-white shadow' : 'text-gray-700 dark:text-slate-300'
                }`}
              >
                Voucher Vy
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
                      className="w-full p-2.5 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border-2 border-[#1f2937] dark:border-slate-600 rounded-2xl text-left flex justify-between items-center text-xs font-bold shadow-[2px_2px_0px_#1f2937] transition cursor-pointer"
                    >
                      <div>
                        <div className="font-black text-xs sm:text-sm text-gray-800 dark:text-slate-100">{food.name}</div>
                        <div className="text-[10px] text-gray-500 dark:text-slate-400 font-normal">Thưởng thoại tiếng Trung & +50 XP</div>
                      </div>
                      <span className="text-xs bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-mono font-black border border-[#1f2937]">
                        {food.price} Xu
                      </span>
                    </button>
                  ))}
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
                        className="p-2.5 bg-white dark:bg-slate-800 border-2 border-[#1f2937] dark:border-slate-600 rounded-2xl flex justify-between items-center text-xs shadow-[2px_2px_0px_#1f2937]"
                      >
                        <div>
                          <div className="font-black text-xs sm:text-sm text-gray-800 dark:text-slate-100">{pet.name}</div>
                          <div className="text-[10px] text-gray-500 dark:text-slate-400">{pet.desc}</div>
                        </div>
                        {isSelected ? (
                          <span className="text-[10px] bg-emerald-500 text-white font-black px-2.5 py-1 rounded-full border border-emerald-700">
                            Đang Dùng
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => handleUnlockPet(pet)}
                            className="text-[10px] bg-amber-400 text-amber-950 hover:bg-amber-500 font-black px-2.5 py-1 rounded-full border border-[#1f2937] cursor-pointer"
                          >
                            Sử Dụng
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnlockPet(pet)}
                            className="text-[10px] bg-rose-500 text-white hover:bg-rose-600 font-black px-2.5 py-1 rounded-full border border-rose-700 cursor-pointer flex items-center gap-1"
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
                  {VOUCHER_ITEMS.map(v => {
                    const isBought = purchasedVouchers.includes(v.name);

                    return (
                      <div
                        key={v.id}
                        className="p-2.5 bg-white dark:bg-slate-800 border-2 border-[#1f2937] dark:border-slate-600 rounded-2xl flex justify-between items-center text-xs shadow-[2px_2px_0px_#1f2937]"
                      >
                        <div>
                          <div className="font-black text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">{v.name}</div>
                          <div className="text-[10px] text-gray-500 dark:text-slate-400">{v.desc}</div>
                        </div>
                        {isBought ? (
                          <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black px-2.5 py-1 rounded-full border border-indigo-300">
                            Đã Sở Hữu
                          </span>
                        ) : (
                          <button
                            onClick={() => handleBuyVoucher(v)}
                            className="text-[10px] bg-indigo-600 text-white hover:bg-indigo-700 font-black px-2.5 py-1 rounded-full border border-indigo-900 cursor-pointer"
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
