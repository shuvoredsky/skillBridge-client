const getCleanBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://skillbridge-server-a.onrender.com";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

// Use NEXT_PUBLIC_API_BASE_URL if NEXT_PUBLIC_API_URL is undefined (fixes routing errors in local dev)
const BASE_URL = getCleanBaseUrl();

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      // Get token from localStorage as fallback
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      
      const headers: Record<string, string> = {
        ...options.headers as Record<string, string>,
      };

      // Only set Content-Type if body is not FormData (for file uploads)
      if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      // Add token to Authorization header if available
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          data: null,
          error: errorData.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "An error occurred",
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  // ✅ ADD THIS METHOD
  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

export const api = new ApiClient(BASE_URL);
