export type LearningZone = 'dimsum' | 'market' | 'park';

export interface WorldVocabWord {
  id: string;
  zone: LearningZone;
  category: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
  hsk: 1 | 2 | 3 | 4 | 5 | 6;
  example: string;
  exampleVietnamese: string;
}

const word = (
  id: string,
  zone: LearningZone,
  category: string,
  chinese: string,
  pinyin: string,
  vietnamese: string,
  hsk: WorldVocabWord['hsk'],
  example: string,
  exampleVietnamese: string,
): WorldVocabWord => ({
  id,
  zone,
  category,
  chinese,
  pinyin,
  vietnamese,
  hsk,
  example,
  exampleVietnamese,
});

export const WORLD_VOCAB: WorldVocabWord[] = [
  word('ds-jiaozi', 'dimsum', 'Món ăn', '饺子', 'jiǎozi', 'sủi cảo', 2, '我想吃一盘饺子。', 'Tôi muốn ăn một đĩa sủi cảo.'),
  word('ds-baozi', 'dimsum', 'Món ăn', '包子', 'bāozi', 'bánh bao', 2, '包子刚蒸好。', 'Bánh bao vừa được hấp xong.'),
  word('ds-kaoya', 'dimsum', 'Món ăn', '烤鸭', 'kǎoyā', 'vịt quay', 4, '北京烤鸭很有名。', 'Vịt quay Bắc Kinh rất nổi tiếng.'),
  word('ds-mian', 'dimsum', 'Món ăn', '面条', 'miàntiáo', 'mì sợi', 2, '这碗面条很好吃。', 'Bát mì này rất ngon.'),
  word('ds-chaofan', 'dimsum', 'Món ăn', '炒饭', 'chǎofàn', 'cơm chiên', 3, '请给我一份炒饭。', 'Cho tôi một phần cơm chiên.'),
  word('ds-zhou', 'dimsum', 'Món ăn', '粥', 'zhōu', 'cháo', 4, '早上喝粥很舒服。', 'Buổi sáng ăn cháo rất dễ chịu.'),
  word('ds-tang', 'dimsum', 'Món ăn', '汤', 'tāng', 'canh; súp', 2, '这碗汤有点儿热。', 'Bát canh này hơi nóng.'),
  word('ds-yu', 'dimsum', 'Món ăn', '鱼', 'yú', 'cá', 2, '年夜饭常常有鱼。', 'Bữa cơm tất niên thường có cá.'),
  word('ds-niurou', 'dimsum', 'Nguyên liệu', '牛肉', 'niúròu', 'thịt bò', 2, '牛肉面是我的最爱。', 'Mì bò là món tôi thích nhất.'),
  word('ds-jirou', 'dimsum', 'Nguyên liệu', '鸡肉', 'jīròu', 'thịt gà', 2, '他不吃鸡肉。', 'Anh ấy không ăn thịt gà.'),
  word('ds-jidan', 'dimsum', 'Nguyên liệu', '鸡蛋', 'jīdàn', 'trứng gà', 1, '炒饭里有鸡蛋。', 'Trong cơm chiên có trứng.'),
  word('ds-shucai', 'dimsum', 'Nguyên liệu', '蔬菜', 'shūcài', 'rau củ', 3, '多吃蔬菜对身体好。', 'Ăn nhiều rau tốt cho sức khỏe.'),
  word('ds-suan', 'dimsum', 'Hương vị', '酸', 'suān', 'chua', 3, '这个汤有一点儿酸。', 'Món canh này hơi chua.'),
  word('ds-la', 'dimsum', 'Hương vị', '辣', 'là', 'cay', 3, '我不能吃太辣。', 'Tôi không thể ăn quá cay.'),
  word('ds-xian', 'dimsum', 'Hương vị', '咸', 'xián', 'mặn', 4, '今天的菜太咸了。', 'Món ăn hôm nay mặn quá.'),
  word('ds-tian', 'dimsum', 'Hương vị', '甜', 'tián', 'ngọt', 2, '这个点心甜而不腻。', 'Món điểm tâm này ngọt mà không ngấy.'),
  word('ds-xiang', 'dimsum', 'Hương vị', '香', 'xiāng', 'thơm', 4, '烤鸭闻起来真香。', 'Vịt quay ngửi thật thơm.'),
  word('ds-zheng', 'dimsum', 'Chế biến', '蒸', 'zhēng', 'hấp', 5, '包子要蒸十五分钟。', 'Bánh bao cần hấp mười lăm phút.'),
  word('ds-chao', 'dimsum', 'Chế biến', '炒', 'chǎo', 'xào; chiên', 4, '妈妈正在炒菜。', 'Mẹ đang xào rau.'),
  word('ds-kao', 'dimsum', 'Chế biến', '烤', 'kǎo', 'nướng; quay', 4, '这只鸭子要慢慢烤。', 'Con vịt này cần quay từ từ.'),
  word('ds-zhu', 'dimsum', 'Chế biến', '煮', 'zhǔ', 'luộc; nấu', 4, '水开了再煮面。', 'Nước sôi rồi mới nấu mì.'),
  word('ds-pan', 'dimsum', 'Dụng cụ', '盘子', 'pánzi', 'cái đĩa', 3, '请拿两个盘子。', 'Hãy lấy hai cái đĩa.'),
  word('ds-wan', 'dimsum', 'Dụng cụ', '碗', 'wǎn', 'cái bát', 3, '桌上有三只碗。', 'Trên bàn có ba cái bát.'),
  word('ds-kuaizi', 'dimsum', 'Dụng cụ', '筷子', 'kuàizi', 'đũa', 2, '你会用筷子吗？', 'Bạn biết dùng đũa không?'),

  word('mk-pingguo', 'market', 'Trái cây', '苹果', 'píngguǒ', 'táo', 1, '我买了三斤苹果。', 'Tôi mua ba cân táo.'),
  word('mk-xiangjiao', 'market', 'Trái cây', '香蕉', 'xiāngjiāo', 'chuối', 2, '香蕉今天很便宜。', 'Chuối hôm nay rất rẻ.'),
  word('mk-putao', 'market', 'Trái cây', '葡萄', 'pútao', 'nho', 3, '这些葡萄很甜。', 'Chỗ nho này rất ngọt.'),
  word('mk-xigua', 'market', 'Trái cây', '西瓜', 'xīguā', 'dưa hấu', 2, '夏天吃西瓜很凉快。', 'Mùa hè ăn dưa hấu rất mát.'),
  word('mk-niunai', 'market', 'Thực phẩm', '牛奶', 'niúnǎi', 'sữa bò', 1, '冰箱里没有牛奶了。', 'Trong tủ lạnh hết sữa rồi.'),
  word('mk-mianbao', 'market', 'Thực phẩm', '面包', 'miànbāo', 'bánh mì', 1, '早饭我吃面包。', 'Bữa sáng tôi ăn bánh mì.'),
  word('mk-dami', 'market', 'Thực phẩm', '大米', 'dàmǐ', 'gạo', 4, '这袋大米有五公斤。', 'Túi gạo này nặng năm ký.'),
  word('mk-shouji', 'market', 'Điện tử', '手机', 'shǒujī', 'điện thoại', 2, '我的手机没电了。', 'Điện thoại của tôi hết pin rồi.'),
  word('mk-diannao', 'market', 'Điện tử', '电脑', 'diànnǎo', 'máy tính', 2, '我用电脑学习汉语。', 'Tôi dùng máy tính học tiếng Trung.'),
  word('mk-erji', 'market', 'Điện tử', '耳机', 'ěrjī', 'tai nghe', 4, '这副耳机多少钱？', 'Chiếc tai nghe này bao nhiêu tiền?'),
  word('mk-dianchi', 'market', 'Điện tử', '电池', 'diànchí', 'pin', 5, '遥控器需要两节电池。', 'Điều khiển cần hai viên pin.'),
  word('mk-qianbi', 'market', 'Văn phòng phẩm', '铅笔', 'qiānbǐ', 'bút chì', 2, '请借我一支铅笔。', 'Cho tôi mượn một cây bút chì.'),
  word('mk-benzi', 'market', 'Văn phòng phẩm', '本子', 'běnzi', 'quyển vở', 3, '我买了一个新本子。', 'Tôi mua một quyển vở mới.'),
  word('mk-shu', 'market', 'Văn phòng phẩm', '书', 'shū', 'sách', 1, '这本书很有意思。', 'Quyển sách này rất thú vị.'),
  word('mk-shubao', 'market', 'Văn phòng phẩm', '书包', 'shūbāo', 'cặp sách', 3, '书包里有很多书。', 'Trong cặp có rất nhiều sách.'),
  word('mk-yifu', 'market', 'Quần áo', '衣服', 'yīfu', 'quần áo', 1, '这件衣服很合适。', 'Bộ quần áo này rất vừa.'),
  word('mk-kuzi', 'market', 'Quần áo', '裤子', 'kùzi', 'quần dài', 3, '这条裤子有点儿长。', 'Chiếc quần này hơi dài.'),
  word('mk-xie', 'market', 'Quần áo', '鞋', 'xié', 'giày', 2, '我想试试这双鞋。', 'Tôi muốn thử đôi giày này.'),
  word('mk-maozi', 'market', 'Quần áo', '帽子', 'màozi', 'mũ', 3, '红色的帽子很好看。', 'Chiếc mũ đỏ rất đẹp.'),
  word('mk-duoshao', 'market', 'Mua bán', '多少钱', 'duōshao qián', 'bao nhiêu tiền', 1, '这个多少钱？', 'Cái này bao nhiêu tiền?'),
  word('mk-pianyi', 'market', 'Mua bán', '便宜', 'piányi', 'rẻ', 2, '可以便宜一点儿吗？', 'Có thể rẻ hơn một chút không?'),
  word('mk-gui', 'market', 'Mua bán', '贵', 'guì', 'đắt', 2, '这家店的水果不贵。', 'Trái cây của cửa hàng này không đắt.'),
  word('mk-mai', 'market', 'Mua bán', '买', 'mǎi', 'mua', 1, '你想买什么？', 'Bạn muốn mua gì?'),
  word('mk-mai2', 'market', 'Mua bán', '卖', 'mài', 'bán', 2, '这里卖中国茶。', 'Ở đây bán trà Trung Quốc.'),
  word('mk-jian', 'market', 'Lượng từ', '件', 'jiàn', 'chiếc; món (quần áo)', 3, '我试了两件外套。', 'Tôi thử hai chiếc áo khoác.'),
  word('mk-shuang', 'market', 'Lượng từ', '双', 'shuāng', 'đôi', 3, '一双运动鞋', 'Một đôi giày thể thao.'),
  word('mk-ben', 'market', 'Lượng từ', '本', 'běn', 'quyển', 2, '三本汉语书', 'Ba quyển sách tiếng Trung.'),
  word('mk-zhi', 'market', 'Lượng từ', '支', 'zhī', 'cây (bút)', 4, '桌上有四支笔。', 'Trên bàn có bốn cây bút.'),

  word('pk-tianqi', 'park', 'Thời tiết', '天气', 'tiānqì', 'thời tiết', 1, '今天天气怎么样？', 'Hôm nay thời tiết thế nào?'),
  word('pk-qingtian', 'park', 'Thời tiết', '晴天', 'qíngtiān', 'trời nắng', 3, '明天是晴天。', 'Ngày mai trời nắng.'),
  word('pk-xiayu', 'park', 'Thời tiết', '下雨', 'xiàyǔ', 'mưa', 1, '外面正在下雨。', 'Ngoài trời đang mưa.'),
  word('pk-liangkuai', 'park', 'Thời tiết', '凉快', 'liángkuai', 'mát mẻ', 3, '公园里很凉快。', 'Trong công viên rất mát.'),
  word('pk-xihuan', 'park', 'Sở thích', '喜欢', 'xǐhuan', 'thích', 1, '你喜欢做什么？', 'Bạn thích làm gì?'),
  word('pk-yundong', 'park', 'Sở thích', '运动', 'yùndòng', 'vận động; thể thao', 2, '我每天早上运动。', 'Tôi tập thể thao mỗi sáng.'),
  word('pk-yinyue', 'park', 'Sở thích', '音乐', 'yīnyuè', 'âm nhạc', 2, '她很喜欢中国音乐。', 'Cô ấy rất thích nhạc Trung Quốc.'),
  word('pk-lvxing', 'park', 'Sở thích', '旅行', 'lǚxíng', 'du lịch', 2, '我想去中国旅行。', 'Tôi muốn đi du lịch Trung Quốc.'),
  word('pk-paishe', 'park', 'Sở thích', '拍照', 'pāizhào', 'chụp ảnh', 3, '我们在湖边拍照吧。', 'Chúng ta chụp ảnh bên hồ nhé.'),
  word('pk-gongzuo', 'park', 'Công việc', '工作', 'gōngzuò', 'làm việc; công việc', 1, '你在哪里工作？', 'Bạn làm việc ở đâu?'),
  word('pk-laoshi', 'park', 'Công việc', '老师', 'lǎoshī', 'giáo viên', 1, '她是一位汉语老师。', 'Cô ấy là một giáo viên tiếng Trung.'),
  word('pk-yisheng', 'park', 'Công việc', '医生', 'yīshēng', 'bác sĩ', 1, '我哥哥是医生。', 'Anh tôi là bác sĩ.'),
  word('pk-tongxue', 'park', 'Giao tiếp', '同学', 'tóngxué', 'bạn học', 1, '他是我的大学同学。', 'Anh ấy là bạn học đại học của tôi.'),
  word('pk-renwei', 'park', 'Giao tiếp', '认为', 'rènwéi', 'cho rằng', 4, '你认为这个办法怎么样？', 'Bạn thấy cách này thế nào?'),
  word('pk-jihua', 'park', 'Giao tiếp', '计划', 'jìhuà', 'kế hoạch', 4, '你周末有什么计划？', 'Cuối tuần bạn có kế hoạch gì?'),
  word('pk-jingyan', 'park', 'Giao tiếp', '经验', 'jīngyàn', 'kinh nghiệm', 4, '这是一次有趣的经验。', 'Đây là một trải nghiệm thú vị.'),
  word('pk-xiguan', 'park', 'Giao tiếp', '习惯', 'xíguàn', 'thói quen', 4, '我习惯早起。', 'Tôi quen dậy sớm.'),
  word('pk-jianchi', 'park', 'Giao tiếp', '坚持', 'jiānchí', 'kiên trì', 5, '坚持学习就会进步。', 'Kiên trì học thì sẽ tiến bộ.'),
  word('pk-jiaoliu', 'park', 'Giao tiếp', '交流', 'jiāoliú', 'giao lưu; trao đổi', 5, '多和朋友用汉语交流。', 'Hãy thường xuyên trao đổi với bạn bè bằng tiếng Trung.'),
  word('pk-fangxin', 'park', 'Giao tiếp', '放心', 'fàngxīn', 'yên tâm', 3, '你放心，我会帮你。', 'Bạn yên tâm, tôi sẽ giúp bạn.'),
  word('pk-yali', 'park', 'Cảm xúc', '压力', 'yālì', 'áp lực', 5, '学习的时候别给自己太大压力。', 'Khi học đừng tạo quá nhiều áp lực cho bản thân.'),
  word('pk-fangqi', 'park', 'Cảm xúc', '放弃', 'fàngqì', 'từ bỏ', 5, '遇到困难也不要放弃。', 'Gặp khó khăn cũng đừng từ bỏ.'),
];

export const ZONE_LABELS: Record<LearningZone, string> = {
  dimsum: 'Nhà hàng Dim Sum',
  market: 'Siêu thị HSK',
  park: 'Công viên giao tiếp',
};

