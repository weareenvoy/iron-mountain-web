'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

const defaultEyebrow = ['IT assets &', 'data centers'];
const defaultHeadline = ['Centralized management of', 'services via API'];
const defaultSectionTitle = 'Data configuration';
const defaultListItems = [
  'Decommissioning services',
  'Packaging / logistics / transportation',
  'Data sanitization',
  'Lease returns',
  'ITAD',
];
const defaultBackLabel = 'Back';
const defaultStepNumber = '01';

export interface HardCodedKiosk3ThirdScreenTemplateProps {
  backLabel?: string;
  eyebrow?: string | string[];
  headline?: string | string[];
  listItems?: string[];
  onBack?: () => void;
  onStepNext?: () => void;
  onStepPrev?: () => void;
  sectionTitle?: string;
  stepNumber?: string;
  totalSteps?: number;
}

export default function HardCodedKiosk3ThirdScreenTemplate({
  backLabel = defaultBackLabel,
  eyebrow = defaultEyebrow,
  headline = defaultHeadline,
  listItems = defaultListItems,
  onBack,
  onStepNext,
  onStepPrev,
  sectionTitle = defaultSectionTitle,
  stepNumber = defaultStepNumber,
  totalSteps = 6,
}: HardCodedKiosk3ThirdScreenTemplateProps) {
  const eyebrowText = Array.isArray(eyebrow) ? eyebrow.join('\n') : eyebrow;
  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5896-13360">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b75bc] to-[#0a2f5c]" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[50px]" />
      </div>

      {/* Eyebrow */}
      <div className="absolute left-[120px] top-[240px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed] whitespace-pre-line">
        {renderRegisteredMark(eyebrowText)}
      </div>

      {/* Main Heading */}
      <div className="absolute left-[240px] top-[780px] w-[1300px] text-[100px] font-normal leading-[1.3] tracking-[-5px] text-white whitespace-pre-line">
        {renderRegisteredMark(headlineText)}
      </div>

      {/* Back Button */}
      <div className="absolute left-[240px] top-[1200px]">
        <button
          className="flex h-[200px] items-center gap-[30px] rounded-[1000px] bg-[#ededed] px-[90px] text-[54px] font-normal leading-[1.4] tracking-[-2.7px] text-[#14477d] transition hover:scale-[1.01] shadow-lg"
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

      {/* Data Configuration Section */}
      <div className="absolute left-[240px] top-[1600px]">
        <h2 className="text-[60px] font-normal leading-[1.4] tracking-[-3px] text-white mb-[60px]">
          {renderRegisteredMark(sectionTitle)}
        </h2>
        <ul className="space-y-[40px]">
          {listItems.map((item, index) => (
            <li key={index} className="flex items-center gap-[40px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-white">
              <svg
                aria-hidden="true"
                className="h-[32px] w-[32px] flex-shrink-0 rotate-45"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="8" y="8" width="8" height="8" />
              </svg>
              <span>{renderRegisteredMark(item)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Circular Pagination Indicator */}
      <div className="absolute right-[240px] top-[1600px] flex flex-col items-center">
        <div className="relative flex h-[500px] w-[500px] items-center justify-center">
          {/* Outer circle */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            fill="none"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="250"
              cy="250"
              r="240"
              stroke="#97E9FF"
              strokeWidth="2"
              fill="none"
            />
            {/* Dots around the circle */}
            {Array.from({ length: totalSteps }).map((_, index) => {
              const angle = (index * 360) / totalSteps - 90; // Start at top (12 o'clock)
              const radian = (angle * Math.PI) / 180;
              const radius = 240;
              const x = 250 + radius * Math.cos(radian);
              const y = 250 + radius * Math.sin(radian);
              const isActive = index === 0; // First step is active
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={isActive ? 14 : 10}
                  fill={isActive ? '#97E9FF' : '#999'}
                />
              );
            })}
          </svg>
          
          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="flex items-center gap-[30px] text-white">
              <button
                aria-label="Previous step"
                className="flex h-[50px] w-[50px] items-center justify-center rounded-full hover:bg-white/10 transition"
                onClick={onStepPrev}
                type="button"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
              </button>
              <span className="text-[70px] font-normal leading-[1] tracking-[-3.5px]">
                {stepNumber}
              </span>
              <button
                aria-label="Next step"
                className="flex h-[50px] w-[50px] items-center justify-center rounded-full hover:bg-white/10 transition"
                onClick={onStepNext}
                type="button"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Diamond Images */}
      <div className="absolute bottom-0 left-0 right-0 h-[800px] overflow-hidden">
        {/* Main diamond with person image */}
        <div className="absolute left-[400px] bottom-[100px] h-[600px] w-[600px] rotate-[45deg] overflow-hidden rounded-[120px]">
          <div className="absolute inset-0 -rotate-[45deg]">
            <Image
              alt="Person interacting with tablet in data center"
              className="object-cover"
              fill
              sizes="600px"
              src="/images/kiosks/kiosk3/04-custom-interactive/CU-Image1-Diamond.png"
            />
          </div>
        </div>

        {/* Secondary diamond with interface image */}
        <div className="absolute right-[200px] bottom-[50px] h-[500px] w-[500px] rotate-[45deg] overflow-hidden rounded-[100px] opacity-80">
          <div className="absolute inset-0 -rotate-[45deg]">
            <Image
              alt="Digital interface controls"
              className="object-cover"
              fill
              sizes="500px"
              src="/images/kiosks/kiosk3/04-custom-interactive/CU-Image2-Diamond.png"
            />
          </div>
        </div>

        {/* Decorative blue diamond */}
        <div className="absolute left-[200px] bottom-[200px] h-[300px] w-[300px] rotate-[45deg] rounded-[60px] bg-[#97E9FF] opacity-60" />

        {/* Decorative orange diamond outline */}
        <div className="absolute right-[400px] bottom-[300px] h-[250px] w-[250px] rotate-[45deg] rounded-[50px] border-4 border-[#f26522] opacity-40" />
      </div>
    </div>
  );
}
