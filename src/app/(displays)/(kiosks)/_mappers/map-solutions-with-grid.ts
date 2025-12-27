import type { SolutionScreens } from '../_components/kiosk-templates/solution/solutionSlides';
import type { Ambient, SolutionsGrid, SolutionsMain } from '../_types/content-types';

// This maps CMS content for Solutions with Grid to the Kiosk Solutions structure. (The diamond grid in Solutions.)

export const mapSolutionsWithGrid = (
  solutionsMain: SolutionsMain,
  solutionsGrid: SolutionsGrid,
  ambient: Ambient,
  diamondMapping: {
    readonly bottomLeft: number;
    readonly bottomRight: number;
    readonly center: number;
    readonly topLeft?: number;
    readonly topRight: number;
  }
): SolutionScreens => ({
  firstScreen: {
    body: solutionsMain.body ?? '',
    headline: solutionsMain.headline ?? '',
    labelText: solutionsMain.labelText ?? '',
    mainVideo: solutionsMain.mainVideo ?? '',
    subheadline: ambient.title,
  },
  secondScreen: {
    heroImageSrc: solutionsMain.image ?? '',
    image: solutionsMain.image ?? '',
    labelText: solutionsMain.labelText ?? '',
    numberedListHeadline: solutionsMain.numberedListHeadline,
    stepFourDescription: solutionsMain.numberedList?.[3] ?? '',
    stepFourLabel: '04.',
    stepOneDescription: solutionsMain.numberedList?.[0] ?? '',
    stepOneLabel: '01.',
    stepThreeDescription: solutionsMain.numberedList?.[2] ?? '',
    stepThreeLabel: '03.',
    stepTwoDescription: solutionsMain.numberedList?.[1] ?? '',
    stepTwoLabel: '02.',
    subheadline: ambient.title,
  },
  thirdScreen: {
    bottomLeftLabel: solutionsGrid.diamondList?.[diamondMapping.bottomLeft] ?? '',
    bottomRightLabel: solutionsGrid.diamondList?.[diamondMapping.bottomRight] ?? '',
    centerLabel: solutionsGrid.diamondList?.[diamondMapping.center] ?? '',
    diamondList: solutionsGrid.diamondList,
    headline: solutionsGrid.headline ?? '',
    images: solutionsGrid.images,
    labelText: solutionsMain.labelText ?? '',
    mediaDiamondLeftSrc: solutionsGrid.images?.[0] ?? '',
    mediaDiamondRightSrc: solutionsGrid.images?.[1] ?? '',
    subheadline: ambient.title,
    topLeftLabel:
      diamondMapping.topLeft !== undefined ? solutionsGrid.diamondList?.[diamondMapping.topLeft] : undefined,
    topRightLabel: solutionsGrid.diamondList?.[diamondMapping.topRight] ?? '',
  },
});
