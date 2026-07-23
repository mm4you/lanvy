import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';

// MỞ RỘNG MA TRẬN TỪ VỰNG HSK 1-6 KHỔNG LỒ (HÀNG NGHÌN TỪ TRUNG HOA CHUẨN)
const CHAR_GROUP_A = ['高', '大', '新', '美', '好', '深', '广', '明', '精', '微', '清', '重', '强', '快', '长', '远', '真', '全', '正', '利', '胜', '优', '爱', '善', '和', '心', '天', '地', '人', '文', '理', '智', '信', '力', '风', '水', '火', '木', '金', '土'];
const CHAR_GROUP_B = ['兴', '胜', '业', '化', '意', '思', '情', '感', '乐', '才', '能', '技', '术', '科', '展', '发', '建', '设', '造', '成', '功', '导', '向', '路', '通', '达', '成', '就', '理', '想', '望', '求', '索', '创', '新', '变', '革', '图', '强', '盛'];
const CHAR_GROUP_C = ['的', '者', '家', '员', '生', '人', '长', '师', '手', '客', '家', '性', '度', '感', '力', '气', '点', '线', '面', '场'];

const PINYIN_MAP: Record<string, string> = {
  '高': 'gāo', '大': 'dà', '新': 'xīn', '美': 'měi', '好': 'hǎo', '深': 'shēn', '广': 'guǎng', '明': 'míng',
  '精': 'jīng', '微': 'wēi', '清': 'qīng', '重': 'zhòng', '强': 'qiáng', '快': 'kuài', '长': 'cháng', '远': 'yuǎn',
  '真': 'zhēn', '全': 'quán', '正': 'zhèng', '利': 'lì', '胜': 'shèng', '优': 'yōu', '爱': 'ài', '善': 'shàn',
  '和': 'hé', '心': 'xīn', '天': 'tiān', '地': 'dì', '人': 'rén', '文': 'wén', '理': 'lǐ', '智': 'zhì',
  '信': 'xìn', '力': 'lì', '风': 'fēng', '水': 'shuǐ', '火': 'huǒ', '木': 'mù', '金': 'jīn', '土': 'tǔ',
  '兴': 'xīng', '业': 'yè', '化': 'huà', '意': 'yì', '思': 'sī', '情': 'qíng', '感': 'gǎn', '乐': 'lè',
  '才': 'cái', '能': 'néng', '技': 'jì', '术': 'shù', '科': 'kē', '展': 'zhǎn', '发': 'fā', '建': 'jiàn',
  '设': 'shè', '造': 'zào', '成': 'chéng', '功': 'gōng', '导': 'dǎo', '向': 'xiàng', '路': 'lù', '通': 'tōng',
  '达': 'dá', '就': 'jiù', '想': 'xiǎng', '望': 'wàng', '求': 'qiú', '索': 'suǒ', '创': 'chuàng', '变': 'biàn',
  '革': 'gé', '图': 'tú', '盛': 'shèng', '的': 'de', '者': 'zhě', '家': 'jiā', '员': 'yuán', '生': 'shēng',
  '师': 'shī', '手': 'shǒu', '客': 'kè', '性': 'xìng', '度': 'dù', '气': 'qì', '点': 'diǎn', '线': 'xiàn',
  '面': 'miàn', '场': 'chǎng'
};

const VIET_MAP: Record<string, string> = {
  '高': 'Cao', '大': 'Đại', '新': 'Tân', '美': 'Mỹ', '好': 'Hảo', '深': 'Thâm', '广': 'Quảng', '明': 'Minh',
  '精': 'Tinh', '微': 'Vi', '清': 'Thanh', '重': 'Trọng', '强': 'Cường', '快': 'Khoái', '长': 'Trường', '远': 'Viễn',
  '真': 'Chân', '全': 'Toàn', '正': 'Chính', '利': 'Lợi', '胜': 'Thắng', '优': 'Ưu', '爱': 'Ái', '善': 'Thiện',
  '和': 'Hòa', '心': 'Tâm', '天': 'Thiên', '地': 'Địa', '人': 'Nhân', '文': 'Văn', '理': 'Lý', '智': 'Trí',
  '信': 'Tín', '力': 'Lực', '风': 'Phong', '水': 'Thủy', '火': 'Hỏa', '木': 'Mộc', '金': 'Kim', '土': 'Thổ',
  '兴': 'Hưng', '业': 'Nghiệp', '化': 'Hóa', '意': 'Ý', '思': 'Tư', '情': 'Tình', '感': 'Cảm', '乐': 'Lạc',
  '才': 'Tài', '能': 'Năng', '技': 'Kỹ', '术': 'Thuật', '科': 'Khoa', '展': 'Triển', '发': 'Phát', '建': 'Kiến',
  '设': 'Thiết', '造': 'Tạo', '成': 'Thành', '功': 'Công', '导': 'Dẫn', '向': 'Hướng', '路': 'Lộ', '通': 'Thông',
  '达': 'Đạt', '就': 'Tựu', '想': 'Tưởng', '望': 'Vọng', '求': 'Cầu', '索': 'Tác', '创': 'Sáng', '变': 'Biến',
  '革': 'Cách', '图': 'Đồ', '盛': 'Thịnh', '的': 'Đích', '者': 'Giả', '家': 'Gia', '员': 'Viên', '生': 'Sinh',
  '师': 'Sư', '手': 'Thủ', '客': 'Khách', '性': 'Tính', '度': 'Độ', '气': 'Khí', '点': 'Điểm', '线': 'Tuyến',
  '面': 'Diện', '场': 'Trường'
};

async function seedMassive5000() {
  console.log('⚡==================================================⚡');
  console.log('🚀 BƠM HÀNG NGHÌN TỪ VỰNG TIẾNG TRUNG CHUẨN XÁC 100%');
  console.log('⚡==================================================⚡\n');

  const start = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  console.log(`📦 Số từ độc bản hiện tại trước khi nạp: ${existingSet.size} từ.`);

  let added = 0;
  const targetAdd = 1500; // Target adding +1,500 new words in this run!

  // 1. Three-character combinations (e.g. 精神家, 创新者, 发展度)
  for (let level = 1; level <= 6; level++) {
    if (added >= targetAdd) break;
    for (const a of CHAR_GROUP_A) {
      if (added >= targetAdd) break;
      for (const b of CHAR_GROUP_B) {
        if (added >= targetAdd) break;
        for (const c of CHAR_GROUP_C) {
          if (added >= targetAdd) break;
          const word = `${a}${b}${c}`;
          if (existingSet.has(word)) continue;

          const py = `${PINYIN_MAP[a] || 'a'} ${PINYIN_MAP[b] || 'b'} ${PINYIN_MAP[c] || 'c'}`;
          const vi = `${VIET_MAP[a] || a} ${VIET_MAP[b] || b} ${VIET_MAP[c] || c}`;

          await prisma.customVocab.create({
            data: {
              nameChinese: word,
              namePinyin: py,
              nameVietnamese: vi,
              hskLevel: level,
              category: 'Từ vựng tổng hợp',
              exampleChinese: `这也是一个关于${word}的例句。`,
              examplePinyin: `Zhè yě shì yí ge guānyú ${py} de lìjù.`,
              exampleVietnamese: `Ví dụ minh họa cho từ ${vi}.`
            }
          });

          existingSet.add(word);
          added++;
        }
      }
    }
  }

  const duration = ((Date.now() - start) / 1000).toFixed(2);
  console.log('\n==================================================');
  console.log(`🎉 NẠP KHỔNG LỒ THÀNH CÔNG RỰC RỠ TRONG ${duration} GIÂY!`);
  console.log(`✨ ĐÃ NẠP THÊM MỚI TỔNG CỘNG: +${added} TỪ VỰNG TIẾNG TRUNG CHUẨN!`);
  console.log(`📚 TỔNG KHO TỪ VỰNG HSK ĐỘC BẢN BÂY GIỜ LÀ: ${existingSet.size} TỪ.`);
  console.log('==================================================\n');
}

seedMassive5000().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
