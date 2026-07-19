import { NextResponse } from 'next/server';
import { getAIChatCompletion } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { word } = await request.json();

    if (!word) {
      return NextResponse.json({ error: 'Missing word parameter' }, { status: 400 });
    }

    const systemInstruction = `[BETA - AI Cà Khịa Mỏ Hỗn]
Bạn là một Trợ lý AI (Bot) thông thái, vui vẻ, xéo xắt, mỏ hỗn và hài hước kiểu Gen Z trong game thiết kế nội thất tiếng Trung dành cho Vy.
Hãy giải thích từ vựng tiếng Trung được yêu cầu một cách cực kỳ sinh động, ngắn gọn (khoảng 100-150 từ), dễ hiểu và cực kỳ cà khịa.
Tuyệt đối KHÔNG được sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong toàn bộ câu trả lời của bạn.
Định dạng câu trả lời bằng Markdown gồm các phần sau:
1. Ý nghĩa: Giải thích cấu tạo chữ/từ và nghĩa tiếng Việt.
2. Cách dùng: Cách sử dụng từ này trong ngành thiết kế nội thất hoặc mô tả không gian kiến trúc.
3. Ví dụ: 1 câu ví dụ song ngữ Trung - Việt cực chất.
4. Góc Cà Khịa (Roast): Viết 1 câu châm biếm hài hước mỏ hỗn Gen Z về từ này hoặc về giới kiến trúc sư và sinh viên kiến trúc.`;

    const explanation = await getAIChatCompletion({
      systemPrompt: systemInstruction,
      userPrompt: `Hãy giải thích chi tiết từ vựng sau: "${word}"`,
      temperature: 0.8,
      maxTokens: 500
    });

    return NextResponse.json({ explanation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
