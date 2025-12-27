import { type ReactElement, type ReactNode } from 'react';

export type Slide = {
  readonly id: string;
  readonly render: () => ReactElement;
  readonly title: string;
};

export type SlideNavHandlers = {
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
};

export const SectionSlide = ({ children }: { readonly children: ReactNode }) => (
  <div className="h-screen w-full flex-shrink-0">{children}</div>
);
