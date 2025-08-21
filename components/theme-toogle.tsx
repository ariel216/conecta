"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita "flash" al hidratar
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={currentTheme === "light" ? "default" : "ghost"}
        size="icon"
        onClick={() => setTheme("light")}
      >
        <Sun className="h-5 w-5" />
      </Button>

      <Button
        variant={currentTheme === "dark" ? "default" : "ghost"}
        size="icon"
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-5 w-5" />
      </Button>

      <Button
        variant={theme === "system" ? "default" : "ghost"}
        size="icon"
        onClick={() => setTheme("system")}
      >
        <Laptop className="h-5 w-5" />
      </Button>
    </div>
  );
}
