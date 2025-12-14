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
  readonly backgroundImageSrc?: string;
  readonly backLabel?: string;
  readonly description?: string | string[];
  readonly eyebrow?: string | string[];
  readonly headline?: string | string[];
  readonly onBack?: () => void;
  readonly onTapToBegin?: () => void;
  readonly tapToBeginLabel?: string;
}

const HardCodedKiosk3SecondScreenTemplate = ({
  backgroundImageSrc,
  backLabel = defaultBackLabel,
  description = defaultDescription,
  eyebrow = defaultEyebrow,
  headline = defaultHeadline,
  onBack,
  onTapToBegin,
  tapToBeginLabel = defaultTapToBeginLabel,
}: HardCodedKiosk3SecondScreenTemplateProps) => {
  const eyebrowText = Array.isArray(eyebrow) ? eyebrow.join('\n') : eyebrow;

  const rawHeadline = Array.isArray(headline) ? headline.join('\n') : headline;
  const headlineText = rawHeadline.replace(
    'Centralized management of services via API',
    'Centralized management\nof services via API'
  );

  const rawDescription = Array.isArray(description) ? description.join('\n') : description;
  const descriptionText = rawDescription.replace(
    'Explore each section to learn how Iron Mountain can transform your enterprise',
    'Explore each section to learn\nhow Iron Mountain can\ntransform your enterprise'
  );

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5896:13301">
      <div className="absolute inset-0 bg-transparent" style={{ background: 'transparent' }} />

      {/* Diamond video */}
      <div className="pointer-events-none absolute bottom-[-1000px] left-[50px] h-[2500px] w-[2500px] rotate-[45deg] overflow-hidden rounded-[200px] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 h-full w-full -rotate-[45deg]">
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

      <div className="absolute top-[240px] left-[120px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-white">
        {renderRegisteredMark(eyebrowText)}
      </div>

      <div className="absolute top-[820px] left-[240px] max-w-[1200px] text-white">
        <h1 className="mb-[40px] text-[100px] leading-[1.3] font-bold tracking-[-5px] whitespace-pre-line">
          {renderRegisteredMark(headlineText)}
        </h1>
        <p className="relative top-[190px] text-[52px] leading-[1.4] font-normal tracking-[-2.6px] whitespace-pre-line text-white/90">
          {renderRegisteredMark(descriptionText)}
        </p>
      </div>

      <div className="absolute top-[240px] right-[120px]">
        <button
          className="relative top-[1070px] flex h-[200px] items-center gap-[20px] rounded-[1000px] bg-[#ededed] px-[120px] text-[54px] leading-[1.4] font-normal tracking-[-2px] text-[#14477d] transition hover:scale-[1.01]"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft aria-hidden className="h-[32px] w-[32px]" color="#14477d" strokeWidth={2} />
          {renderRegisteredMark(backLabel)}
        </button>
      </div>

      <div className="absolute top-[43.5%] left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2">
        <button
          className="relative flex h-full w-full items-center justify-center rounded-full transition hover:scale-[1.05]"
          onClick={onTapToBegin}
          type="button"
        >
          <OuterRing className="absolute top-1/2 left-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2" />
          <InnerRing className="absolute top-1/2 left-1/2 h-[730px] w-[730px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 rounded-full bg-transparent" />
          <div className="absolute inset-[20px] rounded-full bg-transparent" />
          <span className="relative top-[5px] z-10 text-[80px] leading-[1.2] font-normal tracking-[-4px] text-white">
            {renderRegisteredMark(tapToBeginLabel)}
          </span>
          <div
            className="absolute"
            style={{ left: '50%', top: '48%', transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
          <div
            className="absolute"
            style={{ left: '53%', top: '50%', transform: 'translate(-50%, -50%) rotate(60deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
          <div
            className="absolute"
            style={{ left: '53%', top: '49%', transform: 'translate(-50%, -50%) rotate(120deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
          <div
            className="absolute"
            style={{ left: '50%', top: '52%', transform: 'translate(-50%, -50%) rotate(180deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
          <div
            className="absolute"
            style={{ left: '47%', top: '50%', transform: 'translate(-50%, -50%) rotate(240deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
          <div
            className="absolute"
            style={{ left: '47%', top: '50%', transform: 'translate(-50%, -50%) rotate(300deg) translateY(-430px)' }}
          >
            <BlueDot className="h-[60px] w-[60px]" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default HardCodedKiosk3SecondScreenTemplate;
