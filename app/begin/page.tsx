import { Metadata } from 'next';
import BeginPage from './begin-page';
export const metadata: Metadata = {
  title: 'Atties',
  description: 'Welcome to Atties',
};

export default async function Page() {
  return <BeginPage />;
}
