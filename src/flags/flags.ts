import { flag } from 'flags/next';

export const exampleFlag = flag({
  decide() {
    return Math.random() > 0.5;
  },
  key: 'example-flag',
});

// Single source of truth to toggle static placeholder JSON vs live REST.
// Flip this to false when real endpoints are ready.
const USE_STATIC_PLACEHOLDER = true;

export const staticPlaceholderDataFlag = flag({
  decide() {
    return USE_STATIC_PLACEHOLDER;
  },
  key: 'use-static-placeholder-data',
});

// Non-flag helper for universal use (safe in any environment)
export const shouldUseStaticPlaceholderData = () => USE_STATIC_PLACEHOLDER;
