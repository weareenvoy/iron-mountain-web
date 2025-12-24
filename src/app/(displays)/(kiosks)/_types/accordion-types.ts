export type AccordionColor = 'blue' | 'lightBlue' | 'navy' | 'white';

export type AccordionEntry = {
  readonly color?: AccordionColor;
  readonly contentList?: string[];
  readonly expanded?: boolean;
  readonly id: string;
  readonly number: string;
  readonly title: string;
};

export type PaletteConfig = {
  readonly body: string;
  readonly header: string;
  readonly text: string;
};

export const palettes: Record<AccordionColor, PaletteConfig> = {
  blue: {
    body: '#1b75bc',
    header: '#1b75bc',
    text: '#ededed',
  },
  lightBlue: {
    body: '#6dcff6',
    header: '#6dcff6',
    text: '#14477d',
  },
  navy: {
    body: '#14477d',
    header: '#14477d',
    text: '#ededed',
  },
  white: {
    body: '#ededed',
    header: '#ededed',
    text: '#14477d',
  },
};
