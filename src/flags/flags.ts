import type { Locale } from '@/lib/internal/types';

// Single source of truth to toggle static placeholder JSON vs live REST.
// Flip this to false when real endpoints are ready.
const USE_STATIC_PLACEHOLDER = true as const;

// Locale override for testing. Change this to 'en' or 'pt' to force a specific locale.
// This will override the `locale` property from API responses.
// Set to 'en' for English, 'pt' for Portuguese
const LOCALE_FOR_TESTING: Locale = 'en';

// Non-flag helper for universal use (safe in any environment)
export const shouldUseStaticPlaceholderData = () => USE_STATIC_PLACEHOLDER;

// Get the locale for testing
export const getLocaleForTesting = () => LOCALE_FOR_TESTING;
