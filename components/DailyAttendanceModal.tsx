'use client';

import React, { useState } from 'react';

interface DailyAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakCount: number;
  claimedToday: boolean;
  onClaimAttendance: () => void;
  isDarkMode: boolean;
}

export default function DailyAttendanceModal({
  isOpen,
  onClose,
  streakCount,
  claimedToday,
  onClaimAttendance,
  isDarkMode,
}: DailyAttendanceModalProps) {
  if (!isOpen) return null;

  // 7-day rewards grid calculation
  const currentDayIndex = ((streakCount - 1) % 7) + 1; // 1 to 7

  const rewards = [
    { day: 1, coins: 35, title: 'Ngày 1' },
    { day: 2, coins: 40, title: 'Ngày 2' },
    { day: 3, coins: 45, title: 'Ngày 3' },
    { day: 4, coins: 50, title: 'Ngày 4' },
    { day: 5, coins: 55, title: 'Ngày 5' },
    { day: 6, coins: 60, title: 'Ngày 6' },
    { day: 7, coins: 100, title: 'Ngày 7 (Quà Lớn)' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all duration-300 relative ${
          isDarkMode
            ? 'bg-[#1e1e1e] text-slate-100 border-slate-700'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm cursor-pointer transition"
        >
          ✕
        </button>

        {/* HEADER ICON & TITLE */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-rose-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg transform -rotate-3 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-white">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.59L8.41 12 9.83 10.58l3.17 3.18 5.17-5.17L19.59 10z"/>
            </svg>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Điểm Danh Hàng Ngày
          </h2>
          <p className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Đăng nhập mỗi ngày để tích lũy Xu & duy trì Chuỗi Học Tập!
          </p>
        </div>

        {/* STREAK BADGE BANNER */}
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-400/30 rounded-2xl p-3.5 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 font-mono font-bold text-sm text-rose-600 dark:text-rose-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-rose-500 animate-pulse">
              <path d="M12 23a9 9 0 0 1-7-14.65C6 7 7.5 4 12 1c1.5 3 3 5 3.5 7.5a6 6 0 0 1 3.5 5.5A9 9 0 0 1 12 23z" />
            </svg>
            <span>Chuỗi Hiện Tại: <strong className="text-base text-amber-600 dark:text-amber-400">{streakCount} Ngày</strong></span>
          </div>
        </div>

        {/* 7-DAY REWARDS GRID */}
        <div className="grid grid-cols-4 gap-2.5 mb-6">
          {rewards.map((r) => {
            const isCompleted = r.day < currentDayIndex || (r.day === currentDayIndex && claimedToday);
            const isCurrentActive = r.day === currentDayIndex && !claimedToday;

            return (
              <div
                key={r.day}
                className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  r.day === 7 ? 'col-span-2' : ''
                } ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : isCurrentActive
                    ? 'bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-500 shadow-md scale-105 animate-pulse'
                    : isDarkMode
                    ? 'bg-slate-800/60 border-slate-700 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-mono font-bold uppercase">{r.title}</span>

                <div className="my-1.5 flex items-center justify-center gap-1 font-bold text-xs">
                  {isCompleted ? (
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">✓ Đã nhận</span>
                  ) : (
                    <>
                      <span className="text-amber-500 text-xs">🪙</span>
                      <span className={isCurrentActive ? 'text-amber-600 dark:text-amber-300 font-extrabold text-sm' : ''}>+{r.coins}</span>
                    </>
                  )}
                </div>

                {isCurrentActive && (
                  <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full font-bold">Hôm nay</span>
                )}
              </div>
            );
          })}
        </div>

        {/* ACTION CLAIM BUTTON */}
        {!claimedToday ? (
          <button
            onClick={onClaimAttendance}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600 hover:from-amber-500 hover:to-rose-700 text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-rose-500/25 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.59L8.41 12 9.83 10.58l3.17 3.18 5.17-5.17L19.59 10z"/>
            </svg>
            <span>Điểm Danh Ngay (+30 Xu & Bonus)</span>
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-md cursor-pointer transition flex items-center justify-center gap-2"
          >
            <span>✓ Đã Điểm Danh Hôm Nay! (Quay lại vào ngày mai)</span>
          </button>
        )}
      </div>
    </div>
  );
}
