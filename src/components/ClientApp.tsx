"use client";

import React, { useRef } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ControlsPanel } from "@/components/ControlsPanel";
import { BillPreview } from "@/components/BillPreview";
import { ShareButtons } from "@/components/ShareButtons";
import { useBillState } from "@/hooks/useBillState";
import Image from "next/image";
import { Receipt } from "lucide-react";

function AppContent() {
  const { billData, updateBillData, isHydrated } = useBillState();
  const billRef = useRef<HTMLDivElement>(null);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <div className="animate-pulse flex items-center space-x-2">
           <Receipt className="w-5 h-5 text-gray-500" />
           <span>Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen max-w-7xl animate-fade-in text-foreground">
      <header className="mb-8 text-center lg:text-left flex flex-col sm:flex-row items-center justify-center lg:justify-start sm:space-x-4 space-y-3 sm:space-y-0 text-gray-900">
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200 overflow-hidden w-14 h-14 flex items-center justify-center relative">
           <Image src="/bill-generator.png" alt="Social Share Bill Logo" width={56} height={56} className="object-contain" priority />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            One Click Bill Generator
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Design & Share Beautiful Receipts</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        <div className="lg:col-span-7 flex flex-col h-full">
          <ControlsPanel billData={billData} updateBillData={updateBillData} />
        </div>
        
        <div className="lg:col-span-5 flex flex-col space-y-6 lg:sticky lg:top-8 w-full max-w-[500px] mx-auto lg:max-w-none">
          <div className="p-4 sm:p-6 rounded-4xl bg-white border border-gray-200 shadow-sm relative overflow-hidden group">
             <BillPreview ref={billRef} billData={billData} />
          </div>

          <ShareButtons billRef={billRef} />
        </div>

      </div>
    </div>
  );
}

export function ClientApp() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
