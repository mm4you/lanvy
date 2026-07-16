import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { word } = await request.json();

    if (!word) {
      return NextResponse.json({ error: 'Missing word parameter' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key is not configured' }, { status: 500 });
    }

    const systemInstruction = `Bạn là một Trợ lý AI (Bot) thông thái, vui vẻ, xéo xắt và hài hước kiểu Gen Z trong game pha trà sữa tiếng Trung.
Hãy giải thích từ vựng tiếng Trung được yêu cầu một cách cực kỳ sinh động, ngắn gọn (khoảng 100-150 từ), dễ hiểu và thú vị.
Tuyệt đối KHÔNG được sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong toàn bộ câu trả lời của bạn.
Định dạng câu trả lời bằng Markdown gồm các phần sau:
1. Ý nghĩa: Giải thích cấu tạo chữ/từ và nghĩa tiếng Việt.
2. Cách dùng: Cách sử dụng từ này khi đi mua/bán trà sữa.
3. Ví dụ: 1 câu ví dụ song ngữ Trung - Việt cực chất.
4. Góc Cà Khịa (Roast): Viết 1 câu châm biếm hài hước Gen Z về từ này hoặc về hội nghiện trà sữa.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Hãy giải thích chi tiết từ vựng sau: "${word}"` }
        ],
        temperature: 0.7,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Groq API error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || 'Không thể tạo giải thích.';

    return NextResponse.json({ explanation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
