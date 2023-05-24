import HomePage from './home-page';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Atties',
  description: 'Welcome to Atties',
};

export default async function Page() {
  return <HomePage />;
}
