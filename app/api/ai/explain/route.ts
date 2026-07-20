import { NextResponse } from 'next/server';
import { getAIChatCompletion } from '@/lib/ai';

function generateFallbackExplanation(word: string) {
  return `### 1. Ý nghĩa
Từ "${word}" là một thuật ngữ tiếng Trung thông dụng được dùng để gọi tên đồ vật hoặc mô tả không gian kiến trúc nội thất.

### 2. Cách dùng
Trong thiết kế nội thất, từ "${word}" thường xuất hiện khi mô tả các yêu cầu mua sắm, sắp xếp bố cục phòng ăn, phòng khách hoặc phòng ngủ.

### 3. Ví dụ
- Tiếng Trung: "这间房间里需要一个${word}。"
- Phiên âm: "Zhè jiān fángjiān lǐ xūyào yí ge ${word}."
- Tiếng Việt: "Trong căn phòng này cần có một ${word}."

### 4. Góc Cà Khịa
Nhìn từ "${word}" này mà Vy không nhớ nữa thì coi như bao nhiêu công sức học tập đổ sông đổ biển luôn nha! Gáng học thuộc đi nhé!`;
}

export async function POST(request: Request) {
  try {
    const { word } = await request.json();

    if (!word) {
      return NextResponse.json({ error: 'Missing word parameter' }, { status: 400 });
    }

    const systemInstruction = `[AI Giải Nghĩa Mỏ Hỗn]
Bạn là một Trợ lý AI giải thích từ vựng tiếng Trung ngành thiết kế nội thất.
Hãy giải thích từ vựng tiếng Trung "${word}" ngắn gọn (khoảng 100-150 từ), dễ hiểu và cực kỳ hài hước.
Tuyệt đối KHÔNG được sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong toàn bộ câu trả lời.
Định dạng câu trả lời bằng Markdown gồm các phần sau:
### 1. Ý nghĩa
### 2. Cách dùng
### 3. Ví dụ
### 4. Góc Cà Khịa`;

    try {
      const explanation = await getAIChatCompletion({
        systemPrompt: systemInstruction,
        userPrompt: `Hãy giải thích chi tiết từ vựng sau: "${word}"`,
        temperature: 0.8,
        maxTokens: 500
      });

      if (explanation && explanation.trim()) {
        return NextResponse.json({ explanation });
      }
    } catch (aiErr: any) {
      console.warn("AI Explain error, returning smart fallback:", aiErr?.message || aiErr);
    }

    const fallbackExplanation = generateFallbackExplanation(word);
    return NextResponse.json({ explanation: fallbackExplanation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
