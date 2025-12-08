import type { SVGProps } from 'react';

const GreenDiamondFourth = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg fill="none" viewBox="0 0 888 888" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="m485.665 867.516 381.852-381.852c23.177-23.176 23.177-60.753 0-83.93L485.665 19.882c-23.176-23.176-60.753-23.176-83.93 0L19.883 401.734c-23.176 23.177-23.176 60.754 0 83.93l381.852 381.852c23.177 23.177 60.754 23.177 83.93 0Z"
        stroke="#8DC13F"
        strokeMiterlimit={10}
        strokeWidth={5}
      />
    </svg>
  );
};

GreenDiamondFourth.displayName = 'GreenDiamondFourth';

export default GreenDiamondFourth;
