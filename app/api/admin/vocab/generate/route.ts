import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';

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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key chưa cấu hình trên server.' }, { status: 500 });
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
  "exampleChinese": "Ví dụ tiếng Trung",
  "examplePinyin": "Phiên âm câu ví dụ",
  "exampleVietnamese": "Dịch nghĩa câu ví dụ"
}
Lưu ý quan trọng:
- Chỉ trả về duy nhất một mảng JSON hợp lệ dạng [...], không được bao bọc trong block code hay thêm bất kỳ chữ chào hỏi/giải thích nào khác ngoài JSON.
- Cấp độ HSK phải là số nguyên ${hskLevel}.
- Tuyệt đối KHÔNG sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong câu trả lời.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Hãy tạo từ vựng cho yêu cầu sau: "${query}"` }
        ],
        temperature: 0.6,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Groq error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '[]';
    
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
