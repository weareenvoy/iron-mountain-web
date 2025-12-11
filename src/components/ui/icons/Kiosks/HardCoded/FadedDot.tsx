import * as React from 'react';

const FadedDot = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={33} height={33} fill="none" viewBox="0 0 33 33" {...props}>
    <circle cx={16.5} cy={16.5} r={16.5} fill="#6DCFF6" opacity={0.2} />
  </svg>
);

FadedDot.displayName = 'FadedDot';

export default FadedDot;
