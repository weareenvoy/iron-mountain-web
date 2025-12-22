import * as React from 'react';

const HCFilledTealDiamond = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" height="449" width="409" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M399.512 203.074 205.281 8.844c-11.792-11.792-30.911-11.793-42.703 0l-194.23 194.23c-11.792 11.792-11.792 30.911 0 42.703l194.23 194.231c11.792 11.792 30.911 11.792 42.703 0l194.231-194.231c11.792-11.792 11.792-30.911 0-42.703Z"
      fill="url(#a)"
    />
    <defs>
      <linearGradient gradientUnits="userSpaceOnUse" id="a" x1="302.437" x2="65.482" y1="105.959" y2="342.852">
        <stop stop-color="#6DCEF5" />
        <stop offset=".99" stop-color="#00A88D" />
      </linearGradient>
    </defs>
  </svg>
);

HCFilledTealDiamond.displayName = 'HCFilledTealDiamond';

export default HCFilledTealDiamond;
