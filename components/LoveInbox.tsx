'use client';

import React, { useState, useEffect } from 'react';
import { DesignContract, DESIGN_CONTRACTS, FURNITURE_ITEMS } from '../data/vocabulary';
import { renderFurnitureSVG } from './RoomEditor';

interface PlacedItem {
  id: string;
  itemTypeId: string;
  x: number;
  y: number;
  rotation: number;
}

interface LoveInboxProps {
  user?: any;
  isVy?: boolean;
  placedItems: PlacedItem[];
  unlockedVouchers: any[];
  onUnlockVoucher: (contract: DesignContract) => void;
  playSfx: (type: 'click' | 'success' | 'error' | 'perfect' | 'levelUp' | 'flip') => void;
  isDarkMode?: boolean;
  initialTab?: 'contracts' | 'chat' | 'wallet';
}

// Icons bổ trợ thay thế cho Emojis
function renderHeartIconSVG(className = 'w-5 h-5 text-rose-500 fill-current') {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function renderMailIconSVG(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
    </svg>
  );
}

function renderTicketIconSVG(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  );
}

function renderCheckIconSVG(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function renderLockOpenIconSVG(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2z" />
    </svg>
  );
}

function renderLightbulbIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function renderChatIconSVG(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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

export default function LoveInbox({
  user,
  isVy,
  placedItems,
  unlockedVouchers,
  onUnlockVoucher,
  playSfx,
  isDarkMode,
  initialTab
}: LoveInboxProps) {
  const userName = user?.username || 'Bạn';
  const [activeTab, setActiveTab] = useState<'contracts' | 'chat' | 'wallet'>(initialTab || (isVy ? 'contracts' : 'wallet'));

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [selectedContract, setSelectedContract] = useState<DesignContract | null>(null);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showLoveHint, setShowLoveHint] = useState(false);

  // Chat states
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showChatTranslations, setShowChatTranslations] = useState<{[key: string]: boolean}>({});

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

  const handlePlayTTS = (text: string) => {
    playSfx('click');
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(text)}&lang=zh`);
    audio.play().catch((e) => console.warn('TTS playback failed', e));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = {
      id: Math.random().toString(),
      sender: 'player',
      text: chatInput,
      timestamp: new Date().toISOString(),
    };

    const updatedMsgs = [...chatMessages, userMsg];
    setChatMessages(updatedMsgs);
    setChatInput('');
    setChatLoading(true);
    playSfx('click');

    try {
      const history = updatedMsgs.slice(-10).map((m) => ({
        sender: m.sender === 'player' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: isVy ? 'Nhựt Khang' : (userName || 'Trợ Lý AI'),
          message: userMsg.text,
          history,
        }),
      });

      const data = await res.json();
      if (data.text) {
        const aiMsg = {
          id: Math.random().toString(),
          sender: 'ai',
          text: data.text,
          pinyin: data.pinyin,
          translation: data.translation,
          timestamp: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        playSfx('success');
      } else {
        throw new Error(data.error || 'Lỗi phản hồi từ Khang AI');
      }
    } catch (e) {
      console.error(e);
      const errorMsg = {
        id: Math.random().toString(),
        sender: 'ai',
        text: 'Anh xin lỗi, mạng bị chập chờn rồi Vy ơi. Để anh kiểm tra lại nhé!',
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
      playSfx('error');
    } finally {
      setChatLoading(false);
    }
  };

  // Chỉ lấy các hợp đồng tình yêu đặc biệt của Khang
  const loveContracts = DESIGN_CONTRACTS.filter((c) => c.isLoveContract);

  // Kiểm tra xem phòng hiện tại của Vy đã thỏa mãn các yêu cầu của hợp đồng chưa
  const checkContractCompletion = (contract: DesignContract) => {
    const hasAll = contract.targetRequirements.every((reqId) => selectedItems.includes(reqId));
    const noExtra = selectedItems.every((reqId) => contract.targetRequirements.includes(reqId));
    return hasAll && noExtra;
  };

  const handleSubmitDesign = (contract: DesignContract) => {
    playSfx('click');
    const isCompleted = checkContractCompletion(contract);

    if (isCompleted) {
      // Thành công!
      onUnlockVoucher(contract);
      setSubmitMessage({
        type: 'success',
        text: `Tuyệt vời! Bạn đã hoàn thành xuất sắc bản vẽ "${contract.title}". Voucher quà tặng độc quyền "${contract.voucherReward?.title}" đã được gửi vào ví của bạn!`,
      });
      playSfx('success');
      setSelectedItems([]);
    } else {
      const missingItemsNames = contract.targetRequirements
        .filter((reqId) => !selectedItems.includes(reqId))
        .map((reqId) => {
          const items = require('../data/vocabulary').FURNITURE_ITEMS;
          return items.find((i: any) => i.id === reqId)?.nameVietnamese || reqId;
        });

      const extraItemsNames = selectedItems
        .filter((reqId) => !contract.targetRequirements.includes(reqId))
        .map((reqId) => {
          const items = require('../data/vocabulary').FURNITURE_ITEMS;
          return items.find((i: any) => i.id === reqId)?.nameVietnamese || reqId;
        });

      let errorMsg = 'Bản vẽ chưa chính xác Vy ơi! ';
      if (missingItemsNames.length > 0) {
        errorMsg += `Còn thiếu đồ: ${missingItemsNames.join(', ')}. `;
      }
      if (extraItemsNames.length > 0) {
        errorMsg += `Bị thừa đồ không yêu cầu: ${extraItemsNames.join(', ')}.`;
      }

      setSubmitMessage({
        type: 'error',
        text: errorMsg,
      });
      playSfx('error');
    }
  };

  return (
    <div className={`border-4 rounded-2xl shadow-[4px_4px_0px_#1f2937] p-4 sm:p-6 max-w-2xl mx-auto my-4 transition-colors ${
      isDarkMode ? 'bg-[#1e293b] text-slate-100 border-slate-700' : 'bg-[#fff0f3] text-[#1f2937] border-[#1f2937]'
    }`}>
      {/* TABS HỘM THƯ */}
      <div className="flex border-b-2 border-[#1f2937] mb-6">
        {isVy && (
          <button
            onClick={() => {
              setActiveTab('contracts');
              setSelectedContract(null);
              setSubmitMessage(null);
              playSfx('click');
            }}
            className={`flex-1 py-3 font-serif font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all border-t-2 border-x-2 border-transparent ${
              activeTab === 'contracts'
                ? 'bg-[#fff0f3] border-[#1f2937] border-b-4 border-b-[#fff0f3] -mb-[2px] rounded-t-lg text-[#1f2937]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {renderMailIconSVG(activeTab === 'contracts' ? 'text-rose-500 w-5 h-5' : 'w-5 h-5')}
            Thử Thách Của Khang
          </button>
        )}
        <button
          onClick={() => {
            setActiveTab('wallet');
            setSelectedContract(null);
            setSubmitMessage(null);
            playSfx('click');
          }}
          className={`flex-1 py-3 font-serif font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all border-t-2 border-x-2 border-transparent ${
            activeTab === 'wallet'
              ? 'bg-[#fff0f3] border-[#1f2937] border-b-4 border-b-[#fff0f3] -mb-[2px] rounded-t-lg text-[#1f2937]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {renderTicketIconSVG(activeTab === 'wallet' ? 'text-rose-500 w-5 h-5' : 'w-5 h-5')}
          {isVy ? `Ví Voucher Của Vy (${unlockedVouchers.length})` : `Ví Voucher Của ${userName} (${unlockedVouchers.length})`}
        </button>
      </div>

      {/* TAB 1: DANH SÁCH THỬ THÁCH THIẾT KẾ CỦA KHANG */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          {!selectedContract ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loveContracts.map((contract) => {
                const isCompleted = checkContractCompletion(contract);
                const isAlreadyUnlocked = unlockedVouchers.some((v) => v.code === contract.voucherReward?.code);

                return (
                  <div
                    key={contract.id}
                    onClick={() => {
                      setSelectedContract(contract);
                      setSubmitMessage(null);
                      setShowLoveHint(false);
                      playSfx('click');
                    }}
                    className={`border-2 border-[#1f2937] p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                      isAlreadyUnlocked
                        ? 'bg-emerald-50/50 shadow-none border-emerald-600'
                        : 'bg-white shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1f2937]'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full font-black uppercase font-sans flex items-center gap-1">
                          {renderHeartIconSVG('w-3 h-3 text-rose-500 fill-current')} Thư Tình Cảm
                        </span>
                        {isAlreadyUnlocked && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-black flex items-center gap-1 font-sans">
                            {renderCheckIconSVG()} Đã Nhận Quà
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-serif font-black text-[#1f2937]">{contract.title}</h3>
                      <p className="text-[12px] text-gray-500 font-medium line-clamp-2 mt-1">
                        {contract.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-[#1f2937] flex justify-between items-center text-[11px] font-black text-gray-600">
                      <span>Xu: +{contract.rewardCoins}</span>
                      <span>Mã: {contract.voucherReward?.code.slice(0, 10)}...</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* CHI TIẾT THƯ THỬ THÁCH ĐÃ CHỌN */
            <div className="bg-white border-2 border-[#1f2937] p-6 rounded-xl shadow-[3px_3px_0px_#1f2937] space-y-4 relative">
              <button
                onClick={() => setSelectedContract(null)}
                className="absolute top-4 right-4 text-xs font-black text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Quay Lại
              </button>

              <div className="flex items-center gap-3 border-b-2 border-dashed border-[#1f2937] pb-3">
                <div className="w-10 h-10 bg-pink-100 border-2 border-[#1f2937] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-pink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-serif font-black text-[#1f2937]">Hợp đồng gửi từ: Nhựt Khang</h3>
                  <p className="text-[10px] text-gray-400 font-bold">Người yêu thương gửi đến Vy</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-serif font-black text-rose-600">{selectedContract.title}</h4>
                <p className="text-xs text-gray-600 font-bold leading-relaxed">{selectedContract.description}</p>
              </div>

              {/* KHU VỰC TIẾNG TRUNG GIAO NHIỆM VỤ */}
              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full font-black uppercase font-sans">
                    Lời nhắn tiếng Trung của Khang:
                  </span>
                  <button
                    onClick={() => handlePlayTTS(selectedContract.promptChinese)}
                    className="p-1 bg-white hover:bg-rose-100 border border-[#1f2937] rounded-lg cursor-pointer"
                  >
                    {renderAudioIcon('w-4 h-4 text-[#1f2937]')}
                  </button>
                </div>
                <p className="text-base font-serif font-black text-[#1f2937]">{selectedContract.promptChinese}</p>
                <p className="text-[12px] font-bold text-blue-600 font-sans">{selectedContract.promptPinyin}</p>
                
                {showLoveHint ? (
                  <div className="pt-1.5 border-t border-dashed border-rose-200 flex justify-between items-start gap-4">
                    <p className="text-[12px] font-bold text-gray-500">Dịch nghĩa: {selectedContract.promptVietnamese}</p>
                    <button
                      onClick={() => {
                        playSfx('click');
                        setShowLoveHint(false);
                      }}
                      className="text-[9px] font-black text-rose-600 uppercase hover:underline shrink-0 cursor-pointer"
                    >
                      Ẩn gợi ý
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      playSfx('click');
                      setShowLoveHint(true);
                    }}
                    className="text-[10px] font-black text-blue-600 uppercase hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    {renderLightbulbIcon('w-3.5 h-3.5 text-blue-600')} Xem Gợi Ý Nghĩa Tiếng Việt
                  </button>
                )}
              </div>

              {/* PHÒNG PHÁC THẢO CHỌN ĐỒ */}
              <div className="space-y-2 text-left">
                <h5 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                  Phòng phác thảo ảo (Vy hãy chọn đồ vật ở dưới để thêm vào phòng):
                </h5>
                <div className="h-32 bg-pink-900/5 border-2 border-[#1f2937] rounded-xl flex items-center justify-center gap-4 relative overflow-hidden p-3">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(31,41,55,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(31,41,55,0.04)_1px,transparent_1px)] bg-[size:12px_12px]" />
                  
                  {unlockedVouchers.some((v) => v.code === selectedContract.voucherReward?.code) ? (
                    <div className="flex flex-col items-center gap-1.5 z-10">
                      <span className="text-xs font-black text-emerald-600 uppercase border-2 border-emerald-600 px-3 py-1 rounded bg-white rotate-[-2deg] shadow-sm">
                        [ Thử thách đã hoàn thành ]
                      </span>
                    </div>
                  ) : selectedItems.length === 0 ? (
                    <span className="text-[11px] text-gray-400 font-bold italic z-10">Vy hãy nhấp chọn các đồ nội thất ở danh mục bên dưới!</span>
                  ) : (
                    <div className="flex gap-3 overflow-x-auto max-w-full z-10 py-1 px-2">
                      {selectedItems.map((itemId) => {
                        const item = FURNITURE_ITEMS.find(i => i.id === itemId);
                        return (
                          <div key={itemId} className="flex flex-col items-center bg-white border border-[#1f2937] p-1.5 rounded-lg shadow-[1px_1px_0px_#1f2937] shrink-0">
                            {renderFurnitureSVG(itemId, 0, 'w-8 h-8')}
                            <span className="text-[9px] font-black text-[#1f2937] mt-1">{item?.nameVietnamese}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* YÊU CẦU ĐỒ NỘI THẤT */}
              <div className="space-y-2 text-left">
                <h5 className="text-xs font-black text-gray-500 uppercase tracking-wider">Danh mục đồ nội thất để Vy lựa chọn:</h5>
                {unlockedVouchers.some((v) => v.code === selectedContract.voucherReward?.code) ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800">
                    Bạn đã hoàn thành xuất sắc thử thách này và rinh trọn vẹn phần thưởng!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[180px] overflow-y-auto pr-1">
                    {FURNITURE_ITEMS.map((item) => {
                      const isSelected = selectedItems.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            playSfx('click');
                            if (isSelected) {
                              setSelectedItems(prev => prev.filter(id => id !== item.id));
                            } else {
                              setSelectedItems(prev => [...prev, item.id]);
                            }
                          }}
                          className={`p-2 border border-[#1f2937] rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center relative ${
                            isSelected
                              ? 'bg-rose-100 border-rose-500 shadow-none translate-y-0.5'
                              : 'bg-white hover:bg-rose-50 shadow-[1.5px_1.5px_0px_#1f2937]'
                          }`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            {renderFurnitureSVG(item.id, 0, 'w-6 h-6')}
                          </div>
                          <span className="text-[9px] font-black text-[#1f2937] leading-tight truncate w-full">{item.nameVietnamese}</span>
                          <span className="text-[8px] font-bold text-pink-600 font-serif">{item.nameChinese}</span>
                          
                          {isSelected && (
                            <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-rose-500 rounded-full border border-white flex items-center justify-center text-white text-[7px] font-black">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* VOUCHER PHẦN THƯỞNG */}
              {selectedContract.voucherReward && (
                <div className="p-3 bg-pink-50/40 border border-pink-200 rounded-xl flex items-center gap-3 text-left">
                  <div className="text-pink-600 shrink-0">
                    {renderTicketIconSVG('w-8 h-8')}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-[#1f2937] uppercase">Voucher Đặc Quyền Vy Nhận Được:</h5>
                    <p className="text-xs font-serif font-black text-pink-700">{selectedContract.voucherReward.title}</p>
                    <p className="text-[10.5px] text-gray-500 font-bold leading-normal mt-0.5">{selectedContract.voucherReward.description}</p>
                  </div>
                </div>
              )}

              {/* NỘP BẢN THIẾT KẾ */}
              <div className="pt-3 border-t border-dashed border-[#1f2937] flex justify-between items-center text-left">
                <div className="text-xs font-bold text-gray-500">
                  Phần thưởng: <span className="font-black text-[#1f2937]">{selectedContract.rewardCoins} Xu</span>
                </div>
                {unlockedVouchers.some((v) => v.code === selectedContract.voucherReward?.code) ? (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-200 text-gray-400 border-2 border-gray-300 rounded-lg font-black text-xs uppercase cursor-not-allowed"
                  >
                    Đã Nhận Thưởng
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmitDesign(selectedContract)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white border-2 border-[#1f2937] rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer transition-all"
                  >
                    Nộp Bản Thiết Kế
                  </button>
                )}
              </div>

              {/* HIỂN THỊ THÔNG BÁO NỘP */}
              {submitMessage && (
                <div
                  className={`p-3 rounded-lg border text-xs font-bold ${
                    submitMessage.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VÍ VOUCHER ĐÃ MỞ KHÓA CỦA VY */}
      {activeTab === 'wallet' && (
        <div className="space-y-4">
          {unlockedVouchers.length === 0 ? (
            <div className="text-center py-10 bg-white border-2 border-dashed border-[#1f2937] rounded-xl text-gray-400 font-bold">
              {isVy ? 'Vy chưa mở khóa voucher nào. Hãy giải quyết các thử thách thiết kế phòng của Khang để rinh quà nhé!' : `${userName} chưa mở khóa voucher nào. Hãy hoàn thành các hợp đồng thiết kế phòng để rinh quà nhé!`}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {unlockedVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-white border-2 border-[#1f2937] p-4 rounded-xl shadow-[3px_3px_0px_#1f2937] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-rose-500">
                      {renderHeartIconSVG('w-8 h-8 fill-rose-100 text-rose-500')}
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-black text-[#1f2937]">{voucher.title}</h4>
                      <p className="text-[11px] text-gray-500 font-medium leading-normal mt-0.5">{voucher.description}</p>
                      <span className="text-[10px] text-gray-400 font-bold font-sans">Mở khóa lúc: {new Date(voucher.unlockedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-gray-400 font-bold block mb-1">Mã Voucher:</span>
                    <span className="px-2.5 py-1.5 bg-pink-100 border border-[#1f2937] font-mono font-black text-xs rounded-lg text-pink-800 select-all">
                      {voucher.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
