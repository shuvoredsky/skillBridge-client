"use client";

import { useState, useRef } from "react";
import { Card, Button, App, Typography, Divider, Alert, Tag } from "antd";
import {
  UploadOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  BookOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { settingsService } from "@/services/settings.service";
import { getImageUrl } from "@/lib/getImageUrl";

const { Title, Text, Paragraph } = Typography;

export default function AdminSettingsPage() {
  const { message } = App.useApp();
  const { logoUrl, siteName, refreshSettings } = useSiteConfig();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolvedCurrentLogo = getImageUrl(logoUrl);

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

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          Configure site branding, logos, and general platform parameters.
        </Text>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo Upload Card */}
        <div className="lg:col-span-2">
          <Card
            title={
              <div className="flex items-center gap-2">
                <PictureOutlined className="text-brand-green" />
                <span>Site Logo & Branding</span>
              </div>
            }
            className="shadow-sm rounded-xl border border-gray-100 dark:border-slate-800 dark:bg-slate-900"
          >
            <Paragraph className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Upload a custom logo for the platform. This image will appear in the main navigation bar across all pages, in page loading animations, and in platform branding assets.
            </Paragraph>

            <div className="space-y-6">
              {/* Current Active Logo */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700/60">
                <Text strong className="block mb-2 text-gray-700 dark:text-gray-200">
                  Current Active Logo:
                </Text>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-36 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center p-2 shadow-inner">
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
                    <Tag color={resolvedCurrentLogo ? "green" : "default"}>
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
                  className="border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-brand-green dark:hover:border-brand-green rounded-xl p-6 text-center cursor-pointer transition-colors bg-white dark:bg-slate-900"
                >
                  {previewUrl ? (
                    <div className="space-y-3">
                      <div className="h-20 w-44 mx-auto bg-slate-50 dark:bg-slate-800 rounded-lg p-2 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
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
                  className="bg-brand-green hover:bg-brand-green-hover text-white font-medium border-0 h-10 px-6 rounded-lg"
                >
                  Save & Apply Logo
                </Button>

                {selectedFile && (
                  <Button
                    onClick={handleCancelSelection}
                    disabled={uploading}
                    className="h-10 rounded-lg"
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
                <InfoCircleOutlined className="text-indigo-500" />
                <span>Branding Overview</span>
              </div>
            }
            className="shadow-sm rounded-xl border border-gray-100 dark:border-slate-800 dark:bg-slate-900"
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
                <div className="mt-2 p-3 bg-white dark:bg-slate-950 rounded-lg border border-gray-100 dark:border-slate-800 flex items-center space-x-2">
                  {previewUrl || resolvedCurrentLogo ? (
                    <img
                      src={previewUrl || resolvedCurrentLogo || ""}
                      alt="Logo Preview"
                      className="h-8 w-auto max-w-[100px] object-contain rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center">
                      <BookOutlined className="text-white text-sm" />
                    </div>
                  )}
                  <span className="font-bold text-gray-900 dark:text-white text-base">
                    {siteName || "SkillBridge"}
                  </span>
                </div>
              </div>

              <Divider className="my-2" />

              <Alert
                title="Instant Synchronization"
                description="Once uploaded, the new logo updates globally across public and admin layouts without requiring a server reboot."
                type="info"
                showIcon
                className="text-xs"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
