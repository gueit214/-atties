import { Metadata } from 'next';
import HomePage from './home-page';
export const metadata: Metadata = {
  title: 'Atties',
  description: 'Welcome to Atties',
};

export default async function Page() {
  return <HomePage />;
}
