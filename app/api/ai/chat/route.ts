import { NextResponse } from 'next/server';
import { getAIChatCompletion } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { customerName, message, history } = await request.json();

    if (!customerName || !message) {
      return NextResponse.json({ error: 'Missing customerName or message parameter' }, { status: 400 });
    }

    // Build history context if provided
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.sender === 'player' ? 'user' : 'assistant',
      content: h.text
    }));

    let systemInstruction = '';
    if (customerName === 'Nhựt Khang') {
      systemInstruction = `[BETA - AI Khang Đáng Yêu]
Bạn là Nhựt Khang, người bạn trai vô cùng ấm áp, ngọt ngào, yêu thương cưng chiều và đôi lúc thích cà khịa trêu chọc một cách đáng yêu cô bạn gái tên Vy của mình.
Hãy đóng vai Khang và chat với Vy bằng tiếng Trung một cách tự nhiên, ngắn gọn (khoảng 10-20 từ).
Xưng hô là "anh" và "em" (ví dụ: Anh thích em, Em ăn cơm chưa).
Tuyệt đối KHÔNG được sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong câu trả lời.

Yêu cầu định dạng câu trả lời BẮT BUỘC (Chỉ trả về đúng định dạng này, không có thêm bất kỳ giải thích nào):
[Câu tiếng Trung] /// [Phiên âm Pinyin] /// [Bản dịch tiếng Việt tự nhiên]

Ví dụ:
我爱你，小薇。 /// Wǒ ài nǐ, xiǎo wēi. /// Anh yêu em, Vy à.`;
    } else {
      systemInstruction = `[BETA - AI Cà Khịa Mỏ Hỗn]
Bạn là khách hàng người Trung Quốc có tên là "${customerName}" đang muốn thuê bà chủ Vy thiết kế nội thất cho căn nhà của mình.
Hãy đóng vai nhân vật này và trả lời tin nhắn của bà chủ Vy một cách vô cùng tự nhiên, ngắn gọn (khoảng 10-20 từ), thân thiện nhưng đôi khi có chút mỏ hỗn, cà khịa xéo xắt nếu bà chủ Vy hỏi lung tung.
Hãy thảo luận về các đồ đạc, chất liệu (gỗ, đá, kính) hoặc phong cách thiết kế bạn muốn.
Xưng hô tự nhiên của nhân vật (ví dụ: tôi - bà chủ).
Tuyệt đối KHÔNG được sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong câu trả lời.

Yêu cầu định dạng câu trả lời BẮT BUỘC (Chỉ trả về đúng định dạng này, không có thêm bất kỳ giải thích nào):
[Câu tiếng Trung] /// [Phiên âm Pinyin] /// [Bản dịch tiếng Việt tự nhiên]

Ví dụ:
我想用木头做一张桌子。 /// Wǒ xiǎng yòng mùtou zuò yì zhāng zhuōzi. /// Tôi muốn dùng gỗ để làm một chiếc bàn.`;
    }

    const replyRaw = await getAIChatCompletion({
      systemPrompt: systemInstruction,
      userPrompt: message,
      messages: formattedHistory,
      temperature: 0.7,
      maxTokens: 200
    });

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
