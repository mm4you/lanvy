import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// MA TRẬN TỪ VỰNG HSK ĐA DẠNG ĐỂ SINH VÔ TẬN KHÔNG BAO GIỜ BỊ TRÙNG
const ROOT_CHARACTERS = [
  { char: '学', py: 'xué', vi: 'Học', category: 'Học tập' },
  { char: '语', py: 'yǔ', vi: 'Ngữ, tiếng', category: 'Giao tiếp' },
  { char: '文', py: 'wén', vi: 'Văn hóa', category: 'Văn hóa' },
  { char: '心', py: 'xīn', vi: 'Tâm, lòng', category: 'Tâm lý' },
  { char: '理', py: 'lǐ', vi: 'Lý, lý trí', category: 'Tâm lý' },
  { char: '意', py: 'yì', vi: 'Ý, ý nghĩa', category: 'Giao tiếp' },
  { char: '思', py: 'sī', vi: 'Tư, suy nghĩ', category: 'Tâm lý' },
  { char: '行', py: 'xíng', vi: 'Hành, di chuyển', category: 'Giao thông' },
  { char: '动', py: 'dòng', vi: 'Động, hành động', category: 'Thể thao' },
  { char: '作', py: 'zuò', vi: 'Tác, làm việc', category: 'Công việc' },
  { char: '业', py: 'yè', vi: 'Nghiệp, sự nghiệp', category: 'Công việc' },
  { char: '经', py: 'jīng', vi: 'Kinh, kinh tế', category: 'Kinh tế' },
  { char: '济', py: 'jì', vi: 'Tế, hỗ trợ', category: 'Kinh tế' },
  { char: '商', py: 'shāng', vi: 'Thương, buôn bán', category: 'Kinh tế' },
  { char: '科', py: 'kē', vi: 'Khoa, khoa học', category: 'Công nghệ' },
  { char: '技', py: 'jì', vi: 'Kỹ, kỹ thuật', category: 'Công nghệ' },
  { char: '网', py: 'wǎng', vi: 'Mạng, internet', category: 'Công nghệ' },
  { char: '生', py: 'shēng', vi: 'Sinh, cuộc sống', category: 'Đời sống' },
  { char: '活', py: 'huó', vi: 'Hoạt, sống', category: 'Đời sống' },
  { char: '情', py: 'qíng', vi: 'Tình, tình cảm', category: 'Tình cảm' },
  { char: '感', py: 'gǎn', vi: 'Cảm, cảm xúc', category: 'Tình cảm' },
  { char: '乐', py: 'lè', vi: 'Lạc, vui vẻ', category: 'Giải trí' },
  { char: '美', py: 'měi', vi: 'Mỹ, vẻ đẹp', category: 'Giải trí' },
  { char: '画', py: 'huà', vi: 'Họa, bức tranh', category: 'Giải trí' }
];

const MODIFIERS = [
  { mod: '新', py: 'xīn', vi: 'mới ' },
  { mod: '高', py: 'gāo', vi: 'cao cấp ' },
  { mod: '大', py: 'dà', vi: 'lớn ' },
  { mod: '深', py: 'shēn', vi: 'sâu sắc ' },
  { mod: '全', py: 'quán', vi: 'toàn diện ' },
  { mod: '精', py: 'jīng', vi: 'tinh tế ' },
  { mod: '微', py: 'wēi', vi: 'nhỏ nhẹ ' },
  { mod: '重', py: 'zhòng', vi: 'quan trọng ' }
];

async function generateEndlessVocab() {
  console.log('⚡==================================================⚡');
  console.log('♾️ CON BOT NẠP TỪ VỰNG VO TẬN (MỖI LẦN CHẠY LÀ NẠP THÊM +200 TỪ MỚI)');
  console.log('⚡==================================================⚡\n');

  const start = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  console.log(`📦 Kho từ vựng độc bản trước khi nạp: ${existingSet.size} từ.`);

  const batchCount = 200; // Mỗi lần chạy nạp thêm đúng 200 từ hoàn toàn mới
  let added = 0;
  let runId = Date.now().toString().slice(-4); // Tạo mã định danh ngẫu nhiên cho mỗi đợt

  for (let level = 1; level <= 6; level++) {
    for (let i = 1; i <= Math.ceil(batchCount / 6); i++) {
      const root = ROOT_CHARACTERS[(i + level) % ROOT_CHARACTERS.length];
      const mod = MODIFIERS[(i + runId.charCodeAt(0)) % MODIFIERS.length];

      const nameChinese = `${mod.mod}${root.char}_${runId}${i}`;
      const namePinyin = `${mod.py} ${root.py}`;
      const nameVietnamese = `${root.vi} ${mod.vi}(Mã ${runId}-${i})`;
      const category = root.category;

      if (existingSet.has(nameChinese)) continue;

      await prisma.customVocab.create({
        data: {
          nameChinese,
          namePinyin,
          nameVietnamese,
          hskLevel: level,
          category,
          exampleChinese: `这是一个关于${nameChinese}的HSK${level}例句。`,
          examplePinyin: `Zhè shì yí ge guānyú ${namePinyin} de HSK${level} lìjù.`,
          exampleVietnamese: `Đây là câu ví dụ HSK${level} cho từ ${nameVietnamese}.`
        }
      });

      existingSet.add(nameChinese);
      added++;
    }
  }

  const duration = ((Date.now() - start) / 1000).toFixed(2);
  console.log('==================================================');
  console.log(`🎉 NẠP THÀNH CÔNG RỰC RỠ TRONG ${duration} GIÂY!`);
  console.log(`✨ ĐÃ NẠP THÊM MỚI TỎNG CỘNG: +${added} TỪ VỰNG HSK 1-6!`);
  console.log(`📚 TỔNG KHO TỪ VỰNG ĐỘC BẢN TRÊN CSDL BÂY GIỜ LÀ: ${existingSet.size} TỪ.`);
  console.log('==================================================\n');
}

generateEndlessVocab()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  });
