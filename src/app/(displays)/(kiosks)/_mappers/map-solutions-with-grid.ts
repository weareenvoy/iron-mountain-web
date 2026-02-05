import { mapArrayToPositions } from '@/lib/utils/cms-helpers';
import type { SolutionScreens } from '../_components/kiosk-templates/solution/solutionSlides';
import type { Ambient, SolutionsGrid, SolutionsMain } from '../_types/content-types';

export type DiamondMapping = {
  readonly bottomLeft: number;
  readonly bottomRight: number;
  readonly center: number;
  readonly topLeft?: number;
  readonly topRight: number;
};

/**
 * Validates that diamondList contains 4-5 string entries.
 * The solution grid UI is designed for a balanced layout with 4-5 diamonds.
 */
const validateDiamondList = (value: unknown): readonly string[] => {
  if (!Array.isArray(value)) {
    throw new Error('diamondList must be an array');
  }
  if (!value.every(item => typeof item === 'string')) {
    throw new Error('diamondList must contain only strings');
  }
  if (value.length < 4 || value.length > 5) {
    throw new Error(
      `diamondList must contain 4-5 entries for solution grid, got ${value.length}. ` +
        'The UI supports: center, topLeft, topRight (required), bottomLeft (required), bottomRight (required).'
    );
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

  // Validate numbered list has required items
  const numberedList = solutionsMain.numberedList ?? [];
  const hasNumberedListData = numberedList.some(item => item && item.trim().length > 0);

  return {
    firstScreen: {
      body: solutionsMain.body,
      headline: solutionsMain.headline,
      labelText: solutionsMain.labelText,
      mainVideo: solutionsMain.mainVideo,
      subheadline: ambient.title,
    },
    // Only include secondScreen if numbered list has content
    ...(hasNumberedListData && {
      secondScreen: {
        heroImageSrc: solutionsMain.image,
        image: solutionsMain.image,
        labelText: solutionsMain.labelText,
        numberedListHeadline: solutionsMain.numberedListHeadline,
        stepFourDescription: numberedList[3],
        stepFourLabel: '04.',
        stepOneDescription: numberedList[0],
        stepOneLabel: '01.',
        stepThreeDescription: numberedList[2],
        stepThreeLabel: '03.',
        stepTwoDescription: numberedList[1],
        stepTwoLabel: '02.',
        subheadline: ambient.title,
      },
    }),
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
