'use client';

import { motion, type SVGMotionProps } from 'framer-motion';

type BlueDotProps = Omit<SVGMotionProps<SVGSVGElement>, 'children'>;

const BlueDot = (props: BlueDotProps) => (
  <motion.svg
    animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }}
    fill="none"
    height="59"
    transition={{
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    }}
    viewBox="0 0 59 59"
    width="59"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="29.356" cy="29.356" fill="#6DCFF6" r="29.356" />
  </motion.svg>
);

export default BlueDot;
