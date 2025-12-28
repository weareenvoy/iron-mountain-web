import { useCallback } from 'react';

/**
 * Hook for managing keyboard event handlers for navigation.
 * Centralizes all keyboard interaction logic for arrow navigation.
 *
 * This provides accessible keyboard controls for the kiosk navigation system.
 */

type UseNavigationKeyboardConfig = {
  readonly handleNavigateDown: () => void;
  readonly handleNavigateUp: () => void;
};

export const useNavigationKeyboard = ({ handleNavigateDown, handleNavigateUp }: UseNavigationKeyboardConfig) => {
  // Container keyboard handler (global arrow keys)
  const handleContainerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Prevent default arrow key scrolling to avoid jump before smooth scroll
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (event.key === 'ArrowDown') {
          handleNavigateDown();
        } else {
          handleNavigateUp();
        }
      }
    },
    [handleNavigateDown, handleNavigateUp]
  );

  // Up arrow button keyboard handler (Enter/Space)
  const handleUpArrowKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleNavigateUp();
      }
    },
    [handleNavigateUp]
  );

  // Down arrow button keyboard handler (Enter/Space)
  const handleDownArrowKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleNavigateDown();
      }
    },
    [handleNavigateDown]
  );

  return {
    handleContainerKeyDown,
    handleDownArrowKeyDown,
    handleUpArrowKeyDown,
  };
};
