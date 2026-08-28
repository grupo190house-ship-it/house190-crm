import type { OrderBrand } from "@/types/domain";
export interface EligibilityInput { brand:OrderBrand; phone:string|null; blocked:boolean; whatsappOptIn:boolean; lastMessageAt?:Date|null; minimumDaysBetweenMessages:number; campaignAlreadyExists:boolean; now:Date; }
export function evaluateEligibility(input:EligibilityInput){
  if(input.brand!=="HOUSE190") return {eligible:false,reason:input.brand==="UNMAPPED"?"UNMAPPED_PRODUCT":"BRAND_NOT_HOUSE190"} as const;
  if(!input.phone) return {eligible:false,reason:"INVALID_PHONE"} as const;
  if(input.blocked) return {eligible:false,reason:"OPT_OUT"} as const;
  if(!input.whatsappOptIn) return {eligible:false,reason:"NO_OPT_IN"} as const;
  if(input.campaignAlreadyExists) return {eligible:false,reason:"IDEMPOTENCY_KEY_EXISTS"} as const;
  if(input.lastMessageAt){const days=(input.now.getTime()-input.lastMessageAt.getTime())/86_400_000;if(days<input.minimumDaysBetweenMessages)return {eligible:false,reason:"FREQUENCY_CAP"} as const;}
  return {eligible:true,reason:null} as const;
}
export function campaignKey(date:string,phone:string,brand="HOUSE190"){return `${date}_${phone}_${brand}`;}
