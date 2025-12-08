import { useId, type SVGProps } from 'react';

const OrangeDiamondMain = (props: SVGProps<SVGSVGElement>) => {
  const gradientId = useId();

  return (
    <svg fill="none" viewBox="0 0 885 885" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M865.268 401.937 482.52 19.189c-22.252-22.253-58.331-22.253-80.584 0L19.189 401.937c-22.253 22.252-22.253 58.331 0 80.583l382.747 382.748c22.253 22.253 58.332 22.253 80.584 0L865.268 482.52c22.253-22.252 22.253-58.331 0-80.583Z"
        stroke={`url(#${gradientId})`}
        strokeWidth={5}
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={gradientId}
          x1="387.977"
          x2="683.351"
          y1="150.22"
          y2="556.722"
        >
          <stop stopColor="#F7931E" />
          <stop offset="1" stopColor="#F4751F" />
        </linearGradient>
      </defs>
    </svg>
  );
};

OrangeDiamondMain.displayName = 'OrangeDiamondMain';

export default OrangeDiamondMain;
