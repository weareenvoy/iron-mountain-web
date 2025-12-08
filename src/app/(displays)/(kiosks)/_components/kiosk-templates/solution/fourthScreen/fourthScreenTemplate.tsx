'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion';
import GreenDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondFourth';
import OrangeDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondFourth';
import OrangeGradientDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeGradientDiamondFourth';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import { ArrowDown, ArrowUp, Minus, Plus } from 'lucide-react';
import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

type AccordionColor = 'blue' | 'lightBlue' | 'navy' | 'white';

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
    <div className="bg-black flex flex-col h-screen overflow-hidden relative w-full" data-node-id="5168:10496">
      {/* Background gradient */}
      <div
        className="absolute h-[5120px] left-0 top-0 w-full"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
      />

      {/* Subheadline */}
      <div
        className="-translate-y-full absolute font-normal leading-[1.4] left-[120px] text-[#ededed] text-[60px] top-[368px] tracking-[-3px]"
        style={{ top: '400px', width: '390px' }}
      >
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div
        className="absolute flex gap-[41px] items-center left-[140px] top-[790px]"
        style={{ left: '140px', top: '790px' }}
      >
        <div className="flex h-[200px] items-center justify-center relative w-[200px]" style={{ left: -55, top: -25 }}>
          <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
        </div>
        <h1
          className="font-normal leading-[1.3] text-[#ededed] text-[126.031px] tracking-[-6.3015px] whitespace-nowrap"
          style={{ left: '-100px', position: 'relative', top: '-20px' }}
        >
          {solutionLabel}
        </h1>
      </div>

      {/* Title */}
      <div className="absolute left-[240px] top-[1260px] w-[1300px]" style={{ top: '1260px', width: '1300px' }}>
        <p className="font-normal leading-[1.3] text-[#ededed] text-[100px] tracking-[-5px] whitespace-pre-line">
          {renderRegisteredMark(title)}
        </p>
      </div>

      {/* Solution cards */}
      <div className="absolute left-[240px] rounded-[80px] shadow-[0_20px_80px_rgba(0,0,0,0.25)] top-[1770px] w-[1379px]">
        <Accordion
          className="overflow-hidden rounded-[80px] space-y-0"
          collapsible
          defaultValue={entries.find(entry => entry.expanded)?.id ?? entries[0]?.id ?? 'item-1'}
          style={{ backgroundColor: '#ededed' }}
          type="single"
        >
          {entries.map((item, index) => {
            const palette = palettes[item.color ?? 'white'];
            const hasContent = Boolean(item.contentList?.length);
            const roundedClass =
              index === 0 ? 'rounded-t-[80px]' : index === entries.length - 1 ? 'rounded-b-[80px]' : 'rounded-none';
            const triggerRoundedClass =
              index === 0 ? 'rounded-t-[50px]' : index === entries.length - 1 ? 'rounded-b-[50px]' : 'rounded-none';

            const prevPalette = index > 0 ? palettes[entries[index - 1]?.color ?? 'white'] : undefined;

            return (
              <AccordionItem
                className={`border-none overflow-hidden relative ${roundedClass}`}
                key={item.id}
                value={item.id}
              >
                {index > 0 ? (
                  <div
                    aria-hidden="true"
                    className="absolute h-[50px] left-0 pointer-events-none right-0 top-0"
                    style={{ backgroundColor: prevPalette?.header, zIndex: 0 }}
                  />
                ) : null}
                <AccordionTrigger
                  className={`flex focus-visible:outline-none group/accordion-trigger h-[120px] hover:no-underline items-center leading-[1.4] min-h-[240px] px-[80px] relative text-[52px] text-left tracking-[-2.6px] transition-none z-[1] ${triggerRoundedClass}`}
                  indicator={<PlusMinusIcon color={palette.text} />}
                  style={{
                    backgroundColor: palette.header,
                    borderBottomLeftRadius: index === entries.length - 1 ? '50px' : undefined,
                    borderBottomRightRadius: index === entries.length - 1 ? '50px' : undefined,
                    borderTopLeftRadius: '50px',
                    borderTopRightRadius: '50px',
                    paddingBottom: '20px',
                    paddingTop: '30px',
                    color: palette.text,
                  }}
                >
                  <div className="flex flex-1 gap-[40px] items-center">
                    <span>{renderRegisteredMark(item.number)}</span>
                    <span className="text-left">{renderRegisteredMark(item.title)}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="[&>div]:pb-0">
                  {hasContent ? (
                    <div
                      className="pb-[120px] pl-[218px] pt-[50px] px-[80px]"
                      style={{
                        backgroundColor: palette.body,
                        color: palette.text,
                        paddingLeft: '210px',
                        paddingTop: '35px',
                      }}
                    >
                      <ul className="leading-[1.4] space-y-[16px] text-[52px] tracking-[-2.6px]">
                        {item.contentList?.map(bullet => (
                          <li
                            className="list-disc"
                            key={bullet}
                            style={{ marginInlineStart: '70px', marginBottom: '0px', paddingInlineStart: '15px' }}
                          >
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
      <div className="absolute h-[840px] left-[240px] pointer-events-none top-[3480px] w-[840px]">
        {mediaDiamondOutlineSrc ? (
          <img alt="" className="h-full object-contain w-full" src={mediaDiamondOutlineSrc} />
        ) : (
          <GreenDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <PhotoDiamond
        className="absolute h-[520px] left-[1260px] pointer-events-none top-[3580px] w-[520px]"
        imageSrc={mediaDiamondSolidSrc}
      />
      <div className="absolute h-[300px] left-[1040px] pointer-events-none top-[3920px] w-[300px]">
        {accentDiamondSrc ? (
          <img alt="" className="h-full object-contain w-full" src={accentDiamondSrc} />
        ) : (
          <OrangeGradientDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="absolute h-[220px] left-[920px] pointer-events-none top-[4080px] w-[220px]">
        <OrangeDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>

      {/* Navigation arrows */}
      <div
        aria-label="Previous"
        className="absolute flex h-[118px] items-center justify-center right-[120px] top-[1755px] w-[118px] z-[10]"
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onNavigateUp?.();
          }
        }}
        onPointerDown={() => onNavigateUp?.()}
        role="button"
        tabIndex={0}
      >
        <ArrowUp aria-hidden="true" className="h-full text-[#ffffff66] w-full" focusable="false" strokeWidth={1.5} />
      </div>
      <div
        aria-label="Next"
        className="absolute flex h-[118px] items-center justify-center right-[120px] top-[1980px] w-[118px] z-[10]"
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onNavigateDown?.();
          }
        }}
        onPointerDown={() => onNavigateDown?.()}
        role="button"
        tabIndex={0}
      >
        <ArrowDown aria-hidden="true" className="h-full text-[#ffffff66] w-full" focusable="false" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function PlusMinusIcon({ color }: { color: string }) {
  return (
    <span aria-hidden className="block h-[72px] relative w-[72px]" style={{ color }}>
      <Minus
        className="absolute group-data-[state=open]/accordion-trigger:opacity-100 h-full inset-0 opacity-0 transition-opacity w-full"
        strokeWidth={1.5}
      />
      <Plus
        className="absolute group-data-[state=open]/accordion-trigger:opacity-0 h-full inset-0 transition-opacity w-full"
        strokeWidth={1.5}
      />
    </span>
  );
}

function PhotoDiamond({ className, imageSrc }: { className: string; imageSrc?: string }) {
  const shouldOverride = !imageSrc || imageSrc.includes('2f62e81abe58763bf6bdbf710843b3c886f19583');
  const resolvedSrc = shouldOverride ? DEFAULT_PHOTO_DIAMOND_SRC : imageSrc;

  return (
    <div className={className}>
      <div className="overflow-hidden relative rotate-[45deg] rounded-[160px] size-full">
        {resolvedSrc ? (
          <img alt="" className="-rotate-[45deg] h-full object-cover w-full" src={resolvedSrc} />
        ) : (
          <div className="-rotate-[45deg] bg-[#6dcff6] h-full w-full" />
        )}
      </div>
    </div>
  );
}
