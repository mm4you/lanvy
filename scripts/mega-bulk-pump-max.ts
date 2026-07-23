import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';
import { getAIChatCompletion } from '../lib/ai';

const BULK_THEMES = [
  'Đời sống & Gia đình',
  'Giao tiếp & Xã hội',
  'Học tập & Giáo dục',
  'Công việc & Nghề nghiệp',
  'Ẩm thực & Món ăn',
  'Du lịch & Giao thông',
  'Mua sắm & Thời trang',
  'Thể thao & Sức khỏe',
  'Giải trí & Văn hóa',
  'Thời tiết & Thiên nhiên'
];

async function maxBulkPump() {
  console.log('⚡==================================================⚡');
  console.log('🚀 BOT CHẠY 1 LẦN NẠP TỐI ĐA SỐ LƯỢNG TỪ VỰNG HSK 1-6');
  console.log('⚡==================================================⚡\n');

  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach(v => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach(v => existingSet.add(v.nameChinese.trim()));

  console.log(`📦 Kho từ vựng độc bản hiện có: ${existingSet.size} từ.`);
  console.log(`🎯 Mục tiêu: Sinh và nạp số lượng từ vựng MAX nhất có thể...\n`);

  let addedTotal = 0;

  for (let level = 1; level <= 6; level++) {
    console.log(`🔹 === ĐANG TẠO HÀNG LOẠT CHO HSK LEVEL ${level} ===`);

    for (const theme of BULK_THEMES) {
      const prompt = `Tạo danh sách 15 từ vựng tiếng Trung HSK level ${level} chủ đề "${theme}" chuẩn xác 100%.
Yêu cầu: Chỉ trả về chữ Hán thực tế (VD: 苹果, 学习, 精彩). Tuyệt đối không dính số hay mã rác.
Trả về duy nhất dạng JSON MẢNG (Array of objects), KHÔNG kèm markdown:
[
  {
    "nameChinese": "字",
    "namePinyin": "zì",
    "nameVietnamese": "Nghĩa tiếng Việt",
    "hskLevel": ${level},
    "category": "${theme}",
    "exampleChinese": "Ví dụ tiếng Trung",
    "examplePinyin": "Pinyin ví dụ",
    "exampleVietnamese": "Dịch ví dụ"
  }
]`;

      try {
        const response = await getAIChatCompletion({
          systemPrompt: 'Return only raw JSON array of clean authentic HSK vocabulary objects.',
          userPrompt: prompt,
          maxTokens: 2000,
          temperature: 0.7
        });

        let jsonText = response.replace(/```json/gi, '').replace(/```/g, '').trim();
        const start = jsonText.indexOf('[');
        const end = jsonText.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
          jsonText = jsonText.substring(start, end + 1);
        }

        const list = JSON.parse(jsonText);
        if (Array.isArray(list)) {
          let themeCount = 0;
          for (const item of list) {
            if (!item.nameChinese || !item.namePinyin || !item.nameVietnamese) continue;
            const word = item.nameChinese.trim();

            if (existingSet.has(word) || /\d/.test(word) || word.includes('_')) continue;

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
            addedTotal++;
            themeCount++;
          }
          console.log(`   ✅ HSK ${level} [${theme}]: +${themeCount} từ mới. (Tổng tích lũy: +${addedTotal})`);
        }
      } catch (err: any) {
        console.warn(`   ⏳ Tạm nghỉ 1s cho AI API: ${err.message || err}`);
      }

      // Delay 1s to ensure steady stream without rate limit error
      await new Promise((r) => setTimeout(r, 1200));
    }
  }

  console.log('\n==================================================');
  console.log(`🎉 HOÀN THÀNH ĐỢT BƠM TỪ VỰNG TỐI ĐA!`);
  console.log(`✨ Tổng số từ vựng mới đã bơm thành công: +${addedTotal} từ.`);
  console.log(`📚 Tổng kho từ vựng HSK độc bản hiện tại: ${existingSet.size} từ.`);
  console.log('==================================================\n');
}

maxBulkPump().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
