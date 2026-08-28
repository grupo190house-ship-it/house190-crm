export type ProductBrand = "HOUSE190" | "XTUDO" | "OTHER" | "IGNORE" | "UNMAPPED";
export type OrderBrand = "HOUSE190" | "XTUDO" | "MIXED" | "OTHER" | "UNMAPPED";
export type QueueStatus = "pending" | "approved" | "processing" | "sent" | "failed" | "skipped" | "blocked";
export interface ProductItem { id:string; name:string; amount:number; totalPrice:number; canceledAt?:string|null; brand:ProductBrand; }
export interface Purchase { id:string; customerName:string; phone?:string; time:string; total:number; channel:string; products:ProductItem[]; brand:OrderBrand; eligible:boolean; reason?:string; status:string; }
