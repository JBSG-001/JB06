import type { Metadata } from 'next';
import './globals.css';
import { ConsoleAuthProvider } from '@/lib/auth-context';
import { ConsoleSidebar } from '@/components/ConsoleSidebar';

export const metadata: Metadata = {
  title: 'JBØ6 ADMIN — Atelier Operations & ERP',
  description: 'Operations console, live storefront spectator, inventory management and fulfillment.',
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
      <body className="min-h-screen bg-[#FAFAF8] text-[#111111] antialiased flex">
        <ConsoleAuthProvider>
          <ConsoleSidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {children}
          </div>
        </ConsoleAuthProvider>
      </body>
    </html>
  );
}
