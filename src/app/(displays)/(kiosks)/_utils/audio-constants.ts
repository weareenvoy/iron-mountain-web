/**
 * Audio asset paths for Kiosk sound effects and section music.
 * All paths are relative to /public directory.
 */

/**
 * Sound effect paths for user interactions
 */
export const KIOSK_SFX = {
  /** Play when back button is clicked or up/previous arrow is pressed */
  back: '/audio/Back_1.wav',
  /** Play when modal or demo screen closes */
  close: '/audio/Close_1.wav',
  /** Play when down/next arrow is pressed */
  next: '/audio/Next_1.wav',
  /** Play when modal or demo screen opens */
  open: '/audio/open_1.wav',
} as const;

/**
 * Background music paths per section.
 * Music changes based on which section is currently in view.
 */
export const KIOSK_SECTION_MUSIC = {
  /** Challenge/Problem section background music */
  challenge: '/audio/SolutionsPathways_02_Problem_Music_v3.wav',
  /** Custom Interactive section background music */
  customInteractive: '/audio/SolutionsPathways_05_CustomInteractive_Music_v3.wav',
  /** Initial/Title screen background music */
  initial: '/audio/SolutionsPathways_01_TitleScreen_Music_v3.wav',
  /** Solution section background music */
  solution: '/audio/SolutionsPathways_03_Solution_Music_v3.wav',
  /** Value section background music */
  value: '/audio/SolutionsPathways_04_Value_Music_v3.wav',
} as const;
