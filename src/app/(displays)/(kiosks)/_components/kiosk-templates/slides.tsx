import { type ReactElement, type ReactNode } from 'react';

export type Slide = {
  readonly id: string;
  readonly render: (isActive: boolean) => ReactElement;
  readonly title: string;
};

export type SlideNavHandlers = {
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
};

export const SectionSlide = ({ children, isActive }: { readonly children: ReactNode; readonly isActive: boolean }) => (
  <div className="h-screen w-full flex-shrink-0" data-active={isActive}>
    {children}
  </div>
);
