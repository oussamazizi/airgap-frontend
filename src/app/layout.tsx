import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AirGap Packager',
  description: 'Créer des bundles offline (docker/host) en 1 clic.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}