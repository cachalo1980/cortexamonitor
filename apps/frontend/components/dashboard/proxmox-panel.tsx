'use client';

import { useProxmox } from '@/lib/hooks/useProxmox';
import { formatBytes, formatUptime, pct } from '@/lib/format';
import MiniBar from './mini-bar';

const STATUS_COLOR: Record<string, string> = {
  online:  'var(--accent)',
  running: 'var(--accent)',
  stopped: 'var(--muted)',
  offline: 'var(--danger)',
};

export default function ProxmoxPanel() {
  const { nodes, loading, error, lastUpdate } = useProxmox(15000);

  if (loading) return (
    <div style={{ color: 'var(--muted)', fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '24px', textAlign: 'center' }}>
      {'>'} conectando con proxmox...
    </div>
  );

  if (error) return (
    <div style={{ color: 'var(--danger)', fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '24px' }}>
      ❌ {error}
    </div>
  );

  return (
    <div style={{ fontFamily: 'var(--font-mono)' }}>
      {nodes.map(node => (
        <div key={node.name} style={{ marginBottom: '16px' }}>

          {/* Node header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: STATUS_COLOR[node.status] || 'var(--muted)',
              boxShadow: `0 0 6px ${STATUS_COLOR[node.status] || 'var(--muted)'}`,
            }} />
            <span style={{ color: 'var(--text)', fontSize: '12px', fontWeight: '600', flex: 1 }}>
              {node.name}
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '10px' }}>
              up {formatUptime(node.uptime)}
            </span>
            <span style={{
              fontSize: '9px', padding: '2px 7px', borderRadius: '3px',
              background: node.status === 'online' ? 'rgba(0,229,176,0.1)' : 'rgba(244,63,94,0.1)',
              color: STATUS_COLOR[node.status] || 'var(--muted)',
              border: `1px solid ${STATUS_COLOR[node.status]}33`,
              letterSpacing: '0.5px',
            }}>
              {node.status.toUpperCase()}
            </span>
          </div>

          {/* Node metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
            {[
              { label: 'CPU', used: Math.round(node.cpu * 100), total: 100, display: `${Math.round(node.cpu * 100)}%` },
              { label: 'RAM', used: node.mem, total: node.maxmem, display: `${formatBytes(node.mem)} / ${formatBytes(node.maxmem)}` },
              { label: 'DISK', used: node.disk, total: node.maxdisk, display: `${formatBytes(node.disk)} / ${formatBytes(node.maxdisk)}` },
            ].map(metric => (
              <div key={metric.label} style={{
                padding: '8px 10px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                borderRadius: '5px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '9px', letterSpacing: '1px' }}>{metric.label}</span>
                  <span style={{ color: 'var(--text)', fontSize: '10px' }}>{metric.display}</span>
                </div>
                <MiniBar value={metric.used} max={metric.total} />
              </div>
            ))}
          </div>

          {/* Containers */}
          {node.containers.length > 0 && (
            <div>
              <div style={{ color: 'var(--muted)', fontSize: '9px', letterSpacing: '1.5px', marginBottom: '6px', paddingLeft: '2px' }}>
                LXC CONTAINERS ({node.containers.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {node.containers.map(ct => (
                  <div key={ct.vmid} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '7px 10px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    borderRadius: '5px',
                  }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                      background: STATUS_COLOR[ct.status] || 'var(--muted)',
                    }} />
                    <span style={{ color: 'var(--text)', fontSize: '11px', flex: 1 }}>{ct.name}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '10px' }}>#{ct.vmid}</span>
                    {ct.status === 'running' && (
                      <>
                        <span style={{ color: 'var(--muted)', fontSize: '10px' }}>
                          CPU {Math.round(ct.cpu * 100)}%
                        </span>
                        <span style={{ color: 'var(--muted)', fontSize: '10px' }}>
                          RAM {formatBytes(ct.mem)}
                        </span>
                        <span style={{ color: 'var(--muted)', fontSize: '10px' }}>
                          up {formatUptime(ct.uptime)}
                        </span>
                      </>
                    )}
                    <span style={{
                      fontSize: '9px', padding: '1px 6px', borderRadius: '3px',
                      background: ct.status === 'running' ? 'rgba(0,229,176,0.08)' : 'rgba(255,255,255,0.04)',
                      color: STATUS_COLOR[ct.status] || 'var(--muted)',
                      letterSpacing: '0.5px',
                    }}>
                      {ct.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {lastUpdate && (
        <div style={{ color: 'var(--muted)', fontSize: '10px', marginTop: '8px', textAlign: 'right' }}>
          actualizado {lastUpdate.toLocaleTimeString('es-AR', { hour12: false })} · refresca c/15s
        </div>
      )}
    </div>
  );
}
