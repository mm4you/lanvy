import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { getAIChatCompletion } from '@/lib/ai';

function generateFallbackBalancedVocab(query: string, category: string) {
  const q = query.trim();
  return [
    // HSK 1
    {
      nameChinese: `${q}一`,
      namePinyin: `${q} yī`,
      nameVietnamese: `${q} cơ bản`,
      hskLevel: 1,
      category,
      exampleChinese: `我们学习${q}。`,
      examplePinyin: `Wǒmen xuéxí ${q}.`,
      exampleVietnamese: `Chúng ta học ${q}.`
    },
    {
      nameChinese: `喜欢${q}`,
      namePinyin: `xǐhuan ${q}`,
      nameVietnamese: `Thích ${q}`,
      hskLevel: 1,
      category,
      exampleChinese: `我很喜欢${q}。`,
      examplePinyin: `Wǒ hěn xǐhuan ${q}.`,
      exampleVietnamese: `Tôi rất thích ${q}.`
    },
    {
      nameChinese: `买${q}`,
      namePinyin: `mǎi ${q}`,
      nameVietnamese: `Mua ${q}`,
      hskLevel: 1,
      category,
      exampleChinese: `今天我想买${q}。`,
      examplePinyin: `Jīntiān wǒ xiǎng mǎi ${q}.`,
      exampleVietnamese: `Hôm nay tôi muốn mua ${q}.`
    },
    // HSK 2
    {
      nameChinese: `准备${q}`,
      namePinyin: `zhǔnbèi ${q}`,
      nameVietnamese: `Chuẩn bị ${q}`,
      hskLevel: 2,
      category,
      exampleChinese: `大家都在准备${q}。`,
      examplePinyin: `Dàjiā dōu zài zhǔnbèi ${q}.`,
      exampleVietnamese: `Mọi người đều đang chuẩn bị ${q}.`
    },
    {
      nameChinese: `介绍${q}`,
      namePinyin: `jièshào ${q}`,
      nameVietnamese: `Giới thiệu ${q}`,
      hskLevel: 2,
      category,
      exampleChinese: `请给我介绍一下${q}。`,
      examplePinyin: `Qǐng gěi wǒ jièshào yíxià ${q}.`,
      exampleVietnamese: `Xin hãy giới thiệu một chút về ${q}.`
    },
    {
      nameChinese: `非常${q}`,
      namePinyin: `fēicháng ${q}`,
      nameVietnamese: `Vô cùng ${q}`,
      hskLevel: 2,
      category,
      exampleChinese: `这个${q}非常漂亮。`,
      examplePinyin: `Zhè ge ${q} fēicháng piàoliang.`,
      exampleVietnamese: `${q} này vô cùng đẹp.`
    },
    // HSK 3
    {
      nameChinese: `选择${q}`,
      namePinyin: `xuǎnzé ${q}`,
      nameVietnamese: `Lựa chọn ${q}`,
      hskLevel: 3,
      category,
      exampleChinese: `这是最好的${q}选择。`,
      examplePinyin: `Zhè shì zuì hǎo de ${q} xuǎnzé.`,
      exampleVietnamese: `Đây là sự lựa chọn ${q} tốt nhất.`
    },
    {
      nameChinese: `影响${q}`,
      namePinyin: `yǐngxiǎng ${q}`,
      nameVietnamese: `Ảnh hưởng ${q}`,
      hskLevel: 3,
      category,
      exampleChinese: `环境对${q}有影响。`,
      examplePinyin: `Huánjìng duì ${q} yǒu yǐngxiǎng.`,
      exampleVietnamese: `Môi trường có ảnh hưởng tới ${q}.`
    },
    {
      nameChinese: `满意${q}`,
      namePinyin: `mǎnyì ${q}`,
      nameVietnamese: `Hài lòng với ${q}`,
      hskLevel: 3,
      category,
      exampleChinese: `我对这个${q}非常满意。`,
      examplePinyin: `Wǒ duì zhège ${q} fēicháng mǎnyì.`,
      exampleVietnamese: `Tôi vô cùng hài lòng với ${q} này.`
    }
  ];
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Quyền truy cập bị từ chối.' }, { status: 403 });
    }

    const { query, category = 'Khác' } = await request.json();
    if (!query) {
      return NextResponse.json({ error: 'Thiếu từ khóa hoặc chủ đề tạo từ.' }, { status: 400 });
    }

    const systemPrompt = `Bạn là bot tạo từ vựng tiếng Trung HSK cho game.
Người dùng muốn tạo bộ từ vựng xoay quanh chủ đề: "${query}" (thuộc danh mục: "${category}").
Yêu cầu BẮT BUỘC:
1. Hãy tạo ra đúng 9 từ vựng tiếng Trung chất lượng cao.
2. CÂN BẰNG ĐỀU 3 CẤP ĐỘ: đúng 3 từ HSK 1, 3 từ HSK 2 và 3 từ HSK 3! (Đặt hskLevel tương ứng là 1, 2, hoặc 3).
3. Mỗi đối tượng từ vựng phải có cấu trúc JSON chính xác như sau:
[
  {
    "nameChinese": "Chữ Hán",
    "namePinyin": "Phiên âm",
    "nameVietnamese": "Dịch nghĩa tiếng Việt",
    "hskLevel": 1, // hoặc 2, 3
    "category": "${category}",
    "exampleChinese": "Ví dụ tiếng Trung",
    "examplePinyin": "Phiên âm câu ví dụ",
    "exampleVietnamese": "Dịch nghĩa câu ví dụ"
  }
]
4. Chỉ trả về duy nhất một mảng JSON hợp lệ dạng [...], không được bao bọc trong block code hay thêm bất kỳ chữ chào hỏi/giải thích nào khác ngoài JSON.
5. Tuyệt đối KHÔNG sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào.`;

    try {
      const content = await getAIChatCompletion({
        systemPrompt,
        userPrompt: `Hãy tạo 9 từ vựng HSK 1-2-3 cân bằng theo chủ đề: "${query}"`,
        temperature: 0.8,
        maxTokens: 2000
      });
      
      const jsonStart = content.indexOf('[');
      const jsonEnd = content.lastIndexOf(']') + 1;
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const cleanJson = content.slice(jsonStart, jsonEnd);
        const vocabList = JSON.parse(cleanJson);
        if (Array.isArray(vocabList) && vocabList.length > 0) {
          return NextResponse.json({ success: true, vocabList });
        }
      }
    } catch (aiErr: any) {
      console.warn("AI Vocab Gen error, returning smart fallback:", aiErr?.message || aiErr);
    }

    const fallbackVocab = generateFallbackBalancedVocab(query, category);
    return NextResponse.json({ success: true, vocabList: fallbackVocab });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
