'use client';

import { CSSProperties, PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AvatarConfig } from '../data/avatar';
import PlayerAvatar from './pixel-avatar';

type DestinationId = 'boba' | 'dimsum' | 'market' | 'park';

interface Point {
  x: number;
  y: number;
}

interface TownExplorerProps {
  playerName: string;
  avatar: AvatarConfig;
  zoneWins: { dimsum: number; market: number; park: number };
  onEnter: (destination: DestinationId) => void;
}

const START_POSITION: Point = { x: 0.5, y: 0.49 };
const MOVE_SPEED = 0.00014;

const DESTINATIONS: Array<{
  id: DestinationId;
  chinese: string;
  title: string;
  entrance: Point;
  label: Point;
}> = [
  { id: 'boba', chinese: '奶茶', title: 'Tiệm trà sữa', entrance: { x: 0.29, y: 0.34 }, label: { x: 0.29, y: 0.34 } },
  { id: 'park', chinese: '公园', title: 'Công viên', entrance: { x: 0.73, y: 0.34 }, label: { x: 0.73, y: 0.34 } },
  { id: 'dimsum', chinese: '点心', title: 'Nhà hàng Dim Sum', entrance: { x: 0.29, y: 0.81 }, label: { x: 0.29, y: 0.81 } },
  { id: 'market', chinese: '超市', title: 'Siêu thị HSK', entrance: { x: 0.72, y: 0.82 }, label: { x: 0.72, y: 0.82 } },
];

const OBSTACLES = [
  { left: 0.11, right: 0.41, top: 0.03, bottom: 0.29 },
  { left: 0.63, right: 0.82, top: 0.05, bottom: 0.28 },
  { left: 0.81, right: 0.99, top: 0.0, bottom: 0.38 },
  { left: 0.1, right: 0.43, top: 0.5, bottom: 0.76 },
  { left: 0.58, right: 0.88, top: 0.52, bottom: 0.79 },
];

function isWalkable(point: Point) {
  if (point.x < 0.035 || point.x > 0.965 || point.y < 0.04 || point.y > 0.95) return false;
  return !OBSTACLES.some((area) => (
    point.x > area.left && point.x < area.right && point.y > area.top && point.y < area.bottom
  ));
}

function distance(first: Point, second: Point) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function DirectionIcon({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) {
  const rotation = { up: -90, right: 0, down: 90, left: 180 }[direction];
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M8 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
}

export default function TownExplorer({ playerName, avatar, zoneWins, onEnter }: TownExplorerProps) {
  const [position, setPosition] = useState<Point>(START_POSITION);
  const [isMoving, setIsMoving] = useState(false);
  const [touchDirection, setTouchDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
  const heldKeys = useRef(new Set<string>());
  const viewportRef = useRef<HTMLDivElement>(null);

  const nearbyDestination = useMemo(() => (
    DESTINATIONS.find((destination) => distance(position, destination.entrance) < 0.072) ?? null
  ), [position]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)) return;
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        event.preventDefault();
        heldKeys.current.add(key);
      }
      if (key === 'e' || key === ' ' || key === 'enter') {
        event.preventDefault();
        if (nearbyDestination) onEnter(nearbyDestination.id);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => heldKeys.current.delete(event.key.toLowerCase());
    const clearKeys = () => heldKeys.current.clear();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearKeys);
    };
  }, [nearbyDestination, onEnter]);

  useEffect(() => {
    let frame = 0;
    let previousTime = performance.now();
    const move = (time: number) => {
      const elapsed = Math.min(32, time - previousTime);
      previousTime = time;
      const keys = heldKeys.current;
      let horizontal = Number(keys.has('d') || keys.has('arrowright') || touchDirection === 'right') - Number(keys.has('a') || keys.has('arrowleft') || touchDirection === 'left');
      let vertical = Number(keys.has('s') || keys.has('arrowdown') || touchDirection === 'down') - Number(keys.has('w') || keys.has('arrowup') || touchDirection === 'up');
      const moving = horizontal !== 0 || vertical !== 0;
      if (moving) {
        const magnitude = Math.hypot(horizontal, vertical);
        horizontal /= magnitude;
        vertical /= magnitude;
        setPosition((current) => {
          const next = {
            x: current.x + horizontal * MOVE_SPEED * elapsed,
            y: current.y + vertical * MOVE_SPEED * elapsed,
          };
          if (isWalkable(next)) return next;
          const horizontalOnly = { x: next.x, y: current.y };
          if (isWalkable(horizontalOnly)) return horizontalOnly;
          const verticalOnly = { x: current.x, y: next.y };
          return isWalkable(verticalOnly) ? verticalOnly : current;
        });
      }
      setIsMoving((current) => current === moving ? current : moving);
      frame = window.requestAnimationFrame(move);
    };
    frame = window.requestAnimationFrame(move);
    return () => window.cancelAnimationFrame(frame);
  }, [touchDirection]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || viewport.scrollWidth <= viewport.clientWidth) return;
    viewport.scrollLeft = viewport.scrollWidth * position.x - viewport.clientWidth / 2;
  }, [position.x]);

  const directionButtonProps = (direction: 'up' | 'down' | 'left' | 'right') => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setTouchDirection(direction);
    },
    onPointerUp: () => setTouchDirection(null),
    onPointerCancel: () => setTouchDirection(null),
    'aria-label': `Đi ${direction === 'up' ? 'lên' : direction === 'down' ? 'xuống' : direction === 'left' ? 'trái' : 'phải'}`,
  });

  return (
    <div ref={viewportRef} className="town-map-viewport">
      <section className="town-map" tabIndex={0} aria-label="Bản đồ thị trấn có thể di chuyển">
        {DESTINATIONS.map((destination) => {
          const progress = destination.id === 'dimsum'
            ? `${zoneWins.dimsum} nhiệm vụ`
            : destination.id === 'market'
              ? `${zoneWins.market} món đã tìm`
              : destination.id === 'park'
                ? `${zoneWins.park} hội thoại`
                : 'Pha chế và gọi món';
          return (
            <div
              key={destination.id}
              className={`town-landmark landmark-${destination.id}`}
              style={{ '--landmark-x': `${destination.label.x * 100}%`, '--landmark-y': `${destination.label.y * 100}%` } as CSSProperties}
            >
              <span>{destination.chinese}</span>
              <strong>{destination.title}</strong>
              <small>{progress}</small>
            </div>
          );
        })}

        <div
          className={`town-avatar ${isMoving ? 'is-moving' : ''}`}
          style={{ left: `${position.x * 100}%`, top: `${position.y * 100}%` }}
        >
          <PlayerAvatar config={avatar} className="h-16 w-16" />
          <span>{playerName}</span>
        </div>

        {nearbyDestination && (
          <button type="button" className="town-interact" style={{ left: `${position.x * 100}%` }} onClick={() => onEnter(nearbyDestination.id)}>
            <span>Vào</span>
            <strong>{nearbyDestination.title}</strong>
            <kbd>E</kbd>
          </button>
        )}

        <div className="town-controls" style={{ left: `max(12px, calc(${position.x * 100}% - 170px))` }} aria-label="Điều khiển di chuyển">
          <button type="button" className="control-up" {...directionButtonProps('up')}><DirectionIcon direction="up" /></button>
          <button type="button" className="control-left" {...directionButtonProps('left')}><DirectionIcon direction="left" /></button>
          <button type="button" className="control-down" {...directionButtonProps('down')}><DirectionIcon direction="down" /></button>
          <button type="button" className="control-right" {...directionButtonProps('right')}><DirectionIcon direction="right" /></button>
        </div>
      </section>
    </div>
  );
}
