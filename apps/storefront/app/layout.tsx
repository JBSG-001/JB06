import type { Metadata } from 'next';
import './globals.css';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CurrencyProvider } from '@/lib/currency';
import { CartProvider } from '@/lib/cart';
import { TelemetryTracker } from '@/components/TelemetryTracker';

export const metadata: Metadata = {
  title: 'JBØ6 ATELIER — Minimalist Luxury Footwear & Garments',
  description:
    'High-fidelity minimalist streetwear engineered with disciplined tailoring, dual-monetary transparency, and limited generational capsules.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111] antialiased">
        <CurrencyProvider>
          <CartProvider>
            <TelemetryTracker />
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
