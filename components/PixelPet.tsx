import React, { useState, useEffect } from 'react';

interface PixelPetProps {
  petType?: 'cat' | 'dog';
  coins?: number;
  setCoins?: (c: number) => void;
  onPlayTTS?: (text: string) => void;
  playSfx?: (type: any) => void;
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
  playSfx
}) => {
  const [currentPet, setCurrentPet] = useState<'cat' | 'dog'>('cat');
  const [activeSpeech, setActiveSpeech] = useState<{ text: string; pinyin: string; translation: string } | null>(null);
  const [isHearting, setIsHearting] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [posX, setPosX] = useState(0); // Roaming offset X in pixels
  const [isWalking, setIsWalking] = useState(true);

  // Tự động cho thú cưng đi dạo vòng vòng ngẫu nhiên
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showShop) {
        const nextX = Math.floor(Math.random() * 80) - 40; // Roam -40px to +40px
        setPosX(nextX);
      }
    }, 3500);
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

    setTimeout(() => setIsHearting(false), 1200);
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

    setTimeout(() => setIsHearting(false), 1500);
    setTimeout(() => setActiveSpeech(null), 4500);
    setShowShop(false);
  };

  return (
    <div className="relative inline-block select-none">
      {/* SPEECH BUBBLE */}
      {activeSpeech && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-40 w-52 bg-white border-2 border-[#1f2937] p-2.5 rounded-2xl shadow-[3px_3px_0px_#1f2937] text-center space-y-1 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-xs font-serif font-black text-rose-600">{activeSpeech.text}</p>
          <p className="text-[10px] font-mono text-gray-500">{activeSpeech.pinyin}</p>
          <p className="text-[10px] font-bold text-gray-800">&gt; {activeSpeech.translation}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-[#1f2937] rotate-45" />
        </div>
      )}

      {/* HIỆU ỨNG THẢ TIM KHI ĂN / BẤM VÀO */}
      {isHearting && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-rose-500 font-black text-xs animate-bounce z-50 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full shadow">
          +50 HSK XP
        </div>
      )}

      {/* RENDER PET ĐI DẠO VÒNG VÒNG & BẢNG THAO TÁC */}
      <div 
        className="flex flex-col items-center gap-1 transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(${posX}px)` }}
      >
        <button
          onClick={handlePetClick}
          className="relative w-14 h-14 bg-amber-100 hover:bg-amber-200 border-2 border-[#1f2937] rounded-2xl shadow-[2px_2px_0px_#1f2937] flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 animate-pulse"
          title="Bấm vào thú cưng để trò chuyện tiếng Trung!"
        >
          {currentPet === 'cat' ? (
            <svg viewBox="0 0 32 32" className="w-10 h-10 drop-shadow">
              <polygon points="6,10 10,4 13,10" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" />
              <polygon points="19,10 22,4 26,10" fill="#f97316" stroke="#1f2937" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="9" fill="#fb923c" stroke="#1f2937" strokeWidth="2" />
              <ellipse cx="12" cy="15" rx="1.5" ry="2" fill="#1f2937" />
              <ellipse cx="20" cy="15" rx="1.5" ry="2" fill="#1f2937" />
              <circle cx="12.5" cy="14.5" r="0.5" fill="#ffffff" />
              <circle cx="20.5" cy="14.5" r="0.5" fill="#ffffff" />
              <polygon points="15,18 17,18 16,19" fill="#f43f5e" />
              <line x1="7" y1="16" x2="11" y2="17" stroke="#1f2937" strokeWidth="1.5" />
              <line x1="7" y1="19" x2="11" y2="19" stroke="#1f2937" strokeWidth="1.5" />
              <line x1="25" y1="16" x2="21" y2="17" stroke="#1f2937" strokeWidth="1.5" />
              <line x1="25" y1="19" x2="21" y2="19" stroke="#1f2937" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 32 32" className="w-10 h-10 drop-shadow">
              <path d="M 5 12 Q 3 19 8 18" fill="#d97706" stroke="#1f2937" strokeWidth="2" />
              <path d="M 27 12 Q 29 19 24 18" fill="#d97706" stroke="#1f2937" strokeWidth="2" />
              <circle cx="16" cy="16" r="9" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
              <ellipse cx="16" cy="18" rx="4" ry="3" fill="#fff" stroke="#1f2937" strokeWidth="1.5" />
              <circle cx="12" cy="14" r="1.5" fill="#1f2937" />
              <circle cx="20" cy="14" r="1.5" fill="#1f2937" />
              <ellipse cx="16" cy="17" rx="1.5" ry="1" fill="#1f2937" />
            </svg>
          )}

          <span className="absolute -bottom-1 -right-1 text-[9px] bg-rose-500 text-white font-black px-1 rounded border border-[#1f2937]">
            {currentPet === 'cat' ? 'Mèo' : 'Chó'}
          </span>
        </button>

        {/* NÚT THAO TÁC: ĐỔI PET & MUA THỨC ĂN */}
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setCurrentPet(prev => prev === 'cat' ? 'dog' : 'cat')}
            className="text-[9px] font-black bg-white hover:bg-gray-100 border border-[#1f2937] px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#1f2937] cursor-pointer"
          >
            {currentPet === 'cat' ? 'Đổi sang Chó' : 'Đổi sang Mèo'}
          </button>
          <button
            onClick={() => setShowShop(!showShop)}
            className="text-[9px] font-black bg-amber-400 hover:bg-amber-500 text-[#1f2937] border border-[#1f2937] px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#1f2937] cursor-pointer"
          >
            Mua Đồ Ăn
          </button>
        </div>

        {/* MODAL CỬA HÀNG THỨC ĂN THÚ CƯNG */}
        {showShop && (
          <div className="absolute top-16 right-0 z-50 w-56 bg-[#fffaf0] border-2 border-[#1f2937] p-3 rounded-2xl shadow-[4px_4px_0px_#1f2937] space-y-2">
            <div className="flex justify-between items-center border-b border-gray-300 pb-1">
              <span className="text-xs font-serif font-black text-rose-600">Tiệm Thức Ăn HSK</span>
              <button onClick={() => setShowShop(false)} className="text-xs font-black px-1 text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <div className="space-y-1.5">
              {PET_FOODS.map(food => (
                <button
                  key={food.id}
                  onClick={() => handleFeedPet(food)}
                  className="w-full p-1.5 bg-white hover:bg-amber-50 border border-[#1f2937] rounded-xl text-left flex justify-between items-center text-[11px] font-bold shadow-[1px_1px_0px_#1f2937] cursor-pointer"
                >
                  <span>{food.name}</span>
                  <span className="text-amber-600 font-mono font-black">{food.price} Xu</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
