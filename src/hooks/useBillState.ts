"use client";

import { useState, useEffect, useCallback } from "react";
import { BillData, decodeBillData, encodeBillData, defaultBillData } from "@/lib/state";

export function useBillState() {
  const [billData, setBillData] = useState<BillData>(defaultBillData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("b");
    if (encoded) {
      const decoded = decodeBillData(encoded);
      setTimeout(() => {
        setBillData(decoded);
      }, 0);
    }
    setTimeout(() => {
      setIsHydrated(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    const handler = setTimeout(() => {
      const encoded = encodeBillData(billData);
      const newUrl = `${window.location.pathname}?b=${encoded}`;
      window.history.replaceState({ path: newUrl }, "", newUrl);
    }, 200);

    return () => clearTimeout(handler);
  }, [billData, isHydrated]);

  const updateBillData = useCallback((updates: Partial<BillData>) => {
    setBillData((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    billData,
    updateBillData,
    isHydrated
  };
}
