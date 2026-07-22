'use client';

import React, { useState, useEffect } from 'react';
import { getNotebooks, createNotebook, deleteNotebook, toggleWordInNotebook, Notebook } from '../lib/notebookHelper';
import { GENERAL_VOCAB_ITEMS, FURNITURE_ITEMS } from '../data/vocabulary';

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  playSfx: (type: 'click' | 'success' | 'flip') => void;
  onSelectNotebookToStudy?: (wordIds: string[], notebookName: string) => void;
  onPlayAudio?: (text: string) => void;
}

function renderBookIcon(className = 'w-5 h-5') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function renderPlusIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function renderTrashIcon(className = 'w-4 h-4') {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

export default function NotebookModal({
  isOpen,
  onClose,
  playSfx,
  onSelectNotebookToStudy,
  onPlayAudio,
}: NotebookModalProps) {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [newNotebookDesc, setNewNotebookDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const list = getNotebooks();
      setNotebooks(list);
      if (list.length > 0 && !activeNotebookId) {
        setActiveNotebookId(list[0].id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentNotebook = notebooks.find((n) => n.id === activeNotebookId) || notebooks[0];

  const allWordPool = [
    ...GENERAL_VOCAB_ITEMS,
    ...FURNITURE_ITEMS.map((f) => ({
      id: f.id,
      nameChinese: f.nameChinese,
      namePinyin: f.namePinyin,
      nameVietnamese: f.nameVietnamese,
      hskLevel: (f as any).hsk || 1,
    })),
  ];

  const currentWords = currentNotebook
    ? allWordPool.filter((w) => currentNotebook.wordIds.includes(w.id))
    : [];

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotebookName.trim()) return;
    const updated = createNotebook(newNotebookName.trim(), newNotebookDesc.trim());
    setNotebooks(updated);
    setActiveNotebookId(updated[0].id);
    setNewNotebookName('');
    setNewNotebookDesc('');
    setIsCreating(false);
    playSfx('success');
  };

  const handleDeleteCurrent = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sổ tay này không?')) {
      const updated = deleteNotebook(id);
      setNotebooks(updated);
      if (updated.length > 0) setActiveNotebookId(updated[0].id);
      else setActiveNotebookId(null);
      playSfx('click');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-3 border-[var(--line)] rounded-3xl shadow-[8px_8px_0_var(--line)] w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* HEADER MODAL */}
        <div className="bg-rose-500 text-white p-4 border-b-3 border-[var(--line)] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            {renderBookIcon('w-6 h-6 text-white')}
            <div>
              <h3 className="text-base font-black">Sổ Tay Từ Vựng HSK Cá Nhân</h3>
              <p className="text-[11px] font-bold text-rose-100">Quản lý sổ tay học tập theo từng mục tiêu của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-black text-sm flex items-center justify-center cursor-pointer transition"
          >
            ✕
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* SIDEBAR DANH SÁCH SỔ TAY */}
          <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/60 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 space-y-3 shrink-0 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-slate-400">Danh Sách Sổ Tay ({notebooks.length})</span>
                <button
                  onClick={() => setIsCreating(!isCreating)}
                  className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  {renderPlusIcon()} Tạo mới
                </button>
              </div>

              {isCreating && (
                <form onSubmit={handleCreateNew} className="p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Tên sổ tay mới..."
                    value={newNotebookName}
                    onChange={(e) => setNewNotebookName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 font-bold focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ghi chú ngắn (tùy chọn)..."
                    value={newNotebookDesc}
                    onChange={(e) => setNewNotebookDesc(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 font-medium focus:outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg font-bold"
                    >
                      Hủy
                    </button>
                    <button type="submit" className="px-2.5 py-1 bg-rose-500 text-white rounded-lg font-bold">
                      Tạo
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-1.5">
                {notebooks.map((nb) => (
                  <button
                    key={nb.id}
                    onClick={() => {
                      setActiveNotebookId(nb.id);
                      playSfx('click');
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex justify-between items-center ${
                      activeNotebookId === nb.id
                        ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold truncate">{nb.name}</p>
                      <p className={`text-[10px] truncate ${activeNotebookId === nb.id ? 'text-rose-100' : 'text-slate-400'}`}>
                        {nb.wordIds.length} từ vựng
                      </p>
                    </div>
                    {activeNotebookId === nb.id && (
                      <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN DETAIL PANEL */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {currentNotebook ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>{currentNotebook.name}</span>
                      <span className="text-xs bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 rounded-full font-mono font-bold">
                        {currentWords.length} từ vựng
                      </span>
                    </h4>
                    {currentNotebook.description && (
                      <p className="text-xs text-slate-500 font-bold mt-0.5">{currentNotebook.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onSelectNotebookToStudy && currentWords.length > 0 && (
                      <button
                        onClick={() => {
                          onSelectNotebookToStudy(currentNotebook.wordIds, currentNotebook.name);
                          onClose();
                        }}
                        className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition active:scale-95 flex items-center gap-1.5"
                      >
                        {renderBookIcon('w-4 h-4')} Ôn Thẻ Flashcard
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCurrent(currentNotebook.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl border border-rose-200 dark:border-rose-900 cursor-pointer transition"
                      title="Xóa sổ tay này"
                    >
                      {renderTrashIcon()}
                    </button>
                  </div>
                </div>

                {currentWords.length === 0 ? (
                  <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                    <p className="text-xs font-bold text-slate-500">Sổ tay này chưa có từ vựng nào.</p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Bạn có thể mở Thư Viện Từ Vựng HSK và thêm bất kỳ từ vựng nào vào sổ tay này!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentWords.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs space-y-1.5 text-left flex justify-between items-center"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-rose-600 dark:text-rose-400 font-serif">{item.nameChinese}</span>
                            {onPlayAudio && (
                              <button
                                onClick={() => onPlayAudio(item.nameChinese)}
                                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer text-xs"
                              >
                                <svg className="w-3.5 h-3.5 text-rose-500 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                              </button>
                            )}
                            <span className="text-[9px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded font-bold">
                              HSK {item.hskLevel}
                            </span>
                          </div>
                          <p className="text-[11px] text-blue-500 font-bold font-mono">{item.namePinyin}</p>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.nameVietnamese}</p>
                        </div>

                        <button
                          onClick={() => {
                            const updated = toggleWordInNotebook(currentNotebook.id, item.id);
                            setNotebooks(updated);
                            playSfx('click');
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-rose-300 cursor-pointer"
                          title="Xóa từ khỏi sổ tay"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">
                Chọn hoặc tạo một sổ tay ở cột bên trái để bắt đầu.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
