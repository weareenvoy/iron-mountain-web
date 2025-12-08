'use client';

import { ArrowDown, ArrowUp, Minus, Plus } from 'lucide-react';

import GreenDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondFourth';
import OrangeDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondFourth';
import OrangeGradientDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeGradientDiamondFourth';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion';

import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

type AccordionColor = 'white' | 'lightBlue' | 'blue' | 'navy';

type AccordionEntry = {
  color?: AccordionColor;
  contentList?: string[];
  expanded?: boolean;
  id: string;
  number: string;
  title: string;
};

type PaletteConfig = {
  body: string;
  header: string;
  text: string;
};

const palettes: Record<AccordionColor, PaletteConfig> = {
  blue: {
    body: '#1b75bc',
    header: '#1b75bc',
    text: '#ededed',
  },
  lightBlue: {
    body: '#6dcff6',
    header: '#6dcff6',
    text: '#14477d',
  },
  navy: {
    body: '#14477d',
    header: '#14477d',
    text: '#ededed',
  },
  white: {
    body: '#ededed',
    header: '#ededed',
    text: '#14477d',
  },
} as const;

const DEFAULT_PHOTO_DIAMOND_SRC = '/images/kiosks/kiosk3/02-solution/Solution-Image2-Diamond.png';

const defaultAccordionItems: AccordionEntry[] = [];

export interface SolutionFourthScreenTemplateProps {
  accentDiamondSrc?: string;
  accordionItems?: AccordionEntry[];
  gradientEndColor?: string;
  gradientStartColor?: string;
  mediaDiamondOutlineSrc?: string;
  mediaDiamondSolidSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  solutionLabel?: string;
  subheadline?: string | string[];
  title?: string;
}

export default function SolutionFourthScreenTemplate({
  accentDiamondSrc,
  accordionItems = defaultAccordionItems,
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  mediaDiamondOutlineSrc,
  mediaDiamondSolidSrc = DEFAULT_PHOTO_DIAMOND_SRC,
  solutionLabel = 'Solution',
  subheadline = 'IT assets &\n data centers',
  title = "Iron Mountain's Asset Lifecycle Management",
  onNavigateDown,
  onNavigateUp,
}: SolutionFourthScreenTemplateProps) {
  const entries = accordionItems.length ? accordionItems : defaultAccordionItems;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black" data-node-id="5168:10496">
      {/* Background gradient */}
      <div
        className="absolute left-0 top-0 h-[5120px] w-full"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
      />

      {/* Subheadline */}
      <div className="absolute left-[120px] top-[368px] -translate-y-full text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]">
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div className="absolute left-[128.17px] top-[745.23px] flex items-center gap-[41px]">
        <div className="relative flex h-[200px] w-[200px] items-center justify-center" style={{ left: -55, top: -25 }}>
          <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
        </div>
        <h1 className="whitespace-nowrap text-[126.031px] font-normal leading-[1.3] tracking-[-6.3015px] text-[#ededed]">
          {solutionLabel}
        </h1>
      </div>

      {/* Title */}
      <div className="absolute left-[240px] top-[1428px] w-[1271px]">
        <p className="text-[100px] font-normal leading-[1.3] tracking-[-5px] text-[#ededed] whitespace-pre-line">
          {renderRegisteredMark(title)}
        </p>
      </div>

      {/* Solution cards */}
      <div className="absolute left-[240px] top-[1770px] w-[1379px] rounded-[80px] shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
        <Accordion
          className="space-y-0 overflow-hidden rounded-[80px]"
          collapsible
          defaultValue={entries.find((entry) => entry.expanded)?.id ?? entries[0]?.id ?? 'item-1'}
          type="single"
        >
          {entries.map((item, index) => {
            const palette = palettes[item.color ?? 'white'];
            const hasContent = Boolean(item.contentList?.length);
            const roundedClass =
              index === 0
                ? 'rounded-t-[80px]'
                : index === entries.length - 1
                  ? 'rounded-b-[80px]'
                  : 'rounded-none';

            return (
              <AccordionItem className={`border-none ${roundedClass} overflow-hidden`} key={item.id} value={item.id}>
                  <AccordionTrigger
                  className="group/accordion-trigger flex h-[120px] items-center px-[80px] text-left text-[52px] leading-[1.4] tracking-[-2.6px] transition-none hover:no-underline focus-visible:outline-none"
                  indicator={<PlusMinusIcon color={palette.text} />}
                    style={{ backgroundColor: palette.header, color: palette.text }}
                  >
                  <div className="flex flex-1 items-center gap-[40px]">
                    <span>{renderRegisteredMark(item.number)}</span>
                    <span className="text-left">{renderRegisteredMark(item.title)}</span>
                    </div>
                  </AccordionTrigger>
                    <AccordionContent>
                  {hasContent ? (
                      <div
                      className="px-[80px] pb-[60px] pl-[218px] pt-[100px]"
                      style={{ backgroundColor: palette.body, color: palette.text }}
                      >
                      <ul className="space-y-[16px] text-[52px] leading-[1.4] tracking-[-2.6px]">
                        {item.contentList?.map((bullet) => (
                          <li className="ms-[78px] list-disc" key={bullet}>
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
      <div className="pointer-events-none absolute left-[240px] top-[3480px] h-[840px] w-[840px]">
        {mediaDiamondOutlineSrc ? (
        <img alt="" className="h-full w-full object-contain" src={mediaDiamondOutlineSrc} />
        ) : (
          <GreenDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <PhotoDiamond className="pointer-events-none absolute left-[1260px] top-[3580px] h-[520px] w-[520px]" imageSrc={mediaDiamondSolidSrc} />
      <div className="pointer-events-none absolute left-[1040px] top-[3920px] h-[300px] w-[300px]">
        {accentDiamondSrc ? (
          <img alt="" className="h-full w-full object-contain" src={accentDiamondSrc} />
        ) : (
          <OrangeGradientDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute left-[920px] top-[4080px] h-[220px] w-[220px]">
        <OrangeDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>

      {/* Navigation arrows */}
      <div
        aria-label="Previous"
        className="absolute right-[120px] top-[1755px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onNavigateUp?.();
          }
        }}
        onPointerDown={() => onNavigateUp?.()}
        role="button"
        tabIndex={0}
      >
        <ArrowUp aria-hidden="true" className="h-full w-full text-[#ffffff66]" focusable="false" strokeWidth={1.5} />
      </div>
      <div
        aria-label="Next"
        className="absolute right-[120px] top-[1980px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onNavigateDown?.();
          }
        }}
        onPointerDown={() => onNavigateDown?.()}
        role="button"
        tabIndex={0}
      >
        <ArrowDown aria-hidden="true" className="h-full w-full text-[#ffffff66]" focusable="false" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function PlusMinusIcon({ color }: { color: string }) {
  return (
    <span aria-hidden className="relative block h-[32px] w-[32px]" style={{ color }}>
      <Minus
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity group-data-[state=open]/accordion-trigger:opacity-100"
        strokeWidth={1.5}
      />
      <Plus className="absolute inset-0 h-full w-full transition-opacity group-data-[state=open]/accordion-trigger:opacity-0" strokeWidth={1.5} />
    </span>
  );
}

function PhotoDiamond({ className, imageSrc }: { className: string; imageSrc?: string }) {
  const shouldOverride = !imageSrc || imageSrc.includes('2f62e81abe58763bf6bdbf710843b3c886f19583');
  const resolvedSrc = shouldOverride ? DEFAULT_PHOTO_DIAMOND_SRC : imageSrc;

  return (
    <div className={className}>
      <div className="relative size-full rotate-[45deg] overflow-hidden rounded-[160px]">
        {resolvedSrc ? (
          <img alt="" className="h-full w-full -rotate-[45deg] object-cover" src={resolvedSrc} />
        ) : (
          <div className="h-full w-full -rotate-[45deg] bg-[#6dcff6]" />
        )}
      </div>
    </div>
  );
}
