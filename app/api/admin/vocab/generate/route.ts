import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { getAIChatCompletion } from '@/lib/ai';

function generateFallbackVocab(query: string, hskLevel: number, category: string) {
  const q = query.trim();
  return [
    {
      nameChinese: q,
      namePinyin: 'pīnyīn',
      nameVietnamese: `Từ vựng về ${q}`,
      hskLevel,
      category,
      exampleChinese: `我们一起学习${q}。`,
      examplePinyin: `Wǒmen yìqǐ xuéxí ${q}.`,
      exampleVietnamese: `Chúng ta cùng học ${q}.`
    }
  ];
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Quyền truy cập bị từ chối.' }, { status: 403 });
    }

    const { query, hskLevel = 1, tone = 'roast', category = 'Khác' } = await request.json();
    if (!query) {
      return NextResponse.json({ error: 'Thiếu từ khóa hoặc danh sách từ.' }, { status: 400 });
    }

    let toneDescription = '';
    if (tone === 'roast') {
      toneDescription = 'Ví dụ câu (exampleChinese) và nghĩa câu ví dụ (exampleVietnamese) phải hài hước, xéo xắt, mỏ hỗn, cà khịa phong cách Gen Z.';
    } else if (tone === 'sweet') {
      toneDescription = 'Ví dụ câu (exampleChinese) và nghĩa câu ví dụ (exampleVietnamese) phải tràn ngập sự ngọt ngào, cưng chiều, ngôn tình.';
    } else {
      toneDescription = 'Ví dụ câu (exampleChinese) và nghĩa câu ví dụ (exampleVietnamese) phải chuẩn mực, nghiêm túc, mang tính học thuật HSK.';
    }

    const systemPrompt = `Bạn là bot tạo từ vựng tiếng Trung HSK cho game.
Hãy phân tích yêu cầu của người dùng.
Hãy tạo ra một danh sách từ vựng gồm tối đa 10 từ phù hợp nhất.
Với mỗi từ, hãy tạo cấu trúc JSON chính xác như sau:
[
  {
    "nameChinese": "Chữ Hán",
    "namePinyin": "Phiên âm",
    "nameVietnamese": "Dịch nghĩa tiếng Việt",
    "hskLevel": ${hskLevel},
    "category": "${category}",
    "exampleChinese": "Ví dụ tiếng Trung",
    "examplePinyin": "Phiên âm câu ví dụ",
    "exampleVietnamese": "Dịch nghĩa câu ví dụ"
  }
]
Lưu ý quan trọng:
- ${toneDescription}
- Chỉ trả về duy nhất một mảng JSON hợp lệ dạng [...].
- Tuyệt đối KHÔNG sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào.`;

    try {
      const content = await getAIChatCompletion({
        systemPrompt,
        userPrompt: `Hãy tạo từ vựng cho yêu cầu sau: "${query}"`,
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

    const fallbackVocab = generateFallbackVocab(query, hskLevel, category);
    return NextResponse.json({ success: true, vocabList: fallbackVocab });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
