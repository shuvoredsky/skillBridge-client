import { api } from "@/lib/api-client";

export interface SiteSetting {
  id: string;
  siteName: string;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettingsResponse {
  success: boolean;
  message?: string;
  data: SiteSetting;
}

export const settingsService = {
  getSiteSettings: async () => {
    return api.get<SiteSettingsResponse>("/api/v1/settings");
  },

  uploadSiteLogo: async (file: File) => {
    const formData = new FormData();
    formData.append("logo", file);

    return api.upload<SiteSettingsResponse>("/api/v1/settings/logo", formData);
  },
};
