import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';
import { getAIChatCompletion } from '../lib/ai';

const HSK_THEMES = [
  'Đời sống gia đình & Mối quan hệ',
  'Giao tiếp xã hội & Tình bạn',
  'Học tập & Trường học & Kỳ thi',
  'Công việc & Văn phòng & Nghề nghiệp',
  'Ẩm thực & Món ăn & Nước uống',
  'Du lịch & Phương tiện giao thông',
  'Mua sắm & Giá cả & Thời trang',
  'Thể thao & Sức khỏe & Y tế',
  'Giải trí & Âm nhạc & Phim ảnh',
  'Thời tiết & Bốn mùa & Thiên nhiên',
  'Kinh tế & Thương mại & Doanh nghiệp',
  'Công nghệ & Internet & Thiết bị điện tử',
  'Cảm xúc & Tâm lý & Phẩm chất'
];

async function runBulkPump() {
  console.log('--------------------------------------------------');
  console.log('🤖 CON BOT NẠP TỪ VỰNG HSK 1-6 TỰ ĐỘNG BẰNG TERMINAL');
  console.log('--------------------------------------------------\n');

  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach((v) => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach((v) => existingSet.add(v.nameChinese.trim()));

  console.log(`📦 Kho từ vựng độc bản ban đầu: ${existingSet.size} từ.`);
  console.log(`🎯 Mục tiêu nạp: 500 từ vựng HSK 1-6 mới...\n`);

  let addedNew = 0;
  const target = 500;

  for (let level = 1; level <= 6; level++) {
    if (addedNew >= target) break;
    console.log(`\n🔹 === ĐANG BƠM NHÓM HSK LEVEL ${level} ===`);

    for (const theme of HSK_THEMES) {
      if (addedNew >= target) break;

      const prompt = `Hãy đóng vai giáo viên HSK. Tạo 10 từ vựng tiếng Trung HSK ${level} chủ đề "${theme}".
Định dạng bắt buộc: trả về duy nhất mảng JSON (Array of objects), KHÔNG kèm bất kỳ lời giải thích hay code block markdown nào:
[
  {
    "nameChinese": "词语",
    "namePinyin": "cíyǔ",
    "nameVietnamese": "Nghĩa tiếng Việt",
    "hskLevel": ${level},
    "category": "${theme}",
    "exampleChinese": "Câu ví dụ tiếng Trung",
    "examplePinyin": "Pinyin câu ví dụ",
    "exampleVietnamese": "Dịch câu ví dụ"
  }
]`;

      try {
        const aiResponse = await getAIChatCompletion({
          systemPrompt: 'Return only raw JSON array of HSK vocabulary objects. No markdown.',
          userPrompt: prompt,
          maxTokens: 1500,
          temperature: 0.7
        });

        let jsonText = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const start = jsonText.indexOf('[');
        const end = jsonText.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
          jsonText = jsonText.substring(start, end + 1);
        }

        const list = JSON.parse(jsonText);
        if (Array.isArray(list)) {
          let batchAdded = 0;
          for (const item of list) {
            if (!item.nameChinese || !item.namePinyin || !item.nameVietnamese) continue;
            const word = item.nameChinese.trim();
            if (existingSet.has(word)) continue;

            await prisma.customVocab.create({
              data: {
                nameChinese: word,
                namePinyin: item.namePinyin.trim(),
                nameVietnamese: item.nameVietnamese.trim(),
                hskLevel: level,
                category: theme,
                exampleChinese: item.exampleChinese?.trim() || null,
                examplePinyin: item.examplePinyin?.trim() || null,
                exampleVietnamese: item.exampleVietnamese?.trim() || null,
              }
            });

            existingSet.add(word);
            addedNew++;
            batchAdded++;
          }
          console.log(`   ✅ HSK ${level} [${theme}]: +${batchAdded} từ mới. (Tổng nạp: ${addedNew}/${target})`);
        }
      } catch (err: any) {
        console.warn(`   ⏳ Tạm hoãn 2 giây do giới hạn AI API: ${err.message || err}`);
      }

      // Delay between requests: 100ms if OpenAI API key is present, 2500ms for free tier
      const delayMs = process.env.OPENAI_API_KEY ? 100 : 2500;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  console.log('\n==================================================');
  console.log(`🎉 NẠP TỪ VỰNG HOÀN TẤT!`);
  console.log(`✨ Đã nạp thành công +${addedNew} từ vựng mới.`);
  console.log(`📚 Tổng kho từ vựng HSK độc bản hiện tại: ${existingSet.size} từ.`);
  console.log('==================================================\n');
}

runBulkPump()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  });
