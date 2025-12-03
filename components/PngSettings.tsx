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
    <div className="space-y-4 border-t pt-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="png-size">PNG Size: {pngSize[0]}px</Label>
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

      <div className="flex items-center justify-between">
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

