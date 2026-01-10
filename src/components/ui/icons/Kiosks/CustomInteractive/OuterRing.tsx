'use client';

import { motion, type SVGMotionProps } from 'framer-motion';

type OuterRingProps = Omit<SVGMotionProps<SVGSVGElement>, 'children'>;

// Standard easing curve matching kiosk animations
const EASE_IN_OUT = [0.3, 0, 0.6, 1] as const;

const OuterRing = (props: OuterRingProps) => (
  <motion.svg fill="none" height="916" viewBox="0 0 916 916" width="916" xmlns="http://www.w3.org/2000/svg" {...props}>
    <motion.circle
      animate={{ pathLength: 1, rotate: 360 }}
      cx="457.725"
      cy="457.725"
      initial={{ pathLength: 0, rotate: 0 }}
      r="448.83"
      stroke="#1B75BC"
      strokeWidth="17.791"
      style={{ originX: '50%', originY: '50%' }}
      transition={{
        pathLength: { duration: 2, ease: EASE_IN_OUT },
        rotate: { duration: 8, ease: 'linear', repeat: Infinity },
      }}
    />
  </motion.svg>
);

export default OuterRing;
