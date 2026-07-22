'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AIChatBubbleModalProps {
  user?: any;
  isVy?: boolean;
  onPlayTTS: (text: string) => void;
  playSfx: (type: 'click' | 'success' | 'error' | 'perfect' | 'levelUp' | 'flip') => void;
  isDarkMode?: boolean;
}

function renderAudioIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
}

function renderLightbulbIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function renderSleekChatIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
}

function renderCloseIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function AIChatBubbleModal({
  user,
  isVy,
  onPlayTTS,
  playSfx,
  isDarkMode
}: AIChatBubbleModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showChatTranslations, setShowChatTranslations] = useState<{[key: string]: boolean}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = user?.username || 'Bạn';

  // Load chat messages
  useEffect(() => {
    const saved = localStorage.getItem(`love_inbox_chat_history_${user?.id || 'guest'}`);
    if (saved) {
      try {
        setChatMessages(JSON.parse(saved));
      } catch (e) {}
    } else {
      if (isVy) {
        setChatMessages([
          {
            id: 'welcome',
            sender: 'ai',
            text: '你好，我的薇薇！最近学习中文累不累？有空找我聊天哦，我随时都在！',
            pinyin: 'Nǐ hǎo, wǒ de wēiwēi! Zuìjìn xuéxí zhōngwén lèi bú lèi? Yǒu kòng zhǎo wǒ liáotiān o, wǒ suíshí dōu zài!',
            translation: 'Chào em, Vy Vy của anh! Dạo này học tiếng Trung có mệt không? Rảnh rỗi nhắn tin nói chuyện với anh nhé, anh luôn ở đây!',
            timestamp: new Date().toISOString()
          }
        ]);
      } else {
        setChatMessages([
          {
            id: 'welcome',
            sender: 'ai',
            text: '你好！我是你的中文设计助手。有什么我可以帮你的吗？',
            pinyin: 'Nǐ hǎo! Wǒ shì nǐ de Zhōngwén shèjì zhùshǒu. Yǒu shénme wǒ kěyǐ bāng nǐ de ma?',
            translation: `Chào ${userName}! Tôi là Trợ Lý Tiếng Trung AI của bạn. Tôi có thể giúp gì cho bạn hôm nay?`,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    }
  }, [user, isVy, userName]);

  // Save chat messages
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem(`love_inbox_chat_history_${user?.id || 'guest'}`, JSON.stringify(chatMessages));
    }
  }, [chatMessages, user]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    const newMsg = {
      id: Date.now().toString(),
      sender: 'player',
      text: userText,
      timestamp: new Date().toISOString()
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    setChatLoading(true);
    playSfx('click');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatMessages.slice(-6),
          isVy
        })
      });

      const data = await res.json();

      if (data.reply) {
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply.chinese || data.reply.text || data.reply,
          pinyin: data.reply.pinyin || '',
          translation: data.reply.translation || '',
          timestamp: new Date().toISOString()
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        playSfx('success');
      } else {
        throw new Error('No reply');
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: '抱歉，系统忙碌中，请稍后再试！',
          pinyin: 'Bàoqiàn, xìtǒng mánglù zhōng, qǐng shāo hòu zài shì!',
          translation: 'Xin lỗi, hệ thống AI đang bận. Bạn vui lòng thử lại sau nhé!',
          timestamp: new Date().toISOString()
        }
      ]);
      playSfx('error');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING BUBBLE BUTTON AT BOTTOM RIGHT */}
      <div className="fixed bottom-28 md:bottom-6 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            playSfx('click');
          }}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full border-3 border-[var(--line)] shadow-[4px_4px_0_var(--line)] transition-all duration-200 active:scale-95 cursor-pointer ${
            isOpen
              ? 'bg-slate-900 text-white dark:bg-slate-800'
              : 'bg-rose-500 hover:bg-rose-600 text-white'
          }`}
          title="Mở Trợ Lý AI Chat HSK"
        >
          {isOpen ? (
            <>
              {renderCloseIcon('w-5 h-5 text-white')}
              <span className="text-xs font-black">Đóng Chat</span>
            </>
          ) : (
            <>
              <div className="relative">
                {renderSleekChatIcon('w-5 h-5 text-white')}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white" />
              </div>
              <span className="text-xs font-black tracking-wide">
                {isVy ? 'Chat Anh Khang AI' : 'Trợ Lý AI'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* FLOATING CHAT MODAL WINDOW */}
      {isOpen && (
        <div className="fixed bottom-40 md:bottom-20 right-4 z-[55] w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[75vh] flex flex-col border-3 border-[var(--line)] rounded-3xl shadow-[6px_6px_0_var(--line)] overflow-hidden animate-in fade-in zoom-in-95 duration-150 bg-white dark:bg-[#1e1e1e]">
          {/* Header */}
          <div className="bg-rose-500 text-white p-3.5 border-b-3 border-[var(--line)] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/40">
                {renderSleekChatIcon('w-5 h-5 text-white')}
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider">{isVy ? 'Khang Đang Online (AI)' : 'Trợ Lý AI Tiếng Trung'}</h3>
                <p className="text-[10px] text-white/80 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sẵn sàng giải đáp HSK & Giao tiếp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn xóa lịch sử chat không?')) {
                    localStorage.removeItem(`love_inbox_chat_history_${user?.id || 'guest'}`);
                    setChatMessages([]);
                    playSfx('flip');
                  }
                }}
                className="text-[9px] font-black text-white/90 hover:text-white uppercase hover:underline cursor-pointer bg-black/20 px-2 py-1 rounded-md"
              >
                Xóa Chat
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-black text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50 dark:bg-[#161616] scrollbar-thin">
            {chatMessages.map((msg) => {
              const isPlayer = msg.sender === 'player';
              const showTranslate = showChatTranslations[msg.id];

              return (
                <div
                  key={msg.id}
                  className={`flex ${isPlayer ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isPlayer
                        ? 'bg-rose-500 text-white font-bold rounded-tr-none shadow-sm'
                        : isDarkMode
                          ? 'bg-slate-800 text-slate-100 border-2 border-slate-700 rounded-tl-none shadow-xs'
                          : 'bg-white text-[#1f2937] border-2 border-[var(--line)] rounded-tl-none shadow-[2px_2px_0_var(--line)]'
                    }`}
                  >
                    {!isPlayer ? (
                      <div className="space-y-1.5 text-left">
                        {/* Hàng chữ Hán + Audio */}
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-serif font-black text-sm break-words">{msg.text}</span>
                          <button
                            onClick={() => onPlayTTS(msg.text)}
                            className="p-1 bg-rose-50 dark:bg-slate-700 hover:bg-rose-100 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer shrink-0"
                          >
                            {renderAudioIcon('w-3.5 h-3.5 text-rose-600 dark:text-rose-400')}
                          </button>
                        </div>
                        {/* Pinyin */}
                        {msg.pinyin && (
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold font-mono break-words">{msg.pinyin}</p>
                        )}
                        {/* Translation toggle */}
                        {msg.translation && (
                          <div className="pt-1.5 border-t border-dashed border-slate-300 dark:border-slate-700 mt-1">
                            {showTranslate ? (
                              <div className="flex justify-between items-start gap-4">
                                <p className="text-[10.5px] text-slate-600 dark:text-slate-300 font-bold italic">{msg.translation}</p>
                                <button
                                  onClick={() => setShowChatTranslations(prev => ({ ...prev, [msg.id]: false }))}
                                  className="text-[8px] font-black text-rose-500 uppercase hover:underline shrink-0 cursor-pointer mt-0.5"
                                >
                                  Ẩn
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  playSfx('click');
                                  setShowChatTranslations(prev => ({ ...prev, [msg.id]: true }));
                                }}
                                className="text-[9px] font-black text-blue-500 dark:text-blue-400 hover:underline uppercase flex items-center gap-1 cursor-pointer"
                              >
                                {renderLightbulbIcon('w-3 h-3 text-blue-500')} Dịch tiếng Việt
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-left font-sans break-words">{msg.text}</div>
                    )}
                  </div>
                </div>
              );
            })}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border-2 border-[var(--line)] rounded-2xl rounded-tl-none p-3 shadow-xs flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form input */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 border-t-2 border-[var(--line)] bg-white dark:bg-[#1e1e1e] flex gap-2 shrink-0 items-center"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={isVy ? "Gõ tiếng Việt hoặc Trung gửi anh Khang..." : "Gõ tiếng Việt hoặc Trung..."}
              className="flex-1 px-3 py-2 border-2 border-[var(--line)] rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
              disabled={chatLoading}
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white disabled:text-slate-500 border-2 border-[var(--line)] rounded-xl font-black text-xs uppercase shadow-[2px_2px_0_var(--line)] active:shadow-none active:translate-y-0.5 cursor-pointer shrink-0 transition-all"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
}
