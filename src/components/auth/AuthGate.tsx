import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { AlertTriangle, LoaderCircle, LockKeyhole } from "lucide-react";
import { auth, firebaseConfigurationMissing } from "@/lib/firebase";

export function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(Boolean(auth));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, value => { setUser(value); setChecking(false); });
  }, []);

  if (firebaseConfigurationMissing) return <SetupRequired />;
  if (checking) return <Centered><LoaderCircle className="size-7 animate-spin text-[#c38c00]" /><p className="mt-3 text-sm text-black/45">Verificando acesso…</p></Centered>;
  if (!user) return <Login onError={setError} error={error} />;
  return <>{children}<button onClick={() => auth && signOut(auth)} className="fixed bottom-4 left-4 z-50 rounded-lg bg-white/10 px-3 py-1.5 text-[9px] text-white/40 lg:left-[84px]">Sair</button></>;
}

function Login({onError,error}:{onError:(value:string)=>void;error:string}) {
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();onError("");const data=new FormData(event.currentTarget);try{await signInWithEmailAndPassword(auth!,String(data.get("email")),String(data.get("password")));}catch{onError("Acesso não autorizado. Confira seu email e senha.");}}
  return <Centered><div className="w-full max-w-sm rounded-[24px] border border-black/[.08] bg-white p-6 shadow-xl shadow-black/5"><div className="grid size-11 place-items-center rounded-[15px] bg-[#171719] text-[#f5b928]"><LockKeyhole className="size-5"/></div><h1 className="mt-5 text-2xl font-semibold tracking-[-.04em]">Acesso administrativo</h1><p className="mt-2 text-xs leading-relaxed text-black/45">Entre com um usuário previamente autorizado no Firebase.</p><form onSubmit={submit} className="mt-6 space-y-3"><input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#c99308]"/><input name="password" type="password" required placeholder="Senha" className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#c99308]"/>{error&&<p className="text-xs text-red-600">{error}</p>}<button className="w-full rounded-xl bg-[#171719] py-3 text-sm font-semibold text-white">Entrar</button></form></div></Centered>;
}
function SetupRequired(){return <Centered><div className="max-w-lg rounded-[24px] border border-[#e5ae25]/35 bg-white p-7"><div className="flex items-center gap-2 text-[#805c00]"><AlertTriangle className="size-5"/><strong className="text-sm">Integração real ainda não configurada</strong></div><h1 className="mt-5 text-2xl font-semibold tracking-[-.04em]">Nenhum dado demonstrativo é exibido.</h1><p className="mt-3 text-sm leading-relaxed text-black/50">Configure as variáveis públicas do projeto Firebase e os secrets protegidos da Takeat para iniciar a primeira importação real.</p></div></Centered>}
function Centered({children}:{children:ReactNode}){return <div className="grid min-h-screen place-items-center bg-[#f4f4f1] p-5 text-center"><div>{children}</div></div>}
