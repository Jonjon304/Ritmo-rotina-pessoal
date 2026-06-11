# Layout B — Hub Sidebar

> Sidebar fixa com ícones dos módulos + área central de conteúdo. Inspirado em **Discord + Linear**.

## Conceito

Sidebar estreita à esquerda com os módulos como ícones. A área central mostra o Hub (visão geral) ou o conteúdo do módulo selecionado. Sidebar sempre visível — nunca se perde.

## Wireframe — Desktop (1280px+)

```
┌────┬─────────────────────────────────────────────────────────────────┐
│    │  ◉ Hub — Visão Geral                          [⚙] [👤 Jon]   │
│ 💰 │─────────────────────────────────────────────────────────────────│
│────│                                                                 │
│ 📋 │  ┌───────────────┐  ┌───────────────┐                          │
│ 🎯 │  │ 💰 FINANÇAS   │  │ 📋 TAREFAS    │                          │
│────│  │               │  │               │                          │
│ 📅 │  │ R$ 4.230      │  │ 5 hoje        │                          │
│ 📝 │  │ ▲ 12%         │  │ 2 urgentes    │                          │
│────│  │               │  │               │                          │
│ 🔄 │  │ [Ver mais →]  │  │ [Ver mais →]  │                          │
│    │  └───────────────┘  └───────────────┘                          │
│────│                                                                 │
│    │  ┌───────────────┐  ┌───────────────┐                          │
│    │  │ 🎯 METAS      │  │ 📅 CRONOGRAMA │                          │
│    │  │               │  │               │                          │
│    │  │ 3 ativas      │  │ Próx: 14h     │                          │
│    │  │ 1 próxima     │  │ Reunião       │                          │
│    │  │               │  │               │                          │
│    │  │ [Ver mais →]  │  │ [Ver mais →]  │                          │
│    │  └───────────────┘  └───────────────┘                          │
│    │                                                                 │
│    │  ┌───────────────┐  ┌───────────────┐                          │
│    │  │ 📝 NOTAS      │  │ 🔄 HÁBITOS    │                          │
│    │  │               │  │               │                          │
│    │  │ 3 novas       │  │ 4/7 hoje      │                          │
│    │  │ 1 fixada      │  │ 🔥 5 dias     │                          │
│    │  │               │  │               │                          │
│    │  │ [Ver mais →]  │  │ [Ver mais →]  │                          │
│    │  └───────────────┘  └───────────────┘                          │
│    │                                                                 │
└────┴─────────────────────────────────────────────────────────────────┘
```

### Quando clica em "Finanças" na sidebar:

```
┌────┬─────────────────────────────────────────────────────────────────┐
│    │  💰 Finanças                                    [+ Nova]       │
│ 💰 │─────────────────────────────────────────────────────────────────│
│────│                                                                 │
│ 📋 │  Saldo Total          │  Receitas (mês)   │  Despesas (mês)   │
│ 🎯 │  R$ 4.230,00         │  R$ 5.500,00      │  R$ 1.270,00     │
│────│                                                                 │
│ 📅 │  ────────────────── Últimas transações ──────────────────      │
│ 📝 │                                                                 │
│────│  🏠 Aluguel         │  Despesa  │  -R$ 1.200  │  10/06       │
│ 🔄 │  💵 Salário         │  Receita  │  +R$ 5.500  │  05/06       │
│    │  🍔 Mercado         │  Despesa  │  -R$ 350    │  08/06       │
│────│  ⛽ Combustível      │  Despesa  │  -R$ 120    │  07/06       │
│    │                                                                 │
│    │  [Importar extrato]  [Ver todas]  [Filtros]                    │
│    │                                                                 │
└────┴─────────────────────────────────────────────────────────────────┘
```

## Wireframe — Mobile (375px)

```
┌──────────────────────┐
│ ☰  💰 Finanças  [+]  │
│──────────────────────│
│                      │
│  Saldo Total         │
│  R$ 4.230,00         │
│                      │
│  Receitas │ Despesas │
│  R$ 5.500 │ R$ 1.270│
│                      │
│  ── Últimas ──────── │
│                      │
│  🏠 Aluguel          │
│  -R$ 1.200  10/06    │
│                      │
│  💵 Salário          │
│  +R$ 5.500  05/06    │
│                      │
│  🍔 Mercado          │
│  -R$ 350    08/06    │
│                      │
│─────── Tab Bar ──────│
│ 💰  📋  🎯  📅  ⋯  │
└──────────────────────┘
```

## Características

- **Sidebar:** 64px fixa à esquerda (desktop), só ícones com tooltip no hover
- **Hub:** Mostra mini-cards com "[Ver mais →]" que expande ou navega pro módulo
- **Navegação:** Sidebar sempre visível — um clique muda de módulo sem voltar ao Hub
- **Mobile:** Sidebar vira bottom tab bar com os 4-5 ícones principais + "⋯" pro resto
- **Contexto:** Dentro de cada módulo, header mostra nome + ação principal

## Prós

- ✅ Navegação instantânea entre módulos — nunca precisa "voltar"
- ✅ Sidebar dá acesso a qualquer lugar em 1 clique
- ✅ Hub funciona como overview, mas módulos são acessíveis diretamente
- ✅ Padrão conhecido (Discord, Slack, Linear) — intuitivo
- ✅ Mobile com tab bar é familiar

## Contras

- ⚠️ Sidebar come espaço horizontal (64px) — em telas pequenas pode ser apertado
- ⚠️ Hub é menos impactante visualmente (sidebar compete por atenção)
- ⚠️ Mais complexo de implementar (sidebar + router + tab bar mobile)
