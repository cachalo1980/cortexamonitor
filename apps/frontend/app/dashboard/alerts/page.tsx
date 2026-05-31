'use client';

import AlertsPanel from '@/components/dashboard/alerts-panel';

export default function AlertsPage() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--muted)',
          letterSpacing: '2px',
          marginBottom: '4px'
        }}>
          INFRAESTRUCTURA / ALERTS
        </div>
        <h1 style={{
          color: 'var(--text)',
          fontSize: '20px',
          fontWeight: 500,
          fontFamily: 'var(--font-sans)'
        }}>
          Alertas del sistema
        </h1>
      </div>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <AlertsPanel />
      </div>
    </div>
  );
}
