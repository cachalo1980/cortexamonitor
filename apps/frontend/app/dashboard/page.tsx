'use client';

import { useProxmox } from '@/lib/hooks/useProxmox';
import { useDocker } from '@/lib/hooks/useDocker';
import { useCloudflare } from '@/lib/hooks/useCloudflare';
import { useAlerts } from '@/lib/hooks/useAlerts';
import { formatBytes, pct } from '@/lib/format';
import ProxmoxPanel from '@/components/dashboard/proxmox-panel';
import DockerPanel from '@/components/dashboard/docker-panel';
import CloudflarePanel from '@/components/dashboard/cloudflare-panel';
import AlertsPanel from '@/components/dashboard/alerts-panel';
import MiniBar from '@/components/dashboard/mini-bar';

function SummaryCards() {
  const { nodes, loading: pLoading } = useProxmox(15000);
  const { containers, loading: dLoading } = useDocker(20000);
  const { health, loading: cLoading } = useCloudflare(30000);
  const { unresolved, loading: aLoading } = useAlerts(30000);

  const node = nodes[0];
  const cpuPct = node ? Math.round(node.cpu * 100) : 0;
  const ramPct = node ? pct(node.mem, node.maxmem) : 0;
  const runningContainers = containers.filter(c => c.state === 'running').length;
  const upServices = health.filter(h => h.status === 'up').length;

  const cards = [
    {
      label: 'CPU NODO',
      value: pLoading ? '--' : `${cpuPct}%`,
      sub: pLoading ? 'cargando...' : `${node?.maxcpu || 0} cores · ${node?.name || ''}`,
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
    {
      label: 'ALERTAS ACTIVAS',
      value: aLoading ? '--' : `${unresolved.length}`,
      sub: aLoading ? 'cargando...' : unresolved.length === 0 ? 'todo ok' : `${unresolved.filter(a => a.severity === 'CRITICAL').length} criticas`,
      color: unresolved.length === 0 ? 'var(--accent)' : unresolved.some(a => a.severity === 'CRITICAL') ? 'var(--danger)' : 'var(--warn)',
      bar: 0,
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
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '1.5px', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            NODOS PROXMOX
          </div>
          <ProxmoxPanel />
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '1.5px', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            CONTENEDORES DOCKER
          </div>
          <DockerPanel />
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '1.5px', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            SERVICIOS & TUNNELS
          </div>
          <CloudflarePanel />
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '1.5px', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            ALERTAS RECIENTES
          </div>
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
}
