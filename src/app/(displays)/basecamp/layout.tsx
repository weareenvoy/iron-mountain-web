'use client';

import { BasecampProvider } from './_components/providers/basecamp';

export default function BasecampLayout({ children }: LayoutProps<'/basecamp'>) {
  return <BasecampProvider>{children}</BasecampProvider>;
}
