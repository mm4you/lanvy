'use client';

export interface Notebook {
  id: string;
  name: string;
  description?: string;
  wordIds: string[];
  createdAt: string;
}

const DEFAULT_NOTEBOOKS: Notebook[] = [
  {
    id: 'nb_giao_tiep_hang_ngay',
    name: 'Sổ Tay Giao Tiếp Hàng Ngày',
    description: 'Các từ vựng HSK cơ bản và thông dụng nhất khi giao tiếp.',
    wordIds: ['v_001', 'v_002', 'v_003', 'v_004', 'v_005'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'nb_noi_that_atelier',
    name: 'Sổ Tay Nội Thất Pixel',
    description: 'Từ vựng các vật dụng nội thất phòng ngủ, phòng khách.',
    wordIds: ['wood_chair', 'wood_table', 'study_desk', 'sofa', 'double_bed'],
    createdAt: new Date().toISOString(),
  },
];

export function getNotebooks(): Notebook[] {
  if (typeof window === 'undefined') return DEFAULT_NOTEBOOKS;
  try {
    const saved = localStorage.getItem('hsk_user_notebooks');
    if (!saved) {
      localStorage.setItem('hsk_user_notebooks', JSON.stringify(DEFAULT_NOTEBOOKS));
      return DEFAULT_NOTEBOOKS;
    }
    return JSON.parse(saved);
  } catch (e) {
    return DEFAULT_NOTEBOOKS;
  }
}

export function saveNotebooks(notebooks: Notebook[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hsk_user_notebooks', JSON.stringify(notebooks));
}

export function createNotebook(name: string, description: string = ''): Notebook[] {
  const notebooks = getNotebooks();
  const newNb: Notebook = {
    id: `nb_${Date.now()}`,
    name,
    description,
    wordIds: [],
    createdAt: new Date().toISOString(),
  };
  const updated = [newNb, ...notebooks];
  saveNotebooks(updated);
  return updated;
}

export function deleteNotebook(id: string): Notebook[] {
  const notebooks = getNotebooks();
  const updated = notebooks.filter((n) => n.id !== id);
  saveNotebooks(updated);
  return updated;
}

export function toggleWordInNotebook(notebookId: string, wordId: string): Notebook[] {
  const notebooks = getNotebooks();
  const updated = notebooks.map((nb) => {
    if (nb.id === notebookId) {
      const exists = nb.wordIds.includes(wordId);
      const newWordIds = exists ? nb.wordIds.filter((w) => w !== wordId) : [...nb.wordIds, wordId];
      return { ...nb, wordIds: newWordIds };
    }
    return nb;
  });
  saveNotebooks(updated);
  return updated;
}
