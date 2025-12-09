'use client';

import Image from 'next/image';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

const defaultEyebrow = ['IT assets &', 'data centers'];
const defaultHeadline = 'Centralized management of services via API';
const defaultDescription = 'Explore each section to learn how Iron Mountain can transform your enterprise';
const defaultBackLabel = 'Back';
const defaultTapToBeginLabel = 'Tap to begin';

export interface HardCodedKiosk3SecondScreenTemplateProps {
  backLabel?: string;
  backgroundImageSrc?: string;
  description?: string | string[];
  eyebrow?: string | string[];
  headline?: string | string[];
  onBack?: () => void;
  onTapToBegin?: () => void;
  tapToBeginLabel?: string;
}

export default function HardCodedKiosk3SecondScreenTemplate({
  backLabel = defaultBackLabel,
  backgroundImageSrc,
  description = defaultDescription,
  eyebrow = defaultEyebrow,
  headline = defaultHeadline,
  onBack,
  onTapToBegin,
  tapToBeginLabel = defaultTapToBeginLabel,
}: HardCodedKiosk3SecondScreenTemplateProps) {
  const eyebrowText = Array.isArray(eyebrow) ? eyebrow.join('\n') : eyebrow;
  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;
  const descriptionText = Array.isArray(description) ? description.join('\n') : description;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5896:13301">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b75bc] to-[#0a2f5c]" />

      {backgroundImageSrc && (
        <div className="absolute bottom-0 right-0 h-[60%] w-[50%] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/60" />
          <Image
            alt="Enterprise technology professional"
            className="object-cover"
            src={backgroundImageSrc}
            fill
            sizes="960px"
          />
        </div>
      )}

      <div className="absolute left-[120px] top-[240px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-white whitespace-pre-line">
        {renderRegisteredMark(eyebrowText)}
      </div>

      <div className="absolute left-[120px] top-[400px] max-w-[1200px] text-white">
        <h1 className="text-[80px] font-bold leading-[1.2] tracking-[-4px] mb-[40px]">
          {renderRegisteredMark(headlineText)}
        </h1>
        <p className="text-[40px] font-normal leading-[1.4] tracking-[-2px] text-white/90">
          {renderRegisteredMark(descriptionText)}
        </p>
      </div>

      <div className="absolute right-[120px] top-[240px]">
        <button
          className="flex h-[120px] items-center gap-[20px] rounded-[1000px] bg-[#ededed] px-[60px] text-[40px] font-normal leading-[1.4] tracking-[-2px] text-[#14477d] transition hover:scale-[1.01]"
          onClick={onBack}
          type="button"
        >
          <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#14477d]">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 6l-6 6 6 6" stroke="#14477d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </span>
          {renderRegisteredMark(backLabel)}
        </button>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          className="relative flex h-[300px] w-[300px] items-center justify-center rounded-full transition hover:scale-[1.05]"
          onClick={onTapToBegin}
          type="button"
        >
          <div className="absolute inset-0 rounded-full border-[8px] border-[#6dcff6] bg-[#1b75bc]" />
          <div className="absolute inset-[20px] rounded-full bg-[#05254b]" />
          <span className="relative z-10 text-[36px] font-normal leading-[1.2] tracking-[-1.8px] text-white">
            {renderRegisteredMark(tapToBeginLabel)}
          </span>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute h-[16px] w-[16px] rounded-full bg-[#6dcff6]"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-180px)`,
              }}
            />
          ))}
        </button>
      </div>
    </div>
  );
}
