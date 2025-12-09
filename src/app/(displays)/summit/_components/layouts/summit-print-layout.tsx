import type { PropsWithChildren } from 'react';

const SummitPrintLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <div className="mx-auto flex w-full max-w-[8.5in] flex-col gap-6 px-10 py-8">{children}</div>
    </div>
  );
};

export default SummitPrintLayout;
