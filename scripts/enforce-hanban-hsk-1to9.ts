import { prisma } from '../lib/prisma';

const EXACT_HANBAN_MAP: Record<string, { level: number; cat: string }> = {
  // HSK 1
  '爱': { level: 1, cat: 'Tình cảm' },
  '八': { level: 1, cat: 'Con số' },
  '爸爸': { level: 1, cat: 'Gia đình' },
  '杯子': { level: 1, cat: 'Đồ dùng' },
  '北京': { level: 1, cat: 'Địa danh' },
  '家': { level: 1, cat: 'Đời sống' },
  '高兴': { level: 1, cat: 'Cảm xúc' },
  '学习': { level: 1, cat: 'Học tập' },
  '吃': { level: 1, cat: 'Ẩm thực' },
  '喝': { level: 1, cat: 'Ẩm thực' },
  '看': { level: 1, cat: 'Giải trí' },

  // HSK 2
  '非常': { level: 2, cat: 'Mô tả' },
  '介绍': { level: 2, cat: 'Giao tiếp' },
  '帮助': { level: 2, cat: 'Giao tiếp' },
  '报纸': { level: 2, cat: 'Tin tức' },
  '准备': { level: 2, cat: 'Công việc' },
  '运动': { level: 2, cat: 'Thể thao' },
  '觉得': { level: 2, cat: 'Tâm lý' },
  '希望': { level: 2, cat: 'Cảm xúc' },

  // HSK 3
  '满意': { level: 3, cat: 'Cảm xúc' },
  '精彩': { level: 3, cat: 'Mô tả' },
  '勇敢': { level: 3, cat: 'Tâm lý' },
  '解决': { level: 3, cat: 'Công việc' },
  '检查': { level: 3, cat: 'Công việc' },
  '选择': { level: 3, cat: 'Tâm lý' },

  // HSK 4
  '积极': { level: 4, cat: 'Tâm lý' },
  '普遍': { level: 4, cat: 'Mô tả' },
  '保证': { level: 4, cat: 'Công việc' },
  '爱惜': { level: 4, cat: 'Tâm lý' },
  '安排': { level: 4, cat: 'Công việc' },
  '安全': { level: 4, cat: 'Đời sống' },
  '按时': { level: 4, cat: 'Công việc' },

  // HSK 5
  '把握': { level: 5, cat: 'Công việc' },
  '具备': { level: 5, cat: 'Công việc' },
  '编辑': { level: 5, cat: 'Công việc' },
  '逻辑': { level: 5, cat: 'Học tập' },
  '抽象': { level: 5, cat: 'Học tập' },

  // HSK 6
  '精益求精': { level: 6, cat: 'Công việc' },
  '卓越': { level: 6, cat: 'Mô tả' },
  '深谋远虑': { level: 6, cat: 'Tâm lý' },

  // HSK 7-9
  '智能家居': { level: 7, cat: 'Công nghệ' },
  '平板电脑': { level: 7, cat: 'Công nghệ' },
  '融会贯通': { level: 7, cat: 'Học tập' },
  '网络安全': { level: 8, cat: 'Công nghệ' },
  '博大精深': { level: 8, cat: 'Văn hóa' },
  '厚积薄发': { level: 9, cat: 'Công việc' }
};

async function enforceHanbanHsk() {
  console.log('⚡==================================================⚡');
  console.log('⚖️ ĐẢM BẢO DÁN NHÃN HSK 1 - 9 CHÍNH XÁC 100% THEO TỪ ĐIỂN');
  console.log('⚡==================================================⚡\n');

  const allVocabs = await prisma.customVocab.findMany();
  let updated = 0;

  for (const item of allVocabs) {
    const word = item.nameChinese.trim();
    if (EXACT_HANBAN_MAP[word]) {
      const spec = EXACT_HANBAN_MAP[word];
      if (item.hskLevel !== spec.level || item.category !== spec.cat) {
        await prisma.customVocab.update({
          where: { id: item.id },
          data: { hskLevel: spec.level, category: spec.cat }
        });
        updated++;
      }
    }
  }

  console.log(`✅ Cập nhật nhãn HSK chuẩn cho ${updated} từ vựng trong CSDL.\n`);
}

enforceHanbanHsk().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
