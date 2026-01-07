import { motion } from 'framer-motion';
import { forwardRef } from 'react';

/**
 * Animation configuration for text entrance from below
 * Values align with staggered diamond animation timing
 */
const TEXT_ANIMATION = {
  DELAY: 0.4, // Starts after center diamond begins moving
  DURATION: 0.8,
  EASE: [0.3, 0, 0.4, 1] as const, // 30 out 60 in easing
  START_Y: 550, // Animates UP from far below (bleeds significantly into diamonds area)
} as const;

type AnimatedTextElement = 'button' | 'h1' | 'h2' | 'p';

type AnimatedTextProps = {
  readonly as?: AnimatedTextElement;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly onClick?: () => void;
  readonly shouldAnimate: boolean;
  readonly type?: 'button' | 'reset' | 'submit';
};

/**
 * AnimatedText - Reusable component for text elements that slide up from below
 * Used for headline, body text, and button animations that trigger together
 */
const AnimatedText = forwardRef<HTMLElement, AnimatedTextProps>(
  ({ as = 'p', children, className, onClick, shouldAnimate, type }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = motion[as] as any;

    const baseProps = {
      animate: shouldAnimate ? { y: 0 } : { y: TEXT_ANIMATION.START_Y },
      className,
      initial: { y: TEXT_ANIMATION.START_Y },
      onClick,
      ref,
      transition: {
        delay: TEXT_ANIMATION.DELAY,
        duration: TEXT_ANIMATION.DURATION,
        ease: TEXT_ANIMATION.EASE,
      },
    };

    // Add type prop only for buttons
    const props = as === 'button' && type ? { ...baseProps, type } : baseProps;

    return <Component {...props}>{children}</Component>;
  }
);

export default AnimatedText;
