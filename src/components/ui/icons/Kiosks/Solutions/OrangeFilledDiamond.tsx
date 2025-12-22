import { useId, type SVGProps } from 'react';

const OrangeFilledDiamond = (props: SVGProps<SVGSVGElement>) => {
  const gradientId = useId();

  return (
    <svg fill="none" viewBox="0 0 536 536" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="m293.043 10.543 231.6 231.6c14.056 14.056 14.056 36.845 0 50.901l-231.6 231.601c-14.056 14.056-36.845 14.056-50.901 0l-231.6-231.601c-14.057-14.056-14.057-36.845 0-50.901l231.6-231.6c14.056-14.056 36.845-14.056 50.901 0Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id={gradientId} x1="234.765" x2="413.496" y1="90.9" y2="336.874">
          <stop stopColor="#F7931E" />
          <stop offset="1" stopColor="#F4751F" />
        </linearGradient>
      </defs>
    </svg>
  );
};

OrangeFilledDiamond.displayName = 'OrangeFilledDiamond';

export default OrangeFilledDiamond;
