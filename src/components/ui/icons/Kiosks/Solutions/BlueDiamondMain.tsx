import { useId, type SVGProps } from 'react';

const BlueDiamondMain = (props: SVGProps<SVGSVGElement>) => {
  const gradientId = useId();

  return (
    <svg fill="none" viewBox="0 0 1587 1780" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1549.32 806.847 779.291 36.817c-45.757-45.757-119.943-45.756-165.7 0l-770.03 770.03c-45.756 45.757-45.757 119.943 0 165.7l770.03 770.033c45.757 45.75 119.944 45.75 165.701 0l770.028-770.032c45.76-45.757 45.76-119.944 0-165.701Z"
        stroke={`url(#${gradientId})`}
        strokeWidth={5}
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={gradientId}
          x1="261.035"
          x2="1271.29"
          y1="150.769"
          y2="1263.83"
        >
          <stop stopColor="#6DCFF6" />
          <stop offset=".98" stopColor="#1B75BC" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BlueDiamondMain;
