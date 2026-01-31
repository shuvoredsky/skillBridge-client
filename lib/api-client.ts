// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}


export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return { data, message: data.message };
  } catch (error: any) {
    return { error: error.message };
  }
}


export const api = {
  get: <T = any>(endpoint: string) =>
    apiCall<T>(endpoint, { method: "GET" }),

  post: <T = any>(endpoint: string, body: any) =>
    apiCall<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T = any>(endpoint: string, body: any) =>
    apiCall<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T = any>(endpoint: string, body: any) =>
    apiCall<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T = any>(endpoint: string) =>
    apiCall<T>(endpoint, { method: "DELETE" }),
};