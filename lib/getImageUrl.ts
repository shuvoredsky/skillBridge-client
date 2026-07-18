const getCleanBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://skillbridge-server-a.onrender.com";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

/**
 * Bug 1 Fix: Shared helper to construct absolute image URLs.
 * Falls back to check both tutor.profilePhoto (uploaded) and tutor.user.image (external oauth).
 */
export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanBaseUrl = getCleanBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBaseUrl}${cleanPath}`;
};
