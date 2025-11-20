import type { PropsWithChildren } from 'react';

const SummitSlideLayout = ({ children }: PropsWithChildren) => {
  return <div className="bg-background flex flex-col h-full text-foreground w-full">{children}</div>;
};

export default SummitSlideLayout;

