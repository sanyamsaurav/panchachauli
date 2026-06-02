"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/constants/site-settings";

interface SiteSettingsContextValue {
  settings: SiteSettings;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULT_SITE_SETTINGS,
  isLoading: true,
  error: null,
  refetch: async () => {},
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Failed to load settings");
        return;
      }
      const d = json?.data;
      if (d) {
        setSettings({
          organizationName: d.organizationName ?? DEFAULT_SITE_SETTINGS.organizationName,
          email: d.email ?? DEFAULT_SITE_SETTINGS.email,
          phone: d.phone ?? DEFAULT_SITE_SETTINGS.phone,
          address: d.address ?? DEFAULT_SITE_SETTINGS.address,
          mapLocationKeyframe: d.mapLocationKeyframe ?? DEFAULT_SITE_SETTINGS.mapLocationKeyframe,
        });
      }
    } catch {
      setError("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{ settings, isLoading, error, refetch: load }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettingsContextValue {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    return {
      settings: DEFAULT_SITE_SETTINGS,
      isLoading: false,
      error: null,
      refetch: async () => {},
    };
  }
  return ctx;
}
