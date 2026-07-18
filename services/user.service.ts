import { api } from "@/lib/api-client";

export interface UploadPhotoResponse {
  message: string;
  profilePhoto: string;
  profilePhotoUrl: string;
}

export const UserService = {
  async getMe() {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.json();
  },
};

export const userService = {
  uploadProfilePhoto: async (id: string, file: File, role: "tutor" | "student") => {
    const formData = new FormData();
    formData.append("photo", file);

    const endpoint = role === "tutor" 
      ? `/api/tutors/${id}/upload-photo` 
      : `/api/students/${id}/upload-photo`;

    return api.upload<UploadPhotoResponse>(endpoint, formData);
  }
};
