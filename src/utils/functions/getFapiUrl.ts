export const getFapiUrl = (path: string): string => {
  const port = typeof window !== 'undefined' ? window.location.port : "3000";
  const baseUrl = `http://localhost:${port}/api/fapi`;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export const copyFapiUrlToClipboard = async (path: string): Promise<boolean> => {
  try {
    const fullUrl = getFapiUrl(path);
    await navigator.clipboard.writeText(fullUrl);
    return true;
  } catch (error) {
    console.error("Failed to copy FAPI URL:", error);
    return false;
  }
};
