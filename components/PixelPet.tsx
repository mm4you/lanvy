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
  const [posX, setPosX] = useState(0); // Offset across bottom viewport [-220px to +40px]
  const [posY, setPosY] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [isWalking, setIsWalking] = useState(false);

  // Tự động cho thú cưng đi dạo vòng quanh MÀN HÌNH BÊN NGOÀI (Outside Room)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showShop) {
        setIsWalking(true);
        const randomX = Math.floor(Math.random() * 260) - 200; // Walk across bottom screen [-200px, 60px]
        const randomY = Math.floor(Math.random() * 16) - 8;
        setDirection(randomX >= posX ? 'right' : 'left');
        setPosX(randomX);
        setPosY(randomY);

        setTimeout(() => setIsWalking(false), 2200);
      }
    }, 4500);
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
    <div className="fixed bottom-4 right-6 z-40 select-none pointer-events-auto">
      {/* POPUP TRÒ CHUYỆN PIXEL 2D SẮC NÉT (SPEECH BUBBLE) */}
      {activeSpeech && (
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 z-50 w-56 bg-white dark:bg-slate-800 border-3 border-[#1f2937] dark:border-slate-600 p-3 rounded-2xl shadow-[4px_4px_0px_#1f2937] text-center space-y-1 animate-in fade-in zoom-in-95 duration-200"
          style={{ transform: `translate(${posX}px, ${posY - 60}px)` }}
        >
          <p className="text-xs font-serif font-black text-rose-600 dark:text-rose-400">{activeSpeech.text}</p>
          <p className="text-[10px] font-mono text-gray-500 dark:text-slate-400">{activeSpeech.pinyin}</p>
          <p className="text-[10px] font-bold text-gray-800 dark:text-slate-200">&gt; {activeSpeech.translation}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white dark:bg-slate-800 border-b-3 border-r-3 border-[#1f2937] dark:border-slate-600 rotate-45" />
        </div>
      )}

      {/* HIỆU ỨNG THẢ TIM XP KHI TƯƠNG TÁC */}
      {isHearting && (
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 text-rose-500 font-black text-xs animate-bounce z-50 bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-700 px-2.5 py-0.5 rounded-full shadow"
          style={{ transform: `translate(${posX}px, ${posY - 30}px)` }}
        >
          +50 HSK XP
        </div>
      )}

      {/* KHU VỰC BƯỚC ĐI CỦA THÚ CƯNG PIXEL 2D */}
      <div 
        className="flex flex-col items-center gap-1 transition-all duration-1000 ease-in-out cursor-pointer"
        style={{ transform: `translate(${posX}px, ${posY}px)` }}
      >
        <div 
          onClick={handlePetClick}
          className={`relative group cursor-pointer transition-transform hover:scale-110 ${direction === 'left' ? '-scale-x-100' : ''}`}
          title="Bấm vào thú cưng Pixel để trò chuyện tiếng Trung!"
        >
          {currentPet === 'cat' ? (
            /* CON MÈO 2D PIXEL CHIBI (RETRO PIXEL ART CAT) */
            <svg viewBox="0 0 32 32" className="w-16 h-16 drop-shadow-lg" shapeRendering="crispEdges">
              {/* Tail Pixel */}
              <path d="M26,18 h2 v-4 h2 v-4 h-2 v4 h-2 z" fill="#f97316" />
              
              {/* Body Pixel */}
              <rect x="10" y="18" width="16" height="9" fill="#fb923c" stroke="#1f2937" strokeWidth="1" />
              <rect x="12" y="20" width="10" height="6" fill="#fff7ed" />
              
              {/* 4 Paws Pixel */}
              <rect x="11" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="15" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="19" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="23" y="27" width="3" height="4" fill="#ea580c" className={isWalking ? 'animate-bounce delay-75' : ''} />

              {/* Ears Pixel */}
              <rect x="6" y="4" width="4" height="6" fill="#ea580c" />
              <rect x="7" y="6" width="2" height="3" fill="#fda4af" />
              <rect x="16" y="4" width="4" height="6" fill="#ea580c" />
              <rect x="17" y="6" width="2" height="3" fill="#fda4af" />

              {/* Head Pixel */}
              <rect x="5" y="9" width="16" height="11" fill="#fb923c" stroke="#1f2937" strokeWidth="1" />

              {/* Eyes Specular Pixel */}
              <rect x="8" y="13" width="3" height="3" fill="#0f172a" />
              <rect x="9" y="13" width="1" height="1" fill="#ffffff" />
              <rect x="15" y="13" width="3" height="3" fill="#0f172a" />
              <rect x="16" y="13" width="1" height="1" fill="#ffffff" />

              {/* Blush & Nose Pixel */}
              <rect x="6" y="16" width="2" height="1.5" fill="#f472b6" />
              <rect x="18" y="16" width="2" height="1.5" fill="#f472b6" />
              <rect x="12" y="16" width="2" height="1.5" fill="#f43f5e" />
            </svg>
          ) : (
            /* CHÚ CHÓ SHIBA 2D PIXEL CHIBI (RETRO PIXEL ART SHIBA) */
            <svg viewBox="0 0 32 32" className="w-16 h-16 drop-shadow-lg" shapeRendering="crispEdges">
              {/* Curled Tail Pixel */}
              <rect x="25" y="14" width="4" height="4" fill="#d97706" />

              {/* Body Pixel */}
              <rect x="10" y="18" width="16" height="9" fill="#f59e0b" stroke="#1f2937" strokeWidth="1" />
              <rect x="12" y="20" width="12" height="6" fill="#ffffff" />

              {/* 4 Paws Pixel */}
              <rect x="11" y="27" width="3" height="4" fill="#b45309" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="15" y="27" width="3" height="4" fill="#b45309" className={isWalking ? 'animate-bounce delay-75' : ''} />
              <rect x="19" y="27" width="3" height="4" fill="#b45309" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="23" y="27" width="3" height="4" fill="#b45309" className={isWalking ? 'animate-bounce delay-75' : ''} />

              {/* Ears Pixel */}
              <rect x="6" y="4" width="4" height="5" fill="#b45309" />
              <rect x="16" y="4" width="4" height="5" fill="#b45309" />

              {/* Head & Snout Pixel */}
              <rect x="5" y="9" width="16" height="11" fill="#f59e0b" stroke="#1f2937" strokeWidth="1" />
              <rect x="9" y="14" width="8" height="5" fill="#ffffff" />

              {/* Eyes & Nose Pixel */}
              <rect x="8" y="12" width="3" height="3" fill="#0f172a" />
              <rect x="9" y="12" width="1" height="1" fill="#ffffff" />
              <rect x="15" y="12" width="3" height="3" fill="#0f172a" />
              <rect x="16" y="12" width="1" height="1" fill="#ffffff" />
              <rect x="12" y="15" width="2" height="2" fill="#0f172a" />
            </svg>
          )}
        </div>

        {/* NÚT THAO TÁC ĐỔI THÚ CƯNG & SHOP */}
        <div className="flex gap-1.5 items-center bg-white/95 dark:bg-slate-800/95 border-2 border-[#1f2937] dark:border-slate-600 px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_#1f2937]">
          <button
            onClick={() => setCurrentPet(prev => prev === 'cat' ? 'dog' : 'cat')}
            className="text-[10px] font-black text-gray-800 dark:text-slate-200 hover:text-rose-500 cursor-pointer"
          >
            {currentPet === 'cat' ? 'Đổi Chó 🐶' : 'Đổi Mèo 🐱'}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setShowShop(true)}
            className="text-[10px] font-black text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            Mua Đồ Ăn
          </button>
        </div>
      </div>

      {/* FIX DỨT ĐIỂM POPUP CHE: MODAL CỬA HÀNG FIXED OVERLAY TRÊN MÀN HÌNH */}
      {showShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#fffaf0] dark:bg-slate-800 border-4 border-[#1f2937] dark:border-slate-600 p-5 rounded-3xl shadow-[6px_6px_0px_#1f2937] max-w-sm w-full space-y-4 text-left">
            <div className="flex justify-between items-center border-b-2 border-dashed border-[#1f2937] dark:border-slate-700 pb-2">
              <span className="text-base font-serif font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                Tiệm Thức Ăn HSK Cho Vy
              </span>
              <button 
                onClick={() => setShowShop(false)} 
                className="w-7 h-7 bg-white dark:bg-slate-700 border-2 border-[#1f2937] dark:border-slate-600 rounded-full font-black text-xs hover:bg-rose-500 hover:text-white cursor-pointer flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {PET_FOODS.map(food => (
                <button
                  key={food.id}
                  onClick={() => handleFeedPet(food)}
                  className="w-full p-3 bg-white dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-slate-600 border-2 border-[#1f2937] dark:border-slate-500 rounded-2xl text-left flex justify-between items-center text-xs font-bold shadow-[2px_2px_0px_#1f2937] transition cursor-pointer text-gray-800 dark:text-slate-100"
                >
                  <div>
                    <div className="font-black text-sm">{food.name}</div>
                    <div className="text-[10px] opacity-70 font-normal">Thưởng tiếng Trung & +50 XP</div>
                  </div>
                  <span className="text-xs bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full font-mono font-black border border-[#1f2937]">
                    {food.price} Xu
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
