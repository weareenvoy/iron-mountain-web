import type { PropsWithChildren } from 'react';

const SummitSlideLayout = ({ children }: PropsWithChildren) => {
  return <div className="flex h-full w-full flex-col bg-background text-foreground">{children}</div>;
};

export default SummitSlideLayout;
