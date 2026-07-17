import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { customerName, message, history } = await request.json();

    if (!customerName || !message) {
      return NextResponse.json({ error: 'Missing customerName or message parameter' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key is not configured' }, { status: 500 });
    }

    // Build history context if provided
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.sender === 'player' ? 'user' : 'assistant',
      content: h.text
    }));

    const systemInstruction = `Bạn là khách hàng người Trung Quốc có tên là "${customerName}" đang muốn thuê bà chủ Vy thiết kế nội thất cho căn nhà của mình.
Hãy đóng vai nhân vật này và trả lời tin nhắn của bà chủ Vy một cách vô cùng tự nhiên, ngắn gọn (khoảng 10-20 từ), thân thiện.
Hãy thảo luận về các đồ đạc, chất liệu (gỗ, đá, kính) hoặc phong cách thiết kế bạn muốn.
Xưng hô tự nhiên của nhân vật (ví dụ: tôi - bà chủ, hoặc anh - em nếu tên khách là Khang).
Tuyệt đối KHÔNG được sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong câu trả lời.

Yêu cầu định dạng câu trả lời BẮT BUỘC (Chỉ trả về đúng định dạng này, không có thêm bất kỳ giải thích nào):
[Câu tiếng Trung] /// [Phiên âm Pinyin] /// [Bản dịch tiếng Việt tự nhiên]

Ví dụ:
我想用木头做一张桌子。 /// Wǒ xiǎng yòng mùtou zuò yì zhāng zhuōzi. /// Tôi muốn dùng gỗ để làm một chiếc bàn.`;

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
          ...formattedHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Groq API error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const replyRaw = data.choices?.[0]?.message?.content || '';

    // Split response by '///'
    const parts = replyRaw.split('///').map((p: string) => p.trim());
    const replyText = parts[0] || '你好！';
    const replyPinyin = parts[1] || '';
    const replyTranslation = parts[2] || '';

    return NextResponse.json({
      text: replyText,
      pinyin: replyPinyin,
      translation: replyTranslation
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
