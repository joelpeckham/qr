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

  const response = await fetch("https://spoo.me/api/v1/shorten", {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errorMessage = "Failed to shorten URL";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new SpooApiError(errorMessage, response.status);
  }

  return response.json();
}

