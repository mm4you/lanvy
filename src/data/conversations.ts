import { LearningZone } from './open-world';

export interface ConversationTurn {
  id: string;
  npcChinese: string;
  npcPinyin: string;
  npcVietnamese: string;
  acceptedGroups: string[][];
  requiredMatches: number;
  suggestions: string[];
  modelAnswer: string;
  modelPinyin: string;
  feedback: string;
  vocabIds: string[];
}

export interface ConversationScenario {
  id: string;
  zone: LearningZone;
  npcName: string;
  npcChineseName: string;
  title: string;
  context: string;
  turns: ConversationTurn[];
}

export const CONVERSATION_SCENARIOS: Record<LearningZone, ConversationScenario> = {
  dimsum: {
    id: 'dimsum-order-review',
    zone: 'dimsum',
    npcName: 'Chị chủ quán Lưu',
    npcChineseName: '刘老板',
    title: 'Gọi một bữa Dim Sum',
    context: 'Buổi trưa tại nhà hàng. Hãy gọi món và nói rõ khẩu vị của bạn.',
    turns: [
      {
        id: 'party-size',
        npcChinese: '欢迎光临！请问几位？',
        npcPinyin: 'Huānyíng guānglín! Qǐngwèn jǐ wèi?',
        npcVietnamese: 'Chào mừng! Xin hỏi có mấy người?',
        acceptedGroups: [['一位', '一个人', '我一个'], ['两位', '两个人', '我们两个'], ['三位', '三个人'], ['四位', '四个人']],
        requiredMatches: 1,
        suggestions: ['一位，谢谢。', '我们两位。'],
        modelAnswer: '我们两位，谢谢。',
        modelPinyin: 'Wǒmen liǎng wèi, xièxie.',
        feedback: 'Dùng 位 để đếm người trong ngữ cảnh lịch sự sẽ tự nhiên hơn 个.',
        vocabIds: ['ds-kuaizi'],
      },
      {
        id: 'order-food',
        npcChinese: '好的。你们想吃点什么？',
        npcPinyin: 'Hǎo de. Nǐmen xiǎng chī diǎn shénme?',
        npcVietnamese: 'Được. Hai bạn muốn ăn gì?',
        acceptedGroups: [['想要', '想吃', '来', '要'], ['饺子', '包子', '烤鸭', '面条', '炒饭', '粥', '汤']],
        requiredMatches: 2,
        suggestions: ['我想要一盘饺子。', '来一笼包子和一碗汤。'],
        modelAnswer: '来一笼包子和一盘饺子。',
        modelPinyin: 'Lái yì lóng bāozi hé yì pán jiǎozi.',
        feedback: 'Trong nhà hàng, 来 + số lượng + món là cách gọi món ngắn gọn và tự nhiên.',
        vocabIds: ['ds-jiaozi', 'ds-baozi', 'ds-pan', 'ds-wan'],
      },
      {
        id: 'spice-level',
        npcChinese: '你们能吃辣吗？',
        npcPinyin: 'Nǐmen néng chī là ma?',
        npcVietnamese: 'Hai bạn ăn cay được không?',
        acceptedGroups: [['能吃辣', '可以吃辣', '喜欢辣'], ['不能吃辣', '不吃辣', '不要辣', '少辣', '一点点辣', '微辣']],
        requiredMatches: 1,
        suggestions: ['可以，但是不要太辣。', '我不能吃辣，请做清淡一点。'],
        modelAnswer: '可以，但是不要太辣。',
        modelPinyin: 'Kěyǐ, dànshì bú yào tài là.',
        feedback: '但是 giúp nối ý đối lập: ăn được cay, nhưng đừng quá cay.',
        vocabIds: ['ds-la', 'ds-xian'],
      },
    ],
  },
  market: {
    id: 'market-shopping-review',
    zone: 'market',
    npcName: 'Anh bán hàng Trần',
    npcChineseName: '陈店员',
    title: 'Mua đồ cho bữa sáng',
    context: 'Bạn ghé siêu thị và cần hỏi món, số lượng rồi kết thúc giao dịch.',
    turns: [
      {
        id: 'find-item',
        npcChinese: '您好！请问您想买什么？',
        npcPinyin: 'Nín hǎo! Qǐngwèn nín xiǎng mǎi shénme?',
        npcVietnamese: 'Xin chào! Bạn muốn mua gì?',
        acceptedGroups: [['想买', '要买', '我买', '我要'], ['苹果', '香蕉', '牛奶', '面包', '大米']],
        requiredMatches: 2,
        suggestions: ['我想买牛奶和面包。', '我要一些苹果。'],
        modelAnswer: '我想买一盒牛奶和一个面包。',
        modelPinyin: 'Wǒ xiǎng mǎi yì hé niúnǎi hé yí ge miànbāo.',
        feedback: '想买 nhấn mạnh ý định; 我要 nghe trực tiếp hơn nhưng vẫn rất thông dụng.',
        vocabIds: ['mk-mai', 'mk-niunai', 'mk-mianbao', 'mk-pingguo'],
      },
      {
        id: 'ask-price',
        npcChinese: '苹果在那边。还需要别的吗？',
        npcPinyin: 'Píngguǒ zài nàbiān. Hái xūyào bié de ma?',
        npcVietnamese: 'Táo ở bên kia. Bạn còn cần gì khác không?',
        acceptedGroups: [['还要', '还需要', '也要', '不用了', '不要了', '就这些'], ['香蕉', '牛奶', '面包', '不用', '这些']],
        requiredMatches: 1,
        suggestions: ['我还要一盒牛奶。', '不用了，就这些，谢谢。'],
        modelAnswer: '我还要一盒牛奶。',
        modelPinyin: 'Wǒ hái yào yì hé niúnǎi.',
        feedback: '还要 dùng khi muốn thêm món; 就这些 dùng để nói “chỉ vậy thôi”.',
        vocabIds: ['mk-niunai', 'mk-mianbao'],
      },
      {
        id: 'price-reaction',
        npcChinese: '一共三十八块。',
        npcPinyin: 'Yígòng sānshíbā kuài.',
        npcVietnamese: 'Tổng cộng 38 tệ.',
        acceptedGroups: [['多少钱', '有点贵', '太贵', '便宜一点', '可以付款', '我付款', '刷卡', '现金']],
        requiredMatches: 1,
        suggestions: ['可以便宜一点儿吗？', '好的，我刷卡。'],
        modelAnswer: '好的，我刷卡。',
        modelPinyin: 'Hǎo de, wǒ shuākǎ.',
        feedback: '块 là cách nói khẩu ngữ của 元. Khi trả tiền có thể nói 我刷卡 hoặc 我付现金.',
        vocabIds: ['mk-duoshao', 'mk-pianyi', 'mk-gui'],
      },
    ],
  },
  park: {
    id: 'park-small-talk-review',
    zone: 'park',
    npcName: 'Tiểu Lâm',
    npcChineseName: '小林',
    title: 'Gặp lại bạn cũ',
    context: 'Bạn gặp một người bạn ở công viên và trò chuyện về việc học cùng kế hoạch cuối tuần.',
    turns: [
      {
        id: 'how-are-you',
        npcChinese: '好久不见！你最近怎么样？',
        npcPinyin: 'Hǎojiǔ bú jiàn! Nǐ zuìjìn zěnmeyàng?',
        npcVietnamese: 'Lâu rồi không gặp! Dạo này bạn thế nào?',
        acceptedGroups: [['很好', '不错', '还好', '有点忙', '比较忙', '压力', '挺好的']],
        requiredMatches: 1,
        suggestions: ['我最近挺好的，就是有点忙。', '还不错，最近工作有点忙。'],
        modelAnswer: '我最近挺好的，就是工作有点忙。',
        modelPinyin: 'Wǒ zuìjìn tǐng hǎo de, jiùshì gōngzuò yǒudiǎn máng.',
        feedback: '挺...的 nghe tự nhiên trong hội thoại; 就是 dùng để thêm một điểm chưa thuận lợi.',
        vocabIds: ['pk-gongzuo', 'pk-yali'],
      },
      {
        id: 'learning-chinese',
        npcChinese: '你最近还在学汉语吗？',
        npcPinyin: 'Nǐ zuìjìn hái zài xué Hànyǔ ma?',
        npcVietnamese: 'Dạo này bạn vẫn đang học tiếng Trung chứ?',
        acceptedGroups: [['还在学', '每天学', '继续学', '当然', '有时候学', '复习'], ['汉语', '中文', '生词', '口语', '发音']],
        requiredMatches: 1,
        suggestions: ['当然，我最近在复习口语。', '还在学，不过最近练得比较少。'],
        modelAnswer: '当然，我最近在复习口语。',
        modelPinyin: 'Dāngrán, wǒ zuìjìn zài fùxí kǒuyǔ.',
        feedback: '复习 là ôn lại; 口语 là kỹ năng nói. Đây là cặp từ đúng với mục tiêu hiện tại.',
        vocabIds: ['pk-jianchi', 'pk-jiaoliu'],
      },
      {
        id: 'weekend-plan',
        npcChinese: '周末有什么计划？',
        npcPinyin: 'Zhōumò yǒu shénme jìhuà?',
        npcVietnamese: 'Cuối tuần có kế hoạch gì?',
        acceptedGroups: [['打算', '计划', '想', '要', '准备'], ['旅行', '运动', '听音乐', '拍照', '休息', '学习', '去公园']],
        requiredMatches: 2,
        suggestions: ['我打算和朋友去公园拍照。', '我想在家休息，也会复习汉语。'],
        modelAnswer: '我打算和朋友去公园拍照。',
        modelPinyin: 'Wǒ dǎsuàn hé péngyou qù gōngyuán pāizhào.',
        feedback: '打算 nhấn mạnh dự định cá nhân; 计划 trang trọng và có tính sắp xếp hơn.',
        vocabIds: ['pk-jihua', 'pk-paishe', 'pk-lvxing'],
      },
    ],
  },
};
