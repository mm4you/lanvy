'use client';

import { FormEvent } from 'react';
import '../app/local-profile.css';
import { WORLD_VOCAB } from '../data/open-world';

interface LocalProfileProps {
  name: string;
  onNameChange: (name: string) => void;
  onStart: () => void;
}

export function ProfileCharacter() {
  return (
    <svg viewBox="0 0 160 190" className="profile-character pixelated" aria-hidden="true">
      <path d="M39 54h10V35h12V24h38v7h13v23h10v57H39z" fill="#542f20" stroke="#172033" strokeWidth="6" />
      <path d="M50 48h61v65H50z" fill="#ffd5aa" stroke="#172033" strokeWidth="6" />
      <path d="M48 49h14V34h42v8h10v21h-13V52H64v11H48z" fill="#6b3c27" />
      <rect x="61" y="69" width="10" height="12" fill="#172033" />
      <rect x="92" y="69" width="10" height="12" fill="#172033" />
      <rect x="64" y="70" width="3" height="4" fill="white" />
      <rect x="95" y="70" width="3" height="4" fill="white" />
      <rect x="74" y="94" width="18" height="5" fill="#c2415b" />
      <rect x="57" y="111" width="48" height="18" fill="#fff7ed" stroke="#172033" strokeWidth="5" />
      <path d="M39 123h82v49H39z" fill="#ef5350" stroke="#172033" strokeWidth="6" />
      <path d="M67 123h26v31H67z" fill="#fff7ed" stroke="#172033" strokeWidth="5" />
      <rect x="28" y="128" width="13" height="36" fill="#ffd5aa" stroke="#172033" strokeWidth="6" />
      <rect x="119" y="128" width="13" height="36" fill="#ffd5aa" stroke="#172033" strokeWidth="6" />
      <rect x="47" y="170" width="25" height="14" fill="#2563eb" stroke="#172033" strokeWidth="6" />
      <rect x="88" y="170" width="25" height="14" fill="#2563eb" stroke="#172033" strokeWidth="6" />
      <path d="M17 21h24v24H17z" fill="#f59e0b" stroke="#172033" strokeWidth="5" />
      <path d="M124 33h21v21h-21z" fill="#22c55e" stroke="#172033" strokeWidth="5" />
    </svg>
  );
}

export default function LocalProfile({ name, onNameChange, onStart }: LocalProfileProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onStart();
  };

  return (
    <main className="local-profile-screen">
      <section className="profile-town-preview" aria-hidden="true">
        <div className="profile-sky"><span /><span /></div>
        <div className="profile-mountains" />
        <div className="profile-field" />
        <div className="profile-house house-one"><span>奶茶</span></div>
        <div className="profile-house house-two"><span>点心</span></div>
        <div className="profile-house house-three"><span>超市</span></div>
        <div className="profile-character-wrap"><ProfileCharacter /></div>
      </section>

      <section className="profile-panel">
        <div className="profile-brand"><span>汉</span><strong>HSK Pixel Town</strong></div>
        <p className="world-eyebrow">Một thị trấn nhỏ cho hành trình HSK dài lâu</p>
        <h1>Tạo nhân vật của bạn</h1>
        <p className="profile-copy">Hồ sơ, điểm và từ đã học chỉ được lưu trên thiết bị này. Không cần tài khoản, không cần mạng.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="local-player-name">Tên hiển thị</label>
          <input
            id="local-player-name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            maxLength={20}
            autoComplete="nickname"
            placeholder="Ví dụ: Lan Vy"
            autoFocus
          />
          <button type="submit">Bắt đầu khám phá</button>
        </form>
        <div className="profile-features" aria-label="Tính năng offline">
          <span><strong>{WORLD_VOCAB.length}</strong> từ theo chủ đề</span>
          <span><strong>4</strong> khu vực</span>
          <span><strong>100%</strong> chơi offline</span>
        </div>
      </section>
    </main>
  );
}

