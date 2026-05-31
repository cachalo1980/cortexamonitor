'use client';

import { useDocker } from '@/lib/hooks/useDocker';
import { formatBytes } from '@/lib/format';
import MiniBar from './mini-bar';

const STATE_COLOR: Record<string, string> = {
  running: 'var(--accent)',
  exited:  'var(--muted)',
  stopped: 'var(--muted)',
  paused:  'var(--warn)',
  dead:    'var(--danger)',
};

export default function DockerPanel() {
  const { containers, loading, error, lastUpdate } = useDocker(20000);

  if (loading) return (
    <div style={{ color: 'var(--muted)', fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '24px', textAlign: 'center' }}>
      {'>'} conectando con docker engine...
    </div>
  );

  if (error) return (
    <div style={{ color: 'var(--danger)', fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '24px' }}>
      ❌ {error}
    </div>
  );

  const running = containers.filter(c => c.state === 'running');
  const stopped = containers.filter(c => c.state !== 'running');

  return (
    <div style={{ fontFamily: 'var(--font-mono)' }}>
      {/* Summary row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {[
          { label: 'RUNNING', value: running.length, color: 'var(--accent)' },
          { label: 'STOPPED', value: stopped.length, color: 'var(--muted)' },
          { label: 'TOTAL',   value: containers.length, color: 'var(--text)' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, padding: '8px 10px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: '5px',
            textAlign: 'center',
          }}>
            <div style={{ color: s.color, fontSize: '18px', fontWeight: '600' }}>{s.value}</div>
            <div style={{ color: 'var(--muted)', fontSize: '9px', letterSpacing: '1px', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Running containers */}
      <div style={{ color: 'var(--muted)', fontSize: '9px', letterSpacing: '1.5px', marginBottom: '6px' }}>
        ACTIVOS ({running.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
        {running.map(ct => (
          <div key={ct.id} style={{
            padding: '8px 10px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: '5px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: ct.stats ? '7px' : '0' }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--accent)',
                boxShadow: '0 0 5px var(--accent)',
              }} />
              <span style={{ color: 'var(--text)', fontSize: '11px', flex: 1, fontWeight: '500' }}>
                {ct.name}
              </span>
              <span style={{ color: 'var(--muted)', fontSize: '10px' }}>
                {ct.image.split(':')[0].split('/').pop()}
              </span>
            </div>
            {ct.stats && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', paddingLeft: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '9px' }}>CPU</span>
                    <span style={{ color: 'var(--text)', fontSize: '9px' }}>{ct.stats.cpu_pct.toFixed(1)}%</span>
                  </div>
                  <MiniBar value={ct.stats.cpu_pct} max={100} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '9px' }}>RAM</span>
                    <span style={{ color: 'var(--text)', fontSize: '9px' }}>{formatBytes(ct.stats.mem_used)}</span>
                  </div>
                  <MiniBar value={ct.stats.mem_pct} max={100} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stopped containers */}
      {stopped.length > 0 && (
        <>
          <div style={{ color: 'var(--muted)', fontSize: '9px', letterSpacing: '1.5px', marginBottom: '6px' }}>
            DETENIDOS ({stopped.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {stopped.map(ct => (
              <div key={ct.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '7px 10px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--border)',
                borderRadius: '5px',
                opacity: 0.6,
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--muted)', flexShrink: 0 }} />
                <span style={{ color: 'var(--muted)', fontSize: '11px', flex: 1 }}>{ct.name}</span>
                <span style={{ color: 'var(--muted)', fontSize: '9px' }}>{ct.state}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {lastUpdate && (
        <div style={{ color: 'var(--muted)', fontSize: '10px', marginTop: '10px', textAlign: 'right' }}>
          actualizado {lastUpdate.toLocaleTimeString('es-AR', { hour12: false })} · refresca c/20s
        </div>
      )}
    </div>
  );
}
