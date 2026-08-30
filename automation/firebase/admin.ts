import { cert,getApps,initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { z } from "zod";
const serviceAccountSchema=z.object({project_id:z.string(),client_email:z.string().email(),private_key:z.string().min(1)}).passthrough();
export function createAdminDb(raw:string){const account=serviceAccountSchema.parse(JSON.parse(raw));const app=getApps()[0]??initializeApp({credential:cert({projectId:account.project_id,clientEmail:account.client_email,privateKey:account.private_key})});return getFirestore(app);}
