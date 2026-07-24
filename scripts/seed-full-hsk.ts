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

async function seedTarget500Words() {
  process.env.IS_TERMINAL_BOT = 'true';
  console.log('⚡==================================================⚡');
  console.log('🚀 BOT TERMINAL CRAWL NẠP 500 TỪ VỰNG HSK 1-9 RỒI DỪNG');
  console.log('⚡==================================================⚡\n');

  const startTime = Date.now();
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  const initialCount = existingSet.size;
  const TARGET_NEW_WORDS = 500;
  console.log(`📦 Kho từ độc bản ban đầu: ${initialCount} từ.`);
  console.log(`🎯 Mục tiêu đợt này: Nạp đủ +${TARGET_NEW_WORDS} từ vựng mới rồi tự động dừng.\n`);

  let totalAdded = 0;
  let attempt = 1;

  while (totalAdded < TARGET_NEW_WORDS) {
    const randomTheme = HSK_THEMES[Math.floor(Math.random() * HSK_THEMES.length)];
    const randomLevel = Math.floor(Math.random() * 9) + 1; // HSK 1 đến 9
    const randomSeed = Math.floor(Math.random() * 999999);

    console.log(`🎲 Lần ${attempt} (Đã nạp: +${totalAdded}/${TARGET_NEW_WORDS}): Crawl HSK ${randomLevel} [${randomTheme}]...`);

    const systemPrompt = `You are a professional Chinese language teacher.
Generate 15 real, valid, authentic Chinese HSK Level ${randomLevel} vocabulary items for topic "${randomTheme}".
Requirements:
1. "nameChinese" MUST be real authentic Chinese words (e.g. "苹果", "学习", "智能手机", "融会贯通", "按时", "具备").
2. No numbers, no underscores.
3. Return ONLY a valid JSON array of objects. Do NOT use markdown code blocks.

Format:
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

    const userPrompt = `Generate 15 genuine HSK ${randomLevel} vocabulary items for topic "${randomTheme}". Seed: ${randomSeed}. Return ONLY raw JSON array.`;

    try {
      const aiResponse = await getAIChatCompletion({
        systemPrompt,
        userPrompt,
        maxTokens: 2500,
        temperature: 0.85
      });

      let jsonText = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      const start = jsonText.indexOf('[');
      const end = jsonText.lastIndexOf(']');
      if (start !== -1 && end !== -1) {
        jsonText = jsonText.substring(start, end + 1);
      }

      const items = JSON.parse(jsonText);
      if (Array.isArray(items)) {
        let roundAdded = 0;
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
          roundAdded++;

          if (totalAdded >= TARGET_NEW_WORDS) break;
        }
        console.log(`   ✨ Nạp thành công +${roundAdded} từ mới (Tiến độ: ${totalAdded}/${TARGET_NEW_WORDS}).`);
      }
    } catch (err: any) {
      console.warn(`   ⚠️ Thông báo lượt ${attempt}: ${err.message || err}`);
    }

    attempt++;
    // Tạm nghỉ ngắn giữa các lượt để tối ưu kết nối API
    await new Promise((r) => setTimeout(r, 600));
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n==================================================');
  console.log(`🎉 ĐÃ HOÀN THÀNH MỤC TIÊU NẠP +500 TỪ TRONG ${duration} GIÂY!`);
  console.log(`✨ SỐ TỪ VỰNG MỚI ĐÃ THÊM: +${totalAdded} TỪ VỰNG CHUẨN XÁC!`);
  console.log(`📚 TỔNG KHO TỪ VỰNG HSK ĐỘC BẢN HIỆN TẠI LÀ: ${existingSet.size} TỪ.`);
  console.log('==================================================\n');
}

seedTarget500Words().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
