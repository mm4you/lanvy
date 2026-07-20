'use client';

import React, { useState } from 'react';
import { DesignContract, FURNITURE_ITEMS, FurnitureItem } from '../data/vocabulary';
import { renderFurnitureSVG } from './RoomEditor';

interface PlacedArrangementItem {
  instanceId: string;
  itemTypeId: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
}

interface ArrangementModalProps {
  contract: DesignContract;
  selectedItemIds: string[];
  onClose: () => void;
  onComplete: (stars: number, bonusCoins: number, bonusScore: number, feedbackMsg: string) => void;
  playSfx: (type: 'click' | 'success' | 'error' | 'perfect' | 'levelUp' | 'flip') => void;
}

function renderStarSVG(className = 'w-5 h-5 text-amber-400 fill-current inline') {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function renderRotateSVG(className = 'w-3.5 h-3.5 inline') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" />
    </svg>
  );
}

function renderCheckSVG(className = 'w-4 h-4 inline') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function ArrangementModal({
  contract,
  selectedItemIds,
  onClose,
  onComplete,
  playSfx
}: ArrangementModalProps) {
  const GRID_SIZE = 6;

  const furnitureList = selectedItemIds
    .map(id => FURNITURE_ITEMS.find(item => item.id === id))
    .filter((item): item is FurnitureItem => item !== undefined);

  const [placedItems, setPlacedItems] = useState<PlacedArrangementItem[]>(() => {
    return furnitureList.map((item, index) => {
      const x = (index * 2) % GRID_SIZE;
      const y = Math.floor((index * 2) / GRID_SIZE) * 2;
      return {
        instanceId: `arr_${item.id}_${index}`,
        itemTypeId: item.id,
        x,
        y: Math.min(y, GRID_SIZE - item.height),
        rotation: 0
      };
    });
  });

  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<{
    stars: number;
    bonusCoins: number;
    bonusScore: number;
    feedbackMsg: string;
  } | null>(null);

  const handleRotate = (instanceId: string) => {
    playSfx('flip');
    setPlacedItems(prev =>
      prev.map(item => {
        if (item.instanceId === instanceId) {
          const nextRot = ((item.rotation + 90) % 360) as 0 | 90 | 180 | 270;
          return { ...item, rotation: nextRot };
        }
        return item;
      })
    );
  };

  const handleCellClick = (targetX: number, targetY: number) => {
    if (!selectedInstanceId) return;

    const itemObj = placedItems.find(i => i.instanceId === selectedInstanceId);
    if (!itemObj) return;

    const furnitureDef = FURNITURE_ITEMS.find(f => f.id === itemObj.itemTypeId);
    if (!furnitureDef) return;

    const newX = Math.max(0, Math.min(GRID_SIZE - furnitureDef.width, targetX));
    const newY = Math.max(0, Math.min(GRID_SIZE - furnitureDef.height, targetY));

    playSfx('click');
    setPlacedItems(prev =>
      prev.map(item =>
        item.instanceId === selectedInstanceId ? { ...item, x: newX, y: newY } : item
      )
    );
  };

  const evaluateAesthetics = () => {
    let scorePoints = 0;

    const occupiedCells = new Set<string>();
    let hasOverlap = false;

    placedItems.forEach(item => {
      const def = FURNITURE_ITEMS.find(f => f.id === item.itemTypeId);
      const w = def?.width || 1;
      const h = def?.height || 1;

      for (let dx = 0; dx < w; dx++) {
        for (let dy = 0; dy < h; dy++) {
          const cellKey = `${item.x + dx},${item.y + dy}`;
          if (occupiedCells.has(cellKey)) {
            hasOverlap = true;
          } else {
            occupiedCells.add(cellKey);
          }
        }
      }
    });

    if (!hasOverlap) scorePoints += 2;

    let wallAligned = false;
    placedItems.forEach(item => {
      const def = FURNITURE_ITEMS.find(f => f.id === item.itemTypeId);
      if (def?.category === 'bed' || def?.category === 'decor' || def?.category === 'table') {
        if (item.x === 0 || item.y === 0 || item.x + (def.width || 1) === GRID_SIZE || item.y + (def.height || 1) === GRID_SIZE) {
          wallAligned = true;
        }
      }
    });
    if (wallAligned) scorePoints += 1;

    let goodDecorProximity = false;
    const decors = placedItems.filter(i => {
      const cat = FURNITURE_ITEMS.find(f => f.id === i.itemTypeId)?.category;
      return cat === 'plant' || cat === 'light' || cat === 'rug';
    });
    const mainFurniture = placedItems.filter(i => {
      const cat = FURNITURE_ITEMS.find(f => f.id === i.itemTypeId)?.category;
      return cat === 'bed' || cat === 'table' || cat === 'chair';
    });

    if (decors.length > 0 && mainFurniture.length > 0) {
      decors.forEach(d => {
        mainFurniture.forEach(m => {
          const dist = Math.abs(d.x - m.x) + Math.abs(d.y - m.y);
          if (dist <= 2) goodDecorProximity = true;
        });
      });
    } else {
      goodDecorProximity = true;
    }
    if (goodDecorProximity) scorePoints += 1;

    if (placedItems.length > 1) {
      const xs = placedItems.map(i => i.x);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      if (maxX - minX >= 1) scorePoints += 1;
    } else {
      scorePoints += 1;
    }

    let stars = 1;
    if (scorePoints >= 4) stars = 3;
    else if (scorePoints >= 2) stars = 2;

    const bonusMultiplier = stars === 3 ? 0.5 : stars === 2 ? 0.25 : 0;
    const bonusCoins = Math.round(contract.rewardCoins * bonusMultiplier);
    const bonusScore = Math.round(contract.rewardScore * bonusMultiplier);

    let feedbackMsg = '';
    if (stars === 3) {
      feedbackMsg = `Khách hàng ${contract.clientName} vô cùng khen ngợi gu thẩm mỹ tinh tế của Vy! Phòng được bố trí cực kỳ hoàn hảo!`;
      playSfx('perfect');
    } else if (stars === 2) {
      feedbackMsg = `Khách hàng ${contract.clientName} rất hài lòng với cách sắp xếp gọn gàng của Vy!`;
      playSfx('success');
    } else {
      feedbackMsg = `Khách hàng ${contract.clientName} đã nhận bàn giao phòng thành công!`;
      playSfx('success');
    }

    setEvalResult({ stars, bonusCoins, bonusScore, feedbackMsg });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#fffbeb] border-4 border-[#1f2937] rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4">
          <div>
            <span className="bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
              Bản vẽ phác thảo 2D
            </span>
            <h2 className="text-lg font-serif font-black text-[#1f2937] mt-1">
              Sắp Xếp Nội Thất Cho Khách Hàng {contract.clientName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-200 border-2 border-rose-400 text-rose-700 font-bold flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Hướng dẫn ngắn */}
        <p className="text-xs text-amber-800 font-medium mb-4 bg-amber-100/70 p-2.5 rounded-xl border border-amber-300/60">
          <b>Hướng dẫn:</b> Hãy nhấp chọn món đồ ở dưới, sau đó nhấp vào vị trí trong phòng để sắp xếp gọn gàng và đẹp mắt nhé. Bố trí càng hài hòa thì khách hàng càng thích và thưởng thêm nhiều Xu!
        </p>

        {/* Khu vực phòng 2D Canvas Lưới 6x6 */}
        <div className="relative mx-auto bg-[#fef3c7] border-4 border-[#78350f] rounded-2xl p-2 shadow-inner w-[320px] h-[320px] grid grid-cols-6 grid-rows-6 gap-1 mb-4">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, cellIdx) => {
            const cx = cellIdx % GRID_SIZE;
            const cy = Math.floor(cellIdx / GRID_SIZE);

            return (
              <div
                key={cellIdx}
                onClick={() => handleCellClick(cx, cy)}
                className="w-full h-full border border-amber-300/40 rounded hover:bg-amber-300/50 cursor-pointer transition relative"
              />
            );
          })}

          {/* Render các món đồ đã đặt trên lưới */}
          {placedItems.map(item => {
            const def = FURNITURE_ITEMS.find(f => f.id === item.itemTypeId);
            if (!def) return null;

            const isSelected = selectedInstanceId === item.instanceId;
            const widthPct = (def.width / GRID_SIZE) * 100;
            const heightPct = (def.height / GRID_SIZE) * 100;
            const leftPct = (item.x / GRID_SIZE) * 100;
            const topPct = (item.y / GRID_SIZE) * 100;

            return (
              <div
                key={item.instanceId}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInstanceId(item.instanceId);
                  playSfx('click');
                }}
                style={{
                  position: 'absolute',
                  width: `calc(${widthPct}% - 4px)`,
                  height: `calc(${heightPct}% - 4px)`,
                  left: `calc(${leftPct}% + 2px)`,
                  top: `calc(${topPct}% + 2px)`,
                }}
                className={`group cursor-grab active:cursor-grabbing rounded-lg p-1 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'ring-4 ring-rose-500 ring-offset-2 bg-amber-200/80 shadow-lg z-20 scale-105'
                    : 'hover:ring-2 hover:ring-amber-400 bg-amber-100/60 z-10'
                }`}
              >
                {renderFurnitureSVG(item.itemTypeId, item.rotation, 'w-full h-full object-contain')}

                {/* Phím xoay nhanh khi đang chọn món đồ */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRotate(item.instanceId);
                    }}
                    className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md text-[10px] font-black z-30 flex items-center justify-center"
                    title="Xoay 90 độ"
                  >
                    {renderRotateSVG()}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Thanh công cụ chọn & thao tác đồ đạc */}
        <div className="flex items-center justify-between bg-amber-100 p-3 rounded-2xl border-2 border-amber-300 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-amber-900 whitespace-nowrap">Đồ đạc:</span>
            {placedItems.map(item => {
              const def = FURNITURE_ITEMS.find(f => f.id === item.itemTypeId);
              const isSelected = selectedInstanceId === item.instanceId;

              return (
                <button
                  key={item.instanceId}
                  onClick={() => {
                    setSelectedInstanceId(item.instanceId);
                    playSfx('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-700 shadow-md'
                      : 'bg-white text-gray-800 border-amber-300 hover:bg-amber-200'
                  }`}
                >
                  <span>{def?.nameVietnamese}</span>
                  {isSelected && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRotate(item.instanceId);
                      }}
                      className="bg-white/30 hover:bg-white/50 rounded-full px-1.5 py-0.5 text-[10px] flex items-center gap-1"
                      title="Xoay đồ đạc"
                    >
                      {renderRotateSVG()} Xoay
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={evaluateAesthetics}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wide rounded-xl border-2 border-emerald-700 shadow-md active:translate-y-0.5 transition whitespace-nowrap flex items-center gap-1.5"
          >
            {renderCheckSVG()} Đánh Giá & Hoàn Thành
          </button>
        </div>

        {/* Overlay Kết Quả Đánh Giá Thẩm Mỹ */}
        {evalResult && (
          <div className="absolute inset-0 bg-amber-950/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-pop-in">
            <div className="bg-[#fffbeb] border-4 border-amber-400 rounded-3xl p-6 max-w-md w-full text-center shadow-2xl">
              <div className="flex justify-center items-center gap-1 mb-2">
                {Array.from({ length: evalResult.stars }).map((_, i) => (
                  <span key={i} className="inline-block animate-bounce" style={{ animationDelay: `${i * 150}ms` }}>
                    {renderStarSVG('w-8 h-8 text-amber-400 fill-current')}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-serif font-black text-[#1f2937] mb-2">
                {evalResult.stars === 3
                  ? 'Tuyệt Đẹp! Thẩm Mỹ Xuất Sắc!'
                  : evalResult.stars === 2
                  ? 'Bố Trí Rất Đẹp Mắt!'
                  : 'Hoàn Thành Thiết Kế!'}
              </h3>

              <p className="text-xs text-amber-900 font-medium mb-4 bg-amber-100 p-3 rounded-2xl border border-amber-300">
                "{evalResult.feedbackMsg}"
              </p>

              <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 mb-5 text-xs text-left space-y-1.5 font-bold">
                <div className="flex justify-between text-gray-700">
                  <span>Xu hợp đồng cơ bản:</span>
                  <span>+{contract.rewardCoins} Xu</span>
                </div>
                {evalResult.bonusCoins > 0 && (
                  <div className="flex justify-between text-emerald-600 font-black items-center">
                    <span>Bonus Thẩm Mỹ ({evalResult.stars === 3 ? '+50%' : '+25%'}):</span>
                    <span className="flex items-center gap-1">+{evalResult.bonusCoins} Xu {renderStarSVG('w-3.5 h-3.5 text-amber-400 fill-current')}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-1.5 flex justify-between text-amber-900 font-black text-sm">
                  <span>Tổng Xu nhận được:</span>
                  <span className="text-amber-600 font-serif">+{contract.rewardCoins + evalResult.bonusCoins} Xu</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onComplete(
                    evalResult.stars,
                    evalResult.bonusCoins,
                    evalResult.bonusScore,
                    evalResult.feedbackMsg
                  );
                }}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-amber-700 shadow-lg active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                {renderCheckSVG()} Nhận Thưởng & Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
