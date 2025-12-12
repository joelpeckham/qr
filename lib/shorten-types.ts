/**
 * Types for the internal `/api/shorten` endpoint.
 *
 * Notes:
 * - This endpoint may *shorten* a URL (when configured), or *fallback* to using the normalized long URL.
 * - The client should always use `qrUrl` as the value to encode in the QR code.
 */

/**
 * Request body sent to `/api/shorten`.
 */
export interface ShortenRequestBody {
  /**
   * The user-provided URL after client-side normalization (e.g., with protocol added).
   */
  longUrl: string;
}

/**
 * Successful response from `/api/shorten`.
 */
export interface ShortenOkResponse {
  /**
   * The normalized long URL (always present).
   */
  longUrl: string;

  /**
   * The shortened URL, if URL shortening succeeded.
   */
  shortUrl?: string;

  /**
   * The URL the client should encode into the QR code.
   * This is `shortUrl` when shortening succeeded, otherwise `longUrl`.
   */
  qrUrl: string;

  /**
   * Whether the response was shortened (i.e. `qrUrl` is a short URL).
   */
  wasShortened: boolean;

  /**
   * Optional informational warning (non-fatal).
   */
  warning?: string;
}

/**
 * Error response from `/api/shorten`.
 */
export interface ShortenErrorResponse {
  error: string;
}

export type ShortenResponse = ShortenOkResponse | ShortenErrorResponse;


