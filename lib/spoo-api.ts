export interface ShortenUrlRequest {
  long_url: string;
  alias?: string;
  password?: string;
  max_clicks?: number;
  expire_after?: number;
  block_bots?: boolean;
  private_stats?: boolean;
}

export interface ShortenUrlResponse {
  alias: string;
  short_url: string;
  long_url: string;
  owner_id: string | null;
  created_at: number;
  status: "ACTIVE" | "INACTIVE";
  private_stats: boolean;
}

export class SpooApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = "SpooApiError";
  }
}

export async function shortenUrl(
  longUrl: string,
  apiKey?: string
): Promise<ShortenUrlResponse> {
  const requestBody: ShortenUrlRequest = {
    long_url: longUrl,
  };

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  let response: Response;
  try {
    response = await fetch("https://spoo.me/api/v1/shorten", {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new SpooApiError("Request timeout. Please try again.", 408);
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new SpooApiError("Request was aborted.", 499);
    }
    // Network errors
    throw new SpooApiError(
      "Network error. Please check your connection and try again.",
      503
    );
  }

  if (!response.ok) {
    let errorMessage = "Failed to shorten URL";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use status text or default message
      errorMessage = response.statusText || errorMessage;
    }

    // Provide more specific error messages based on status code
    if (response.status === 400) {
      errorMessage = errorMessage || "Invalid request. Please check the URL format.";
    } else if (response.status === 401) {
      errorMessage = "Authentication failed. Please check your API key.";
    } else if (response.status === 403) {
      errorMessage = "Access forbidden. Please check your API permissions.";
    } else if (response.status === 429) {
      errorMessage = "Too many requests. Please try again later.";
    } else if (response.status >= 500) {
      errorMessage = "Service temporarily unavailable. Please try again later.";
    }

    throw new SpooApiError(errorMessage, response.status);
  }

  return response.json();
}

