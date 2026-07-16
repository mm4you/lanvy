import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'HSK Pixel Town';
export const contentType = 'image/png';

export default async function Icon({ searchParams }: { searchParams: Promise<{ size?: string }> }) {
  const requestedSize = Number((await searchParams).size);
  const size = requestedSize === 192 ? 192 : 512;
  const scale = size / 512;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#77b85a',
          border: `${Math.round(20 * scale)}px solid #172033`,
        }}
      >
        <div style={{ display: 'flex', position: 'relative', width: '72%', height: '72%', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', position: 'absolute', inset: '14% 5% 5%', background: '#f6c453', border: `${Math.round(14 * scale)}px solid #172033` }} />
          <div style={{ display: 'flex', position: 'absolute', top: 0, width: '100%', height: '31%', background: '#ef4444', border: `${Math.round(14 * scale)}px solid #172033` }} />
          <div style={{ display: 'flex', position: 'relative', width: '47%', height: '47%', alignItems: 'center', justifyContent: 'center', background: '#fffdf4', border: `${Math.round(12 * scale)}px solid #172033`, color: '#172033', fontSize: Math.round(112 * scale), fontWeight: 900 }}>
            汉
          </div>
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}

