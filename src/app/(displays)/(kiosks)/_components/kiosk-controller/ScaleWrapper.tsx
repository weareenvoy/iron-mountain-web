'use client';

import type { CSSProperties, ReactNode } from 'react';

type Props = {
  readonly background?: string;
  readonly children: ReactNode;
  readonly targetHeight: number;
  readonly targetWidth: number;
};

const ScaleWrapper = ({ background = 'black', children, targetHeight, targetWidth }: Props) => {
  const scale = 0.415;
  // const scale = 1;
  // For dev in chrome current value is 0.415. Remove for production.

  const innerStyle: CSSProperties = {
    height: `${targetHeight}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${targetWidth}px`,
    willChange: 'transform',
  };

  return (
    <div className="grid w-screen place-items-center" style={{ background }}>
      <div style={innerStyle}>{children}</div>
    </div>
  );
};

export default ScaleWrapper;
