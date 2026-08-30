import { useMemo, useState } from "react";
import { Check, Copy, DatabaseZap, Send, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { useCrmData } from "@/context/CrmDataContext";

export function QueuePage() {
  const { orders, queue, loading } = useCrmData();
  const [copied, setCopied] = useState<string | null>(null);
  const review = useMemo(() => {
    const byPhone = new Map(
      orders
        .filter(order => order.brand === "HOUSE190" && !order.eligible)
        .sort((a, b) => (a.purchaseAt?.getTime() ?? 0) - (b.purchaseAt?.getTime() ?? 0))
        .map(order => [order.phoneE164 ?? `order:${order.id}`, order]),
    );
    return [...byPhone.values()].sort((a, b) => (b.purchaseAt?.getTime() ?? 0) - (a.purchaseAt?.getTime() ?? 0));
  }, [orders]);

  async function copyPhone(id: string, phone: string) {
    await navigator.clipboard.writeText(`+${phone}`);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return <div className="mx-auto max-w-[1100px] p-5 md:p-8 xl:p-10">
    <PageHeader eyebrow="WhatsApp seguro" title="Fila de pós-venda" description="Pedidos House 190 aguardam revisão até que consentimento, bloqueios e frequência sejam confirmados."/>
    <div className="mt-7 flex items-center gap-2 rounded-xl bg-[#fff7dc] px-4 py-3 text-xs text-[#765506]"><ShieldCheck className="size-4"/><strong>DRY RUN ativo: nenhuma mensagem será enviada automaticamente.</strong></div>

    <section className="mt-5 rounded-[22px] border border-[#e5ae25]/40 bg-white p-5">
      <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#8a6500]">Revisão necessária</p><h2 className="mt-1 text-lg font-semibold">Clientes House 190 aguardando autorização</h2></div><Badge tone="amber">{review.length}</Badge></div>
      <div className="mt-4 space-y-3">{review.map(order => <article key={order.id} className="rounded-2xl border border-[#e5ae25]/30 bg-[#fffdf6] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold">{order.customerName}</h3><Badge tone="green">HOUSE190</Badge><Badge tone="amber">Bloqueado</Badge></div>{order.phoneE164?<button onClick={() => copyPhone(order.id, order.phoneE164!)} className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-[#765506] hover:underline">+{order.phoneE164}{copied === order.id ? <Check className="size-3.5"/> : <Copy className="size-3.5"/>}</button>:<p className="mt-2 text-xs font-semibold text-red-700">Telefone não fornecido pela Takeat</p>}<p className="mt-3 flex items-center gap-1.5 text-xs text-black/50"><ShieldAlert className="size-3.5"/>{reasonLabel(order.reason)}</p></div><span className="text-[10px] text-black/35">{order.purchaseAt?.toLocaleDateString("pt-BR")}</span></div></article>)}{!loading && !review.length && <Empty title="Nenhum pedido House 190 aguardando revisão." text="Confira se os produtos foram classificados e reprocessados."/>}</div>
    </section>

    <section className="mt-5 rounded-[22px] border border-black/[.07] bg-white p-5">
      <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-black/35">Fila aprovada</p><h2 className="mt-1 text-lg font-semibold">Mensagens prontas para homologação</h2></div><Badge tone="green">{queue.length}</Badge></div>
      <div className="mt-4 space-y-3">{queue.map(item => <article key={item.id} className="rounded-2xl border border-black/[.07] p-4"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><h3 className="text-sm font-semibold">{item.customerName}</h3><Badge tone="green">{item.brand}</Badge><Badge>{item.status}</Badge></div><p className="mt-3 text-xs leading-relaxed text-black/55">{item.messagePreview || "Mensagem aguardando montagem."}</p></div><span className="text-[10px] text-black/35">{item.purchaseAt?.toLocaleDateString("pt-BR")}</span></div></article>)}{!loading && !queue.length && <Empty title="Nenhuma mensagem aprovada ainda." text="Os candidatos aparecem acima até a confirmação do consentimento."/>}</div>
    </section>
    <button disabled className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d7d7d2] py-4 text-sm font-semibold text-black/40"><Send className="size-4"/>Envio real indisponível durante a homologação</button>
  </div>;
}

function reasonLabel(reason: string | null) {
  if (reason === "INVALID_PHONE") return "A API não informou um telefone utilizável para este pedido";
  if (reason === "NO_OPT_IN") return "Consentimento do WhatsApp ainda não confirmado";
  if (reason === "FREQUENCY_CAP") return "Contato recente: aguardando intervalo de segurança";
  if (reason === "OPT_OUT") return "Cliente bloqueou mensagens";
  return "Aguardando revisão administrativa";
}

function Empty({ title, text }: { title: string; text: string }) {
  return <div className="grid place-items-center py-14 text-center"><DatabaseZap className="size-8 text-black/20"/><p className="mt-3 text-sm font-medium">{title}</p><p className="mt-1 text-xs text-black/40">{text}</p></div>;
}
