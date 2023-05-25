import type { Metadata } from 'next';

import './global.css';

export const metadata: Metadata = {
  title: {
    default: 'Atties',
    template: '%s | Atties',
  },
  description: 'Welcome to Atties !',
  openGraph: {
    title: 'Atties',
    description: 'Welcome to Atties !',
    url: 'https://atties.vercel.app',
    siteName: 'Atties',
    images: [
      {
        url: 'https://atties.vercel.app',
        width: 1920,
        height: 1080,
      },
    ],
    locale: 'ko-KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Atties',
    card: 'summary_large_image',
  },
  icons: {
    shortcut: '/static/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex h-screen w-screen justify-center bg-slate-50">
        <main className="relative h-full w-full max-w-[26.25rem] overflow-y-scroll bg-white px-[1.5rem]">
          {children}
        </main>
      </body>
    </html>
  );
}
