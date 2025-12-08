import type { SVGProps } from 'react';

const OutlinedDiamond = ({ height = 120, width = 120, ...props }: SVGProps<SVGSVGElement>) => (
  <svg fill="none" height={height} viewBox="0 0 120 120" width={width} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m65.35 4.25 50.091 50.091a7.785 7.785 0 0 1 0 11.01L65.35 115.44a7.785 7.785 0 0 1-11.01 0L4.25 65.351a7.784 7.784 0 0 1 0-11.01l50.09-50.09a7.784 7.784 0 0 1 11.01 0Z"
      stroke={props.stroke ?? '#ededed'}
      strokeMiterlimit={10}
      strokeWidth={3.938}
    />
  </svg>
);

OutlinedDiamond.displayName = 'OutlinedDiamond';

export default OutlinedDiamond;

