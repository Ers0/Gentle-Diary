"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "system" | "main" | "sunset" | "ocean" | "forest" | "lavender";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "main",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Define cozy color palettes
const themes = {
  main: {
    name: "Warm Sunset",
    "--background": "0 0% 100%",
    "--foreground": "222.2 84% 4.9%",
    "--card": "0 0% 100%",
    "--card-foreground": "222.2 84% 4.9%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "222.2 84% 4.9%",
    "--primary": "25 80% 50%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "216 92% 64%",
    "--secondary-foreground": "0 0% 100%",
    "--muted": "30 20% 96%",
    "--muted-foreground": "215.4 16.3% 46.9%",
    "--accent": "160 50% 80%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 84.2% 60.2%",
    "--destructive-foreground": "210 40% 98%",
    "--border": "30 20% 90%",
    "--input": "30 20% 90%",
    "--ring": "25 80% 50%",
    "--radius": "0.5rem",
    "--sidebar-background": "0 0% 98%",
    "--sidebar-foreground": "240 5.3% 26.1%",
    "--sidebar-primary": "25 80% 50%",
    "--sidebar-primary-foreground": "0 0% 100%",
    "--sidebar-accent": "240 4.8% 95.9%",
    "--sidebar-accent-foreground": "240 5.9% 10%",
    "--sidebar-border": "30 20% 90%",
    "--sidebar-ring": "25 80% 50%",
  },
  sunset: {
    name: "Cozy Sunset",
    "--background": "25 20% 95%",
    "--foreground": "25 15% 10%",
    "--card": "25 25% 90%",
    "--card-foreground": "25 15% 10%",
    "--popover": "25 30% 85%",
    "--popover-foreground": "25 15% 10%",
    "--primary": "25 90% 60%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "30 80% 70%",
    "--secondary-foreground": "0 0% 100%",
    "--muted": "25 20% 85%",
    "--muted-foreground": "25 10% 40%",
    "--accent": "35 85% 75%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 84.2% 60.2%",
    "--destructive-foreground": "210 40% 98%",
    "--border": "25 20% 80%",
    "--input": "25 20% 80%",
    "--ring": "25 90% 60%",
    "--radius": "0.5rem",
    "--sidebar-background": "25 25% 90%",
    "--sidebar-foreground": "25 15% 15%",
    "--sidebar-primary": "25 90% 60%",
    "--sidebar-primary-foreground": "0 0% 100%",
    "--sidebar-accent": "25 20% 80%",
    "--sidebar-accent-foreground": "25 15% 15%",
    "--sidebar-border": "25 20% 75%",
    "--sidebar-ring": "25 90% 60%",
  },
  ocean: {
    name: "Ocean Breeze",
    "--background": "200 20% 95%",
    "--foreground": "200 15% 10%",
    "--card": "200 25% 90%",
    "--card-foreground": "200 15% 10%",
    "--popover": "200 30% 85%",
    "--popover-foreground": "200 15% 10%",
    "--primary": "200 90% 50%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "190 80% 60%",
    "--secondary-foreground": "0 0% 100%",
    "--muted": "200 20% 85%",
    "--muted-foreground": "200 10% 40%",
    "--accent": "180 70% 70%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 84.2% 60.2%",
    "--destructive-foreground": "210 40% 98%",
    "--border": "200 20% 80%",
    "--input": "200 20% 80%",
    "--ring": "200 90% 50%",
    "--radius": "0.5rem",
    "--sidebar-background": "200 25% 90%",
    "--sidebar-foreground": "200 15% 15%",
    "--sidebar-primary": "200 90% 50%",
    "--sidebar-primary-foreground": "0 0% 100%",
    "--sidebar-accent": "200 20% 80%",
    "--sidebar-accent-foreground": "200 15% 15%",
    "--sidebar-border": "200 20% 75%",
    "--sidebar-ring": "200 90% 50%",
  },
  forest: {
    name: "Forest Green",
    "--background": "120 15% 95%",
    "--foreground": "120 15% 10%",
    "--card": "120 20% 90%",
    "--card-foreground": "120 15% 10%",
    "--popover": "120 25% 85%",
    "--popover-foreground": "120 15% 10%",
    "--primary": "120 60% 40%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "100 50% 50%",
    "--secondary-foreground": "0 0% 100%",
    "--muted": "120 15% 85%",
    "--muted-foreground": "120 10% 40%",
    "--accent": "140 40% 60%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 84.2% 60.2%",
    "--destructive-foreground": "210 40% 98%",
    "--border": "120 15% 80%",
    "--input": "120 15% 80%",
    "--ring": "120 60% 40%",
    "--radius": "0.5rem",
    "--sidebar-background": "120 20% 90%",
    "--sidebar-foreground": "120 15% 15%",
    "--sidebar-primary": "120 60% 40%",
    "--sidebar-primary-foreground": "0 0% 100%",
    "--sidebar-accent": "120 15% 80%",
    "--sidebar-accent-foreground": "120 15% 15%",
    "--sidebar-border": "120 15% 75%",
    "--sidebar-ring": "120 60% 40%",
  },
  lavender: {
    name: "Lavender Dream",
    "--background": "270 20% 96%",
    "--foreground": "270 15% 15%",
    "--card": "270 25% 92%",
    "--card-foreground": "270 15% 15%",
    "--popover": "270 30% 88%",
    "--popover-foreground": "270 15% 15%",
    "--primary": "270 60% 65%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "280 50% 70%",
    "--secondary-foreground": "0 0% 100%",
    "--muted": "270 20% 87%",
    "--muted-foreground": "270 10% 45%",
    "--accent": "290 40% 75%",
    "--accent-foreground": "0 0% 100%",
    "--destructive": "0 84.2% 60.2%",
    "--destructive-foreground": "210 40% 98%",
    "--border": "270 20% 82%",
    "--input": "270 20% 82%",
    "--ring": "270 60% 65%",
    "--radius": "0.5rem",
    "--sidebar-background": "270 25% 92%",
    "--sidebar-foreground": "270 15% 20%",
    "--sidebar-primary": "270 60% 65%",
    "--sidebar-primary-foreground": "0 0% 100%",
    "--sidebar-accent": "270 20% 82%",
    "--sidebar-accent-foreground": "270 15% 20%",
    "--sidebar-border": "270 20% 78%",
    "--sidebar-ring": "270 60% 65%",
  },
};

export function ThemeProvider({
  children,
  defaultTheme = "main",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(...Object.keys(themes).map(t => `theme-${t}`));
    
    // Remove all theme variables
    Object.keys(themes.main).forEach((key) => {
      root.style.removeProperty(key);
    });

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    // Add theme class
    root.classList.add(`theme-${theme}`);
    
    // Apply theme variables
    const selectedTheme = themes[theme] || themes.main;
    Object.entries(selectedTheme).forEach(([key, value]) => {
      if (key !== "name") {
        root.style.setProperty(key, value as string);
      }
    });
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};