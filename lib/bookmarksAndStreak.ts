'use client';

// Bookmark / Sổ Từ Khó Ôn Tập Manager
export function getBookmarkedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('hsk_bookmarked_word_ids');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function toggleBookmark(wordId: string): { isBookmarked: boolean; allIds: string[] } {
  if (typeof window === 'undefined') return { isBookmarked: false, allIds: [] };
  const current = getBookmarkedIds();
  let updated: string[];
  let isBookmarked: boolean;

  if (current.includes(wordId)) {
    updated = current.filter((id) => id !== wordId);
    isBookmarked = false;
  } else {
    updated = [...current, wordId];
    isBookmarked = true;
  }

  localStorage.setItem('hsk_bookmarked_word_ids', JSON.stringify(updated));
  return { isBookmarked, allIds: updated };
}

// Daily Streak Manager
export interface StreakData {
  streakCount: number;
  lastLoginDate: string;
  claimedToday: boolean;
  totalDays: number;
}

export function checkAndRewardDailyStreak(): { streakData: StreakData; justClaimedReward: boolean; rewardCoins: number } {
  if (typeof window === 'undefined') {
    return {
      streakData: { streakCount: 1, lastLoginDate: '', claimedToday: false, totalDays: 1 },
      justClaimedReward: false,
      rewardCoins: 0,
    };
  }

  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const saved = localStorage.getItem('hsk_daily_streak_data');

  let data: StreakData = saved
    ? JSON.parse(saved)
    : { streakCount: 0, lastLoginDate: '', claimedToday: false, totalDays: 0 };

  if (data.lastLoginDate === todayStr) {
    return { streakData: data, justClaimedReward: false, rewardCoins: 0 };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = 1;
  if (data.lastLoginDate === yesterdayStr) {
    newStreak = data.streakCount + 1;
  } else if (data.lastLoginDate && data.lastLoginDate !== todayStr) {
    newStreak = 1; // Reset streak if missed a day
  }

  const rewardCoins = 30 + Math.min(newStreak * 5, 50); // Bonus coins based on streak length

  data = {
    streakCount: newStreak,
    lastLoginDate: todayStr,
    claimedToday: true,
    totalDays: (data.totalDays || 0) + 1,
  };

  localStorage.setItem('hsk_daily_streak_data', JSON.stringify(data));
  return { streakData: data, justClaimedReward: true, rewardCoins };
}
