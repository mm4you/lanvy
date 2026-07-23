import { prisma } from '../lib/prisma';
import { GENERAL_VOCAB_ITEMS } from '../data/vocabulary';
import { getAIChatCompletion } from '../lib/ai';

// CHỦ ĐỀ VÀ NHÓM CHÂN THẬT ĐA DẠNG ĐỂ AI TỰ ĐỘNG SINH TỪ MỚI MỖI LẦN GÕ LỆNH
const DIVERSE_TOPICS = [
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

async function generateFreshAiVocabs() {
  console.log('--------------------------------------------------');
  console.log('🤖 BOT AI TỰ ĐỘNG SINH TỪ VỰNG CHUẨN MỚI MỖI LẦN CHẠY');
  console.log('--------------------------------------------------\n');

  const dbVocabs = await prisma.customVocab.findMany();
  const existingSet = new Set<string>();

  GENERAL_VOCAB_ITEMS.forEach((v) => existingSet.add(v.nameChinese.trim()));
  dbVocabs.forEach((v) => existingSet.add(v.nameChinese.trim()));

  console.log(`📦 Kho từ độc bản hiện tại: ${existingSet.size} từ.`);
  console.log(`🎯 Đang gọi AI để sinh đợt từ vựng HSK 1-6 hoàn toàn mới...\n`);

  let addedNew = 0;
  const randomTopic = DIVERSE_TOPICS[Math.floor(Math.random() * DIVERSE_TOPICS.length)];
  const randomLevel = Math.floor(Math.random() * 6) + 1;

  const prompt = `Hãy đóng vai giáo viên HSK. Tạo 20 từ vựng tiếng Trung HSK cấp độ ${randomLevel} thuộc chủ đề "${randomTopic}".
Yêu cầu: Chỉ trả về chữ Hán thực tế (VD: 苹果, 学习, 精彩). Tuyệt đối không dính số hay mã rác.
Trả về duy nhất dạng JSON MẢNG (Array of objects), KHÔNG kèm markdown:
[
  {
    "nameChinese": "字",
    "namePinyin": "zì",
    "nameVietnamese": "Nghĩa tiếng Việt",
    "hskLevel": ${randomLevel},
    "category": "${randomTopic}",
    "exampleChinese": "Câu ví dụ tiếng Trung",
    "examplePinyin": "Pinyin câu ví dụ",
    "exampleVietnamese": "Dịch câu ví dụ"
  }
]`;

  try {
    const aiResponse = await getAIChatCompletion({
      systemPrompt: 'Return only raw JSON array of clean authentic HSK vocabulary objects.',
      userPrompt: prompt,
      maxTokens: 2000,
      temperature: 0.8
    });

    let jsonText = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    const start = jsonText.indexOf('[');
    const end = jsonText.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      jsonText = jsonText.substring(start, end + 1);
    }

    const list = JSON.parse(jsonText);
    if (Array.isArray(list)) {
      for (const item of list) {
        if (!item.nameChinese || !item.namePinyin || !item.nameVietnamese) continue;
        const word = item.nameChinese.trim();
        if (existingSet.has(word) || /\d/.test(word) || word.includes('_')) continue;

        await prisma.customVocab.create({
          data: {
            nameChinese: word,
            namePinyin: item.namePinyin.trim(),
            nameVietnamese: item.nameVietnamese.trim(),
            hskLevel: randomLevel,
            category: randomTopic,
            exampleChinese: item.exampleChinese?.trim() || null,
            examplePinyin: item.examplePinyin?.trim() || null,
            exampleVietnamese: item.exampleVietnamese?.trim() || null,
          }
        });

        existingSet.add(word);
        addedNew++;
      }
    }
  } catch (err: any) {
    console.warn(`   ⚠️ Lỗi AI: ${err.message || err}`);
  }

  console.log('==================================================');
  console.log(`🎉 NẠP TỪ VỰNG HOÀN TẤT!`);
  console.log(`✨ Đã sinh & nạp thành công +${addedNew} từ vựng HSK ${randomLevel} mới.`);
  console.log(`📚 Tổng kho từ vựng HSK độc bản hiện tại: ${existingSet.size} từ.`);
  console.log('==================================================\n');
}

generateFreshAiVocabs().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
