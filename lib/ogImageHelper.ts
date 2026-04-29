// lib/ogImageHelper.ts
export const getFullOgImage = (
  ogImagePath: string | undefined,
  siteUrl: string,
): string => {
  // If no image path provided, use default
  if (!ogImagePath) {
    return `${siteUrl}/images/default-og-image.jpg`;
  }

  // If path already has http/https, return as is
  if (ogImagePath.startsWith("http")) {
    return ogImagePath;
  }

  // Ensure path starts with /
  const normalizedPath = ogImagePath.startsWith("/")
    ? ogImagePath
    : `/${ogImagePath}`;

  return `${siteUrl}${normalizedPath}`;
};
