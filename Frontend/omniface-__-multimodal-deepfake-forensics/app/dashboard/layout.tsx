import type { Metadata } from 'next';
import DashboardClientShell from './DashboardClientShell';

export const metadata: Metadata = {
  title: 'Forensic Console // OmniFace Deepfake Analysis',
  description: 'OmniFace Multimodal Neural Forensics Console — Deepfake verification, bio-rPPG pulse extraction, and synthetic media detection.',
  alternates: {
    canonical: '/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardClientShell>{children}</DashboardClientShell>;
}
