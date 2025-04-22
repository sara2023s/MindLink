export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const normalizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    return url;
  }
};

export const getDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
};

// Alias for getDomain to maintain compatibility
export const extractDomainFromUrl = getDomain;

export const isSameDomain = (url1: string, url2: string): boolean => {
  return getDomain(url1) === getDomain(url2);
}; 