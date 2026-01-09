import { motion } from 'framer-motion';
import { forwardRef, memo } from 'react';

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

type BaseAnimatedTextProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly shouldAnimate: boolean;
};

/**
 * Props for button variant
 * @example
 * <AnimatedText as="button" onClick={handler} type="button">Click me</AnimatedText>
 */
type AnimatedTextButtonProps = BaseAnimatedTextProps & {
  readonly as: 'button';
  readonly onClick?: () => void;
  readonly type?: 'button' | 'reset' | 'submit';
};

/**
 * Props for h1 heading variant
 * @example
 * <AnimatedText as="h1">Main Heading</AnimatedText>
 */
type AnimatedTextH1Props = BaseAnimatedTextProps & {
  readonly as: 'h1';
};

/**
 * Props for h2 heading variant
 * @example
 * <AnimatedText as="h2">Sub Heading</AnimatedText>
 */
type AnimatedTextH2Props = BaseAnimatedTextProps & {
  readonly as: 'h2';
};

/**
 * Props for paragraph variant (default)
 * @example
 * <AnimatedText>Body text</AnimatedText>
 * <AnimatedText as="p">Body text</AnimatedText>
 */
type AnimatedTextParagraphProps = BaseAnimatedTextProps & {
  readonly as?: 'p';
};

/**
 * Discriminated union of all AnimatedText variants
 * TypeScript uses the 'as' prop to narrow types at compile time
 */
type AnimatedTextProps =
  | AnimatedTextButtonProps
  | AnimatedTextH1Props
  | AnimatedTextH2Props
  | AnimatedTextParagraphProps;

/**
 * Ref type for AnimatedText component
 * Covers all possible HTML elements based on 'as' prop
 */
type AnimatedTextRefType = HTMLButtonElement | HTMLHeadingElement | HTMLParagraphElement;

/**
 * AnimatedText - Reusable component for text elements that slide up from below
 * Used for headline, body text, and button animations that trigger together
 * Uses safe type assertions for ref forwarding (TypeScript limitation with discriminated unions)
 */
const AnimatedText = forwardRef<AnimatedTextRefType, AnimatedTextProps>((props, ref) => {
  const { as = 'p', children, className, shouldAnimate } = props;

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
    // TypeScript doesn't narrow discriminated unions automatically, so we assert the type
    const buttonProps = props as AnimatedTextButtonProps;
    return (
      <motion.button
        {...animationProps}
        onClick={buttonProps.onClick}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type={buttonProps.type}
      >
        {children}
      </motion.button>
    );
  }

  if (as === 'h1') {
    return (
      <motion.h1 {...animationProps} ref={ref as React.ForwardedRef<HTMLHeadingElement>}>
        {children}
      </motion.h1>
    );
  }

  if (as === 'h2') {
    return (
      <motion.h2 {...animationProps} ref={ref as React.ForwardedRef<HTMLHeadingElement>}>
        {children}
      </motion.h2>
    );
  }

  return (
    <motion.p {...animationProps} ref={ref as React.ForwardedRef<HTMLParagraphElement>}>
      {children}
    </motion.p>
  );
});

const MemoizedAnimatedText = memo(AnimatedText);
export { MemoizedAnimatedText as AnimatedText };
