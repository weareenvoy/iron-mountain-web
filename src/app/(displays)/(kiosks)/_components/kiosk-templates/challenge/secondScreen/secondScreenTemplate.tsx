'use client';

import { Diamond } from 'lucide-react';
import Image from 'next/image';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export type SecondScreenTemplateProps = {
  readonly item1Body?: string;
  readonly item1Image?: string;
  readonly kioskId?: KioskId;
  readonly labelText?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly subheadline?: string;
};

const SecondScreenTemplate = ({ item1Body, item1Image, labelText, subheadline }: SecondScreenTemplateProps) => {
  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-x-hidden overflow-y-auto scroll-smooth bg-transparent"
      data-hero-image={item1Image}
      data-scroll-section="main-description"
    >
      {/* Background gradient layer */}
      <div className="pointer-events-none absolute inset-0 z-[0] bg-transparent" />

      {/* Decorative background diamond */}
      <div className="pointer-events-none absolute top-[1960px] left-[-400px] z-[1] size-[1400px] group-data-[kiosk=kiosk-2]/kiosk:top-[2420px] group-data-[kiosk=kiosk-2]/kiosk:left-[-350px] group-data-[kiosk=kiosk-2]/kiosk:size-[1350px] group-data-[kiosk=kiosk-3]/kiosk:top-[1610px] group-data-[kiosk=kiosk-3]/kiosk:left-[-360px] group-data-[kiosk=kiosk-3]/kiosk:size-[1350px]">
        {item1Image && (
          <Image
            alt="Large decorative background diamond"
            className="clip-diamond-rounded object-cover"
            fill
            quality={75} // All decorative images are 75 quality, the text is the main focus not the image. 75 is a good balance between quality and performance.
            sizes="1506px"
            src={item1Image}
          />
        )}
      </div>

      {/* Main Description - SCROLLABLE */}
      <div className="relative top-[1660px] left-[640px] z-[2] px-[120px] py-[250px] group-data-[kiosk=kiosk-3]/kiosk:top-[290px]">
        <p
          className="max-w-[1000px] text-[60px] leading-[1.3] font-normal tracking-[-3px] text-white group-data-[kiosk=kiosk-2]/kiosk:w-[1100px] group-data-[kiosk=kiosk-3]/kiosk:max-w-[1100px]"
        >
          {renderRegisteredMark(item1Body)}
        </p>
      </div>
    </div>
  );
};

export default SecondScreenTemplate;
