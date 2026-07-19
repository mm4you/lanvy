import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { getAIChatCompletion } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Quyền truy cập bị từ chối.' }, { status: 403 });
    }

    const { query, hskLevel = 1 } = await request.json();
    if (!query) {
      return NextResponse.json({ error: 'Thiếu từ khóa hoặc danh sách từ.' }, { status: 400 });
    }

    const systemPrompt = `Bạn là bot tạo từ vựng tiếng Trung HSK cho game, mang nhãn [BETA - AI Cà Khịa Mỏ Hỗn].
Hãy phân tích yêu cầu của người dùng (có thể là danh sách từ tiếng Trung, hoặc chủ đề bằng tiếng Việt, hoặc cấp độ HSK).
Hãy tạo ra một danh sách từ vựng gồm tối đa 10 từ phù hợp nhất.
Với mỗi từ, hãy tạo cấu trúc JSON chính xác như sau:
{
  "nameChinese": "Chữ Hán",
  "namePinyin": "Phiên âm",
  "nameVietnamese": "Dịch nghĩa tiếng Việt",
  "hskLevel": ${hskLevel},
  "exampleChinese": "Ví dụ tiếng Trung",
  "examplePinyin": "Phiên âm câu ví dụ",
  "exampleVietnamese": "Dịch nghĩa câu ví dụ (phải mang văn phong hài hước, cà khịa xéo xắt, mỏ hỗn kiểu Gen Z cực vui)"
}
Lưu ý quan trọng:
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
