"use client";

import React, { useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { BillData, BillItem } from "@/lib/state";
import { resizeImageToDataUrl } from "@/lib/imageHandler";
import { Plus, Trash2, Upload, AlertCircle, Settings2 } from "lucide-react";

interface ControlsPanelProps {
  billData: BillData;
  updateBillData: (updates: Partial<BillData>) => void;
}

const THEMES = [
  { id: "theme-minimalist", label: "Minimalist" },
  { id: "theme-bold", label: "Bold" },
  { id: "theme-monospace", label: "Receipt" },
  { id: "theme-elegant", label: "Elegant" },
];

export function ControlsPanel({ billData, updateBillData }: ControlsPanelProps) {
  const { shopName, setShopName, logoBase64, setLogoBase64, theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await resizeImageToDataUrl(file);
      setLogoBase64(base64);
    } catch (err) {
      console.error("Error resizing image", err);
    }
  };

  const addItem = () => {
    updateBillData({
      items: [
        ...billData.items,
        { id: Math.random().toString(36).substring(7), name: "", quantity: 1, price: 0 },
      ],
    });
  };

  const updateItem = (id: string, updates: Partial<BillItem>) => {
    updateBillData({
      items: billData.items.map((it) => (it.id === id ? { ...it, ...updates } : it)),
    });
  };

  const removeItem = (id: string) => {
    updateBillData({
      items: billData.items.filter((it) => it.id !== id),
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 h-full flex flex-col space-y-8 animate-fade-in text-gray-900 shadow-sm border border-gray-200">
      <section className="space-y-5">
        <h2 className="text-lg font-bold flex items-center space-x-2 text-gray-900">
          <Settings2 className="w-5 h-5 text-gray-700" />
          <span>Appearance</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium tracking-wide">Shop Title</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400"
              placeholder="E.g., Cosmic Coffee"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-medium tracking-wide">Brand Logo</label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleLogoUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 text-sm hover:bg-gray-100 transition-all shadow-sm"
              >
                <Upload className="w-4 h-4 text-gray-500" />
                <span>Upload</span>
              </button>
              {logoBase64 && (
                <button
                  onClick={() => setLogoBase64(null)}
                  className="px-4 py-3 text-sm text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="text-sm text-gray-600 font-medium tracking-wide">Visual Theme</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  theme === t.id
                    ? "bg-gray-900 text-white shadow-md border-transparent pointer-events-none"
                    : "bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-gray-100" />

      <section className="space-y-5 flex-1">
        <h2 className="text-lg font-bold flex items-center space-x-2 text-gray-900">
          <AlertCircle className="w-5 h-5 text-gray-700" />
          <span>Line Items</span>
        </h2>
        
        <div className="space-y-3">
          {billData.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-2xl border border-gray-200 group transition-colors">
              <input
                type="text"
                placeholder={`Item ${index + 1}`}
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                className="bg-transparent text-sm focus:outline-none w-full min-w-0 font-medium placeholder:text-gray-400 px-2 text-gray-900"
              />
              <div className="flex items-center space-x-2 bg-white border border-gray-200 shadow-sm rounded-lg px-2 py-1">
                <span className="text-xs text-gray-500 font-medium">Qty</span>
                <input
                  type="number"
                  min="1"
                  value={item.quantity === 0 ? '' : item.quantity}
                  onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                  className="bg-transparent text-sm focus:outline-none w-8 text-center font-medium text-gray-900"
                />
              </div>
              <div className="flex items-center space-x-1 bg-white border border-gray-200 shadow-sm rounded-lg pl-3 pr-2 py-1">
                <span className="text-gray-400 text-xs font-bold">{billData.currency}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price === 0 ? '' : item.price}
                  onChange={(e) => updateItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                  className="bg-transparent text-sm focus:outline-none w-16 text-right font-medium text-gray-900"
                />
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        <button
          onClick={addItem}
          className="w-full py-4 mt-2 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center space-x-2 text-sm text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Item</span>
        </button>
      </section>

      <section className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Currency</label>
          <input
            type="text"
            value={billData.currency}
            onChange={(e) => updateBillData({ currency: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 text-center font-medium placeholder:text-gray-400"
            placeholder="$"
            maxLength={3}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tax (%)</label>
          <input
            type="number"
            min="0"
            value={billData.taxRate}
            onChange={(e) => updateBillData({ taxRate: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 text-center font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Discount</label>
          <input
            type="number"
            min="0"
            value={billData.discount}
            onChange={(e) => updateBillData({ discount: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 text-center font-medium"
          />
        </div>
      </section>
    </div>
  );
}
