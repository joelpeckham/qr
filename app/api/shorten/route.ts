import { NextRequest, NextResponse } from "next/server";
import { shortenUrl, SpooApiError } from "@/lib/spoo-api";

export async function POST(request: NextRequest) {
  try {
    const { long_url } = await request.json();

    if (!long_url || typeof long_url !== "string") {
      return NextResponse.json(
        { error: "long_url is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(long_url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SPOO_ME_API_KEY;

    const result = await shortenUrl(long_url, apiKey);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof SpooApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
