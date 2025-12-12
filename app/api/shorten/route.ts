import { NextRequest, NextResponse } from "next/server";
import { shortenUrl, SpooApiError } from "@/lib/spoo-api";
import type {
  ShortenErrorResponse,
  ShortenOkResponse,
  ShortenRequestBody,
} from "@/lib/shorten-types";
import { isValidUrl, normalizeUrl } from "@/lib/url-utils";

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute
const MAX_REQUEST_SIZE = 1024 * 10; // 10KB

function pruneRateLimitMap(now: number): void {
  // Prevent unbounded growth in long-running environments.
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  // Lightweight pruning: only do work when the map is non-trivial.
  if (rateLimitMap.size > 500) {
    pruneRateLimitMap(now);
  }
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Create or reset the record
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  let normalizedLongUrlForFallback: string | null = null;
  try {
    // Check rate limit
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." } satisfies ShortenErrorResponse,
        { status: 429 }
      );
    }

    // Check request size
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { error: "Request too large" } satisfies ShortenErrorResponse,
        { status: 413 }
      );
    }

    const body: unknown = await request.json();

    // Validate request body size
    const bodyString = JSON.stringify(body);
    if (bodyString.length > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { error: "Request body too large" } satisfies ShortenErrorResponse,
        { status: 413 }
      );
    }

    const { longUrl } = body as Partial<ShortenRequestBody>;

    if (!longUrl || typeof longUrl !== "string") {
      return NextResponse.json(
        { error: "longUrl is required and must be a string" } satisfies ShortenErrorResponse,
        { status: 400 }
      );
    }

    // Normalize/validate URL format (server-side too).
    const normalizedLongUrl = normalizeUrl(longUrl);
    if (!isValidUrl(normalizedLongUrl)) {
      return NextResponse.json(
        { error: "Invalid URL format" } satisfies ShortenErrorResponse,
        { status: 400 }
      );
    }
    normalizedLongUrlForFallback = normalizedLongUrl;

    const apiKey = process.env.SPOO_ME_API_KEY;
    if (!apiKey) {
      const response: ShortenOkResponse = {
        longUrl: normalizedLongUrl,
        qrUrl: normalizedLongUrl,
        wasShortened: false,
      };
      return NextResponse.json(response, { status: 200 });
    }

    const result = await shortenUrl(normalizedLongUrl, apiKey);
    const response: ShortenOkResponse = {
      longUrl: normalizedLongUrl,
      shortUrl: result.short_url,
      qrUrl: result.short_url,
      wasShortened: true,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof SpooApiError) {
      // Fall back to "no shortening" for upstream failures to preserve app functionality.
      // If the request body is invalid, we still return a 4xx above.
      if (normalizedLongUrlForFallback) {
        const response: ShortenOkResponse = {
          longUrl: normalizedLongUrlForFallback,
          qrUrl: normalizedLongUrlForFallback,
          wasShortened: false,
          warning: error.message,
        };
        return NextResponse.json(response, { status: 200 });
      }

      return NextResponse.json({ error: error.message } satisfies ShortenErrorResponse, {
        status: error.statusCode,
      });
    }

    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Internal server error" } satisfies ShortenErrorResponse,
      { status: 500 }
    );
  }
}
