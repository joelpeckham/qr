"use client";

import type { RefObject } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  /**
   * The URL (or other payload) to encode in the QR code.
   */
  value: string;
  /**
   * Ref to the rendered SVG, used for SVG downloads.
   */
  qrSvgRef: RefObject<SVGSVGElement | null>;
  /**
   * Ref to the hidden canvas, used for PNG downloads.
   */
  qrCanvasRef: RefObject<HTMLCanvasElement | null>;
  /**
   * Desired PNG export size in pixels.
   */
  pngSize: number;
  /**
   * Whether the PNG export background should be transparent.
   */
  transparentBg: boolean;
}

/**
 * Renders the QR code (SVG for display + hidden canvas for PNG export).
 */
export function QRCodeDisplay({
  value,
  qrSvgRef,
  qrCanvasRef,
  pngSize,
  transparentBg,
}: QRCodeDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg border">
      <QRCodeSVG
        ref={qrSvgRef}
        value={value}
        size={256}
        level="H"
        includeMargin={true}
        aria-label={`QR code for ${value}`}
      />

      {/* Hidden canvas used for high-quality PNG exports at the selected size. */}
      <QRCodeCanvas
        ref={qrCanvasRef}
        value={value}
        size={pngSize}
        level="H"
        includeMargin={true}
        bgColor={transparentBg ? "rgba(0,0,0,0)" : "#ffffff"}
        fgColor="#000000"
        style={{ display: "none" }}
        aria-hidden="true"
      />
    </div>
  );
}

