"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { svgToPng, downloadSvg, downloadBlob, validatePngSize } from "@/lib/qr-utils";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pngSize, setPngSize] = useState([512]);
  const [transparentBg, setTransparentBg] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorContainerRef] = useAutoAnimate();
  const [qrContainerRef] = useAutoAnimate();
  const [shortUrlRef] = useAutoAnimate();

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    // Clear error when user types, but keep the previous QR code visible
    // to prevent layout shift until a new one is generated
    if (error) {
      setError(null);
    }
  };

  const handleGenerate = async () => {
    // Clear previous errors
    setError(null);
    // Don't clear shortUrl here - keep the previous QR visible until new one is ready
    // This prevents jarring layout shift

    // Validate URL format
    if (!url.trim()) {
      setError("Please enter a URL");
      // Only clear shortUrl if validation fails
      setShortUrl(null);
      return;
    }

    let isValidUrl = false;
    try {
      new URL(url);
      isValidUrl = true;
    } catch {
      setError("Please enter a valid URL (must start with http:// or https://)");
      // Only clear shortUrl if validation fails
      setShortUrl(null);
      return;
    }

    if (!isValidUrl) {
      setShortUrl(null);
      return;
    }

    // Shorten URL via API route
    setLoading(true);
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ long_url: url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to shorten URL");
      }

      const result = await response.json();
      setShortUrl(result.short_url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to shorten URL. Please try again.");
      setShortUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSvg = () => {
    if (!qrRef.current || !qrValue) return;

    const filename = `qrcode-${Date.now()}.svg`;
    downloadSvg(qrRef.current, filename);
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

    try {
      const blob = await svgToPng(qrRef.current, size, size, transparentBg);
      const filename = `qrcode-${Date.now()}.png`;
      downloadBlob(blob, filename);
      // Clear any previous errors on success
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate PNG. Please try again.";
      console.error("PNG generation error:", err);
      setError(errorMessage);
    }
  };

  const qrValue = shortUrl;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <main className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">No Bullshit QR Codes</h1>
          <p className="text-muted-foreground">
            fukin bitch ass shit right here
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                id="url"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGenerate();
                  }
                }}
                disabled={loading}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="flex-1"
              />
              <Button
                onClick={handleGenerate}
                disabled={loading || !url.trim()}
                variant="default"
              >
                {loading ? "Generating..." : "Generate"}
              </Button>
            </div>
            <div ref={errorContainerRef}>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <div ref={shortUrlRef}>
              {shortUrl && (
                <p className="text-sm text-muted-foreground">
                  Shortened: <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{shortUrl}</a>
                </p>
              )}
            </div>
          </div>

          <div ref={qrContainerRef}>
            {qrValue && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border">
                  <QRCodeSVG
                    ref={qrRef}
                    value={qrValue}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    onClick={handleDownloadSvg}
                    className="flex-1"
                    variant="default"
                  >
                    Download SVG
                  </Button>
                  <Button
                    onClick={handleDownloadPng}
                    className="flex-1"
                    variant="default"
                  >
                    Download PNG
                  </Button>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="png-size">PNG Size: {pngSize[0]}px</Label>
                    </div>
                    <Slider
                      id="png-size"
                      value={pngSize}
                      onValueChange={setPngSize}
                      min={100}
                      max={5000}
                      step={50}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>100px</span>
                      <span>5000px</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="transparent-bg">Transparent Background</Label>
                    <Switch
                      id="transparent-bg"
                      checked={transparentBg}
                      onCheckedChange={setTransparentBg}
                    />
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
