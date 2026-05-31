'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/dashboard',            label: 'Overview',    icon: '▣' },
  { href: '/dashboard/proxmox',    label: 'Proxmox',     icon: '◈' },
  { href: '/dashboard/containers', label: 'Containers',  icon: '⬡' },
  { href: '/dashboard/services',   label: 'Services',    icon: '◎' },
  { href: '/dashboard/cloudflare', label: 'Cloudflare',  icon: '◌' },
  { href: '/dashboard/alerts',     label: 'Alertas',     icon: '◬' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: '#0d1117',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-mono)',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px',
            border: '1px solid var(--accent)',
            borderRadius: '5px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '8px', height: '8px',
              background: 'var(--accent)',
              borderRadius: '50%',
              boxShadow: '0 0 8px var(--accent)',
            }} />
          </div>
          <div>
            <div style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: '600', letterSpacing: '1.5px' }}>
              CORTEXA
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '9px', letterSpacing: '1px' }}>
              MONITOR
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        <div style={{ padding: '0 12px', marginBottom: '4px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '9px', letterSpacing: '1.5px', padding: '8px 8px 4px' }}>
            NAVEGACION
          </div>
        </div>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 20px',
                margin: '1px 8px',
                borderRadius: '6px',
                background: active ? 'rgba(0,229,176,0.08)' : 'transparent',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                color: active ? 'var(--accent)' : 'var(--muted)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: '14px', opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid var(--border)',
      }}>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '8px',
            color: 'var(--muted)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            letterSpacing: '1px',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.borderColor = 'var(--danger)';
            (e.target as HTMLButtonElement).style.color = 'var(--danger)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.borderColor = 'var(--border)';
            (e.target as HTMLButtonElement).style.color = 'var(--muted)';
          }}
        >
          {'>'} CERRAR SESION
        </button>
      </div>
    </aside>
  );
}
