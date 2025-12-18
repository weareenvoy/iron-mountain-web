'use client';

import { ArrowDown, ArrowUp, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion';
import GreenDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondFourth';
import OrangeDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondFourth';
import OrangeGradientDiamondFourth from '@/components/ui/icons/Kiosks/Solutions/OrangeGradientDiamondFourth';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
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

export type SolutionFourthScreenTemplateProps = Readonly<{
  accentDiamondSrc?: string;
  accordionItems?: AccordionEntry[];
  mediaDiamondOutlineSrc?: string;
  mediaDiamondSolidSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  solutionLabel?: string;
  subheadline?: string | string[];
  title?: string;
}>;

const SolutionFourthScreenTemplate = ({
  accentDiamondSrc,
  accordionItems = defaultAccordionItems,
  mediaDiamondOutlineSrc,
  mediaDiamondSolidSrc = DEFAULT_PHOTO_DIAMOND_SRC,
  onNavigateDown,
  onNavigateUp,
  solutionLabel = 'Solution',
  subheadline = 'IT assets &\n data centers',
  title = "Iron Mountain's Asset Lifecycle Management",
}: SolutionFourthScreenTemplateProps) => {
  const entries = accordionItems.length ? accordionItems : defaultAccordionItems;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-transparent" data-node-id="5168:10496">
      {/* Background gradient (now transparent) */}
      <div className="absolute top-0 left-0 h-[5120px] w-full" style={{ background: 'transparent' }} />

      {/* Subheadline */}
      <h2
        className="absolute top-[368px] left-[120px] -translate-y-full text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#ededed]"
        style={{ top: '400px', width: '390px' }}
      >
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </h2>

      {/* Solution label */}
      <div
        className="absolute top-[790px] left-[140px] flex items-center gap-[41px]"
        style={{ left: '140px', top: '790px' }}
      >
        <div className="relative flex h-[200px] w-[200px] items-center justify-center" style={{ left: -55, top: -25 }}>
          <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
        </div>
        <h1
          className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]"
          style={{ left: '-100px', position: 'relative', top: '-20px' }}
        >
          {solutionLabel}
        </h1>
      </div>

      {/* Title */}
      <div className="absolute top-[1260px] left-[240px] w-[1300px]" style={{ top: '1260px', width: '1300px' }}>
        <p className="text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(title)}
        </p>
      </div>

      {/* Solution cards */}
      <div className="absolute top-[1770px] left-[240px] w-[1379px] rounded-[80px] shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
        <Accordion
          className="space-y-0 overflow-hidden rounded-[80px]"
          collapsible
          defaultValue={entries.find(entry => entry.expanded)?.id ?? entries[0]?.id ?? 'item-1'}
          style={{ backgroundColor: '#ededed' }}
          type="single"
        >
          {entries.map((item, index) => {
            const overridePalette =
              index === 1
                ? { body: '#6DCFF6', header: '#6DCFF6', text: '#14477d' }
                : index === 2
                  ? { body: '#1B75BC', header: '#1B75BC', text: '#ededed' }
                  : index === 3
                    ? { body: '#14477D', header: '#14477D', text: '#ededed' }
                    : undefined;
            const palette = overridePalette ?? palettes[item.color ?? 'white'];
            const hasContent = Boolean(item.contentList?.length);
            const roundedClass =
              index === 0 ? 'rounded-t-[80px]' : index === entries.length - 1 ? 'rounded-b-[80px]' : 'rounded-none';
            const triggerRoundedClass =
              index === 0 ? 'rounded-t-[50px]' : index === entries.length - 1 ? 'rounded-b-[50px]' : 'rounded-none';

            const prevOverride =
              index > 0
                ? index - 1 === 1
                  ? { body: '#6DCFF6', header: '#6DCFF6', text: '#14477d' }
                  : index - 1 === 2
                    ? { body: '#1B75BC', header: '#1B75BC', text: '#ededed' }
                    : index - 1 === 3
                      ? { body: '#14477D', header: '#14477D', text: '#ededed' }
                      : undefined
                : undefined;
            const prevPalette =
              prevOverride ?? (index > 0 ? palettes[entries[index - 1]?.color ?? 'white'] : undefined);

            return (
              <AccordionItem
                className={`relative overflow-hidden border-none ${roundedClass}`}
                key={item.id}
                style={index === entries.length - 1 ? { backgroundColor: palette.header } : undefined}
                value={item.id}
              >
                {index > 0 ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 right-0 left-0 h-[50px]"
                    style={{ backgroundColor: prevPalette?.header, zIndex: 0 }}
                  />
                ) : null}
                <AccordionTrigger
                  className={`group/accordion-trigger relative z-[1] flex h-[120px] min-h-[240px] items-center px-[80px] text-left text-[52px] leading-[1.4] tracking-[-2.6px] transition-none hover:no-underline focus-visible:outline-none ${triggerRoundedClass}`}
                  indicator={<PlusMinusIcon color={palette.text} />}
                  style={{
                    backgroundColor: palette.header,
                    borderBottomLeftRadius: index === entries.length - 1 ? '50px' : undefined,
                    borderBottomRightRadius: index === entries.length - 1 ? '50px' : undefined,
                    borderTopLeftRadius: '50px',
                    borderTopRightRadius: '50px',
                    color: palette.text,
                    paddingBottom: '20px',
                    paddingTop: '30px',
                  }}
                >
                  <div className="flex flex-1 items-center gap-[40px]">
                    <span>{renderRegisteredMark(item.number)}</span>
                    <span className="text-left">{renderRegisteredMark(item.title)}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="[&>div]:pb-0">
                  {hasContent ? (
                    <div
                      className="px-[80px] pt-[50px] pb-[120px] pl-[218px]"
                      style={{
                        backgroundColor: palette.body,
                        color: palette.text,
                        paddingLeft: '210px',
                        paddingTop: '35px',
                      }}
                    >
                      <ul className="space-y-[16px] text-[52px] leading-[1.4] tracking-[-2.6px]">
                        {item.contentList?.map(bullet => (
                          <li
                            className="list-disc"
                            key={bullet}
                            style={{ marginBottom: '0px', marginInlineStart: '70px', paddingInlineStart: '15px' }}
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          maskImage:
            'linear-gradient(#fff 0%, #fff calc(100% - 140px), transparent calc(100% - 75px), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(#fff 0%, #fff calc(100% - 10px), transparent calc(100% - 75px), transparent 100%)',
        }}
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

      {/* Navigation arrows */}
      <div
        aria-label="Previous"
        className="absolute top-[1755px] right-[120px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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
        <ArrowUp aria-hidden="true" className="h-full w-full text-[#6DCFF6]" focusable="false" strokeWidth={1.5} />
      </div>
      <div
        aria-label="Next"
        className="absolute top-[1980px] right-[120px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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
        <ArrowDown aria-hidden="true" className="h-full w-full text-[#6DCFF6]" focusable="false" strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default SolutionFourthScreenTemplate;

const PlusMinusIcon = ({ color }: { readonly color: string }) => {
  return (
    <span aria-hidden className="relative block h-[72px] w-[72px]" style={{ color }}>
      <Minus
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity group-data-[state=open]/accordion-trigger:opacity-100"
        strokeWidth={1.5}
      />
      <Plus
        className="absolute inset-0 h-full w-full transition-opacity group-data-[state=open]/accordion-trigger:opacity-0"
        strokeWidth={1.5}
      />
    </span>
  );
};

const PhotoDiamond = ({
  className,
  imageAlt = 'Solution highlight diamond photo',
  imageSrc,
}: {
  readonly className: string;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
}) => {
  const shouldOverride = !imageSrc || imageSrc.includes('2f62e81abe58763bf6bdbf710843b3c886f19583');
  const resolvedSrc = shouldOverride ? DEFAULT_PHOTO_DIAMOND_SRC : imageSrc;

  return (
    <div className={className}>
      <div className="relative size-full rotate-[45deg] overflow-hidden rounded-[160px]">
        {resolvedSrc ? (
          <Image alt={imageAlt} className="-rotate-[45deg] object-cover" fill sizes="520px" src={resolvedSrc} />
        ) : (
          <div className="h-full w-full -rotate-[45deg] bg-[#6dcff6]" />
        )}
      </div>
    </div>
  );
};
