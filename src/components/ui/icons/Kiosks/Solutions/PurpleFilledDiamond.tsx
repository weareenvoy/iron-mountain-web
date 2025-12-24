import { useId, type SVGProps } from 'react';

const PurpleFilledDiamond = (props: SVGProps<SVGSVGElement>) => {
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
          x1="225.968"
          x2="500.902"
          y1="38.943"
          y2="133.246"
        >
          <stop stopColor="#A2115E" />
          <stop offset=".99" stopColor="#8A0D71" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default PurpleFilledDiamond;
