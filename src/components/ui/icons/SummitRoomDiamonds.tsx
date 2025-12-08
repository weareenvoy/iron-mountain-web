import type { SVGProps } from 'react';

const SummitRoomDiamonds = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg fill="none" viewBox="0 0 208 187" xmlns="https://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#a)">
        <path
          d="m199.437 148.107 20.623-21.518c1.252-1.306 1.252-3.424 0-4.731l-20.623-21.518a3.113 3.113 0 0 0-4.534 0l-20.623 21.518c-1.252 1.307-1.252 3.425 0 4.731l20.623 21.518a3.11 3.11 0 0 0 4.534 0"
          fill="url(#b)"
        />
        <path
          d="M68.56 48.164 2.985 116.59c-3.98 4.152-3.98 10.883 0 15.034l65.577 68.425c3.978 4.152 10.43 4.152 14.408 0l65.577-68.425c3.979-4.151 3.979-10.882 0-15.034L82.969 48.164c-3.979-4.151-10.43-4.151-14.408 0Z"
          stroke="#6dcff6"
          strokeMiterlimit="10"
          strokeWidth=".627"
        />
        <path
          d="m158.78 2.527-46.339 48.351c-2.812 2.935-2.812 7.693 0 10.627l46.339 48.351c2.812 2.935 7.372 2.935 10.185 0l46.338-48.35c2.812-2.935 2.812-7.693 0-10.628l-46.338-48.35c-2.813-2.935-7.373-2.935-10.185 0Z"
          stroke="#f79420"
          strokeMiterlimit="10"
          strokeWidth=".627"
        />
        <path
          d="m158.615 138.179-46.338 48.351c-2.812 2.934-2.812 7.692 0 10.627l46.338 48.351c2.813 2.934 7.373 2.934 10.185 0l46.339-48.351c2.812-2.935 2.812-7.693 0-10.627L168.8 138.179c-2.812-2.935-7.372-2.935-10.185 0Z"
          stroke="#00a88e"
          strokeMiterlimit="10"
          strokeWidth=".627"
        />
      </g>
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="b" x1="209.748" x2="183.522" y1="137.346" y2="112.212">
          <stop stopColor="#f7931e" />
          <stop offset="1" stopColor="#f4751f" />
        </linearGradient>
        <clipPath id="a">
          <path d="M221 248.036H0V0h221z" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SummitRoomDiamonds;
