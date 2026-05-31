export default function OverviewPage() {
  const cards = [
    { label: 'SERVICIOS ACTIVOS', value: '--', sub: 'cargando...', color: 'var(--accent)' },
    { label: 'CPU PROMEDIO',      value: '--', sub: 'cargando...', color: 'var(--accent2)' },
    { label: 'RAM USADA',         value: '--', sub: 'cargando...', color: 'var(--warn)' },
    { label: 'RED TOTAL',         value: '--', sub: 'cargando...', color: 'var(--accent)' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '2px', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
          INFRAESTRUCTURA / OVERVIEW
        </div>
        <h1 style={{ color: 'var(--text)', fontSize: '20px', fontWeight: '500', fontFamily: 'var(--font-sans)' }}>
          Estado general
        </h1>
      </div>

      {/* Summary cards */}
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
            <div style={{ color: 'var(--muted)', fontSize: '11px' }}>{card.sub}</div>
            <div style={{ marginTop: '10px', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
              <div style={{ width: '0%', height: '100%', background: card.color, borderRadius: '2px' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {['Nodos Proxmox', 'Contenedores Docker', 'Servicios & Tunnels', 'Alertas recientes'].map(panel => (
          <div key={panel} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '16px',
            minHeight: '180px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '1.5px', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
              {panel.toUpperCase()}
            </div>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--muted)', fontSize: '12px', fontFamily: 'var(--font-mono)',
              border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '6px',
            }}>
              {'>'} Sprint 3 — datos reales
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
