import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wehifz - Mémorisez le Coran ensemble',
  description: 'Application de mémorisation du Coran avec des défis personnalisés, un suivi de progression et une communauté engagée.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
