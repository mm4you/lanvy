import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-api';
import { getAIChatCompletion } from '@/lib/ai';

function generateFallbackBalancedVocab(query: string, category: string, hskGroup: 'hsk123' | 'hsk456' | 'all' = 'hsk123') {
  if (hskGroup === 'all') {
    return [
      { nameChinese: '苹果', namePinyin: 'píngguǒ', nameVietnamese: 'Táo', hskLevel: 1, category, exampleChinese: '我喜欢吃苹果。', examplePinyin: 'Wǒ xǐhuan chī píngguǒ.', exampleVietnamese: 'Tôi thích ăn táo.' },
      { nameChinese: '学习', namePinyin: 'xuéxí', nameVietnamese: 'Học tập', hskLevel: 1, category, exampleChinese: '我们在学习汉语。', examplePinyin: 'Wǒmen zài xuéxí Hànyǔ.', exampleVietnamese: 'Chúng tôi đang học tiếng Trung.' },
      { nameChinese: '非常', namePinyin: 'fēicháng', nameVietnamese: 'Vô cùng', hskLevel: 2, category, exampleChinese: '这个非常好。', examplePinyin: 'Zhè ge fēicháng hǎo.', exampleVietnamese: 'Cái này vô cùng tốt.' },
      { nameChinese: '准备', namePinyin: 'zhǔnbèi', nameVietnamese: 'Chuẩn bị', hskLevel: 2, category, exampleChinese: '我准备好了。', examplePinyin: 'Wǒ zhǔnbèi hǎo le.', exampleVietnamese: 'Tôi đã chuẩn bị xong.' },
      { nameChinese: '选择', namePinyin: 'xuǎnzé', nameVietnamese: 'Lựa chọn', hskLevel: 3, category, exampleChinese: '这是好的选择。', examplePinyin: 'Zhè shì hǎo de xuǎnzé.', exampleVietnamese: 'Đây là sự lựa chọn tốt.' },
      { nameChinese: '影响', namePinyin: 'yǐngxiǎng', nameVietnamese: 'Ảnh hưởng', hskLevel: 3, category, exampleChinese: '环境有很大影响。', examplePinyin: 'Huánjìng yǒu hěn dà yǐngxiǎng.', exampleVietnamese: 'Môi trường có ảnh hưởng rất lớn.' },
      { nameChinese: '安排', namePinyin: 'ānpái', nameVietnamese: 'Sắp xếp', hskLevel: 4, category, exampleChinese: '我们安排好时间。', examplePinyin: 'Wǒmen ānpái hǎo shíjiān.', exampleVietnamese: 'Chúng tôi sắp xếp thời gian.' },
      { nameChinese: '成功', namePinyin: 'chénggōng', nameVietnamese: 'Thành công', hskLevel: 4, category, exampleChinese: '一定会成功。', examplePinyin: 'Yídìng huì chénggōng.', exampleVietnamese: 'Nhất định sẽ thành công.' },
      { nameChinese: '把握', namePinyin: 'bǎwò', nameVietnamese: 'Nắm bắt', hskLevel: 5, category, exampleChinese: '把握住机会。', examplePinyin: 'Bǎwò zhù jīhuì.', exampleVietnamese: 'Nắm bắt cơ hội.' },
      { nameChinese: '追求', namePinyin: 'zhuīqiú', nameVietnamese: 'Theo đuổi', hskLevel: 5, category, exampleChinese: '追求卓越。', examplePinyin: 'Zhuīqiú zhuóyuè.', exampleVietnamese: 'Theo đuổi sự vượt trội.' },
      { nameChinese: '抱负', namePinyin: 'bàofù', nameVietnamese: 'Hoài bão', hskLevel: 6, category, exampleChinese: '要有远大抱负。', examplePinyin: 'Yào yǒu yuǎndà bàofù.', exampleVietnamese: 'Cần có hoài bão lớn.' },
      { nameChinese: '领悟', namePinyin: 'lǐngwù', nameVietnamese: 'Lĩnh hội', hskLevel: 6, category, exampleChinese: '深深领悟。', examplePinyin: 'Shēnshēn lǐngwù.', exampleVietnamese: 'Lĩnh hội sâu sắc.' }
    ];
  }
  if (hskGroup === 'hsk456') {
    return [
      // HSK 4
      {
        nameChinese: '安排',
        namePinyin: 'ānpái',
        nameVietnamese: 'Sắp xếp, an bài',
        hskLevel: 4,
        category,
        exampleChinese: '我们安排好时间去旅行。',
        examplePinyin: 'Wǒmen ānpái hǎo shíjiān qù lǚxíng.',
        exampleVietnamese: 'Chúng tôi sắp xếp thời gian để đi du lịch.'
      },
      {
        nameChinese: '保证',
        namePinyin: 'bǎozhèng',
        nameVietnamese: 'Bảo đảm, cam kết',
        hskLevel: 4,
        category,
        exampleChinese: '我保证准时完成任务。',
        examplePinyin: 'Wǒ bǎozhèng zhǔnshí wánchéng rènwu.',
        exampleVietnamese: 'Tôi đảm bảo sẽ hoàn thành nhiệm vụ đúng giờ.'
      },
      {
        nameChinese: '成功',
        namePinyin: 'chénggōng',
        nameVietnamese: 'Thành công',
        hskLevel: 4,
        category,
        exampleChinese: '坚持努力就一定会成功。',
        examplePinyin: 'Jiānchí nǔlì jiù yídìng huì chénggōng.',
        exampleVietnamese: 'Kiên trì nỗ lực nhất định sẽ thành công.'
      },
      // HSK 5
      {
        nameChinese: '把握',
        namePinyin: 'bǎwò',
        nameVietnamese: 'Nắm bắt, thấu hiểu',
        hskLevel: 5,
        category,
        exampleChinese: '我们要把握住这次机会。',
        examplePinyin: 'Wǒmen yào bǎwò zhù zhè cì jīhuì.',
        exampleVietnamese: 'Chúng ta phải nắm bắt cơ hội lần này.'
      },
      {
        nameChinese: '具备',
        namePinyin: 'jùbèi',
        nameVietnamese: 'Có đủ, trang bị',
        hskLevel: 5,
        category,
        exampleChinese: '他具备出色的专业能力。',
        examplePinyin: 'Tā jùbèi chūsè de zhuānyè nénglì.',
        exampleVietnamese: 'Anh ấy có đủ năng lực chuyên môn xuất sắc.'
      },
      {
        nameChinese: '追求',
        namePinyin: 'zhuīqiú',
        nameVietnamese: 'Mưu cầu, theo đuổi',
        hskLevel: 5,
        category,
        exampleChinese: '追求卓越是每个人的梦想。',
        examplePinyin: 'Zhuīqiú zhuóyuè shì měi ge rén de mèngxiǎng.',
        exampleVietnamese: 'Theo đuổi sự vượt trội là giấc mơ của mỗi người.'
      },
      // HSK 6
      {
        nameChinese: '抱负',
        namePinyin: 'bàofù',
        nameVietnamese: 'Hoài bão, chí hướng',
        hskLevel: 6,
        category,
        exampleChinese: '年轻人要有远大的抱负。',
        examplePinyin: 'Niánqīngrén yào yǒu yuǎndà de bàofù.',
        exampleVietnamese: 'Người trẻ tuổi cần có hoài bão lớn lao.'
      },
      {
        nameChinese: '领悟',
        namePinyin: 'lǐngwù',
        nameVietnamese: 'Lĩnh hội, ngộ ra',
        hskLevel: 6,
        category,
        exampleChinese: '他深深领悟到了真谛。',
        examplePinyin: 'Tā shēnshēn lǐngwù dào le zhēndì.',
        exampleVietnamese: 'Anh ấy đã lĩnh hội sâu sắc chân lý.'
      },
      {
        nameChinese: '精益求精',
        namePinyin: 'jīng yì qiú jīng',
        nameVietnamese: 'Luôn phấn đấu làm tốt hơn nữa',
        hskLevel: 6,
        category,
        exampleChinese: '对待工作我们要精益求精。',
        examplePinyin: 'Duìdài gōngzuò wǒmen yào jīng yì qiú jīng.',
        exampleVietnamese: 'Đối với công việc chúng ta phải luôn tinh ích cầu tinh.'
      }
    ];
  }

  return [
    // HSK 1
    {
      nameChinese: '学习',
      namePinyin: 'xuéxí',
      nameVietnamese: 'Học tập',
      hskLevel: 1,
      category,
      exampleChinese: '大家都在努力学习汉语。',
      examplePinyin: 'Dàjiā dōu zài nǔlì xuéxí Hànyǔ.',
      exampleVietnamese: 'Mọi người đều đang nỗ lực học tiếng Trung.'
    },
    {
      nameChinese: '喜欢',
      namePinyin: 'xǐhuan',
      nameVietnamese: 'Thích, yêu thích',
      hskLevel: 1,
      category,
      exampleChinese: '我很喜欢这个新 phòng。',
      examplePinyin: 'Wǒ hěn xǐhuan zhè ge xīn fáng.',
      exampleVietnamese: 'Tôi rất thích căn phòng mới này.'
    },
    {
      nameChinese: '朋友',
      namePinyin: 'péngyou',
      nameVietnamese: 'Bạn bè',
      hskLevel: 1,
      category,
      exampleChinese: '我们都是好朋友。',
      examplePinyin: 'Wǒmen dōu shì hǎo péngyou.',
      exampleVietnamese: 'Chúng tôi đều là bạn tốt của nhau.'
    },
    // HSK 2
    {
      nameChinese: '准备',
      namePinyin: 'zhǔnbèi',
      nameVietnamese: 'Chuẩn bị',
      hskLevel: 2,
      category,
      exampleChinese: '大家都已经准备好了。',
      examplePinyin: 'Dàjiā dōu yǐjīng zhǔnbèi hǎo le.',
      exampleVietnamese: 'Mọi người đều đã chuẩn bị xong xuôi.'
    },
    {
      nameChinese: '介绍',
      namePinyin: 'jièshào',
      nameVietnamese: 'Giới thiệu',
      hskLevel: 2,
      category,
      exampleChinese: '让我给你介绍一下新朋友。',
      examplePinyin: 'Ràng wǒ gěi nǐ jièshào yíxià xīn péngyou.',
      exampleVietnamese: 'Để tôi giới thiệu cho bạn một người bạn mới.'
    },
    {
      nameChinese: '非常',
      namePinyin: 'fēicháng',
      nameVietnamese: 'Vô cùng, rất',
      hskLevel: 2,
      category,
      exampleChinese: '这个设计非常漂亮。',
      examplePinyin: 'Zhè ge shèjì fēicháng piàoliang.',
      exampleVietnamese: 'Bản thiết kế này vô cùng đẹp mắt.'
    },
    // HSK 3
    {
      nameChinese: '选择',
      namePinyin: 'xuǎnzé',
      nameVietnamese: 'Lựa chọn',
      hskLevel: 3,
      category,
      exampleChinese: '这是最好的选择。',
      examplePinyin: 'Zhè shì zuì hǎo de xuǎnzé.',
      exampleVietnamese: 'Đây là sự lựa chọn tốt nhất.'
    },
    {
      nameChinese: '影响',
      namePinyin: 'yǐngxiǎng',
      nameVietnamese: 'Ảnh hưởng',
      hskLevel: 3,
      category,
      exampleChinese: '环境对人有很大影响。',
      examplePinyin: 'Huánjìng duì rén yǒu hěn dà yǐngxiǎng.',
      exampleVietnamese: 'Môi trường có ảnh hưởng rất lớn tới con người.'
    },
    {
      nameChinese: '满意',
      namePinyin: 'mǎnyì',
      nameVietnamese: 'Hài lòng',
      hskLevel: 3,
      category,
      exampleChinese: '客户对我们的设计非常满意。',
      examplePinyin: 'Kèhù duì wǒmen de shèjì fēicháng mǎnyì.',
      exampleVietnamese: 'Khách hàng vô cùng hài lòng với thiết kế của chúng tôi.'
    }
  ];
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Quyền truy cập bị từ chối.' }, { status: 403 });
    }

    const { query, category = 'Khác', hskGroup = 'hsk123' } = await request.json();
    if (!query) {
      return NextResponse.json({ error: 'Thiếu từ khóa hoặc chủ đề tạo từ.' }, { status: 400 });
    }

    let groupText = 'CƠ BẢN (đúng 3 từ HSK 1, 3 từ HSK 2, 3 từ HSK 3)';
    let hskLevelExample = '1, 2, hoặc 3';
    if (hskGroup === 'hsk456') {
      groupText = 'NÂNG CAO (đúng 3 từ HSK 4, 3 từ HSK 5, 3 từ HSK 6)';
      hskLevelExample = '4, 5, hoặc 6';
    } else if (hskGroup === 'all' || hskGroup === 'hsk1to6') {
      groupText = 'TOÀN BỘ HSK 1 TỚI HSK 6 (gồm 12 từ rải đều từ cấp HSK 1, 2, 3, 4, 5 đến HSK 6)';
      hskLevelExample = '1, 2, 3, 4, 5, hoặc 6';
    }

    const systemPrompt = `Bạn là bot tạo từ vựng tiếng Trung HSK cho game.
Người dùng muốn tạo bộ từ vựng xoay quanh chủ đề: "${query}" (thuộc danh mục: "${category}").
Yêu cầu BẮT BUỘC:
1. Hãy tạo ra đúng 9 từ vựng tiếng Trung chất lượng cao thuộc nhóm ${groupText}.
2. Mỗi đối tượng từ vựng phải có cấu trúc JSON chính xác như sau:
[
  {
    "nameChinese": "Chữ Hán",
    "namePinyin": "Phiên âm",
    "nameVietnamese": "Dịch nghĩa tiếng Việt",
    "hskLevel": ${hskLevelExample},
    "category": "${category}",
    "exampleChinese": "Ví dụ tiếng Trung",
    "examplePinyin": "Phiên âm câu ví dụ",
    "exampleVietnamese": "Dịch nghĩa câu ví dụ"
  }
]
3. Chỉ trả về duy nhất một mảng JSON hợp lệ dạng [...], không được bao bọc trong block code hay thêm bất kỳ chữ chào hỏi/giải thích nào khác ngoài JSON.
4. Tuyệt đối KHÔNG sử dụng bất kỳ biểu tượng cảm xúc (emoji) nào.`;

    try {
      const content = await getAIChatCompletion({
        systemPrompt,
        userPrompt: `Hãy tạo 9 từ vựng thuộc nhóm ${groupText} theo chủ đề: "${query}"`,
        temperature: 0.8,
        maxTokens: 2000
      });
      
      const jsonStart = content.indexOf('[');
      const jsonEnd = content.lastIndexOf(']') + 1;
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const cleanJson = content.slice(jsonStart, jsonEnd);
        const vocabList = JSON.parse(cleanJson);
        const cleanedVocabList = vocabList.map((item: any) => {
          if (typeof item.nameVietnamese === 'string' && typeof category === 'string') {
            const catPattern = new RegExp(`^\\s*${category}\\s*[-:：]?\\s*`, 'i');
            const cleaned = item.nameVietnamese.replace(catPattern, '').trim();
            return { ...item, nameVietnamese: cleaned };
          }
          return item;
        });
        if (Array.isArray(cleanedVocabList) && cleanedVocabList.length > 0) {
          return NextResponse.json({ success: true, vocabList: cleanedVocabList });
        }
      }
    } catch (aiErr: any) {
      console.warn("AI Vocab Gen error, returning smart fallback:", aiErr?.message || aiErr);
    }

    const fallbackVocab = generateFallbackBalancedVocab(query, category, hskGroup);
    return NextResponse.json({ success: true, vocabList: fallbackVocab });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
