import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { getAIChatCompletion } from '@/lib/ai';

export type HskGroupType = 'hsk123' | 'hsk456' | 'hsk789' | 'hsk1' | 'hsk2' | 'hsk3' | 'hsk4' | 'hsk5' | 'hsk6' | 'hsk7' | 'hsk8' | 'hsk9' | 'all';

function getHskPromptText(hskGroup: HskGroupType): string {
  switch (hskGroup) {
    case 'hsk123': return 'HSK 1, 2 và 3 (Cơ Bản)';
    case 'hsk456': return 'HSK 4, 5 và 6 (Trung Cấp)';
    case 'hsk789': return 'HSK 7, 8 và 9 (Cao Cấp Nâng Cao)';
    case 'hsk1': return 'HSK 1 (Cơ bản cấp 1)';
    case 'hsk2': return 'HSK 2 (Cơ bản cấp 2)';
    case 'hsk3': return 'HSK 3 (Cơ bản cấp 3)';
    case 'hsk4': return 'HSK 4 (Trung cấp 4)';
    case 'hsk5': return 'HSK 5 (Trung cấp 5)';
    case 'hsk6': return 'HSK 6 (Trung cấp 6)';
    case 'hsk7': return 'HSK 7 (Cao cấp 7)';
    case 'hsk8': return 'HSK 8 (Cao cấp 8)';
    case 'hsk9': return 'HSK 9 (Cao cấp 9)';
    default: return 'HSK 1 đến HSK 9 (Toàn Bộ)';
  }
}

export async function POST(req: Request) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { query = 'Giao tiếp hàng ngày', category = 'Đời sống', hskGroup = 'all' } = await req.json();
    const groupText = getHskPromptText(hskGroup);

    const systemPrompt = `Bạn là chuyên gia biên soạn giáo trình tiếng Trung HSK 1-9.
Nhiệm vụ: Tạo 20 từ vựng tiếng Trung thuộc cấp độ ${groupText} cho chủ đề "${category}".
Yêu cầu: Chỉ trả về chữ Hán thực tế (VD: 苹果, 学习, 精彩). Tuyệt đối không dính số hay mã rác.
Trả về duy nhất dạng JSON MẢNG (Array of objects), KHÔNG kèm markdown:
[
  {
    "nameChinese": "字",
    "namePinyin": "zì",
    "nameVietnamese": "Nghĩa tiếng Việt",
    "hskLevel": 1,
    "category": "${category}",
    "exampleChinese": "Ví dụ tiếng Trung",
    "examplePinyin": "Pinyin ví dụ",
    "exampleVietnamese": "Dịch ví dụ"
  }
]`;

    const userPrompt = `Hãy tạo 20 từ vựng HSK thuộc nhóm ${groupText} chủ đề: ${query}`;

    const aiResponse = await getAIChatCompletion({
      systemPrompt,
      userPrompt,
      maxTokens: 1600,
      temperature: 0.7
    });

    let jsonText = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    const start = jsonText.indexOf('[');
    const end = jsonText.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      jsonText = jsonText.substring(start, end + 1);
    }

    const items = JSON.parse(jsonText);
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('API /admin/vocab/generate error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Lỗi sinh từ vựng AI' }, { status: 500 });
  }
}
