import { z } from "zod";
const sessionSchema=z.object({restaurant:z.object({id:z.number(),name:z.string(),fantasy_name:z.string()}),token:z.string().min(1)});
const BASE_URL="https://backend-pdv.takeat.app";
export class TakeatClient{
  private token:string|null=null;
  constructor(private email:string,private password:string){}
  async authenticate(){const response=await fetch(`${BASE_URL}/public/api/sessions`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:this.email,password:this.password})});if(!response.ok)throw new Error(`Takeat authentication failed (${response.status})`);const data=sessionSchema.parse(await response.json());this.token=data.token;return data.restaurant;}
  async get<T>(path:string,params?:Record<string,string>):Promise<T>{if(!this.token)await this.authenticate();const url=new URL(`${BASE_URL}/api/v1/${path}`);Object.entries(params??{}).forEach(([k,v])=>url.searchParams.set(k,v));for(let attempt=0;attempt<3;attempt++){const response=await fetch(url,{headers:{authorization:`Bearer ${this.token}`}});if(response.status===401&&attempt===0){await this.authenticate();continue;}if(response.ok)return response.json() as Promise<T>;if(response.status===429||response.status>=500){await new Promise(r=>setTimeout(r,500*2**attempt));continue;}throw new Error(`Takeat request failed (${response.status})`);}throw new Error("Takeat request failed after retries");}
  getProducts<T>(){return this.get<T>("products");}
  getTableSessions<T>(startDate:string,endDate:string){return this.get<T>("table-sessions",{start_date:startDate,end_date:endDate});}
}
