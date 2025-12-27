'use client';

import Image from 'next/image';
import { type AccordionEntry } from '@/app/(displays)/(kiosks)/_types/accordion-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion';
import GreenDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondFourth';
import OrangeDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondFourth';
import OrangeGradientDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeGradientDiamondFourth';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import PhotoDiamond from './PhotoDiamond';
import PlusMinusIcon from './PlusMinusIcon';

export type SolutionFourthScreenTemplateProps = {
  readonly accentDiamondSrc?: string;
  readonly accordionItems?: AccordionEntry[];
  readonly labelText?: string;
  readonly mediaDiamondOutlineSrc?: string;
  readonly mediaDiamondSolidSrc?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly subheadline?: string;
  readonly title?: string;
};

const SolutionFourthScreenTemplate = ({
  accentDiamondSrc,
  accordionItems,
  labelText,
  mediaDiamondOutlineSrc,
  mediaDiamondSolidSrc,
  subheadline,
  title,
}: SolutionFourthScreenTemplateProps) => {
  const entries = accordionItems?.length ? accordionItems : [];

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-transparent">
      {/* Background gradient (now transparent) */}
      <div className="absolute top-0 left-0 h-[5120px] w-full bg-transparent" />

      {/* Subheadline */}
      <h2 className="absolute top-[400px] left-[120px] z-[1] w-[390px] -translate-y-full text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#ededed]">
        {renderRegisteredMark(subheadline)}
      </h2>

      {/* Solution label */}
      <div className="absolute top-[790px] left-[140px] z-[1] flex items-center gap-[41px]">
        <div className="relative top-[-25px] left-[-55px] flex h-[200px] w-[200px] items-center justify-center">
          <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
        </div>
        <h1 className="relative top-[-20px] left-[-100px] text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
          {labelText}
        </h1>
      </div>

      {/* Title */}
      <div className="absolute top-[1260px] left-[240px] z-10 w-[1300px]">
        <p
          className="text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-[#ededed]"
          data-scroll-section="solution-fourth-title"
        >
          {renderRegisteredMark(title)}
        </p>
      </div>

      {/* Solution cards */}
      <div className="absolute top-[1770px] left-[240px] w-[1379px] rounded-[80px] bg-[#ededed] shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
        <Accordion
          className="space-y-0 overflow-hidden rounded-[80px]"
          collapsible
          defaultValue={entries.find(entry => entry.expanded)?.id ?? entries[0]?.id ?? 'item-1'}
          type="single"
        >
          {entries.map((item, index) => {
            const accordionColor = item.color ?? 'white';
            const prevAccordionColor = index > 0 ? (entries[index - 1]?.color ?? 'white') : null;
            const hasContent = Boolean(item.contentList?.length);
            const roundedClass =
              index === 0 ? 'rounded-t-[80px]' : index === entries.length - 1 ? 'rounded-b-[80px]' : 'rounded-none';
            const triggerRoundedClass =
              index === 0 ? 'rounded-t-[50px]' : index === entries.length - 1 ? 'rounded-b-[50px]' : 'rounded-none';

            return (
              <AccordionItem
                className={`relative z-[1] overflow-hidden border-none ${roundedClass} data-[accordion-color=blue]:bg-[#1b75bc] data-[accordion-color=lightBlue]:bg-[#6dcff6] data-[accordion-color=navy]:bg-[#14477d] data-[accordion-color=white]:bg-[#ededed]`}
                data-accordion-color={index === entries.length - 1 ? accordionColor : undefined}
                key={item.id}
                value={item.id}
              >
                {index > 0 && prevAccordionColor ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 right-0 left-0 z-0 h-[50px] data-[accordion-color=blue]:bg-[#1b75bc] data-[accordion-color=lightBlue]:bg-[#6dcff6] data-[accordion-color=navy]:bg-[#14477d] data-[accordion-color=white]:bg-[#ededed]"
                    data-accordion-color={prevAccordionColor}
                  />
                ) : null}
                <AccordionTrigger
                  className={`group/accordion-trigger relative z-[1] flex h-[120px] min-h-[240px] items-center rounded-t-[50px] px-[80px] pt-[30px] pb-[20px] text-left text-[52px] leading-[1.4] tracking-[-2.6px] transition-none hover:no-underline focus-visible:outline-none ${
                    index === entries.length - 1 ? 'rounded-b-[50px]' : ''
                  } ${triggerRoundedClass} data-[accordion-color=blue]:bg-[#1b75bc] data-[accordion-color=blue]:text-[#ededed] data-[accordion-color=lightBlue]:bg-[#6dcff6] data-[accordion-color=lightBlue]:text-[#14477d] data-[accordion-color=navy]:bg-[#14477d] data-[accordion-color=navy]:text-[#ededed] data-[accordion-color=white]:bg-[#ededed] data-[accordion-color=white]:text-[#14477d]`}
                  data-accordion-color={accordionColor}
                  indicator={<PlusMinusIcon accordionColor={accordionColor} />}
                >
                  <div className="flex flex-1 items-center gap-[40px]">
                    <span>{renderRegisteredMark(item.number)}</span>
                    <span className="text-left">{renderRegisteredMark(item.title)}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="relative z-[1] [&>div]:pb-0">
                  {hasContent ? (
                    <div
                      className="px-[80px] pt-[35px] pb-[120px] pl-[210px] data-[accordion-color=blue]:bg-[#1b75bc] data-[accordion-color=blue]:text-[#ededed] data-[accordion-color=lightBlue]:bg-[#6dcff6] data-[accordion-color=lightBlue]:text-[#14477d] data-[accordion-color=navy]:bg-[#14477d] data-[accordion-color=navy]:text-[#ededed] data-[accordion-color=white]:bg-[#ededed] data-[accordion-color=white]:text-[#14477d]"
                      data-accordion-color={accordionColor}
                    >
                      <ul className="space-y-[16px] text-[52px] leading-[1.4] tracking-[-2.6px]">
                        {item.contentList?.map(bullet => (
                          <li className="ms-[70px] mb-0 list-disc ps-[15px]" key={bullet}>
                            {renderRegisteredMark(bullet)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Decorative diamonds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full [mask-image:linear-gradient(#fff_0%,#fff_calc(100%-140px),transparent_calc(100%-75px),transparent_100%)] [-webkit-mask-image:linear-gradient(#fff_0%,#fff_calc(100%-10px),transparent_calc(100%-75px),transparent_100%)]"
      >
        <div className="pointer-events-none absolute top-[3610px] left-[240px] h-[880px] w-[880px]">
          {mediaDiamondOutlineSrc ? (
            <div className="relative h-full w-full">
              <Image
                alt="Outline accent diamond"
                className="object-contain"
                fill
                sizes="880px"
                src={mediaDiamondOutlineSrc}
              />
            </div>
          ) : (
            <GreenDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
          )}
        </div>
        <PhotoDiamond
          className="pointer-events-none absolute top-[3960px] left-[790px] h-[1250px] w-[1250px]"
          imageAlt="Solution highlight diamond photo"
          imageSrc={mediaDiamondSolidSrc}
        />
        <div className="pointer-events-none absolute top-[4390px] left-[210px] h-[390px] w-[390px]">
          {accentDiamondSrc ? (
            <div className="relative h-full w-full">
              <Image alt="Small accent diamond" className="object-contain" fill sizes="390px" src={accentDiamondSrc} />
            </div>
          ) : (
            <OrangeGradientDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
          )}
        </div>
        <div className="pointer-events-none absolute top-[4680px] left-[240px] h-[880px] w-[880px]">
          <OrangeDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
        </div>
      </div>
    </div>
  );
};

export default SolutionFourthScreenTemplate;
