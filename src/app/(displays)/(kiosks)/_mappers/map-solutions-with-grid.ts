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

/**
 * Validates that diamondList contains only strings
 */
const validateDiamondList = (value: unknown): readonly string[] => {
  if (!Array.isArray(value)) {
    throw new Error('diamondList must be an array');
  }
  if (!value.every(item => typeof item === 'string')) {
    throw new Error('diamondList must contain only strings');
  }
  return value;
};

export const mapSolutionsWithGrid = (
  solutionsMain: SolutionsMain,
  solutionsGrid: SolutionsGrid,
  ambient: Ambient,
  diamondMapping: DiamondMapping
): SolutionScreens => {
  // Validate diamond list before mapping
  const diamondList = validateDiamondList(solutionsGrid.diamondList);
  const diamondPositions = mapArrayToPositions<string>(diamondList, diamondMapping);

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
      // No type assertion needed - diamondPositions is validated as string | undefined
      bottomLeftLabel: diamondPositions.bottomLeft,
      bottomRightLabel: diamondPositions.bottomRight,
      centerLabel: diamondPositions.center,
      diamondList: solutionsGrid.diamondList,
      headline: solutionsGrid.headline,
      images: solutionsGrid.images,
      labelText: solutionsMain.labelText,
      mediaDiamondLeftSrc: solutionsGrid.images?.[0],
      mediaDiamondRightSrc: solutionsGrid.images?.[1],
      subheadline: ambient.title,
      topLeftLabel: diamondPositions.topLeft,
      topRightLabel: diamondPositions.topRight,
    },
  };
};
