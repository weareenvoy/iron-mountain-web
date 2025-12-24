import type { SVGProps } from 'react';

const ButtonArrow = ({
  'aria-hidden': ariaHidden = 'true',
  focusable = 'false',
  ...props
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden={ariaHidden}
      fill="none"
      focusable={focusable}
      viewBox="0 0 107 40"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 19.833h102.76m0 0L86.927 2m17.833 17.833L86.927 37.667"
        stroke="#14477D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
      />
    </svg>
  );
};

export default ButtonArrow;
