'use client';

import { useAlerts } from '@/lib/hooks/useAlerts';

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: 'var(--danger)',
  WARN:     'var(--warn)',
  INFO:     'var(--accent2)',
};

const SEVERITY_BG: Record<string, string> = {
  CRITICAL: 'rgba(244,63,94,0.07)',
  WARN:     'rgba(245,158,11,0.07)',
  INFO:     'rgba(56,189,248,0.07)',
};

const TYPE_ICON: Record<string, string> = {
  SERVICE_DOWN: '◎',
  TUNNEL_DOWN:  '◌',
  CPU_HIGH:     '▲',
  RAM_HIGH:     '▣',
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `hace ${diff}s`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

export default function AlertsPanel() {
  const { alerts, unresolved, loading, lastUpdate, resolveAlert, resolveAll } = useAlerts(30000);

  if (loading) return (
    <div style={{ color: 'var(--muted)', fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '24px', textAlign: 'center' }}>
      {'>'} cargando alertas...
    </div>
  );

  return (
    <div style={{ fontFamily: 'var(--font-mono)' }}>

      {/* Header con contador y botón resolver todo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        {unresolved.length > 0 && (
          <>
            <div style={{
              background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)',
              borderRadius: '4px', padding: '2px 8px',
              color: 'var(--danger)', fontSize: '11px',
            }}>
              {unresolved.length} activa{unresolved.length > 1 ? 's' : ''}
            </div>
            <button
              onClick={resolveAll}
              style={{
                marginLeft: 'auto', background: 'transparent',
                border: '1px solid var(--border)', borderRadius: '4px',
                padding: '3px 10px', color: 'var(--muted)', fontSize: '10px',
                fontFamily: 'var(--font-mono)', cursor: 'pointer',
                letterSpacing: '0.5px',
              }}
            >
              resolver todo
            </button>
          </>
        )}
        {unresolved.length === 0 && (
          <div style={{
            background: 'rgba(0,229,176,0.08)', border: '1px solid rgba(0,229,176,0.2)',
            borderRadius: '4px', padding: '2px 8px',
            color: 'var(--accent)', fontSize: '11px',
          }}>
            ✓ sin alertas activas
          </div>
        )}
      </div>

      {/* Lista de alertas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {alerts.length === 0 && (
          <div style={{ color: 'var(--muted)', fontSize: '12px', textAlign: 'center', padding: '24px' }}>
            Sin alertas registradas
          </div>
        )}
        {alerts.map(alert => (
          <div key={alert.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            padding: '9px 10px',
            background: alert.resolved ? 'rgba(255,255,255,0.01)' : SEVERITY_BG[alert.severity],
            border: `1px solid ${alert.resolved ? 'var(--border)' : SEVERITY_COLOR[alert.severity] + '33'}`,
            borderLeft: `3px solid ${alert.resolved ? 'var(--border)' : SEVERITY_COLOR[alert.severity]}`,
            borderRadius: '5px',
            opacity: alert.resolved ? 0.5 : 1,
          }}>
            <span style={{ color: alert.resolved ? 'var(--muted)' : SEVERITY_COLOR[alert.severity], fontSize: '13px', marginTop: '1px' }}>
              {TYPE_ICON[alert.type] || '◆'}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: alert.resolved ? 'var(--muted)' : 'var(--text)', fontSize: '11px', fontWeight: '500', marginBottom: '2px' }}>
                {alert.title}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '10px' }}>
                {alert.message}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
              <span style={{ color: 'var(--muted)', fontSize: '10px' }}>
                {timeAgo(alert.createdAt)}
              </span>
              {!alert.resolved && (
                <button
                  onClick={() => resolveAlert(alert.id)}
                  style={{
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: '3px', padding: '1px 6px',
                    color: 'var(--muted)', fontSize: '9px',
                    fontFamily: 'var(--font-mono)', cursor: 'pointer',
                    letterSpacing: '0.5px',
                  }}
                >
                  resolver
                </button>
              )}
            </div>
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
