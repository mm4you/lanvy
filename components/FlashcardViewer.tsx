'use client';

import React, { useState, useEffect } from 'react';
import { GENERAL_VOCAB_ITEMS, GeneralVocabItem } from '../data/vocabulary';

interface FlashcardViewerProps {
  customVocabs?: any[];
  onPlayAudio: (text: string) => void;
  playSfx: (type: 'click' | 'success' | 'flip' | 'perfect') => void;
  isDarkMode?: boolean;
  onRewardCoins?: (amount: number) => void;
}

export default function FlashcardViewer({
  customVocabs = [],
  onPlayAudio,
  playSfx,
  isDarkMode = false,
  onRewardCoins,
}: FlashcardViewerProps) {
  const [deckSize, setDeckSize] = useState<5 | 10 | 'all'>(5);
  const [selectedHsk, setSelectedHsk] = useState<number | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);

  // Aggregate pool of vocabularies
  const allVocabs: GeneralVocabItem[] = [
    ...GENERAL_VOCAB_ITEMS,
    ...(customVocabs || []).map((v) => ({
      id: v.id || `custom_${v.nameChinese}`,
      nameChinese: v.nameChinese,
      namePinyin: v.namePinyin,
      nameVietnamese: v.nameVietnamese,
      hskLevel: v.hskLevel || 1,
      theme: v.category || 'Tự chọn',
      exampleChinese: v.exampleChinese,
      examplePinyin: v.examplePinyin,
      exampleVietnamese: v.exampleVietnamese,
    })),
  ];

  const pool = allVocabs.filter(
    (item) => selectedHsk === 'all' || item.hskLevel === selectedHsk
  );

  const activeDeck = deckSize === 'all' ? pool : pool.slice(0, deckSize);
  const currentItem = activeDeck[currentIndex] || activeDeck[0];

  const cleanString = (str: string) => {
    if (!str) return '';
    return str.replace(/sở thích & hẹn hò|động vật & thú cưng|mua sắm & shopping/gi, '').trim();
  };

  useEffect(() => {
    if (currentItem && autoPlayAudio && !isFlipped && !isSessionCompleted) {
      onPlayAudio(cleanString(currentItem.nameChinese));
    }
  }, [currentIndex, isSessionCompleted]);

  const handleNext = () => {
    playSfx('flip');
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
    setIsFlipped(false);
    if (activeDeck.length === 0) return;

    if (currentIndex + 1 >= activeDeck.length) {
      setIsSessionCompleted(true);
      playSfx('perfect');
      if (onRewardCoins) onRewardCoins(20);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    playSfx('flip');
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
    setIsFlipped(false);
    if (activeDeck.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
  };

  const handleRestartSession = () => {
    playSfx('click');
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsSessionCompleted(false);
  };

  const handleToggleMastered = (id: string) => {
    playSfx('success');
    if (masteredIds.includes(id)) {
      setMasteredIds((prev) => prev.filter((i) => i !== id));
    } else {
      setMasteredIds((prev) => [...prev, id]);
      handleNext();
    }
  };

  if (!currentItem) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
        Hiện chưa có từ vựng thuộc cấp độ HSK này.
      </div>
    );
  }

  const isMastered = masteredIds.includes(currentItem.id);

  if (isSessionCompleted) {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center space-y-5 shadow-lg text-slate-900 dark:text-slate-100">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          ✓
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Hoàn Thành Thẻ Học HSK!</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            Bạn vừa hoàn thành bộ {activeDeck.length} từ vựng và nhận thưởng <span className="text-amber-500 font-bold">+20 Xu</span>!
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex justify-around text-xs font-bold">
          <div>
            <p className="text-slate-400">Tổng từ bộ này</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{activeDeck.length}</p>
          </div>
          <div>
            <p className="text-slate-400">Từ đã thuộc</p>
            <p className="text-lg font-bold text-emerald-500">{masteredIds.length}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestartSession}
          className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Học Tiếp Bộ Mới ↺
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5 text-slate-900 dark:text-slate-100">
      {/* HEADER BỘ TỪ & CẤP ĐỘ HSK */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Bộ từ:</span>
            <select
              value={deckSize}
              onChange={(e) => {
                const val = e.target.value;
                setDeckSize(val === 'all' ? 'all' : (Number(val) as any));
                setCurrentIndex(0);
                setIsFlipped(false);
                setIsSessionCompleted(false);
                playSfx('click');
              }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-xl font-mono font-bold text-xs cursor-pointer focus:outline-none"
            >
              <option value={5}>5 từ vựng (Học nhanh)</option>
              <option value={10}>10 từ vựng (Ôn tập vừa)</option>
              <option value={20}>20 từ vựng (Chuyên sâu)</option>
              <option value="all">Tất cả từ vựng HSK</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">HSK:</span>
            <div className="flex gap-1">
              {['all', 1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setSelectedHsk(lvl === 'all' ? 'all' : Number(lvl));
                    setCurrentIndex(0);
                    setIsFlipped(false);
                    setIsSessionCompleted(false);
                    playSfx('click');
                  }}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    selectedHsk === lvl
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {lvl === 'all' ? 'Tất cả' : `H${lvl}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-600 dark:text-slate-400 select-none">
            <input
              type="checkbox"
              checked={autoPlayAudio}
              onChange={(e) => setAutoPlayAudio(e.target.checked)}
              className="rounded text-rose-500 focus:ring-rose-500"
            />
            Tự động đọc tiếng Trung
          </label>

          <span className="font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg">
            Thẻ {currentIndex + 1} / {activeDeck.length}
          </span>
        </div>
      </div>

      {/* THẺ 3D FLIP CARD */}
      <div
        className="w-full h-80 perspective-1000 cursor-pointer select-none"
        onClick={() => {
          setIsFlipped(!isFlipped);
          playSfx('flip');
        }}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* MẶT TRƯỚC (CHỮ HÁN & PHÁT ÂM) */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-md flex flex-col justify-between items-center text-center">
            <div className="w-full flex justify-between items-center">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                HSK {currentItem.hskLevel}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayAudio(cleanString(currentItem.nameChinese));
                }}
                className="p-2.5 bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-slate-700 cursor-pointer transition-all active:scale-95"
                title="Nghe phát âm tiếng Trung"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
            </div>

            <div className="space-y-2 my-auto">
              <h2 className="text-6xl font-serif font-bold text-rose-600 dark:text-rose-400 tracking-wide">
                {cleanString(currentItem.nameChinese)}
              </h2>
              <p className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
                [{cleanString(currentItem.namePinyin)}]
              </p>
            </div>

            <div className="text-xs text-slate-400 dark:text-slate-500 font-bold animate-pulse">
              Bấm vào thẻ để lật xem nghĩa & ví dụ ↺
            </div>
          </div>

          {/* MẶT SAU (NGHĨA TIẾNG VIỆT & VÍ DỤ) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 dark:bg-slate-950 text-white border-2 border-slate-700 rounded-3xl p-6 shadow-md flex flex-col justify-between text-left">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-sm font-serif font-bold text-rose-400">
                {cleanString(currentItem.nameChinese)} [{cleanString(currentItem.namePinyin)}]
              </span>
              <span className="text-xs font-bold text-slate-400">Nghĩa tiếng Việt</span>
            </div>

            <div className="space-y-3 my-auto">
              <h3 className="text-2xl font-bold text-emerald-400">
                {cleanString(currentItem.nameVietnamese)}
              </h3>

              {currentItem.exampleChinese && (
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-1 text-xs">
                  <p className="font-bold text-slate-200">
                    <span className="text-rose-400">Ví dụ:</span> {currentItem.exampleChinese}
                  </p>
                  <p className="italic text-blue-300">{currentItem.examplePinyin}</p>
                  <p className="font-bold text-slate-400">{currentItem.exampleVietnamese}</p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 text-center font-bold">
              Bấm vào thẻ để lật lại mặt trước ↺
            </div>
          </div>
        </div>
      </div>

      {/* NÚT ĐIỀU HƯỚNG VÀ ĐÁNH DẤU */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={handlePrev}
          className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 font-bold text-xs rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer text-slate-700 dark:text-slate-200"
        >
          ← Thẻ Trước
        </button>

        <button
          type="button"
          onClick={() => handleToggleMastered(currentItem.id)}
          className={`flex-1 py-3 font-bold text-xs rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer border ${
            isMastered
              ? 'bg-emerald-500 text-white border-emerald-600'
              : 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-500'
          }`}
        >
          {isMastered ? '✓ Đã Thuộc Từ Này' : '★ Đánh Dấu Đã Thuộc'}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Thẻ Tiếp →
        </button>
      </div>

      {/* STYLES CHO FLIP CARD 3D */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
