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
  const [posX, setPosX] = useState(0); // Clamped within [-80px, +80px]
  const [posY, setPosY] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);

  // Tự động cho thú cưng đi dạo trong khoảng an toàn dưới sàn phòng (Không ra ngoài)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showShop) {
        setIsWalking(true);
        const randomX = Math.floor(Math.random() * 160) - 80; // Giới hạn [-80px, +80px]
        const randomY = Math.floor(Math.random() * 24) - 12; // Giới hạn [-12px, +12px]
        setDirection(randomX >= posX ? 'right' : 'left');
        setPosX(randomX);
        setPosY(randomY);

        setTimeout(() => setIsWalking(false), 2000);
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
    <div className="relative inline-block select-none pointer-events-auto z-40">
      {/* SPEECH BUBBLE TRÒ CHUYỆN TIẾNG TRUNG */}
      {activeSpeech && (
        <div 
          className="absolute -top-28 left-1/2 -translate-x-1/2 z-50 w-52 bg-white dark:bg-slate-800 border-2 border-[#1f2937] dark:border-slate-600 p-2.5 rounded-2xl shadow-[4px_4px_0px_#1f2937] text-center space-y-1 animate-in fade-in zoom-in-95 duration-200"
          style={{ transform: `translate(${posX}px, ${posY - 50}px)` }}
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
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-rose-500 font-black text-xs animate-bounce z-50 bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-700 px-2.5 py-0.5 rounded-full shadow"
          style={{ transform: `translate(${posX}px, ${posY - 25}px)` }}
        >
          +50 HSK XP
        </div>
      )}

      {/* THÚ CƯNG TOÀN THÂN CUTE CÓ 4 CHÂN ĐI DẠO TRONG PHÒNG */}
      <div 
        className="flex flex-col items-center gap-1 transition-all duration-1000 ease-in-out cursor-pointer"
        style={{ transform: `translate(${posX}px, ${posY}px)` }}
      >
        <div 
          onClick={handlePetClick}
          className={`relative group cursor-pointer transition-transform hover:scale-105 ${direction === 'left' ? '-scale-x-100' : ''}`}
          title="Bấm vào thú cưng để trò chuyện tiếng Trung!"
        >
          {currentPet === 'cat' ? (
            /* BẢN VẼ MÈO CAM ANIME CUTE 4 CHÂN & ĐUÔI VẪY */
            <svg viewBox="0 0 52 52" className="w-16 h-16 drop-shadow-md">
              {/* Đuôi cong cuộn vẫy */}
              <path d="M 38 28 C 48 20, 44 8, 38 12 C 34 16, 40 22, 34 26" fill="#f97316" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
              
              {/* Thân tròn múp mạp */}
              <ellipse cx="26" cy="32" rx="13" ry="9" fill="#fb923c" stroke="#1f2937" strokeWidth="2" />
              <ellipse cx="24" cy="33" rx="8" ry="5" fill="#fff7ed" />
              
              {/* 4 Chân xinh bước đi */}
              <rect x="15" y="38" width="4.5" height="8" rx="2" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="21" y="38" width="4.5" height="8" rx="2" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce delay-100' : ''} />
              <rect x="27" y="38" width="4.5" height="8" rx="2" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="33" y="38" width="4.5" height="8" rx="2" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce delay-100' : ''} />

              {/* Tai vểnh với lòng tai hồng */}
              <polygon points="7,16 12,6 17,16" fill="#ea580c" stroke="#1f2937" strokeWidth="2" />
              <polygon points="9,15 12,8 15,15" fill="#fca5a5" />
              <polygon points="17,16 22,6 27,16" fill="#ea580c" stroke="#1f2937" strokeWidth="2" />
              <polygon points="19,15 22,8 25,15" fill="#fca5a5" />

              {/* Đầu tròn cute */}
              <circle cx="17" cy="22" r="11" fill="#fb923c" stroke="#1f2937" strokeWidth="2" />

              {/* Mắt to tròn lấp lánh (Sparkling Anime Eyes) */}
              <circle cx="12" cy="21" r="3" fill="#0f172a" />
              <circle cx="22" cy="21" r="3" fill="#0f172a" />
              <circle cx="13" cy="20" r="1" fill="#ffffff" />
              <circle cx="23" cy="20" r="1" fill="#ffffff" />

              {/* Má hồng chúm chím (Rosy Cheeks) */}
              <ellipse cx="9" cy="24" rx="2" ry="1.2" fill="#fda4af" />
              <ellipse cx="25" cy="24" rx="2" ry="1.2" fill="#fda4af" />

              {/* Mũi & Miệng cười xù */}
              <polygon points="16,24 18,24 17,25.5" fill="#f43f5e" />
              <path d="M 14 26 Q 17 28 20 26" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            /* BẢN VẼ CHÓ SHIBA ANIME CUTE 4 CHÂN & ĐUÔI CONG */
            <svg viewBox="0 0 52 52" className="w-16 h-16 drop-shadow-md">
              {/* Đuôi cong tít Shiba */}
              <circle cx="39" cy="22" r="4.5" fill="#d97706" stroke="#1f2937" strokeWidth="2" />

              {/* Thân tròn múp mạp */}
              <ellipse cx="26" cy="32" rx="13" ry="9" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
              <ellipse cx="24" cy="33" rx="8" ry="5" fill="#ffffff" />

              {/* 4 Chân Shiba bước đi */}
              <rect x="15" y="38" width="4.5" height="8" rx="2" fill="#d97706" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="21" y="38" width="4.5" height="8" rx="2" fill="#d97706" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce delay-100' : ''} />
              <rect x="27" y="38" width="4.5" height="8" rx="2" fill="#d97706" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce' : ''} />
              <rect x="33" y="38" width="4.5" height="8" rx="2" fill="#d97706" stroke="#1f2937" strokeWidth="1.5" className={isWalking ? 'animate-bounce delay-100' : ''} />

              {/* Tai vểnh Shiba */}
              <polygon points="8,15 13,5 17,15" fill="#b45309" stroke="#1f2937" strokeWidth="2" />
              <polygon points="17,15 21,5 25,15" fill="#b45309" stroke="#1f2937" strokeWidth="2" />

              {/* Đầu & Mõm trắng */}
              <circle cx="17" cy="22" r="11" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
              <ellipse cx="17" cy="25" rx="5.5" ry="4" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />

              {/* Mắt to lấp lánh & Mũi đen */}
              <circle cx="12" cy="20" r="2.5" fill="#0f172a" />
              <circle cx="22" cy="20" r="2.5" fill="#0f172a" />
              <circle cx="13" cy="19" r="0.8" fill="#ffffff" />
              <circle cx="23" cy="19" r="0.8" fill="#ffffff" />
              <ellipse cx="17" cy="24" rx="1.8" ry="1.2" fill="#0f172a" />
            </svg>
          )}
        </div>

        {/* NÚT THAO TÁC ĐỔI THÚ CƯNG & SHOP */}
        <div className="flex gap-1.5 items-center bg-white/95 dark:bg-slate-800/95 border-2 border-[#1f2937] dark:border-slate-600 px-2 py-0.5 rounded-full shadow-[2px_2px_0px_#1f2937]">
          <button
            onClick={() => setCurrentPet(prev => prev === 'cat' ? 'dog' : 'cat')}
            className="text-[10px] font-black text-gray-800 dark:text-slate-200 hover:text-rose-500 cursor-pointer"
          >
            {currentPet === 'cat' ? 'Đổi Chó' : 'Đổi Mèo'}
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

      {/* POPUP SHOP THỨC ĂN KHÔNG BAO GIỜ BỊ CHE (FIXED BACKDROP MODAL) */}
      {showShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
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
