'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const BOOT_LINES = [
  '> cortexamonitor v1.0.0',
  '> initializing subsystems...',
  '> proxmox_api        [OK]',
  '> docker_socket      [OK]',
  '> cloudflare_tunnel  [OK]',
  '> auth_module        [READY]',
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setBootLines(prev => [...prev, BOOT_LINES[i]]);
      i++;
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => setBootDone(true), 400);
      }
    }, 180);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) {
      setError('AUTH_FAILED: credenciales inválidas');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      fontFamily: 'var(--font-mono)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(0,229,176,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,176,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Scanline */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(0,229,176,0.08), transparent)',
        animation: 'scanline 6s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Left panel — boot terminal */}
      <div style={{
        width: '42%',
        borderRight: '1px solid var(--border)',
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'var(--bg2)',
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
            <div style={{
              width: '32px', height: '32px',
              border: '1px solid var(--accent)',
              borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                width: '10px', height: '10px', background: 'var(--accent)',
                borderRadius: '50%',
                boxShadow: '0 0 12px var(--accent)',
              }} />
            </div>
            <div>
              <div style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>
                CortexaMonitor
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '1px' }}>
                INFRASTRUCTURE · INTERNAL
              </div>
            </div>
          </div>

          {/* Boot terminal */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '20px',
            minHeight: '180px',
          }}>
            <div style={{ color: 'var(--muted)', fontSize: '10px', marginBottom: '12px', letterSpacing: '1px' }}>
              SYSTEM BOOT LOG
            </div>
            {bootLines.map((line, i) => (
              <div key={i} style={{
                color: line.includes('[OK]') ? 'var(--accent)'
                  : line.includes('[READY]') ? '#00b8d9'
                  : 'var(--text)',
                fontSize: '12px',
                lineHeight: '1.8',
                opacity: 0,
                animation: `fadeUp 0.3s ease ${i * 0.18}s forwards`,
              }}>
                {line}
              </div>
            ))}
            {bootDone && (
              <div style={{
                color: 'var(--accent)', fontSize: '12px', marginTop: '4px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ animation: 'blink 1s infinite' }}>█</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div style={{ color: 'var(--muted)', fontSize: '11px', lineHeight: '1.8' }}>
          <div>NODE: pve-node-01 · pve-node-02</div>
          <div>TUNNEL: cloudflare · active</div>
          <div style={{ marginTop: '8px', color: '#2d3748' }}>
            © {new Date().getFullYear()} Cortexacloud
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <div className="animate-fade-up">
            <div style={{ color: 'var(--muted)', fontSize: '11px', letterSpacing: '2px', marginBottom: '8px' }}>
              AUTENTICACION REQUERIDA
            </div>
            <h1 style={{ color: 'var(--text)', fontSize: '24px', fontWeight: '500', marginBottom: '32px', fontFamily: 'var(--font-sans)' }}>
              Acceso al sistema
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="animate-fade-up-delay">
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '10px', letterSpacing: '1.5px', marginBottom: '8px' }}>
                IDENTIFICADOR
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@cortexacloud.com"
                required
                style={{
                  width: '100%',
                  background: 'var(--surface)',
                  border: '1px solid var(--border2)',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  color: 'var(--text)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '10px', letterSpacing: '1.5px', marginBottom: '8px' }}>
                CLAVE DE ACCESO
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  background: 'var(--surface)',
                  border: '1px solid var(--border2)',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  color: 'var(--text)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(244,63,94,0.07)',
                border: '1px solid rgba(244,63,94,0.2)',
                borderLeft: '3px solid var(--danger)',
                borderRadius: '6px',
                padding: '10px 14px',
                color: 'var(--danger)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                marginBottom: '20px',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'rgba(0,229,176,0.15)' : 'var(--accent)',
                color: loading ? 'var(--accent)' : '#080a0f',
                border: loading ? '1px solid var(--accent)' : 'none',
                borderRadius: '6px',
                padding: '13px',
                fontSize: '12px',
                fontWeight: '600',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {loading ? '> verificando...' : '> INGRESAR'}
            </button>
          </form>

          <div className="animate-fade-up-delay2" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--muted)', fontSize: '11px', lineHeight: '1.8' }}>
              <div>SESSION · JWT · ENCRYPTED</div>
              <div>ACCESO RESTRINGIDO · SOLO USO INTERNO</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
