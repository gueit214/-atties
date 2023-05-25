'use client';
import Layout from '@components/common/Layout';
import { getLocalStorage } from '@utils/localStorage/helper';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  if (getLocalStorage('isVisited')) {
    router.replace('/auth/login');
  } else {
    router.replace('/begin');
  }

  return <Layout></Layout>;
}
