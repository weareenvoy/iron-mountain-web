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

type BaseAnimatedTextProps = {
  readonly as?: AnimatedTextElement;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly shouldAnimate: boolean;
};

type AnimatedTextButtonProps = BaseAnimatedTextProps & {
  readonly as: 'button';
  readonly onClick?: () => void;
  readonly type?: 'button' | 'reset' | 'submit';
};

type AnimatedTextHeadingProps = BaseAnimatedTextProps & {
  readonly as?: 'h1' | 'h2';
};

type AnimatedTextParagraphProps = BaseAnimatedTextProps & {
  readonly as?: 'p';
};

type AnimatedTextProps = AnimatedTextButtonProps | AnimatedTextHeadingProps | AnimatedTextParagraphProps;

/**
 * AnimatedText - Reusable component for text elements that slide up from below
 * Used for headline, body text, and button animations that trigger together
 */
const AnimatedText = forwardRef<HTMLElement, AnimatedTextProps>(
  ({ as = 'p', children, className, shouldAnimate, ...restProps }, ref) => {
    const animationProps = {
      animate: shouldAnimate ? { y: 0 } : { y: TEXT_ANIMATION.START_Y },
      className,
      initial: { y: TEXT_ANIMATION.START_Y },
      transition: {
        delay: TEXT_ANIMATION.DELAY,
        duration: TEXT_ANIMATION.DURATION,
        ease: TEXT_ANIMATION.EASE,
      },
    };

    if (as === 'button') {
      const buttonProps = restProps as Omit<AnimatedTextButtonProps, 'as' | 'children' | 'className' | 'shouldAnimate'>;
      return (
        <motion.button ref={ref as React.Ref<HTMLButtonElement>} {...animationProps} {...buttonProps}>
          {children}
        </motion.button>
      );
    }

    if (as === 'h1') {
      return (
        <motion.h1 ref={ref as React.Ref<HTMLHeadingElement>} {...animationProps}>
          {children}
        </motion.h1>
      );
    }

    if (as === 'h2') {
      return (
        <motion.h2 ref={ref as React.Ref<HTMLHeadingElement>} {...animationProps}>
          {children}
        </motion.h2>
      );
    }

    return (
      <motion.p ref={ref as React.Ref<HTMLParagraphElement>} {...animationProps}>
        {children}
      </motion.p>
    );
  }
);

AnimatedText.displayName = 'AnimatedText';

export default AnimatedText;
