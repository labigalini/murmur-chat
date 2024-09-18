import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { DesktopIcon, MoonIcon, SunIcon } from "../icons";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ToggleGroup type="single" size="sm" onValueChange={setTheme} value={theme}>
      <ToggleGroupItem value="light" aria-label="Light">
        <SunIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark">
        <MoonIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label="System">
        <DesktopIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
