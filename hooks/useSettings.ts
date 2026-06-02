"use client";

import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import {
  DEFAULT_PHONE,
  DEFAULT_SITE_SETTINGS,
  parsePhoneForWhatsApp,
  formatPhoneForDisplay,
  type SiteSettings,
} from "@/constants/site-settings";

/**
 * Hook to get site settings from context with phone helpers.
 * This is the single point for accessing phone number across the app.
 *
 * @returns Object with settings, phone helpers, loading state, and refetch function
 */
export function useSettings() {
  const { settings, isLoading, error, refetch } = useSiteSettings();

  // Get the raw phone from settings or fallback
  const rawPhone = settings.phone || DEFAULT_SITE_SETTINGS.phone;

  // Parse phone for WhatsApp links (without +)
  const phoneForWhatsApp = parsePhoneForWhatsApp(rawPhone);

  // Format phone for display
  const phoneForDisplay = formatPhoneForDisplay(rawPhone);

  // Create WhatsApp link with optional message
  const createWhatsAppLink = (message?: string) => {
    const encodedMessage = message ? encodeURIComponent(message) : "";
    return `https://wa.me/${phoneForWhatsApp}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
  };

  return {
    settings,
    isLoading,
    error,
    refetch,
    // Phone helpers
    rawPhone,
    phoneForWhatsApp,
    phoneForDisplay,
    createWhatsAppLink,
    // Default fallbacks
    defaultPhone: DEFAULT_PHONE,
    defaultSettings: DEFAULT_SITE_SETTINGS,
  };
}

/**
 * Server-side helper to get phone from settings object.
 * Use this in server components when you have settings from getSettings().
 */
export function getPhoneFromSettings(settings: Pick<SiteSettings, "phone"> | null | undefined): string {
  return parsePhoneForWhatsApp(settings?.phone || DEFAULT_SITE_SETTINGS.phone);
}

/**
 * Server-side helper to create WhatsApp link from settings.
 */
export function getWhatsAppLinkFromSettings(
  settings: Pick<SiteSettings, "phone"> | null | undefined,
  message?: string
): string {
  const phone = getPhoneFromSettings(settings);
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${phone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}
