import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';
import { getAIChatCompletion } from '../lib/ai';

// ĐỊNH NGHĨA CHỦ ĐỀ CHUẨN ĐỂ BOT TẠO TỪ CHÂN THỰC
const HSK_THEMES = [
  'Đời sống hàng ngày',
  'Gia đình & Mối quan hệ',
  'Trường học & Học tập',
  'Nghề nghiệp & Công sở',
  'Ẩm thực & Nhà hàng',
  'Du lịch & Khám phá',
  'Mua sắm & Tiêu dùng',
  'Sức khỏe & Thể thao',
  'Nghệ thuật & Giải trí',
  'Thời tiết & Tự nhiên',
  'Xã hội & Giao tiếp',
  'Khoa học & Công nghệ',
  'Cảm xúc & Phẩm chất'
];

async function seedContinuousHsk() {
  process.env.IS_TERMINAL_BOT = 'true';
  console.log('⚡==================================================⚡');
  console.log('🚀 BOT NẠP TỪ VỰNG HSK 1-9 - LIÊN TỤC & SẠCH SẼ 100%');
  console.log('⚡==================================================⚡\n');

  const startTime = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  console.log(`📦 Kho từ độc bản hiện tại: ${existingSet.size} từ.`);

  const randomTheme = HSK_THEMES[Math.floor(Math.random() * HSK_THEMES.length)];
  const randomLevel = Math.floor(Math.random() * 9) + 1; // HSK 1 đến 9 ngẫu nhiên
  const randomSeed = Math.floor(Math.random() * 99999);

  console.log(`🎲 Đang sinh từ vựng HSK ${randomLevel} thuộc chủ đề "${randomTheme}"...`);

  // Prompt chi tiết ép buộc trả về đúng cấu trúc chuẩn và thực tế, độ dài ngắn hơn để tránh lỗi token của các API miễn phí
  const systemPrompt = `You are a professional Chinese language educator. 
Generate exactly 8 real, valid, and common Chinese words for HSK Level ${randomLevel} in the theme "${randomTheme}".
Strict Requirements:
1. "nameChinese" must be a real Chinese word (e.g. "高兴", "学校", "智能手机", "融会贯通"). No fake compound matrix combinations like "全技家", "真通师", "心信者".
2. No numbers, no underscores, no identifier codes.
3. Provide accurate Pinyin and Vietnamese translation for the word.
4. Provide a clear, natural Chinese example sentence using that word, along with its Pinyin and a natural Vietnamese translation. Do NOT use generic templates like "这也是一个关于... de lìjù".
5. Return ONLY a raw JSON array. No markdown wraps, no extra text.

JSON Schema format:
[
  {
    "nameChinese": "Word",
    "namePinyin": "Pinyin",
    "nameVietnamese": "Meaning",
    "hskLevel": ${randomLevel},
    "category": "${randomTheme}",
    "exampleChinese": "Example Sentence",
    "examplePinyin": "Example Pinyin",
    "exampleVietnamese": "Example Translation"
  }
]`;

  const userPrompt = `Create 8 genuine HSK ${randomLevel} vocabulary items for topic "${randomTheme}". Random code: ${randomSeed}. Return ONLY raw JSON array.`;

  let added = 0;
  try {
    const aiResponse = await getAIChatCompletion({
      systemPrompt,
      userPrompt,
      maxTokens: 1500,
      temperature: 0.8
    });

    let jsonText = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    const start = jsonText.indexOf('[');
    const end = jsonText.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      jsonText = jsonText.substring(start, end + 1);
    }

    const items = JSON.parse(jsonText);
    if (Array.isArray(items)) {
      for (const item of items) {
        if (!item.nameChinese || !item.namePinyin || !item.nameVietnamese) continue;
        
        const word = item.nameChinese.trim();
        const mean = item.nameVietnamese.trim();
        const exCh = item.exampleChinese?.trim() || '';
        const exVi = item.exampleVietnamese?.trim() || '';

        // Bộ lọc chất lượng từ vựng nghiêm ngặt
        if (existingSet.has(word)) continue;
        if (/\d/.test(word) || word.includes('_') || word.includes('-')) continue;
        if (word.length <= 1 && randomLevel > 2) continue; // Hạn chế từ 1 chữ ở cấp cao
        if (exCh.includes('这也是一个关于') || exVi.includes('Ví dụ minh họa') || exVi.includes('đây là câu ví dụ')) continue; 
        if (mean.toLowerCase() === 'cơ bản' || mean.toLowerCase() === 'tổng hợp') continue;

        await prisma.customVocab.create({
          data: {
            nameChinese: word,
            namePinyin: item.namePinyin.trim(),
            nameVietnamese: mean,
            hskLevel: randomLevel,
            category: randomTheme,
            exampleChinese: exCh || null,
            examplePinyin: item.examplePinyin?.trim() || null,
            exampleVietnamese: exVi || null,
          }
        });

        existingSet.add(word);
        added++;
      }
    }
  } catch (err: any) {
    console.warn(`   ⚠️ AI Notice: ${err.message || err}`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Nạp hoàn tất trong ${duration}s! Đã thêm +${added} từ vựng mới.`);
  console.log(`📚 Tổng từ vựng độc bản hiện tại: ${existingSet.size} từ.\n`);
}

seedContinuousHsk().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
