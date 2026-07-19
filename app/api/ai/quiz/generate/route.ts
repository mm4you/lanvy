import { NextResponse } from 'next/server';
import { getAIChatCompletion } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { theme, hskLevel = 1 } = await request.json();
    if (!theme) {
      return NextResponse.json({ error: 'Thiếu chủ đề luyện tập.' }, { status: 400 });
    }

    const systemPrompt = `Bạn là chuyên gia tạo câu hỏi trắc nghiệm tiếng Trung HSK cho game.
Người dùng muốn học tiếng Trung theo chủ đề: "${theme}" (ở cấp độ HSK ${hskLevel}).
Hãy tạo ra đúng 5 câu hỏi trắc nghiệm tiếng Trung đa dạng và thú vị về chủ đề này.
Định dạng trả về BẮT BUỘC là một mảng JSON gồm đúng 5 đối tượng câu hỏi có cấu trúc chính xác như sau:
{
  "chinese": "Từ hoặc câu tiếng Trung cần hỏi",
  "pinyin": "Phiên âm Pinyin tương ứng",
  "translation": "Dịch nghĩa tiếng Việt chính xác (đây sẽ là đáp án đúng)",
  "type": "translate",
  "options": [
    "Đáp án đúng (chính là translation)",
    "Đáp án sai 1",
    "Đáp án sai 2",
    "Đáp án sai 3"
  ],
  "explanation": "Lời giải thích ngắn gọn, xúc tích, vui nhộn mang giọng điệu cà khịa xéo xắt kiểu Gen Z nhưng vẫn cung cấp kiến thức."
}

Yêu cầu cực kỳ quan trọng:
1. Mảng "options" phải có đúng 4 phần tử độc lập, trong đó có một phần tử khớp hoàn toàn 100% với giá trị của trường "translation". Hãy tráo đổi vị trí của đáp án đúng ngẫu nhiên trong mảng options.
2. Tuyệt đối KHÔNG trả về bất kỳ từ chào hỏi, giải thích hoặc block code markdown nào khác. Chỉ trả về duy nhất một mảng JSON hợp lệ.
3. Tuyệt đối KHÔNG sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong câu hỏi hay lời giải thích.
4. Đảm bảo từ vựng và câu xoay quanh chủ đề "${theme}" và phù hợp cấp độ HSK ${hskLevel}.`;

    const rawReply = await getAIChatCompletion({
      systemPrompt,
      userPrompt: `Hãy tạo 5 câu hỏi trắc nghiệm tiếng Trung theo chủ đề: ${theme}`,
      temperature: 0.8,
      maxTokens: 1500
    });

    // Parse JSON safely
    let quizQuestions;
    try {
      const cleanJson = rawReply.replace(/```json/g, '').replace(/```/g, '').trim();
      quizQuestions = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Failed to parse AI quiz response:", rawReply);
      return NextResponse.json({ error: 'Lỗi định dạng dữ liệu AI.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, questions: quizQuestions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
