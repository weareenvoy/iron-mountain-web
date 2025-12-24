import { useId, type SVGProps } from 'react';

const OrangeGradientDiamondFourth = (props: SVGProps<SVGSVGElement>) => {
  const gradientId = useId();

  return (
    <svg fill="none" viewBox="0 0 393 393" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M177.682 7.738 7.738 177.682c-10.316 10.316-10.316 27.042 0 37.359l169.944 169.943c10.316 10.317 27.042 10.317 37.359 0l169.943-169.943c10.317-10.317 10.317-27.043 0-37.359L215.041 7.738c-10.317-10.316-27.043-10.316-37.359 0Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id={gradientId} x1="92.713" x2="300.016" y1="92.73" y2="300.033">
          <stop stopColor="#F7931E" />
          <stop offset="1" stopColor="#F4751F" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default OrangeGradientDiamondFourth;
