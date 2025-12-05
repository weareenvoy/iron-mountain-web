import { useId, type SVGProps } from 'react';

const SummitRootDiamondsBg = (props: SVGProps<SVGSVGElement>) => {
  const clipPathId = useId();
  const gradientId = useId();

  return (
    <svg fill="none" viewBox="0 0 2216 1998" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M2132.2 414.118L2352.68 644.174C2366.06 658.14 2366.06 680.782 2352.68 694.748L2132.2 924.804C2118.81 938.769 2097.11 938.769 2083.73 924.804L1863.25 694.748C1849.86 680.782 1849.86 658.14 1863.25 644.174L2083.73 414.118C2097.11 400.152 2118.81 400.152 2132.2 414.118Z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M732.988 1482.62L31.8977 751.082C-10.6386 706.699 -10.6385 634.739 31.8978 590.355L732.988 -141.183C775.524 -185.566 844.489 -185.567 887.025 -141.183L1588.12 590.355C1630.65 634.739 1630.65 706.699 1588.12 751.082L887.025 1482.62C844.489 1527 775.524 1527 732.988 1482.62Z"
          stroke="#6DCFF6"
          strokeMiterlimit="10"
          strokeWidth="6.70697"
        />
        <path
          d="M1697.53 1970.53L1202.12 1453.61C1172.05 1422.23 1172.05 1371.36 1202.12 1339.99L1697.53 823.067C1727.59 791.692 1776.35 791.692 1806.41 823.067L2301.82 1339.99C2331.89 1371.36 2331.89 1422.23 2301.82 1453.61L1806.41 1970.53C1776.35 2001.9 1727.59 2001.9 1697.53 1970.53Z"
          stroke="#F79420"
          strokeMiterlimit="10"
          strokeWidth="6.70697"
        />
        <path
          d="M1695.77 520.265L1200.36 3.34399C1170.29 -28.0307 1170.29 -78.899 1200.36 -110.274L1695.77 -627.195C1725.84 -658.569 1774.59 -658.569 1804.66 -627.195L2300.06 -110.274C2330.13 -78.8991 2330.13 -28.0307 2300.06 3.34396L1804.66 520.265C1774.59 551.64 1725.84 551.64 1695.77 520.265Z"
          stroke="#00A88E"
          strokeMiterlimit="10"
          strokeWidth="6.70697"
        />
      </g>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={gradientId}
          x1="2242.43"
          x2="1962.05"
          y1="529.174"
          y2="797.88"
        >
          <stop stopColor="#F7931E" />
          <stop offset="1" stopColor="#F4751F" />
        </linearGradient>
        <clipPath id={clipPathId}>
          <rect fill="white" height="2651.78" transform="matrix(-1 0 0 1 2362.73 -654.23)" width="2362.73" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SummitRootDiamondsBg;
