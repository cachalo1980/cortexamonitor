'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Topbar({ title }: { title?: string }) {
  const { data: session } = useSession();
  const [time, setTime] = useState('');
  const [allOk] = useState(true);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('es-AR', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header style={{
      height: '56px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'var(--bg2)',
      fontFamily: 'var(--font-mono)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: '500' }}>
          {title || 'Overview'}
        </span>
        <span style={{ color: 'var(--muted)', fontSize: '11px' }}>
          {new Date().toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Live badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(0,229,176,0.08)',
          border: '1px solid rgba(0,229,176,0.2)',
          borderRadius: '4px',
          padding: '3px 10px',
          fontSize: '10px',
          color: 'var(--accent)',
          letterSpacing: '1px',
        }}>
          <div style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: allOk ? 'var(--accent)' : 'var(--danger)',
            boxShadow: `0 0 6px ${allOk ? 'var(--accent)' : 'var(--danger)'}`,
            animation: 'blink 2s infinite',
          }} />
          LIVE
        </div>

        {/* Clock */}
        <span style={{ color: 'var(--muted)', fontSize: '12px' }}>{time}</span>

        {/* User */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '4px 10px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
        }}>
          <div style={{
            width: '20px', height: '20px',
            background: 'rgba(0,229,176,0.15)',
            border: '1px solid rgba(0,229,176,0.3)',
            borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', color: 'var(--accent)',
          }}>
            {session?.user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <span style={{ color: 'var(--text)', fontSize: '11px' }}>
            {session?.user?.name || 'Admin'}
          </span>
          <span style={{
            fontSize: '9px', padding: '1px 5px',
            background: 'rgba(0,229,176,0.1)',
            color: 'var(--accent)',
            borderRadius: '3px',
            letterSpacing: '0.5px',
          }}>
            {(session?.user as any)?.role || 'ADMIN'}
          </span>
        </div>
      </div>
    </header>
  );
}
