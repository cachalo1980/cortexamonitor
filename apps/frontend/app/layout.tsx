import type { Metadata } from 'next';
import './globals.css';
import AuthSessionProvider from '@/components/layout/session-provider';

export const metadata: Metadata = {
  title: 'CortexaMonitor',
  description: 'Dashboard de monitoreo interno — Cortexacloud',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
