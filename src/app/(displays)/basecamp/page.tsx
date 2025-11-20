'use client';

import Background from './_components/ui/Background';
import Foreground from './_components/ui/Foreground';

const BasecampPage = ({}: PageProps<'/basecamp'>) => {
  return (
    <div className="bg-primary-bg-grey relative flex h-[720px] w-[3840px] flex-col items-center overflow-hidden">
      {/* Foreground content */}
      <Foreground />
      {/* Background videos */}
      <Background />
    </div>
  );
};

export default BasecampPage;
