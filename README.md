# HOUSE CRM — Pós-Venda Inteligente

Aplicação interna da House 190 para importar as compras do dia anterior da Takeat, classificar cada pedido por marca e preparar uma fila segura de pós-venda pelo WhatsApp.

> Regra central: o sistema opera em modo **fail-closed**. Somente pedidos classificados com certeza como `HOUSE190` podem chegar à fila. Pedidos mistos, X-Tudo, outras marcas ou produtos não mapeados nunca são enviados automaticamente.

## Estado atual

- Dashboard responsivo com funil operacional, alertas e métricas.
- Clientes de ontem com pesquisa, filtros, mascaramento de telefone e motivos de exclusão.
- Fila de pós-venda protegida por DRY RUN.
- Mapeamento de produtos por ID Takeat e marca.
- Configurações de frequência, timezone, aprovação e integrações.
- Serviços testados de timezone, telefone, classificação, deduplicação, opt-out, frequency cap e idempotência.
- Cliente Takeat com autenticação por execução, retry de `401`, `429` e `5xx`.
- Firestore Rules administrativas e workflows de CI e importação diária.

Os dados da interface são demonstrativos até que o projeto Firebase, os usuários administrativos, os secrets e o catálogo real da unidade sejam configurados.

## Stack

React, TypeScript, Vite, Tailwind CSS, componentes no padrão shadcn/ui, Lucide, Recharts, React Router, Firebase SDK, Zod, Luxon, Vitest, Firebase Hosting e GitHub Actions.

## Desenvolvimento

Requer Node.js 22 e pnpm 10+.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Validação completa:

```bash
pnpm test
pnpm build
```

## Firebase

1. Crie um projeto Firebase exclusivo para o CRM.
2. Ative Authentication por email/senha, sem cadastro público.
3. Crie os usuários administrativos manualmente.
4. Atribua a custom claim `admin: true` aos administradores autorizados.
5. Crie o Firestore e publique `firestore.rules` e `firestore.indexes.json`.
6. Preencha somente as chaves públicas `VITE_FIREBASE_*` no ambiente do frontend.
7. Guarde a conta de serviço apenas em `FIREBASE_SERVICE_ACCOUNT` no GitHub Actions.

Nenhuma credencial Takeat ou WhatsApp deve usar prefixo `VITE_` ou ser armazenada no Firestore.

## Integração Takeat

Autenticação:

```text
POST https://backend-pdv.takeat.app/public/api/sessions
```

Catálogo e comandas:

```text
GET https://backend-pdv.takeat.app/api/v1/products
GET https://backend-pdv.takeat.app/api/v1/table-sessions
```

A rotina calcula o dia anterior em `America/Bahia`, converte os limites para UTC e respeita o máximo de três dias da API. Um item com `canceled_at` preenchido não participa da classificação. IDs exibidos na documentação da Takeat são exemplos; somente produtos sincronizados da unidade podem ser mapeados.

## Segurança e privacidade

- Telefones mascarados nas telas operacionais.
- Blacklist e opt-out bloqueiam o envio sem exceções.
- Intervalo mínimo padrão de sete dias.
- Chave de idempotência: `data + telefone normalizado + marca`.
- Sem tokens no frontend, Firestore ou logs.
- Logs administrativos imutáveis para ações críticas.
- Dados não essenciais, como endereço completo e geolocalização, não são importados.

## GitHub Actions

Configure os secrets:

- `TAKEAT_EMAIL`
- `TAKEAT_PASSWORD`
- `FIREBASE_SERVICE_ACCOUNT`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_WABA_ID`

O workflow diário roda às 13:00 UTC, equivalente a 10:00 em `America/Bahia`, e permanece em DRY RUN por padrão. O acionamento manual aceita `date`, `dryRun` e `forceProductSync`; nenhum deles permite ignorar blacklist ou classificação de marca.

## Próxima homologação

Antes de qualquer mensagem real: configurar Firebase, sincronizar o catálogo real, revisar todos os produtos, importar um dia em DRY RUN, validar a fila com a operação, configurar o template oficial da Meta e somente então considerar a liberação controlada do envio.
