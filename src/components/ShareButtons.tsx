"use client";

import React, { useState } from "react";
import { Download, Link as LinkIcon, Check, Image as ImageIcon } from "lucide-react";
import { toPng } from "html-to-image";

interface ShareButtonsProps {
  billRef: React.RefObject<HTMLDivElement | null>;
}

export function ShareButtons({ billRef }: ShareButtonsProps) {
  const [copiedContext, setCopiedContext] = useState<"link" | "image" | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const performExport = async () => {
    if (!billRef.current) return null;
    setIsExporting(true);
    try {
      // Scale up for better quality on retina devices
      const dataUrl = await toPng(billRef.current, { 
        cacheBust: true, 
        pixelRatio: 2
      });
      return dataUrl;
    } catch (err) {
      console.error("Failed to extract image", err);
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  const downloadImage = async () => {
    const dataUrl = await performExport();
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = `bill-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const copyToClipboardImage = async () => {
    const dataUrl = await performExport();
    if (!dataUrl) return;
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob
        })
      ]);
      setCopiedContext("image");
      setTimeout(() => setCopiedContext(null), 2000);
    } catch (err) {
      console.error("Clipboard copy failed. Your browser might not support image clipboard.", err);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedContext("link");
      setTimeout(() => setCopiedContext(null), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="flex space-x-3 w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <button
        onClick={downloadImage}
        disabled={isExporting}
        className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all font-semibold shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
        <span>{isExporting ? "Rendering..." : "Export Image"}</span>
      </button>

      <button
        onClick={copyToClipboardImage}
        disabled={isExporting}
        className="px-5 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl flex items-center justify-center transition-all border border-gray-200 shadow-sm active:scale-95 disabled:opacity-70"
        title="Copy Image to Clipboard"
      >
        {copiedContext === "image" ? <Check className="w-5 h-5 text-green-600" /> : <ImageIcon className="w-5 h-5" />}
      </button>

      <button
        onClick={copyLink}
        className="px-5 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl flex items-center justify-center transition-all border border-gray-200 shadow-sm active:scale-95"
        title="Copy URL State to Clipboard"
      >
        {copiedContext === "link" ? <Check className="w-5 h-5 text-green-600" /> : <LinkIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}
