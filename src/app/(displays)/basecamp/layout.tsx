'use client';

import { BasecampProvider } from './_components/providers/basecamp';

const BasecampLayout = ({ children }: LayoutProps<'/basecamp'>) => {
  return <BasecampProvider>{children}</BasecampProvider>;
};

export default BasecampLayout;
