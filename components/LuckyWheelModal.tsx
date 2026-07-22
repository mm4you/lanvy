'use client';

import React, { useState } from 'react';

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  playSfx: (type: any) => void;
  isDarkMode?: boolean;
}

const SLICES = [
  { id: 'coins_100', text: '+100 Xu', color: '#f59e0b', type: 'coins', amount: 100 },
  { id: 'powerup_5050', text: 'Thẻ 50:50', color: '#ec4899', type: 'powerup', name: '50:50' },
  { id: 'coins_30', text: '+30 Xu', color: '#3b82f6', type: 'coins', amount: 30 },
  { id: 'blueprint_rare', text: 'Mảnh Hiếm', color: '#8b5cf6', type: 'blueprint', name: 'Mảnh Bản Vẽ Hiếm' },
  { id: 'coins_150', text: '+150 Xu', color: '#10b981', type: 'coins', amount: 150 },
  { id: 'voucher_secret', text: 'Voucher Q.Tặng', color: '#ef4444', type: 'voucher', name: 'Voucher Quà Tặng' },
];

function renderTargetIcon(className = 'w-5 h-5 text-amber-500') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function renderCoinIcon(className = 'w-4 h-4 text-amber-500') {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v2.07c-1.42.19-2.5 1.14-2.5 2.43 0 1.5 1.42 2.14 2.5 2.5 1.42.47 2 1 2 1.75 0 .88-.8 1.45-2 1.45-1.12 0-1.85-.45-2.2-1.15l-1.4.6c.55 1.25 1.7 2.05 3.1 2.25V17h1.5v-2.05c1.45-.2 2.5-1.2 2.5-2.55 0-1.7-1.4-2.35-2.5-2.7-1.4-.45-2-.95-2-1.7 0-.75.75-1.35 1.8-1.35 1 0 1.6.4 1.95 1l1.35-.65C14.5 5.95 13.5 5.2 12.5 5V4z"/>
    </svg>
  );
}

function renderGiftIcon(className = 'w-5 h-5 text-amber-500') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm8 2v11a1 1 0 01-1 1H5a1 1 0 01-1-1V10h16z" />
    </svg>
  );
}

export default function LuckyWheelModal({
  isOpen,
  onClose,
  coins,
  setCoins,
  playSfx,
  isDarkMode = false,
}: LuckyWheelModalProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (coins < 50) {
      alert('Bạn cần ít nhất 50 Xu để quay Vòng Quay May Mắn!');
      return;
    }
    if (isSpinning) return;

    setCoins((prev) => prev - 50);
    setIsSpinning(true);
    setWinMessage(null);
    playSfx('click');

    const prizeIndex = Math.floor(Math.random() * SLICES.length);
    const prize = SLICES[prizeIndex];

    const sliceAngle = 360 / SLICES.length;
    const targetAngle = 3600 + (360 - prizeIndex * sliceAngle - sliceAngle / 2);

    setRotationDegree(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      playSfx('success');

      if (prize.type === 'coins' && prize.amount) {
        setCoins((prev) => prev + prize.amount);
        setWinMessage(`Chúc mừng! Bạn trúng phần thưởng ${prize.text}!`);
      } else {
        setCoins((prev) => prev + 60);
        setWinMessage(`Chúc mừng! Bạn nhận được ${prize.text} (Quy đổi +60 Xu)!`);
      }
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg sm:max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all duration-300 relative text-center ${
          isDarkMode
            ? 'bg-[#1e1e1e] text-slate-100 border-slate-700'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm cursor-pointer transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-extrabold tracking-tight mb-1 flex items-center justify-center gap-2">
          {renderTargetIcon('w-6 h-6 text-amber-500')}
          <span>Vòng Quay May Mắn HSK</span>
        </h2>
        <p className={`text-xs font-mono mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Thử vận may chỉ 50 Xu/lần quay để nhận quà lớn!
        </p>

        <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 px-3.5 py-1 rounded-full text-xs font-mono font-bold mb-5 shadow-xs">
          {renderCoinIcon('w-4 h-4 text-amber-600 dark:text-amber-400')} Số Xu Hiện Có: {coins} Xu
        </div>

        <div className="relative w-64 h-64 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-rose-600 filter drop-shadow-md" />

          <div
            className="w-full h-full rounded-full border-4 border-amber-400 shadow-xl overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{ transform: `rotate(${rotationDegree}deg)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {SLICES.map((slice, i) => {
                const angle = 360 / SLICES.length;
                const startAngle = i * angle;
                const endAngle = (i + 1) * angle;

                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const textAngle = startAngle + angle / 2;
                const textRad = (Math.PI * textAngle) / 180;
                const tx = 50 + 32 * Math.cos(textRad);
                const ty = 50 + 32 * Math.sin(textRad);

                return (
                  <g key={slice.id}>
                    <path
                      d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`}
                      fill={slice.color}
                      stroke="#ffffff"
                      strokeWidth="0.8"
                    />
                    <text
                      x={tx}
                      y={ty}
                      fill="#ffffff"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                    >
                      {slice.text}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="absolute w-12 h-12 bg-white dark:bg-slate-900 border-4 border-amber-400 rounded-full shadow-md flex items-center justify-center z-10">
            {renderGiftIcon('w-5 h-5 text-amber-500')}
          </div>
        </div>

        {winMessage && (
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 rounded-2xl font-bold text-xs mb-4 animate-bounce flex items-center justify-center gap-1.5">
            {renderGiftIcon('w-4 h-4 text-emerald-600')}
            <span>{winMessage}</span>
          </div>
        )}

        <button
          onClick={handleSpin}
          disabled={isSpinning || coins < 50}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
            isSpinning || coins < 50
              ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-amber-400/30'
          }`}
        >
          {renderTargetIcon('w-4 h-4 text-slate-950')}
          <span>{isSpinning ? 'Đang Quay Mắn...' : 'Quay Ngay (50 Xu)'}</span>
        </button>
      </div>
    </div>
  );
}
