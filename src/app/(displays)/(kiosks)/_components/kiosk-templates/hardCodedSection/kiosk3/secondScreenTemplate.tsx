'use client';

import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

const defaultEyebrow = ['Rich media &', 'cultural heritage'];
const defaultHeadline = ['Centralized management', 'of services via API'];
const defaultSectionTitle = 'Data configuration';
const defaultBackLabel = 'Back';
const defaultSteps = [
  'Decommissioning services',
  'Packaging / logistics / transportation',
  'Data sanitization',
  'Lease returns',
  'ITAD',
];

const defaultHeroImageSrc = 'http://localhost:3845/assets/7d3328b5922016537da64d61b7a374afc1baca1d.png';

export interface HardCodedKiosk3SecondScreenTemplateProps {
  backLabel?: string;
  backgroundEndColor?: string;
  backgroundStartColor?: string;
  heroImageAlt?: string;
  heroImageSrc?: string;
  onBack?: () => void;
  onNextStep?: () => void;
  onPrevStep?: () => void;
  sectionHeadline?: string | string[];
  steps?: string[];
  subheadline?: string | string[];
  tapIndicatorLabel?: string;
}

const gradientDefaults = { backgroundEndColor: '#05254b', backgroundStartColor: '#1b75bc' };

export default function HardCodedKiosk3SecondScreenTemplate({
  backLabel = defaultBackLabel,
  backgroundEndColor = gradientDefaults.backgroundEndColor,
  backgroundStartColor = gradientDefaults.backgroundStartColor,
  heroImageAlt = 'API experience visual',
  heroImageSrc = defaultHeroImageSrc,
  onBack,
  onNextStep,
  onPrevStep,
  sectionHeadline = defaultSectionTitle,
  steps = defaultSteps,
  subheadline = defaultHeadline,
  tapIndicatorLabel = '01',
}: HardCodedKiosk3SecondScreenTemplateProps) {
  const eyebrowText = Array.isArray(defaultEyebrow) ? defaultEyebrow.join('\n') : defaultEyebrow;
  const sectionHeadlineText = Array.isArray(sectionHeadline) ? sectionHeadline.join('\n') : sectionHeadline;
  const subheadlineText = Array.isArray(subheadline) ? subheadline.join('\n') : subheadline;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5896:13360">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${backgroundStartColor} 0%, ${backgroundEndColor} 100%)` }}
      />
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[30px]" />

      <div className="absolute left-[120px] top-[240px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]">
        {renderRegisteredMark(eyebrowText)}
      </div>

      <div className="absolute left-[240px] top-[820px] w-[1280px] text-[100px] font-normal leading-[1.3] tracking-[-5px] text-[#ededed] whitespace-pre-line">
        {renderRegisteredMark(subheadlineText)}
      </div>

      <button
        className="absolute left-[240px] top-[1290px] flex h-[200px] items-center gap-[30px] rounded-[1000px] bg-[#ededed] px-[90px] text-[54px] font-normal leading-[1.4] tracking-[-2.7px] text-[#14477d] transition hover:scale-[1.01]"
        onClick={onBack}
        type="button"
      >
        <span className="flex h-[55px] w-[55px] items-center justify-center rounded-full border border-[#14477d]">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path d="M15 6l-6 6 6 6" stroke="#14477d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </span>
        {renderRegisteredMark(backLabel)}
      </button>

      <div className="absolute left-[240px] top-[1640px] w-[1100px] space-y-[60px]">
        <p className="text-[80px] font-normal leading-[1.3] tracking-[-4px] text-white">{renderRegisteredMark(sectionHeadlineText)}</p>
        <ul className="space-y-[24px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-white">
          {steps.map((step) => (
            <li className="flex items-center gap-[30px]" key={step}>
              <span className="inline-block h-[16px] w-[16px] rounded-full border border-[#6dcff6]" />
              <span>{renderRegisteredMark(step)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute right-[260px] top-[1650px] flex flex-col items-center gap-[40px] text-white">
        <div className="flex items-center gap-[24px]">
          <button
            aria-label="Previous"
            className="flex h-[100px] w-[100px] items-center justify-center rounded-full border border-[#6dcff6]/40 text-[#6dcff6]/40"
            onClick={onPrevStep}
            type="button"
          >
            <svg className="h-8 w-8 rotate-180" fill="none" viewBox="0 0 32 32">
              <path d="M12 8l8 8-8 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
          <div className="text-[60px] font-normal">{renderRegisteredMark(tapIndicatorLabel)}</div>
          <button
            aria-label="Next"
            className="flex h-[100px] w-[100px] items-center justify-center rounded-full border border-[#6dcff6] text-[#6dcff6]"
            onClick={onNextStep}
            type="button"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 32 32">
              <path d="M12 8l8 8-8 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute right-[180px] top-[2000px] h-[640px] w-[640px] rotate-[45deg] overflow-hidden rounded-[120px] border border-[#ededed]/40 bg-[#14477d]/90 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <img alt={heroImageAlt} className="h-full w-full -rotate-[45deg] object-cover" src={heroImageSrc} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[-200px] flex justify-center">
        <svg height="600" viewBox="0 0 2160 600" width="2160" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-100 600C200 200 1960 200 2260 600"
            fill="none"
            stroke="rgba(237,237,237,0.35)"
            strokeWidth="140"
          />
        </svg>
      </div>
    </div>
  );
}


