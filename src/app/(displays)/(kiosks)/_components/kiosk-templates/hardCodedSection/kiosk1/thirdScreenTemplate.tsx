'use client';

import Image from 'next/image';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

const defaultEyebrow = ['Rich media &', 'cultural heritage'];
const defaultHeadline = 'Digitization and remediation';
const defaultDescription =
  'Physical media is digitized to archival standards, with restoration applied as needed and metadata extracted to ensure assets are searchable, playable, and accessible.';
const defaultBackLabel = 'Back';

export interface HardCodedKiosk1ThirdScreenTemplateProps {
  backLabel?: string;
  description?: string | string[];
  eyebrow?: string | string[];
  headline?: string | string[];
  iconImageAlt?: string;
  iconImageSrc?: string;
  onBack?: () => void;
  panelBackgroundColor?: string;
}

export default function HardCodedKiosk1ThirdScreenTemplate({
  backLabel = defaultBackLabel,
  description = defaultDescription,
  eyebrow = defaultEyebrow,
  headline = defaultHeadline,
  iconImageAlt = 'Digitization and remediation illustration',
  iconImageSrc = '/images/kiosks/kiosk1/04-custom-interactive/Illustrations/Digitization and remediation.webp',
  onBack,
  panelBackgroundColor = '#97E9FF',
}: HardCodedKiosk1ThirdScreenTemplateProps) {
  const eyebrowText = Array.isArray(eyebrow) ? eyebrow.join('\n') : eyebrow;
  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;
  const descriptionText = Array.isArray(description) ? description.join('\n') : description;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5896-12402">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b75bc] to-[#0a2f5c]" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[50px]" />
      </div>

      <div className="absolute left-[120px] top-[240px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed] whitespace-pre-line">
        {renderRegisteredMark(eyebrowText)}
      </div>

      <div
        className="absolute left-[120px] top-[1160px] w-[1920px] rounded-[80px] p-[120px]"
        style={{ backgroundColor: panelBackgroundColor }}
      >
        <div className="flex items-center justify-between">
          <button
            className="flex h-[200px] items-center gap-[30px] rounded-[1000px] bg-[#ededed] px-[90px] text-[54px] font-normal leading-[1.4] tracking-[-2.7px] text-[#14477d] transition hover:scale-[1.01]"
            onClick={onBack}
            type="button"
          >
            <span className="flex h-[55px] w-[55px] items-center justify-center rounded-full border border-[#14477d]">
              <svg
                aria-hidden="true"
                className="h-6 w-6"
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

        <div className="mt-[200px] max-w-[1270px] text-[#14477d]">
          <p className="text-[100px] font-normal leading-[1.3] tracking-[-5px]">{renderRegisteredMark(headlineText)}</p>
          <p className="mt-[100px] text-[60px] font-normal leading-[1.4] tracking-[-3px]">
            {renderRegisteredMark(descriptionText)}
          </p>
        </div>

        <div className="mt-[200px] flex items-center justify-center">
          <div className="relative h-[640px] w-[640px] rotate-[45deg] rounded-[120px] border-[8px] border-[#ededed]/80">
            <div className="absolute inset-0 rounded-[112px] bg-white/10" />
            <div className="absolute inset-[60px] -rotate-[45deg] flex items-center justify-center">
              <Image
                alt={iconImageAlt}
                className="object-contain"
                height={360}
                src={iconImageSrc}
                width={360}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


