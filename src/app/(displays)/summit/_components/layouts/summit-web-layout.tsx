import type { PropsWithChildren } from 'react';

const SummitWebLayout = ({ children }: PropsWithChildren) => {
  return <div className="flex min-h-screen flex-col bg-background text-foreground">{children}</div>;
};

export default SummitWebLayout;
