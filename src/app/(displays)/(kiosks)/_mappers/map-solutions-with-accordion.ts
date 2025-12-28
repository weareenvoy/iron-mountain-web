import type { SolutionScreens } from '../_components/kiosk-templates/solution/solutionSlides';
import type { Ambient, SolutionsAccordion, SolutionsMain } from '../_types/content-types';

/**
 * Maps CMS content for Solutions with Accordion to the Kiosk Solutions structure.
 * Contains business logic for accordion color assignment, number formatting, and default states.
 */
export const mapSolutionsWithAccordion = (
  solutionsMain: SolutionsMain,
  solutionAccordion: SolutionsAccordion,
  ambient: Ambient
): SolutionScreens => {
  return {
    firstScreen: {
      body: solutionsMain.body,
      headline: solutionsMain.headline,
      labelText: solutionsMain.labelText,
      mainVideo: solutionsMain.mainVideo,
      subheadline: ambient.title,
    },
    fourthScreen: {
      accordion: solutionAccordion.accordion?.map((item, index) => ({
        color:
          index === 0
            ? ('white' as const)
            : index === 1
              ? ('lightBlue' as const)
              : index === 2
                ? ('blue' as const)
                : ('navy' as const),
        contentList: item.bullets ? [...item.bullets] : [],
        expanded: index === 0,
        id: `accordion-${index}`,
        number: `${String(index + 1).padStart(2, '0')}.`,
        title: item.title ?? '',
      })),
      headline: solutionAccordion.headline,
      image: solutionAccordion.image,
      labelText: solutionAccordion.labelText,
      mediaDiamondSolidSrc: solutionAccordion.image,
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
  };
};
