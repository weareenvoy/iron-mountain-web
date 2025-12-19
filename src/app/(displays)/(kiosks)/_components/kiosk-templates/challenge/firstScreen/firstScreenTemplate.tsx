'use client';

import { Diamond } from 'lucide-react';
import { DEFAULT_KIOSK_ID, type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import renderRegisteredMark from '../utils/renderRegisteredMark';

export type FirstScreenTemplateProps = Readonly<{
  challengeLabel?: string;
  kioskId?: KioskId;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  problemDescription?: string;
  savingsAmount?: string;
  savingsDescription?: string;
  subheadline?: string | string[];
  videoSrc?: string;
}>;

export const FirstScreenTemplate = ({
  challengeLabel = 'Challenge',
  kioskId = DEFAULT_KIOSK_ID,
  onNavigateDown,
  onNavigateUp,
  problemDescription = 'The Museum needed a secure, off-site, cloud-accessible, and easily managed solution to protect its one-of-a-kind, irreplaceable footage. Storing the only master copy locally presented a high risk of losing all assets in the event of a data failure or system crash.',
  savingsAmount = '120 TB',
  savingsDescription = 'of data is safely stored and accessible for the Museum.',
  subheadline = 'Rich media &\n cultural heritage',
  videoSrc = '/images/kiosks/kiosk1/01-challenge/Challenge-Header.mp4',
}: FirstScreenTemplateProps) => {
  return (
    <div
      // className={styles.container}
      className="group/kiosk relative flex h-screen w-full flex-col overflow-visible bg-black"
      data-kiosk={kioskId}
      data-node-id="5168:9882"
    >
      {/* Background gradient - stays behind all content */}
      <div className="pointer-events-none absolute inset-0 z-[0] h-[15630px] bg-[linear-gradient(180deg,#1B75BC_0.01%,#14477D_98%)] rounded-t-[100px] top-[1290px]" />

      {/* Video Header Section */}
      <div className="relative flex h-[1291px] w-full flex-col items-center justify-center overflow-hidden">
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover object-center"
          controlsList="nodownload"
          data-scroll-section="challenge-first-video"
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-black/20" />

        {/* Subheadline */}
        <div className="relative z-[2] px-[120px] pb-[400px]">
          <h2 className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
            {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
          </h2>
        </div>
      </div>

      {/* Challenge Label Section */}
      <div className="relative z-[2] flex items-center gap-[41px] px-[128px] pt-[80px] pb-[200px]">
        <div className="relative mr-[5px] flex h-[110px] w-[110px] items-center justify-center">
          <Diamond aria-hidden="true" className="h-full w-full text-[#ededed]" focusable="false" strokeWidth={1.25} />
        </div>
        <h1 className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
          {renderRegisteredMark(challengeLabel)}
        </h1>
      </div>

      {/* Problem Description Section */}
      <div className="relative z-[2] px-[120px] py-[150px]">
        <p className="max-w-[1390px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-white group-data-[kiosk=kiosk-2]/kiosk:leading-[1.3] group-data-[kiosk=kiosk-3]/kiosk:text-[80px] group-data-[kiosk=kiosk-3]/kiosk:tracking-[-4px]">
          {renderRegisteredMark(problemDescription)}
        </p>
      </div>

      {/* Savings Metrics Section */}
      <div className="relative z-[2] flex w-full flex-col items-center px-[120px] py-[300px]">
        <span className="text-center text-[400px] leading-[1.3] font-[300] tracking-[-20px] whitespace-nowrap text-[#6dcff6]">
          {renderRegisteredMark(savingsAmount)}
        </span>
        <p className="mt-[-40px] text-center text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#6dcff6] group-data-[kiosk=kiosk-2]/kiosk:leading-[1.3] group-data-[kiosk=kiosk-3]/kiosk:leading-[1.3]">
          {renderRegisteredMark(savingsDescription)}
        </p>
      </div>
    </div>
  );
};

FirstScreenTemplate.displayName = 'FirstScreenTemplate';

export default FirstScreenTemplate;
