"use client";

import { useState, useRef, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { downloadCanvasPng, downloadSvg, validatePngSize } from "@/lib/qr-utils";
import { normalizeUrl, isValidUrl, urlToFilename } from "@/lib/url-utils";
import type { ShortenRequestBody, ShortenResponse } from "@/lib/shorten-types";
import { UrlInput } from "@/components/UrlInput";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { DownloadControls } from "@/components/DownloadControls";
import { PngSettings } from "@/components/PngSettings";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [url, setUrl] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pngSize, setPngSize] = useState([512]);
  const [transparentBg, setTransparentBg] = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [downloadingSvg, setDownloadingSvg] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [qrContainerRef] = useAutoAnimate();

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    // Clear error when user types, but keep the previous QR code visible
    // to prevent layout shift until a new one is generated
    if (error) {
      setError(null);
    }
  };

  const buildDownloadFilename = (ext: "svg" | "png"): string => {
    const normalizedLongUrl = normalizeUrl(url);
    const base = urlToFilename(normalizedLongUrl);
    return base ? `${base}.${ext}` : `qrcode-${Date.now()}.${ext}`;
  };

  const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

  const handleGenerate = async () => {
    // Clear previous errors and success messages
    setError(null);
    setSuccess(null);

    // Validate URL format
    if (!url.trim()) {
      setError("Please enter a URL");
      setQrUrl(null);
      setShortUrl(null);
      return;
    }

    // Normalize URL (add https:// if missing)
    const normalizedUrl = normalizeUrl(url);
    
    // Validate normalized URL
    if (!isValidUrl(normalizedUrl)) {
      setError("Please enter a valid URL");
      setQrUrl(null);
      setShortUrl(null);
      return;
    }

    // Shorten URL via API route
    setLoading(true);
    try {
      const MAX_RETRIES = 2;
      const TIMEOUT_MS = 15000;

      const body: ShortenRequestBody = { longUrl: normalizedUrl };
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
          const response = await fetch("/api/shorten", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            signal: controller.signal,
          });

          if (!response.ok) {
            const errorData = (await response.json().catch(() => ({}))) as { error?: string };
            const errorMessage = errorData.error || "Failed to process URL";

            if (response.status >= 500 && attempt < MAX_RETRIES) {
              await delay(1000 * (attempt + 1));
              continue;
            }

            throw new Error(errorMessage);
          }

          const result: ShortenResponse = await response.json();
          if ("error" in result) {
            throw new Error(result.error);
          }

          setQrUrl(result.qrUrl);
          setShortUrl(result.wasShortened ? (result.shortUrl ?? null) : null);
          setError(null);

          if (result.wasShortened) {
            setSuccess("QR code generated successfully!");
          } else if (result.warning) {
            setSuccess(`QR code generated (URL not shortened): ${result.warning}`);
          } else {
            setSuccess("QR code generated (URL not shortened).");
          }

          lastError = null;
          break;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            lastError = new Error("Request timed out. Please try again.");
          } else {
            lastError = err instanceof Error ? err : new Error("Failed to process URL. Please try again.");
          }
        } finally {
          clearTimeout(timeoutId);
        }
      }

      if (lastError) {
        throw lastError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process URL. Please try again.");
      setQrUrl(null);
      setShortUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const qrValue = qrUrl;

  const handleCopyUrl = async () => {
    if (!qrUrl) return;

    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setSuccess("URL copied to clipboard!");
    } catch (_err) {
      setError("Failed to copy URL to clipboard");
    }
  };

  const handleDownloadSvg = () => {
    if (!qrRef.current || !qrValue) {
      setError("QR code is not available. Please generate a QR code first.");
      return;
    }

    setDownloadingSvg(true);
    setError(null);
    try {
      const filename = buildDownloadFilename("svg");
      downloadSvg(qrRef.current, filename);
      setSuccess("SVG downloaded successfully!");
    } catch (_err) {
      setError("Failed to download SVG. Please try again.");
    } finally {
      setDownloadingSvg(false);
    }
  };

  const handleDownloadPng = async () => {
    if (!qrCanvasRef.current || !qrValue) {
      setError("QR code is not available. Please generate a QR code first.");
      return;
    }

    const size = pngSize[0] ?? 512;
    if (!validatePngSize(size)) {
      setError("PNG size must be between 1 and 5000 pixels");
      return;
    }

    setDownloadingPng(true);
    setError(null);
    try {
      const filename = buildDownloadFilename("png");
      await downloadCanvasPng(
        qrCanvasRef.current,
        filename,
        size,
        transparentBg ? undefined : "#ffffff"
      );
      setSuccess("PNG downloaded successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate PNG. Please try again.";
      console.error("PNG generation error:", err);
      setError(errorMessage);
    } finally {
      setDownloadingPng(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <ThemeToggle />
      <main className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">No Bullshit QR Codes</h1>
          <p className="text-muted-foreground">
            Generate QR codes instantly with automatic URL shortening
          </p>
        </div>

        <div className="space-y-4">
          <UrlInput
            url={url}
            loading={loading}
            error={error}
            success={success}
            qrUrl={qrUrl}
            shortUrl={shortUrl}
            copied={copied}
            onUrlChange={handleUrlChange}
            onGenerate={handleGenerate}
            onCopy={handleCopyUrl}
          />

          <div ref={qrContainerRef}>
            {qrValue && (
              <div className="space-y-6">
                <QRCodeDisplay
                  value={qrValue}
                  qrSvgRef={qrRef}
                  qrCanvasRef={qrCanvasRef}
                  pngSize={pngSize[0] ?? 512}
                  transparentBg={transparentBg}
                />

                <div className="space-y-4">
                  <DownloadControls
                    downloadingSvg={downloadingSvg}
                    downloadingPng={downloadingPng}
                    onDownloadSvg={handleDownloadSvg}
                    onDownloadPng={handleDownloadPng}
                  />

                  <PngSettings
                    pngSize={pngSize}
                    transparentBg={transparentBg}
                    onPngSizeChange={setPngSize}
                    onTransparentBgChange={setTransparentBg}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
