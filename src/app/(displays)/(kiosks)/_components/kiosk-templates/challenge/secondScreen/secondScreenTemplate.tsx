'use client';

import { Diamond } from 'lucide-react';
import Image from 'next/image';
import { DEFAULT_KIOSK_ID, type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';

export type SecondScreenTemplateProps = {
  readonly item1Body?: string;
  readonly item1Image?: string;
  readonly kioskId?: KioskId;
  readonly labelText?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly subheadline?: string;
};

const SecondScreenTemplate = ({
  item1Body,
  item1Image,
  kioskId = DEFAULT_KIOSK_ID,
  labelText,
  subheadline,
}: SecondScreenTemplateProps) => {
  return (
    <div
      className="group/kiosk relative flex h-screen w-full flex-col overflow-x-hidden overflow-y-auto scroll-smooth bg-transparent"
      data-hero-image={item1Image}
      data-kiosk={kioskId}
    >
      {/* Background gradient layer */}
      <div className="pointer-events-none absolute inset-0 z-[0] bg-transparent" />

      {/* Decorative background diamond */}
      <div className="pointer-events-none absolute top-[2320px] left-[-460px] z-[1] flex size-[1500px] -scale-y-100 rotate-[180deg] items-center justify-center group-data-[kiosk=kiosk-2]/kiosk:top-[2420px] group-data-[kiosk=kiosk-2]/kiosk:left-[-350px] group-data-[kiosk=kiosk-2]/kiosk:size-[1350px] group-data-[kiosk=kiosk-3]/kiosk:top-[1610px] group-data-[kiosk=kiosk-3]/kiosk:left-[-360px] group-data-[kiosk=kiosk-3]/kiosk:size-[1350px]">
        <div className="relative h-full w-full">
          {item1Image && (
            <Image
              alt="Large decorative background diamond"
              className="-scale-x-100 object-contain"
              fill
              quality={75} // All decorative images are 75 quality, the text is the main focus not the image. 75 is a good balance between quality and performance.
              sizes="1506px"
              src={item1Image}
            />
          )}
        </div>
      </div>

      {/* Header Section */}
      <div className="relative z-[2] px-[120px] pt-[300px] pb-[150px]">
        <h2 className="mb-[200px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(subheadline)}
        </h2>

        <div className="relative top-[180px] flex items-center gap-[41px]">
          <div className="relative mr-[5px] flex h-[120px] w-[120px] items-center justify-center">
            <Diamond aria-hidden="true" className="h-full w-full text-[#ededed]" focusable="false" strokeWidth={1.25} />
          </div>
          <h1 className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
            {renderRegisteredMark(labelText)}
          </h1>
        </div>
      </div>

      {/* Main Description - SCROLLABLE */}
      <div className="relative top-[955px] left-[650px] z-[2] px-[120px] py-[250px] group-data-[kiosk=kiosk-3]/kiosk:top-[290px]">
        <p
          className="max-w-[1000px] text-[60px] leading-[1.3] font-normal tracking-[-3px] text-white group-data-[kiosk=kiosk-2]/kiosk:w-[1100px] group-data-[kiosk=kiosk-3]/kiosk:max-w-[1100px]"
          data-scroll-section="main-description"
        >
          {renderRegisteredMark(item1Body)}
        </p>
      </div>
    </div>
  );
};

export default SecondScreenTemplate;
