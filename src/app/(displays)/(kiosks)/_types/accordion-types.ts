export type AccordionColor = 'blue' | 'lightBlue' | 'navy' | 'white';

// This file contains the types for the Solution Accordion and its data along with its color scheme.

export type AccordionEntry = {
  readonly color?: AccordionColor;
  readonly contentList?: string[];
  readonly expanded?: boolean;
  readonly id: string;
  readonly number: string;
  readonly title: string;
};
