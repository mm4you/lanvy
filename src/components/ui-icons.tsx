interface IconProps {
  className?: string;
}

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  'aria-hidden': true,
};

export function ArrowLeftIcon({ className = 'h-5 w-5' }: IconProps) {
  return <svg {...baseProps} className={className}><path d="M15 5l-7 7 7 7" /></svg>;
}

export function ArrowRightIcon({ className = 'h-4 w-4' }: IconProps) {
  return <svg {...baseProps} className={className}><path d="M9 5l7 7-7 7" /></svg>;
}

export function VolumeIcon({ className = 'h-4 w-4' }: IconProps) {
  return <svg {...baseProps} className={className}><path d="M5 9v6h4l5 4V5L9 9H5z" /><path d="M17 9c1.3 1.7 1.3 4.3 0 6" /></svg>;
}

export function LogoutIcon({ className = 'h-5 w-5' }: IconProps) {
  return <svg {...baseProps} className={className}><path d="M10 5H5v14h5" /><path d="M13 8l4 4-4 4M8 12h9" /></svg>;
}

export function CloseIcon({ className = 'h-4 w-4' }: IconProps) {
  return <svg {...baseProps} className={className}><path d="M6 6l12 12M18 6L6 18" /></svg>;
}

export function BotIcon({ className = 'h-5 w-5' }: IconProps) {
  return <svg {...baseProps} className={className}><rect x="4" y="7" width="16" height="12" rx="2" /><path d="M9 3h6M12 3v4M8 12h.01M16 12h.01M8 16h8" /></svg>;
}

export function EditIcon({ className = 'h-5 w-5' }: IconProps) {
  return <svg {...baseProps} className={className}><path d="M4 20h4l11-11-4-4L4 16v4zM13 7l4 4" /></svg>;
}

export function WardrobeIcon({ className = 'h-4 w-4' }: IconProps) {
  return <svg {...baseProps} className={className}><path d="M9 5a3 3 0 016 0c0 2-3 2-3 4" /><path d="M12 9L4 16v3h16v-3l-8-7z" /></svg>;
}

