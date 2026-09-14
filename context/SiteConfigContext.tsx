"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { settingsService, SiteSetting } from "@/services/settings.service";

interface SiteConfigContextType {
  logoUrl: string | null;
  siteName: string;
  loading: boolean;
  settings: SiteSetting | null;
  refreshSettings: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSetting | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [siteName, setSiteName] = useState<string>("SkillBridge");
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await settingsService.getSiteSettings();
      if (response?.data?.data) {
        const data = response.data.data;
        setSettings(data);
        setLogoUrl(data.logoUrl || null);
        if (data.siteName) {
          setSiteName(data.siteName);
        }
      }
    } catch (err) {
      console.error("Failed to load site settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return (
    <SiteConfigContext.Provider
      value={{
        logoUrl,
        siteName,
        loading,
        settings,
        refreshSettings,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error("useSiteConfig must be used within SiteConfigProvider");
  }
  return context;
}
