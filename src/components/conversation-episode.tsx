'use client';

import { useEffect, useRef, useState } from 'react';
import '../app/conversation-episode.css';
import { CONVERSATION_SCENARIOS } from '../data/conversations';
import { LearningZone } from '../data/open-world';

interface EpisodeResult {
  vocabIds: string[];
  correctTurns: number;
  totalTurns: number;
}

interface ConversationEpisodeProps {
  zone: LearningZone;
  onComplete: (result: EpisodeResult) => void;
}

interface AnswerResult {
  passed: boolean;
  score: number;
  matchedGroups: number;
  response: string;
}

interface StoredAttempt {
  scenarioId: string;
  turnId: string;
  response: string;
  passed: boolean;
  score: number;
  usedSupport: boolean;
  vocabIds: string[];
  createdAt: string;
}

const ATTEMPT_STORAGE_KEY = 'hsk_conversation_attempts_v1';

function normalizeAnswer(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase('zh-CN').replace(/[\s\p{P}\p{S}]/gu, '');
}

function speakChinese(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function saveAttempt(attempt: StoredAttempt) {
  try {
    const saved = window.localStorage.getItem(ATTEMPT_STORAGE_KEY);
    const attempts = saved ? JSON.parse(saved) as StoredAttempt[] : [];
    window.localStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify([...attempts, attempt].slice(-200)));
  } catch {
    window.localStorage.removeItem(ATTEMPT_STORAGE_KEY);
  }
}

function SpeakerIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5zM17 9c1.4 1.8 1.4 4.2 0 6" /></svg>;
}

function MicIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3M8 21h8" /></svg>;
}

function SendIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5l16 7-16 7 3-7-3-7zM7 12h13" /></svg>;
}

export default function ConversationEpisode({ zone, onComplete }: ConversationEpisodeProps) {
  const scenario = CONVERSATION_SCENARIOS[zone];
  const [turnIndex, setTurnIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [showPinyin, setShowPinyin] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [correctTurns, setCorrectTurns] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const stopTimerRef = useRef<number | null>(null);

  const turn = scenario.turns[turnIndex];
  const usedSupport = showPinyin || showMeaning || showSuggestions;

  useEffect(() => {
    const updateNetwork = () => setIsOnline(window.navigator.onLine);
    updateNetwork();
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
    return () => {
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
    };
  }, []);

  useEffect(() => () => {
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
  }, []);

  const submitAnswer = (answer = response) => {
    const trimmed = answer.trim();
    if (!trimmed || answerResult?.passed) return;
    const normalized = normalizeAnswer(trimmed);
    const matchedGroups = turn.acceptedGroups.filter((group) => (
      group.some((accepted) => normalized.includes(normalizeAnswer(accepted)))
    )).length;
    const passed = matchedGroups >= turn.requiredMatches;
    const score = passed
      ? Math.min(100, 68 + matchedGroups * 12 + (usedSupport ? 0 : 10))
      : Math.min(55, 20 + matchedGroups * 20);
    const result = { passed, score, matchedGroups, response: trimmed };
    setAnswerResult(result);
    setAttemptCount((current) => current + 1);
    if (passed) setCorrectTurns((current) => current + 1);
    saveAttempt({
      scenarioId: scenario.id,
      turnId: turn.id,
      response: trimmed,
      passed,
      score,
      usedSupport,
      vocabIds: turn.vocabIds,
      createdAt: new Date().toISOString(),
    });
  };

  const transcribeAudio = async (audio: Blob) => {
    setIsTranscribing(true);
    setVoiceError(null);
    try {
      const formData = new FormData();
      formData.append('file', audio, 'conversation.webm');
      const request = await fetch('/api/transcribe', { method: 'POST', body: formData });
      const data = await request.json() as { text?: string; error?: string };
      if (!request.ok || !data.text) throw new Error(data.error || 'Không nhận được nội dung giọng nói');
      setResponse(data.text);
      submitAnswer(data.text);
    } catch {
      setVoiceError('Chưa nhận được câu nói. Bạn có thể thử lại hoặc gõ câu trả lời.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const startRecording = async () => {
    if (!isOnline) {
      setVoiceError('Mic chấm giọng nói cần kết nối mạng. Phần hội thoại gõ và gợi ý vẫn dùng được offline.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setVoiceError('Trình duyệt này chưa hỗ trợ ghi âm. Hãy dùng ô trả lời bên dưới.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const audio = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (audio.size > 0) void transcribeAudio(audio);
      };
      recorder.start();
      setIsRecording(true);
      stopTimerRef.current = window.setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
        setIsRecording(false);
      }, 12000);
    } catch {
      setVoiceError('Không mở được micro. Hãy kiểm tra quyền micro của trình duyệt.');
    }
  };

  const stopRecording = () => {
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const resetTurn = () => {
    setResponse('');
    setAnswerResult(null);
    setShowPinyin(false);
    setShowMeaning(false);
    setShowSuggestions(false);
    setVoiceError(null);
  };

  const nextTurn = () => {
    if (!answerResult?.passed) return;
    if (turnIndex < scenario.turns.length - 1) {
      setTurnIndex((current) => current + 1);
      resetTurn();
      return;
    }
    const vocabIds = [...new Set(scenario.turns.flatMap((item) => item.vocabIds))];
    setCompleted(true);
    onComplete({ vocabIds, correctTurns, totalTurns: scenario.turns.length });
  };

  if (completed) {
    return (
      <section className="episode-complete" aria-live="polite">
        <span>Hoàn thành tình huống</span>
        <h2>{scenario.title}</h2>
        <div className="episode-summary">
          <span><strong>{scenario.turns.length}</strong> lượt hội thoại</span>
          <span><strong>{attemptCount}</strong> lần trả lời</span>
          <span><strong>{correctTurns}</strong> lượt đạt ý</span>
        </div>
        <p>Các câu cần gợi ý hoặc trả lời chưa đạt đã được lưu vào lịch ôn giao tiếp trên thiết bị.</p>
        <button type="button" onClick={() => { setTurnIndex(0); setCorrectTurns(0); setAttemptCount(0); setCompleted(false); resetTurn(); }}>
          Luyện lại tình huống
        </button>
      </section>
    );
  }

  return (
    <section className="conversation-episode" aria-label={scenario.title}>
      <header className="episode-header">
        <div>
          <span>{scenario.npcChineseName} · {scenario.npcName}</span>
          <h2>{scenario.title}</h2>
          <p>{scenario.context}</p>
        </div>
        <div className="episode-step"><strong>{turnIndex + 1}</strong><span>/ {scenario.turns.length}</span></div>
      </header>

      <div className="episode-progress" aria-label={`Lượt ${turnIndex + 1} trên ${scenario.turns.length}`}>
        <span style={{ width: `${((turnIndex + 1) / scenario.turns.length) * 100}%` }} />
      </div>

      <div className="npc-line">
        <button type="button" onClick={() => speakChinese(turn.npcChinese)} title="Nghe lại câu của NPC" aria-label="Nghe lại câu của NPC"><SpeakerIcon /></button>
        <div>
          <strong>{turn.npcChinese}</strong>
          {showPinyin && <span>{turn.npcPinyin}</span>}
          {showMeaning && <small>{turn.npcVietnamese}</small>}
        </div>
      </div>

      <div className="support-controls" aria-label="Trợ giúp câu hội thoại">
        <button type="button" className={showPinyin ? 'is-active' : ''} onClick={() => setShowPinyin((value) => !value)}>Pinyin</button>
        <button type="button" className={showMeaning ? 'is-active' : ''} onClick={() => setShowMeaning((value) => !value)}>Nghĩa Việt</button>
        <button type="button" className={showSuggestions ? 'is-active' : ''} onClick={() => setShowSuggestions((value) => !value)}>Gợi ý câu</button>
      </div>

      {showSuggestions && (
        <div className="suggestion-list">
          {turn.suggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => { setResponse(suggestion); speakChinese(suggestion); }}>{suggestion}</button>
          ))}
        </div>
      )}

      <div className="response-station">
        <button
          type="button"
          className={`voice-button ${isRecording ? 'is-recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isTranscribing || Boolean(answerResult?.passed)}
        >
          <MicIcon />
          <span>{isTranscribing ? 'Đang nhận giọng nói' : isRecording ? 'Dừng và chấm' : 'Trả lời bằng mic'}</span>
        </button>
        <span className="response-divider">hoặc</span>
        <label>
          <span>Câu trả lời tiếng Trung</span>
          <div>
            <input
              value={response}
              onChange={(event) => setResponse(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') submitAnswer(); }}
              placeholder="Nhập câu bạn muốn nói..."
              disabled={Boolean(answerResult?.passed)}
            />
            <button type="button" onClick={() => submitAnswer()} disabled={!response.trim() || Boolean(answerResult?.passed)} title="Gửi câu trả lời" aria-label="Gửi câu trả lời"><SendIcon /></button>
          </div>
        </label>
      </div>

      {voiceError && <p className="voice-error" role="status">{voiceError}</p>}

      {answerResult && (
        <div className={`conversation-feedback ${answerResult.passed ? 'is-passed' : 'is-retry'}`} role="status">
          <div className="feedback-score"><strong>{answerResult.score}</strong><span>điểm ý định</span></div>
          <div>
            <strong>{answerResult.passed ? 'Đã truyền đạt đúng ý' : 'Ý định chưa đủ rõ'}</strong>
            <p>{answerResult.passed ? turn.feedback : `Thử dùng một cụm như: ${turn.suggestions[0]}`}</p>
            {answerResult.passed && <small>Câu mẫu: {turn.modelAnswer} · {turn.modelPinyin}</small>}
          </div>
          {answerResult.passed ? (
            <button type="button" onClick={nextTurn}>{turnIndex === scenario.turns.length - 1 ? 'Hoàn thành' : 'NPC nói tiếp'}</button>
          ) : (
            <button type="button" onClick={() => setAnswerResult(null)}>Thử lại</button>
          )}
        </div>
      )}
    </section>
  );
}
