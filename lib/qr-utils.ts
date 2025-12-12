/**
 * Converts a canvas element to a PNG `Blob`.
 *
 * @param canvas - The canvas to convert.
 * @returns A Promise that resolves to a PNG blob.
 * @throws Error if the browser fails to generate a blob.
 */
export async function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create PNG blob from canvas"));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

/**
 * Creates a PNG `Blob` from a canvas, optionally scaling to an exact output size.
 *
 * `qrcode.react` may render the underlying canvas at device-pixel-ratio resolution. If you
 * download that canvas directly, the PNG dimensions can be larger than expected (e.g. 512 → 1024).
 * Use `targetSizePx` to force an exact output size.
 *
 * @param canvas - The canvas to download.
 * @param targetSizePx - If provided, scales the canvas into a new `targetSizePx × targetSizePx` canvas.
 * @param background - Optional background fill. Useful when exporting opaque PNGs.
 * @param filename - The name of the file to download (should end with `.png`).
 */
export async function downloadCanvasPng(
  canvas: HTMLCanvasElement,
  filename: string,
  targetSizePx?: number,
  background?: string
): Promise<void> {
  const exportCanvas =
    typeof targetSizePx === "number"
      ? (() => {
          const c = document.createElement("canvas");
          c.width = targetSizePx;
          c.height = targetSizePx;
          const ctx = c.getContext("2d", { alpha: true });
          if (!ctx) {
            throw new Error("Could not get canvas context");
          }
          if (background) {
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, targetSizePx, targetSizePx);
          } else {
            ctx.clearRect(0, 0, targetSizePx, targetSizePx);
          }
          ctx.drawImage(canvas, 0, 0, targetSizePx, targetSizePx);
          return c;
        })()
      : canvas;

  const blob = await canvasToPngBlob(exportCanvas);
  downloadBlob(blob, filename);
}

/**
 * Downloads a blob as a file by creating a temporary download link
 * 
 * @param blob - The blob to download
 * @param filename - The name of the file to download
 * 
 * @example
 * const blob = new Blob([data], { type: 'image/png' });
 * downloadBlob(blob, 'qrcode.png');
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads an SVG element as a file
 * 
 * @param svgElement - The SVG element to download
 * @param filename - The name of the file to download (should end with .svg)
 * 
 * @example
 * downloadSvg(qrCodeSvg, 'qrcode.svg');
 */
export function downloadSvg(svgElement: SVGSVGElement, filename: string): void {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(svgBlob, filename);
}

/**
 * Validates that a PNG size is within acceptable bounds
 * 
 * @param size - The size in pixels to validate
 * @returns true if size is between 1 and 5000 pixels (inclusive), false otherwise
 * 
 * @example
 * if (validatePngSize(512)) {
 *   // Size is valid
 * }
 */
export function validatePngSize(size: number): boolean {
  return size >= 1 && size <= 5000;
}

