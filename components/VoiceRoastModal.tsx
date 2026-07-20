'use client';

import React, { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceRoastModalProps {
  wordChinese: string;
  wordPinyin: string;
  wordVietnamese: string;
  onClose: () => void;
  playSfx: (type: 'click' | 'success' | 'error' | 'perfect' | 'levelUp' | 'flip') => void;
}

function renderMicSVG(className = 'w-6 h-6 inline') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function renderStarSVG(className = 'w-4 h-4 text-amber-400 fill-current inline') {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function VoiceRoastModal({
  wordChinese,
  wordPinyin,
  wordVietnamese,
  onClose,
  playSfx
}: VoiceRoastModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [statusMsg, setStatusMsg] = useState('Bấm nút micro ở dưới và đọc từ tiếng Trung thật to nhé!');
  const [evalResult, setEvalResult] = useState<{
    score: number;
    roast: string;
    levelClass: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMsg('Trình duyệt của bạn không hỗ trợ Web Speech Recognition. Hãy thử dùng Chrome/Edge.');
      return;
    }

    try {
      playSfx('click');
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscribedText('');
        setEvalResult(null);
        setStatusMsg('Đang lắng nghe... Hãy nói từ tiếng Trung!');
      };

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscribedText(speechResult);
        evaluatePronunciation(speechResult);
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        if (event.error === 'no-speech') {
          setStatusMsg('Không nghe thấy giọng nói. Hãy thử lại và đọc to hơn nhé!');
        } else {
          setStatusMsg(`Lỗi nhận diện âm thanh: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e: any) {
      setIsRecording(false);
      setStatusMsg(`Không thể bật micro: ${e.message || e}`);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const evaluatePronunciation = (userSpeech: string) => {
    const cleanTarget = wordChinese.trim();
    const cleanUser = userSpeech.trim();

    let score = 0;
    if (cleanUser.includes(cleanTarget) || cleanTarget.includes(cleanUser)) {
      score = 95 + Math.floor(Math.random() * 6);
    } else {
      let matchedChars = 0;
      for (const char of cleanUser) {
        if (cleanTarget.includes(char)) matchedChars++;
      }
      if (cleanTarget.length > 0) {
        const ratio = matchedChars / cleanTarget.length;
        score = Math.round(Math.min(90, Math.max(20, ratio * 100 + Math.random() * 20)));
      } else {
        score = 40;
      }
    }

    let roast = '';
    let levelClass = '';

    if (score >= 90) {
      roast = `Đỉnh cao! Bạn phát âm từ "${wordChinese}" chuẩn 100% như người bản xứ Bắc Kinh luôn nha!`;
      levelClass = 'text-emerald-600 bg-emerald-50 border-emerald-300';
      playSfx('perfect');
    } else if (score >= 70) {
      roast = `Phát âm rất tốt! Nghe giọng ngọt ngào truyền cảm lắm, chỉ cần chút xíu âm điệu nữa là hoàn hảo!`;
      levelClass = 'text-blue-600 bg-blue-50 border-blue-300';
      playSfx('success');
    } else if (score >= 45) {
      roast = `Cũng được đấy! Nhưng nghe âm điệu từ "${wordChinese}" hơi giống giọng miền Tây nói tiếng Trung nha!`;
      levelClass = 'text-amber-700 bg-amber-50 border-amber-300';
      playSfx('click');
    } else {
      roast = `Trời ơi! Bạn đọc "${userSpeech}" nghe như đang đọc thần chú vậy! Từ gốc là "${wordChinese}" mà! Thử lại lần nữa nào!`;
      levelClass = 'text-rose-600 bg-rose-50 border-rose-300';
      playSfx('error');
    }

    setEvalResult({ score, roast, levelClass });

    try {
      const audio = new Audio(`/api/tts?text=${encodeURIComponent(roast)}&lang=vi`);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#fffbeb] border-4 border-[#1f2937] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-200 border-2 border-rose-400 text-rose-700 font-bold flex items-center justify-center transition"
        >
          ✕
        </button>

        <span className="bg-pink-400 text-pink-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center justify-center gap-1.5 w-max mx-auto">
          {renderMicSVG('w-4 h-4')} AI Mỏ Hỗn Chấm Điểm Giọng Nói
        </span>

        <div className="mt-4 p-4 bg-white border-2 border-[#1f2937] rounded-2xl shadow-[2px_2px_0px_#1f2937]">
          <h2 className="text-3xl font-serif font-black text-rose-600 mb-1">{wordChinese}</h2>
          <p className="text-xs font-mono font-bold text-gray-500 mb-1">{wordPinyin}</p>
          <p className="text-xs font-black text-amber-900">Nghĩa: {wordVietnamese}</p>
        </div>

        <div className="my-6 flex flex-col items-center justify-center">
          <button
            onClick={isRecording ? stopListening : startListening}
            className={`w-20 h-20 rounded-full border-4 border-[#1f2937] flex items-center justify-center shadow-[3px_3px_0px_#1f2937] transition-all transform active:scale-95 ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-300'
                : 'bg-amber-400 hover:bg-amber-500 text-amber-950 hover:-translate-y-1'
            }`}
          >
            {renderMicSVG('w-8 h-8')}
          </button>
          <span className="text-xs font-black text-gray-600 mt-2">
            {isRecording ? 'Đang thu âm... Bấm để dừng' : 'Bấm Micro để luyện đọc'}
          </span>
        </div>

        {transcribedText && (
          <div className="mb-3 p-2 bg-amber-100/70 border border-amber-300 rounded-xl text-xs font-bold text-amber-900">
            Giọng nói nghe được: <span className="font-serif text-rose-600 font-black">"{transcribedText}"</span>
          </div>
        )}

        {evalResult ? (
          <div className={`p-4 rounded-2xl border-2 text-left space-y-2 ${evalResult.levelClass}`}>
            <div className="flex justify-between items-center border-b border-current pb-2">
              <span className="font-black text-sm uppercase flex items-center gap-1">
                {renderStarSVG('w-4 h-4')} Điểm Phát Âm:
              </span>
              <span className="text-xl font-serif font-black">{evalResult.score} / 100</span>
            </div>
            <p className="text-xs font-bold leading-relaxed">{evalResult.roast}</p>
          </div>
        ) : (
          <p className="text-xs text-amber-800 font-medium italic">{statusMsg}</p>
        )}
      </div>
    </div>
  );
}
