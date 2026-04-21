"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  shopName: string;
  setShopName: (name: string) => void;
  logoBase64: string | null;
  setLogoBase64: (logo: string | null) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [shopName, setShopName] = useState("My Shop");
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [theme, setTheme] = useState("theme-minimalist");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedShop = localStorage.getItem("billSettings_shopName");
      const savedLogo = localStorage.getItem("billSettings_logoBase64");
      const savedTheme = localStorage.getItem("billSettings_theme");

      setTimeout(() => {
        if (savedShop) setShopName(savedShop);
        if (savedLogo) setLogoBase64(savedLogo);
        if (savedTheme) setTheme(savedTheme);
      }, 0);
    } catch (e) {
      console.warn("localStorage not available", e);
    }
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("billSettings_shopName", shopName);
      if (logoBase64) {
        localStorage.setItem("billSettings_logoBase64", logoBase64);
      } else {
        localStorage.removeItem("billSettings_logoBase64");
      }
      localStorage.setItem("billSettings_theme", theme);
    } catch (e) {
      console.warn("Failed saving to localStorage", e);
    }
  }, [shopName, logoBase64, theme, mounted]);

  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  return (
    <ThemeContext.Provider value={{ shopName, setShopName, logoBase64, setLogoBase64, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
