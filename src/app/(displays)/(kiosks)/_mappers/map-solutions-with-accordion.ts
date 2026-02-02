import {
  ACCORDION_COLOR_BLUE,
  ACCORDION_COLOR_LIGHT_BLUE,
  ACCORDION_COLOR_NAVY,
  ACCORDION_COLOR_WHITE,
} from '../_constants/themes';
import type { SolutionScreens } from '../_components/kiosk-templates/solution/solutionSlides';
import type { Ambient, SolutionsAccordion, SolutionsMain } from '../_types/content-types';

const ACCORDION_COLORS = [
  ACCORDION_COLOR_WHITE,
  ACCORDION_COLOR_LIGHT_BLUE,
  ACCORDION_COLOR_BLUE,
  ACCORDION_COLOR_NAVY,
] as const;

export const mapSolutionsWithAccordion = (
  solutionsMain: SolutionsMain,
  solutionAccordion: SolutionsAccordion,
  ambient: Ambient
): SolutionScreens => {
  // Check if accordion has actual data
  const hasAccordionData =
    solutionAccordion.accordion && Array.isArray(solutionAccordion.accordion) && solutionAccordion.accordion.length > 0;

  // Check if numbered list has actual content
  const hasNumberedListData =
    solutionsMain.numberedList &&
    Array.isArray(solutionsMain.numberedList) &&
    solutionsMain.numberedList.some(item => item && item.trim().length > 0);

  return {
    firstScreen: {
      body: solutionsMain.body,
      headline: solutionsMain.headline,
      labelText: solutionsMain.labelText,
      mainVideo: solutionsMain.mainVideo,
      subheadline: ambient.title,
    },
    // Only include fourthScreen if accordion data exists
    ...(hasAccordionData && {
      fourthScreen: {
        accordion: solutionAccordion.accordion.map((item, index) => ({
          color: ACCORDION_COLORS[index % ACCORDION_COLORS.length],
          contentList: item.bullets ? [...item.bullets] : [],
          expanded: index === 0,
          id: `accordion-${index}`,
          number: `${String(index + 1).padStart(2, '0')}.`,
          title: item.title ?? '',
        })),
        headline: solutionAccordion.headline,
        image: solutionAccordion.image,
        labelText: solutionsMain.labelText,
        mediaDiamondSolidSrc: solutionAccordion.image,
        subheadline: ambient.title,
      },
    }),
    // Only include secondScreen if numbered list has content
    ...(hasNumberedListData && {
      secondScreen: {
        heroImageSrc: solutionsMain.image,
        image: solutionsMain.image,
        labelText: solutionsMain.labelText,
        numberedListHeadline: solutionsMain.numberedListHeadline,
        stepFourDescription: solutionsMain.numberedList[3],
        stepFourLabel: '04.',
        stepOneDescription: solutionsMain.numberedList[0],
        stepOneLabel: '01.',
        stepThreeDescription: solutionsMain.numberedList[2],
        stepThreeLabel: '03.',
        stepTwoDescription: solutionsMain.numberedList[1],
        stepTwoLabel: '02.',
        subheadline: ambient.title,
      },
    }),
  };
};
