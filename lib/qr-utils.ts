/**
 * Converts an SVG element to a PNG blob
 * 
 * @param svgElement - The SVG element to convert
 * @param width - The desired width of the PNG in pixels
 * @param height - The desired height of the PNG in pixels
 * @param transparent - Whether to use a transparent background (default: false)
 * @returns A Promise that resolves to a PNG Blob
 * @throws Error if canvas context cannot be obtained or PNG generation fails
 * 
 * @example
 * const blob = await svgToPng(svgElement, 512, 512, true);
 * downloadBlob(blob, 'qrcode.png');
 */
export async function svgToPng(
  svgElement: SVGSVGElement,
  width: number,
  height: number,
  transparent: boolean = false
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      // Request alpha channel support for transparency
      const ctx = canvas.getContext("2d", { alpha: true });

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Clear canvas completely (important for transparency)
      ctx.clearRect(0, 0, width, height);

      // Set background only if not transparent
      if (!transparent) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }

      // Clone SVG to modify it if needed for transparency and dimensions
      const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
      
      // Ensure SVG has proper dimensions and viewBox
      const originalWidth = svgClone.width?.baseVal?.value || svgClone.viewBox?.baseVal?.width || 256;
      const originalHeight = svgClone.height?.baseVal?.value || svgClone.viewBox?.baseVal?.height || 256;
      
      // Set explicit width and height attributes for proper rendering
      svgClone.setAttribute("width", String(originalWidth));
      svgClone.setAttribute("height", String(originalHeight));
      
      // Ensure viewBox exists for proper scaling
      if (!svgClone.getAttribute("viewBox")) {
        svgClone.setAttribute("viewBox", `0 0 ${originalWidth} ${originalHeight}`);
      }
      
      // Ensure xmlns is present
      if (!svgClone.getAttribute("xmlns")) {
        svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      }
      
      // Remove white backgrounds from the SVG if transparent
      if (transparent) {
        // Get viewBox dimensions to identify full-size background rectangles
        const viewBox = svgClone.viewBox?.baseVal || {
          x: 0,
          y: 0,
          width: originalWidth,
          height: originalHeight
        };
        
        // Remove white fills from all elements (QR code background)
        const allElements = svgClone.querySelectorAll("*");
        allElements.forEach((el) => {
          // Check if this is a rectangle that might be the background
          const isRect = el.tagName === "rect" || el.tagName === "RECT";
          let isFullSizeRect = false;
          
          if (isRect) {
            const rectX = parseFloat(el.getAttribute("x") || "0");
            const rectY = parseFloat(el.getAttribute("y") || "0");
            const rectWidth = parseFloat(el.getAttribute("width") || "0");
            const rectHeight = parseFloat(el.getAttribute("height") || "0");
            
            // Check if this rectangle covers the entire SVG (likely the background)
            isFullSizeRect = (
              Math.abs(rectX - viewBox.x) < 1 &&
              Math.abs(rectY - viewBox.y) < 1 &&
              Math.abs(rectWidth - viewBox.width) < 1 &&
              Math.abs(rectHeight - viewBox.height) < 1
            );
          }
          
          const fill = el.getAttribute("fill");
          const isWhiteFill = fill === "#ffffff" || fill === "#fff" || fill === "white" || 
                             fill === "#FFFFFF" || fill === "#FFF" || fill === "WHITE" ||
                             fill === "rgb(255,255,255)" || fill === "rgb(255, 255, 255)" ||
                             fill === "RGB(255,255,255)" || fill === "RGB(255, 255, 255)";
          
          // For full-size white rectangles (background), remove them entirely
          if (isFullSizeRect && isWhiteFill) {
            el.remove();
            return;
          }
          
          // For other white-filled elements, set fill to none (better than transparent for SVG)
          if (isWhiteFill) {
            el.setAttribute("fill", "none");
          }
          
          // Check and update style attribute
          const style = el.getAttribute("style");
          if (style) {
            let newStyle = style
              .replace(/fill:\s*#ffffff/gi, "fill: none")
              .replace(/fill:\s*#fff/gi, "fill: none")
              .replace(/fill:\s*white/gi, "fill: none")
              .replace(/fill:\s*#FFFFFF/gi, "fill: none")
              .replace(/fill:\s*#FFF/gi, "fill: none")
              .replace(/fill:\s*WHITE/gi, "fill: none")
              .replace(/fill:\s*rgb\(255,\s*255,\s*255\)/gi, "fill: none")
              .replace(/fill:\s*RGB\(255,\s*255,\s*255\)/gi, "fill: none")
              .replace(/background[^;]*/gi, "")
              .replace(/background-color[^;]*/gi, "");
            
            // Only update if style changed
            if (newStyle !== style) {
              el.setAttribute("style", newStyle || "");
            }
          }
        });

        // Also check the SVG element itself
        const svgFill = svgClone.getAttribute("fill");
        if (svgFill === "#ffffff" || svgFill === "#fff" || svgFill === "white" ||
            svgFill === "#FFFFFF" || svgFill === "#FFF" || svgFill === "WHITE") {
          svgClone.removeAttribute("fill");
        }
        
        // Remove any background-related attributes from SVG root
        const svgStyle = svgClone.getAttribute("style");
        if (svgStyle) {
          const cleanedStyle = svgStyle
            .replace(/background[^;]*/gi, "")
            .replace(/background-color[^;]*/gi, "");
          if (cleanedStyle.trim()) {
            svgClone.setAttribute("style", cleanedStyle);
          } else {
            svgClone.removeAttribute("style");
          }
        }
      }

      // Serialize SVG to string
      const svgData = new XMLSerializer().serializeToString(svgClone);
      
      // Create blob and data URL
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      
      img.onload = () => {
        try {
          // Clear canvas again before drawing (for transparency)
          if (transparent) {
            ctx.clearRect(0, 0, width, height);
          }
          
          // Draw the image to canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // If transparent mode, make white pixels transparent using pixel manipulation
          if (transparent) {
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            
            // Iterate through all pixels and make white pixels transparent
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              
              // Check if pixel is white (or very close to white, with some tolerance)
              // Using a threshold to catch near-white pixels too
              if (r >= 250 && g >= 250 && b >= 250) {
                // Set alpha channel to 0 (fully transparent)
                data[i + 3] = 0;
              }
            }
            
            // Put the modified image data back
            ctx.putImageData(imageData, 0, 0);
          }
          
          // Clean up the object URL
          URL.revokeObjectURL(url);

          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to create PNG blob from canvas"));
              }
            },
            "image/png",
            1.0
          );
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(new Error(`Error drawing image to canvas: ${error instanceof Error ? error.message : "Unknown error"}`));
        }
      };
      
      img.onerror = (error) => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load SVG image. The SVG may be invalid or contain unsupported elements.`));
      };
      
      // Set image source to trigger loading
      img.src = url;
    } catch (error) {
      reject(new Error(`Error converting SVG to PNG: ${error instanceof Error ? error.message : "Unknown error"}`));
    }
  });
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

