import { AvatarConfig } from '../data/avatar';

interface PixelAvatarProps {
  config: AvatarConfig;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

const OUTFIT_COLORS = {
  apron: '#ef5350',
  casual: '#2563eb',
  hanfu: '#db2777',
  varsity: '#15803d',
  overalls: '#ca8a04',
};

export default function PixelAvatar({ config, direction = 'down', className = 'h-16 w-16' }: PixelAvatarProps) {
  const facingBack = direction === 'up';
  const flip = direction === 'left' ? -1 : 1;
  const outfitColor = OUTFIT_COLORS[config.outfit];
  const shoulderWidth = config.bodyStyle === 'masculine' ? 36 : config.bodyStyle === 'feminine' ? 31 : 34;

  return (
    <svg viewBox="0 0 64 76" className={`${className} pixelated`} aria-hidden="true" style={{ transform: `scaleX(${flip})` }}>
      {(config.hairStyle === 'ponytail' || config.hairStyle === 'wave') && (
        <g fill={config.hairColor} stroke="#172033" strokeWidth="3">
          {config.hairStyle === 'ponytail' ? <rect x="45" y="22" width="11" height="24" /> : <path d="M12 18h40v40H41V35H23v23H12z" />}
        </g>
      )}

      <rect x="16" y="12" width="34" height="37" rx="3" fill={config.skinTone} stroke="#172033" strokeWidth="4" />

      {config.hairStyle === 'short' && <path d="M14 22V11h9V6h25v6h5v14h-8v-7H25v6z" fill={config.hairColor} stroke="#172033" strokeWidth="3" />}
      {config.hairStyle === 'bob' && <path d="M12 32V12h8V6h29v7h5v22h-9V19H22v13z" fill={config.hairColor} stroke="#172033" strokeWidth="3" />}
      {config.hairStyle === 'ponytail' && <path d="M14 25V11h8V6h27v7h5v15h-9v-9H24v7z" fill={config.hairColor} stroke="#172033" strokeWidth="3" />}
      {config.hairStyle === 'wave' && <path d="M12 31V13h8V6h29v7h5v20h-9V19H23v13z" fill={config.hairColor} stroke="#172033" strokeWidth="3" />}
      {config.hairStyle === 'spiky' && <path d="M13 23l4-15 7 5 5-10 7 9 8-8 3 10 8-2-4 15-8-8H24v7z" fill={config.hairColor} stroke="#172033" strokeWidth="3" />}

      {!facingBack && (
        <g>
          <rect x="23" y="28" width="6" height="7" fill="#172033" />
          <rect x="39" y="28" width="6" height="7" fill="#172033" />
          <rect x="24" y="29" width="2" height="2" fill="white" />
          <rect x="40" y="29" width="2" height="2" fill="white" />
          <path d="M29 41h10" stroke="#b74354" strokeWidth="3" />
          <rect x="16" y="34" width="5" height="3" fill="#ef9a9a" opacity="0.7" />
          <rect x="45" y="34" width="5" height="3" fill="#ef9a9a" opacity="0.7" />
        </g>
      )}

      <rect x={(64 - shoulderWidth) / 2} y="49" width={shoulderWidth} height="21" fill={outfitColor} stroke="#172033" strokeWidth="4" />
      {config.outfit === 'apron' && <path d="M25 49h15v19H25z" fill="#fff7ed" stroke="#172033" strokeWidth="3" />}
      {config.outfit === 'hanfu' && <path d="M23 49l18 19M42 49L26 68" stroke="#fff7ed" strokeWidth="4" />}
      {config.outfit === 'varsity' && <path d="M26 50v19M40 50v19" stroke="#fff7ed" strokeWidth="3" />}
      {config.outfit === 'overalls' && <path d="M25 49v11h16V49M27 63h12" fill="none" stroke="#fff7ed" strokeWidth="3" />}
      <rect x="18" y="69" width="12" height="6" fill="#343b4d" stroke="#172033" strokeWidth="3" />
      <rect x="37" y="69" width="12" height="6" fill="#343b4d" stroke="#172033" strokeWidth="3" />

      {config.accessory === 'glasses' && !facingBack && (
        <g fill="none" stroke="#172033" strokeWidth="2">
          <rect x="19" y="25" width="13" height="12" /><rect x="36" y="25" width="13" height="12" /><path d="M32 29h4" />
        </g>
      )}
      {config.accessory === 'bow' && <path d="M11 13l9 5v-10zM29 13l-9 5v-10z" fill="#ef4444" stroke="#172033" strokeWidth="3" />}
      {config.accessory === 'cap' && <path d="M13 14h38V7H23v4H13z" fill="#0e7490" stroke="#172033" strokeWidth="3" />}
    </svg>
  );
}

