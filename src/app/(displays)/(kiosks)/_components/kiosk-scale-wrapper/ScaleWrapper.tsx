'use client';

import type { CSSProperties, ReactNode } from 'react';

type Props = {
  readonly background?: string;
  readonly children: ReactNode;
  readonly targetHeight: number;
  readonly targetWidth: number;
};

const ScaleWrapper = ({ background = 'black', children, targetHeight, targetWidth }: Props) => {
  // const scale = 0.415;
  const scale = 1;
  // For dev in chrome current value is 0.415. Remove for production.

  // This file scales the build down to a size that is compatible with xScope when screenshots of Figma are taken at 10% zoom. For context it is compatible when the 0.415 scale is used and the custom Kiosk viewport is 2160x5120 at 50% zoom.

  const innerStyle: CSSProperties = {
    '--scale': scale,
    '--target-height': `${targetHeight}px`,
    '--target-width': `${targetWidth}px`,
    'height': 'var(--target-height)',
    'transform': 'scale(var(--scale))',
    'transformOrigin': 'top left',
    'width': 'var(--target-width)',
    'willChange': 'transform',
  } as CSSProperties;

  return (
    <div
      className="grid w-screen place-items-center"
      style={{ '--background': background, 'background': 'var(--background)' } as CSSProperties}
    >
      <div style={innerStyle}>{children}</div>
    </div>
  );
};

export default ScaleWrapper;
