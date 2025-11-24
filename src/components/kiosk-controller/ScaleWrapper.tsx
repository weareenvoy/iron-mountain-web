'use client';
import React from 'react';

type Props = {
  background?: string;
  children: React.ReactNode;
  targetHeight: number;
  targetWidth: number;
};

export default function ScaleWrapper({ background = 'black', children, targetHeight, targetWidth }: Props) {
  const scale = 0.415;

  const outerStyle: React.CSSProperties = {
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    background,
    padding: '32px 0',
  };

  const innerStyle: React.CSSProperties = {
    width: `${targetWidth}px`,
    height: `${targetHeight}px`,
    willChange: 'transform',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>{children}</div>
    </div>
  );
}
