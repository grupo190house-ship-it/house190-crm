import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AlertTriangle, Bell, ChevronDown, CircleUserRound, FileBarChart, LayoutDashboard, Menu, MessageCircleMore, PackageSearch, Search, Settings, ShieldCheck, Store, UsersRound, X } from "lucide-react";
import { useCrmData } from "@/context/CrmDataContext";

const nav = [
  ["Visão geral", "/", LayoutDashboard], ["Clientes de ontem", "/clientes-ontem", UsersRound],
  ["Fila de pós-venda", "/fila", MessageCircleMore], ["Produtos & marcas", "/produtos", PackageSearch],
  ["Clientes", "/clientes", CircleUserRound], ["Relatórios", "/relatorios", FileBarChart],
  ["Configurações", "/configuracoes", Settings],
] as const;

export function AppShell() {
  const [open, setOpen] = useState(false);
  const { queue } = useCrmData();
  return <div className="min-h-screen bg-[#f4f4f1] text-[#171719]">
    {open && <button aria-label="Fechar menu" className="fixed inset-0 z-30 bg-black/45 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-[#111113] px-4 py-5 text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center gap-3 px-2"><div className="grid size-10 place-items-center rounded-[14px] bg-[#f5b928] text-sm font-black text-[#151515]">190</div><div><p className="text-sm font-semibold tracking-tight">HOUSE CRM</p><p className="text-[11px] text-white/45">Pós-venda inteligente</p></div><button className="ml-auto lg:hidden" aria-label="Fechar menu" onClick={() => setOpen(false)}><X className="size-5" /></button></div>
      <nav className="mt-10 space-y-1">{nav.map(([label,to,Icon]) => <NavLink key={label} to={to} end={to === "/"} onClick={() => setOpen(false)} className={({isActive}) => `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition ${isActive ? "bg-white/10 text-white" : "text-white/52 hover:bg-white/[.06] hover:text-white"}`}>{({isActive}) => <><Icon className={`size-[17px] ${isActive ? "text-[#f5b928]" : "text-white/40 group-hover:text-white/70"}`} />{label}{label === "Fila de pós-venda" && queue.length>0 && <span className="ml-auto rounded-full bg-[#f5b928] px-2 py-0.5 text-[10px] font-bold text-black">{queue.length}</span>}</>}</NavLink>)}</nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.045] p-3.5"><div className="flex items-center gap-2 text-xs font-medium"><ShieldCheck className="size-4 text-emerald-400" />Envio protegido</div><p className="mt-2 text-[11px] leading-relaxed text-white/45">Somente pedidos confirmados como House 190 entram na fila.</p></div>
    </aside>
    <main className="lg:pl-[248px]"><header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-black/[.07] bg-[#f4f4f1]/90 px-5 backdrop-blur-xl md:px-8"><button className="grid size-9 place-items-center rounded-xl border border-black/[.07] bg-white lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu className="size-4" /></button><button className="hidden items-center gap-2 text-sm font-medium md:flex"><Store className="size-4" />House 190 — Matriz <ChevronDown className="size-3.5 opacity-40" /></button><div className="ml-auto flex items-center gap-2"><button aria-label="Pesquisar" className="grid size-9 place-items-center rounded-xl border border-black/[.07] bg-white"><Search className="size-4" /></button><button aria-label="Notificações" className="relative grid size-9 place-items-center rounded-xl border border-black/[.07] bg-white"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#e2583e]" /></button><div className="ml-1 grid size-9 place-items-center rounded-xl bg-[#e5dfd2] text-xs font-bold">GD</div></div></header><Outlet /></main>
    <div className="fixed bottom-4 right-4 z-30 hidden items-center gap-2 rounded-full border border-[#e5ae25]/35 bg-[#fff7dc] px-3 py-2 text-[10px] font-semibold text-[#765506] shadow-lg md:flex"><AlertTriangle className="size-3.5" />DRY RUN ATIVO</div>
  </div>;
}
