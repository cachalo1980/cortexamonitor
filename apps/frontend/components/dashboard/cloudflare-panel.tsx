'use client';

import { useCloudflare } from '@/lib/hooks/useCloudflare';

const STATUS_COLOR: Record<string, string> = {
  up:       'var(--accent)',
  degraded: 'var(--warn)',
  down:     'var(--danger)',
  healthy:  'var(--accent)',
  inactive: 'var(--muted)',
};

function LatencyBadge({ ms }: { ms: number | null }) {
  if (!ms) return null;
  const color = ms < 300 ? 'var(--accent)' : ms < 800 ? 'var(--warn)' : 'var(--danger)';
  return (
    <span style={{ color, fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
      {ms}ms
    </span>
  );
}

export default function CloudflarePanel() {
  const { status, health, loading, error, lastUpdate } = useCloudflare(30000);

  if (loading) return (
    <div style={{ color: 'var(--muted)', fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '24px', textAlign: 'center' }}>
      {'>'} conectando con cloudflare...
    </div>
  );

  if (error) return (
    <div style={{ color: 'var(--danger)', fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '24px' }}>
      ❌ {error}
    </div>
  );

  const upCount = health.filter(h => h.status === 'up').length;
  const downCount = health.filter(h => h.status === 'down').length;
  const degradedCount = health.filter(h => h.status === 'degraded').length;

  return (
    <div style={{ fontFamily: 'var(--font-mono)' }}>

      {/* Tunnel status */}
      {status?.tunnel && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          marginBottom: '12px',
        }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: STATUS_COLOR[status.tunnel.status] || 'var(--muted)',
            boxShadow: `0 0 6px ${STATUS_COLOR[status.tunnel.status] || 'var(--muted)'}`,
          }} />
          <span style={{ color: 'var(--text)', fontSize: '12px', flex: 1 }}>
            tunnel / {status.tunnel.name}
          </span>
          <span style={{ color: 'var(--muted)', fontSize: '10px' }}>
            {status.connections?.length || 0} conn
          </span>
          <span style={{
            fontSize: '9px', padding: '2px 7px', borderRadius: '3px',
            background: status.tunnel.status === 'healthy' ? 'rgba(0,229,176,0.1)' : 'rgba(244,63,94,0.1)',
            color: STATUS_COLOR[status.tunnel.status] || 'var(--muted)',
            border: `1px solid ${STATUS_COLOR[status.tunnel.status] || 'var(--muted)'}33`,
            letterSpacing: '0.5px',
          }}>
            {status.tunnel.status.toUpperCase()}
          </span>
        </div>
      )}

      {/* Summary row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {[
          { label: 'UP',       value: upCount,       color: 'var(--accent)' },
          { label: 'DEGRADED', value: degradedCount,  color: 'var(--warn)'   },
          { label: 'DOWN',     value: downCount,      color: 'var(--danger)' },
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

      {/* Health checks list */}
      <div style={{ color: 'var(--muted)', fontSize: '9px', letterSpacing: '1.5px', marginBottom: '6px' }}>
        SERVICIOS EXPUESTOS ({health.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {health.map(h => (
          <div key={h.hostname} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: '5px',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
              background: STATUS_COLOR[h.status],
              boxShadow: h.status === 'up' ? `0 0 5px ${STATUS_COLOR[h.status]}` : 'none',
            }} />
            <span style={{ color: h.status === 'up' ? 'var(--text)' : 'var(--muted)', fontSize: '11px', flex: 1 }}>
              {h.hostname}
            </span>
            <LatencyBadge ms={h.latencyMs} />
            {h.httpCode && (
              <span style={{ color: 'var(--muted)', fontSize: '10px' }}>
                {h.httpCode}
              </span>
            )}
            <span style={{
              fontSize: '9px', padding: '1px 6px', borderRadius: '3px',
              background: h.status === 'up'
                ? 'rgba(0,229,176,0.08)'
                : h.status === 'degraded'
                ? 'rgba(245,158,11,0.08)'
                : 'rgba(244,63,94,0.08)',
              color: STATUS_COLOR[h.status],
              letterSpacing: '0.5px',
            }}>
              {h.status}
            </span>
          </div>
        ))}
      </div>

      {lastUpdate && (
        <div style={{ color: 'var(--muted)', fontSize: '10px', marginTop: '10px', textAlign: 'right' }}>
          actualizado {lastUpdate.toLocaleTimeString('es-AR', { hour12: false })} · refresca c/30s
        </div>
      )}
    </div>
  );
}
