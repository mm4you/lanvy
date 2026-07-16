'use client';

import { useState } from 'react';
import '../app/boba-service-game.css';
import { ArrowLeftIcon, VolumeIcon } from './ui-icons';

interface BobaServiceGameProps {
  playerName: string;
  score: number;
  coins: number;
  isLoveUser: boolean;
  onBack: () => void;
  onReward: (score: number, coins: number) => void;
}

interface ServiceOrder {
  id: string;
  customer: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
  base: string;
  topping: string;
  sugar: string;
  ice: string;
  keywords: Array<{ label: string; accepted: string[] }>;
}

const ORDERS: ServiceOrder[] = [
  {
    id: 'jasmine-pearl',
    customer: '小美',
    chinese: '你好，我想要一杯茉莉奶茶，加珍珠，五分糖，少冰。',
    pinyin: 'Nǐ hǎo, wǒ xiǎng yào yì bēi mòlì nǎichá, jiā zhēnzhū, wǔ fēn táng, shǎo bīng.',
    vietnamese: 'Cho tôi một ly trà sữa lài, thêm trân châu, 50% đường, ít đá.',
    base: '茉莉奶茶',
    topping: '珍珠',
    sugar: '五分糖',
    ice: '少冰',
    keywords: [
      { label: 'trà sữa lài', accepted: ['茉莉奶茶', '茉莉'] },
      { label: 'trân châu', accepted: ['珍珠'] },
      { label: '50% đường', accepted: ['五分糖', '半糖'] },
      { label: 'ít đá', accepted: ['少冰'] },
    ],
  },
  {
    id: 'black-mango',
    customer: '王先生',
    chinese: '请给我一杯红茶，加芒果椰果，三分糖，不要冰。',
    pinyin: 'Qǐng gěi wǒ yì bēi hóngchá, jiā mángguǒ yēguǒ, sān fēn táng, bú yào bīng.',
    vietnamese: 'Cho tôi một ly hồng trà, thêm thạch dừa xoài, 30% đường, không đá.',
    base: '红茶',
    topping: '芒果椰果',
    sugar: '三分糖',
    ice: '去冰',
    keywords: [
      { label: 'hồng trà', accepted: ['红茶'] },
      { label: 'thạch dừa xoài', accepted: ['芒果椰果', '椰果'] },
      { label: '30% đường', accepted: ['三分糖'] },
      { label: 'không đá', accepted: ['不要冰', '去冰'] },
    ],
  },
  {
    id: 'oolong-foam',
    customer: '林同学',
    chinese: '我要一杯乌龙茶，加奶盖，七分糖，正常冰，谢谢。',
    pinyin: 'Wǒ yào yì bēi wūlóngchá, jiā nǎigài, qī fēn táng, zhèngcháng bīng, xièxie.',
    vietnamese: 'Tôi muốn một ly trà ô long, thêm kem sữa, 70% đường, đá bình thường.',
    base: '乌龙茶',
    topping: '奶盖',
    sugar: '七分糖',
    ice: '正常冰',
    keywords: [
      { label: 'trà ô long', accepted: ['乌龙茶', '乌龙'] },
      { label: 'kem sữa', accepted: ['奶盖'] },
      { label: '70% đường', accepted: ['七分糖'] },
      { label: 'đá bình thường', accepted: ['正常冰'] },
    ],
  },
];

const BASES = ['茉莉奶茶', '红茶', '乌龙茶'];
const TOPPINGS = ['珍珠', '芒果椰果', '奶盖'];
const SUGARS = ['三分糖', '五分糖', '七分糖'];
const ICE_LEVELS = ['去冰', '少冰', '正常冰'];

function normalize(value: string) {
  return value.normalize('NFKC').replace(/[\s\p{P}\p{S}]/gu, '');
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
}

function MicIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3M8 21h8" /></svg>;
}

export default function BobaServiceGame({ playerName, score, coins, isLoveUser, onBack, onReward }: BobaServiceGameProps) {
  const [orderIndex, setOrderIndex] = useState(0);
  const [showPinyin, setShowPinyin] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [customerReply, setCustomerReply] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [missingDetails, setMissingDetails] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedTopping, setSelectedTopping] = useState('');
  const [selectedSugar, setSelectedSugar] = useState('');
  const [selectedIce, setSelectedIce] = useState('');
  const [serviceResult, setServiceResult] = useState<{ passed: boolean; mistakes: string[] } | null>(null);
  const order = ORDERS[orderIndex];

  const askCustomer = (question: 'sugar' | 'ice' | 'topping') => {
    const replies = {
      sugar: `我要${order.sugar}。`,
      ice: order.ice === '去冰' ? '不要冰，谢谢。' : `要${order.ice}。`,
      topping: `请加${order.topping}。`,
    };
    setCustomerReply(replies[question]);
    speak(replies[question]);
  };

  const evaluateConfirmation = (value = confirmation) => {
    const normalized = normalize(value);
    const missing = order.keywords
      .filter((detail) => !detail.accepted.some((keyword) => normalized.includes(normalize(keyword))))
      .map((detail) => detail.label);
    setMissingDetails(missing);
    if (missing.length === 0) {
      setConfirmed(true);
      speak('对，没错。谢谢！');
      try {
        const attempts = JSON.parse(localStorage.getItem('hsk_boba_service_attempts_v1') || '[]') as unknown[];
        localStorage.setItem('hsk_boba_service_attempts_v1', JSON.stringify([...attempts, { orderId: order.id, confirmation: value, passed: true, createdAt: new Date().toISOString() }].slice(-100)));
      } catch {
        localStorage.removeItem('hsk_boba_service_attempts_v1');
      }
    }
  };

  const startSpeechRecognition = () => {
    type RecognitionResult = { results: ArrayLike<{ 0: { transcript: string } }> };
    type Recognition = { lang: string; interimResults: boolean; onresult: ((event: RecognitionResult) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void };
    type RecognitionConstructor = new () => Recognition;
    const browserWindow = window as typeof window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
    const RecognitionApi = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
    if (!RecognitionApi) {
      setMissingDetails(['trình duyệt chưa hỗ trợ nhận giọng nói; hãy gõ câu xác nhận']);
      return;
    }
    const recognition = new RecognitionApi();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      setConfirmation(transcript);
      evaluateConfirmation(transcript);
    };
    recognition.onerror = () => setMissingDetails(['chưa nhận rõ giọng nói; hãy thử lại hoặc gõ câu xác nhận']);
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  };

  const serveDrink = () => {
    if (serviceResult?.passed) return;
    const mistakes = [
      selectedBase !== order.base ? `Trà nền phải là ${order.base}` : '',
      selectedTopping !== order.topping ? `Topping phải là ${order.topping}` : '',
      selectedSugar !== order.sugar ? `Mức đường phải là ${order.sugar}` : '',
      selectedIce !== order.ice ? `Mức đá phải là ${order.ice}` : '',
    ].filter(Boolean);
    const passed = mistakes.length === 0;
    setServiceResult({ passed, mistakes });
    try {
      const attempts = JSON.parse(localStorage.getItem('hsk_boba_service_attempts_v1') || '[]') as unknown[];
      const attempt = {
        orderId: order.id,
        type: 'assembly',
        selected: { base: selectedBase, topping: selectedTopping, sugar: selectedSugar, ice: selectedIce },
        mistakes,
        passed,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('hsk_boba_service_attempts_v1', JSON.stringify([...attempts, attempt].slice(-100)));
    } catch {
      localStorage.removeItem('hsk_boba_service_attempts_v1');
    }
    if (passed) onReward(100, 30);
  };

  const nextCustomer = () => {
    setOrderIndex((current) => (current + 1) % ORDERS.length);
    setShowPinyin(false);
    setShowMeaning(false);
    setCustomerReply(null);
    setConfirmation('');
    setMissingDetails([]);
    setConfirmed(false);
    setSelectedBase('');
    setSelectedTopping('');
    setSelectedSugar('');
    setSelectedIce('');
    setServiceResult(null);
  };

  const optionGroup = (label: string, options: string[], selected: string, onSelect: (value: string) => void) => (
    <fieldset>
      <legend>{label}</legend>
      <div>{options.map((option) => <button key={option} type="button" className={selected === option ? 'is-selected' : ''} onClick={() => onSelect(option)}>{option}</button>)}</div>
    </fieldset>
  );

  return (
    <main className="boba-service-shell">
      <header className="boba-service-header">
        <button type="button" onClick={onBack} aria-label="Về thị trấn"><ArrowLeftIcon /></button>
        <div><span>奶茶店 · Ca phục vụ giao tiếp</span><h1>Tiệm trà sữa của {playerName}</h1></div>
        <div className="boba-service-stats"><span>Điểm <strong>{score}</strong></span><span>Xu <strong>{coins}</strong></span></div>
      </header>

      {isLoveUser && <p className="love-service-note">Ca luyện riêng của Lan Vy tập trung vào nghe, hỏi lại và xác nhận đơn tự nhiên.</p>}

      <section className="service-scene">
        <div className="customer-order">
          <div className="customer-portrait"><span>{order.customer.slice(0, 1)}</span><strong>{order.customer}</strong></div>
          <div className="customer-speech">
            <button type="button" onClick={() => speak(order.chinese)} title="Nghe khách gọi món" aria-label="Nghe khách gọi món"><VolumeIcon /></button>
            <strong>{order.chinese}</strong>
            {showPinyin && <span>{order.pinyin}</span>}
            {showMeaning && <small>{order.vietnamese}</small>}
          </div>
        </div>

        <div className="boba-support-controls">
          <button type="button" className={showPinyin ? 'is-active' : ''} onClick={() => setShowPinyin((value) => !value)}>Pinyin</button>
          <button type="button" className={showMeaning ? 'is-active' : ''} onClick={() => setShowMeaning((value) => !value)}>Nghĩa Việt</button>
        </div>

        <section className="clarification-bar">
          <span>Hỏi lại khách</span>
          <div>
            <button type="button" onClick={() => askCustomer('sugar')}>请问要几分糖？</button>
            <button type="button" onClick={() => askCustomer('ice')}>请问要多少冰？</button>
            <button type="button" onClick={() => askCustomer('topping')}>请问要什么配料？</button>
          </div>
          {customerReply && <p><strong>{order.customer}:</strong> {customerReply}</p>}
        </section>

        {!confirmed ? (
          <section className="order-confirmation">
            <div><span>Xác nhận lại toàn bộ đơn bằng tiếng Trung</span><p>Một câu xác nhận tốt cần đủ trà nền, topping, đường và đá.</p></div>
            <div className="confirmation-input">
              <button type="button" className={isListening ? 'is-listening' : ''} onClick={startSpeechRecognition} disabled={isListening}><MicIcon /><span>{isListening ? 'Đang nghe' : 'Nói'}</span></button>
              <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') evaluateConfirmation(); }} placeholder="确认一下，您要..." />
              <button type="button" onClick={() => evaluateConfirmation()} disabled={!confirmation.trim()}>Xác nhận</button>
            </div>
            {missingDetails.length > 0 && <p className="confirmation-feedback">Câu xác nhận còn thiếu/chưa rõ: {missingDetails.join(', ')}.</p>}
          </section>
        ) : (
          <section className="drink-assembly">
            <header><span>Khách đã xác nhận</span><strong>对，没错。谢谢！</strong><p>Bây giờ pha đúng đơn vừa nghe và xác nhận.</p></header>
            <div className="assembly-options">
              {optionGroup('Trà nền', BASES, selectedBase, setSelectedBase)}
              {optionGroup('Topping', TOPPINGS, selectedTopping, setSelectedTopping)}
              {optionGroup('Mức đường', SUGARS, selectedSugar, setSelectedSugar)}
              {optionGroup('Mức đá', ICE_LEVELS, selectedIce, setSelectedIce)}
            </div>
            <button type="button" className="serve-order" onClick={serveDrink} disabled={!selectedBase || !selectedTopping || !selectedSugar || !selectedIce || serviceResult?.passed}>Phục vụ khách</button>
            {serviceResult && (
              <div className={`service-result ${serviceResult.passed ? 'is-correct' : 'is-wrong'}`}>
                <strong>{serviceResult.passed ? 'Đơn chính xác' : 'Đơn chưa đúng'}</strong>
                {serviceResult.mistakes.map((mistake) => <span key={mistake}>{mistake}</span>)}
                {serviceResult.passed && <button type="button" onClick={nextCustomer}>Đón khách tiếp theo</button>}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
