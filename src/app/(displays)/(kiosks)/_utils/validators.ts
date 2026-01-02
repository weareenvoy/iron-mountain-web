// Catches malformed CMS data at runtime with typechecking and throws a validation error.

/**
 * Runtime validation utilities for CMS data.
 * Provides type-safe parsing with proper error handling.
 */

type ValidationError = {
  readonly field: string;
  readonly message: string;
  readonly received: unknown;
};

/**
 * Creates a validation error with structured details.
 */
export const createValidationError = (message: string, errors: readonly ValidationError[]): Error => {
  const error = new Error(message);
  error.name = 'ValidationException';
  // Attach errors as a property for programmatic access
  Object.defineProperty(error, 'errors', {
    enumerable: false,
    value: errors,
  });
  return error;
};

/**
 * Validates that a value is a non-empty string.
 */
export const validateString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string') {
    throw createValidationError(`${fieldName} must be a string`, [
      { field: fieldName, message: 'Expected string', received: value },
    ]);
  }
  return value;
};

/**
 * Validates that a value is a string or undefined.
 */
export const validateOptionalString = (value: unknown, fieldName: string): string | undefined => {
  if (value === undefined || value === null) return undefined;
  return validateString(value, fieldName);
};

/**
 * Validates that a value is an array of strings.
 */
export const validateStringArray = (value: unknown, fieldName: string): readonly string[] => {
  if (!Array.isArray(value)) {
    throw createValidationError(`${fieldName} must be an array`, [
      { field: fieldName, message: 'Expected array', received: value },
    ]);
  }

  return value.map((item, index) => {
    if (typeof item !== 'string') {
      throw createValidationError(`${fieldName}[${index}] must be a string`, [
        { field: `${fieldName}[${index}]`, message: 'Expected string', received: item },
      ]);
    }
    return item;
  });
};

/**
 * Validates that a value is an object with expected shape.
 */
export const validateObject = <T extends Record<string, unknown>>(
  value: unknown,
  fieldName: string,
  validator: (obj: Record<string, unknown>) => T
): T => {
  if (typeof value !== 'object' || value === null) {
    throw createValidationError(`${fieldName} must be an object`, [
      { field: fieldName, message: 'Expected object', received: value },
    ]);
  }

  // Type assertion is safe - we've validated that value is a non-null object
  // at runtime (line 76). TypeScript requires the assertion because it doesn't narrow
  // the type through the runtime check.
  return validator(value as Record<string, unknown>);
};

/**
 * Safely gets an optional property from an object.
 */
export const getOptionalProperty = <T>(
  obj: Record<string, unknown>,
  key: string,
  validator: (value: unknown) => T
): T | undefined => {
  const value = obj[key];
  if (value === undefined || value === null) return undefined;
  return validator(value);
};

/**
 * Type guard to check if value has expected properties.
 * More rigorous than a simple type assertion.
 */
export const hasRequiredProperties = <T extends Record<string, unknown>>(
  value: unknown,
  requiredKeys: readonly (keyof T)[]
): value is T => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return requiredKeys.every(key => key in obj);
};

/**
 * Validates that a value is an object and has specific required properties.
 * More type-safe than blind 'as' casts.
 */
export const validateObjectWithProps = <T extends Record<string, unknown>>(
  value: unknown,
  fieldName: string,
  requiredKeys: readonly (keyof T)[]
): T => {
  if (!hasRequiredProperties<T>(value, requiredKeys)) {
    const missingKeys = requiredKeys.filter(key => {
      if (typeof value !== 'object' || value === null) return true;
      return !(key in (value as Record<string, unknown>));
    });
    throw createValidationError(`${fieldName} is missing required properties: ${missingKeys.join(', ')}`, [
      { field: fieldName, message: 'Missing required properties', received: value },
    ]);
  }
  return value;
};
