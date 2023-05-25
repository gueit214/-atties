import type { Metadata } from 'next';

import './global.css';

import store from '@features/store';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Loader from '@components/common/Loader';
import GoogleScript from '@components/GoogleScript';
import React, { Suspense } from 'react';
import CheckLayout from './checkLayout';

const persistor = persistStore(store);

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
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        useErrorBoundary: true,
      },
      mutations: { retry: false, useErrorBoundary: true },
    },
  });

  return (
    <html lang="ko">
      <body className="flex h-screen w-screen justify-center bg-slate-50">
        <GoogleScript />
        <CheckLayout />
        {/* <Suspense fallback={<Loader />}> */}
        {/* <Provider store={store}> */}
        {/* <QueryClientProvider client={queryClient}> */}
        <main className="relative h-full w-full max-w-[26.25rem] overflow-y-scroll bg-white px-[1.5rem]">
          {children}
        </main>
        {/* </QueryClientProvider> */}
        {/* </Provider> */}
        {/* </Suspense> */}
      </body>
    </html>
  );
}
