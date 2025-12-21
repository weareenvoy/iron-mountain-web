'use client';

import { Diamond } from 'lucide-react';
import Image from 'next/image';
import { DEFAULT_KIOSK_ID, type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// import styles from './secondScreenTemplate.module.css';

// Asset constants from Figma MCP
const imgHero = '/images/kiosks/kiosk1/02-solution/Solution-Image1-Full.png';
const imgVector = '/images/kiosks/kiosk1/01-challenge/Challenge-Image1-Diamond.png';

export type SecondScreenTemplateProps = Readonly<{
  bottomDescription?: string;
  kioskId?: KioskId;
  largeIconSrc?: string;
  mainDescription?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  subheadline?: string | string[];
  topImageSrc?: string;
}>;

export const SecondScreenTemplate = ({
  bottomDescription = '',
  kioskId = DEFAULT_KIOSK_ID,
  largeIconSrc = imgVector,
  mainDescription = 'The Museum also needed assistance with physical storage for a collection of historical music artifacts.',
  onNavigateDown,
  onNavigateUp,
  subheadline = 'Rich media &\n cultural heritage',
  topImageSrc = imgHero,
}: SecondScreenTemplateProps) => {
  return (
    <div
      // className={styles.container}
      className="group/kiosk relative flex h-screen w-full flex-col overflow-x-hidden overflow-y-auto scroll-smooth bg-transparent"
      data-hero-image={topImageSrc}
      data-kiosk={kioskId}
      data-node-id="5168:9907"
    >
      {/* Background gradient layer */}
      <div className="pointer-events-none absolute inset-0 z-[0] bg-transparent" />

      {/* Decorative background diamond */}
      <div className="pointer-events-none absolute top-[2320px] left-[-460px] z-[1] flex size-[1500px] -scale-y-100 rotate-[180deg] items-center justify-center group-data-[kiosk=kiosk-3]/kiosk:top-[1610px] group-data-[kiosk=kiosk-3]/kiosk:size-[1350px] group-data-[kiosk=kiosk-3]/kiosk:left-[-360px]">
        <div className="relative h-full w-full">
          <Image
            alt="Large decorative background diamond"
            className="object-contain"
            fill
            sizes="1506px"
            src={largeIconSrc}
            style={{ transform: 'scaleX(-1)' }}
            unoptimized
          />
        </div>
      </div>

      {/* Header Section */}
      <div className="relative z-[2] px-[120px] pt-[300px] pb-[150px]">
        <h2 className="mb-[200px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
        </h2>

        <div className="flex items-center gap-[41px] relative top-[180px]">
          <div className="relative mr-[5px] flex h-[120px] w-[120px] items-center justify-center">
            <Diamond aria-hidden="true" className="h-full w-full text-[#ededed]" focusable="false" strokeWidth={1.25} />
          </div>
          <h1 className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
            Challenge
          </h1>
        </div>
      </div>

      {/* Main Description - SCROLLABLE */}
      <div className="relative z-[2] px-[120px] py-[250px] top-[955px] left-[650px] group-data-[kiosk=kiosk-3]/kiosk:top-[290px]">
        <p
          className="max-w-[1000px] text-[60px] leading-[1.4] font-normal tracking-[-2.6px] text-white group-data-[kiosk=kiosk-3]/kiosk:max-w-[1100px] group-data-[kiosk=kiosk-3]/kiosk:tracking-[-2.9px]"
          data-scroll-section="main-description"
        >
          {renderRegisteredMark(mainDescription)}
        </p>
      </div>

      {/* Bottom Description - SCROLLABLE */}
      {bottomDescription && (
        <div className="relative z-[2] px-[120px] py-[300px]">
          <p
            className="max-w-[971px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-white"
            data-scroll-section="bottom-description"
          >
            {renderRegisteredMark(bottomDescription)}
          </p>
        </div>
      )}
    </div>
  );
};

SecondScreenTemplate.displayName = 'SecondScreenTemplate';

export default SecondScreenTemplate;
