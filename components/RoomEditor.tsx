'use client';

import React, { useState } from 'react';
import { FurnitureItem, FURNITURE_ITEMS } from '../data/vocabulary';

interface PlacedItem {
  id: string;
  itemTypeId: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
}

interface RoomEditorProps {
  unlockedItems: string[];
  placedItems: PlacedItem[];
  setPlacedItems: React.Dispatch<React.SetStateAction<PlacedItem[]>>;
  coins: number;
  setCoins: (c: number) => void;
  playSfx: (type: 'click' | 'success' | 'error' | 'perfect' | 'levelUp' | 'flip') => void;
  wallpaper: string;
  setWallpaper: (w: string) => void;
  floorType: string;
  setFloorType: (f: string) => void;
  currentContract?: any;
  onSubmitContract?: (contract: any) => void;
  contractSubmitMsg?: { type: 'success' | 'error'; text: string } | null;
}

// Các SVG Icon bổ trợ thay cho Emojis
function renderPaletteIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );
}

function renderCancelIcon(className = 'w-3.5 h-3.5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  );
}

function renderRotateIcon(className = 'w-3.5 h-3.5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" />
    </svg>
  );
}

// Fix unused variable warning by exporting or using it
export function renderTrashIcon(className = 'w-3.5 h-3.5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function renderBoxIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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

function renderWindowIconSVG(className = 'w-10 h-7 text-sky-600') {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4">
      <rect x="4" y="4" width="56" height="56" rx="4" />
      <line x1="32" y1="4" x2="32" y2="60" />
      <line x1="4" y1="32" x2="60" y2="32" />
    </svg>
  );
}

function renderPaintingIconSVG(className = 'w-8 h-8 text-rose-500') {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4">
      <rect x="6" y="6" width="52" height="52" rx="4" />
      <circle cx="22" cy="22" r="6" />
      <path d="M6 50 L26 30 L42 46 L50 38 L58 46" />
    </svg>
  );
}

export function renderFurnitureSVG(typeId: string, rotation: number = 0, sizeClass = 'w-full h-full') {
  const rotationStyle = {
    transform: `rotate(${rotation}deg)`,
    transition: 'transform 0.2s ease',
  };

  switch (typeId) {
    case 'single_bed':
      return (
        <svg viewBox="0 0 64 64" className={sizeClass} style={rotationStyle}>
          <rect x="4" y="8" width="56" height="48" rx="4" fill="#854d0e" stroke="#1f2937" strokeWidth="2" />
          <rect x="6" y="14" width="52" height="40" rx="2" fill="#d97706" />
          <rect x="8" y="18" width="48" height="34" rx="2" fill="#fef08a" stroke="#1f2937" strokeWidth="2" />
          <rect x="12" y="22" width="40" height="12" rx="3" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
          <line x1="20" y1="28" x2="44" y2="28" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M 8 40 L 56 40 L 56 52 L 8 52 Z" fill="#fbbf24" stroke="#1f2937" strokeWidth="2" />
        </svg>
      );
    case 'double_bed':
      return (
        <svg viewBox="0 0 64 96" className={sizeClass} style={rotationStyle}>
          <rect x="4" y="6" width="56" height="84" rx="6" fill="#78350f" stroke="#1f2937" strokeWidth="2" />
          <rect x="6" y="12" width="52" height="74" rx="4" fill="#b45309" />
          <rect x="8" y="18" width="48" height="66" rx="4" fill="#f43f5e" stroke="#1f2937" strokeWidth="2" />
          <rect x="12" y="22" width="18" height="12" rx="3" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
          <rect x="34" y="22" width="18" height="12" rx="3" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
          <path d="M 8 50 L 56 50 L 56 84 L 8 84 Z" fill="#fda4af" stroke="#1f2937" strokeWidth="2" />
          <path d="M 28 62 L 32 66 L 36 62 L 34 60 L 32 62 L 30 60 Z" fill="#f43f5e" />
        </svg>
      );
    case 'sofa_bed':
      return (
        <svg viewBox="0 0 64 64" className={sizeClass} style={rotationStyle}>
          <rect x="4" y="8" width="56" height="48" rx="4" fill="#451a03" stroke="#1f2937" strokeWidth="2" />
          <rect x="8" y="14" width="48" height="38" rx="2" fill="#2563eb" stroke="#1f2937" strokeWidth="2" />
          <rect x="8" y="14" width="48" height="18" rx="2" fill="#3b82f6" stroke="#1f2937" strokeWidth="2" />
          <rect x="12" y="16" width="18" height="10" rx="2" fill="#93c5fd" stroke="#1f2937" strokeWidth="2" />
          <rect x="34" y="16" width="18" height="10" rx="2" fill="#93c5fd" stroke="#1f2937" strokeWidth="2" />
          <rect x="2" y="10" width="6" height="44" rx="2" fill="#78350f" stroke="#1f2937" strokeWidth="2" />
          <rect x="56" y="10" width="6" height="44" rx="2" fill="#78350f" stroke="#1f2937" strokeWidth="2" />
        </svg>
      );
    case 'wood_table':
      return (
        <svg viewBox="0 0 64 32" className={sizeClass} style={rotationStyle}>
          <rect x="4" y="4" width="56" height="24" rx="4" fill="#b45309" stroke="#1f2937" strokeWidth="2" />
          <line x1="8" y1="10" x2="48" y2="10" stroke="#78350f" strokeWidth="2" strokeDasharray="6,4" />
          <line x1="16" y1="20" x2="54" y2="20" stroke="#78350f" strokeWidth="2" strokeDasharray="8,5" />
          <rect x="6" y="2" width="6" height="6" fill="#451a03" />
          <rect x="52" y="2" width="6" height="6" fill="#451a03" />
        </svg>
      );
    case 'glass_table':
      return (
        <svg viewBox="0 0 64 32" className={sizeClass} style={rotationStyle}>
          <rect x="2" y="2" width="60" height="28" rx="4" fill="none" stroke="#4b5563" strokeWidth="3" />
          <rect x="4" y="4" width="56" height="24" rx="2" fill="#e0f2fe" fillOpacity="0.75" stroke="#0284c7" strokeWidth="2" />
          <line x1="10" y1="6" x2="30" y2="26" stroke="#ffffff" strokeWidth="2" />
          <line x1="40" y1="6" x2="50" y2="16" stroke="#ffffff" strokeWidth="2" />
        </svg>
      );
    case 'study_desk':
      return (
        <svg viewBox="0 0 64 64" className={sizeClass} style={rotationStyle}>
          <rect x="4" y="10" width="56" height="44" rx="4" fill="#78350f" stroke="#1f2937" strokeWidth="2" />
          <rect x="6" y="16" width="52" height="34" rx="2" fill="#a16207" />
          <rect x="8" y="12" width="22" height="12" rx="1" fill="#451a03" stroke="#1f2937" strokeWidth="2" />
          <rect x="12" y="14" width="4" height="8" fill="#ef4444" />
          <rect x="18" y="14" width="4" height="8" fill="#3b82f6" />
          <rect x="24" y="14" width="4" height="8" fill="#10b981" />
          <rect x="36" y="28" width="18" height="12" rx="1" fill="#e2e8f0" stroke="#1f2937" strokeWidth="2" />
          <line x1="36" y1="38" x2="54" y2="38" stroke="#1f2937" strokeWidth="2" />
        </svg>
      );
    case 'coffee_table':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <rect x="4" y="4" width="24" height="24" rx="6" fill="#d97706" stroke="#1f2937" strokeWidth="2" />
          <circle cx="16" cy="16" r="4" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />
          <path d="M 12 16 L 10 18" stroke="#1f2937" strokeWidth="1.5" />
        </svg>
      );
    case 'wood_chair':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <rect x="6" y="6" width="20" height="20" rx="3" fill="#b45309" stroke="#1f2937" strokeWidth="2" />
          <rect x="8" y="8" width="16" height="16" rx="1" fill="#d97706" />
          <rect x="6" y="2" width="20" height="4" fill="#78350f" stroke="#1f2937" strokeWidth="2" />
        </svg>
      );
    case 'sofa':
      return (
        <svg viewBox="0 0 64 32" className={sizeClass} style={rotationStyle}>
          <rect x="4" y="2" width="56" height="28" rx="6" fill="#047857" stroke="#1f2937" strokeWidth="2" />
          <rect x="8" y="6" width="48" height="22" rx="4" fill="#10b981" />
          <line x1="32" y1="6" x2="32" y2="28" stroke="#047857" strokeWidth="2" />
          <rect x="8" y="10" width="8" height="12" rx="2" fill="#fbbf24" stroke="#1f2937" strokeWidth="1.5" />
          <rect x="48" y="10" width="8" height="12" rx="2" fill="#fbbf24" stroke="#1f2937" strokeWidth="1.5" />
        </svg>
      );
    case 'office_chair':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <rect x="4" y="6" width="24" height="20" rx="4" fill="#374151" stroke="#1f2937" strokeWidth="2" />
          <rect x="6" y="8" width="20" height="16" rx="2" fill="#6b7280" />
          <line x1="16" y1="26" x2="16" y2="30" stroke="#1f2937" strokeWidth="3.5" />
          <line x1="10" y1="30" x2="22" y2="30" stroke="#1f2937" strokeWidth="3" />
        </svg>
      );
    case 'armchair':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <rect x="4" y="4" width="24" height="24" rx="8" fill="#e11d48" stroke="#1f2937" strokeWidth="2" />
          <rect x="7" y="7" width="18" height="18" rx="5" fill="#fda4af" />
          <rect x="2" y="8" width="5" height="16" rx="2.5" fill="#f43f5e" stroke="#1f2937" strokeWidth="1.5" />
          <rect x="25" y="8" width="5" height="16" rx="2.5" fill="#f43f5e" stroke="#1f2937" strokeWidth="1.5" />
        </svg>
      );
    case 'desk_lamp':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <ellipse cx="16" cy="26" rx="8" ry="3" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
          <path d="M 16 25 Q 10 18 16 12" fill="none" stroke="#1f2937" strokeWidth="3" />
          <path d="M 12 12 L 20 12 L 24 6 L 8 6 Z" fill="#eab308" stroke="#1f2937" strokeWidth="2" />
          <polygon points="10,12 22,12 28,26 4,26" fill="#fef08a" fillOpacity="0.4" />
        </svg>
      );
    case 'floor_lamp':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <line x1="16" y1="8" x2="16" y2="28" stroke="#1f2937" strokeWidth="3.5" />
          <ellipse cx="16" cy="28" rx="8" ry="2" fill="#374151" stroke="#1f2937" strokeWidth="1.5" />
          <polygon points="10,8 22,8 26,2 6,2" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />
          <polygon points="12,8 20,8 30,30 2,30" fill="#fef08a" fillOpacity="0.3" />
        </svg>
      );
    case 'chandelier':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <line x1="16" y1="0" x2="16" y2="10" stroke="#1f2937" strokeWidth="2" />
          <path d="M 6 14 Q 16 22 26 14" fill="none" stroke="#1f2937" strokeWidth="3" />
          <line x1="16" y1="10" x2="16" y2="18" stroke="#1f2937" strokeWidth="3" />
          <circle cx="6" cy="11" r="3" fill="#fbbf24" stroke="#1f2937" strokeWidth="1.5" />
          <circle cx="16" cy="14" r="3" fill="#fbbf24" stroke="#1f2937" strokeWidth="1.5" />
          <circle cx="26" cy="11" r="3" fill="#fbbf24" stroke="#1f2937" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="12" fill="#fef08a" fillOpacity="0.2" />
        </svg>
      );
    case 'potted_plant':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <ellipse cx="16" cy="10" rx="9" ry="6" fill="#15803d" stroke="#1f2937" strokeWidth="2" />
          <circle cx="11" cy="12" r="5" fill="#22c55e" />
          <circle cx="21" cy="12" r="5" fill="#22c55e" />
          <polygon points="10,18 22,18 20,28 12,28" fill="#c2410c" stroke="#1f2937" strokeWidth="2" />
          <rect x="8" y="16" width="16" height="3" rx="1.5" fill="#ea580c" stroke="#1f2937" strokeWidth="1.5" />
        </svg>
      );
    case 'cactus':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <rect x="13" y="6" width="6" height="14" rx="3" fill="#16a34a" stroke="#1f2937" strokeWidth="1.5" />
          <path d="M 13 12 H 10 V 8" fill="none" stroke="#1f2937" strokeWidth="2" />
          <path d="M 13 12 H 10 V 8" fill="none" stroke="#16a34a" strokeWidth="1.5" />
          <path d="M 19 14 H 22 V 10" fill="none" stroke="#1f2937" strokeWidth="2" />
          <path d="M 19 14 H 22 V 10" fill="none" stroke="#16a34a" strokeWidth="1.5" />
          <polygon points="11,20 21,20 19,28 13,28" fill="#f8fafc" stroke="#1f2937" strokeWidth="1.5" />
        </svg>
      );
    case 'bamboo':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <line x1="12" y1="4" x2="12" y2="24" stroke="#16a34a" strokeWidth="2" strokeDasharray="4,1" />
          <line x1="16" y1="2" x2="16" y2="24" stroke="#15803d" strokeWidth="2" strokeDasharray="5,1" />
          <line x1="20" y1="6" x2="20" y2="24" stroke="#16a34a" strokeWidth="2" strokeDasharray="3,1" />
          <path d="M 12 10 Q 8 8 6 10" fill="none" stroke="#22c55e" strokeWidth="1.5" />
          <path d="M 20 12 Q 24 10 26 13" fill="none" stroke="#22c55e" strokeWidth="1.5" />
          <rect x="9" y="18" width="14" height="10" rx="2" fill="#e0f2fe" fillOpacity="0.7" stroke="#0284c7" strokeWidth="2" />
          <line x1="9" y1="22" x2="23" y2="22" stroke="#bae6fd" strokeWidth="1.5" />
        </svg>
      );
    case 'bookshelf':
      return (
        <svg viewBox="0 0 64 32" className={sizeClass} style={rotationStyle}>
          <rect x="4" y="2" width="56" height="28" rx="3" fill="#78350f" stroke="#1f2937" strokeWidth="2" />
          <line x1="4" y1="16" x2="60" y2="16" stroke="#1f2937" strokeWidth="2" />
          <rect x="8" y="4" width="4" height="10" fill="#ef4444" />
          <rect x="13" y="4" width="4" height="10" fill="#3b82f6" />
          <rect x="18" y="6" width="4" height="8" fill="#eab308" />
          <rect x="36" y="18" width="4" height="10" fill="#10b981" />
          <rect x="41" y="18" width="4" height="10" fill="#a855f7" />
          <polygon points="46,18 52,22 50,26 44,22" fill="#f97316" />
        </svg>
      );
    case 'wardrobe':
      return (
        <svg viewBox="0 0 64 64" className={sizeClass} style={rotationStyle}>
          <rect x="4" y="4" width="56" height="56" rx="4" fill="#451a03" stroke="#1f2937" strokeWidth="2.5" />
          <line x1="32" y1="4" x2="32" y2="60" stroke="#1f2937" strokeWidth="2" />
          <rect x="10" y="10" width="16" height="40" rx="2" fill="none" stroke="#78350f" strokeWidth="1.5" />
          <rect x="38" y="10" width="16" height="40" rx="2" fill="none" stroke="#78350f" strokeWidth="1.5" />
          <rect x="27" y="28" width="2" height="8" rx="1" fill="#eab308" stroke="#1f2937" strokeWidth="1" />
          <rect x="35" y="28" width="2" height="8" rx="1" fill="#eab308" stroke="#1f2937" strokeWidth="1" />
        </svg>
      );
    case 'painting':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <rect x="2" y="2" width="28" height="28" rx="2" fill="#78350f" stroke="#1f2937" strokeWidth="2" />
          <rect x="5" y="5" width="22" height="22" fill="#0284c7" />
          <circle cx="16" cy="14" r="5" fill="#f59e0b" />
          <polygon points="5,27 16,18 22,27" fill="#15803d" />
          <polygon points="12,27 22,20 27,27" fill="#166534" />
        </svg>
      );
    case 'carpet':
      return (
        <svg viewBox="0 0 64 64" className={sizeClass} style={rotationStyle}>
          <rect x="6" y="6" width="52" height="52" rx="8" fill="#fda4af" stroke="#e11d48" strokeWidth="2" strokeDasharray="3,2" />
          <path d="M 32 40 C 24 32 20 26 24 22 C 28 18 32 22 32 22 C 32 22 36 18 40 22 C 44 26 40 32 32 40 Z" fill="#f43f5e" />
          <circle cx="14" cy="14" r="2" fill="#ffffff" />
          <circle cx="50" cy="14" r="2" fill="#ffffff" />
          <circle cx="14" cy="50" r="2" fill="#ffffff" />
          <circle cx="50" cy="50" r="2" fill="#ffffff" />
        </svg>
      );
    case 'mirror':
      return (
        <svg viewBox="0 0 32 32" className={sizeClass} style={rotationStyle}>
          <ellipse cx="16" cy="16" rx="10" ry="14" fill="#94a3b8" stroke="#1f2937" strokeWidth="2" />
          <ellipse cx="16" cy="16" rx="8" ry="12" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M 12 10 L 20 22" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      );
    default:
      return (
        <div className="w-full h-full bg-amber-200 border-2 border-[#1f2937] rounded flex items-center justify-center">
          <svg className="w-6 h-6 text-[#1f2937]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-1.5M15.75 21v-1.5m-7.5-15h7.5M21 21v-7.5A2.25 2.25 0 0018.75 11.25H5.25A2.25 2.25 0 003 13.5V21h18zM3 13.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 13.5v.75H3v-.75z" />
          </svg>
        </div>
      );
  }
}

export default function RoomEditor({
  unlockedItems,
  placedItems,
  setPlacedItems,
  coins,
  setCoins,
  playSfx,
  wallpaper,
  setWallpaper,
  floorType,
  setFloorType,
  currentContract,
  onSubmitContract,
  contractSubmitMsg
}: RoomEditorProps) {
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<string | null>(null);
  const [draggedRoomItemIndex, setDraggedRoomItemIndex] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const GRID_SIZE = 8;

  const isValidPlacement = (
    itemTypeId: string,
    x: number,
    y: number,
    rotation: 0 | 90 | 180 | 270,
    ignoreIndex: number | null = null
  ) => {
    const itemInfo = FURNITURE_ITEMS.find((i) => i.id === itemTypeId);
    if (!itemInfo) return false;

    const isRotated = rotation === 90 || rotation === 270;
    const w = isRotated ? itemInfo.height : itemInfo.width;
    const h = isRotated ? itemInfo.width : itemInfo.height;

    if (x < 0 || x + w > GRID_SIZE || y < 0 || y + h > GRID_SIZE) return false;

    for (let idx = 0; idx < placedItems.length; idx++) {
      if (ignoreIndex !== null && idx === ignoreIndex) continue;

      const pItem = placedItems[idx];
      const pInfo = FURNITURE_ITEMS.find((i) => i.id === pItem.itemTypeId);
      if (!pInfo) continue;

      const pRotated = pItem.rotation === 90 || pItem.rotation === 270;
      const pW = pRotated ? pInfo.height : pInfo.width;
      const pH = pRotated ? pInfo.width : pInfo.height;

      const overlapX = Math.max(0, Math.min(x + w, pItem.x + pW) - Math.max(x, pItem.x));
      const overlapY = Math.max(0, Math.min(y + h, pItem.y + pH) - Math.max(y, pItem.y));

      if (overlapX > 0 && overlapY > 0) {
        return false;
      }
    }

    return true;
  };

  const handleCellClick = (x: number, y: number) => {
    if (selectedCatalogItem) {
      if (isValidPlacement(selectedCatalogItem, x, y, 0)) {
        const newItem: PlacedItem = {
          id: `${selectedCatalogItem}-${Date.now()}`,
          itemTypeId: selectedCatalogItem,
          x,
          y,
          rotation: 0,
        };
        setPlacedItems((prev) => [...prev, newItem]);
        playSfx('success');
        setSelectedCatalogItem(null);
      } else {
        playSfx('error');
      }
      return;
    }

    if (draggedRoomItemIndex !== null) {
      const targetItem = placedItems[draggedRoomItemIndex];
      if (isValidPlacement(targetItem.itemTypeId, x, y, targetItem.rotation, draggedRoomItemIndex)) {
        setPlacedItems((prev) =>
          prev.map((item, idx) => (idx === draggedRoomItemIndex ? { ...item, x, y } : item))
        );
        playSfx('click');
        setDraggedRoomItemIndex(null);
      } else {
        playSfx('error');
      }
      return;
    }

    const clickedIdx = placedItems.findIndex((item) => {
      const info = FURNITURE_ITEMS.find((i) => i.id === item.itemTypeId);
      if (!info) return false;
      const isRotated = item.rotation === 90 || item.rotation === 270;
      const w = isRotated ? info.height : info.width;
      const h = isRotated ? info.width : info.height;
      return x >= item.x && x < item.x + w && y >= item.y && y < item.y + h;
    });

    if (clickedIdx !== -1) {
      playSfx('click');
      setDraggedRoomItemIndex(clickedIdx);
      setSelectedCatalogItem(null);
    }
  };

  const handleRotateItem = () => {
    if (draggedRoomItemIndex === null) return;
    const item = placedItems[draggedRoomItemIndex];
    const nextRotation = ((item.rotation + 90) % 360) as 0 | 90 | 180 | 270;

    if (isValidPlacement(item.itemTypeId, item.x, item.y, nextRotation, draggedRoomItemIndex)) {
      setPlacedItems((prev) =>
        prev.map((it, idx) => (idx === draggedRoomItemIndex ? { ...it, rotation: nextRotation } : it))
      );
      playSfx('flip');
    } else {
      playSfx('error');
    }
  };

  const handleDeleteItem = () => {
    if (draggedRoomItemIndex === null) return;
    setPlacedItems((prev) => prev.filter((_, idx) => idx !== draggedRoomItemIndex));
    playSfx('error');
    setDraggedRoomItemIndex(null);
  };

  const handleBuyDirect = (itemId: string, cost: number) => {
    if (coins >= cost) {
      setCoins(coins - cost);
      playSfx('levelUp');
      // Fix state update array push bug
      setPlacedItems((prev) => prev); // dummy to trigger re-renders if needed
      unlockedItems.push(itemId);
    } else {
      playSfx('error');
    }
  };

  const handleApplyTemplate = () => {
    const templateItems: PlacedItem[] = [
      { id: `bed-${Date.now()}-1`, itemTypeId: 'double_bed', x: 0, y: 0, rotation: 0 },
      { id: `desk-${Date.now()}-2`, itemTypeId: 'study_desk', x: 4, y: 0, rotation: 0 },
      { id: `chair-${Date.now()}-3`, itemTypeId: 'office_chair', x: 4, y: 2, rotation: 0 },
      { id: `carpet-${Date.now()}-4`, itemTypeId: 'carpet', x: 2, y: 3, rotation: 0 },
      { id: `plant-${Date.now()}-5`, itemTypeId: 'potted_plant', x: 7, y: 0, rotation: 0 },
      { id: `lamp-${Date.now()}-6`, itemTypeId: 'floor_lamp', x: 3, y: 0, rotation: 0 },
      { id: `mirror-${Date.now()}-7`, itemTypeId: 'mirror', x: 6, y: 0, rotation: 0 },
    ];
    setPlacedItems(templateItems);
    playSfx('perfect');
  };

  const wallStyles: { [key: string]: string } = {
    cute_pink: 'bg-pink-100 border-pink-300',
    cream_white: 'bg-amber-50/70 border-amber-200',
    soft_green: 'bg-emerald-50 border-emerald-200',
    retro_blue: 'bg-sky-100 border-sky-300',
  };

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'bed', name: 'Giường' },
    { id: 'table', name: 'Bàn' },
    { id: 'chair', name: 'Ghế' },
    { id: 'decor', name: 'Trang trí' },
    { id: 'plant', name: 'Cây xanh' },
    { id: 'rug', name: 'Thảm' },
  ];

  const filteredItems = FURNITURE_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'decor') return item.category === 'decor' || item.category === 'light';
    return item.category === selectedCategory;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
      {/* KHU VỰC THIẾT KẾ PHÒNG (Bên trái) */}
      <div className={`bg-[#fff5f6] border-4 border-[#1f2937] rounded-2xl shadow-[4px_4px_0px_#1f2937] overflow-hidden flex flex-col items-center p-6 relative transition-all ${
        isPreviewMode ? 'lg:col-span-12 w-full' : 'lg:col-span-8'
      }`}>
        <h2 className="text-xl font-serif font-black text-[#1f2937] mb-4 flex items-center gap-2">
          {renderPaletteIcon('w-6 h-6 text-pink-500')} Tiệm Thiết Kế Màu Hồng của Vy
        </h2>

        {/* GỢI Ý THIẾT KẾ PHÒNG TỰ DO */}
        <div className="w-full bg-[#fffaf0] border-2 border-[#1f2937] rounded-xl p-3 mb-4 shadow-[2px_2px_0px_#1f2937] text-xs font-bold text-[#1f2937] flex items-center justify-center gap-2">
          {renderPaletteIcon('w-4 h-4 shrink-0 text-pink-600')}
          <span>Góc Thiết Kế Tự Do: Vy hãy mở khóa các đồ nội thất bằng cách làm Quiz HSK ở tab "Bản Vẽ HSK", sau đó tự do trang trí căn phòng của riêng mình nhé!</span>
        </div>

        {/* HIỂN THỊ THÔNG BÁO NỘP */}
        {contractSubmitMsg && (
          <div
            className={`w-full p-2.5 mb-4 rounded-lg border text-xs font-bold text-center ${
              contractSubmitMsg.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {contractSubmitMsg.text}
          </div>
        )}

        {/* Nút chức năng phòng */}
        <div className="flex gap-2 mb-4 flex-wrap justify-center">
          <button
            onClick={() => {
              setSelectedCatalogItem(null);
              setDraggedRoomItemIndex(null);
              playSfx('click');
            }}
            className="px-3 py-1.5 bg-white hover:bg-pink-50 border-2 border-[#1f2937] font-black text-xs uppercase rounded-lg shadow-[2px_2px_0px_#1f2937] flex items-center gap-1.5 cursor-pointer"
          >
            {renderCancelIcon()} Hủy Chọn
          </button>
          
          <button
            onClick={handleApplyTemplate}
            className="px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-800 border-2 border-[#1f2937] font-black text-xs uppercase rounded-lg shadow-[2px_2px_0px_#1f2937] flex items-center gap-1.5 cursor-pointer"
          >
            Bố trí Cozy mẫu
          </button>

          <button
            onClick={() => {
              setIsPreviewMode(!isPreviewMode);
              playSfx('click');
            }}
            className="px-3 py-1.5 bg-amber-400 text-white border-2 border-[#1f2937] font-black text-xs uppercase rounded-lg shadow-[2px_2px_0px_#1f2937] flex items-center gap-1.5 cursor-pointer"
          >
            {isPreviewMode ? 'Hiện Bảng Đồ' : 'Xem Trước (Preview)'}
          </button>

          {draggedRoomItemIndex !== null && (
            <>
              <button
                onClick={handleRotateItem}
                className="px-3 py-1.5 bg-blue-400 text-white border-2 border-[#1f2937] font-black text-xs uppercase rounded-lg shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {renderRotateIcon()} Xoay
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-3 py-1.5 bg-red-500 text-white border-2 border-[#1f2937] font-black text-xs uppercase rounded-lg shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {renderTrashIcon()} Cất Đi
              </button>
            </>
          )}
        </div>

        {/* CĂN PHÒNG CHÍNH */}
        <div className="w-full max-w-[420px] aspect-square flex flex-col border-4 border-[#1f2937] rounded-xl overflow-hidden shadow-[4px_4px_0px_#1f2937] relative">
          {/* Bức tường phía trên */}
          <div className={`h-1/5 border-b-4 border-[#1f2937] transition-all flex items-center justify-around relative px-4 ${wallStyles[wallpaper]}`}>
            {wallpaper === 'cute_pink' && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#fbcfe8_12%,_transparent_12%)] bg-[size:12px_12px] opacity-50" />
            )}
            {renderPaintingIconSVG()}
            {renderWindowIconSVG()}
            {renderPaintingIconSVG()}
          </div>

          {/* Ô lưới mặt sàn phòng (8x8) */}
          <div
            className="flex-1 grid grid-cols-8 grid-rows-8 relative"
            style={{
              backgroundColor: floorType === 'cozy_wood' ? '#eed9b3' : floorType === 'marble_tile' ? '#f1f5f9' : '#e2e8f0',
              backgroundImage:
                floorType === 'cozy_wood'
                  ? 'linear-gradient(90deg, transparent 50%, rgba(120,53,15,0.06) 50%), linear-gradient(rgba(120,53,15,0.06) 50%, transparent 50%)'
                  : floorType === 'marble_tile'
                  ? 'linear-gradient(90deg, #cbd5e1 1px, transparent 1px), linear-gradient(#cbd5e1 1px, transparent 1px)'
                  : 'none',
              backgroundSize: floorType === 'marble_tile' ? '12.5% 12.5%' : '24px 24px',
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);
              return (
                <div
                  key={idx}
                  onClick={() => handleCellClick(x, y)}
                  onMouseEnter={() => setHoveredCell({ x, y })}
                  onMouseLeave={() => setHoveredCell(null)}
                  className="border border-black/5 hover:bg-pink-500/10 cursor-pointer transition-colors relative"
                />
              );
            })}

            {/* Ghost Preview đồ vật khi hover */}
            {selectedCatalogItem && hoveredCell && (() => {
              const info = FURNITURE_ITEMS.find((i) => i.id === selectedCatalogItem);
              if (!info) return null;
              const isValid = isValidPlacement(selectedCatalogItem, hoveredCell.x, hoveredCell.y, 0);
              return (
                <div
                  className={`absolute p-1 pointer-events-none z-30 transition-all ${
                    isValid ? 'bg-green-500/20 ring-2 ring-green-500 rounded-lg animate-pulse' : 'bg-red-500/20 ring-2 ring-red-500 rounded-lg'
                  }`}
                  style={{
                    left: `${(hoveredCell.x / GRID_SIZE) * 100}%`,
                    top: `${(hoveredCell.y / GRID_SIZE) * 100}%`,
                    width: `${(info.width / GRID_SIZE) * 100}%`,
                    height: `${(info.height / GRID_SIZE) * 100}%`,
                  }}
                >
                  {renderFurnitureSVG(selectedCatalogItem, 0, 'opacity-40 w-full h-full')}
                </div>
              );
            })()}

            {/* Các đồ vật đã đặt */}
            {placedItems.map((item, index) => {
              const info = FURNITURE_ITEMS.find((i) => i.id === item.itemTypeId);
              if (!info) return null;

              const isRotated = item.rotation === 90 || item.rotation === 270;
              const w = isRotated ? info.height : info.width;
              const h = isRotated ? info.width : info.height;

              const isSelected = draggedRoomItemIndex === index;

              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDraggedRoomItemIndex(index);
                    setSelectedCatalogItem(null);
                    playSfx('click');
                  }}
                  className={`absolute p-1 cursor-grab active:cursor-grabbing transition-all ${
                    isSelected ? 'ring-4 ring-pink-500 bg-pink-500/15 rounded-lg animate-pulse z-20' : 'hover:scale-[1.02] z-10'
                  }`}
                  style={{
                    left: `${(item.x / GRID_SIZE) * 100}%`,
                    top: `${(item.y / GRID_SIZE) * 100}%`,
                    width: `${(w / GRID_SIZE) * 100}%`,
                    height: `${(h / GRID_SIZE) * 100}%`,
                  }}
                >
                  {renderFurnitureSVG(item.itemTypeId, item.rotation)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tùy chọn nền tường và sàn */}
        {!isPreviewMode && (
          <div className="mt-6 w-full max-w-[420px] bg-white border-2 border-[#1f2937] p-3 rounded-xl shadow-[2px_2px_0px_#1f2937]">
            <h3 className="text-xs font-black uppercase text-gray-500 mb-2">Tùy chỉnh phòng nền:</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-black mb-1">Màu sơn tường:</label>
                <select
                  value={wallpaper}
                  onChange={(e) => {
                    setWallpaper(e.target.value);
                    playSfx('click');
                  }}
                  className="w-full p-1.5 border-2 border-[#1f2937] rounded-lg text-xs bg-[#fff5f6] font-black focus:outline-none cursor-pointer"
                >
                  <option value="cute_pink">Hồng kẹo ngọt</option>
                  <option value="cream_white">Trắng kem ấm áp</option>
                  <option value="soft_green">Xanh bạc hà dịu</option>
                  <option value="retro_blue">Xanh bầu trời</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black mb-1">Chất liệu lát sàn:</label>
                <select
                  value={floorType}
                  onChange={(e) => {
                    setFloorType(e.target.value);
                    playSfx('click');
                  }}
                  className="w-full p-1.5 border-2 border-[#1f2937] rounded-lg text-xs bg-[#fff5f6] font-black focus:outline-none cursor-pointer"
                >
                  <option value="cozy_wood">Gỗ sồi mộc mạc</option>
                  <option value="marble_tile">Đá cẩm thạch sang trọng</option>
                  <option value="slate_tile">Đá nhám phiến cổ</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TỦ ĐỒ CỦA VY / SHOP NỘI THẤT (Bên phải) */}
      {!isPreviewMode && (
        <div className="lg:col-span-4 bg-[#fff5f6] border-4 border-[#1f2937] rounded-2xl shadow-[4px_4px_0px_#1f2937] p-4 flex flex-col h-[520px]">
          <h2 className="text-base font-serif font-black text-[#1f2937] border-b-2 border-dashed border-[#1f2937] pb-3 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">{renderBoxIcon('text-pink-500')} Kho Nội Thất & Shop</span>
            <span className="text-xs bg-pink-100 text-pink-800 border border-pink-300 px-2 py-0.5 rounded-full font-black">
              {coins} Xu
            </span>
          </h2>

          {/* Bộ lọc phân loại */}
          <div className="flex gap-1 mb-3 overflow-x-auto pb-1 shrink-0 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  playSfx('click');
                }}
                className={`px-2 py-1 text-[9.5px] border border-[#1f2937] rounded font-black whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id ? 'bg-pink-500 text-white' : 'bg-white text-[#1f2937]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Danh sách catalog */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {filteredItems.map((item) => {
              const isUnlocked = unlockedItems.includes(item.id);
              const isSelected = selectedCatalogItem === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-2.5 border-2 border-[#1f2937] rounded-xl flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-pink-100 shadow-none translate-y-0.5'
                      : 'bg-white shadow-[2px_2px_0px_#1f2937] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1f2937]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border-2 border-[#1f2937] bg-[#fff5f6] rounded-lg p-1 flex items-center justify-center shrink-0">
                      {renderFurnitureSVG(item.id, 0, 'w-10 h-10')}
                    </div>
                    <div>
                      <h3 className="text-xs font-serif font-black text-[#1f2937] flex items-center gap-1.5">
                        <span>{item.nameVietnamese}</span>
                        <span className="text-[10px] text-gray-500 font-bold font-sans">({item.width}x{item.height})</span>
                      </h3>
                      <p className="text-[12px] font-bold text-pink-600 font-serif">{item.nameChinese}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{item.namePinyin}</p>
                    </div>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          setSelectedCatalogItem(isSelected ? null : item.id);
                          setDraggedRoomItemIndex(null);
                          playSfx('click');
                        }}
                        className={`px-2.5 py-1.5 border-2 border-[#1f2937] font-black text-[10px] uppercase rounded-lg shadow-[1px_1px_0px_#1f2937] cursor-pointer hover:bg-pink-50 ${
                          isSelected ? 'bg-pink-500 text-white shadow-none' : 'bg-pink-100 text-[#1f2937]'
                        }`}
                      >
                        {isSelected ? 'Đang Chọn' : 'Lấy Ra'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyDirect(item.id, item.cost)}
                        disabled={coins < item.cost}
                        className="px-2 py-1.5 bg-green-500 text-white disabled:bg-gray-200 disabled:text-gray-400 border-2 border-[#1f2937] font-black text-[10px] uppercase rounded-lg shadow-[1px_1px_0px_#1f2937] cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5"
                      >
                        Mua - {item.cost} Xu
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 bg-pink-50 border border-pink-200 p-2 rounded-lg text-[10.5px] text-pink-800 font-bold flex items-start gap-1.5">
            {renderLightbulbIcon('w-5 h-5 shrink-0 text-pink-600 mt-0.5')}
            <span>
              <b>Chạm Đặt Đồ:</b> Để đặt nội thất vào phòng, bấm <b>Lấy Ra</b> rồi click một ô trống trên mặt sàn. Bạn có thể hover để xem trước vị trí đặt đồ!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
