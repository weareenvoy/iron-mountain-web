import type { SolutionScreens } from '../_components/kiosk-templates/solution/solutionSlides';
import type { Ambient, SolutionsAccordion, SolutionsMain } from '../_types/content-types';

export const mapSolutionsWithAccordion = (
  solutionsMain: SolutionsMain,
  solutionAccordion: SolutionsAccordion,
  ambient: Ambient
): SolutionScreens => {
  return {
    firstScreen: {
      backgroundVideoSrc: solutionsMain.mainVideo ?? '',
      description: solutionsMain.body ?? '',
      labelText: solutionsMain.labelText ?? 'Solution',
      subheadline: ambient.title,
      title: solutionsMain.headline ?? '',
    },
    fourthScreen: {
      accordionItems: solutionAccordion.accordion?.map((item, index) => ({
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
      labelText: solutionAccordion.labelText ?? 'Solution',
      mediaDiamondSolidSrc: solutionAccordion.image,
      subheadline: ambient.title,
      title: solutionAccordion.headline ?? '',
    },
    secondScreen: {
      heroImageSrc: solutionsMain.image ?? '',
      labelText: solutionsMain.labelText ?? 'Solution',
      stepFourDescription: solutionsMain.numberedList?.[3] ?? '',
      stepFourLabel: '04.',
      stepOneDescription: solutionsMain.numberedList?.[0] ?? '',
      stepOneLabel: '01.',
      stepThreeDescription: solutionsMain.numberedList?.[2] ?? '',
      stepThreeLabel: '03.',
      stepTwoDescription: solutionsMain.numberedList?.[1] ?? '',
      stepTwoLabel: '02.',
      subheadline: ambient.title,
      title: solutionsMain.numberedListHeadline,
    },
  };
};
