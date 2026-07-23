import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';
import { getAIChatCompletion } from '../lib/ai';

// HSK Themes list
const THEMES = [
  'Đời sống & Gia đình',
  'Giao tiếp & Xã hội',
  'Học tập & Giáo dục',
  'Công việc & Văn phòng',
  'Ẩm thực & Muôn màu món ăn',
  'Du lịch & Phương tiện giao thông',
  'Mua sắm & Shopping',
  'Thể thao & Sức khỏe',
  'Giải trí & Văn hóa Nghệ thuật',
  'Thời tiết & Thiên nhiên',
  'Thời trang & Trang phục',
  'Kinh tế & Tài chính',
  'Công nghệ & Internet',
  'Tâm lý & Cảm xúc'
];

async function pumpVocab() {
  console.log('--------------------------------------------------');
  console.log('🚀 BẮT ĐẦU BOT NẠP TỪ VỰNG HSK 1-6 TỰ ĐỘNG VÀO CSDL');
  console.log('--------------------------------------------------\n');

  // 1. Fetch existing words to avoid any duplicate
  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach((item) => existingSet.add(item.nameChinese.trim()));
  dbVocabs.forEach((item) => existingSet.add(item.nameChinese.trim()));

  console.log(`📦 Đã ghi nhận ${existingSet.size} từ vựng độc bản hiện có.`);
  console.log(`🎯 Mục tiêu: Nạp thêm ~500 từ vựng mới phủ kín HSK 1, 2, 3, 4, 5, 6...\n`);

  let addedCount = 0;
  const targetNewCount = 500;

  for (let level = 1; level <= 6; level++) {
    console.log(`\n🔹 --- ĐANG XỬ LÝ NHÓM HSK ${level} ---`);
    for (const theme of THEMES) {
      if (addedCount >= targetNewCount) break;

      const prompt = `Bạn là chuyên gia biên soạn từ vựng HSK. Hãy tạo danh sách 15 từ vựng tiếng Trung HSK level ${level} thuộc chủ đề "${theme}" chuẩn xác.
Yêu cầu bắt buộc:
Trả về duy nhất định dạng mã JSON MẢNG đối tượng (Array of objects), KHÔNG kèm bất kỳ văn bản giải thích hay code block markdown nào:
[
  {
    "nameChinese": "字",
    "namePinyin": "zì",
    "nameVietnamese": "Nghĩa việt",
    "hskLevel": ${level},
    "category": "${theme}",
    "exampleChinese": "Ví dụ tiếng Trung",
    "examplePinyin": "Pinyin ví dụ",
    "exampleVietnamese": "Dịch ví dụ"
  }
]`;

      try {
        const aiResponse = await getAIChatCompletion({
          systemPrompt: 'You are a professional HSK dictionary generator. Return only raw JSON arrays without markdown block syntax.',
          userPrompt: prompt,
          maxTokens: 2000,
          temperature: 0.7
        });

        // Clean response text
        let cleanText = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const jsonStart = cleanText.indexOf('[');
        const jsonEnd = cleanText.lastIndexOf(']');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
        }

        const items = JSON.parse(cleanText);
        if (Array.isArray(items)) {
          let themeAdded = 0;
          for (const item of items) {
            if (!item.nameChinese || !item.namePinyin || !item.nameVietnamese) continue;
            const chinese = item.nameChinese.trim();

            if (existingSet.has(chinese)) continue;

            await prisma.customVocab.create({
              data: {
                nameChinese: chinese,
                namePinyin: item.namePinyin.trim(),
                nameVietnamese: item.nameVietnamese.trim(),
                hskLevel: level,
                category: theme,
                exampleChinese: item.exampleChinese?.trim() || null,
                examplePinyin: item.examplePinyin?.trim() || null,
                exampleVietnamese: item.exampleVietnamese?.trim() || null,
              }
            });

            existingSet.add(chinese);
            addedCount++;
            themeAdded++;
          }
          console.log(`   ✅ HSK ${level} [${theme}]: Đã nạp +${themeAdded} từ mới. (Tổng mới: ${addedCount}/${targetNewCount})`);
        }
      } catch (err: any) {
        console.warn(`   ⚠️ Lỗi khi gọi AI cho HSK ${level} [${theme}]: ${err.message || err}`);
      }

      // Small delay between requests
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  const finalTotal = existingSet.size;
  console.log('\n==================================================');
  console.log(`🎉 HOÀN THÀNH BOT NẠP TỪ VỰNG!`);
  console.log(`✨ Đã nạp thành công +${addedCount} từ vựng mới.`);
  console.log(`📚 Tổng kho từ vựng HSK độc bản hiện tại: ${finalTotal} từ.`);
  console.log('==================================================\n');
}

pumpVocab()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Thất bại:', err);
    process.exit(1);
  });
