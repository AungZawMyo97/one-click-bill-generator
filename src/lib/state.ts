import LZString from 'lz-string';

export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface BillData {
  items: BillItem[];
  currency: string;
  taxRate: number;
  discount: number;
}

export const defaultBillData: BillData = {
  items: [
    { id: '1', name: 'Item 1', quantity: 1, price: 100 },
  ],
  currency: '$',
  taxRate: 0,
  discount: 0,
};

export function encodeBillData(data: BillData): string {
  const jsonString = JSON.stringify(data);
  // Using compressToEncodedURIComponent as it is URL safe right out of the box
  return LZString.compressToEncodedURIComponent(jsonString);
}

export function decodeBillData(encoded: string | null | undefined): BillData {
  if (!encoded) return defaultBillData;
  try {
    const jsonString = LZString.decompressFromEncodedURIComponent(encoded);
    if (!jsonString) return defaultBillData;
    const parsed = JSON.parse(jsonString) as Partial<BillData>;
    return {
      ...defaultBillData,
      ...parsed,
      items: Array.isArray(parsed.items) ? parsed.items : defaultBillData.items
    };
  } catch (e) {
    console.error("Failed to decode bill data", e);
    return defaultBillData;
  }
}
