"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { BillData } from "@/lib/state";

interface BillPreviewProps {
  billData: BillData;
}

const THEME_CONFIG: Record<string, { bg: string, fg: string, primary: string, border: string, accent: string, font: string }> = {
  "theme-minimalist": { bg: "#ffffff", fg: "#171717", primary: "#525252", border: "#e5e5e5", accent: "#f5f5f5", font: "var(--font-geist-sans)" },
  "theme-bold": { bg: "#171717", fg: "#ffffff", primary: "#fbbf24", border: "#404040", accent: "#262626", font: "var(--font-geist-sans)" },
  "theme-monospace": { bg: "#fdfbf7", fg: "#1a1a1a", primary: "#1a1a1a", border: "#1a1a1a", accent: "#f0eee9", font: "var(--font-geist-mono)" },
  "theme-elegant": { bg: "#2d3748", fg: "#f7fafc", primary: "#cbd5e0", border: "#4a5568", accent: "#1a202c", font: "var(--font-geist-sans)" },
};

export const BillPreview = forwardRef<HTMLDivElement, BillPreviewProps>(
  ({ billData }, ref) => {
    const { shopName, logoBase64, theme } = useTheme();

    const subtotal = billData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxAmount = subtotal * (billData.taxRate / 100);
    const total = subtotal + taxAmount - billData.discount;

    const t = THEME_CONFIG[theme] || THEME_CONFIG["theme-minimalist"];
    const inlineStyles = {
      "--bill-bg": t.bg,
      "--bill-fg": t.fg,
      "--bill-primary": t.primary,
      "--bill-border": t.border,
      "--bill-accent": t.accent,
      "--bill-font": t.font,
      backgroundColor: t.bg,
      borderRadius: "0px"
    } as React.CSSProperties;

    return (
      <div 
        className={`bill-container ${theme} p-8 sm:p-10 w-full max-w-[420px] mx-auto relative overflow-hidden transition-all duration-300 shadow-2xl`}
        ref={ref}
        style={inlineStyles}
      >
        <div className="flex flex-col items-center mb-8 text-center space-y-4">
          {logoBase64 && (
            <div className="relative w-20 h-20">
              <Image src={logoBase64} alt="Shop Logo" fill className="object-contain" unoptimized />
            </div>
          )}
          <h1 className="text-3xl font-bold text-bill-primary font-bill tracking-tight">
            {shopName || "Unnamed Shop"}
          </h1>
          <div className="w-16 h-1 bg-bill-accent mt-2 rounded"></div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-bill-primary border-b border-bill-border pb-3 mb-4 font-bill uppercase tracking-widest">
            <span>Item</span>
            <span>Total</span>
          </div>
          <div className="space-y-4 font-bill">
            {billData.items.map((item) => (
              <div key={item.id} className="text-sm">
                <div className="flex justify-between text-bill-fg font-medium">
                  <span className="truncate pr-4">{item.name || "Custom Item"}</span>
                  <span className="whitespace-nowrap">{billData.currency}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
                {item.quantity !== 1 && (
                  <div className="text-xs text-bill-primary mt-1 opacity-80">
                    {item.quantity} x {billData.currency}{item.price.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-bill-border pt-5 space-y-3 text-sm font-bill">
          <div className="flex justify-between text-bill-primary">
            <span>Subtotal</span>
            <span>{billData.currency}{subtotal.toFixed(2)}</span>
          </div>
          {billData.taxRate > 0 && (
            <div className="flex justify-between text-bill-primary">
              <span>Tax ({billData.taxRate}%)</span>
              <span>{billData.currency}{taxAmount.toFixed(2)}</span>
            </div>
          )}
          {billData.discount > 0 && (
            <div className="flex justify-between text-bill-primary">
              <span>Discount</span>
              <span>-{billData.currency}{billData.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold text-bill-fg border-t border-bill-border pt-4 mt-4">
            <span>Total</span>
            <span>{billData.currency}{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-bill-primary font-bill opacity-60">
          <p>Thank you for your business!</p>
          <div className="flex justify-center mt-3 mb-1">
             <div className="h-[2px] w-full max-w-[12px] bg-bill-primary rounded-full mx-1"></div>
             <div className="h-[2px] w-full max-w-[12px] bg-bill-primary rounded-full mx-1"></div>
             <div className="h-[2px] w-full max-w-[12px] bg-bill-primary rounded-full mx-1"></div>
          </div>
        </div>
      </div>
    );
  }
);
BillPreview.displayName = "BillPreview";
