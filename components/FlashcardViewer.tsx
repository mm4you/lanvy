import React, { useState, useEffect, useMemo } from 'react';
import { GENERAL_VOCAB_ITEMS, GeneralVocabItem } from '../data/vocabulary';
import { getBookmarkedIds, toggleBookmark } from '../lib/bookmarksAndStreak';
import { getNotebooks, toggleWordInNotebook, Notebook } from '../lib/notebookHelper';

interface FlashcardViewerProps {
  customVocabs?: any[];
  onPlayAudio: (text: string) => void;
  playSfx: (type: 'click' | 'success' | 'flip' | 'perfect') => void;
  isDarkMode?: boolean;
  onRewardCoins?: (amount: number) => void;
  onOpenNotebookModal?: () => void;
  onClose?: () => void;
}

function renderXIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function renderAudioIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
}

function renderBookmarkIcon(isFilled: boolean, className = 'w-4 h-4') {
  return (
    <svg className={className} fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  );
}

function renderNotebookIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

export default function FlashcardViewer({
  customVocabs = [],
  onPlayAudio,
  playSfx,
  isDarkMode = false,
  onRewardCoins,
  onOpenNotebookModal,
  onClose,
}: FlashcardViewerProps) {
  const [deckSize, setDeckSize] = useState<number | 'all'>(5);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customInputVal, setCustomInputVal] = useState('15');
  const [selectedHsk, setSelectedHsk] = useState<number | 'all'>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'bookmarked'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // NOTEBOOK POPOVER STATE
  const [showNotebookPopover, setShowNotebookPopover] = useState(false);
  const [userNotebooks, setUserNotebooks] = useState<Notebook[]>([]);

  useEffect(() => {
    setBookmarkedIds(getBookmarkedIds());
    setUserNotebooks(getNotebooks());
  }, []);

  // Aggregate pool of vocabularies
  const allVocabs: GeneralVocabItem[] = useMemo(() => [
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
  ], [customVocabs]);

  const activeDeck = useMemo(() => {
    const pool = allVocabs.filter((item) => {
      const matchesHsk = selectedHsk === 'all' || item.hskLevel === selectedHsk;
      const matchesBookmark = filterMode === 'all' || bookmarkedIds.includes(item.id);
      return matchesHsk && matchesBookmark;
    });

    if (deckSize === 'all') return pool;

    // Shuffle pool deterministically based on shuffleSeed so each "Học tiếp" gives a brand new set!
    const shuffled = [...pool].sort((a, b) => {
      const s = shuffleSeed * 17;
      const hashA = (a.id + s).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const hashB = (b.id + s).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return (hashA % 97) - (hashB % 97);
    });

    return shuffled.slice(0, deckSize);
  }, [allVocabs, selectedHsk, filterMode, bookmarkedIds, deckSize, shuffleSeed]);

  const currentItem = activeDeck[currentIndex] || activeDeck[0];

  const cleanString = (str: string) => {
    if (!str) return '';
    return str.replace(/sở thích & hẹn hò|động vật & thú cưng|mua sắm & shopping/gi, '').trim();
  };

  useEffect(() => {
    if (currentItem && autoPlayAudio && !isFlipped && !isSessionCompleted) {
      onPlayAudio(cleanString(currentItem.nameChinese));
    }
  }, [currentIndex, isSessionCompleted, activeDeck]);

  const handleToggleBookmarkCurrent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentItem) return;
    const res = toggleBookmark(currentItem.id);
    setBookmarkedIds(res.allIds);
    playSfx('click');
  };

  const handleToggleNotebookWord = (notebookId: string, wordId: string) => {
    const updated = toggleWordInNotebook(notebookId, wordId);
    setUserNotebooks(updated);
    playSfx('click');
  };

  const handleNext = () => {
    playSfx('flip');
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
    setIsFlipped(false);
    setShowNotebookPopover(false);
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
    setShowNotebookPopover(false);
    if (activeDeck.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
  };

  const handleRestartSession = () => {
    playSfx('click');
    setShuffleSeed((prev) => prev + 1); // Shuffle to fetch a BRAND NEW set of words!
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsSessionCompleted(false);
    setShowNotebookPopover(false);
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
          <p className="text-xs text-slate-800 dark:text-slate-400 font-bold">
            Bạn vừa hoàn thành bộ {activeDeck.length} từ vựng và nhận thưởng <span className="text-amber-500 font-bold">+20 Xu</span>!
          </p>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex justify-around text-xs font-bold">
          <div>
            <p className="text-slate-700 dark:text-slate-300 font-bold">Tổng từ bộ này</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{activeDeck.length}</p>
          </div>
          <div>
            <p className="text-slate-700 dark:text-slate-300 font-bold">Từ đã thuộc</p>
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
      <div className="bg-white dark:bg-slate-900 border-2 border-[#1f2937] dark:border-slate-800 p-4 rounded-2xl shadow-[4px_4px_0px_#1f2937] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Bộ từ:</span>
            <select
              value={isCustomSize ? 'custom' : deckSize}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'custom') {
                  setIsCustomSize(true);
                  const num = Math.max(1, parseInt(customInputVal) || 10);
                  setDeckSize(num);
                } else {
                  setIsCustomSize(false);
                  setDeckSize(val === 'all' ? 'all' : Number(val));
                }
                setCurrentIndex(0);
                setIsFlipped(false);
                setIsSessionCompleted(false);
                playSfx('click');
              }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-xl font-mono font-bold text-xs cursor-pointer focus:outline-none"
            >
              <option value={5}>5 từ (Học nhanh)</option>
              <option value={10}>10 từ (Ôn tập vừa)</option>
              <option value={20}>20 từ (Chuyên sâu)</option>
              <option value="custom">Tùy chọn số lượng...</option>
              <option value="all">Tất cả từ vựng HSK</option>
            </select>

            {isCustomSize && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={customInputVal}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomInputVal(val);
                    const num = Math.max(1, parseInt(val) || 1);
                    setDeckSize(num);
                    setCurrentIndex(0);
                  }}
                  className="w-16 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-700 px-2 py-1 rounded-xl font-mono font-bold text-xs focus:outline-none text-center shadow-xs"
                  placeholder="Số từ"
                />
                <span className="text-xs font-bold text-slate-500">từ</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">HSK:</span>
              <div className="flex gap-1 flex-wrap">
                {['all', 1, 2, 3, 4, 5, 6].map((lvl) => (
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
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {lvl === 'all' ? 'Tất cả' : `H${lvl}`}
                  </button>
                ))}
              </div>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white border-2 border-[#1f2937] rounded-xl shadow-[2px_2px_0px_#1f2937] flex items-center justify-center font-black text-xs cursor-pointer transition active:scale-95 shrink-0 ml-1"
                title="Thoát chế độ Flashcards"
              >
                {renderXIcon('w-4 h-4 text-white')}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer font-extrabold text-slate-800 dark:text-slate-200 select-none">
              <input
                type="checkbox"
                checked={autoPlayAudio}
                onChange={(e) => setAutoPlayAudio(e.target.checked)}
                className="rounded text-rose-500 focus:ring-rose-500"
              />
              Tự động đọc
            </label>
            <button
              type="button"
              onClick={() => {
                setFilterMode((prev) => (prev === 'all' ? 'bookmarked' : 'all'));
                setCurrentIndex(0);
                setIsFlipped(false);
                playSfx('click');
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer border-2 border-[#1f2937] shadow-[1.5px_1.5px_0px_#1f2937] ${
                filterMode === 'bookmarked'
                  ? 'bg-amber-400 text-[#1f2937]'
                  : 'bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400'
              }`}
            >
              {renderBookmarkIcon(true, 'w-3.5 h-3.5')}
              Từ Đã Lưu ({bookmarkedIds.length})
            </button>
          </div>

          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg">
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

              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotebookPopover(!showNotebookPopover);
                      playSfx('click');
                    }}
                    className="p-2 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-600 dark:text-purple-300 rounded-xl border border-purple-200 dark:border-purple-800 cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                    title="Thêm từ này vào Sổ tay..."
                  >
                    {renderNotebookIcon('w-5 h-5 text-purple-600 dark:text-purple-300')}
                  </button>

                  {showNotebookPopover && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border-2 border-[#1f2937] dark:border-slate-700 rounded-2xl shadow-xl p-3 z-50 text-left animate-in zoom-in-95 duration-150"
                    >
                      <div className="flex items-center justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-2 mb-2">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">Chọn Sổ Tay Thêm Từ</span>
                        <button
                          onClick={() => setShowNotebookPopover(false)}
                          className="text-xs font-black text-slate-400 hover:text-slate-600"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {userNotebooks.map((nb) => {
                          const inNotebook = nb.wordIds.includes(currentItem.id);
                          return (
                            <label
                              key={nb.id}
                              className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={inNotebook}
                                onChange={() => handleToggleNotebookWord(nb.id, currentItem.id)}
                                className="rounded text-purple-600 focus:ring-purple-500"
                              />
                              <span className="truncate">{nb.name}</span>
                            </label>
                          );
                        })}
                      </div>
                      {onOpenNotebookModal && (
                        <button
                          onClick={() => {
                            setShowNotebookPopover(false);
                            onOpenNotebookModal();
                          }}
                          className="mt-2.5 w-full py-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-black rounded-lg border border-purple-300 dark:border-purple-800 text-center transition cursor-pointer"
                        >
                          + Tạo / Quản Lý Sổ Tay
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleToggleBookmarkCurrent}
                  className={`px-3 py-1.5 rounded-xl border-2 border-[#1f2937] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_#1f2937] active:scale-95 ${
                    bookmarkedIds.includes(currentItem.id)
                      ? 'bg-amber-400 text-[#1f2937]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-50'
                  }`}
                  title={bookmarkedIds.includes(currentItem.id) ? 'Bỏ lưu từ khỏi sổ' : 'Lưu từ vào sổ tay'}
                >
                  {renderBookmarkIcon(bookmarkedIds.includes(currentItem.id), 'w-4 h-4')}
                  <span>{bookmarkedIds.includes(currentItem.id) ? 'Đã lưu' : 'Lưu từ'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayAudio(cleanString(currentItem.nameChinese));
                  }}
                  className="p-2 bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-slate-700 cursor-pointer transition-all active:scale-95"
                  title="Nghe phát âm tiếng Trung"
                >
                  {renderAudioIcon('w-5 h-5')}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-5xl font-serif font-black text-slate-900 dark:text-slate-100 tracking-wide">
                {cleanString(currentItem.nameChinese)}
              </h3>
              <p className="text-lg font-mono font-bold text-rose-600 dark:text-rose-400">
                [{cleanString(currentItem.namePinyin)}]
              </p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 font-bold animate-pulse">
              Bấm vào thẻ để lật xem nghĩa & ví dụ ↺
            </div>
          </div>

          {/* MẶT SAU (NGHĨA VIỆT & VÍ DỤ CÂU) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-md flex flex-col justify-between items-center text-center">
            <div className="w-full flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Nghĩa tiếng Việt</span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                Chủ đề: {currentItem.theme || 'HSK'}
              </span>
            </div>

            <div className="space-y-3 my-auto">
              <h4 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {cleanString(currentItem.nameVietnamese)}
              </h4>

              {currentItem.exampleChinese && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1 max-w-md mx-auto">
                  <p className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                    {currentItem.exampleChinese}
                  </p>
                  {currentItem.examplePinyin && (
                    <p className="text-xs font-mono text-rose-500 font-bold">
                      {currentItem.examplePinyin}
                    </p>
                  )}
                  {currentItem.exampleVietnamese && (
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {currentItem.exampleVietnamese}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-700 dark:text-slate-300 text-center font-bold">
              Bấm thẻ để xoay lại ↺
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
