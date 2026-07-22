'use client';

import React from 'react';
import { GENERAL_VOCAB_ITEMS, FURNITURE_ITEMS } from '../data/vocabulary';

interface LearningStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userScore: number;
  streakCount: number;
  unlockedItems: string[];
  isDarkMode?: boolean;
}

function renderChartBarIcon(className = 'w-6 h-6 text-blue-500') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

export default function LearningStatsModal({
  isOpen,
  onClose,
  userScore,
  streakCount,
  unlockedItems,
  isDarkMode = false,
}: LearningStatsModalProps) {
  if (!isOpen) return null;

  const totalWordsAvailable = GENERAL_VOCAB_ITEMS.length + FURNITURE_ITEMS.length;
  const learnedCount = Math.min(unlockedItems.length + 12, totalWordsAvailable);
  const masteryPercentage = Math.round((learnedCount / totalWordsAvailable) * 100);

  const hskDistributions = [
    { level: 'HSK 1', count: Math.min(learnedCount, 30), total: 30, color: 'bg-emerald-500' },
    { level: 'HSK 2', count: Math.min(Math.max(0, learnedCount - 25), 25), total: 25, color: 'bg-blue-500' },
    { level: 'HSK 3', count: Math.min(Math.max(0, learnedCount - 45), 20), total: 20, color: 'bg-purple-500' },
    { level: 'HSK 4+', count: Math.min(Math.max(0, learnedCount - 60), 15), total: 15, color: 'bg-amber-500' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl sm:max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all duration-300 relative ${
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

        <div className="text-center space-y-1 mb-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/60 rounded-2xl mx-auto flex items-center justify-center border border-blue-300 shadow-sm">
            {renderChartBarIcon('w-6 h-6 text-blue-600 dark:text-blue-400')}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Báo Cáo Thống Kê Tiến Độ Học Tập
          </h2>
          <p className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Theo dõi chi tiết số từ thuộc, tỷ lệ thành thạo & kết quả học tập HSK
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl text-center">
            <p className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400">Từ Đã Học</p>
            <p className="text-xl font-black text-blue-700 dark:text-blue-300 mt-1">{learnedCount}</p>
            <p className="text-[9px] text-slate-500">/ {totalWordsAvailable} từ vựng</p>
          </div>

          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl text-center">
            <p className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">Thành Thạo</p>
            <p className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{masteryPercentage}%</p>
            <p className="text-[9px] text-slate-500">Chỉ số thuộc từ</p>
          </div>

          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-center">
            <p className="text-[10px] font-mono font-bold uppercase text-rose-600 dark:text-rose-400">Streak Điểm Danh</p>
            <p className="text-xl font-black text-rose-700 dark:text-rose-300 mt-1">{streakCount} Ngày</p>
            <p className="text-[9px] text-slate-500">Học liên tục</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs font-mono font-bold mb-2">
            <span>Tiến Độ Làm Chủ Từ Vựng HSK</span>
            <span className="text-emerald-600 dark:text-emerald-400">{learnedCount} / {totalWordsAvailable} ({masteryPercentage}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Phân Bổ Từ Vựng Theo Cấp Độ HSK
          </p>
          {hskDistributions.map((item) => {
            const pct = Math.round((item.count / item.total) * 100);
            return (
              <div key={item.level} className="space-y-1">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span>{item.level}</span>
                  <span className="text-slate-500">{item.count} / {item.total} từ ({pct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-2xl transition cursor-pointer"
        >
          Đóng Báo Cáo Thống Kê
        </button>
      </div>
    </div>
  );
}
