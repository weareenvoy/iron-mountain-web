import type { SVGProps } from 'react';

const LightBulb = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg fill="none" viewBox="0 0 31 43" xmlns="https://www.w3.org/2000/svg" {...props}>
      <path
        d="M10.542 40.801h9.76m-8.784-23.426h7.808m-3.904 0v11.713m5.857-1.315c4.616-2.193 7.808-6.899 7.808-12.35 0-7.547-6.118-13.665-13.665-13.665S1.757 7.876 1.757 15.423c0 5.451 3.192 10.157 7.809 12.35v1.315c0 1.82 0 2.729.297 3.447a3.9 3.9 0 0 0 2.113 2.113c.717.297 1.627.297 3.446.297s2.729 0 3.446-.297a3.9 3.9 0 0 0 2.113-2.114c.298-.717.298-1.627.298-3.446z"
        stroke="#6dcff6"
      />
    </svg>
  );
};

export default LightBulb;
