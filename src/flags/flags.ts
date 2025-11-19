// Single source of truth to toggle static placeholder JSON vs live REST.
// Flip this to false when real endpoints are ready.
const USE_STATIC_PLACEHOLDER = true;

// Non-flag helper for universal use (safe in any environment)
export const shouldUseStaticPlaceholderData = () => USE_STATIC_PLACEHOLDER;
