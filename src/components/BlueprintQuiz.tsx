'use client';

import React, { useState, useEffect } from 'react';
import { FurnitureItem, FURNITURE_ITEMS, GENERAL_VOCAB_ITEMS, GeneralVocabItem } from '../data/vocabulary';
import { renderFurnitureSVG } from './RoomEditor';

interface BlueprintQuizProps {
  unlockedItems: string[];
  setUnlockedItems: React.Dispatch<React.SetStateAction<string[]>>;
  coins: number;
  setCoins: (c: number) => void;
  playSfx: (type: 'click' | 'success' | 'error' | 'perfect' | 'levelUp' | 'flip') => void;
  onExplainWord: (word: string) => void;
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
}

function renderBookOpenIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
  onExplainWord
}: BlueprintQuizProps) {
  const [quizMode, setQuizMode] = useState<'furniture' | 'general'>('furniture');
  const [selectedHskFilter, setSelectedHskFilter] = useState<number | 'all'>('all');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);

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
      double_bed: 3,
      sofa: 3,
      coffee_table: 3,
      bookshelf: 3,
      carpet: 3,
      cactus: 4,
      office_chair: 4,
      floor_lamp: 4,
      potted_plant: 4,
      sofa_bed: 5,
      wardrobe: 5,
      bamboo: 5,
      chandelier: 6,
    };
    return levels[itemId] || 1;
  };

  // Tạo câu hỏi ngẫu nhiên dựa trên chế độ học tập
  const generateQuestion = () => {
    let randomItem: FurnitureItem | GeneralVocabItem;
    let hskLevel = 1;
    
    if (quizMode === 'furniture') {
      const filteredPool = FURNITURE_ITEMS.filter((item) => {
        const hsk = getHskLevel(item.id);
        return selectedHskFilter === 'all' || hsk === selectedHskFilter;
      });

      if (filteredPool.length === 0) return;
      randomItem = filteredPool[Math.floor(Math.random() * filteredPool.length)];
      hskLevel = getHskLevel(randomItem.id);
    } else {
      const filteredPool = GENERAL_VOCAB_ITEMS.filter((item) => {
        return selectedHskFilter === 'all' || item.hskLevel === selectedHskFilter;
      });

      if (filteredPool.length === 0) return;
      randomItem = filteredPool[Math.floor(Math.random() * filteredPool.length)];
      hskLevel = randomItem.hskLevel;
    }

    const types: ('translate' | 'pinyin' | 'listening')[] = ['translate', 'pinyin', 'listening'];
    const type = types[Math.floor(Math.random() * types.length)];

    let questionText = '';
    let correctAnswer = '';
    let options: string[] = [];

    const isFurniture = 'category' in randomItem;
    const itemVietnameseName = isFurniture ? randomItem.nameVietnamese : (randomItem as GeneralVocabItem).nameVietnamese;
    const itemChineseName = randomItem.nameChinese;
    const itemPinyinName = randomItem.namePinyin;

    if (type === 'translate') {
      questionText = `Hãy chọn chữ Hán chính xác cho từ: "${itemVietnameseName}"`;
      correctAnswer = itemChineseName;
      
      const pool = isFurniture ? FURNITURE_ITEMS : GENERAL_VOCAB_ITEMS;
      const distractors = pool.filter((i) => i.id !== randomItem.id)
        .map((i) => i.nameChinese)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());
    } else if (type === 'pinyin') {
      questionText = `Phiên âm Pinyin chính xác của từ "${itemChineseName}" (${itemVietnameseName}) là:`;
      correctAnswer = itemPinyinName;

      const pool = isFurniture ? FURNITURE_ITEMS : GENERAL_VOCAB_ITEMS;
      const distractors = pool.filter((i) => i.id !== randomItem.id)
        .map((i) => i.namePinyin)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());
    } else {
      questionText = 'Nghe phát âm tiếng Trung sau đây và chọn đáp án tương ứng:';
      correctAnswer = itemVietnameseName;

      const pool = isFurniture ? FURNITURE_ITEMS : GENERAL_VOCAB_ITEMS;
      const distractors = pool.filter((i) => i.id !== randomItem.id)
        .map((i) => i.nameVietnamese)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());
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

    if (type === 'listening') {
      playAudio(itemChineseName);
    }
  };

  useEffect(() => {
    generateQuestion();
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
        // Mở khóa đồ đạc
        if (!unlockedItems.includes(currentQuestion.item.id)) {
          setUnlockedItems((prev) => [...prev, currentQuestion.item.id]);
          playSfx('levelUp');
        }
      } else {
        // Chế độ ôn tập từ vựng: +15 xu
        setCoins(coins + 15);
      }
    } else {
      playSfx('error');
      setStreak(0);
    }
  };

  return (
    <div className="bg-[#fff0f3] border-4 border-[#1f2937] rounded-2xl shadow-[4px_4px_0px_#1f2937] p-6 max-w-2xl mx-auto my-4">
      {/* CHUYỂN ĐỔI CHẾ ĐỘ CHƠI */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => {
            setQuizMode('furniture');
            setStreak(0);
            playSfx('click');
          }}
          className={`flex-1 py-2.5 border-2 border-[#1f2937] font-serif font-black text-xs uppercase rounded-xl shadow-[2px_2px_0px_#1f2937] transition-all cursor-pointer ${
            quizMode === 'furniture'
              ? 'bg-pink-500 text-white shadow-none translate-y-0.5'
              : 'bg-white text-[#1f2937]'
          }`}
        >
          Thiết kế Nội thất
        </button>
        <button
          onClick={() => {
            setQuizMode('general');
            setStreak(0);
            playSfx('click');
          }}
          className={`flex-1 py-2.5 border-2 border-[#1f2937] font-serif font-black text-xs uppercase rounded-xl shadow-[2px_2px_0px_#1f2937] transition-all cursor-pointer ${
            quizMode === 'general'
              ? 'bg-pink-500 text-white shadow-none translate-y-0.5'
              : 'bg-white text-[#1f2937]'
          }`}
        >
          Từ vựng HSK 1-2-3 tổng hợp
        </button>
      </div>

      {/* TIÊU ĐỀ */}
      <h2 className="text-xl font-serif font-black text-[#1f2937] border-b-2 border-dashed border-[#1f2937] pb-3 mb-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5">{renderBookOpenIcon('text-pink-500')} Bản Vẽ Chế Tạo HSK</span>
        <span className="text-xs bg-pink-100 text-pink-700 border border-pink-300 px-2.5 py-0.5 rounded-full font-black font-sans">
          Chuỗi Đúng: {streak}
        </span>
      </h2>

      {/* BỘ LỌC CẤP ĐỘ HSK */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        <span className="text-xs font-black text-gray-500 uppercase self-center mr-2">Cấp độ HSK:</span>
        {['all', 1, 2, 3].concat(quizMode === 'furniture' ? ['4', '5', '6'] : []).map((level) => (
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

      {currentQuestion && (
        <div className="space-y-6">
          {/* HÌNH ẢNH BẢN VẼ PHÁC THẢO (PINK BLUEPRINT) */}
          <div className="h-44 bg-pink-600 border-4 border-[#1f2937] rounded-xl flex items-center justify-center relative overflow-hidden">
            {/* Lưới ô vuông mờ phong cách blueprint */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px]" />
            
            <div className="absolute top-2 left-2 text-[10px] text-pink-100 font-mono font-bold uppercase tracking-widest border border-pink-300/30 px-1.5 py-0.2 rounded bg-pink-700/40">
              PINK BLUEPRINT // HSK {currentQuestion.hskLevel}
            </div>

            {/* Món đồ hiển thị phong cách bản vẽ thiết kế */}
            <div className="w-24 h-24 z-10 flex items-center justify-center stroke-white fill-none text-white [&_rect]:stroke-white [&_rect]:fill-none [&_path]:stroke-white [&_path]:fill-none [&_circle]:stroke-white [&_circle]:fill-none [&_ellipse]:stroke-white [&_ellipse]:fill-none">
              {'category' in currentQuestion.item ? (
                renderFurnitureSVG(currentQuestion.item.id, 0, 'w-20 h-20')
              ) : (
                renderVocabularyCardSVG('w-16 h-16 text-pink-100 animate-bounce')
              )}
            </div>
          </div>

          {/* CÂU HỎI */}
          <div className="bg-white border-2 border-[#1f2937] p-4 rounded-xl shadow-[2px_2px_0px_#1f2937] text-center">
            <span className="text-[10px] bg-pink-100 text-pink-800 border border-pink-300 px-2 py-0.5 rounded-full font-black uppercase tracking-wider font-sans">
              HSK Cấp {currentQuestion.hskLevel}
            </span>
            <p className="text-sm font-serif font-black text-[#1f2937] mt-3">
              {currentQuestion.questionText || currentQuestion.type === 'listening' ? (
                <div className="flex items-center justify-center gap-2">
                  <span>Nghe phát âm tiếng Trung:</span>
                  <button
                    onClick={() => playAudio(currentQuestion.chinese)}
                    className="p-1.5 bg-pink-50 hover:bg-pink-100 border border-[#1f2937] rounded-lg cursor-pointer"
                  >
                    {renderAudioIcon('w-4 h-4 text-pink-600')}
                  </button>
                </div>
              ) : (
                currentQuestion.type === 'translate'
                  ? `Hãy chọn chữ Hán của: "${currentQuestion.translation}"`
                  : `Chọn phiên âm Pinyin của: "${currentQuestion.chinese}"`
              )}
            </p>
          </div>

          {/* CÁC ĐÁP ÁN LỰA CHỌN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isThisSelected = selectedAnswer === option;
              const isThisCorrect = option === currentQuestion.correctAnswer;
              
              let btnClass = 'bg-white hover:bg-pink-50 text-[#1f2937]';
              if (isAnswered) {
                if (isThisCorrect) {
                  btnClass = 'bg-green-500 text-white shadow-none translate-y-0.5 border-green-700';
                } else if (isThisSelected) {
                  btnClass = 'bg-red-500 text-white shadow-none translate-y-0.5 border-red-700';
                } else {
                  btnClass = 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSubmit(option)}
                  disabled={isAnswered}
                  className={`w-full py-3.5 px-4 border-2 border-[#1f2937] font-black text-sm rounded-xl shadow-[2px_2px_0px_#1f2937] transition-all cursor-pointer ${btnClass}`}
                >
                  <span className="font-serif block text-base">{option}</span>
                </button>
              );
            })}
          </div>

          {/* PHẢN HỒI KẾT QUẢ VÀ GIẢI NGHĨA */}
          {isAnswered && (
            <div className="bg-white border-2 border-[#1f2937] p-4 rounded-xl shadow-[2px_2px_0px_#1f2937] space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm font-black uppercase ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                  {isCorrect ? 'Chúc mừng! Bạn đã trả lời đúng' : 'Rất tiếc! Câu trả lời chưa chính xác'}
                </span>
                <span className="text-[10px] bg-pink-100 border border-pink-300 text-pink-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-sans">
                  {renderAwardIcon()} +{quizMode === 'furniture' ? '20' : '15'} Xu
                </span>
              </div>
              
              <div className="p-3 bg-pink-50/20 rounded-lg border border-pink-200">
                <p className="text-sm font-serif font-black text-[#1f2937]">
                  Chữ Hán: <span className="text-pink-600 text-base">{currentQuestion.chinese}</span>
                </p>
                <p className="text-xs font-black text-gray-500 mt-1">
                  Phiên âm Pinyin: <span className="text-blue-600">{currentQuestion.pinyin}</span>
                </p>
                <p className="text-xs font-black text-gray-600 mt-0.5">
                  Nghĩa tiếng Việt: <span>{currentQuestion.translation}</span>
                </p>
              </div>

              {/* Hàng hành động bổ trợ */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => onExplainWord(currentQuestion.chinese)}
                  className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 border border-[#1f2937] rounded-lg text-[10.5px] font-black uppercase tracking-wider text-blue-800 flex items-center gap-1 cursor-pointer transition-all shadow-[1px_1px_0px_#1f2937]"
                >
                  {renderAIIcon('w-3.5 h-3.5 text-blue-800')} Hỏi AI Giải Thích
                </button>
                <button
                  onClick={generateQuestion}
                  className="px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white border-2 border-[#1f2937] rounded-lg text-[10.5px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Tiếp Tục
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
