import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/auth';
import LandingPage from './landing/page';

export default async function HomePage() {
  const user = await verifySession();

  if (user) {
    redirect('/dashboard');
  }

  return <LandingPage />;
}
