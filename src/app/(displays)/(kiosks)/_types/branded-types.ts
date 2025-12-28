/**
 * Branded types for compile-time type safety.
 * Prevents mixing different string types (e.g., URLs, IDs).
 */

/**
 * Branded type for S3 URLs.
 * Ensures only validated S3 URLs are used.
 */
export type S3Url = string & { readonly __brand: 'S3Url' };

/**
 * Branded type for video URLs.
 */
export type VideoUrl = string & { readonly __brand: 'VideoUrl' };

/**
 * Branded type for image URLs.
 */
export type ImageUrl = string & { readonly __brand: 'ImageUrl' };

/**
 * Branded type for scroll section IDs.
 */
export type ScrollSectionId = string & { readonly __brand: 'ScrollSectionId' };

/**
 * Type guard for S3 URLs.
 */
export const isS3Url = (url: string): url is S3Url => {
  return url.startsWith('https://') && url.includes('.s3.');
};

/**
 * Safely creates an S3 URL with validation.
 */
export const createS3Url = (url: string): S3Url => {
  if (!isS3Url(url)) {
    throw new Error(`Invalid S3 URL: ${url}`);
  }
  return url as S3Url;
};

/**
 * Type guard for video URLs.
 */
export const isVideoUrl = (url: string): url is VideoUrl => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};

/**
 * Safely creates a video URL with validation.
 */
export const createVideoUrl = (url: string): VideoUrl => {
  if (!isVideoUrl(url)) {
    throw new Error(`Invalid video URL: ${url}`);
  }
  return url as VideoUrl;
};

/**
 * Type guard for image URLs.
 */
export const isImageUrl = (url: string): url is ImageUrl => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
};

/**
 * Safely creates an image URL with validation.
 */
export const createImageUrl = (url: string): ImageUrl => {
  if (!isImageUrl(url)) {
    throw new Error(`Invalid image URL: ${url}`);
  }
  return url as ImageUrl;
};

/**
 * Safely creates a scroll section ID (no validation, just branding).
 */
export const createScrollSectionId = (id: string): ScrollSectionId => {
  return id as ScrollSectionId;
};

/**
 * Non-empty string type (at compile time).
 */
export type NonEmptyString = string & { readonly __nonEmpty: true };

/**
 * Runtime check for non-empty strings.
 */
export const isNonEmptyString = (value: string): value is NonEmptyString => {
  return value.trim().length > 0;
};

/**
 * Creates a non-empty string with validation.
 */
export const createNonEmptyString = (value: string, fieldName: string): NonEmptyString => {
  if (!isNonEmptyString(value)) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  return value as NonEmptyString;
};
