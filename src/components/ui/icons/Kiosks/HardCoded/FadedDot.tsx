import * as React from 'react';

const FadedDot = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" height={33} viewBox="0 0 33 33" width={33} xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={16.5} cy={16.5} fill="#6DCFF6" opacity={0.2} r={16.5} />
  </svg>
);

FadedDot.displayName = 'FadedDot';

export default FadedDot;
