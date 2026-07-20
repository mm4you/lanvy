import { NextResponse } from 'next/server';
import { getAIChatCompletion } from '@/lib/ai';

const KHANG_FALLBACK_REPLIES = [
  { text: '我一直在 Vy 的身边。', pinyin: 'Wǒ yīzhí zài Vy de shēnbiān.', translation: 'Anh luôn ở bên cạnh Vy mà!' },
  { text: '加油，我的爱人！', pinyin: 'Jiāyóu, wǒ de àirén!', translation: 'Cố lên người yêu của anh ơi!' },
  { text: '今天你想吃什么？', pinyin: 'Jīntiān nǐ xiǎng chī shénme?', translation: 'Hôm nay em muốn ăn món gì nè?' },
  { text: '我想听听你的声音。', pinyin: 'Wǒ xiǎng tīngting nǐ de shēngyīn.', translation: 'Anh rất muốn nghe giọng nói của em.' },
  { text: '你觉得累吗？休息一下吧。', pinyin: 'Nǐ juéde lèi ma? Xiūxi yíxià ba.', translation: 'Em có thấy mệt không? Nghỉ ngơi một chút nhé.' }
];

const GENERIC_AI_FALLBACK_REPLIES = [
  { text: '你好！这个设计非常棒。', pinyin: 'Nǐ hǎo! Zhège shèjì fēicháng bàng.', translation: 'Chào bạn! Bản thiết kế này rất tuyệt vời.' },
  { text: '请问你想用什么材料？', pinyin: 'Qǐngwèn nǐ xiǎng yòng shénme cáiliào?', translation: 'Xin hỏi bạn muốn dùng vật liệu gì?' },
  { text: '好的，我们一起努力吧！', pinyin: 'Hǎo de, wǒmen yìqǐ nǔlì ba!', translation: 'Được rồi, chúng ta cùng cố gắng nhé!' }
];

export async function POST(request: Request) {
  try {
    const { customerName, message, history } = await request.json();

    if (!customerName || !message) {
      return NextResponse.json({ error: 'Missing customerName or message parameter' }, { status: 400 });
    }

    const formattedHistory = (history || []).map((h: any) => ({
      role: h.sender === 'player' ? 'user' : 'assistant',
      content: h.text
    }));

    let systemInstruction = '';
    const isKhang = customerName === 'Nhựt Khang';

    if (isKhang) {
      systemInstruction = `[AI Khang Đáng Yêu]
Bạn là Nhựt Khang, người bạn trai vô cùng ấm áp, ngọt ngào, yêu thương cưng chiều cô bạn gái tên Vy của mình.
Hãy đóng vai Khang và chat với Vy bằng tiếng Trung một cách tự nhiên, ngắn gọn (khoảng 10-20 từ).
Xưng hô là "anh" và "em".
Tuyệt đối KHÔNG được sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong câu trả lời.

Yêu cầu định dạng câu trả lời BẮT BUỘC:
[Câu tiếng Trung] /// [Phiên âm Pinyin] /// [Bản dịch tiếng Việt]`;
    } else {
      systemInstruction = `[AI Trợ Lý Thiết Kế]
Bạn là khách hàng hoặc trợ lý người Trung Quốc tên "${customerName}" đang cùng thiết kế nội thất.
Trả lời ngắn gọn (10-20 từ) bằng tiếng Trung tự nhiên.
Tuyệt đối KHÔNG được sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong câu trả lời.

Yêu cầu định dạng câu trả lời BẮT BUỘC:
[Câu tiếng Trung] /// [Phiên âm Pinyin] /// [Bản dịch tiếng Việt]`;
    }

    try {
      const replyRaw = await getAIChatCompletion({
        systemPrompt: systemInstruction,
        userPrompt: message,
        messages: formattedHistory,
        temperature: 0.7,
        maxTokens: 200
      });

      const parts = replyRaw.split('///').map((p: string) => p.trim());
      if (parts.length >= 2 && parts[0]) {
        return NextResponse.json({
          text: parts[0],
          pinyin: parts[1] || '',
          translation: parts[2] || ''
        });
      }
    } catch (aiErr: any) {
      console.warn("AI Chat error, returning smart fallback:", aiErr?.message || aiErr);
    }

    // Smart fallback if AI fails or times out
    const pool = isKhang ? KHANG_FALLBACK_REPLIES : GENERIC_AI_FALLBACK_REPLIES;
    const fallback = pool[Math.floor(Math.random() * pool.length)];

    return NextResponse.json({
      text: fallback.text,
      pinyin: fallback.pinyin,
      translation: fallback.translation
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
