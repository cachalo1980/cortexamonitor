'use client';

import { useProxmox } from '@/lib/hooks/useProxmox';
import { useDocker } from '@/lib/hooks/useDocker';
import { formatBytes, pct } from '@/lib/format';
import ProxmoxPanel from '@/components/dashboard/proxmox-panel';
import DockerPanel from '@/components/dashboard/docker-panel';
import MiniBar from '@/components/dashboard/mini-bar';

function SummaryCards() {
  const { nodes, loading: pLoading } = useProxmox(15000);
  const { containers, loading: dLoading } = useDocker(20000);

  const node = nodes[0];
  const cpuPct = node ? Math.round(node.cpu * 100) : 0;
  const ramPct = node ? pct(node.mem, node.maxmem) : 0;
  const runningContainers = containers.filter(c => c.state === 'running').length;

  const cards = [
    {
      label: 'NODOS ONLINE',
      value: pLoading ? '--' : `${nodes.filter(n => n.status === 'online').length}/${nodes.length}`,
      sub: pLoading ? 'cargando...' : 'proxmox cluster',
      color: 'var(--accent)',
      bar: pLoading ? 0 : pct(nodes.filter(n => n.status === 'online').length, nodes.length),
    },
    {
      label: 'CPU NODO',
      value: pLoading ? '--' : `${cpuPct}%`,
      sub: pLoading ? 'cargando...' : `${node?.maxcpu || 0} cores`,
      color: cpuPct > 85 ? 'var(--danger)' : cpuPct > 65 ? 'var(--warn)' : 'var(--accent2)',
      bar: cpuPct,
    },
    {
      label: 'RAM USADA',
      value: pLoading ? '--' : `${ramPct}%`,
      sub: pLoading ? 'cargando...' : `${formatBytes(node?.mem || 0)} / ${formatBytes(node?.maxmem || 0)}`,
      color: ramPct > 85 ? 'var(--danger)' : ramPct > 65 ? 'var(--warn)' : 'var(--accent)',
      bar: ramPct,
    },
    {
      label: 'DOCKER',
      value: dLoading ? '--' : `${runningContainers}/${containers.length}`,
      sub: dLoading ? 'cargando...' : `${containers.length - runningContainers} detenidos`,
      color: 'var(--accent2)',
      bar: dLoading ? 0 : pct(runningContainers, containers.length),
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

        {/* Docker panel */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '1.5px', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            CONTENEDORES DOCKER
          </div>
          <DockerPanel />
        </div>

        {/* Placeholders Sprint 5+ */}
        {['SERVICIOS & TUNNELS', 'ALERTAS RECIENTES'].map(panel => (
          <div key={panel} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '16px',
            minHeight: '120px',
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
            }}>
              {'>'} Sprint 5 — datos reales
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
