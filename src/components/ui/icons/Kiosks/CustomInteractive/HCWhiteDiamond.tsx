import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';

type HCWhiteDiamondProps = Omit<ComponentPropsWithoutRef<'svg'>, 'children'> & {
  readonly fill?: string;
};

/**
 * HCWhiteDiamond - White diamond SVG component
 * Supports animated fill color via Framer Motion
 */
const HCWhiteDiamond = ({ fill = '#EDEDED', ...svgProps }: HCWhiteDiamondProps) => (
  <svg
    {...svgProps}
    fill="none"
    height="880"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 880 880"
    width="880"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      animate={{ fill }}
      d="M398.117 17.332 17.329 398.12c-23.11 23.11-23.11 60.579 0 83.689l380.788 380.788c23.11 23.11 60.579 23.11 83.689 0l380.788-380.788c23.11-23.11 23.11-60.579 0-83.689L481.806 17.332c-23.11-23.11-60.579-23.11-83.689 0Z"
      initial={{ fill }}
      transition={{
        duration: 0.2,
        ease: [0.3, 0, 0.4, 1],
      }}
    />
  </svg>
);

export default HCWhiteDiamond;
