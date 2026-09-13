import { createContext, useContext, useState, ReactNode } from 'react';

type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'teal';

const themes: Record<ThemeColor, { primary: string; accent: string }> = {
  blue: { primary: '#2563eb', accent: '#16a34a' },
  purple: { primary: '#7c3aed', accent: '#16a34a' },
  green: { primary: '#16a34a', accent: '#2563eb' },
  orange: { primary: '#ea580c', accent: '#2563eb' },
  red: { primary: '#dc2626', accent: '#2563eb' },
  teal: { primary: '#0d9488', accent: '#7c3aed' },
};

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (t: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'blue', setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeColor>(() => {
    return (localStorage.getItem('theme') as ThemeColor) || 'blue';
  });

  const handleChange = (t: ThemeColor) => {
    setTheme(t);
    localStorage.setItem('theme', t);
    const colors = themes[t];
    document.documentElement.style.setProperty('--color-primary', colors.primary);
    document.documentElement.style.setProperty('--color-accent', colors.accent);
  };

  const colors = themes[theme];
  if (!document.documentElement.style.getPropertyValue('--color-primary')) {
    document.documentElement.style.setProperty('--color-primary', colors.primary);
    document.documentElement.style.setProperty('--color-accent', colors.accent);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleChange }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export const themeColors = themes;
export type { ThemeColor };
