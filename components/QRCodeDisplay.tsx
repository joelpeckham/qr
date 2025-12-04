"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  value: string;
  qrRef: React.RefObject<SVGSVGElement | null>;
}

export function QRCodeDisplay({ value, qrRef }: QRCodeDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg border">
      <QRCodeSVG
        ref={qrRef}
        value={value}
        size={256}
        level="H"
        includeMargin={true}
        aria-label={`QR code for ${value}`}
      />
    </div>
  );
}

