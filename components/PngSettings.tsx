"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface PngSettingsProps {
  pngSize: number[];
  transparentBg: boolean;
  onPngSizeChange: (size: number[]) => void;
  onTransparentBgChange: (transparent: boolean) => void;
}

export function PngSettings({
  pngSize,
  transparentBg,
  onPngSizeChange,
  onTransparentBgChange,
}: PngSettingsProps) {
  return (
    <div className="space-y-3 border-t pt-3">
      <div className="space-y-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <Label htmlFor="png-size">PNG Size</Label>
          <span className="text-sm text-muted-foreground tabular-nums">{pngSize[0]}px</span>
        </div>
        <Slider
          id="png-size"
          value={pngSize}
          onValueChange={onPngSizeChange}
          min={100}
          max={5000}
          step={50}
          aria-label="PNG size in pixels"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>100px</span>
          <span>5000px</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Label htmlFor="transparent-bg">Transparent Background</Label>
        <Switch
          id="transparent-bg"
          checked={transparentBg}
          onCheckedChange={onTransparentBgChange}
          aria-label="Toggle transparent background for PNG"
        />
      </div>
    </div>
  );
}

