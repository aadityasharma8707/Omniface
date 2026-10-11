import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login // OmniFace Forensics Network',
  description: 'Sign in to access the OmniFace decentralized deepfake detection and media integrity forensic workspace.',
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'Login // OmniFace Forensics Network',
    description: 'Sign in to access the OmniFace decentralized deepfake detection and media integrity forensic workspace.',
    url: '/login',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
