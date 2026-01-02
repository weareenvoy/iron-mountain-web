import { useId, type SVGProps } from 'react';

const BlueDiamondSecond = (props: SVGProps<SVGSVGElement>) => {
  const gradientId = useId();

  return (
    <svg fill="none" viewBox="0 0 1587 1780" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="m781.063 35.05 770.027 770.029c46.74 46.734 46.74 122.503 0 169.236L781.063 1744.35c-46.733 46.73-122.502 46.73-169.236 0l-770.03-770.035c-46.733-46.733-46.733-122.502 0-169.236l770.031-770.03c46.733-46.733 122.502-46.733 169.235 0Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={gradientId}
          x1="1740.91"
          x2="601.115"
          y1="3161.18"
          y2="655.924"
        >
          <stop stopColor="#6DCFF6" />
          <stop offset=".98" stopColor="#1B75BC" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BlueDiamondSecond;
