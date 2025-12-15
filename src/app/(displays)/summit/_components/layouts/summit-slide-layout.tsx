import type { PropsWithChildren } from 'react';

const SummitSlideLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background text-foreground">
      <div
        className="flex h-full max-h-full w-full max-w-full items-stretch justify-stretch"
        style={{ aspectRatio: '32 / 9' }}
      >
        {children}
      </div>
    </div>
  );
};

export default SummitSlideLayout;
