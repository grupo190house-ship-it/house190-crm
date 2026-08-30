import { z } from "zod";
import { DateTime } from "luxon";
import { TakeatClient } from "./takeat/client";
import { createAdminDb } from "./firebase/admin";
import { importTakeat } from "./processors/import-takeat";
const env=z.object({TAKEAT_EMAIL:z.string().email(),TAKEAT_PASSWORD:z.string().min(1),FIREBASE_SERVICE_ACCOUNT:z.string().min(1),DRY_RUN:z.enum(["true","false"]).default("true"),TIMEZONE:z.string().default("America/Bahia")}).parse(process.env);
const dateArg=process.argv.find(x=>x.startsWith("--date="))?.split("=")[1];
const localDay=dateArg?DateTime.fromISO(dateArg,{zone:env.TIMEZONE}):DateTime.now().setZone(env.TIMEZONE).minus({days:1});
const start=localDay.startOf("day").toUTC().toISO({suppressMilliseconds:true})!;const end=localDay.endOf("day").toUTC().toISO({suppressMilliseconds:true})!;
const client=new TakeatClient(env.TAKEAT_EMAIL,env.TAKEAT_PASSWORD);
const restaurant=await client.authenticate();
const checks=await Promise.allSettled([client.getProducts<unknown[]>(),client.getTableSessions<unknown[]>(start,end)]);
const failures=checks.flatMap((result,index)=>result.status==="rejected"?[`${index===0?"products":"table-sessions"}: ${result.reason instanceof Error?result.reason.message:"unknown error"}`]:[]);
if(failures.length)throw new Error(`Takeat external API check failed: ${failures.join("; ")}`);
const [products,sessions]=checks.map(result=>(result as PromiseFulfilledResult<unknown[]>).value);
const result=await importTakeat(createAdminDb(env.FIREBASE_SERVICE_ACCOUNT),{restaurant,products,sessions,localDate:localDay.toISODate()!});
console.info(JSON.stringify({event:"takeat_import_complete",restaurantId:restaurant.id,localDate:localDay.toISODate(),...result,dryRun:env.DRY_RUN==="true"}));
// WhatsApp delivery remains fail-closed. Importing real data never implies consent or message delivery.
