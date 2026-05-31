'use client';

import { useDocker } from '@/lib/hooks/useDocker';
import { formatBytes } from '@/lib/format';
import Link from 'next/link';

export default function DockerSummary() {
  const { containers, loading, error } = useDocker(20000);
  const running = containers.filter(c => c.state === 'running');
  const stopped = containers.filter(c => c.state !== 'running');
  const totalCpu = running.reduce((acc, c) => acc + (c.stats?.cpu_pct ?? 0), 0);
  const totalMem = running.reduce((acc, c) => acc + (c.stats?.mem_used ?? 0), 0);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-mono)', padding: '24px' }}>
        {'>'} conectando...
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{error}</div>;
  }

  const topContainers = [...running]
    .sort((a, b) => (b.stats?.mem_used ?? 0) - (a.stats?.mem_used ?? 0))
    .slice(0, 4);

  return (
    <div style={{ fontFamily: 'var(--font-mono)' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {[
          { label: 'RUNNING', value: running.length, color: 'var(--accent)' },
          { label: 'STOPPED', value: stopped.length, color: 'var(--muted)' },
          { label: 'TOTAL',   value: containers.length, color: 'var(--text)' },
        ].map(card => (
          <div key={card.label} style={{
            padding: '10px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '22px', fontWeight: '600', color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '9px', letterSpacing: '1px', marginTop: '2px', color: 'var(--muted)' }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
        <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '6px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '1px', marginBottom: '4px', color: 'var(--muted)' }}>CPU TOTAL</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--accent2)' }}>{totalCpu.toFixed(1)}%</div>
        </div>
        <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '6px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '1px', marginBottom: '4px', color: 'var(--muted)' }}>RAM TOTAL</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--accent)' }}>{formatBytes(totalMem)}</div>
        </div>
      </div>

      <div style={{ fontSize: '9px', letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: '6px' }}>TOP CONTENEDORES</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
        {topContainers.map(c => (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 10px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: '5px',
          }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: 'var(--text)', flex: 1 }}>{c.name}</span>
            <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{(c.stats?.cpu_pct ?? 0).toFixed(1)}%</span>
            <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{formatBytes(c.stats?.mem_used ?? 0)}</span>
          </div>
        ))}
      </div>

      <Link href="/dashboard/containers" style={{
        display: 'block', textAlign: 'center', padding: '7px', borderRadius: '5px',
        border: '1px solid var(--border)', color: 'var(--muted)', fontSize: '11px',
        fontFamily: 'var(--font-mono)', textDecoration: 'none',
      }}>
        {'>'} ver todos los contenedores
      </Link>
    </div>
  );
}
