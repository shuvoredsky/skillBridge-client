const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const registerUser = async (userData: any) => {
  const res = await fetch(`${BACKEND_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (credentials: any) => {
  const res = await fetch(`${BACKEND_URL}/api/auth/login/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return res.json();
};