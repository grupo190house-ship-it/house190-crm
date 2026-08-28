import { z } from "zod";
import { DateTime } from "luxon";
import { TakeatClient } from "./takeat/client";
const env=z.object({TAKEAT_EMAIL:z.string().email(),TAKEAT_PASSWORD:z.string().min(1),DRY_RUN:z.enum(["true","false"]).default("true"),TIMEZONE:z.string().default("America/Bahia")}).parse(process.env);
const dateArg=process.argv.find(x=>x.startsWith("--date="))?.split("=")[1];
const localDay=dateArg?DateTime.fromISO(dateArg,{zone:env.TIMEZONE}):DateTime.now().setZone(env.TIMEZONE).minus({days:1});
const start=localDay.startOf("day").toUTC().toISO({suppressMilliseconds:true})!;const end=localDay.endOf("day").toUTC().toISO({suppressMilliseconds:true})!;
const client=new TakeatClient(env.TAKEAT_EMAIL,env.TAKEAT_PASSWORD);
const restaurant=await client.authenticate();
const [products,sessions]=await Promise.all([client.getProducts<unknown[]>(),client.getTableSessions<unknown[]>(start,end)]);
console.info(JSON.stringify({event:"takeat_import_complete",restaurantId:restaurant.id,localDate:localDay.toISODate(),products:products.length,sessions:sessions.length,dryRun:env.DRY_RUN==="true"}));
// Firestore persistence and WhatsApp delivery remain fail-closed until secrets and real product mappings are configured.
