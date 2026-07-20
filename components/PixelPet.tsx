import React, { useState, useEffect } from 'react';

interface PixelPetProps {
  coins?: number;
  setCoins?: (c: number) => void;
  onPlayTTS?: (text: string) => void;
  playSfx?: (type: any) => void;
  isDarkMode?: boolean;
}

const PET_PHRASES = {
  cat: [
    { text: '喵！主人今天真棒！', pinyin: 'Miāo! Zhǔrén jīntiān zhēn bàng!', translation: 'Meow! Chủ nhân hôm nay thật tuyệt vời!' },
    { text: '我想吃鱼肉。', pinyin: 'Wǒ xiǎng chī yúròu.', translation: 'Tớ muốn ăn cá ngừ tươi ngon!' },
    { text: '你做得非常好！加油！', pinyin: 'Nǐ zuò de fēicháng hǎo! Jiāyóu!', translation: 'Bạn làm rất tốt! Cố lên nhé!' },
    { text: '好舒服啊，多陪陪我吧。', pinyin: 'Hǎo shūfu a, duō péipei wǒ ba.', translation: 'Thích quá đi, ở bên tớ nhiều hơn nhé.' }
  ],
  dog: [
    { text: '汪汪！欢迎回家！', pinyin: 'Wāngwāng! Huānyíng huíjiā!', translation: 'Gâu gâu! Mừng bạn đã về nhà!' },
    { text: '今天天气真好！', pinyin: 'Jīntiān tiānqì zhēn hǎo!', translation: 'Thời tiết hôm nay thật đẹp!' },
    { text: '我们一起玩吧！', pinyin: 'Wǒmen yìqǐ wán ba!', translation: 'Chúng ta cùng chơi nhé!' }
  ]
};

const PET_FOODS = [
  { id: 'fish', name: 'Cá Tươi (鲜鱼)', price: 15, phrase: { text: '谢谢主人的大鲜鱼！真好吃！', pinyin: 'Xièxie zhǔrén de dà xiānyú! Zhēn hǎochī!', translation: 'Cảm ơn món cá tươi của chủ nhân! Món ăn ngon tuyệt!' } },
  { id: 'can', name: 'Pate Đóng Hộp (罐头)', price: 30, phrase: { text: '肉罐头太香了！爱死你了！', pinyin: 'Ròuguàntou tài xiāng le! Ài sǐ nǐ le!', translation: 'Pate thịt thơm phức luôn! Yêu chủ nhân nhất đời!' } },
  { id: 'bone', name: 'Xương Bò Thơm (牛骨)', price: 20, phrase: { text: '好香的牛骨头！太满足了！', pinyin: 'Hǎo xiāng de niúgǔtou! Tài mǎnzú le!', translation: 'Cục xương bò thơm phức! Thật thỏa mãn quá!' } }
];

export const PixelPet: React.FC<PixelPetProps> = ({
  coins = 100,
  setCoins,
  onPlayTTS,
  playSfx,
  isDarkMode = false
}) => {
  const [currentPet, setCurrentPet] = useState<'cat' | 'dog'>('cat');
  const [activeSpeech, setActiveSpeech] = useState<{ text: string; pinyin: string; translation: string } | null>(null);
  const [isHearting, setIsHearting] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [posX, setPosX] = useState(40); // Offset in pixels across floor
  const [posY, setPosY] = useState(20);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);

  // Tự động cho thú cưng đi dạo vòng vòng ngẫu nhiên dưới sàn phòng
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showShop) {
        setIsWalking(true);
        const randomX = Math.floor(Math.random() * 220) - 110; // -110px to +110px
        const randomY = Math.floor(Math.random() * 50) - 25; // -25px to +25px
        setDirection(randomX > posX ? 'right' : 'left');
        setPosX(randomX);
        setPosY(randomY);

        setTimeout(() => setIsWalking(false), 2000);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [showShop, posX]);

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

  return (
    <div className="relative inline-block select-none pointer-events-auto z-30">
      {/* SPEECH BUBBLE HỦY DIỆT MÈO/CHÓ NÓI TIẾNG TRUNG */}
      {activeSpeech && (
        <div 
          className="absolute -top-28 left-1/2 -translate-x-1/2 z-50 w-52 bg-white dark:bg-slate-800 border-2 border-[#1f2937] dark:border-slate-600 p-2.5 rounded-2xl shadow-[3px_3px_0px_#1f2937] text-center space-y-1 animate-in fade-in zoom-in-95 duration-200"
          style={{ transform: `translate(${posX}px, ${posY - 60}px)` }}
        >
          <p className="text-xs font-serif font-black text-rose-600 dark:text-rose-400">{activeSpeech.text}</p>
          <p className="text-[10px] font-mono text-gray-500 dark:text-slate-400">{activeSpeech.pinyin}</p>
          <p className="text-[10px] font-bold text-gray-800 dark:text-slate-200">&gt; {activeSpeech.translation}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-b-2 border-r-2 border-[#1f2937] dark:border-slate-600 rotate-45" />
        </div>
      )}

      {/* HIỆU ỨNG THẢ TIM KHI ĂN / BẤM VÀO */}
      {isHearting && (
        <div 
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-rose-500 font-black text-xs animate-bounce z-50 bg-rose-100 dark:bg-rose-900 border border-rose-300 dark:border-rose-700 px-2 py-0.5 rounded-full shadow"
          style={{ transform: `translate(${posX}px, ${posY - 30}px)` }}
        >
          +50 HSK XP
        </div>
      )}

      {/* THÚ CƯNG FULL BODY CÓ THÂN & 4 CHÂN ĐI DẠO DƯỚI SÀN PHÒNG */}
      <div 
        className="flex flex-col items-center gap-1 transition-all duration-1000 ease-in-out cursor-pointer"
        style={{ transform: `translate(${posX}px, ${posY}px)` }}
      >
        {/* NHÂN VẬT THÚ CƯNG TOÀN THÂN (FULL BODY PET) */}
        <div 
          onClick={handlePetClick}
          className={`relative group cursor-pointer transition-transform ${direction === 'left' ? '-scale-x-100' : ''}`}
          title="Bấm vào thú cưng để trò chuyện tiếng Trung!"
        >
          {currentPet === 'cat' ? (
            /* CON MÈO CAM PIXEL TOÀN THÂN CÓ 4 CHÂN & ĐUÔI VẪY */
            <svg viewBox="0 0 48 48" className="w-14 h-14 drop-shadow-md">
              {/* Đuôi mèo (Tail) */}
              <path d="M 36 28 Q 44 20 42 12 Q 38 12 36 22" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" className="animate-pulse" />
              
              {/* Thân mèo (Body) */}
              <ellipse cx="26" cy="30" rx="12" ry="8" fill="#fb923c" stroke="#1f2937" strokeWidth="2" />
              
              {/* 4 Chân mèo (4 Paws/Legs) */}
              <rect x="16" y="36" width="4" height="7" rx="2" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="22" y="36" width="4" height="7" rx="2" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce delay-100' : ''} />
              <rect x="28" y="36" width="4" height="7" rx="2" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="34" y="36" width="4" height="7" rx="2" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce delay-100' : ''} />

              {/* Tai mèo (Ears) */}
              <polygon points="8,16 12,8 16,16" fill="#ea580c" stroke="#1f2937" strokeWidth="1.5" />
              <polygon points="18,16 22,8 26,16" fill="#ea580c" stroke="#1f2937" strokeWidth="1.5" />

              {/* Đầu mèo (Head) */}
              <circle cx="17" cy="22" r="10" fill="#fb923c" stroke="#1f2937" strokeWidth="2" />

              {/* Mắt & Mũi & Râu (Face) */}
              <ellipse cx="13" cy="20" rx="1.5" ry="2" fill="#1f2937" />
              <ellipse cx="21" cy="20" rx="1.5" ry="2" fill="#1f2937" />
              <circle cx="13.5" cy="19.5" r="0.5" fill="#ffffff" />
              <circle cx="21.5" cy="19.5" r="0.5" fill="#ffffff" />
              <polygon points="16,24 18,24 17,25" fill="#f43f5e" />
              <line x1="7" y1="22" x2="11" y2="23" stroke="#1f2937" strokeWidth="1.5" />
              <line x1="7" y1="25" x2="11" y2="25" stroke="#1f2937" strokeWidth="1.5" />
              <line x1="27" y1="22" x2="23" y2="23" stroke="#1f2937" strokeWidth="1.5" />
              <line x1="27" y1="25" x2="23" y2="25" stroke="#1f2937" strokeWidth="1.5" />
            </svg>
          ) : (
            /* CHÚ CHÓ SHIBA PIXEL TOÀN THÂN CÓ 4 CHÂN & ĐUÔI CONG */
            <svg viewBox="0 0 48 48" className="w-14 h-14 drop-shadow-md">
              {/* Đuôi cong Shiba (Curled Tail) */}
              <circle cx="38" cy="22" r="4" fill="#d97706" stroke="#1f2937" strokeWidth="1.5" />

              {/* Thân chó (Body) */}
              <ellipse cx="26" cy="30" rx="12" ry="8" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
              <ellipse cx="24" cy="31" rx="8" ry="5" fill="#ffffff" />

              {/* 4 Chân chó (4 Legs) */}
              <rect x="16" y="36" width="4" height="7" rx="2" fill="#d97706" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="22" y="36" width="4" height="7" rx="2" fill="#d97706" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce delay-100' : ''} />
              <rect x="28" y="36" width="4" height="7" rx="2" fill="#d97706" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="34" y="36" width="4" height="7" rx="2" fill="#d97706" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce delay-100' : ''} />

              {/* Tai vểnh Shiba (Ears) */}
              <polygon points="9,14 13,6 16,14" fill="#b45309" stroke="#1f2937" strokeWidth="1.5" />
              <polygon points="18,14 22,6 25,14" fill="#b45309" stroke="#1f2937" strokeWidth="1.5" />

              {/* Đầu chó (Head) */}
              <circle cx="17" cy="22" r="10" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
              <ellipse cx="17" cy="25" rx="5" ry="4" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />

              {/* Mắt & Mũi (Eyes & Nose) */}
              <circle cx="13" cy="20" r="1.5" fill="#1f2937" />
              <circle cx="21" cy="20" r="1.5" fill="#1f2937" />
              <ellipse cx="17" cy="24" rx="1.5" ry="1" fill="#1f2937" />
            </svg>
          )}
        </div>

        {/* CỤM NÚT ĐỔI THÚ CƯNG & MUA ĐỒ ĂN */}
        <div className="flex gap-1 items-center bg-white/90 dark:bg-slate-800/90 border border-[#1f2937] dark:border-slate-600 px-1.5 py-0.5 rounded-full shadow">
          <button
            onClick={() => setCurrentPet(prev => prev === 'cat' ? 'dog' : 'cat')}
            className="text-[9px] font-black text-gray-700 dark:text-slate-200 hover:text-rose-500 cursor-pointer"
          >
            {currentPet === 'cat' ? 'Đổi Chó' : 'Đổi Mèo'}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setShowShop(!showShop)}
            className="text-[9px] font-black text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            Mua Đồ Ăn
          </button>
        </div>

        {/* MODAL CỬA HÀNG THỨC ĂN THÚ CƯNG */}
        {showShop && (
          <div className="absolute top-16 right-0 z-50 w-56 bg-[#fffaf0] dark:bg-slate-800 border-2 border-[#1f2937] dark:border-slate-600 p-3 rounded-2xl shadow-[4px_4px_0px_#1f2937] space-y-2 text-left">
            <div className="flex justify-between items-center border-b border-gray-300 dark:border-slate-700 pb-1">
              <span className="text-xs font-serif font-black text-rose-600 dark:text-rose-400">Tiệm Thức Ăn HSK</span>
              <button onClick={() => setShowShop(false)} className="text-xs font-black px-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-1.5">
              {PET_FOODS.map(food => (
                <button
                  key={food.id}
                  onClick={() => handleFeedPet(food)}
                  className="w-full p-1.5 bg-white dark:bg-slate-700 hover:bg-amber-50 dark:hover:bg-slate-600 border border-[#1f2937] dark:border-slate-500 rounded-xl text-left flex justify-between items-center text-[11px] font-bold shadow-[1px_1px_0px_#1f2937] cursor-pointer text-gray-800 dark:text-slate-100"
                >
                  <span>{food.name}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono font-black">{food.price} Xu</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
