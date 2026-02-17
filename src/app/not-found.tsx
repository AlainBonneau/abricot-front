'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: 'calc(100vh - 78px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '96px', fontWeight: 'bold' }}>404</h1>

      <p style={{ fontSize: '18px', color: '#666' }}>Oups… cette page n’existe pas.</p>

      <Link
        href="/"
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--color-orange)',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'opacity 0.2s ease',
        }}
      >
        Revenir à l’accueil
      </Link>
    </section>
  );
}
