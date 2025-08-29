
import './globals.css';
import type { Metadata } from 'next';
import { useEffect } from 'react';

export const metadata: Metadata = {
  title: process.env.BRAND_NAME || 'Tropic Canna Menu',
  description: 'Live menu with Weedmaps checkout link',
  manifest: '/manifest.webmanifest', // Next will map app/manifest.ts
  themeColor: '#FF6DAE'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script dangerouslySetInnerHTML={{__html:`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(()=>{});
            });
          }
        `}} />
      </body>
    </html>
  );
}
