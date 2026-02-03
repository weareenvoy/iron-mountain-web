'use client';

import Image from 'next/image';
import { useCallback, useRef } from 'react';
import { type AccordionEntry } from '@/app/(displays)/(kiosks)/_types/accordion-types';
import { useSfx } from '@/components/providers/audio-provider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion';
import GreenDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondFourth';
import OrangeDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondFourth';
import OrangeGradientDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeGradientDiamondFourth';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { SECTION_NAMES } from '../../hooks/useStickyHeader';
import PhotoDiamond from './PhotoDiamond';
import PlusMinusIcon from './PlusMinusIcon';
import { useKioskAudio } from '../../../providers/useKioskAudio';

export type SolutionFourthScreenTemplateProps = {
  readonly accentDiamondSrc?: string;
  readonly accordion?: AccordionEntry[];
  readonly headline?: string;
  readonly image?: string;
  readonly labelText?: string;
  readonly mediaDiamondOutlineSrc?: string;
  readonly mediaDiamondSolidSrc?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly subheadline?: string;
};

const SolutionFourthScreenTemplate = ({
  accentDiamondSrc,
  accordion,
  headline,
  mediaDiamondOutlineSrc,
  mediaDiamondSolidSrc,
}: SolutionFourthScreenTemplateProps) => {
  const entries = accordion?.length ? accordion : [];
  const { playSfx } = useSfx();
  const { sfx } = useKioskAudio();
  const prevValueRef = useRef<string>('');

  const handleAccordionValueChange = useCallback(
    (nextValue: string) => {
      const prevValue = prevValueRef.current;
      prevValueRef.current = nextValue;

      // Close all (Radix uses '' for "none selected")
      if (!nextValue) {
        if (sfx.close) playSfx(sfx.close);
        return;
      }

      // Open initial or switching between items
      if (nextValue !== prevValue) {
        if (sfx.open) playSfx(sfx.open);
      }
    },
    [playSfx, sfx.close, sfx.open]
  );

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden bg-transparent"
      data-scroll-section="solution-fourth-section"
      data-section-end={SECTION_NAMES.SOLUTION}
    >
      {/* Background gradient (now transparent) */}
      <div className="absolute top-0 left-0 h-[5120px] w-full bg-transparent" />

      {/* Title */}
      <div className="absolute top-[1240px] left-[240px] z-10 w-[1300px]">
        <p className="text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(headline)}
        </p>
      </div>

      {/* Solution cards */}
      <div className="absolute top-[1740px] left-[240px] w-[1379px] rounded-[80px] bg-[#ededed]">
        <Accordion
          className="space-y-0 overflow-hidden rounded-[80px]"
          collapsible
          defaultValue={entries.find(entry => entry.expanded)?.id ?? entries[0]?.id ?? 'item-1'}
          onValueChange={handleAccordionValueChange}
          type="single"
        >
          {entries.map((item, index) => {
            const accordionColor = item.color ?? 'white';
            const prevAccordionColor = index > 0 ? (entries[index - 1]?.color ?? 'white') : null;
            const hasContent = Boolean(item.contentList?.length);
            const roundedClass =
              index === 0 ? 'rounded-t-[40px]' : index === entries.length - 1 ? 'rounded-b-[40px]' : 'rounded-none';
            const triggerRoundedClass =
              index === 0 ? 'rounded-t-[50px]' : index === entries.length - 1 ? 'rounded-b-[50px]' : 'rounded-none';

            return (
              <AccordionItem
                className={cn(
                  'relative z-[1] overflow-hidden border-none',
                  roundedClass,
                  'data-[accordion-color=blue]:bg-[#1b75bc]',
                  'data-[accordion-color=lightBlue]:bg-[#6dcff6]',
                  'data-[accordion-color=navy]:bg-[#14477d]',
                  'data-[accordion-color=white]:bg-[#ededed]'
                )}
                data-accordion-color={accordionColor}
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
                  className={cn(
                    'group/accordion-trigger relative z-[1] flex h-[120px] min-h-[240px] items-center',
                    'rounded-t-[40px] px-[80px] pt-[30px] pb-[20px]',
                    'text-left text-[52px] leading-[1.4] tracking-[-2.6px]',
                    'transition-none hover:no-underline focus-visible:outline-none',
                    index === entries.length - 1 && 'rounded-b-[40px]',
                    triggerRoundedClass,
                    'data-[accordion-color=blue]:bg-[#1b75bc] data-[accordion-color=blue]:text-[#ededed]',
                    'data-[accordion-color=lightBlue]:bg-[#6dcff6] data-[accordion-color=lightBlue]:text-[#14477d]',
                    'data-[accordion-color=navy]:bg-[#14477d] data-[accordion-color=navy]:text-[#ededed]',
                    'data-[accordion-color=white]:bg-[#ededed] data-[accordion-color=white]:text-[#14477d]'
                  )}
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
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full [mask-image:linear-gradient(#fff_0%,#fff_calc(100%-140px),transparent_calc(100%-75px),transparent_100%)] [-webkit-mask-image:linear-gradient(#fff_0%,#fff_calc(100%-10px),transparent_calc(100%-75px),transparent_100%)]"
      >
        <div className="pointer-events-none absolute top-[3610px] left-[240px] h-[880px] w-[880px]">
          {mediaDiamondOutlineSrc ? (
            <div className="relative h-full w-full">
              <Image
                alt="Outline accent diamond"
                className="object-contain"
                fill
                quality={75} // All decorative images are 75 quality, the text is the main focus not the image. 75 is a good balance between quality and performance.
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
              <Image
                alt="Small accent diamond"
                className="object-contain"
                fill
                quality={75} // All decorative images are 75 quality, the text is the main focus not the image. 75 is a good balance between quality and performance.
                sizes="390px"
                src={accentDiamondSrc}
              />
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
