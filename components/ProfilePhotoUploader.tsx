"use client";

import { useRef, useState } from "react";
import { Avatar, Button, Spin, message } from "antd";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import { userService } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";

interface ProfilePhotoUploaderProps {
  userId: string;
  role: "tutor" | "student";
  currentPhotoUrl?: string | null;
  onUploadSuccess?: (newPhotoUrl: string) => void;
}

export default function ProfilePhotoUploader({
  userId,
  role,
  currentPhotoUrl,
  onUploadSuccess,
}: ProfilePhotoUploaderProps) {
  const { refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentPhotoUrl || undefined);
  const [error, setError] = useState<string | null>(null);

  // Helper to construct absolute image URL using the backend base URL env
  const getFullImageUrl = (path: string | undefined | null) => {
    if (!path) return undefined;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    // Support NEXT_PUBLIC_API_BASE_URL in local dev environment
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://skillbridge-server-a.onrender.com";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}${cleanPath}`;
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // 1. Client-side validations
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      const errMsg = "Invalid file type. Only JPEG, PNG, and WebP images are allowed.";
      setError(errMsg);
      message.error(errMsg);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const errMsg = "File is too large. Maximum size allowed is 5MB.";
      setError(errMsg);
      message.error(errMsg);
      return;
    }

    // 2. Set instant local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setLoading(true);

    try {
      // 3. Upload to server
      const response = await userService.uploadProfilePhoto(userId, file, role);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        const newPhotoUrl = response.data.profilePhotoUrl;
        
        // Success notification
        message.success("Profile photo updated successfully!");
        
        // Save to local storage cache so AuthContext reads it on refresh/reload
        localStorage.setItem(`profilePhoto_${userId}`, newPhotoUrl);

        // Trigger AuthContext state update
        await refreshUser();

        // Trigger success callback
        if (onUploadSuccess) {
          onUploadSuccess(newPhotoUrl);
        }
      }
    } catch (err: any) {
      // Bug 3 Note: If this returns "Route not found" (404), ensure the target backend server (e.g. Vercel)
      // has been deployed with the new routes. In local testing, ensure .env.local points to http://localhost:5000.
      const errMsg = err.message || "Failed to upload photo. Please try again.";
      setError(errMsg);
      message.error(errMsg);
      // Revert to old photo
      setPreviewUrl(currentPhotoUrl || undefined);
    } finally {
      setLoading(false);
      // Reset file input so same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const displayUrl = getFullImageUrl(previewUrl || currentPhotoUrl);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
        <div className="relative rounded-full overflow-hidden w-[120px] h-[120px] border-4 border-white shadow-lg">
          {loading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-full">
              <Spin size="default" />
            </div>
          )}
          <Avatar
            size={112}
            src={displayUrl}
            icon={<UserOutlined />}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-85"
          />
        </div>
        
        <Button
          icon={<CameraOutlined />}
          shape="circle"
          size="middle"
          className="absolute bottom-0 right-0 shadow-md bg-white hover:bg-gray-50 flex items-center justify-center border border-gray-200 z-20"
          onClick={(e) => {
            e.stopPropagation();
            handleAvatarClick();
          }}
        />
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1 text-center max-w-[200px]">{error}</p>}
    </div>
  );
}
