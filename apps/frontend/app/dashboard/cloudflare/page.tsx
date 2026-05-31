'use client';

import CloudflarePanel from '@/components/dashboard/cloudflare-panel';

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
          INFRAESTRUCTURA / CLOUDFLARE
        </div>
        <h1 style={{
          color: 'var(--text)',
          fontSize: '20px',
          fontWeight: 500,
          fontFamily: 'var(--font-sans)'
        }}>
          Cloudflare Tunnel
        </h1>
      </div>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <CloudflarePanel />
      </div>
    </div>
  );
}
