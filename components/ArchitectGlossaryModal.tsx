'use client';

import React, { useState } from 'react';
import { ARCHITECT_TERMS, ARCHITECT_CATEGORIES, ArchitectTerm } from '../data/architect-terms';

interface ArchitectGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayTTS?: (text: string) => void;
  isDarkMode?: boolean;
}

export function ArchitectGlossaryModal({
  isOpen,
  onClose,
  onPlayTTS,
  isDarkMode = false
}: ArchitectGlossaryModalProps) {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredTerms = ARCHITECT_TERMS.filter(term => {
    const matchesCat = selectedCat === 'all' || term.category === selectedCat;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      term.nameChinese.toLowerCase().includes(q) ||
      term.namePinyin.toLowerCase().includes(q) ||
      term.nameVietnamese.toLowerCase().includes(q) ||
      term.specification.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#fffaf0] dark:bg-slate-900 border-4 border-[#1f2937] dark:border-slate-700 w-full max-w-4xl rounded-3xl shadow-[6px_6px_0px_#1f2937] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#1f2937] dark:text-slate-100">
        
        {/* HEADER MODAL */}
        <div className="p-4 bg-amber-100 dark:bg-slate-800 border-b-4 border-[#1f2937] dark:border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 dark:bg-amber-500 border-2 border-[#1f2937] dark:border-slate-600 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#1f2937]">
              <svg className="w-6 h-6 text-[#1f2937]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-black text-[#1f2937] dark:text-slate-100 flex items-center gap-2">
                Sổ Tay Thuật Ngữ Kiến Trúc & Vật Liệu HSK
                <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-sans uppercase">Pro Designer</span>
              </h2>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-bold">
                Tra cứu chuẩn specs vật liệu gỗ, đá, kính, quy cách thi công & bản vẽ CAD bằng tiếng Trung cho Vy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white dark:bg-slate-700 dark:text-slate-100 hover:bg-gray-100 border-2 border-[#1f2937] dark:border-slate-600 rounded-lg shadow-[2px_2px_0px_#1f2937] font-black text-sm flex items-center justify-center cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* CONTROLS: SEARCH & CATEGORY FILTERS */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-850 border-b-2 border-[#1f2937] dark:border-slate-700 space-y-3 shrink-0">
          {/* SEARCH INPUT */}
          <div className="flex items-center bg-[#fff5f6] dark:bg-slate-800 border-2 border-[#1f2937] dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_#1f2937]">
            <svg className="w-4 h-4 text-slate-700 dark:text-slate-200 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên vật liệu, tiếng Trung, pinyin hoặc quy cách..."
              className="w-full bg-transparent text-xs font-bold focus:outline-none text-[#1f2937] dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs font-black text-slate-600 hover:text-slate-900">✕</button>
            )}
          </div>

          {/* CATEGORIES SCROLLABLE TABS */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3 py-1 rounded-lg border-2 text-xs font-black whitespace-nowrap transition cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-rose-500 text-white border-rose-700 shadow-[2px_2px_0px_#1f2937] translate-y-0.5'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-[#1f2937] dark:border-slate-700 hover:bg-rose-50'
              }`}
            >
              Tất Cả ({ARCHITECT_TERMS.length})
            </button>
            {ARCHITECT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1 rounded-lg border-2 border-[#1f2937] dark:border-slate-700 text-xs font-black whitespace-nowrap transition cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-amber-400 text-[#1f2937] shadow-[2px_2px_0px_#1f2937] translate-y-0.5'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN LIST CONTENT */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-slate-800 dark:text-slate-200 font-bold text-sm">
              Không tìm thấy vật liệu hoặc thuật ngữ kiến trúc phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTerms.map(term => (
                <div
                  key={term.id}
                  className="bg-white dark:bg-slate-800 border-2 border-[#1f2937] dark:border-slate-700 rounded-2xl p-4 shadow-[3px_3px_0px_#1f2937] space-y-2.5 flex flex-col justify-between hover:-translate-y-0.5 transition-all text-[#1f2937] dark:text-slate-100"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded">
                        {term.categoryNameVn}
                      </span>
                      {onPlayTTS && (
                        <button
                          onClick={() => onPlayTTS(term.nameChinese)}
                          className="px-2 py-1 bg-pink-100 dark:bg-rose-900 hover:bg-pink-200 border border-[#1f2937] text-[10px] font-black rounded flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_#1f2937] text-rose-900 dark:text-rose-200"
                        >
                          <svg className="w-3 h-3 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                          Nghe đọc
                        </button>
                      )}
                    </div>
                    <h3 className="text-base font-serif font-black text-rose-600 dark:text-rose-400 flex items-baseline gap-2">
                      {term.nameChinese}
                      <span className="text-xs font-mono text-slate-800 dark:text-slate-200 font-bold">({term.namePinyin})</span>
                    </h3>
                    <p className="text-xs font-black text-[#1f2937] dark:text-slate-100">{term.nameVietnamese}</p>
                  </div>

                  <div className="p-2.5 bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 space-y-1">
                    <div className="text-[11px] font-black text-amber-900 dark:text-amber-400 flex items-center gap-1">
                      🛠️ Quy cách & Đơn giá thi công:
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-slate-300">{term.specification}</p>
                  </div>

                  <div className="p-2.5 bg-pink-50 dark:bg-rose-950/40 border border-pink-200 dark:border-rose-900/60 rounded-xl text-xs space-y-1">
                    <p className="font-serif font-bold text-pink-900 dark:text-rose-200">{term.exampleChinese}</p>
                    <p className="text-[11px] font-mono text-pink-700 dark:text-rose-300">{term.examplePinyin}</p>
                    <p className="text-[11px] font-bold text-pink-950 dark:text-rose-100">👉 {term.exampleVietnamese}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
