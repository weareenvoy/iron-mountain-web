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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigateDown: _onNavigateDown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigateUp: _onNavigateUp,
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
      <div className="pointer-events-none absolute inset-0 top-[1290px] z-[1] h-[14400px] rounded-[100px] bg-[linear-gradient(180deg,#1B75BC_0.01%,#14477D_98%)] group-data-[kiosk=kiosk-2]/kiosk:top-[1240px]" />

      {/* Video Header Section */}
      <div className="relative flex h-[1284px] w-full flex-col items-center justify-center px-[120px] py-[200px]">
        <video
          autoPlay
          className="absolute inset-0 top-[230px] h-full w-full object-cover object-center"
          controlsList="nodownload"
          data-scroll-section="challenge-first-video"
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 top-[230px] bg-black/20" />

        {/* Subheadline */}
        <div className="relative top-[120px] left-[-760px] z-[2] px-[120px] pb-[400px] group-data-[kiosk=kiosk-3]/kiosk:top-[50px] group-data-[kiosk=kiosk-3]/kiosk:left-[-800px]">
          <h2 className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
            {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
          </h2>
        </div>
      </div>

      {/* Challenge Label Section */}
      <div className="relative top-[-400px] z-[2] flex items-center gap-[41px] px-[128px] pb-[200px] group-data-[kiosk=kiosk-2]/kiosk:top-[-260px] group-data-[kiosk=kiosk-2]/kiosk:left-[10px] group-data-[kiosk=kiosk-3]/kiosk:top-[-320px] group-data-[kiosk=kiosk-3]/kiosk:left-[10px]">
        <div className="relative mr-[5px] flex h-[110px] w-[110px] items-center justify-center">
          <Diamond aria-hidden="true" className="h-full w-full text-[#ededed]" focusable="false" strokeWidth={1.25} />
        </div>
        <h1 className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
          {renderRegisteredMark(challengeLabel)}
        </h1>
      </div>

      {/* Problem Description Section */}
      <div className="relative top-[-70px] left-[-10px] z-[2] px-[120px] group-data-[kiosk=kiosk-2]/kiosk:top-[-150px] group-data-[kiosk=kiosk-2]/kiosk:left-[10px] group-data-[kiosk=kiosk-3]/kiosk:top-[-210px] group-data-[kiosk=kiosk-3]/kiosk:left-[0]">
        <p className="max-w-[1380px] text-[80px] leading-[1.4] font-normal tracking-[-4px] text-white">
          {renderRegisteredMark(problemDescription)}
        </p>
      </div>

      {/* Savings Metrics Section */}
      <div className="relative top-[-85px] left-[-505px] z-[2] flex w-full flex-col items-center py-[490px] group-data-[kiosk=kiosk-2]/kiosk:top-[-220px] group-data-[kiosk=kiosk-2]/kiosk:left-[-490px] group-data-[kiosk=kiosk-3]/kiosk:top-[70px] group-data-[kiosk=kiosk-3]/kiosk:left-[-400px]">
        <span className="text-center text-[400px] leading-[1.3] font-[300] tracking-[-20px] whitespace-nowrap text-[#6dcff6]">
          {renderRegisteredMark(savingsAmount)}
        </span>
        <p className="relative top-[40px] left-[-20px] mt-[-40px] w-[1030px] text-[60px] leading-[1.3] font-normal tracking-[-3px] whitespace-pre-line text-[#6dcff6] group-data-[kiosk=kiosk-2]/kiosk:top-[30px] group-data-[kiosk=kiosk-2]/kiosk:left-[60px] group-data-[kiosk=kiosk-3]/kiosk:top-[50px] group-data-[kiosk=kiosk-3]/kiosk:left-[-20px] group-data-[kiosk=kiosk-3]/kiosk:w-[1070px]">
          {renderRegisteredMark(savingsDescription)}
        </p>
      </div>
    </div>
  );
};

FirstScreenTemplate.displayName = 'FirstScreenTemplate';

export default FirstScreenTemplate;
