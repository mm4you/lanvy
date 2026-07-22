'use client';

import React from 'react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userScore: number;
  userStreak: number;
  username: string;
  isDarkMode?: boolean;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
  streak: number;
  title: string;
  isCurrentUser?: boolean;
}

function renderTrophyIcon(className = 'w-6 h-6 text-amber-500') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M5 3v5a4 4 0 004 4h6a4 4 0 004-4V3M5 3H3v3a3 3 0 003 3h1m12-6h2a3 3 0 013 3v0a3 3 0 01-3 3h-1M9 12v3a3 3 0 003 3h0a3 3 0 003-3v-3M12 18v3m-3 0h6" />
    </svg>
  );
}

function renderFlameIcon(className = 'w-4 h-4 text-rose-500') {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C10.5 5 8 7 8 10c0 2.2 1.8 4 4 4s4-1.8 4-4c0-3-2.5-5-4-8z" />
    </svg>
  );
}

function renderCrownIcon(className = 'w-4 h-4 text-amber-500') {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z" />
    </svg>
  );
}

export default function LeaderboardModal({
  isOpen,
  onClose,
  userScore,
  userStreak,
  username,
  isDarkMode = false,
}: LeaderboardModalProps) {
  const [realUsers, setRealUsers] = React.useState<LeaderboardUser[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      fetch('/api/leaderboard')
        .then((res) => res.json())
        .then((data) => {
          if (data?.leaderboard && Array.isArray(data.leaderboard)) {
            setRealUsers(data.leaderboard);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUserObj: LeaderboardUser = {
    rank: 0,
    name: username || 'Chủ Tiệm HSK',
    score: userScore,
    streak: userStreak,
    title: userScore >= 3000 ? 'Chủ Tiệm Xuất Sắc' : userScore >= 1500 ? 'Kiến Trúc Sư HSK' : 'Học Viên Chăm Chỉ',
    isCurrentUser: true
  };

  const userMap = new Map<string, LeaderboardUser>();

  // Add real users from DB
  realUsers.forEach((u) => {
    if (u.name) {
      userMap.set(u.name.toLowerCase(), {
        rank: 0,
        name: u.name,
        score: u.score,
        streak: u.streak,
        title: u.title,
        isCurrentUser: u.name.toLowerCase() === (username || '').toLowerCase(),
      });
    }
  });

  // Ensure current user is updated with live score/streak
  userMap.set((username || 'Chủ Tiệm HSK').toLowerCase(), currentUserObj);

  // Core active users
  if (!userMap.has('lan vy')) {
    userMap.set('lan vy', { rank: 0, name: 'Lan Vy', score: Math.max(userScore + 250, 3500), streak: Math.max(userStreak, 7), title: 'Chủ Tiệm Xuất Sắc' });
  }
  if (!userMap.has('nhựt khang')) {
    userMap.set('nhựt khang', { rank: 0, name: 'Nhựt Khang', score: Math.max(userScore + 50, 3295), streak: Math.max(userStreak - 1, 5), title: 'Kiến Trúc Sư HSK' });
  }

  // Dynamic Real-time Sorting & Ranking
  const rawUsers = Array.from(userMap.values())
    .sort((a, b) => b.score - a.score)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg sm:max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all duration-300 relative ${
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

        <div className="text-center space-y-1 mb-5">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/60 rounded-2xl mx-auto flex items-center justify-center border border-amber-300 shadow-sm">
            {renderTrophyIcon('w-6 h-6 text-amber-600 dark:text-amber-400')}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight flex items-center justify-center gap-2">
            <span>Bảng Xếp Hạng Top Học Viên</span>
          </h2>
          <p className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Bảng vinh danh các Chủ tiệm HSK có Điểm & Streak cao nhất!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {rawUsers.slice(0, 3).map((u, idx) => (
            <div
              key={u.name}
              className={`p-3 rounded-2xl border text-center relative flex flex-col justify-between items-center ${
                idx === 0
                  ? 'bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-950/80 dark:to-amber-900/60 border-amber-400 text-amber-950 dark:text-amber-200 shadow-md scale-105 z-10'
                  : idx === 1
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  : 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900 text-orange-900 dark:text-orange-300'
              }`}
            >
              <div className="flex items-center justify-center gap-1 font-bold text-sm mb-1">
                {idx === 0 ? renderCrownIcon('w-4 h-4 text-amber-600') : `#${idx + 1}`}
              </div>
              <p className="font-bold text-xs truncate max-w-[80px]">{u.name}</p>
              <p className="text-[10px] font-mono font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {u.score} điểm
              </p>
              {idx === 0 && (
                <span className="text-[8px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded-full uppercase mt-1">
                  Top 1
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mb-4">
          {rawUsers.map((u) => (
            <div
              key={u.name}
              className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-mono font-bold transition ${
                u.isCurrentUser
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400'
                  : isDarkMode
                  ? 'bg-slate-800/60 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full font-black text-center leading-6 text-xs ${
                  u.rank === 1 ? 'bg-amber-400 text-slate-950' : u.rank === 2 ? 'bg-slate-300 text-slate-950' : 'bg-orange-300 text-slate-950'
                }`}>
                  {u.rank}
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>{u.name}</span>
                    {u.isCurrentUser && (
                      <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full uppercase">
                        Bạn
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] font-normal text-slate-500 dark:text-slate-400">{u.title}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-blue-600 dark:text-blue-400 font-extrabold">{u.score} Điểm</p>
                <p className="text-[10px] text-rose-500 font-normal flex items-center justify-end gap-1">
                  {renderFlameIcon('w-3 h-3 text-rose-500')} {u.streak} Ngày
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-2xl transition cursor-pointer"
        >
          Đóng Bảng Xếp Hạng
        </button>
      </div>
    </div>
  );
}
