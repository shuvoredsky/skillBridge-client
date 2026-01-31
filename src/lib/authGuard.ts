export const requireAuth = () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }

  return token;
};
