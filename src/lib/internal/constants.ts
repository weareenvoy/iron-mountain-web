export const PAGE_LOADING_TIMEOUT_SECONDS = 3 as const;

export const FADE_ANIMATION_DURATION_NUMBER = 600 as const;
export const FADE_ANIMATION_DURATION_CLASS = 'duration-600' as const;

export const ANIMATION_SHORT_DELAY_NUMBER = 100 as const;
export const ANIMATION_SHORT_DELAY_CLASS = 'delay-100' as const;

export const ANIMATION_MID_DELAY_NUMBER = 600 as const;
export const ANIMATION_MID_DELAY_CLASS = 'delay-600' as const;

export const ANIMATION_LONG_DELAY_NUMBER = 1000 as const;
export const ANIMATION_LONG_DELAY_CLASS = 'delay-1000' as const;

type AppRoute = '/basecamp' | '/docent' | '/kiosk-1' | '/kiosk-2' | '/kiosk-3' | '/overlook' | '/summit' | '/welcome-wall';

export const APPS: Readonly<{ readonly route: AppRoute; readonly title: string }[]> = [
  {
    route: '/docent',
    title: 'Docent',
  },
  {
    route: '/basecamp',
    title: 'Basecamp',
  },
  {
    route: '/summit',
    title: 'Summit',
  },
  {
    route: '/overlook',
    title: 'Overlook',
  },
  {
    route: '/kiosk-1',
    title: 'Kiosk 1',
  },
  {
    route: '/kiosk-2',
    title: 'Kiosk 2',
  },
  {
    route: '/kiosk-3',
    title: 'Kiosk 3',
  },
  {
    route: '/welcome-wall',
    title: 'Welcome Wall',
  },
] as const;
