'use client';

import React, { useState } from 'react';
import { DesignContract, DESIGN_CONTRACTS } from '../data/vocabulary';

interface PlacedItem {
  id: string;
  itemTypeId: string;
  x: number;
  y: number;
  rotation: number;
}

interface LoveInboxProps {
  placedItems: PlacedItem[];
  unlockedVouchers: any[];
  onUnlockVoucher: (contract: DesignContract) => void;
  playSfx: (type: 'click' | 'success' | 'error' | 'perfect' | 'levelUp' | 'flip') => void;
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

export default function LoveInbox({
  placedItems,
  unlockedVouchers,
  onUnlockVoucher,
  playSfx
}: LoveInboxProps) {
  const [activeTab, setActiveTab] = useState<'contracts' | 'wallet'>('contracts');
  const [selectedContract, setSelectedContract] = useState<DesignContract | null>(null);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Chỉ lấy các hợp đồng tình yêu đặc biệt của Khang
  const loveContracts = DESIGN_CONTRACTS.filter((c) => c.isLoveContract);

  // Kiểm tra xem phòng hiện tại của Vy đã thỏa mãn các yêu cầu của hợp đồng chưa
  const checkContractCompletion = (contract: DesignContract) => {
    const placedTypeIds = placedItems.map((item) => item.itemTypeId);
    return contract.targetRequirements.every((reqId) => placedTypeIds.includes(reqId));
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
    } else {
      // Thiếu đồ đạc
      const placedTypeIds = placedItems.map((item) => item.itemTypeId);
      const missingItemsNames = contract.targetRequirements
        .filter((reqId) => !placedTypeIds.includes(reqId))
        .map((reqId) => {
          const items = require('../data/vocabulary').FURNITURE_ITEMS;
          return items.find((i: any) => i.id === reqId)?.nameVietnamese || reqId;
        });

      setSubmitMessage({
        type: 'error',
        text: `Chưa hoàn thành rồi Vy ơi! Bạn cần đặt thêm các món đồ sau vào phòng của mình: ${missingItemsNames.join(', ')}`,
      });
      playSfx('error');
    }
  };

  return (
    <div className="bg-[#fffaf0] border-4 border-[#1f2937] rounded-2xl shadow-[4px_4px_0px_#1f2937] p-6 max-w-2xl mx-auto my-4">
      {/* TABS HỘM THƯ */}
      <div className="flex border-b-2 border-[#1f2937] mb-6">
        <button
          onClick={() => {
            setActiveTab('contracts');
            setSelectedContract(null);
            setSubmitMessage(null);
            playSfx('click');
          }}
          className={`flex-1 py-3 font-serif font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all border-t-2 border-x-2 border-transparent ${
            activeTab === 'contracts'
              ? 'bg-[#fffaf0] border-[#1f2937] border-b-4 border-b-[#fffaf0] -mb-[2px] rounded-t-lg text-[#1f2937]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {renderMailIconSVG(activeTab === 'contracts' ? 'text-rose-500 w-5 h-5' : 'w-5 h-5')}
          Thư Thử Thách Của Khang
        </button>
        <button
          onClick={() => {
            setActiveTab('wallet');
            setSelectedContract(null);
            setSubmitMessage(null);
            playSfx('click');
          }}
          className={`flex-1 py-3 font-serif font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all border-t-2 border-x-2 border-transparent ${
            activeTab === 'wallet'
              ? 'bg-[#fffaf0] border-[#1f2937] border-b-4 border-b-[#fffaf0] -mb-[2px] rounded-t-lg text-[#1f2937]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {renderTicketIconSVG(activeTab === 'wallet' ? 'text-rose-500 w-5 h-5' : 'w-5 h-5')}
          Ví Voucher Của Vy ({unlockedVouchers.length})
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
                <div className="w-10 h-10 bg-amber-100 border-2 border-[#1f2937] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
                <span className="text-[9px] bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full font-black uppercase font-sans">
                  Lời nhắn tiếng Trung của Khang:
                </span>
                <p className="text-base font-serif font-black text-[#1f2937]">{selectedContract.promptChinese}</p>
                <p className="text-[12px] font-bold text-blue-600 font-sans">{selectedContract.promptPinyin}</p>
                <p className="text-[12px] font-bold text-gray-500">Dịch nghĩa: {selectedContract.promptVietnamese}</p>
              </div>

              {/* YÊU CẦU ĐỒ NỘI THẤT */}
              <div className="space-y-2">
                <h5 className="text-xs font-black text-gray-500 uppercase tracking-wider">Yêu cầu nội thất cần đặt trong phòng:</h5>
                <div className="flex gap-2 flex-wrap">
                  {selectedContract.targetRequirements.map((reqId) => {
                    const items = require('../data/vocabulary').FURNITURE_ITEMS;
                    const name = items.find((i: any) => i.id === reqId)?.nameVietnamese || reqId;
                    const isPlaced = placedItems.some((pi) => pi.itemTypeId === reqId);

                    return (
                      <span
                        key={reqId}
                        className={`text-xs px-2.5 py-1 border-2 border-[#1f2937] rounded-lg font-black flex items-center gap-1.5 ${
                          isPlaced ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-600'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {name} {isPlaced ? '(Đã đặt)' : '(Chưa đặt)'}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* VOUCHER PHẦN THƯỞNG */}
              {selectedContract.voucherReward && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                  <div className="text-amber-600 shrink-0">
                    {renderTicketIconSVG('w-8 h-8')}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-[#1f2937] uppercase">Voucher Đặc Quyền Vy Nhận Được:</h5>
                    <p className="text-xs font-serif font-black text-amber-700">{selectedContract.voucherReward.title}</p>
                    <p className="text-[10.5px] text-gray-500 font-bold leading-normal mt-0.5">{selectedContract.voucherReward.description}</p>
                  </div>
                </div>
              )}

              {/* NỘP BẢN THIẾT KẾ */}
              <div className="pt-3 border-t border-dashed border-[#1f2937] flex justify-between items-center">
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
              Vy chưa mở khóa voucher nào. Hãy giải quyết các thử thách thiết kế phòng của Khang để rinh quà nhé!
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
                    <span className="px-2.5 py-1.5 bg-amber-100 border border-[#1f2937] font-mono font-black text-xs rounded-lg text-amber-800 select-all">
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
