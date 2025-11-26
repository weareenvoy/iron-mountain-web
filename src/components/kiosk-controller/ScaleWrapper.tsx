'use client';
import React from 'react';

type Props = {
  targetWidth: number;
  targetHeight: number;
  children: React.ReactNode;
  background?: string;
};

export default function ScaleWrapper({ targetWidth, targetHeight, children, background = 'black' }: Props) {
  const scale = 0.415;

  const outerStyle: React.CSSProperties = {
    width: '100vw',
    display: 'grid',
    placeItems: 'center',
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
