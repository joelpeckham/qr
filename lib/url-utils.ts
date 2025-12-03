/**
 * Normalizes a URL by adding https:// protocol if missing
 * @param url - The URL to normalize
 * @returns The normalized URL with protocol
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  
  // If empty, return as is
  if (!trimmed) {
    return trimmed;
  }

  // If already has protocol, return as is
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Add https:// prefix
  return `https://${trimmed}`;
}

/**
 * Validates if a string is a valid URL
 * @param url - The URL string to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Converts a URL to a filename-safe string
 * @param url - The URL to convert
 * @param maxLength - Maximum length of the filename (default: 200)
 * @returns A filename-safe string based on the URL
 */
export function urlToFilename(url: string, maxLength: number = 200): string {
  if (!url || !url.trim()) {
    return "";
  }

  let filename = url.trim();

  // Remove protocol (http://, https://)
  filename = filename.replace(/^https?:\/\//i, "");

  // Replace invalid filename characters with hyphens
  // Invalid characters: / : ? # & = % < > | " ' \ * ~ ` { } [ ]
  filename = filename.replace(/[/:?#&=%<>|"'\\*~`{}[\]]/g, "-");

  // Replace spaces with hyphens
  filename = filename.replace(/\s+/g, "-");

  // Collapse multiple consecutive hyphens into a single hyphen
  filename = filename.replace(/-+/g, "-");

  // Trim leading and trailing hyphens
  filename = filename.replace(/^-+|-+$/g, "");

  // Limit length
  if (filename.length > maxLength) {
    filename = filename.substring(0, maxLength);
    // Remove trailing hyphen if we cut at a hyphen
    filename = filename.replace(/-+$/, "");
  }

  // If result is empty after sanitization, return empty string
  if (!filename) {
    return "";
  }

  return filename;
}

