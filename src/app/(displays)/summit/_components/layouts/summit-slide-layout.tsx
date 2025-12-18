import type { PropsWithChildren } from 'react';

const SummitSlideLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background text-foreground">
      <div className="flex aspect-32/9 h-full max-h-full w-full max-w-full items-stretch justify-stretch">
        {children}
      </div>
    </div>
  );
};

export default SummitSlideLayout;
