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
  <div className="h-screen w-full flex-shrink-0" data-active={isActive}>
    {children}
  </div>
);
