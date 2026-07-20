import { NextResponse } from 'next/server';
import { getAIChatCompletion } from '@/lib/ai';

function generateFallbackQuestions(theme: string) {
  const t = theme.trim();
  return [
    {
      chinese: `我想去${t}`,
      pinyin: `Wǒ xiǎng qù ${t}`,
      translation: `Tôi muốn đi ${t}`,
      type: 'translate',
      options: [
        `Tôi muốn đi ${t}`,
        `Tôi không thích ${t}`,
        `Hôm nay trời rất ${t}`,
        `Bạn có ${t} không?`
      ],
      explanation: `Mẫu câu "我想去..." dùng để diễn đạt mong muốn đến đâu hoặc làm gì đó liên quan tới ${t}.`
    },
    {
      chinese: `一起去${t}吧！`,
      pinyin: `Yìqǐ qù ${t} ba!`,
      translation: `Cùng đi ${t} nhé!`,
      type: 'translate',
      options: [
        `Cùng đi ${t} nhé!`,
        `Tôi vừa đi ${t} về`,
        `Ngày mai không đi ${t}`,
        `${t} rất đắt tiền`
      ],
      explanation: `Mẫu câu "一起...吧" là lời rủ rê cực kỳ thân thiện để cùng làm điều gì đó!`
    },
    {
      chinese: `${t}非常有趣`,
      pinyin: `${t} fēicháng yǒuqù`,
      translation: `${t} rất thú vị`,
      type: 'translate',
      options: [
        `${t} rất thú vị`,
        `${t} rất chán`,
        `${t} quá khó`,
        `${t} ở rất xa`
      ],
      explanation: `"非常" (fēicháng) nghĩa là rất, cực kỳ; "有趣" (yǒuqù) có nghĩa là thú vị.`
    },
    {
      chinese: `你喜欢${t}吗？`,
      pinyin: `Nǐ xǐhuān ${t} ma?`,
      translation: `Bạn có thích ${t} không?`,
      type: 'translate',
      options: [
        `Bạn có thích ${t} không?`,
        `Bạn đã đi ${t} chưa?`,
        `Khi nào bạn đi ${t}?`,
        `Ai muốn đi ${t}?`
      ],
      explanation: `Mẫu câu hỏi ngỏ "喜欢...吗" là cấu trúc hỏi sở thích cơ bản và thông dụng nhất HSK.`
    },
    {
      chinese: `今天我们${t}`,
      pinyin: `Jīntiān wǒmen ${t}`,
      translation: `Hôm nay chúng ta ${t}`,
      type: 'translate',
      options: [
        `Hôm nay chúng ta ${t}`,
        `Ngày mai chúng ta ${t}`,
        `Hôm qua họ đã ${t}`,
        `Tuần sau anh ấy ${t}`
      ],
      explanation: `"今天" (jīntiān) là hôm nay, "我们" (wǒmen) là chúng ta.`
    }
  ];
}

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
[
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
    "explanation": "Lời giải thích ngắn gọn, xúc tích, vui nhộn."
  }
]

Yêu cầu cực kỳ quan trọng:
1. Mảng "options" phải có đúng 4 phần tử độc lập, trong đó có một phần tử khớp hoàn toàn 100% với giá trị của trường "translation". Hãy tráo đổi vị trí của đáp án đúng ngẫu nhiên trong mảng options.
2. Tuyệt đối KHÔNG trả về bất kỳ từ chào hỏi, giải thích hoặc block code markdown nào khác. Chỉ trả về duy nhất một mảng JSON hợp lệ.
3. Tuyệt đối KHÔNG sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào trong câu hỏi hay lời giải thích.
4. Đảm bảo từ vựng và câu xoay quanh chủ đề "${theme}" và phù hợp cấp độ HSK ${hskLevel}.`;

    try {
      const rawReply = await getAIChatCompletion({
        systemPrompt,
        userPrompt: `Hãy tạo 5 câu hỏi trắc nghiệm tiếng Trung theo chủ đề: ${theme}`,
        temperature: 0.8,
        maxTokens: 1500
      });

      const cleanJson = rawReply.replace(/```json/g, '').replace(/```/g, '').trim();
      const quizQuestions = JSON.parse(cleanJson);
      if (Array.isArray(quizQuestions) && quizQuestions.length > 0) {
        return NextResponse.json({ success: true, questions: quizQuestions });
      }
    } catch (aiErr: any) {
      console.warn("AI generation error, using smart fallback:", aiErr?.message || aiErr);
    }

    // Smart procedural fallback if AI fails or times out
    const fallbackQuestions = generateFallbackQuestions(theme);
    return NextResponse.json({ success: true, questions: fallbackQuestions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
