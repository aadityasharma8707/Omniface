'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light' | 'yellow' | 'red';

export interface ThemeInfo {
  id: ThemeMode;
  name: string;
  tagline: string;
  accentColor: string;
  bgColor: string;
  iconName: string;
}

export const THEMES: Record<ThemeMode, ThemeInfo> = {
  dark: {
    id: 'dark',
    name: 'Dark Cyberpunk',
    tagline: 'OLED Black with Cyan Neural Optics (Default)',
    accentColor: '#00E5FF',
    bgColor: '#06080D',
    iconName: 'Moon',
  },
  light: {
    id: 'light',
    name: 'Lab Light (Inverse)',
    tagline: 'True inverse of Dark Cyberpunk with deep black text',
    accentColor: '#0088CC',
    bgColor: '#FFFFFF',
    iconName: 'Sun',
  },
  yellow: {
    id: 'yellow',
    name: 'Cyber Yellow',
    tagline: 'Shades of yellow components with bold black typography',
    accentColor: '#EAB308',
    bgColor: '#FEF08A',
    iconName: 'Zap',
  },
  red: {
    id: 'red',
    name: 'Tactical Red',
    tagline: 'Shades of red components with bold black typography',
    accentColor: '#DC2626',
    bgColor: '#FECACA',
    iconName: 'AlertTriangle',
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('omniface_theme') as ThemeMode | null;
      if (storedTheme && ['dark', 'light', 'yellow', 'red'].includes(storedTheme)) {
        setThemeState(storedTheme);
        document.documentElement.setAttribute('data-theme', storedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch {
      // Fallback
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'omniface_theme' && e.newValue) {
        const next = e.newValue as ThemeMode;
        if (['dark', 'light', 'yellow', 'red'].includes(next)) {
          setThemeState(next);
          document.documentElement.setAttribute('data-theme', next);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem('omniface_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      window.dispatchEvent(new CustomEvent('omniface_theme_changed', { detail: nextTheme }));
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const list: ThemeMode[] = ['dark', 'light', 'yellow', 'red'];
    const idx = list.indexOf(theme);
    const nextTheme = list[(idx + 1) % list.length];
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
