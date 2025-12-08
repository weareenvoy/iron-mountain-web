import { useId, type SVGProps } from 'react';

const TealGradientDiamondThird = (props: SVGProps<SVGSVGElement>) => {
  const gradientId = useId();

  return (
    <svg fill="none" viewBox="0 0 386 386" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M174.586 7.594 7.595 174.586c-10.126 10.126-10.126 26.544 0 36.67l166.991 166.991c10.127 10.127 26.544 10.127 36.671 0l166.991-166.991c10.126-10.126 10.126-26.544 0-36.67L211.257 7.594c-10.127-10.126-26.544-10.126-36.671 0Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={gradientId}
          x1="91.084"
          x2="294.778"
          y1="91.047"
          y2="294.741"
        >
          <stop stopColor="#6DCEF5" />
          <stop offset=".99" stopColor="#00A88D" />
        </linearGradient>
      </defs>
    </svg>
  );
};

TealGradientDiamondThird.displayName = 'TealGradientDiamondThird';

export default TealGradientDiamondThird;
