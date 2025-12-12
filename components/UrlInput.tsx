"use client";

import { useRef } from "react";
import { Copy, Check } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface UrlInputProps {
  url: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  qrUrl: string | null;
  shortUrl: string | null;
  copied: boolean;
  shouldShorten: boolean;
  onUrlChange: (url: string) => void;
  onGenerate: () => void;
  onCopy: () => void;
  onShouldShortenChange: (shouldShorten: boolean) => void;
}

export function UrlInput({
  url,
  loading,
  error,
  success,
  qrUrl,
  shortUrl,
  copied,
  shouldShorten,
  onUrlChange,
  onGenerate,
  onCopy,
  onShouldShortenChange,
}: UrlInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorContainerRef] = useAutoAnimate();
  const [successContainerRef] = useAutoAnimate();
  const [shortUrlRef] = useAutoAnimate();

  return (
    <div className="space-y-3">
      <Label htmlFor="url">URL</Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          ref={inputRef}
          id="url"
          type="text"
          placeholder="https://example.com or example.com"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onGenerate();
            }
          }}
          disabled={loading}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full sm:flex-1"
          aria-label="Enter URL to generate QR code"
          aria-describedby={error ? "url-error" : undefined}
        />
        <Button
          onClick={onGenerate}
          disabled={loading || !url.trim()}
          variant="default"
          aria-label="Generate QR code"
          className="w-full sm:w-auto sm:shrink-0"
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>
      <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:gap-3">
        <Label htmlFor="shorten-url">Shorten URL</Label>
        <Switch
          id="shorten-url"
          checked={shouldShorten}
          onCheckedChange={onShouldShortenChange}
          disabled={loading}
          aria-label="Toggle URL shortening"
        />
      </div>
      <div ref={errorContainerRef} role="alert" aria-live="polite">
        {error && (
          <p className="text-sm text-destructive" id="url-error">{error}</p>
        )}
      </div>
      <div ref={successContainerRef} role="status" aria-live="polite">
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        )}
      </div>
      <div ref={shortUrlRef}>
        {qrUrl && (
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-muted-foreground">
              {shortUrl ? (
                <>
                  Shortened:{" "}
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {shortUrl}
                  </a>
                </>
              ) : (
                <>
                  URL:{" "}
                  <a
                    href={qrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {qrUrl}
                  </a>
                </>
              )}
            </p>
            <Button
              onClick={onCopy}
              size="sm"
              variant="outline"
              className="h-7 px-2"
              aria-label="Copy URL to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

