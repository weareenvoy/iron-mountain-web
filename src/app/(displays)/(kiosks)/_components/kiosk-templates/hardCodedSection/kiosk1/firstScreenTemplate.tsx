'use client';

import { useEffect, useId, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

const defaultEyebrow = ['Rich media &', 'cultural heritage'];
const defaultHeadline = 'From archive to access';
const defaultDescription = 'Explore each section to learn how Iron Mountain can transform your enterprise';
const defaultBackCtaLabel = 'Back to menu';
const defaultSlides: CarouselSlideConfig[] = [
  { id: 'intake', title: 'Intake', subtitle: 'and assessment' },
  { id: 'digitization', title: 'Digitization', subtitle: 'and remediation' },
  { id: 'preservation', title: 'Digital', subtitle: 'Preservation', highlight: true },
  { id: 'search', title: 'Search and', subtitle: 'discover' },
  { id: 'share', title: 'Share, stream', subtitle: 'and monetize' },
];

export type CarouselSlideConfig = {
  highlight?: boolean;
  id?: string;
  subtitle?: string;
  title: string;
};

export interface HardCodedKiosk1FirstScreenTemplateProps {
  backCtaLabel?: string;
  backgroundEndColor?: string;
  backgroundStartColor?: string;
  carouselId?: string;
  description?: string | string[];
  eyebrow?: string | string[];
  headline?: string | string[];
  onBackToMenu?: () => void;
  slides?: CarouselSlideConfig[];
}

const ArrowButton = ({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
}) => (
  <button
    aria-label={direction === 'prev' ? 'Previous' : 'Next'}
    className="flex h-[64px] w-[64px] items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white/10"
    onClick={onClick}
    type="button"
  >
    <svg
      className={`h-6 w-6 ${direction === 'prev' ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  </button>
);

const BackButton = ({ label, onClick }: { label: string | React.ReactNode; onClick?: () => void }) => (
  <button
    className="flex h-[200px] items-center gap-8 rounded-[1000px] border border-white/60 px-[90px] text-[55px] font-normal leading-[1.2] tracking-[-2.7px] text-white transition hover:bg-white/10"
    onClick={onClick}
    type="button"
  >
    <span className="flex h-[55px] w-[55px] items-center justify-center rounded-full border border-white/60">
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </span>
    {typeof label === 'string' ? renderRegisteredMark(label) : label}
  </button>
);

const Diamond = ({
  label,
  secondaryLabel,
  highlight,
}: {
  highlight?: boolean;
  label: string;
  secondaryLabel?: string;
}) => (
  <div
    className={`relative flex h-[320px] w-[320px] items-center justify-center rounded-[64px] border ${
      highlight ? 'border-[#ededed] bg-white text-[#14477d]' : 'border-white/30 bg-white/0 text-white'
    } rotate-[45deg] shadow-[0_30px_80px_rgba(0,0,0,0.35)]`}
  >
    <div className="flex -rotate-[45deg] flex-col items-center justify-center px-8 text-center">
      <p className="text-[48px] font-normal leading-[1.2] tracking-[-2.4px]">{renderRegisteredMark(label)}</p>
      {secondaryLabel ? (
        <p className="text-[32px] font-normal leading-[1.2] tracking-[-1.6px]">{renderRegisteredMark(secondaryLabel)}</p>
      ) : null}
      {highlight ? (
        <div className="mt-6 flex h-[48px] w-[48px] items-center justify-center rounded-full border border-[#14477d] bg-transparent">
          <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3v10M3 8h10" stroke="#14477d" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </div>
      ) : null}
    </div>
  </div>
);

export default function HardCodedKiosk1FirstScreenTemplate({
  backCtaLabel = defaultBackCtaLabel,
  backgroundEndColor = '#0a2f5c',
  backgroundStartColor = '#1b75bc',
  carouselId,
  description = defaultDescription,
  eyebrow = defaultEyebrow,
  headline = defaultHeadline,
  onBackToMenu,
  slides,
}: HardCodedKiosk1FirstScreenTemplateProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const controller = useKioskController();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', dragFree: true });
  const componentId = useId();
  const resolvedCarouselId = carouselId ?? `hardcoded-k1-first-${componentId}`;

  const slidesToRender = slides && slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    controller.register(resolvedCarouselId, {
      next: () => {
        if (emblaApi && emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
          return true;
        }
        return false;
      },
      prev: () => {
        if (emblaApi && emblaApi.canScrollPrev()) {
          emblaApi.scrollPrev();
          return true;
        }
        return false;
      },
    });
    return () => controller.unregister(resolvedCarouselId);
  }, [controller, emblaApi, resolvedCarouselId]);

  const handlePrev = () => {
    if (emblaApi && emblaApi.canScrollPrev()) {
      emblaApi.scrollPrev();
    } else {
      controller.prev();
    }
  };

  const handleNext = () => {
    if (emblaApi && emblaApi.canScrollNext()) {
      emblaApi.scrollNext();
    } else {
      controller.next();
    }
  };

  const eyebrowText = Array.isArray(eyebrow) ? eyebrow.join('\n') : eyebrow;
  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;
  const descriptionText = Array.isArray(description) ? description.join('\n') : description;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5893:7489">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${backgroundStartColor} 0%, ${backgroundEndColor} 100%)`,
        }}
      />

      <div className="absolute left-[120px] top-[240px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed] whitespace-pre-line">
        {renderRegisteredMark(eyebrowText)}
      </div>

      <div className="absolute left-[240px] top-[820px] text-[100px] font-normal leading-[1.3] tracking-[-5px] text-[#ededed]">
        {renderRegisteredMark(headlineText)}
      </div>

      <p className="absolute left-[240px] top-[1310px] w-[660px] text-[52px] font-normal leading-[1.4] tracking-[-2.6px] text-[#ededed]">
        {renderRegisteredMark(descriptionText)}
      </p>

      <div className="absolute right-[240px] top-[1190px]">
        <BackButton label={renderRegisteredMark(backCtaLabel)} onClick={onBackToMenu} />
      </div>

      <div className="absolute left-[240px] right-[240px] bottom-[420px] flex flex-col items-center gap-[80px]">
        <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex gap-[200px]" style={{ padding: '80px 0' }}>
            {slidesToRender.map((slide, index) => (
              <div className="flex min-w-full flex-col items-center gap-12" key={slide.id ?? `${slide.title}-${index}`}>
                <Diamond highlight label={slide.title} secondaryLabel={slide.subtitle} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-10 text-[40px] font-normal leading-[1.2] tracking-[-2px]">
          {slidesToRender.map((slide, index) => (
            <span
              className={index === selectedIndex ? 'text-white' : 'text-white/50'}
              key={`label-${slide.id ?? `${slide.title}-${index}`}`}
            >
              {renderRegisteredMark(`${slide.title}${slide.subtitle ? ` ${slide.subtitle}` : ''}`)}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-8">
          <ArrowButton direction="prev" onClick={handlePrev} />
          <ArrowButton direction="next" onClick={handleNext} />
        </div>
      </div>
    </div>
  );
}


