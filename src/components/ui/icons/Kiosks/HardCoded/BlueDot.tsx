import * as React from 'react';

const BlueDot = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="59" height="59" fill="none" viewBox="0 0 59 59" {...props}>
    <circle cx="29.356" cy="29.356" r="29.356" fill="#6DCFF6" />
  </svg>
);

BlueDot.displayName = 'BlueDot';

export default BlueDot;

