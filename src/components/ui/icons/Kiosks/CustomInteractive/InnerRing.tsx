'use client';

import { motion, type SVGMotionProps } from 'framer-motion';

type InnerRingProps = Omit<SVGMotionProps<SVGSVGElement>, 'children'>;

// Standard easing curve matching kiosk animations
const EASE_IN_OUT = [0.3, 0, 0.6, 1] as const;

const InnerRing = (props: InnerRingProps) => (
  <motion.svg fill="none" height="739" viewBox="0 0 739 739" width="739" xmlns="http://www.w3.org/2000/svg" {...props}>
    <motion.circle
      animate={{ pathLength: 1, rotate: -360 }}
      cx="369.5"
      cy="369.5"
      initial={{ pathLength: 0, rotate: 0 }}
      r="353.63"
      stroke="#14477D"
      strokeWidth="31.74"
      style={{ originX: '50%', originY: '50%' }}
      transition={{
        pathLength: { duration: 2, ease: EASE_IN_OUT },
        rotate: { duration: 10, ease: 'linear', repeat: Infinity },
      }}
    />
  </motion.svg>
);

export default InnerRing;
