import { mapArrayToPositions } from '@/lib/utils/cms-helpers';
import type { SolutionScreens } from '../_components/kiosk-templates/solution/solutionSlides';
import type { Ambient, SolutionsGrid, SolutionsMain } from '../_types/content-types';

// Different Kiosks position the Solution diamonds differently, this makes that setup configurable and easier to update later.

/**
 * Maps CMS content for Solutions with Grid to the Kiosk Solutions structure.
 * The main value here is mapping diamond list array indices to visual positions in the grid.
 */

export type DiamondMapping = {
  readonly bottomLeft: number;
  readonly bottomRight: number;
  readonly center: number;
  readonly topLeft?: number;
  readonly topRight: number;
};

export const mapSolutionsWithGrid = (
  solutionsMain: SolutionsMain,
  solutionsGrid: SolutionsGrid,
  ambient: Ambient,
  diamondMapping: DiamondMapping
): SolutionScreens => {
  // Map diamond array to positioned labels
  const diamondPositions = mapArrayToPositions(solutionsGrid.diamondList, diamondMapping);

  return {
    firstScreen: {
      body: solutionsMain.body,
      headline: solutionsMain.headline,
      labelText: solutionsMain.labelText,
      mainVideo: solutionsMain.mainVideo,
      subheadline: ambient.title,
    },
    secondScreen: {
      heroImageSrc: solutionsMain.image,
      image: solutionsMain.image,
      labelText: solutionsMain.labelText,
      numberedListHeadline: solutionsMain.numberedListHeadline,
      stepFourDescription: solutionsMain.numberedList?.[3],
      stepFourLabel: '04.',
      stepOneDescription: solutionsMain.numberedList?.[0],
      stepOneLabel: '01.',
      stepThreeDescription: solutionsMain.numberedList?.[2],
      stepThreeLabel: '03.',
      stepTwoDescription: solutionsMain.numberedList?.[1],
      stepTwoLabel: '02.',
      subheadline: ambient.title,
    },
    thirdScreen: {
      bottomLeftLabel: diamondPositions.bottomLeft as string | undefined,
      bottomRightLabel: diamondPositions.bottomRight as string | undefined,
      centerLabel: diamondPositions.center as string | undefined,
      diamondList: solutionsGrid.diamondList,
      headline: solutionsGrid.headline,
      images: solutionsGrid.images,
      labelText: solutionsMain.labelText,
      mediaDiamondLeftSrc: solutionsGrid.images?.[0],
      mediaDiamondRightSrc: solutionsGrid.images?.[1],
      subheadline: ambient.title,
      topLeftLabel: diamondPositions.topLeft as string | undefined,
      topRightLabel: diamondPositions.topRight as string | undefined,
    },
  };
};
