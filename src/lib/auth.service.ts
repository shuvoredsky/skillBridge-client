const BACKEND_URL = "https://skillbridge-server-a.onrender.com";

export const getMe = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
};
