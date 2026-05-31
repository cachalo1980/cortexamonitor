'use client'

import ProxmoxPanel from '@/components/dashboard/proxmox-panel';

export default function Page() {
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
          INFRAESTRUCTURA / PROXMOX
        </div>
        <h1 style={{
          color: 'var(--text)',
          fontSize: '20px',
          fontWeight: 500,
          fontFamily: 'var(--font-sans)'
        }}>
          Nodos Proxmox VE
        </h1>
      </div>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <ProxmoxPanel />
      </div>
    </div>
  );
}
