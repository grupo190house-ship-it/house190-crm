import type { OrderBrand, ProductItem } from "@/types/domain";

export function classifyOrderBrand(items: ProductItem[]): OrderBrand {
  const relevant = items.filter(item => !item.canceledAt && item.brand !== "IGNORE");
  if (!relevant.length || relevant.some(item => item.brand === "UNMAPPED")) return "UNMAPPED";
  const brands = new Set(relevant.map(item => item.brand));
  if (brands.size === 1 && brands.has("HOUSE190")) return "HOUSE190";
  if (brands.size === 1 && brands.has("XTUDO")) return "XTUDO";
  if (brands.size === 1 && brands.has("OTHER")) return "OTHER";
  if (brands.has("HOUSE190") && brands.size > 1) return "MIXED";
  if (brands.has("XTUDO") && brands.size > 1) return "MIXED";
  return "OTHER";
}
