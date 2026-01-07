import { motion } from 'framer-motion';

type HCWhiteDiamondProps = {
  readonly 'aria-hidden'?: 'false' | 'true' | boolean;
  readonly 'className'?: string;
  readonly 'fill'?: string;
  readonly 'focusable'?: 'false' | 'true' | boolean;
};

/**
 * HCWhiteDiamond - White diamond SVG component
 * Supports animated fill color via Framer Motion
 */
const HCWhiteDiamond = ({ 'aria-hidden': ariaHidden, className, fill = '#EDEDED', focusable }: HCWhiteDiamondProps) => (
  <svg
    aria-hidden={ariaHidden}
    className={className}
    fill="none"
    focusable={focusable}
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
