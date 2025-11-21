export const PAGE_LOADING_TIMEOUT_SECONDS = 3 as const;

export const FADE_ANIMATION_DURATION_NUMBER = 600 as const;
export const FADE_ANIMATION_DURATION_CLASS = 'duration-600' as const;

export const ANIMATION_SHORT_DELAY_NUMBER = 100 as const;
export const ANIMATION_SHORT_DELAY_CLASS = 'delay-100' as const;

export const ANIMATION_MID_DELAY_NUMBER = 600 as const;
export const ANIMATION_MID_DELAY_CLASS = 'delay-600' as const;

export const ANIMATION_LONG_DELAY_NUMBER = 1000 as const;
export const ANIMATION_LONG_DELAY_CLASS = 'delay-1000' as const;

export const APPS: Readonly<{ readonly route: '/basecamp' | '/docent'; readonly title: string }[]> = [
  {
    route: '/docent',
    title: 'Docent Tablet',
  },
  {
    route: '/basecamp',
    title: 'Basecamp Display',
  },
] as const;
