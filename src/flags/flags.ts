import type { Locale } from '@/lib/internal/types';

// Single source of truth to toggle static placeholder JSON vs live REST.
// Flip this to false when real endpoints are ready.
const USE_STATIC_PLACEHOLDER = true as const;

// Language override for testing. Change this to 'en' or 'pt' to force a specific language.
// This will override the `lang` property from API responses.
// Set to 'en' for English, 'pt' for Portuguese
const LANGUAGE_OVERRIDE: Locale = 'pt';

// Non-flag helper for universal use (safe in any environment)
export const shouldUseStaticPlaceholderData = () => USE_STATIC_PLACEHOLDER;

// Get the language override
export const getLanguageOverride = () => LANGUAGE_OVERRIDE;
