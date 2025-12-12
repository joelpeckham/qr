"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleToggle = () => {
    // Cycle through: system -> opposite of resolved theme -> dark -> system
    if (theme === "system") {
      // Switch to the opposite of the current resolved theme
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4"
        aria-label="Toggle theme"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  // Use resolvedTheme to show the correct icon (resolves "system" to actual theme)
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="fixed top-4 right-4"
      aria-label="Toggle theme"
      title={theme === "system" ? "System theme (click to override)" : `Current: ${theme}`}
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}

