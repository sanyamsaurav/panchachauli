/**
 * Public site settings (used in footer, contact, etc.).
 * Loaded async via useSiteSettings() from the API.
 */

export interface SiteSettings {
  organizationName: string;
  email: string;
  phone: string;
  address: string;
  mapLocationKeyframe: string;
}

/** Default phone number without + for wa.me links */
export const DEFAULT_PHONE = "918930790652"; // Added a space for better readability

/** Fallback when API hasn't loaded or fails */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  organizationName: 'Fly Panchachuli',
  email: 'contact@flypanchachuli.org',
  phone: '+91 89307 90652',
  address: '1st Floor, Palika Bazar, Thanesar, Kurukshetra, Haryana',
  mapLocationKeyframe: '',
};

/**
 * Parse phone number for wa.me links - removes spaces, dashes, parentheses
 * and strips leading + for wa.me format
 */
export function parsePhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  return cleaned.startsWith("+") ? cleaned.slice(1) : cleaned || DEFAULT_PHONE;
}

/**
 * Format phone number for display (e.g., "+91 89307 90652")
 */
export function formatPhoneForDisplay(phone: string): string {
  if (phone.includes(" ")) return phone;

  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Format Indian numbers
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  if (cleaned.startsWith("+91") && cleaned.length === 13) {
    return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  }

  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}
