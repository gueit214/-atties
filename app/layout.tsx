import type { Metadata } from 'next';

import './global.css';

export const metadata: Metadata = {
  title: 'Atties',
  description: 'Welcome to Atties !',
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
