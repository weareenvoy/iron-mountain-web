import type { PropsWithChildren } from 'react';

const SummitWebLayout = ({ children }: PropsWithChildren) => {
  return <div className="bg-background flex flex-col min-h-screen text-foreground">{children}</div>;
};

export default SummitWebLayout;

