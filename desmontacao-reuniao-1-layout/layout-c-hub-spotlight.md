# Layout C — Hub Spotlight

> Tela inicial minimalista com saudação + atalhos rápidos, inspirado em **Raycast + Arc Browser**.

## Conceito

A tela inicial é minimal — saudação pessoal, data, e os módulos como atalhos grandes. Quando entra num módulo, ele ocupa a tela toda com sidebar própria. O Hub é uma "landing page" pessoal, não um dashboard.

## Wireframe — Desktop (1280px+)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                                                                      │
│                   Boa tarde, Jon. 🌙                                 │
│                   Quinta, 11 de junho de 2026                        │
│                                                                      │
│                   ── O que você quer fazer? ──                       │
│                                                                      │
│                                                                      │
│        ┌─── 💰 ───┐  ┌─── 📋 ───┐  ┌─── 🎯 ───┐                     │
│        │ Finanças │  │ Tarefas  │  │  Metas   │                     │
│        │ R$ 4.230 │  │ 5 hoje   │  │ 3 ativas │                     │
│        └──────────┘  └──────────┘  └──────────┘                     │
│                                                                      │
│        ┌─── 📅 ───┐  ┌─── 📝 ───┐  ┌─── 🔄 ───┐                     │
│        │Cronograma│  │  Notas   │  │ Hábitos  │                     │
│        │ Próx:14h │  │ 3 novas  │  │ 4/7 hoje │                     │
│        └──────────┘  └──────────┘  └──────────┘                     │
│                                                                      │
│                                                                      │
│        ── Atividade recente ──────────────────────                   │
│                                                                      │
│        • Despesa "Mercado" registrada — há 2h                        │
│        • Tarefa "Revisar orçamento" concluída — há 5h               │
│        • Meta "Fundo emergência" atualizada — ontem                  │
│                                                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Quando clica em "Finanças":

```
┌────┬─────────────────────────────────────────────────────────────────┐
│ ◉  │  💰 Finanças                                    [+ Nova]       │
│    │─────────────────────────────────────────────────────────────────│
│ 💰 │                                                                 │
│ Fin│  Saldo Total          │  Receitas (mês)   │  Despesas (mês)   │
│    │  R$ 4.230,00         │  R$ 5.500,00      │  R$ 1.270,00     │
│ 📋 │─────────────────────────────────────────────────────────────────│
│ Tar│                                                                 │
│    │  ────────────────── Últimas transações ──────────────────      │
│ 🎯 │                                                                 │
│ Met│  🏠 Aluguel         │  Despesa  │  -R$ 1.200  │  10/06       │
│    │  💵 Salário         │  Receita  │  +R$ 5.500  │  05/06       │
│ 📅 │  🍔 Mercado         │  Despesa  │  -R$ 350    │  08/06       │
│ Cro│  ⛽ Combustível      │  Despesa  │  -R$ 120    │  07/06       │
│    │                                                                 │
│ 📝 │  [Importar extrato]  [Ver todas]  [Filtros]                    │
│ Not│                                                                 │
│    │─────────────────────────────────────────────────────────────────│
│ 🔄 │  ← Voltar ao Hub                                                │
│ Háb│                                                                 │
└────┴─────────────────────────────────────────────────────────────────┘
```

## Wireframe — Mobile (375px)

```
┌──────────────────────┐
│                      │
│  Boa tarde, Jon. 🌙  │
│  Qui, 11 jun 2026    │
│                      │
│  ┌────────────────┐  │
│  │ 💰 Finanças    │  │
│  │ R$ 4.230       │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │ 📋 Tarefas     │  │
│  │ 5 hoje         │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │ 🎯 Metas       │  │
│  │ 3 ativas       │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │ 📅 Cronograma  │  │
│  │ Próx: 14h      │  │
│  └────────────────┘  │
│                      │
│  ── Atividade recente│
│  • Mercado — há 2h  │
│  • Revisar orç. — 5h│
│                      │
└──────────────────────┘
```

## Características

- **Hub:** Tela de boas-vindas com saudação contextual (bom dia/tarde/noite), data, atalhos + feed de atividade recente
- **Módulos:** Ao clicar, sidebar aparece à esquerda com navegação dentro do módulo. Botão "Voltar ao Hub" no final
- **Sidebar condicional:** Só aparece dentro de módulos. No Hub, tela é limpa
- **Feed:** Linha de atividade recente no Hub — mostra o que mudou desde a última visita
- **Mobile:** Mesma experiência que Layout A no hub, mas dentro dos módulos tem sidebar/bottom nav

## Prós

- ✅ Hub mais pessoal e acolhedor (saudução + feed)
- ✅ Experiência "launchpad" — entra, escolhe, mergulha
- ✅ Feed de atividade dá contexto sem precisar abrir módulos
- ✅ Visual mais único — não parece "mais um dashboard"

## Contras

- ⚠️ Dois modos de navegação (Hub sem sidebar → Módulo com sidebar) — pode confundir
- ⚠️ Precisa de "Voltar ao Hub" explícito — a transição não é fluida como sidebar sempre visível
- ⚠️ Feed de atividade pode ficar poluído com o tempo
