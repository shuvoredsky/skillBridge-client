"use client";

import { useState, useRef, useEffect } from "react";
import { Card, Button, App, Typography, Divider, Alert, Tag, Input } from "antd";
import {
  UploadOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  BookOutlined,
  InfoCircleOutlined,
  FileImageOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { settingsService } from "@/services/settings.service";
import { getImageUrl } from "@/lib/getImageUrl";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function AdminSettingsPage() {
  const { message } = App.useApp();
  const {
    logoUrl,
    bannerUrl,
    bannerTitle,
    bannerSubtitle,
    siteName,
    refreshSettings,
  } = useSiteConfig();

  // Logo upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Banner upload state
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // Text settings state
  const [heroTitle, setHeroTitle] = useState<string>(bannerTitle || "");
  const [heroSubtitle, setHeroSubtitle] = useState<string>(bannerSubtitle || "");
  const [savingText, setSavingText] = useState(false);

  useEffect(() => {
    if (bannerTitle !== undefined && bannerTitle !== null) {
      setHeroTitle(bannerTitle);
    }
    if (bannerSubtitle !== undefined && bannerSubtitle !== null) {
      setHeroSubtitle(bannerSubtitle);
    }
  }, [bannerTitle, bannerSubtitle]);

  const resolvedCurrentLogo = getImageUrl(logoUrl);
  const resolvedCurrentBanner = getImageUrl(bannerUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      message.error("Invalid file format. Please choose a JPEG, PNG, or WebP image.");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error("File exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      message.error("Invalid file format. Please choose a JPEG, PNG, or WebP image.");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error("File exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setSelectedBannerFile(file);
    const localUrl = URL.createObjectURL(file);
    setBannerPreviewUrl(localUrl);
  };

  const handleSaveLogo = async () => {
    if (!selectedFile) {
      message.warning("Please select an image file first.");
      return;
    }

    setUploading(true);
    try {
      const response = await settingsService.uploadSiteLogo(selectedFile);
      if (response.error) {
        throw new Error(response.error);
      }

      message.success("Site logo updated successfully!");
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await refreshSettings();
    } catch (err: any) {
      console.error("Failed to upload site logo:", err);
      message.error(err.message || "Failed to update site logo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBanner = async () => {
    if (!selectedBannerFile) {
      message.warning("Please select a banner image file first.");
      return;
    }

    setUploadingBanner(true);
    try {
      const response = await settingsService.uploadSiteBanner(selectedBannerFile);
      if (response.error) {
        throw new Error(response.error);
      }

      message.success("Home page banner updated successfully!");
      setSelectedBannerFile(null);
      setBannerPreviewUrl(null);
      if (bannerFileInputRef.current) {
        bannerFileInputRef.current.value = "";
      }
      await refreshSettings();
    } catch (err: any) {
      console.error("Failed to upload home banner:", err);
      message.error(err.message || "Failed to update home banner. Please try again.");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSaveTextSettings = async () => {
    setSavingText(true);
    try {
      const response = await settingsService.updateSiteTextSettings({
        bannerTitle: heroTitle,
        bannerSubtitle: heroSubtitle,
      });
      if (response.error) {
        throw new Error(response.error);
      }

      message.success("Hero text settings updated successfully!");
      await refreshSettings();
    } catch (err: any) {
      console.error("Failed to update text settings:", err);
      message.error(err.message || "Failed to update text settings.");
    } finally {
      setSavingText(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelBannerSelection = () => {
    setSelectedBannerFile(null);
    setBannerPreviewUrl(null);
    if (bannerFileInputRef.current) {
      bannerFileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Title level={2} className="!mb-1 text-gray-900 dark:text-white">
          Platform Settings
        </Title>
        <Text className="text-gray-500 dark:text-gray-400">
          Configure site branding, logos, hero banners, and general platform parameters.
        </Text>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Logo + Banner Cards) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Upload Card */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <PictureOutlined className="text-brand-green" />
                <span className="font-semibold text-gray-900 dark:text-white">Site Logo & Branding</span>
              </div>
            }
            className="shadow-sm rounded-2xl border border-gray-100 dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
          >
            <Paragraph className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
              Upload a custom logo for the platform. This image will appear in the main navigation bar across all pages, in page loading animations, and in platform branding assets.
            </Paragraph>

            <div className="space-y-6">
              {/* Current Active Logo */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/60">
                <Text strong className="block mb-2 text-gray-700 dark:text-gray-200">
                  Current Active Logo:
                </Text>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-36 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-center p-2 shadow-inner">
                    {resolvedCurrentLogo ? (
                      <img
                        src={resolvedCurrentLogo}
                        alt="Current Site Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <BookOutlined className="text-brand-green text-lg" />
                        <span>Default Icon</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Tag color={resolvedCurrentLogo ? "green" : "default"} className="font-semibold rounded-full px-2.5 py-0.5">
                      {resolvedCurrentLogo ? "Custom Logo Active" : "Default Fallback"}
                    </Tag>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {resolvedCurrentLogo ? "Stored securely on Cloudinary" : "No custom logo uploaded yet"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload & Preview Section */}
              <div>
                <Text strong className="block mb-2 text-gray-700 dark:text-gray-200">
                  Upload New Logo:
                </Text>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="logo-file-input"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-brand-green dark:hover:border-brand-green rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white dark:bg-slate-900"
                >
                  {previewUrl ? (
                    <div className="space-y-3">
                      <div className="h-20 w-44 mx-auto bg-slate-50 dark:bg-slate-800 rounded-xl p-2 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
                        <img
                          src={previewUrl}
                          alt="New Logo Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="text-xs text-brand-green font-medium">
                        ✓ {selectedFile?.name} ({((selectedFile?.size || 0) / 1024).toFixed(1)} KB)
                      </div>
                      <Text className="text-xs text-gray-400 block">
                        Click here to choose a different image
                      </Text>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <UploadOutlined className="text-3xl text-brand-green" />
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Click to browse or drag & drop your logo image
                      </div>
                      <div className="text-xs text-gray-400">
                        Supported formats: JPEG, PNG, WebP (Max size: 5MB)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={uploading}
                  disabled={!selectedFile}
                  onClick={handleSaveLogo}
                  className="bg-brand-green hover:bg-brand-green-hover text-white font-semibold border-0 h-11 px-6 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                >
                  Save & Apply Logo
                </Button>

                {selectedFile && (
                  <Button
                    onClick={handleCancelSelection}
                    disabled={uploading}
                    className="h-11 px-5 rounded-xl font-medium active:scale-[0.98] transition-all duration-200"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Hero Banner Upload & Text Card */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <FileImageOutlined className="text-brand-green" />
                <span className="font-semibold text-gray-900 dark:text-white">Home Page Hero Banner & Text</span>
              </div>
            }
            className="shadow-sm rounded-2xl border border-gray-100 dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
          >
            <Paragraph className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
              Customize the dynamic hero section on the Home page. Upload a high-resolution background banner image and set custom headline & subtitle copy.
            </Paragraph>

            <div className="space-y-6">
              {/* Text Settings Form */}
              <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2 mb-1">
                  <EditOutlined className="text-brand-green text-sm" />
                  <Text strong className="text-gray-800 dark:text-gray-200 text-sm">
                    Hero Section Headlines
                  </Text>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Hero Title / Headline
                  </label>
                  <Input
                    placeholder="e.g. Learn From The Best Tutors Worldwide"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    maxLength={100}
                    size="large"
                    className="rounded-xl"
                  />
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 block mt-1.5">
                    Leave blank to use the default title: "Learn From The Best Tutors Worldwide"
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Hero Subtitle / Description
                  </label>
                  <TextArea
                    rows={2}
                    placeholder="e.g. Connect with expert tutors for personalized 1-on-1 learning sessions."
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    maxLength={250}
                    className="rounded-xl"
                  />
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 block mt-1.5">
                    Leave blank to use the default platform subtitle.
                  </span>
                </div>

                <div className="pt-2">
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    loading={savingText}
                    onClick={handleSaveTextSettings}
                    className="bg-brand-green hover:bg-brand-green-hover text-white font-semibold border-0 h-10 px-5 rounded-xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
                  >
                    Save Text Settings
                  </Button>
                </div>
              </div>

              {/* Current Active Banner */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/60">
                <Text strong className="block mb-2 text-gray-700 dark:text-gray-200">
                  Current Active Banner:
                </Text>
                <div className="space-y-3">
                  <div className="h-32 w-full bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-center p-2 shadow-inner overflow-hidden">
                    {resolvedCurrentBanner ? (
                      <img
                        src={resolvedCurrentBanner}
                        alt="Current Site Banner"
                        className="max-h-full max-w-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-400 text-xs">
                        <FileImageOutlined className="text-brand-green text-2xl" />
                        <span>Default Gradient Hero Active (No Image Uploaded)</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Tag color={resolvedCurrentBanner ? "green" : "default"} className="font-semibold rounded-full px-2.5 py-0.5">
                      {resolvedCurrentBanner ? "Custom Banner Active" : "Default Gradient Active"}
                    </Tag>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {resolvedCurrentBanner ? "Cloudinary CDN Optimized" : "No banner file uploaded"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Banner Upload & Preview Section */}
              <div>
                <Text strong className="block mb-2 text-gray-700 dark:text-gray-200">
                  Upload New Banner Image:
                </Text>

                <input
                  ref={bannerFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleBannerFileChange}
                  className="hidden"
                  id="banner-file-input"
                />

                <div
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-brand-green dark:hover:border-brand-green rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white dark:bg-slate-900"
                >
                  {bannerPreviewUrl ? (
                    <div className="space-y-3">
                      <div className="h-32 w-full max-w-md mx-auto bg-slate-50 dark:bg-slate-800 rounded-xl p-2 border border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                        <img
                          src={bannerPreviewUrl}
                          alt="New Banner Preview"
                          className="max-h-full max-w-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="text-xs text-brand-green font-medium">
                        ✓ {selectedBannerFile?.name} ({((selectedBannerFile?.size || 0) / 1024).toFixed(1)} KB)
                      </div>
                      <Text className="text-xs text-gray-400 block">
                        Click here to choose a different banner image
                      </Text>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <UploadOutlined className="text-3xl text-brand-green" />
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Click to browse or drag & drop your hero banner image
                      </div>
                      <div className="text-xs text-gray-400">
                        Recommended resolution: 1920x600px (JPEG, PNG, WebP - Max 5MB)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={uploadingBanner}
                  disabled={!selectedBannerFile}
                  onClick={handleSaveBanner}
                  className="bg-brand-green hover:bg-brand-green-hover text-white font-semibold border-0 h-11 px-6 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                >
                  Save & Apply Hero Banner
                </Button>

                {selectedBannerFile && (
                  <Button
                    onClick={handleCancelBannerSelection}
                    disabled={uploadingBanner}
                    className="h-11 px-5 rounded-xl font-medium active:scale-[0.98] transition-all duration-200"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Info / Preview Summary Card */}
        <div className="space-y-6">
          <Card
            title={
              <div className="flex items-center gap-2">
                <InfoCircleOutlined className="text-emerald-500" />
                <span className="font-semibold text-gray-900 dark:text-white">Branding Overview</span>
              </div>
            }
            className="shadow-sm rounded-2xl border border-gray-100 dark:border-slate-800 dark:bg-slate-900 sticky top-6 overflow-hidden"
          >
            <div className="space-y-4 text-sm">
              <div>
                <Text strong className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  Platform Name
                </Text>
                <div className="text-gray-900 dark:text-white font-semibold text-base mt-0.5">
                  {siteName || "SkillBridge"}
                </div>
              </div>

              <Divider className="my-2" />

              <div>
                <Text strong className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  Navbar Preview Simulation
                </Text>
                <div className="mt-2 p-3 bg-white dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-800 flex items-center space-x-2">
                  {previewUrl || resolvedCurrentLogo ? (
                    <img
                      src={previewUrl || resolvedCurrentLogo || ""}
                      alt="Logo Preview"
                      className="h-8 w-auto max-w-[100px] object-contain rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                      <BookOutlined className="text-white text-sm" />
                    </div>
                  )}
                  <span className="font-bold text-gray-900 dark:text-white text-base">
                    {siteName || "SkillBridge"}
                  </span>
                </div>
              </div>

              <Divider className="my-2" />

              <div>
                <Text strong className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  Hero Banner Simulation
                </Text>
                <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-white relative overflow-hidden min-h-[100px] flex flex-col justify-center">
                  {(bannerPreviewUrl || resolvedCurrentBanner) && (
                    <img
                      src={bannerPreviewUrl || resolvedCurrentBanner || ""}
                      alt="Hero Simulation"
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                  )}
                  <div className="relative z-10 text-center px-2">
                    <div className="text-xs font-bold text-emerald-400 line-clamp-1">
                      {heroTitle || "Learn From The Best Tutors Worldwide"}
                    </div>
                    <div className="text-[10px] text-gray-300 line-clamp-1 mt-0.5">
                      {heroSubtitle || "Connect with expert tutors for 1-on-1 learning"}
                    </div>
                  </div>
                </div>
              </div>

              <Divider className="my-2" />

              <Alert
                title="Instant Synchronization"
                description="Uploaded banners and text updates automatically sync across public layouts in real time."
                type="info"
                showIcon
                className="text-xs rounded-xl"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
