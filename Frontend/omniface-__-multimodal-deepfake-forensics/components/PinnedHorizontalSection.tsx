'use client';

import VerticalSectionsFlow from '@/components/VerticalSectionsFlow';

interface PinnedHorizontalSectionProps {
  onScrollTo?: (id: string) => void;
}

export default function PinnedHorizontalSection({ onScrollTo }: PinnedHorizontalSectionProps) {
  return <VerticalSectionsFlow onScrollTo={onScrollTo} />;
}
