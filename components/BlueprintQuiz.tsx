import React, { useState, useEffect } from 'react';
import { FurnitureItem, FURNITURE_ITEMS, GENERAL_VOCAB_ITEMS, GeneralVocabItem } from '../data/vocabulary';
import { renderFurnitureSVG } from './RoomEditor';
import { getBookmarkedIds, toggleBookmark } from '../lib/bookmarksAndStreak';

interface BlueprintQuizProps {
  unlockedItems: string[];
  setUnlockedItems: React.Dispatch<React.SetStateAction<string[]>>;
  coins: number;
  setCoins: (c: number) => void;
  playSfx: (type: 'click' | 'success' | 'error' | 'perfect' | 'levelUp' | 'flip') => void;
  onExplainWord: (word: string) => void;
  customVocabs?: any[];
  isDarkMode?: boolean;
  userInventory?: {
    powerup_5050: number;
    powerup_skip: number;
    blueprint_rare: number;
  };
  setUserInventory?: React.Dispatch<React.SetStateAction<any>>;
  onClose?: () => void;
}

function renderXIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function renderStarIcon(isFilled: boolean, className = 'w-5 h-5') {
  return (
    <svg className={className} fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

interface Question {
  type: 'translate' | 'pinyin' | 'listening';
  item: FurnitureItem | GeneralVocabItem;
  questionText: string;
  chinese: string;
  pinyin: string;
  translation: string;
  hskLevel: number; // 1-6
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

function renderSparklesIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.904L9 9l.813 5.096L15 15l-5.187.904zM19.071 4.929l-.707 2.122-2.122.707 2.122.707.707 2.122.707-2.122 2.122-.707-2.122-.707-.707-2.122z" />
    </svg>
  );
}

function renderBookOpenIcon(className = 'w-5 h-5 text-pink-500') {
  const combinedClass = className.includes('w-') ? className : `w-5 h-5 ${className}`;
  return (
    <svg className={combinedClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function renderFlameIcon(className = 'w-4.5 h-4.5') {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22C16.4183 22 20 18.4183 20 14C20 10.3 17.5 7.2 14 5.7C14 8.5 11.5 10 10 11C8.5 12 7.5 13 7.5 15C7.5 15.5 7.7 16 8 16.5C6.8 15.7 6 14.4 6 13C4.8 14.5 4 16.4 4 18.5C4 20.4 5.6 22 7.5 22C8 22 9.5 21.5 10.5 20.5C10 20 9.5 19.3 9.5 18.5C9.5 17.1 10.6 16 12 16C13.4 16 14.5 17.1 14.5 18.5C14.5 19.5 13.9 20.4 13 21C14 21.8 15.4 22 17 22"
        fill="url(#flame-grad-ielts)"
      />
      <defs>
        <linearGradient id="flame-grad-ielts" x1="12" y1="4" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF4D4D" />
          <stop offset="0.5" stopColor="#FF8000" />
          <stop offset="1" stopColor="#FFCC00" />
        </linearGradient>
      </defs>
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

function renderAwardIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function renderAIIcon(className = 'w-3.5 h-3.5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function renderVocabularyCardSVG(className = 'w-16 h-16 text-pink-100') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

export default function BlueprintQuiz({
  unlockedItems,
  setUnlockedItems,
  coins,
  setCoins,
  playSfx,
  onExplainWord,
  customVocabs,
  isDarkMode,
  userInventory,
  setUserInventory,
  onClose,
}: BlueprintQuizProps) {
  const [quizMode, setQuizMode] = useState<'furniture' | 'general' | 'custom'>('furniture');
  const [selectedHskFilter, setSelectedHskFilter] = useState<number | 'all'>('all');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

  const handleUse5050 = () => {
    if (isAnswered || !currentQuestion) return;
    if (coins < 20) {
      alert('Bạn cần ít nhất 20 Xu để dùng Thẻ trợ giúp 50:50!');
      playSfx('error');
      return;
    }

    setCoins(coins - 20);
    playSfx('click');

    const wrongOptions = currentQuestion.options.filter(o => o !== currentQuestion.correctAnswer);
    const shuffledWrong = [...wrongOptions].sort(() => 0.5 - Math.random());
    setDisabledOptions(shuffledWrong.slice(0, 2));
  };

  const handleUseSkip = () => {
    if (isAnswered || !currentQuestion) return;
    if (coins < 30) {
      alert('Bạn cần ít nhất 30 Xu để dùng Thẻ Bỏ Qua câu hỏi!');
      playSfx('error');
      return;
    }

    setCoins(coins - 30);
    playSfx('success');
    handleAnswerSubmit(currentQuestion.correctAnswer);
  };

  useEffect(() => {
    setBookmarkedIds(getBookmarkedIds());
  }, []);

  const handleToggleBookmark = (wordId: string) => {
    const res = toggleBookmark(wordId);
    setBookmarkedIds(res.allIds);
    playSfx('click');
  };

  // AI custom quiz states
  const [customThemeSelect, setCustomThemeSelect] = useState('all_themes');
  const [customManualInput, setCustomManualInput] = useState('');
  const [customTheme, setCustomTheme] = useState('Tất cả các chủ đề HSK');
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);
  const [customQuestionIndex, setCustomQuestionIndex] = useState(0);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  // Phân bổ HSK cho từ vựng nội thất
  const getHskLevel = (itemId: string): number => {
    const levels: { [key: string]: number } = {
      wood_chair: 1,
      wood_table: 1,
      mirror: 1,
      study_desk: 2,
      single_bed: 2,
      desk_lamp: 2,
      painting: 2,
      office_chair: 2,
      potted_plant: 2,
      double_bed: 3,
      sofa: 3,
      coffee_table: 3,
      bookshelf: 3,
      carpet: 3,
      cactus: 3,
      floor_lamp: 3,
      sofa_bed: 3,
      wardrobe: 3,
      bamboo: 3,
      chandelier: 3,
    };
    return levels[itemId] || 1;
  };

  // Tạo câu hỏi ngẫu nhiên dựa trên chế độ học tập
  const generateQuestion = () => {
    let randomItem: FurnitureItem | GeneralVocabItem;
    let hskLevel = 1;
    const rawPool = [...GENERAL_VOCAB_ITEMS, ...(customVocabs || [])];
    const seenNames = new Set<string>();
    const dynamicGeneralVocabPool = rawPool.filter(item => {
      const name = item.nameChinese ? item.nameChinese.trim() : '';
      if (!name || seenNames.has(name)) return false;
      seenNames.add(name);
      return true;
    });
    
    if (quizMode === 'furniture') {
      const filteredPool = FURNITURE_ITEMS.filter((item) => {
        const hsk = getHskLevel(item.id);
        return selectedHskFilter === 'all' || hsk === selectedHskFilter;
      });

      if (filteredPool.length === 0) return;
      randomItem = filteredPool[Math.floor(Math.random() * filteredPool.length)];
      hskLevel = getHskLevel(randomItem.id);
    } else {
      const filteredPool = dynamicGeneralVocabPool.filter((item) => {
        return selectedHskFilter === 'all' || item.hskLevel === selectedHskFilter;
      });

      if (filteredPool.length === 0) return;
      randomItem = filteredPool[Math.floor(Math.random() * filteredPool.length)];
      hskLevel = (randomItem as GeneralVocabItem).hskLevel;
    }

    const types: ('translate' | 'pinyin' | 'listening')[] = ['translate', 'pinyin', 'listening'];
    const type = types[Math.floor(Math.random() * types.length)];

    let questionText = '';
    let correctAnswer = '';
    let options: string[] = [];

    const isFurniture = 'category' in randomItem;
    const cat = (randomItem as any).category || (randomItem as any).theme;

    const cleanStr = (str: string, c?: string) => {
      if (!str) return str;
      let s = str;
      const categories = [
        'Mua sắm & Shopping', 'Ẩm thực & Đi ăn tiệm', 'Màu sắc & Thiết kế',
        'Thời tiết & Thời gian', 'Gia đình & Nhà cửa', 'Phương hướng & Vị trí',
        'Sở thích & Hẹn hò', 'Động vật & Thú cưng', 'Học tập & Trường học',
        'Công việc & Văn phòng', 'Giao thông & Du lịch', 'Kiến trúc & Nội thất',
        'Cảm xúc & Mô tả', 'Giải trí & Thể thao', c
      ].filter(Boolean);
      for (const catName of categories) {
        if (!catName) continue;
        const esc = catName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        s = s.replace(new RegExp(`\\s*[-:：]?\\s*${esc}\\s*`, 'gi'), '').trim();
      }
      return s.trim();
    };

    const cleanChineseStr = (str: string, c?: string) => {
      let s = cleanStr(str, c);
      const m = s.match(/^[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]+/);
      return m ? m[0].trim() : s;
    };

    const itemVietnameseName = cleanStr(isFurniture ? randomItem.nameVietnamese : (randomItem as GeneralVocabItem).nameVietnamese, cat);
    const itemChineseName = cleanChineseStr(randomItem.nameChinese, cat);
    const itemPinyinName = cleanStr(randomItem.namePinyin, cat);

    if (type === 'translate') {
      questionText = `Hãy chọn chữ Hán chính xác cho từ: "${itemVietnameseName}"`;
      correctAnswer = itemChineseName;
      
      const pool = isFurniture ? FURNITURE_ITEMS : dynamicGeneralVocabPool;
      const distractors = pool.filter((i) => i.id !== randomItem.id)
        .map((i) => cleanChineseStr(i.nameChinese, (i as any).category || (i as any).theme))
        .filter((val) => val !== correctAnswer)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      options = Array.from(new Set([correctAnswer, ...distractors])).sort(() => 0.5 - Math.random());
    } else if (type === 'pinyin') {
      questionText = `Chọn phiên âm Pinyin của: "${itemChineseName}"`;
      correctAnswer = itemPinyinName;

      const pool = isFurniture ? FURNITURE_ITEMS : dynamicGeneralVocabPool;
      const distractors = pool.filter((i) => i.id !== randomItem.id)
        .map((i) => cleanStr(i.namePinyin, (i as any).category || (i as any).theme))
        .filter((val) => val !== correctAnswer)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      options = Array.from(new Set([correctAnswer, ...distractors])).sort(() => 0.5 - Math.random());
    } else {
      questionText = 'Nghe phát âm tiếng Trung sau đây và chọn đáp án tương ứng:';
      correctAnswer = itemVietnameseName;

      const pool = isFurniture ? FURNITURE_ITEMS : dynamicGeneralVocabPool;
      const distractors = pool.filter((i) => i.id !== randomItem.id)
        .map((i) => cleanStr(i.nameVietnamese, (i as any).category || (i as any).theme))
        .filter((val) => val !== correctAnswer)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      options = Array.from(new Set([correctAnswer, ...distractors])).sort(() => 0.5 - Math.random());
    }

    setCurrentQuestion({
      type,
      item: randomItem,
      questionText,
      chinese: itemChineseName,
      pinyin: itemPinyinName,
      translation: itemVietnameseName,
      hskLevel,
      options,
      correctAnswer,
    });
    setSelectedAnswer(null);
    setIsAnswered(false);
    setDisabledOptions([]);

    if (type === 'listening') {
      playAudio(itemChineseName);
    }
  };

  const generateLocalCustomQuestions = (theme: string) => {
    const t = theme.trim();
    return [
      {
        chinese: `我想去${t}`,
        pinyin: `Wǒ xiǎng qù ${t}`,
        translation: `Tôi muốn đi ${t}`,
        options: [
          `Tôi muốn đi ${t}`,
          `Tôi không thích ${t}`,
          `Hôm nay trời rất ${t}`,
          `Bạn có ${t} không?`
        ],
        explanation: `Mẫu câu "我想去..." dùng để diễn đạt mong muốn đến đâu hoặc làm gì đó liên quan tới ${t}.`
      },
      {
        chinese: `一起去${t}吧！`,
        pinyin: `Yìqǐ qù ${t} ba!`,
        translation: `Cùng đi ${t} nhé!`,
        options: [
          `Cùng đi ${t} nhé!`,
          `Tôi vừa đi ${t} về`,
          `Ngày mai không đi ${t}`,
          `${t} rất đắt tiền`
        ],
        explanation: `Mẫu câu "一起...吧" là lời rủ rê cực kỳ thân thiện để cùng làm điều gì đó!`
      },
      {
        chinese: `${t}非常有趣`,
        pinyin: `${t} fēicháng yǒuqù`,
        translation: `${t} rất thú vị`,
        options: [
          `${t} rất thú vị`,
          `${t} rất chán`,
          `${t} quá khó`,
          `${t} ở rất xa`
        ],
        explanation: `"非常" (fēicháng) nghĩa là rất, cực kỳ; "有趣" (yǒuqù) có nghĩa là thú vị.`
      },
      {
        chinese: `你喜欢${t}吗？`,
        pinyin: `Nǐ xǐhuān ${t} ma?`,
        translation: `Bạn có thích ${t} không?`,
        options: [
          `Bạn có thích ${t} không?`,
          `Bạn đã đi ${t} chưa?`,
          `Khi nào bạn đi ${t}?`,
          `Ai muốn đi ${t}?`
        ],
        explanation: `Mẫu câu hỏi ngỏ "喜欢...吗" là cấu trúc hỏi sở thích cơ bản và thông dụng nhất HSK.`
      },
      {
        chinese: `今天我们${t}`,
        pinyin: `Jīntiān wǒmen ${t}`,
        translation: `Hôm nay chúng ta ${t}`,
        options: [
          `Hôm nay chúng ta ${t}`,
          `Ngày mai chúng ta ${t}`,
          `Hôm qua họ đã ${t}`,
          `Tuần sau anh ấy ${t}`
        ],
        explanation: `"今天" (jīntiān) là hôm nay, "我们" (wǒmen) là chúng ta.`
      }
    ];
  };

  const startCustomQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTheme.trim() || customLoading) return;

    setCustomLoading(true);
    setCustomError(null);
    playSfx('click');

    try {
      let questionsList: any[] = [];
      try {
        const res = await fetch('/api/ai/quiz/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: customTheme, hskLevel: 1 })
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          questionsList = data.questions;
        } else {
          questionsList = generateLocalCustomQuestions(customTheme);
        }
      } catch (e) {
        questionsList = generateLocalCustomQuestions(customTheme);
      }

      setCustomQuestions(questionsList);
      setCustomQuestionIndex(0);
      
      const q = questionsList[0];
      setCurrentQuestion({
        type: 'translate',
        item: { id: 'custom_vocab', nameChinese: q.chinese, namePinyin: q.pinyin, nameVietnamese: q.translation, hskLevel: 1 },
        questionText: `Dịch nghĩa chính xác của từ/câu: "${q.chinese}"`,
        chinese: q.chinese,
        pinyin: q.pinyin,
        translation: q.translation,
        hskLevel: 1,
        options: q.options,
        correctAnswer: q.translation,
        explanation: q.explanation
      } as any);
      
      setSelectedAnswer(null);
      setIsAnswered(false);
      playSfx('perfect');
    } catch (err: any) {
      setCustomError('Có lỗi xảy ra, vui lòng thử lại!');
      playSfx('error');
    } finally {
      setCustomLoading(false);
    }
  };

  const handleContinue = () => {
    if (quizMode === 'custom') {
      const nextIdx = customQuestionIndex + 1;
      if (nextIdx < customQuestions.length) {
        setCustomQuestionIndex(nextIdx);
        const q = customQuestions[nextIdx];
        setCurrentQuestion({
          type: 'translate',
          item: { id: 'custom_vocab', nameChinese: q.chinese, namePinyin: q.pinyin, nameVietnamese: q.translation, hskLevel: 1 },
          questionText: `Dịch nghĩa chính xác của từ/câu: "${q.chinese}"`,
          chinese: q.chinese,
          pinyin: q.pinyin,
          translation: q.translation,
          hskLevel: 1,
          options: q.options,
          correctAnswer: q.translation,
          explanation: q.explanation
        } as any);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setCurrentQuestion(null);
        setCustomQuestions([]);
        setCustomQuestionIndex(0);
        playSfx('perfect');
        alert('Chúc mừng Vy đã hoàn thành xuất sắc bộ câu hỏi HSK Custom từ AI!');
      }
    } else {
      generateQuestion();
    }
  };

  useEffect(() => {
    if (quizMode !== 'custom') {
      generateQuestion();
    } else {
      setCurrentQuestion(null);
      setCustomQuestions([]);
      setCustomQuestionIndex(0);
    }
  }, [selectedHskFilter, quizMode]);

  const playAudio = (text: string) => {
    playSfx('click');
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(text)}&lang=zh`);
    audio.play().catch((e) => console.warn('Audio output error:', e));
  };

  const handleAnswerSubmit = (option: string) => {
    if (isAnswered || !currentQuestion) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      playSfx('success');
      setStreak((prev) => prev + 1);
      
      if (quizMode === 'furniture') {
        setCoins(coins + 20);
        if (!unlockedItems.includes(currentQuestion.item.id)) {
          setUnlockedItems((prev) => [...prev, currentQuestion.item.id]);
          playSfx('levelUp');
        }
      } else if (quizMode === 'custom') {
        setCoins(coins + 20);
      } else {
        setCoins(coins + 15);
      }
    } else {
      playSfx('error');
      setStreak(0);
    }
  };

  return (
    <div className={`border-4 rounded-2xl shadow-[4px_4px_0px_#1f2937] p-4 sm:p-6 max-w-2xl mx-auto my-4 transition-colors ${
      isDarkMode ? 'bg-[#1e293b] text-slate-100 border-slate-700' : 'bg-[#fff0f3] text-[#1f2937] border-[#1f2937]'
    }`}>
      {/* CHUYỂN ĐỔI CHẾ ĐỘ CHƠI */}
      <div className="flex justify-center gap-3 mb-6 flex-wrap sm:flex-nowrap">
        <button
          onClick={() => {
            setQuizMode('general');
            setStreak(0);
            playSfx('flip');
          }}
          className={`flex-1 py-2.5 border-2 border-[#1f2937] font-mono font-black text-xs uppercase rounded-xl shadow-[2px_2px_0px_#1f2937] transition-all cursor-pointer ${
            quizMode === 'general'
              ? 'bg-blue-600 text-white shadow-none translate-y-0.5'
              : 'bg-white text-[#1f2937]'
          }`}
        >
          Từ Vựng HSK 1 đến HSK 6 (Full Database)
        </button>
        <button
          onClick={() => {
            setQuizMode('furniture');
            setStreak(0);
            playSfx('flip');
          }}
          className={`flex-1 py-2.5 border-2 border-[#1f2937] font-mono font-black text-xs uppercase rounded-xl shadow-[2px_2px_0px_#1f2937] transition-all cursor-pointer ${
            quizMode === 'furniture'
              ? 'bg-blue-600 text-white shadow-none translate-y-0.5'
              : 'bg-white text-[#1f2937]'
          }`}
        >
          Nội Thất Pixel HSK
        </button>
      </div>

      {/* TIÊU ĐỀ */}
      <h2 className="text-xl font-serif font-black text-slate-900 dark:text-slate-100 border-b border-dashed border-slate-200 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5">{renderBookOpenIcon('text-rose-500')} Bản Vẽ Chế Tạo HSK</span>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800 px-3 py-1 rounded-full font-mono font-bold flex items-center gap-1.5 shadow-xs" title={`Chuỗi trả lời đúng liên tiếp: ${streak}`}>
            {renderFlameIcon('w-4 h-4 text-amber-500 animate-pulse')}
            <span>{streak}</span>
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white border-2 border-[#1f2937] rounded-xl shadow-[2px_2px_0px_#1f2937] flex items-center justify-center font-black text-xs cursor-pointer transition active:scale-95 shrink-0"
              title="Thoát chế độ Quiz"
            >
              {renderXIcon('w-4 h-4 text-white')}
            </button>
          )}
        </div>
      </h2>

      {/* BỘ LỌC CẤP ĐỘ HSK 1 - 6 */}
      {quizMode !== 'custom' && (
        <div className="flex gap-1.5 mb-6 flex-wrap">
          <span className="text-xs font-black text-gray-500 uppercase self-center mr-2">Cấp độ HSK:</span>
          {['all', 1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={level}
              onClick={() => {
                setSelectedHskFilter(level === 'all' ? 'all' : Number(level));
                playSfx('click');
              }}
              className={`px-3 py-1 border-2 border-[#1f2937] font-black text-xs rounded-lg shadow-[1px_1px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                selectedHskFilter === (level === 'all' ? 'all' : Number(level))
                  ? 'bg-pink-500 text-white shadow-none translate-y-0.5'
                  : 'bg-white text-[#1f2937]'
              }`}
            >
              {level === 'all' ? 'Tất cả' : `HSK ${level}`}
            </button>
          ))}
        </div>
      )}

      {currentQuestion && (
        <div className="space-y-4">
          {/* THẺ HEADING COMPACT HSK */}
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                {renderBookOpenIcon('w-5 h-5 text-rose-500')}
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                  Bản Vẽ Thử Thách HSK
                </span>
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  {'category' in currentQuestion.item ? 'Chủ đề: Nội Thất Pixel' : 'Chủ đề: Từ Vựng HSK'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleBookmark(currentQuestion.item.id)}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                  bookmarkedIds.includes(currentQuestion.item.id)
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-500 border-amber-400'
                    : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-300 dark:border-slate-700 hover:text-amber-500'
                }`}
                title={bookmarkedIds.includes(currentQuestion.item.id) ? 'Bỏ lưu từ khó' : 'Lưu vào Sổ từ khó ôn tập'}
              >
                {renderStarIcon(bookmarkedIds.includes(currentQuestion.item.id), 'w-4 h-4')}
              </button>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                HSK Cấp {currentQuestion.hskLevel}
              </span>
            </div>
          </div>

          {/* CÂU HỎI */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs text-center space-y-2 text-slate-900 dark:text-slate-100">
            <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-sans">
              Thử Thách HSK {currentQuestion.hskLevel}
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 pt-1">
              {currentQuestion.type === 'listening' ? (
                <div className="flex items-center justify-center gap-2">
                  <span>Nghe phát âm tiếng Trung:</span>
                  <button
                    onClick={() => playAudio(currentQuestion.chinese)}
                    className="p-2 bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 border border-rose-200 dark:border-slate-700 rounded-xl cursor-pointer transition-all active:scale-95"
                    title="Nghe phát âm tiếng Trung"
                  >
                    {renderAudioIcon('w-5 h-5 text-rose-600 dark:text-rose-400')}
                  </button>
                </div>
              ) : (
                <p>{currentQuestion.questionText}</p>
              )}
            </div>
          </div>

          {/* CÁC THẺ TRỢ GIÚP POWER-UPS: 50:50 VÀ BỎ QUA */}
          {!isAnswered && (
            <div className="flex items-center justify-end gap-2 text-xs font-mono font-bold my-1">
              <button
                type="button"
                onClick={handleUse5050}
                disabled={disabledOptions.length > 0}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs ${
                  disabledOptions.length > 0
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700 cursor-not-allowed'
                    : 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-800 hover:bg-pink-200 dark:hover:bg-pink-900/60'
                }`}
                title="Loại bỏ 2 đáp án sai"
              >
                <svg className="w-4 h-4 text-pink-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span>
                  Thẻ 50:50 {(userInventory?.powerup_5050 || 0) > 0 ? `(Túi đồ: x${userInventory?.powerup_5050})` : '(-20 Xu)'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleUseSkip}
                className="px-3 py-1.5 rounded-xl border bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/60 flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs"
                title="Bỏ qua câu hỏi này mà vẫn giữ chuỗi combo"
              >
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                <span>
                  Bỏ Qua {(userInventory?.powerup_skip || 0) > 0 ? `(Túi đồ: x${userInventory?.powerup_skip})` : '(-30 Xu)'}
                </span>
              </button>
            </div>
          )}

          {/* DANH SÁCH ĐÁP ÁN LỰA CHỌN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isDisabledBy5050 = disabledOptions.includes(option);
              let btnClass = 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-slate-800/80';
              if (isAnswered) {
                const isThisCorrect = option === currentQuestion.correctAnswer;
                const isThisSelected = option === selectedAnswer;

                if (isThisCorrect) {
                  btnClass = 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
                } else if (isThisSelected) {
                  btnClass = 'bg-rose-500 text-white border-rose-600 shadow-sm';
                } else {
                  btnClass = 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed';
                }
              } else if (isDisabledBy5050) {
                btnClass = 'bg-slate-100 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed line-through opacity-40';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSubmit(option)}
                  disabled={isAnswered || isDisabledBy5050}
                  className={`w-full py-3.5 px-4 border text-sm font-bold rounded-2xl transition-all cursor-pointer shadow-xs active:scale-98 ${btnClass}`}
                >
                  <span className="font-sans block text-base">{option}</span>
                </button>
              );
            })}
          </div>

          {/* PHẢN HỒI KẾT QUẢ VÀ GIẢI NGHĨA */}
          {isAnswered && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-3 text-slate-900 dark:text-slate-100">
              <div className="flex justify-between items-center">
                <span className={`text-xs sm:text-sm font-bold uppercase ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {isCorrect ? 'Chúc mừng! Bạn đã trả lời đúng' : 'Rất tiếc! Câu trả lời chưa chính xác'}
                </span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  {renderAwardIcon()} +{quizMode === 'furniture' ? '20' : quizMode === 'custom' ? '20' : '15'} Xu
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Chữ Hán: <span className="text-rose-600 dark:text-rose-400 text-base">{currentQuestion.chinese}</span>
                </p>
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">
                  Phiên âm Pinyin: <span className="text-blue-600 dark:text-blue-400">{currentQuestion.pinyin}</span>
                </p>
                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                  Nghĩa tiếng Việt: <span>{currentQuestion.translation}</span>
                </p>
              </div>

              {/* Lời giải thích từ AI */}
              {quizMode === 'custom' && currentQuestion.explanation && (
                <div className="p-3 bg-blue-50/40 border border-blue-200 rounded-lg text-left">
                  <h5 className="text-[10px] font-black uppercase text-blue-800 tracking-wider mb-1 flex items-center gap-1">
                    {renderSparklesIcon('w-3.5 h-3.5')} Lời Giải Thích Của AI Mỏ Hỗn (BETA):
                  </h5>
                  <p className="text-[11px] font-bold text-blue-900 leading-normal">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* Hàng hành động bổ trợ */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => onExplainWord(currentQuestion.chinese)}
                  className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 border border-[#1f2937] rounded-lg text-[10.5px] font-black uppercase tracking-wider text-blue-800 flex items-center gap-1 cursor-pointer transition-all shadow-[1px_1px_0px_#1f2937]"
                >
                  {renderAIIcon('w-3.5 h-3.5 text-blue-800')} Hỏi AI Mỏ Hỗn (BETA)
                </button>
                <button
                  onClick={handleContinue}
                  className="px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white border-2 border-[#1f2937] rounded-lg text-[10.5px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  {quizMode === 'custom' && customQuestionIndex < customQuestions.length - 1 ? 'Câu Tiếp Theo' : 'Tiếp Tục'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
