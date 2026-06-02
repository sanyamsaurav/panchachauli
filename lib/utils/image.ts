/**
 * Generic image utility with fallback support
 */

export const DEFAULT_FALLBACK_IMAGE = "/exp/download (1).jpeg";

/**
 * Get image URL with fallback support
 * @param image - The primary image URL
 * @param fallback - Optional custom fallback URL (defaults to DEFAULT_FALLBACK_IMAGE)
 * @returns Valid image URL or fallback
 */
export function getImageUrl(image?: string | null, fallback?: string): string {
  if (image && image.trim().length > 0) {
    return image;
  }
  return fallback || DEFAULT_FALLBACK_IMAGE;
}

/**
 * Check if an image URL is valid (not empty/null/undefined)
 * @param image - Image URL to check
 * @returns boolean indicating if image is valid
 */
export function hasValidImage(image?: string | null): boolean {
  return !!(image && image.trim().length > 0);
}

/**
 * Get responsive image srcSet for different screen sizes
 * @param baseUrl - Base image URL
 * @param widths - Array of widths to generate
 * @returns srcSet string
 */
export function getImageSrcSet(baseUrl: string, widths: number[] = [400, 800, 1200]): string {
  // If using a service like Cloudinary, Imgix, etc., modify this to add width params
  // For now, return the same URL for all widths
  return widths.map((w) => `${baseUrl} ${w}w`).join(", ");
}
