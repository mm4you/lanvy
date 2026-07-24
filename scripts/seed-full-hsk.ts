import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';
import { getAIChatCompletion } from '../lib/ai';

const HSK_THEMES = [
  'Daily Life & Family',
  'Social & Friends',
  'Study & School & Exam',
  'Work & Career & Office',
  'Food & Cooking & Drinks',
  'Travel & Transport',
  'Shopping & Fashion',
  'Sports & Health & Medicine',
  'Entertainment & Culture',
  'Weather & Seasons & Nature',
  'Economy & Trade & Finance',
  'Technology & Internet & Electronics',
  'Emotions & Psychology & Qualities'
];

async function seedEndlessMax() {
  console.log('⚡==================================================⚡');
  console.log('🚀 BOT TERMINAL CRAWL TỪ VỰNG HSK 1-9 KHÔNG GIỚI HẠN');
  console.log('⚡==================================================⚡\n');

  const startTime = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  console.log(`📦 Kho từ độc bản hiện tại: ${existingSet.size} từ.`);

  const randomTheme = HSK_THEMES[Math.floor(Math.random() * HSK_THEMES.length)];
  const randomLevel = Math.floor(Math.random() * 9) + 1;
  const randomSeed = Math.floor(Math.random() * 999999);

  console.log(`🎲 Đang kết nối AI crawl từ vựng HSK ${randomLevel} thuộc chủ đề "${randomTheme}"...`);

  const systemPrompt = `You are a Chinese vocabulary generator. Output ONLY a valid JSON array containing 6 items for HSK ${randomLevel}.
Requirements:
1. Short plain text only. No special escape characters.
2. Format:
[
  {
    "nameChinese": "Word",
    "namePinyin": "Pinyin",
    "nameVietnamese": "Meaning",
    "hskLevel": ${randomLevel},
    "category": "${randomTheme}",
    "exampleChinese": "Short Example",
    "examplePinyin": "Short Pinyin",
    "exampleVietnamese": "Short Meaning"
  }
]`;

  const userPrompt = `Generate 6 items for HSK ${randomLevel} theme "${randomTheme}" (Seed ${randomSeed}). Output raw JSON only.`;

  let totalAdded = 0;
  try {
    const aiResponse = await getAIChatCompletion({
      systemPrompt,
      userPrompt,
      maxTokens: 1200,
      temperature: 0.7
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

        if (existingSet.has(word)) continue;
        if (/\d/.test(word) || word.includes('_') || word.includes('-')) continue;
        if (word.length <= 1 && randomLevel > 2) continue;
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
        totalAdded++;
      }
    }
  } catch (err: any) {
    console.warn(`   ⚠️ AI Crawl Notice: ${err.message || err}`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n==================================================');
  console.log(`🎉 NẠP THÀNH CÔNG TRONG ${duration} GIÂY!`);
  console.log(`✨ ĐÃ CRAWL THÊM THÀNH CÔNG: +${totalAdded} TỪ VỰNG CHUẨN XÁC MỚI TINH!`);
  console.log(`📚 TỔNG KHO TỪ VỰNG HSK BÂY GIỜ LÀ: ${existingSet.size} TỪ.`);
  console.log('==================================================\n');
}

seedEndlessMax().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
