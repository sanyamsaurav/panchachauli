"use client";

import { useSettings } from "./useSettings";

/**
 * Hook to get WhatsApp link with the phone number from site settings.
 * Uses the centralized useSettings hook for single source of truth.
 * 
 * @param message - Optional pre-filled message for WhatsApp
 * @returns Object with whatsappLink, phone, and a helper to create custom links
 */
export function useWhatsApp(message?: string) {
  const { phoneForWhatsApp, rawPhone, createWhatsAppLink, isLoading } = useSettings();

  const createLink = (msg?: string) => createWhatsAppLink(msg);

  return {
    phone: phoneForWhatsApp,
    rawPhone,
    whatsappLink: createLink(message),
    isLoading,
    createLink,
  };
}
