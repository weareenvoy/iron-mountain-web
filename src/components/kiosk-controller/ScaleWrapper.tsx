'use client';
import React from 'react';

type Props = {
  targetWidth: number;
  targetHeight: number;
  children: React.ReactNode;
  background?: string;
};

export default function ScaleWrapper({ targetWidth, targetHeight, children, background = 'black' }: Props) {
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    function update() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const s = Math.min(w / targetWidth, h / targetHeight, 1);
      setScale(s);
    }

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [targetWidth, targetHeight]);

  const outerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    display: 'grid',
    placeItems: 'center',
    overflow: 'hidden',
    background,
  };

  const innerStyle: React.CSSProperties = {
    width: `${targetWidth}px`,
    height: `${targetHeight}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    willChange: 'transform',
  };

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        {children}
      </div>
    </div>
  );
}
