'use client';

import { useEffect, useState } from 'react';
import AuthPortal, { AuthenticatedUser } from '../components/auth-portal';
import BobaServiceGame from '../components/boba-service-game';
import OpenWorldGame from '../components/open-world-game';
import { AvatarConfig, DEFAULT_AVATAR, normalizeAvatar } from '../data/avatar';

const OFFLINE_USER_ID = 'offline-guest';
const LOVE_EMAIL = 'nguyenthilanvy12a2@gmail.com';
const OFFLINE_PROGRESS_KEY = 'hsk_boba_offline_progress_v1';

interface GameUser {
  id: string;
  username: string;
  email: string;
}

interface SavedProgress {
  score?: number;
  coins?: number;
  level?: number;
}

export default function GamePage() {
  const [user, setUser] = useState<GameUser | null>(null);
  const [gameArea, setGameArea] = useState<'world' | 'boba'>('world');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [characterName, setCharacterName] = useState('Người học');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);

  const isOffline = user?.id === OFFLINE_USER_ID;
  const isLoveUser = user?.email.toLowerCase() === LOVE_EMAIL;

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const savedUserId = localStorage.getItem('boba_game_user_id');
      const savedUsername = localStorage.getItem('boba_game_username');
      const savedEmail = localStorage.getItem('boba_game_email') ?? '';
      const savedName = localStorage.getItem('boba_character_name');
      const savedAvatar = localStorage.getItem('hsk_avatar_config_v1');

      if (savedAvatar) {
        try {
          setAvatarConfig(normalizeAvatar(JSON.parse(savedAvatar) as Partial<AvatarConfig>));
        } catch {
          localStorage.removeItem('hsk_avatar_config_v1');
        }
      }

      if (savedUserId && savedUsername) {
        const restoredUser = { id: savedUserId, username: savedUsername, email: savedEmail };
        setUser(restoredUser);
        setCharacterName(savedName || (savedEmail.toLowerCase() === LOVE_EMAIL ? 'Lan Vy' : savedUsername));
        if (restoredUser.id === OFFLINE_USER_ID) {
          try {
            const savedProgress = localStorage.getItem(OFFLINE_PROGRESS_KEY);
            if (savedProgress) {
              const progress = JSON.parse(savedProgress) as SavedProgress;
              setScore(Number.isFinite(progress.score) ? Math.max(0, progress.score ?? 0) : 0);
              setCoins(Number.isFinite(progress.coins) ? Math.max(0, progress.coins ?? 0) : 0);
              setCurrentLevel(Number.isFinite(progress.level) ? Math.max(1, progress.level ?? 1) : 1);
            }
          } catch {
            localStorage.removeItem(OFFLINE_PROGRESS_KEY);
          }
        } else {
          void fetch('/api/progress', { cache: 'no-store' })
            .then(async (response) => {
              if (response.status === 401) {
                localStorage.removeItem('boba_game_user_id');
                localStorage.removeItem('boba_game_username');
                localStorage.removeItem('boba_game_email');
                setUser(null);
                return;
              }
              if (!response.ok) return;
              const data = await response.json() as { progress?: SavedProgress };
              if (data.progress) {
                setScore(Number.isFinite(data.progress.score) ? Math.max(0, data.progress.score ?? 0) : 0);
                setCoins(Number.isFinite(data.progress.coins) ? Math.max(0, data.progress.coins ?? 0) : 0);
                setCurrentLevel(Number.isFinite(data.progress.level) ? Math.max(1, data.progress.level ?? 1) : 1);
              }
            })
            .catch(() => undefined);
        }
      } else {
        void fetch('/api/session', { cache: 'no-store' })
          .then(async (response) => {
            if (!response.ok) return;
            const data = await response.json() as { user?: GameUser };
            if (!data.user) return;
            const name = data.user.email.toLowerCase() === LOVE_EMAIL ? 'Lan Vy' : data.user.username;
            localStorage.setItem('boba_game_user_id', data.user.id);
            localStorage.setItem('boba_game_username', data.user.username);
            localStorage.setItem('boba_game_email', data.user.email);
            localStorage.setItem('boba_character_name', name);
            setUser(data.user);
            setCharacterName(name);
            const progressResponse = await fetch('/api/progress', { cache: 'no-store' });
            if (!progressResponse.ok) return;
            const progressData = await progressResponse.json() as { progress?: SavedProgress };
            if (progressData.progress) {
              setScore(Number.isFinite(progressData.progress.score) ? Math.max(0, progressData.progress.score ?? 0) : 0);
              setCoins(Number.isFinite(progressData.progress.coins) ? Math.max(0, progressData.progress.coins ?? 0) : 0);
              setCurrentLevel(Number.isFinite(progressData.progress.level) ? Math.max(1, progressData.progress.level ?? 1) : 1);
            }
          })
          .catch(() => undefined);
      }
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  const clearStoredSession = () => {
    localStorage.removeItem('boba_game_user_id');
    localStorage.removeItem('boba_game_username');
    localStorage.removeItem('boba_game_email');
  };

  const applyProgress = (progress: SavedProgress) => {
    setScore(Number.isFinite(progress.score) ? Math.max(0, progress.score ?? 0) : 0);
    setCoins(Number.isFinite(progress.coins) ? Math.max(0, progress.coins ?? 0) : 0);
    setCurrentLevel(Number.isFinite(progress.level) ? Math.max(1, progress.level ?? 1) : 1);
  };

  const loadProgress = async (activeUser: GameUser) => {
    if (activeUser.id === OFFLINE_USER_ID) {
      try {
        const saved = localStorage.getItem(OFFLINE_PROGRESS_KEY);
        if (saved) applyProgress(JSON.parse(saved) as SavedProgress);
      } catch {
        localStorage.removeItem(OFFLINE_PROGRESS_KEY);
      }
      return;
    }

    try {
      const response = await fetch('/api/progress', { cache: 'no-store' });
      if (response.status === 401) {
        clearStoredSession();
        setUser(null);
        return;
      }
      if (!response.ok) return;
      const data = await response.json() as { progress?: SavedProgress };
      if (data.progress) applyProgress(data.progress);
    } catch {
      // Keep the last visible progress when the connection is temporarily unavailable.
    }
  };

  const persistProgress = async (nextScore: number, nextCoins: number, nextLevel: number) => {
    if (!user || user.id === OFFLINE_USER_ID) {
      localStorage.setItem(OFFLINE_PROGRESS_KEY, JSON.stringify({ score: nextScore, coins: nextCoins, level: nextLevel }));
      return;
    }

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: nextScore, coins: nextCoins, level: nextLevel }),
      });
    } catch {
      // The next completed activity will retry with the accumulated local state.
    }
  };

  const rememberUser = (nextUser: GameUser, name: string) => {
    localStorage.setItem('boba_game_user_id', nextUser.id);
    localStorage.setItem('boba_game_username', nextUser.username);
    localStorage.setItem('boba_game_email', nextUser.email);
    localStorage.setItem('boba_character_name', name);
    setCharacterName(name);
    setUser(nextUser);
    setGameArea('world');
  };

  const handleOfflinePlay = (name: string) => {
    const offlineName = name.trim() || 'Người học';
    const offlineUser = { id: OFFLINE_USER_ID, username: offlineName, email: '' };
    rememberUser(offlineUser, offlineName);
    void loadProgress(offlineUser);
  };

  const handleOnlineAuthenticated = (authenticatedUser: AuthenticatedUser) => {
    const name = authenticatedUser.email.toLowerCase() === LOVE_EMAIL ? 'Lan Vy' : authenticatedUser.username;
    rememberUser(authenticatedUser, name);
    void loadProgress(authenticatedUser);
  };

  const handleAvatarChange = (nextAvatar: AvatarConfig) => {
    const normalized = normalizeAvatar(nextAvatar);
    setAvatarConfig(normalized);
    localStorage.setItem('hsk_avatar_config_v1', JSON.stringify(normalized));
  };

  const handleReward = (scoreReward: number, coinReward: number) => {
    const nextScore = score + scoreReward;
    const nextCoins = coins + coinReward;
    const nextLevel = Math.max(currentLevel, Math.floor(nextScore / 500) + 1);
    setScore(nextScore);
    setCoins(nextCoins);
    setCurrentLevel(nextLevel);
    void persistProgress(nextScore, nextCoins, nextLevel);
  };

  const handleLogout = async () => {
    if (!isOffline) {
      try {
        await fetch('/api/logout', { method: 'POST' });
      } catch {
        // Local session state is still cleared so the player can switch accounts.
      }
    }
    clearStoredSession();
    setUser(null);
    setGameArea('world');
    setScore(0);
    setCoins(0);
    setCurrentLevel(1);
  };

  if (!user) {
    return <AuthPortal onAuthenticated={handleOnlineAuthenticated} onOffline={handleOfflinePlay} />;
  }

  if (gameArea === 'boba') {
    return (
      <BobaServiceGame
        playerName={characterName}
        score={score}
        coins={coins}
        isLoveUser={Boolean(isLoveUser)}
        onBack={() => setGameArea('world')}
        onReward={handleReward}
      />
    );
  }

  return (
    <OpenWorldGame
      playerName={characterName}
      avatarConfig={avatarConfig}
      score={score}
      coins={coins}
      onAvatarChange={handleAvatarChange}
      onEnterBoba={() => setGameArea('boba')}
      onLogout={handleLogout}
      onReward={handleReward}
    />
  );
}
