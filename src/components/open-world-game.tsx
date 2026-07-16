'use client';

import { useEffect, useMemo, useState } from 'react';
import '../app/open-world.css';
import { LearningZone, WORLD_VOCAB, WorldVocabWord, ZONE_LABELS } from '../data/open-world';
import { AvatarConfig } from '../data/avatar';
import AvatarWardrobe from './avatar-wardrobe';
import { ArrowLeftIcon, ArrowRightIcon, LogoutIcon, VolumeIcon, WardrobeIcon } from './ui-icons';
import TownExplorer from './town-explorer';

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

const NPCS = [
  { id: 'lin', name: 'Lín', chinese: '小林', color: '#16a34a', greeting: '今天天气真不错！你想做什么？', pinyin: 'Jīntiān tiānqì zhēn búcuò! Nǐ xiǎng zuò shénme?', translation: 'Hôm nay thời tiết đẹp thật! Bạn muốn làm gì?' },
  { id: 'mei', name: 'Měi', chinese: '小美', color: '#db2777', greeting: '你好！听说你正在学习汉语。', pinyin: 'Nǐ hǎo! Tīngshuō nǐ zhèngzài xuéxí Hànyǔ.', translation: 'Chào bạn! Nghe nói bạn đang học tiếng Trung.' },
  { id: 'bo', name: 'Bó', chinese: '阿博', color: '#7c3aed', greeting: '周末你有什么计划？', pinyin: 'Zhōumò nǐ yǒu shénme jìhuà?', translation: 'Cuối tuần bạn có kế hoạch gì?' },
];

const DIALOGUE_CHOICES = [
  { chinese: '我想在公园散步。', pinyin: 'Wǒ xiǎng zài gōngyuán sànbù.', vietnamese: 'Tôi muốn đi dạo trong công viên.', reply: '好主意！散步对身体很好。', replyPinyin: 'Hǎo zhǔyi! Sànbù duì shēntǐ hěn hǎo.' },
  { chinese: '我每天学习半个小时。', pinyin: 'Wǒ měitiān xuéxí bàn ge xiǎoshí.', vietnamese: 'Tôi học mỗi ngày nửa tiếng.', reply: '坚持下去，你一定会进步！', replyPinyin: 'Jiānchí xiàqù, nǐ yídìng huì jìnbù!' },
  { chinese: '我计划和朋友去旅行。', pinyin: 'Wǒ jìhuà hé péngyou qù lǚxíng.', vietnamese: 'Tôi dự định đi du lịch với bạn.', reply: '听起来很棒，祝你玩得开心！', replyPinyin: 'Tīng qǐlái hěn bàng, zhù nǐ wán de kāixīn!' },
];

function speakChinese(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function NpcAvatar({ color = '#f59e0b', small = false }: { color?: string; small?: boolean }) {
  const size = small ? 'h-12 w-12' : 'h-16 w-16';
  return (
    <svg viewBox="0 0 64 64" className={`${size} pixelated`} aria-hidden="true">
      <rect x="20" y="6" width="24" height="8" fill="#422006" />
      <rect x="16" y="14" width="32" height="24" fill="#fed7aa" stroke="#111827" strokeWidth="3" />
      <rect x="21" y="22" width="5" height="5" fill="#111827" />
      <rect x="38" y="22" width="5" height="5" fill="#111827" />
      <rect x="28" y="31" width="8" height="3" fill="#be123c" />
      <rect x="16" y="38" width="32" height="20" fill={color} stroke="#111827" strokeWidth="3" />
      <rect x="10" y="42" width="6" height="14" fill="#fed7aa" stroke="#111827" strokeWidth="3" />
      <rect x="48" y="42" width="6" height="14" fill="#fed7aa" stroke="#111827" strokeWidth="3" />
      <rect x="20" y="58" width="9" height="5" fill="#111827" />
      <rect x="35" y="58" width="9" height="5" fill="#111827" />
    </svg>
  );
}

function SpeakerButton({ text, label = 'Nghe đọc' }: { text: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => speakChinese(text)}
      className="inline-flex min-h-10 items-center justify-center gap-2 border-2 border-[#1f2937] bg-white px-3 py-2 text-xs font-black shadow-[2px_2px_0_#1f2937] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
      aria-label={`${label}: ${text}`}
    >
      <VolumeIcon /> {label}
    </button>
  );
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
  const [roundByZone, setRoundByZone] = useState<Record<LearningZone, number>>({ dimsum: 0, market: 0, park: 0 });
  const [answered, setAnswered] = useState<string | null>(null);
  const [progress, setProgress] = useState<OpenWorldProgress>(DEFAULT_PROGRESS);
  const [isOnline, setIsOnline] = useState(true);
  const [search, setSearch] = useState('');
  const [hskFilter, setHskFilter] = useState<number | 'all'>('all');
  const [zoneFilter, setZoneFilter] = useState<LearningZone | 'all'>('all');
  const [selectedNpc, setSelectedNpc] = useState(0);
  const [dialogueChoice, setDialogueChoice] = useState<number | null>(null);
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
    setAnswered(null);
    setDialogueChoice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markAnswer = (zone: LearningZone, currentWord: WorldVocabWord, answer: string) => {
    if (answered) return;
    setAnswered(answer);
    if (answer !== currentWord.id) {
      setProgress((current) => ({ ...current, streak: 0 }));
      return;
    }

    setProgress((current) => {
      const streak = current.streak + 1;
      return {
        ...current,
        masteredIds: current.masteredIds.includes(currentWord.id)
          ? current.masteredIds
          : [...current.masteredIds, currentWord.id],
        streak,
        bestStreak: Math.max(current.bestStreak, streak),
        totalCorrect: current.totalCorrect + 1,
        zoneWins: { ...current.zoneWins, [zone]: current.zoneWins[zone] + 1 },
      };
    });
    onReward(25, 8);
    speakChinese(currentWord.example);
  };

  const nextRound = (zone: LearningZone) => {
    setRoundByZone((current) => ({ ...current, [zone]: current[zone] + 1 }));
    setAnswered(null);
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
      <section className="town-intro">
        <div>
          <p className="world-eyebrow">Xin chào, {playerName}</p>
          <h1>Hôm nay mình ghé đâu?</h1>
          <p>Mỗi nơi là một chủ đề HSK khác nhau. Nhiệm vụ và tiến trình đều được lưu trên máy để bạn tiếp tục học khi không có mạng.</p>
        </div>
        <div className="town-mastery">
          <span><strong>{progress.masteredIds.length}</strong> / {WORLD_VOCAB.length} từ đã gặp</span>
          <ProgressBar value={progress.masteredIds.length} total={WORLD_VOCAB.length} />
          <small>Chuỗi tốt nhất: {progress.bestStreak} câu đúng</small>
        </div>
      </section>

      <TownExplorer
        playerName={playerName}
        avatar={avatarConfig}
        zoneWins={progress.zoneWins}
        onEnter={(destination) => {
          if (destination === 'boba') onEnterBoba();
          else navigate(destination);
        }}
      />

      <section className="town-destinations" aria-label="Chọn nhanh địa điểm">
        {(Object.keys(ZONE_META) as LearningZone[]).map((zone) => (
          <button key={zone} type="button" onClick={() => navigate(zone)} style={{ '--zone-accent': ZONE_META[zone].accent } as React.CSSProperties}>
            <span>{ZONE_META[zone].eyebrow}</span>
            <strong>{ZONE_META[zone].title}</strong>
            <small>{WORLD_VOCAB.filter((item) => item.zone === zone).length} từ đang chờ</small>
          </button>
        ))}
      </section>
    </>
  );

  const renderMission = (zone: LearningZone) => {
    const zoneWords = WORLD_VOCAB.filter((item) => item.zone === zone);
    const round = roundByZone[zone];
    const currentWord = zoneWords[round % zoneWords.length];
    const reverseQuestion = round % 3 === 2;
    const optionWords = [
      currentWord,
      zoneWords[(round + 5) % zoneWords.length],
      zoneWords[(round + 11) % zoneWords.length],
      zoneWords[(round + 17) % zoneWords.length],
    ].filter((item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index);
    const orderedOptions = [...optionWords].sort((a, b) => (a.id.charCodeAt(a.id.length - 1) + round) % 5 - (b.id.charCodeAt(b.id.length - 1) + round) % 5);
    const correct = answered === currentWord.id;
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

        {zone === 'park' && (
          <section className="npc-strip" aria-label="Nhân vật trong công viên">
            {NPCS.map((npc, index) => (
              <button key={npc.id} type="button" className={selectedNpc === index ? 'is-selected' : ''} onClick={() => { setSelectedNpc(index); setDialogueChoice(null); }}>
                <NpcAvatar color={npc.color} small />
                <span><strong>{npc.chinese} · {npc.name}</strong><small>Chạm để trò chuyện</small></span>
              </button>
            ))}
          </section>
        )}

        <div className="zone-layout">
          <section className="mission-stage" style={{ '--zone-accent': meta.accent } as React.CSSProperties}>
            <div className="mission-topline">
              <span>Nhiệm vụ {round + 1}</span>
              <span>+25 điểm · +8 xu</span>
            </div>

            {zone === 'park' ? (
              <div className="conversation-scene">
                <div className="npc-speaker">
                  <NpcAvatar color={NPCS[selectedNpc].color} />
                  <div>
                    <span>{NPCS[selectedNpc].chinese}</span>
                    <strong>{NPCS[selectedNpc].greeting}</strong>
                    <small>{NPCS[selectedNpc].pinyin}</small>
                    <p>{NPCS[selectedNpc].translation}</p>
                  </div>
                </div>
                <SpeakerButton text={NPCS[selectedNpc].greeting} label="Nghe NPC" />
                <div className="dialogue-options">
                  {DIALOGUE_CHOICES.map((choice, index) => (
                    <button
                      key={choice.chinese}
                      type="button"
                      onClick={() => {
                        setDialogueChoice(index);
                        speakChinese(choice.chinese);
                        if (dialogueChoice === null) {
                          markAnswer('park', currentWord, currentWord.id);
                        }
                      }}
                      className={dialogueChoice === index ? 'is-selected' : ''}
                    >
                      <strong>{choice.chinese}</strong>
                      <span>{choice.pinyin}</span>
                      <small>{choice.vietnamese}</small>
                    </button>
                  ))}
                </div>
                {dialogueChoice !== null && (
                  <div className="npc-reply" role="status">
                    <strong>{NPCS[selectedNpc].chinese}:</strong> {DIALOGUE_CHOICES[dialogueChoice].reply}
                    <small>{DIALOGUE_CHOICES[dialogueChoice].replyPinyin}</small>
                    <button type="button" onClick={() => { setDialogueChoice(null); nextRound('park'); }}><span>Nói tiếp</span><ArrowRightIcon /></button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mission-customer">
                  <NpcAvatar color={zone === 'dimsum' ? '#dc2626' : '#2563eb'} />
                  <div className="mission-bubble">
                    <span>{zone === 'dimsum' ? 'Khách gọi món' : 'Danh sách mua hàng'}</span>
                    <strong>{reverseQuestion ? currentWord.vietnamese : currentWord.chinese}</strong>
                    {!reverseQuestion && <small>{currentWord.pinyin}</small>}
                    <SpeakerButton text={currentWord.chinese} />
                  </div>
                </div>

                <p className="mission-prompt">
                  {reverseQuestion ? 'Chọn từ tiếng Trung đúng:' : zone === 'dimsum' ? 'Chọn đúng món hoặc thao tác:' : 'Tìm đúng mặt hàng hoặc cụm từ:'}
                </p>
                <div className="mission-options">
                  {orderedOptions.map((option) => {
                    const isChosen = answered === option.id;
                    const isCorrect = option.id === currentWord.id;
                    const answerClass = answered ? (isCorrect ? 'is-correct' : isChosen ? 'is-wrong' : 'is-muted') : '';
                    return (
                      <button key={option.id} type="button" onClick={() => markAnswer(zone, currentWord, option.id)} className={answerClass} disabled={Boolean(answered)}>
                        <strong>{reverseQuestion ? option.chinese : option.vietnamese}</strong>
                        <small>{reverseQuestion ? option.pinyin : option.category}</small>
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className={`answer-feedback ${correct ? 'is-correct' : 'is-wrong'}`} role="status">
                    <div>
                      <strong>{correct ? 'Chính xác!' : `Đáp án: ${currentWord.chinese} · ${currentWord.vietnamese}`}</strong>
                      <span>{currentWord.example}</span>
                      <small>{currentWord.exampleVietnamese}</small>
                    </div>
                    <button type="button" onClick={() => nextRound(zone)}><span>Nhiệm vụ tiếp</span><ArrowRightIcon /></button>
                  </div>
                )}
              </>
            )}
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
    <main className="open-world-shell">
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

