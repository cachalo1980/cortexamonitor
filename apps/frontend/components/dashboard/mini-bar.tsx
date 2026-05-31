'use client';

interface MiniBarProps {
  value: number;
  max?: number;
  color?: string;
}

export default function MiniBar({ value, max = 100, color }: MiniBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const barColor = color || (pct > 85 ? 'var(--danger)' : pct > 65 ? 'var(--warn)' : 'var(--accent)');

  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '3px', height: '4px', width: '100%', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '3px', transition: 'width 0.5s ease' }} />
    </div>
  );
}
