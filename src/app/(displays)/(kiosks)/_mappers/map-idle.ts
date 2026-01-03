import type { IdleScreens } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/idle/idleSlides';

/**
 * Type for Idle content from CMS
 */
export type IdleContent = {
  readonly videoSrc?: string;
};

/**
 * Maps Idle content from CMS to IdleScreens format
 */
export const mapIdle = (idleContent: IdleContent): IdleScreens => {
  return {
    idleScreen: {
      videoSrc: idleContent.videoSrc,
    },
  };
};
