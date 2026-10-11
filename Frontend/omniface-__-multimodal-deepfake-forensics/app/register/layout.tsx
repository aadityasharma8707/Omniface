import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register // OmniFace Forensic Intelligence',
  description: 'Create an investigator account on the OmniFace deepfake detection and media integrity network.',
  alternates: {
    canonical: '/register',
  },
  openGraph: {
    title: 'Register // OmniFace Forensic Intelligence',
    description: 'Create an investigator account on the OmniFace deepfake detection and media integrity network.',
    url: '/register',
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
