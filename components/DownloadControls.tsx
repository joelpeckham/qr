"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadControlsProps {
  downloadingSvg: boolean;
  downloadingPng: boolean;
  onDownloadSvg: () => void;
  onDownloadPng: () => void;
}

export function DownloadControls({
  downloadingSvg,
  downloadingPng,
  onDownloadSvg,
  onDownloadPng,
}: DownloadControlsProps) {
  return (
    <div className="flex gap-4">
      <Button
        onClick={onDownloadSvg}
        className="flex-1"
        variant="default"
        disabled={downloadingSvg || downloadingPng}
        aria-label="Download QR code as SVG"
      >
        {downloadingSvg ? (
          <>
            <Download className="h-4 w-4 mr-2 animate-pulse" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download SVG
          </>
        )}
      </Button>
      <Button
        onClick={onDownloadPng}
        className="flex-1"
        variant="default"
        disabled={downloadingPng || downloadingSvg}
        aria-label="Download QR code as PNG"
      >
        {downloadingPng ? (
          <>
            <Download className="h-4 w-4 mr-2 animate-pulse" />
            Generating...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </>
        )}
      </Button>
    </div>
  );
}

