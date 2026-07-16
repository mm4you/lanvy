'use client';

import { FormEvent, useEffect, useState } from 'react';
import LocalProfile, { ProfileCharacter } from './local-profile';
import { ArrowLeftIcon } from './ui-icons';
import '../app/auth-portal.css';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285f4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z" />
      <path fill="#34a853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0012 22z" />
      <path fill="#fbbc05" d="M6.4 14a6 6 0 010-3.9V7.5H3.1a10 10 0 000 9.1L6.4 14z" />
      <path fill="#ea4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0012 2a10 10 0 00-8.9 5.5l3.3 2.6A6 6 0 0112 5.9z" />
    </svg>
  );
}

interface AuthPortalProps {
  onAuthenticated: (user: AuthenticatedUser) => void;
  onOffline: (name: string) => void;
}

export default function AuthPortal({ onAuthenticated, onOffline }: AuthPortalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineName, setOfflineName] = useState('');

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('auth_error');
    if (!code) return;
    const messages: Record<string, string> = {
      google_not_configured: 'Đăng nhập Google chưa được cấu hình trên máy chủ.',
      google_cancelled: 'Bạn đã hủy đăng nhập Google.',
      invalid_oauth_state: 'Phiên Google đã hết hạn. Vui lòng thử lại.',
      account_link_conflict: 'Email này đã liên kết với một tài khoản Google khác.',
      rate_limited: 'Thao tác quá nhanh. Vui lòng thử lại sau.',
    };
    const errorTimer = window.setTimeout(() => setError(messages[code] ?? 'Không thể đăng nhập bằng Google. Vui lòng thử lại.'), 0);
    window.history.replaceState({}, '', window.location.pathname);
    return () => window.clearTimeout(errorTimer);
  }, []);

  if (offlineMode) {
    return (
      <div className="offline-profile-wrapper">
        <button type="button" className="offline-back-button" onClick={() => setOfflineMode(false)}><ArrowLeftIcon /> Đăng nhập online</button>
        <LocalProfile name={offlineName} onNameChange={setOfflineName} onStart={() => onOffline(offlineName)} />
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password || (mode === 'register' && !email.trim())) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(mode === 'login' ? '/api/login' : '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, ...(mode === 'register' ? { email } : {}) }),
      });
      const data = await response.json() as Partial<AuthenticatedUser> & { success?: boolean; error?: string; userId?: string };
      if (!response.ok || !data.success || !data.userId || !data.username) {
        setError(data.error ?? 'Không thể đăng nhập. Vui lòng thử lại.');
        return;
      }
      onAuthenticated({ id: data.userId, username: data.username, email: data.email ?? '' });
    } catch {
      setError('Không thể kết nối máy chủ. Bạn vẫn có thể chọn chơi offline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="local-profile-screen auth-portal-screen">
      <section className="profile-town-preview" aria-hidden="true">
        <div className="profile-sky"><span /><span /></div>
        <div className="profile-mountains" />
        <div className="profile-field" />
        <div className="profile-house house-one"><span>奶茶</span></div>
        <div className="profile-house house-two"><span>点心</span></div>
        <div className="profile-house house-three"><span>超市</span></div>
        <div className="profile-character-wrap"><ProfileCharacter /></div>
      </section>

      <section className="profile-panel auth-panel">
        <div className="profile-brand"><span>汉</span><strong>HSK Pixel Town</strong></div>
        <p className="world-eyebrow">Thế giới pixel ôn luyện HSK</p>
        <h1>Chào mừng trở lại</h1>
        <p className="profile-copy">Đăng nhập để đồng bộ tiến trình và mở trải nghiệm dành riêng cho hồ sơ của bạn.</p>

        <div className="auth-segments" role="tablist" aria-label="Chọn hình thức tài khoản">
          <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'is-active' : ''} onClick={() => { setMode('login'); setError(''); }}>Đăng nhập</button>
          <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'is-active' : ''} onClick={() => { setMode('register'); setError(''); }}>Đăng ký</button>
        </div>

        <a className="google-auth-button" href="/api/auth/google/start"><GoogleIcon /><span>Tiếp tục với Google</span></a>
        <div className="auth-divider"><span>hoặc dùng tài khoản</span></div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="account-username">Tên tài khoản</label>
          <input id="account-username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" maxLength={20} placeholder="Tên tài khoản" />
          {mode === 'register' && (
            <>
              <label htmlFor="account-email">Email</label>
              <input id="account-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" />
            </>
          )}
          <label htmlFor="account-password">Mật khẩu</label>
          <input id="account-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} placeholder="Tối thiểu 6 ký tự" />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : mode === 'login' ? 'Vào thị trấn' : 'Tạo tài khoản'}</button>
        </form>

        <button type="button" className="offline-secondary" onClick={() => setOfflineMode(true)}>
          Chơi offline trên thiết bị này
          <small>Không cần tài khoản, không đồng bộ tiến trình</small>
        </button>
      </section>
    </main>
  );
}

