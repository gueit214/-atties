'use client';
import { Router } from 'next/router';
import React, { Suspense, useEffect, useState } from 'react';
import { pageview } from '@utils/gtag';
import { getToken } from '@utils/localStorage/token';
import { useRouter, usePathname } from 'next/navigation';

export default function CheckLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const pathName = usePathname() || '';

  useEffect(() => {
    if (pathName.includes('auth') || pathName === '/begin') return;
    const token = getToken();
    if (!token.accessToken) router.replace('/auth/login');
  }, [router]);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  // useEffect(() => {
  //   const handleRouteChange = (url) => {
  //     pageview(url);
  //   };
  //   router.events.on('routeChangeComplete', handleRouteChange);
  //   router.events.on('hashChangeComplete', handleRouteChange);
  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange);
  //     router.events.off('hashChangeComplete', handleRouteChange);
  //   };
  // }, [router.events]);
  return <div></div>;
}
