'use client';

import { ArrowLeft } from 'lucide-react';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';
import BlueDot from '@/components/ui/icons/Kiosks/HardCoded/BlueDot';
import InnerRing from '@/components/ui/icons/Kiosks/HardCoded/InnerRing';
import OuterRing from '@/components/ui/icons/Kiosks/HardCoded/OuterRing';

const defaultEyebrow = ['IT assets &', 'data centers'];
const defaultHeadline = 'Centralized management of services via API';
const defaultDescription = 'Explore each section to learn how Iron Mountain can transform your enterprise';
const defaultBackLabel = 'Back';
const defaultTapToBeginLabel = 'Tap to begin';
const defaultVideoSrc = '/images/kiosks/kiosk3/04-custom-interactive/CU-Video1-Full.mp4';

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

  const rawHeadline = Array.isArray(headline) ? headline.join('\n') : headline ?? '';
  const headlineText = rawHeadline.replace(
    'Centralized management of services via API',
    'Centralized management\nof services via API'
  );

  const rawDescription = Array.isArray(description) ? description.join('\n') : description ?? '';
  const descriptionText = rawDescription.replace(
    'Explore each section to learn how Iron Mountain can transform your enterprise',
    'Explore each section to learn\nhow Iron Mountain can\ntransform your enterprise'
  );

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5896:13301">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b75bc] to-[#0a2f5c]" />

      {/* Diamond video */}
      <div className="pointer-events-none absolute left-[50px] bottom-[-1000px] h-[2500px] w-[2500px] rotate-[45deg] overflow-hidden rounded-[200px] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 -rotate-[45deg] h-full w-full">
          <video
            autoPlay
            className="relative left-[480px] h-full w-full origin-center scale-[1.45] object-cover"
            loop
            muted
            playsInline
            poster={backgroundImageSrc}
            src={defaultVideoSrc}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </div>
      </div>

      <div className="absolute left-[120px] top-[240px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-white whitespace-pre-line">
        {renderRegisteredMark(eyebrowText)}
      </div>

      <div className="absolute left-[240px] top-[820px] max-w-[1200px] text-white">
        <h1 className="mb-[40px] text-[100px] font-bold leading-[1.3] tracking-[-5px] whitespace-pre-line">
          {renderRegisteredMark(headlineText)}
        </h1>
        <p className="relative top-[190px] text-[52px] font-normal leading-[1.4] tracking-[-2.6px] text-white/90 whitespace-pre-line">
          {renderRegisteredMark(descriptionText)}
        </p>
      </div>

      <div className="absolute right-[120px] top-[240px]">
        <button
          className="relative top-[1070px] flex h-[200px] items-center gap-[20px] rounded-[1000px] bg-[#ededed] px-[120px] text-[54px] font-normal leading-[1.4] tracking-[-2px] text-[#14477d] transition hover:scale-[1.01]"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft aria-hidden className="h-[32px] w-[32px]" color="#14477d" strokeWidth={2} />
          {renderRegisteredMark(backLabel)}
        </button>
      </div>

      <div className="absolute left-1/2 top-[43.5%] h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2">
        <button
          className="relative flex h-full w-full items-center justify-center rounded-full transition hover:scale-[1.05]"
          onClick={onTapToBegin}
          type="button"
        >
          <OuterRing className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2" />
          <InnerRing className="absolute left-1/2 top-1/2 h-[730px] w-[730px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 rounded-full bg-transparent" />
          <div className="absolute inset-[20px] rounded-full bg-transparent" />
          <span className="relative top-[5px] z-10 text-[80px] font-normal leading-[1.2] tracking-[-4px] text-white">
            {renderRegisteredMark(tapToBeginLabel)}
          </span>
          <div
            className="absolute"
            style={{ top: '48%', left: '50%', transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
          <div
            className="absolute"
            style={{ top: '50%', left: '53%', transform: 'translate(-50%, -50%) rotate(60deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
          <div
            className="absolute"
            style={{ top: '49%', left: '53%', transform: 'translate(-50%, -50%) rotate(120deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
          <div
            className="absolute"
            style={{ top: '52%', left: '50%', transform: 'translate(-50%, -50%) rotate(180deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
          <div
            className="absolute"
            style={{ top: '50%', left: '47%', transform: 'translate(-50%, -50%) rotate(240deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
          <div
            className="absolute"
            style={{ top: '50%', left: '47%', transform: 'translate(-50%, -50%) rotate(300deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
        </button>
      </div>
    </div>
  );
}
