import { type ReactElement, type ReactNode } from 'react';

// Defines core slide types, Slide is for all slides, slideNavHandlers is for Navigation props, and the sectionSlide is a wrapper for ensuring ful screen sections.

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
