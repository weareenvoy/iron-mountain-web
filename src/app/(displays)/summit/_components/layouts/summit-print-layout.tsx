import type { PropsWithChildren } from 'react';

const SummitPrintLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <div className="mx-auto flex w-full max-w-[7.8in] flex-col gap-4 px-5 py-5">{children}</div>
    </div>
  );
};

export default SummitPrintLayout;
