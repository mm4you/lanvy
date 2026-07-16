'use client';

import { useState } from 'react';
import { AvatarConfig, BodyStyle, COSMETICS, CosmeticItem, HAIR_COLORS, SKIN_TONES } from '../data/avatar';
import PixelAvatar from './pixel-avatar';
import '../app/avatar-wardrobe.css';

interface AvatarWardrobeProps {
  avatar: AvatarConfig;
  coins: number;
  onChange: (avatar: AvatarConfig) => void;
  onSpend: (cost: number) => boolean;
  onBack: () => void;
}

const BODY_STYLES: Array<{ value: BodyStyle; label: string }> = [
  { value: 'feminine', label: 'Nữ tính' },
  { value: 'masculine', label: 'Nam tính' },
  { value: 'neutral', label: 'Trung tính' },
];

function applyCosmetic(avatar: AvatarConfig, item: CosmeticItem): AvatarConfig {
  if (item.type === 'hair') return { ...avatar, hairStyle: item.value as AvatarConfig['hairStyle'] };
  if (item.type === 'outfit') return { ...avatar, outfit: item.value as AvatarConfig['outfit'] };
  return { ...avatar, accessory: item.value as AvatarConfig['accessory'] };
}

export default function AvatarWardrobe({ avatar, coins, onChange, onSpend, onBack }: AvatarWardrobeProps) {
  const [tab, setTab] = useState<CosmeticItem['type']>('hair');
  const [message, setMessage] = useState('Chọn món đã sở hữu để trang bị, hoặc dùng xu để mở khóa món mới.');
  const items = COSMETICS.filter((item) => item.type === tab);

  const isEquipped = (item: CosmeticItem) => {
    if (item.type === 'hair') return avatar.hairStyle === item.value;
    if (item.type === 'outfit') return avatar.outfit === item.value;
    return avatar.accessory === item.value;
  };

  const handleItem = (item: CosmeticItem) => {
    const owned = avatar.ownedItems.includes(item.id);
    if (!owned && !onSpend(item.price)) {
      setMessage(`Bạn cần thêm ${item.price - coins} xu để mở khóa ${item.name}.`);
      return;
    }
    const nextAvatar = applyCosmetic({
      ...avatar,
      ownedItems: owned ? avatar.ownedItems : [...avatar.ownedItems, item.id],
    }, item);
    onChange(nextAvatar);
    setMessage(owned ? `Đã trang bị ${item.name}.` : `Đã mua và trang bị ${item.name}.`);
  };

  return (
    <section className="wardrobe-shell">
      <header className="wardrobe-header">
        <button type="button" className="wardrobe-back" onClick={onBack} aria-label="Quay về thị trấn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div>
          <p className="world-eyebrow">Tiệm thời trang thị trấn</p>
          <h1>Tủ đồ nhân vật</h1>
          <p>Tạo diện mạo riêng và sưu tập trang phục bằng xu từ các nhiệm vụ HSK.</p>
        </div>
        <div className="wardrobe-coins"><span>Xu hiện có</span><strong>{coins}</strong></div>
      </header>

      <div className="wardrobe-layout">
        <section className="avatar-studio">
          <div className="avatar-preview-grid" aria-label="Xem trước nhân vật">
            <PixelAvatar config={avatar} className="avatar-preview-sprite" />
          </div>

          <div className="avatar-control-group">
            <span>Dáng nhân vật</span>
            <div className="avatar-segments">
              {BODY_STYLES.map((style) => (
                <button key={style.value} type="button" className={avatar.bodyStyle === style.value ? 'is-active' : ''} onClick={() => onChange({ ...avatar, bodyStyle: style.value })}>{style.label}</button>
              ))}
            </div>
          </div>

          <div className="avatar-control-group">
            <span>Tông da</span>
            <div className="color-swatches">
              {SKIN_TONES.map((color) => <button key={color} type="button" className={avatar.skinTone === color ? 'is-active' : ''} style={{ backgroundColor: color }} onClick={() => onChange({ ...avatar, skinTone: color })} aria-label={`Chọn tông da ${color}`} />)}
            </div>
          </div>

          <div className="avatar-control-group">
            <span>Màu tóc</span>
            <div className="color-swatches">
              {HAIR_COLORS.map((color) => <button key={color} type="button" className={avatar.hairColor === color ? 'is-active' : ''} style={{ backgroundColor: color }} onClick={() => onChange({ ...avatar, hairColor: color })} aria-label={`Chọn màu tóc ${color}`} />)}
            </div>
          </div>
        </section>

        <section className="cosmetic-shop">
          <div className="cosmetic-tabs" role="tablist" aria-label="Loại vật phẩm">
            <button type="button" role="tab" aria-selected={tab === 'hair'} className={tab === 'hair' ? 'is-active' : ''} onClick={() => setTab('hair')}>Kiểu tóc</button>
            <button type="button" role="tab" aria-selected={tab === 'outfit'} className={tab === 'outfit' ? 'is-active' : ''} onClick={() => setTab('outfit')}>Trang phục</button>
            <button type="button" role="tab" aria-selected={tab === 'accessory'} className={tab === 'accessory' ? 'is-active' : ''} onClick={() => setTab('accessory')}>Phụ kiện</button>
          </div>

          <div className="cosmetic-grid">
            {items.map((item) => {
              const owned = avatar.ownedItems.includes(item.id);
              const equipped = isEquipped(item);
              return (
                <button key={item.id} type="button" className={equipped ? 'is-equipped' : ''} onClick={() => handleItem(item)}>
                  <span className="cosmetic-sample" style={{ backgroundColor: item.color }} />
                  <strong>{item.name}</strong>
                  <small>{equipped ? 'Đang dùng' : owned ? 'Đã sở hữu' : `${item.price} xu`}</small>
                </button>
              );
            })}
          </div>

          <p className="wardrobe-message" role="status">{message}</p>
        </section>
      </div>
    </section>
  );
}

