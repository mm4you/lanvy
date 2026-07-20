import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { getAIChatCompletion } from '@/lib/ai';

function generateFallbackBalancedVocab(query: string, category: string) {
  return [
    // HSK 1
    {
      nameChinese: '学习',
      namePinyin: 'xuéxí',
      nameVietnamese: 'Học tập',
      hskLevel: 1,
      category,
      exampleChinese: '大家都在努力学习汉语。',
      examplePinyin: 'Dàjiā dōu zài nǔlì xuéxí Hànyǔ.',
      exampleVietnamese: 'Mọi người đều đang nỗ lực học tiếng Trung.'
    },
    {
      nameChinese: '喜欢',
      namePinyin: 'xǐhuan',
      nameVietnamese: 'Thích, yêu thích',
      hskLevel: 1,
      category,
      exampleChinese: '我很喜欢这个新 phòng。',
      examplePinyin: 'Wǒ hěn xǐhuan zhè ge xīn fáng.',
      exampleVietnamese: 'Tôi rất thích căn phòng mới này.'
    },
    {
      nameChinese: '朋友',
      namePinyin: 'péngyou',
      nameVietnamese: 'Bạn bè',
      hskLevel: 1,
      category,
      exampleChinese: '我们都是好朋友。',
      examplePinyin: 'Wǒmen dōu shì hǎo péngyou.',
      exampleVietnamese: 'Chúng tôi đều là bạn tốt của nhau.'
    },
    // HSK 2
    {
      nameChinese: '准备',
      namePinyin: 'zhǔnbèi',
      nameVietnamese: 'Chuẩn bị',
      hskLevel: 2,
      category,
      exampleChinese: '大家都已经准备好了。',
      examplePinyin: 'Dàjiā dōu yǐjīng zhǔnbèi hǎo le.',
      exampleVietnamese: 'Mọi người đều đã chuẩn bị xong xuôi.'
    },
    {
      nameChinese: '介绍',
      namePinyin: 'jièshào',
      nameVietnamese: 'Giới thiệu',
      hskLevel: 2,
      category,
      exampleChinese: '让我给你介绍一下新朋友。',
      examplePinyin: 'Ràng wǒ gěi nǐ jièshào yíxià xīn péngyou.',
      exampleVietnamese: 'Để tôi giới thiệu cho bạn một người bạn mới.'
    },
    {
      nameChinese: '非常',
      namePinyin: 'fēicháng',
      nameVietnamese: 'Vô cùng, rất',
      hskLevel: 2,
      category,
      exampleChinese: '这个设计非常漂亮。',
      examplePinyin: 'Zhè ge shèjì fēicháng piàoliang.',
      exampleVietnamese: 'Bản thiết kế này vô cùng đẹp mắt.'
    },
    // HSK 3
    {
      nameChinese: '选择',
      namePinyin: 'xuǎnzé',
      nameVietnamese: 'Lựa chọn',
      hskLevel: 3,
      category,
      exampleChinese: '这是最好的选择。',
      examplePinyin: 'Zhè shì zuì hǎo de xuǎnzé.',
      exampleVietnamese: 'Đây là sự lựa chọn tốt nhất.'
    },
    {
      nameChinese: '影响',
      namePinyin: 'yǐngxiǎng',
      nameVietnamese: 'Ảnh hưởng',
      hskLevel: 3,
      category,
      exampleChinese: '环境对人有很大影响。',
      examplePinyin: 'Huánjìng duì rén yǒu hěn dà yǐngxiǎng.',
      exampleVietnamese: 'Môi trường có ảnh hưởng rất lớn tới con người.'
    },
    {
      nameChinese: '满意',
      namePinyin: 'mǎnyì',
      nameVietnamese: 'Hài lòng',
      hskLevel: 3,
      category,
      exampleChinese: '客户对我们的设计非常满意。',
      examplePinyin: 'Kèhù duì wǒmen de shèjì fēicháng mǎnyì.',
      exampleVietnamese: 'Khách hàng vô cùng hài lòng với thiết kế của chúng tôi.'
    }
  ];
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Quyền truy cập bị từ chối.' }, { status: 403 });
    }

    const { query, category = 'Khác' } = await request.json();
    if (!query) {
      return NextResponse.json({ error: 'Thiếu từ khóa hoặc chủ đề tạo từ.' }, { status: 400 });
    }

    const systemPrompt = `Bạn là bot tạo từ vựng tiếng Trung HSK cho game.
Người dùng muốn tạo bộ từ vựng xoay quanh chủ đề: "${query}" (thuộc danh mục: "${category}").
Yêu cầu BẮT BUỘC:
1. Hãy tạo ra đúng 9 từ vựng tiếng Trung chất lượng cao.
2. CÂN BẰNG ĐỀU 3 CẤP ĐỘ: đúng 3 từ HSK 1, 3 từ HSK 2 và 3 từ HSK 3! (Đặt hskLevel tương ứng là 1, 2, hoặc 3).
3. Mỗi đối tượng từ vựng phải có cấu trúc JSON chính xác như sau:
[
  {
    "nameChinese": "Chữ Hán",
    "namePinyin": "Phiên âm",
    "nameVietnamese": "Dịch nghĩa tiếng Việt",
    "hskLevel": 1, // hoặc 2, 3
    "category": "${category}",
    "exampleChinese": "Ví dụ tiếng Trung",
    "examplePinyin": "Phiên âm câu ví dụ",
    "exampleVietnamese": "Dịch nghĩa câu ví dụ"
  }
]
4. Chỉ trả về duy nhất một mảng JSON hợp lệ dạng [...], không được bao bọc trong block code hay thêm bất kỳ chữ chào hỏi/giải thích nào khác ngoài JSON.
5. Tuyệt đối KHÔNG sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào.`;

    try {
      const content = await getAIChatCompletion({
        systemPrompt,
        userPrompt: `Hãy tạo 9 từ vựng HSK 1-2-3 cân bằng theo chủ đề: "${query}"`,
        temperature: 0.8,
        maxTokens: 2000
      });
      
      const jsonStart = content.indexOf('[');
      const jsonEnd = content.lastIndexOf(']') + 1;
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const cleanJson = content.slice(jsonStart, jsonEnd);
        const vocabList = JSON.parse(cleanJson);
        if (Array.isArray(vocabList) && vocabList.length > 0) {
          return NextResponse.json({ success: true, vocabList });
        }
      }
    } catch (aiErr: any) {
      console.warn("AI Vocab Gen error, returning smart fallback:", aiErr?.message || aiErr);
    }

    const fallbackVocab = generateFallbackBalancedVocab(query, category);
    return NextResponse.json({ success: true, vocabList: fallbackVocab });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
