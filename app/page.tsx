"use client";

import { useState, useRef, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { svgToPng, downloadSvg, downloadBlob, validatePngSize } from "@/lib/qr-utils";
import { normalizeUrl, isValidUrl, urlToFilename } from "@/lib/url-utils";
import { UrlInput } from "@/components/UrlInput";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { DownloadControls } from "@/components/DownloadControls";
import { PngSettings } from "@/components/PngSettings";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pngSize, setPngSize] = useState([512]);
  const [transparentBg, setTransparentBg] = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [downloadingSvg, setDownloadingSvg] = useState(false);
  const [copied, setCopied] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const qrRef = useRef<SVGSVGElement>(null);
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

  const handleGenerate = async (isRetry = false) => {
    // Clear previous errors and success messages
    setError(null);
    setSuccess(null);
    if (!isRetry) {
      setRetryCount(0);
    }

    // Validate URL format
    if (!url.trim()) {
      setError("Please enter a URL");
      setShortUrl(null);
      return;
    }

    // Normalize URL (add https:// if missing)
    const normalizedUrl = normalizeUrl(url);
    
    // Validate normalized URL
    if (!isValidUrl(normalizedUrl)) {
      setError("Please enter a valid URL");
      setShortUrl(null);
      return;
    }

    // Shorten URL via API route
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ long_url: normalizedUrl }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "Failed to shorten URL";
        
        // Retry logic for 5xx errors
        if (response.status >= 500 && retryCount < 2) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => handleGenerate(true), 1000 * (retryCount + 1));
          return;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setShortUrl(result.short_url);
      setError(null);
      setSuccess("QR code generated successfully!");
      setRetryCount(0);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to shorten URL. Please try again.");
      }
      setShortUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const qrValue = shortUrl;

  const handleCopyUrl = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setSuccess("URL copied to clipboard!");
    } catch (err) {
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
      // Generate filename from long URL
      const normalizedUrl = normalizeUrl(url);
      const urlBasedFilename = urlToFilename(normalizedUrl);
      const filename = urlBasedFilename 
        ? `${urlBasedFilename}.svg`
        : `qrcode-${Date.now()}.svg`;
      downloadSvg(qrRef.current, filename);
      setSuccess("SVG downloaded successfully!");
    } catch (err) {
      setError("Failed to download SVG. Please try again.");
    } finally {
      setDownloadingSvg(false);
    }
  };

  const handleDownloadPng = async () => {
    if (!qrRef.current || !qrValue) {
      setError("QR code is not available. Please generate a QR code first.");
      return;
    }

    const size = pngSize[0];
    if (!validatePngSize(size)) {
      setError("PNG size must be between 1 and 5000 pixels");
      return;
    }

    setDownloadingPng(true);
    setError(null);
    try {
      const blob = await svgToPng(qrRef.current, size, size, transparentBg);
      // Generate filename from long URL
      const normalizedUrl = normalizeUrl(url);
      const urlBasedFilename = urlToFilename(normalizedUrl);
      const filename = urlBasedFilename 
        ? `${urlBasedFilename}.png`
        : `qrcode-${Date.now()}.png`;
      downloadBlob(blob, filename);
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
            shortUrl={shortUrl}
            copied={copied}
            onUrlChange={handleUrlChange}
            onGenerate={() => handleGenerate()}
            onCopy={handleCopyUrl}
          />

          <div ref={qrContainerRef}>
            {qrValue && (
              <div className="space-y-6">
                <QRCodeDisplay value={qrValue} qrRef={qrRef} />

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
