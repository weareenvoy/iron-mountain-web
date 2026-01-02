import { useId, type SVGProps } from 'react';

const BlueFilledDiamond = (props: SVGProps<SVGSVGElement>) => {
  const gradientId = useId();

  return (
    <svg fill="none" viewBox="0 0 536 536" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="m293.043 10.543 231.6 231.6c14.056 14.056 14.056 36.845 0 50.901l-231.6 231.601c-14.056 14.056-36.845 14.056-50.901 0l-231.6-231.601c-14.057-14.056-14.057-36.845 0-50.901l231.6-231.6c14.056-14.056 36.845-14.056 50.901 0Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={gradientId}
          x1="-252.906"
          x2="331.812"
          y1="624.592"
          y2="-23.682"
        >
          <stop stopColor="#6DCFF6" />
          <stop offset=".98" stopColor="#1B75BC" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BlueFilledDiamond;
