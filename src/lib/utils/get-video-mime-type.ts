// This file derives the MIME type for a video source based on its file extension.
// This way when a video file is uploaded to the CMS its file type is detected automatically and the correct MIME type is returned.

/**
 * Derives the MIME type for a video source based on its file extension.
 * Falls back to 'video/mp4' if the extension cannot be determined.
 *
 * @param src - The video source URL or path
 * @returns The appropriate MIME type string
 */
export const getVideoMimeType = (src?: string): string => {
  if (!src) return 'video/mp4';

  const extension = src.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'm4v':
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'ogg':
    case 'ogv':
      return 'video/ogg';
    case 'webm':
      return 'video/webm';
    default:
      return 'video/mp4';
  }
};
