import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { collection, onSnapshot, type DocumentData, type Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { OrderBrand, ProductBrand, QueueStatus } from "@/types/domain";

export interface LiveOrder { id:string; customerName:string; phoneE164:string|null; maskedPhone:string|null; purchaseAt:Date|null; total:number; channel:string; products:Array<{name:string;amount:number}>; brand:OrderBrand; eligible:boolean; reason:string|null; status:string; }
export interface LiveProduct { id:string; name:string; category:string; price:number; brand:ProductBrand; available:boolean; }
export interface LiveQueueItem { id:string; customerName:string; messagePreview:string; status:QueueStatus; purchaseAt:Date|null; brand:OrderBrand; }
interface CrmData { orders:LiveOrder[]; products:LiveProduct[]; queue:LiveQueueItem[]; loading:boolean; error:string|null; lastImportAt:Date|null; }
const Context=createContext<CrmData>({orders:[],products:[],queue:[],loading:true,error:null,lastImportAt:null});

export function CrmDataProvider({children}:{children:ReactNode}){
  const [orders,setOrders]=useState<LiveOrder[]>([]);const [products,setProducts]=useState<LiveProduct[]>([]);const [queue,setQueue]=useState<LiveQueueItem[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState<string|null>(null);const [lastImportAt,setLastImportAt]=useState<Date|null>(null);
  useEffect(()=>{if(!db){setLoading(false);return;}let ready=0;const done=()=>{ready+=1;if(ready>=4)setLoading(false)};const fail=()=>{setError("Não foi possível ler os dados. Confirme a permissão administrativa.");setLoading(false)};
    const unsubOrders=onSnapshot(collection(db,"orders"),snap=>{setOrders(snap.docs.map(d=>mapOrder(d.id,d.data())));done()},fail);
    const unsubProducts=onSnapshot(collection(db,"products"),snap=>{setProducts(snap.docs.map(d=>mapProduct(d.id,d.data())));done()},fail);
    const unsubQueue=onSnapshot(collection(db,"messageQueue"),snap=>{setQueue(snap.docs.map(d=>mapQueue(d.id,d.data())));done()},fail);
    const unsubImports=onSnapshot(collection(db,"dailyImports"),snap=>{const dates=snap.docs.map(d=>toDate(d.data().completedAt)).filter(Boolean) as Date[];setLastImportAt(dates.sort((a,b)=>b.getTime()-a.getTime())[0]??null);done()},fail);
    return()=>{unsubOrders();unsubProducts();unsubQueue();unsubImports()};
  },[]);
  const value=useMemo(()=>({orders,products,queue,loading,error,lastImportAt}),[orders,products,queue,loading,error,lastImportAt]);return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useCrmData=()=>useContext(Context);
function mapOrder(id:string,d:DocumentData):LiveOrder{return{id,customerName:String(d.customerName??d.customer?.fullName??"Cliente não identificado"),phoneE164:d.phoneE164?String(d.phoneE164):null,maskedPhone:d.maskedPhone?String(d.maskedPhone):null,purchaseAt:toDate(d.purchaseAt),total:Number(d.total??0),channel:String(d.channel??"Não informado"),products:Array.isArray(d.products)?d.products.map((p:DocumentData)=>({name:String(p.name??"Produto"),amount:Number(p.amount??1)})):[],brand:asOrderBrand(d.brandClassification),eligible:d.eligible===true,reason:d.exclusionReason?String(d.exclusionReason):null,status:String(d.status??(d.eligible?"Elegível":"Excluído"))};}
function mapProduct(id:string,d:DocumentData):LiveProduct{return{id:String(d.takeatProductId??id),name:String(d.name??"Produto sem nome"),category:String(d.categoryName??d.category??"Sem categoria"),price:Number(d.price??0),brand:asProductBrand(d.brand),available:d.available!==false};}
function mapQueue(id:string,d:DocumentData):LiveQueueItem{return{id,customerName:String(d.customerName??"Cliente"),messagePreview:String(d.messagePreview??""),status:asQueueStatus(d.status),purchaseAt:toDate(d.purchaseAt??d.purchaseDate),brand:asOrderBrand(d.brand??"HOUSE190")};}
function toDate(value:unknown):Date|null{if(value instanceof Date)return value;if(value&&typeof(value)==="object"&&"toDate" in value)return (value as Timestamp).toDate();if(typeof value==="string"){const date=new Date(value);return Number.isNaN(date.getTime())?null:date;}return null;}
function asOrderBrand(value:unknown):OrderBrand{return ["HOUSE190","XTUDO","MIXED","OTHER","UNMAPPED"].includes(String(value))?value as OrderBrand:"UNMAPPED";}
function asProductBrand(value:unknown):ProductBrand{return ["HOUSE190","XTUDO","OTHER","IGNORE","UNMAPPED"].includes(String(value))?value as ProductBrand:"UNMAPPED";}
function asQueueStatus(value:unknown):QueueStatus{return ["pending","approved","processing","sent","failed","skipped","blocked"].includes(String(value))?value as QueueStatus:"pending";}
