'use client';

import { useProxmox } from '@/lib/hooks/useProxmox';
import { formatBytes, pct } from '@/lib/format';
import ProxmoxPanel from '@/components/dashboard/proxmox-panel';
import MiniBar from '@/components/dashboard/mini-bar';

function SummaryCards() {
  const { nodes, loading } = useProxmox(15000);

  const node = nodes[0];
  const totalContainers = nodes.reduce((acc, n) => acc + n.containers.length, 0);
  const runningContainers = nodes.reduce((acc, n) => acc + n.containers.filter(c => c.status === 'running').length, 0);
  const cpuPct = node ? Math.round(node.cpu * 100) : 0;
  const ramPct = node ? pct(node.mem, node.maxmem) : 0;

  const cards = [
    {
      label: 'CONTENEDORES',
      value: loading ? '--' : `${runningContainers}/${totalContainers}`,
      sub: loading ? 'cargando...' : `${totalContainers - runningContainers} detenidos`,
      color: 'var(--accent)',
      bar: loading ? 0 : pct(runningContainers, totalContainers),
    },
    {
      label: 'CPU NODO',
      value: loading ? '--' : `${cpuPct}%`,
      sub: loading ? 'cargando...' : `${node?.maxcpu || 0} cores`,
      color: cpuPct > 85 ? 'var(--danger)' : cpuPct > 65 ? 'var(--warn)' : 'var(--accent2)',
      bar: cpuPct,
    },
    {
      label: 'RAM USADA',
      value: loading ? '--' : `${ramPct}%`,
      sub: loading ? 'cargando...' : `${formatBytes(node?.mem || 0)} / ${formatBytes(node?.maxmem || 0)}`,
      color: ramPct > 85 ? 'var(--danger)' : ramPct > 65 ? 'var(--warn)' : 'var(--accent)',
      bar: ramPct,
    },
    {
      label: 'NODOS ONLINE',
      value: loading ? '--' : `${nodes.filter(n => n.status === 'online').length}/${nodes.length}`,
      sub: loading ? 'cargando...' : 'proxmox cluster',
      color: 'var(--accent)',
      bar: loading ? 0 : pct(nodes.filter(n => n.status === 'online').length, nodes.length),
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
      {cards.map(card => (
        <div key={card.label} style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'var(--font-mono)',
        }}>
          <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '1px', marginBottom: '10px' }}>
            {card.label}
          </div>
          <div style={{ color: card.color, fontSize: '28px', fontWeight: '600', lineHeight: 1, marginBottom: '6px' }}>
            {card.value}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '11px', marginBottom: '10px' }}>{card.sub}</div>
          <MiniBar value={card.bar} />
        </div>
      ))}
    </div>
  );
}

export default function OverviewPage() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '2px', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
          INFRAESTRUCTURA / OVERVIEW
        </div>
        <h1 style={{ color: 'var(--text)', fontSize: '20px', fontWeight: '500', fontFamily: 'var(--font-sans)' }}>
          Estado general
        </h1>
      </div>

      <SummaryCards />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Proxmox panel */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '1.5px', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            NODOS PROXMOX
          </div>
          <ProxmoxPanel />
        </div>

        {/* Placeholders Sprint 4+ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['CONTENEDORES DOCKER', 'SERVICIOS & TUNNELS', 'ALERTAS RECIENTES'].map(panel => (
            <div key={panel} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '16px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '1.5px', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                {panel}
              </div>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--muted)', fontSize: '11px', fontFamily: 'var(--font-mono)',
                border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '6px',
                minHeight: '60px',
              }}>
                {'>'} Sprint 4 — datos reales
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
