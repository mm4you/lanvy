'use client';

import { useEffect, useMemo, useState } from 'react';
import '../app/open-world.css';
import '../app/town-fullscreen.css';
import { LearningZone, WORLD_VOCAB, ZONE_LABELS } from '../data/open-world';
import { AvatarConfig } from '../data/avatar';
import AvatarWardrobe from './avatar-wardrobe';
import { ArrowLeftIcon, LogoutIcon, WardrobeIcon } from './ui-icons';
import PhaserTown from './phaser-town';
import ConversationEpisode from './conversation-episode';

type WorldScreen = 'town' | LearningZone | 'notebook' | 'wardrobe';

interface OpenWorldProgress {
  masteredIds: string[];
  streak: number;
  bestStreak: number;
  totalCorrect: number;
  zoneWins: Record<LearningZone, number>;
}

interface OpenWorldGameProps {
  playerName: string;
  avatarConfig: AvatarConfig;
  score: number;
  coins: number;
  onAvatarChange: (avatar: AvatarConfig) => void;
  onEnterBoba: () => void;
  onLogout: () => void;
  onReward: (score: number, coins: number) => void;
}

const STORAGE_KEY = 'hsk_open_world_progress_v1';

const DEFAULT_PROGRESS: OpenWorldProgress = {
  masteredIds: [],
  streak: 0,
  bestStreak: 0,
  totalCorrect: 0,
  zoneWins: { dimsum: 0, market: 0, park: 0 },
};

const ZONE_META: Record<LearningZone, {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  pale: string;
}> = {
  dimsum: {
    eyebrow: 'Ẩm thực & chế biến',
    title: 'Nhà hàng Dim Sum',
    description: 'Nhận món, chọn nguyên liệu và phục vụ khách bằng tiếng Trung.',
    accent: '#dc2626',
    pale: '#fff1f2',
  },
  market: {
    eyebrow: 'Mua sắm & lượng từ',
    title: 'Siêu thị HSK',
    description: 'Đọc danh sách mua hàng và tìm đúng món trên từng quầy.',
    accent: '#2563eb',
    pale: '#eff6ff',
  },
  park: {
    eyebrow: 'Giao tiếp đời thường',
    title: 'Công viên Hội thoại',
    description: 'Trò chuyện cùng NPC qua các tình huống có thể chơi hoàn toàn offline.',
    accent: '#15803d',
    pale: '#f0fdf4',
  },
};

function speakChinese(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const percentage = total === 0 ? 0 : Math.min(100, Math.round((value / total) * 100));
  return (
    <div className="h-3 w-full overflow-hidden border-2 border-[#1f2937] bg-white" aria-label={`Đã thuộc ${value} trên ${total} từ`}>
      <div className="h-full bg-[#16a34a] transition-[width] duration-300" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export default function OpenWorldGame({ playerName, avatarConfig, score, coins, onAvatarChange, onEnterBoba, onLogout, onReward }: OpenWorldGameProps) {
  const [screen, setScreen] = useState<WorldScreen>('town');
  const [previousScreen, setPreviousScreen] = useState<WorldScreen>('town');
  const [progress, setProgress] = useState<OpenWorldProgress>(DEFAULT_PROGRESS);
  const [isOnline, setIsOnline] = useState(true);
  const [search, setSearch] = useState('');
  const [hskFilter, setHskFilter] = useState<number | 'all'>('all');
  const [zoneFilter, setZoneFilter] = useState<LearningZone | 'all'>('all');
  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(saved) as OpenWorldProgress });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      setIsOnline(window.navigator.onLine);
    }, 0);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.clearTimeout(loadTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const filteredNotebookWords = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('vi');
    return WORLD_VOCAB.filter((item) => {
      const matchesSearch = !normalizedSearch || [item.chinese, item.pinyin, item.vietnamese]
        .some((value) => value.toLocaleLowerCase('vi').includes(normalizedSearch));
      return matchesSearch && (hskFilter === 'all' || item.hsk === hskFilter) && (zoneFilter === 'all' || item.zone === zoneFilter);
    });
  }, [hskFilter, search, zoneFilter]);

  const navigate = (next: WorldScreen) => {
    setPreviousScreen(screen);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderHeader = () => (
    <header className="world-header">
      <button type="button" onClick={() => navigate('town')} className="world-brand" aria-label="Về bản đồ thị trấn">
        <span className="world-brand-mark" aria-hidden="true">汉</span>
        <span>
          <strong>HSK Pixel Town</strong>
          <small>Học tiếng Trung trong từng chuyến đi</small>
        </span>
      </button>

      <div className="world-stats" aria-label="Tiến trình người chơi">
        <span><small>Điểm</small><strong>{score}</strong></span>
        <span><small>Xu</small><strong>{coins}</strong></span>
        <span><small>Chuỗi</small><strong>{progress.streak}</strong></span>
      </div>

      <nav className="world-actions" aria-label="Công cụ">
        <span className={`network-status ${isOnline ? 'is-online' : ''}`} title={isOnline ? 'Có kết nối mạng' : 'Đang chơi offline'}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        <button type="button" onClick={() => navigate('wardrobe')} className="world-nav-button world-nav-with-icon"><WardrobeIcon /> Tủ đồ</button>
        <button type="button" onClick={() => navigate('notebook')} className="world-nav-button">Sổ từ ({progress.masteredIds.length})</button>
        <button type="button" onClick={onLogout} className="world-icon-button" title="Đăng xuất" aria-label="Đăng xuất"><LogoutIcon /></button>
      </nav>
    </header>
  );

  const renderTown = () => (
    <>
      {renderHeader()}
      <section className="town-game-stage" aria-label={'Thị trấn của ' + playerName}>
        <PhaserTown
          avatar={avatarConfig}
          onEnter={(destination) => {
            if (destination === 'boba') onEnterBoba();
            else navigate(destination);
          }}
        />
        <div className="town-player-status">
          <span>Xin chào, {playerName}</span>
          <strong>{progress.masteredIds.length}/{WORLD_VOCAB.length} từ đã gặp</strong>
        </div>
      </section>
    </>
  );

  const renderMission = (zone: LearningZone) => {
    const zoneWords = WORLD_VOCAB.filter((item) => item.zone === zone);
    const currentWord = zoneWords[progress.zoneWins[zone] % zoneWords.length];
    const meta = ZONE_META[zone];

    return (
      <>
        {renderHeader()}
        <section className="zone-banner" style={{ '--zone-accent': meta.accent, '--zone-pale': meta.pale } as React.CSSProperties}>
          <button type="button" onClick={() => navigate('town')} className="back-button" aria-label="Về thị trấn"><ArrowLeftIcon /></button>
          <div>
            <p className="world-eyebrow">{meta.eyebrow}</p>
            <h1>{meta.title}</h1>
            <p>{meta.description}</p>
          </div>
          <div className="zone-score"><small>Đã hoàn thành</small><strong>{progress.zoneWins[zone]}</strong><span>nhiệm vụ</span></div>
        </section>

        <div className="zone-layout">
          <section className="mission-stage conversation-mission-stage" style={{ '--zone-accent': meta.accent } as React.CSSProperties}>
            <ConversationEpisode
              zone={zone}
              onComplete={({ vocabIds, correctTurns }) => {
                setProgress((current) => {
                  const streak = current.streak + correctTurns;
                  return {
                    ...current,
                    masteredIds: [...new Set([...current.masteredIds, ...vocabIds])],
                    streak,
                    bestStreak: Math.max(current.bestStreak, streak),
                    totalCorrect: current.totalCorrect + correctTurns,
                    zoneWins: { ...current.zoneWins, [zone]: current.zoneWins[zone] + 1 },
                  };
                });
                onReward(75, 25);
              }}
            />
          </section>

          <aside className="learning-sidebar">
            <div className="sidebar-section">
              <span className="sidebar-label">Từ đang học</span>
              <strong className="sidebar-hanzi">{currentWord.chinese}</strong>
              <span className="sidebar-pinyin">{currentWord.pinyin}</span>
              <p>{currentWord.vietnamese}</p>
              <span className="hsk-chip">HSK {currentWord.hsk}</span>
            </div>
            <div className="sidebar-section">
              <span className="sidebar-label">Tiến độ khu vực</span>
              <ProgressBar value={zoneWords.filter((item) => progress.masteredIds.includes(item.id)).length} total={zoneWords.length} />
              <small>{zoneWords.filter((item) => progress.masteredIds.includes(item.id)).length}/{zoneWords.length} từ đã gặp</small>
            </div>
            <button type="button" className="sidebar-notebook" onClick={() => { setZoneFilter(zone); navigate('notebook'); }}>Mở sổ từ khu này</button>
          </aside>
        </div>
      </>
    );
  };

  const renderNotebook = () => (
    <>
      {renderHeader()}
      <section className="notebook-header">
        <button type="button" onClick={() => navigate(previousScreen === 'notebook' ? 'town' : previousScreen)} className="back-button" aria-label="Quay lại"><ArrowLeftIcon /></button>
        <div>
          <p className="world-eyebrow">Từ điển cá nhân offline</p>
          <h1>Sổ từ HSK</h1>
          <p>Tìm, lọc, nghe và ôn lại toàn bộ từ trong thị trấn.</p>
        </div>
        <div className="notebook-count"><strong>{filteredNotebookWords.length}</strong><span>từ phù hợp</span></div>
      </section>

      <section className="notebook-tools" aria-label="Bộ lọc từ vựng">
        <label>
          <span>Tìm từ</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Hán tự, pinyin hoặc nghĩa Việt..." />
        </label>
        <label>
          <span>Khu vực</span>
          <select value={zoneFilter} onChange={(event) => setZoneFilter(event.target.value as LearningZone | 'all')}>
            <option value="all">Tất cả khu vực</option>
            {(Object.keys(ZONE_LABELS) as LearningZone[]).map((zone) => <option key={zone} value={zone}>{ZONE_LABELS[zone]}</option>)}
          </select>
        </label>
        <label>
          <span>Trình độ</span>
          <select value={hskFilter} onChange={(event) => setHskFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))}>
            <option value="all">Tất cả HSK</option>
            {[1, 2, 3, 4, 5, 6].map((level) => <option key={level} value={level}>HSK {level}</option>)}
          </select>
        </label>
      </section>

      <section className="vocab-grid" aria-live="polite">
        {filteredNotebookWords.map((item) => {
          const mastered = progress.masteredIds.includes(item.id);
          return (
            <article key={item.id} className={mastered ? 'is-mastered' : ''}>
              <div className="vocab-card-top">
                <span>HSK {item.hsk} · {item.category}</span>
                {mastered && <strong>Đã gặp</strong>}
              </div>
              <button type="button" className="vocab-word" onClick={() => speakChinese(item.chinese)} aria-label={`Nghe từ ${item.chinese}`}>
                <strong>{item.chinese}</strong>
                <span>{item.pinyin}</span>
              </button>
              <p>{item.vietnamese}</p>
              <div className="vocab-example">
                <span>{item.example}</span>
                <small>{item.exampleVietnamese}</small>
              </div>
            </article>
          );
        })}
        {filteredNotebookWords.length === 0 && <p className="notebook-empty">Không có từ phù hợp với bộ lọc này.</p>}
      </section>
    </>
  );

  return (
    <main className={screen === 'town' ? 'open-world-shell is-town-screen' : 'open-world-shell'}>
      {screen === 'town' && renderTown()}
      {screen === 'wardrobe' && (
        <AvatarWardrobe
          avatar={avatarConfig}
          coins={coins}
          onChange={onAvatarChange}
          onSpend={(cost) => {
            if (coins < cost) return false;
            onReward(0, -cost);
            return true;
          }}
          onBack={() => navigate('town')}
        />
      )}
      {(screen === 'dimsum' || screen === 'market' || screen === 'park') && renderMission(screen)}
      {screen === 'notebook' && renderNotebook()}
    </main>
  );
}

