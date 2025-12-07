'use client';

import { ArrowDown, ArrowUp, Diamond } from 'lucide-react';

import GreenDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondFourth';
import OrangeDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondFourth';
import OrangeGradientDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeGradientDiamondFourth';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion';
import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

const imgBackgroundVideo = '/_videos/v1/a532f40a2a6848e2a80788002b6cb925a1f4c3c2';
type AccordionEntry = {
  id: string;
  number: string;
  title: string;
  color?: 'white' | 'lightBlue' | 'blue' | 'navy';
  contentList?: string[];
  expanded?: boolean;
};

export interface SolutionFourthScreenTemplateProps {
  accordionItems?: AccordionEntry[];
  backgroundVideoSrc?: string;
  gradientEndColor?: string;
  gradientStartColor?: string;
  mediaDiamondOutlineSrc?: string;
  mediaDiamondSolidSrc?: string;
  accentDiamondSrc?: string;
  solutionLabel?: string;
  subheadline?: string | string[];
  title?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
}

const defaultAccordionItems: AccordionEntry[] = [
  {
    color: 'white',
    id: 'item-1',
    number: '01.',
    title: 'Device retrieval and redeployment services',
  },
  {
    color: 'lightBlue',
    id: 'item-2',
    number: '02.',
    title: 'IT asset disposition (ITAD) for end-user devices',
  },
  {
    color: 'blue',
    contentList: ['Data destruction', 'Flexible data sanitization', 'Secure media destruction'],
    expanded: true,
    id: 'item-3',
    number: '03.',
    title: 'Data center decommissioning & ITAD',
  },
  {
    color: 'navy',
    id: 'item-4',
    number: '04.',
    title: 'Decommissioning and logistics',
  },
];

const colorTokens = {
  white: { header: '#ededed', text: '#14477d', plus: '#14477d', body: '#ededed' },
  lightBlue: { header: '#6dcff6', text: '#14477d', plus: '#14477d', body: '#6dcff6' },
  blue: { header: '#1b75bc', text: '#ededed', plus: '#ededed', body: '#1b75bc' },
  navy: { header: '#14477d', text: '#ededed', plus: '#ededed', body: '#14477d' },
} as const;

export default function SolutionFourthScreenTemplate({
  accordionItems = defaultAccordionItems,
  backgroundVideoSrc = imgBackgroundVideo,
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  mediaDiamondOutlineSrc,
  mediaDiamondSolidSrc,
  accentDiamondSrc,
  solutionLabel = 'Solution',
  subheadline = 'IT assets &\n data centers',
  title = "Iron Mountain's Asset Lifecycle Management",
  onNavigateDown,
  onNavigateUp,
}: SolutionFourthScreenTemplateProps) {
  const entries = accordionItems.length ? accordionItems : defaultAccordionItems;
  const defaultValue = entries.find((item) => item.expanded)?.id ?? entries[0]?.id ?? 'item-1';

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black" data-node-id="5168:10496">
      {/* Background video */}
      <div className="absolute left-0 top-0 h-[1291px] w-full">
        <div className="absolute inset-0 overflow-hidden">
          <div className="relative h-full w-full">
            <video
              autoPlay
              className="absolute left-[-30.42%] top-[-30.96%] h-[172.5%] w-[181.73%] object-cover"
              controlsList="nodownload"
              loop
              muted
              playsInline
            >
              <source src={backgroundVideoSrc} type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
          </div>
        </div>
      </div>

      {/* Gradient body */}
      <div
        className="absolute left-0 top-[-296px] h-[5416px] w-full rounded-t-[100px]"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
      />

      {/* Subheadline */}
      <div className="absolute left-[120px] top-[368px] -translate-y-full text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]">
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div className="absolute left-[128.17px] top-[745.23px] flex items-center gap-[41px]">
        <div className="relative flex h-[100px] w-[100px] items-center justify-center">
          <Diamond aria-hidden="true" className="h-[90px] w-[90px] text-[#ededed]" focusable="false" strokeWidth={1.25} />
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

      {/* Accordion */}
      <div className="absolute left-[240px] top-[1820px] w-[1379px]">
        <Accordion collapsible defaultValue={defaultValue} type="single">
          {entries.map((item) => {
            const palette = colorTokens[item.color ?? 'white'];
            return (
              <AccordionItem key={item.id} value={item.id} className="border-none">
                <div className="flex flex-col gap-4">
                  <AccordionTrigger
                    className="rounded-[64px] px-[80px] py-[40px] text-left text-[52px] transition-none"
                    indicator={<PlusMinusIcon color={palette.plus} />}
                    style={{ backgroundColor: palette.header, color: palette.text }}
                  >
                    <div className="flex w-full items-center justify-between gap-6">
                      <div className="flex flex-col gap-0 leading-[1.4] tracking-[-2.6px] text-current">
                        <span>{item.number}</span>
                        <span>{renderRegisteredMark(item.title)}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  {item.contentList && (
                    <AccordionContent>
                      <div
                        className="rounded-[48px] px-[80px] py-[40px]"
                        style={{ backgroundColor: palette.body }}
                      >
                        <ul className="list-disc space-y-3 text-[48px] leading-[1.4] tracking-[-2px]" style={{ color: palette.text }}>
                          {item.contentList.map((bullet) => (
                            <li key={bullet} className="ms-8">
                              {renderRegisteredMark(bullet)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  )}
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Decorative diamonds */}
      <div className="pointer-events-none absolute left-[200px] top-[3600px] w-[700px]">
        {mediaDiamondOutlineSrc ? (
          <img alt="" className="h-full w-full object-contain" src={mediaDiamondOutlineSrc} />
        ) : (
          <GreenDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute left-[890px] top-[3800px] w-[360px]">
        {mediaDiamondSolidSrc ? (
          <img alt="" className="h-full w-full object-contain" src={mediaDiamondSolidSrc} />
        ) : (
          <OrangeDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute left-[1280px] top-[4050px] w-[480px]">
        {accentDiamondSrc ? (
          <img alt="" className="h-full w-full object-contain" src={accentDiamondSrc} />
        ) : (
          <OrangeGradientDiamondFourth aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
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
    <span
      aria-hidden
      className="relative block h-[32px] w-[32px] text-current"
      style={{ color }}
    >
      <span
        className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-current transition-opacity group-data-[state=open]/accordion-trigger:opacity-0"
        style={{ backgroundColor: color }}
      />
      <span className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-current" style={{ backgroundColor: color }} />
    </span>
  );
}

