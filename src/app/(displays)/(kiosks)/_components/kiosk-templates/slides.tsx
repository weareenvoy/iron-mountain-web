import { type ReactElement, type ReactNode } from 'react';

export type Slide = Readonly<{
  id: string;
  render: (isActive: boolean) => ReactElement;
  title: string;
}>;

export type SlideNavHandlers = Readonly<{
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
}>;

export const SectionSlide = ({ children, isActive }: Readonly<{ children: ReactNode; isActive: boolean }>) => (
  <div
    className="absolute inset-0 flex h-full w-full flex-col items-center justify-center transition-opacity duration-300"
    data-active={isActive}
    style={{
      opacity: isActive ? 1 : 0,
      pointerEvents: isActive ? 'auto' : 'none',
      visibility: isActive ? 'visible' : 'hidden',
    }}
  >
    {children}
  </div>
);
