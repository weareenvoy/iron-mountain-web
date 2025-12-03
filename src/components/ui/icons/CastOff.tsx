import type { SVGProps } from 'react';

const CastOff = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg fill="none" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg" {...props}>
      <path
        d="M14 21h3.2c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 18.72 22 17.88 22 16.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 3 18.88 3 17.2 3H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 5.28 2 6.12 2 7.8V8M15 9l-6 6m0-6 6 6"
        stroke="#ededed"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default CastOff;
