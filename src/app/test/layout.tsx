import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-scheduler test',
  description: 'react-scheduler test',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
