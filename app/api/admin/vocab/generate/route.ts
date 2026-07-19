import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { getAIChatCompletion } from '@/lib/ai';

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
      toneDescription = 'Ví dụ câu (exampleChinese) và nghĩa câu ví dụ (exampleVietnamese) phải cực kỳ hài hước, xéo xắt, mỏ hỗn, cà khịa phong cách Gen Z để tạo niềm vui châm biếm khi học tập.';
    } else if (tone === 'sweet') {
      toneDescription = 'Ví dụ câu (exampleChinese) và nghĩa câu ví dụ (exampleVietnamese) phải tràn ngập sự ngọt ngào, cưng chiều, ngôn tình, đầy thính tình yêu siêu lãng mạn dành cho các cặp đôi yêu nhau.';
    } else {
      toneDescription = 'Ví dụ câu (exampleChinese) và nghĩa câu ví dụ (exampleVietnamese) phải chuẩn mực, nghiêm túc, mang tính học thuật và chính xác cao theo chuẩn đề thi HSK.';
    }

    const systemPrompt = `Bạn là bot tạo từ vựng tiếng Trung HSK cho game.
Hãy phân tích yêu cầu của người dùng (có thể là danh sách từ tiếng Trung, hoặc chủ đề bằng tiếng Việt, hoặc cấp độ HSK).
Hãy tạo ra một danh sách từ vựng gồm tối đa 10 từ phù hợp nhất.
Với mỗi từ, hãy tạo cấu trúc JSON chính xác như sau:
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
Lưu ý quan trọng về văn phong ví dụ:
- ${toneDescription}
- Chỉ trả về duy nhất một mảng JSON hợp lệ dạng [...], không được bao bọc trong block code hay thêm bất kỳ chữ chào hỏi/giải thích nào khác ngoài JSON.
- Cấp độ HSK phải là số nguyên ${hskLevel}.
- Tuyệt đối KHÔNG sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong câu trả lời.`;

    const content = await getAIChatCompletion({
      systemPrompt,
      userPrompt: `Hãy tạo từ vựng cho yêu cầu sau: "${query}"`,
      temperature: 0.8,
      maxTokens: 2000
    });
    
    try {
      const jsonStart = content.indexOf('[');
      const jsonEnd = content.lastIndexOf(']') + 1;
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("Không tìm thấy mảng JSON.");
      }
      const cleanJson = content.slice(jsonStart, jsonEnd);
      const vocabList = JSON.parse(cleanJson);
      return NextResponse.json({ success: true, vocabList });
    } catch (parseErr) {
      console.error("Failed to parse AI response:", content);
      return NextResponse.json({ error: "Phản hồi từ AI không đúng định dạng JSON.", raw: content }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
