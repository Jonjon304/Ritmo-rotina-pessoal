# Layout FINAL — Spotlight → Sidebar (Transição Suave)

> Duas fases visuais distintas com transição animada entre elas.
> Hub = Spotlight puro (sem sidebar). Módulo = Sidebar + conteúdo.
> A sidebar NÃO existe no Hub — ela surge quando você entra num módulo.

---

## FASE 1 — Hub (Spotlight Puro)

Sidebar: **AUSENTE**. Tela inteira dedicada à saudação e aos cards.
Minimalista, respirado, pessoal.

### Desktop (1280px+)

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
│        ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│        │   💰         │  │   📋         │  │   🎯         │            │
│        │  FINANÇAS    │  │  TAREFAS     │  │   METAS      │            │
│        │              │  │              │  │              │            │
│        │  R$ 4.230    │  │  5 hoje      │  │  3 ativas    │            │
│        │  ▲ 12%       │  │  2 urgentes  │  │  1 próxima   │            │
│        │              │  │              │  │              │            │
│        └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                      │
│        ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│        │   📅         │  │   📝         │  │   🔄         │            │
│        │ CRONOGRAMA   │  │   NOTAS      │  │  HÁBITOS     │            │
│        │              │  │              │  │              │            │
│        │  Próx: 14h   │  │  3 novas     │  │  4/7 hoje    │            │
│        │  Reunião     │  │  1 fixada    │  │  🔥 5 dias   │            │
│        │              │  │              │  │              │            │
│        └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)

```
┌──────────────────────┐
│                      │
│  Boa tarde, Jon. 🌙  │
│  Qui, 11 jun 2026    │
│                      │
│  ┌────────────────┐  │
│  │ 💰 Finanças    │  │
│  │ R$ 4.230 ▲12% │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │ 📋 Tarefas     │  │
│  │ 5 hoje · 2 urg │  │
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
│  ┌────────────────┐  │
│  │ 📝 Notas       │  │
│  │ 3 novas        │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │ 🔄 Hábitos     │  │
│  │ 4/7 · 🔥 5d   │  │
│  └────────────────┘  │
│                      │
└──────────────────────┘
```

### Características da Fase 1
- **Zero sidebar** — tela inteira pra saudação e cards
- **Saudação contextual:** Bom dia / Boa tarde / Boa noite
- **Cards:** Grid 3x2 (desktop), lista vertical (mobile)
- **Hover no card:** Brilho na cor do módulo + leve elevação
- **Clique no card:** Dispara transição para Fase 2

---

## TRANSIÇÃO — Hub → Módulo (Animação)

Quando clica num card (ex: Finanças):

```
Frame 1 (0ms)     — Hub Spotlight, tela cheia, cards visíveis
Frame 2 (0-150ms) — Card clicado escala levemente (+2%)
Frame 3 (150ms)   — Cards restantes fade-out (opacity 0) + saudação sobe e fade-out
Frame 4 (150-300ms)— Sidebar entra pela esquerda (translateX -64px → 0)
Frame 5 (300-400ms)— Conteúdo do módulo fade-in pela direita
Frame 6 (400ms)   — Estado final: Sidebar + Módulo visíveis
```

### Animação visual (simplificada):

```
Hub (antes do clique)          Módulo (após transição)

┌───────────────────┐         ┌──┬───────────────────────┐
│                   │         │  │  💰 Finanças   [+Nova] │
│  Boa tarde, Jon   │   →     │◉ │───────────────────────│
│                   │         │  │                        │
│  [💰] [📋] [🎯]  │         │💰│  Saldo    Rec    Desp  │
│                   │         │● │  4.230   5.500  1.270 │
│  [📅] [📝] [🔄]  │         │📋│                        │
│                   │         │  │  ── Transações ──     │
│                   │         │🎯│  Aluguel  -1.200      │
│                   │         │  │  Salário  +5.500      │
│                   │         │📅│  Mercado   -350       │
│                   │         │  │                        │
│                   │         │📝│  [Importar] [Ver todas]│
│                   │         │🔄│                        │
│                   │         │──│                        │
│                   │         │⚙ │                        │
└───────────────────┘         └──┴───────────────────────┘
```

---

## FASE 2 — Módulo (Sidebar + Conteúdo)

Sidebar aparece à esquerda com navegação entre módulos.
Home (◉) no topo para voltar ao Hub.
Conteúdo do módulo ocupa o restante da tela.

### Desktop (1280px+)

```
┌──┬──────────────────────────────────────────────────────────────────────┐
│  │  💰 Finanças                                         [+ Nova]       │
│ ◉│──────────────────────────────────────────────────────────────────────│
│  │                                                                      │
│ 💰│   Saldo total           Receitas (mês)        Despesas (mês)       │
│ ●│   R$ 4.230,00           R$ 5.500,00           R$ 1.270,00          │
│ 📋│                                                                      │
│  │   ────────────────── Últimas transações ──────────────────          │
│ 🎯│                                                                      │
│  │   🏠 Aluguel           Despesa   -R$ 1.200   10/06                  │
│ 📅│   💵 Salário           Receita   +R$ 5.500   05/06                  │
│  │   🍔 Mercado           Despesa   -R$ 350     08/06                  │
│ 📝│   ⛽ Combustível       Despesa   -R$ 120     07/06                  │
│ 🔄│                                                                      │
│  │   [Importar extrato]   [Ver todas]   [Filtros]                      │
│  │                                                                      │
│──│                                                                      │
│ ⚙│                                                                      │
└──┴──────────────────────────────────────────────────────────────────────┘
```

### Clicando em outro módulo na sidebar (ex: Tarefas)

A área de conteúdo transiciona suavemente — sidebar permanece, conteúdo muda:

```
┌──┬──────────────────────────────────────────────────────────────────────┐
│  │  📋 Tarefas                                          [+ Nova]       │
│ ◉│──────────────────────────────────────────────────────────────────────│
│  │                                                                      │
│ 💰│   Pendentes             Concluídas           Total                 │
│  │   12                    23                   35                     │
│ 📋│                                                                      │
│ ●│   ────────────────── Tarefas de hoje ───────────────────            │
│ 🎯│                                                                      │
│  │   ☐ Revisar orçamento mensal              Alta     🔴              │
│ 📅│   ☐ Enviar relatório                     Média    🟡              │
│  │   ☐ Comprar presente                      Baixa    🟢              │
│ 📝│   ☑ Ligar para contador                  Média    🟡              │
│ 🔄│   ☑ Pagar fatura de luz                  Alta     🔴              │
│  │                                                                      │
│──│   [Ver todas]   [Filtros]                                           │
│ ⚙│                                                                      │
└──┴──────────────────────────────────────────────────────────────────────┘
```

### Clicando em ◉ (Home) — Volta ao Hub

Transição reversa: sidebar sai pela esquerda, cards e saudação fade-in.
Suave, ~400ms.

### Mobile — Dentro de um módulo (375px)

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
│  ── Transações ────  │
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
│ 🏠 💰 📋 🎯  ⋯     │
└──────────────────────┘
```

### Mobile — Drawer lateral (abre ao clicar ☰)

```
┌────────────┬─────────┐
│ ◉  Home    │         │
│            │         │
│ 💰 Financ. │  💰 Fin │
│ ●          │  anças  │
│ 📋 Tarefas │         │
│            │         │
│ 🎯 Metas   │         │
│            │         │
│ 📅 Cronog. │         │
│            │         │
│ 📝 Notas   │         │
│            │         │
│ 🔄 Hábitos│         │
│            │         │
│────────────│         │
│ ⚙  Config. │         │
└────────────┴─────────┘
```

---

## Especificações Técnicas da Transição

### Hub → Módulo (entrada na sidebar)

```css
/* Sidebar: entra pela esquerda */
.sidebar {
  transform: translateX(-64px);
  opacity: 0;
  transition: transform 300ms ease-out, opacity 200ms ease-out;
}
.sidebar.visible {
  transform: translateX(0);
  opacity: 1;
}

/* Hub content: fade-out + scale down */
.hub-content {
  opacity: 1;
  transform: scale(1);
  transition: opacity 200ms ease-in, transform 300ms ease-in;
}
.hub-content.exiting {
  opacity: 0;
  transform: scale(0.96);
}

/* Module content: fade-in */
.module-content {
  opacity: 0;
  transform: translateX(16px);
  transition: opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms;
}
.module-content.visible {
  opacity: 1;
  transform: translateX(0);
}
```

### Módulo → Hub (volta ao Hub)

```
1. Sidebar sai pela esquerda (300ms)
2. Conteúdo do módulo fade-out (200ms)
3. Cards e saudação fade-in + scale up (300ms, 100ms delay)
```

### Sidebar — Detalhes

| Propriedade     | Valor                          |
|-----------------|--------------------------------|
| Largura         | 64px                           |
| Fundo           | #0f0f0f                        |
| Borda direita   | 1px solid #1e1e1e              |
| Ícone Home (◉)  | 20px, cor #f5f5f5, topo        |
| Ícone módulo    | 20px, cor #a3a3a3 (default)    |
| Ícone ativo     | 20px, cor do módulo + bg #1a1a1a|
| Ícone Settings  | 20px, base da sidebar          |
| Hover ícone     | cor do módulo, sem bg          |

---

## Resumo do Fluxo Completo

```
LOGIN
  │
  ▼
┌─────────────────────┐
│   HUB (SPOTLIGHT)   │  ← Tela cheia, saudação, 6 cards
│   Sem sidebar       │
│                     │
│  Clica num card ────┼──→ Sidebar surge + módulo abre
│                     │         │
│                     │         ├── Navega entre módulos (sidebar)
│                     │         ├── Clica ◉ Home ──→ Volta ao Hub
│                     │         │
│                     │    ┌────┴────┐
│                     │    │ MÓDULO  │  ← Sidebar 64px + conteúdo
│                     │    │ (ex:    │
│                     │    │ Finanças│
│                     │    └─────────┘
└─────────────────────┘
```

---

## Prós e Contras

### Prós
- ✅ Hub 100% limpo — zero competição visual, spotlight puro
- ✅ Sidebar só aparece quando precisa — não polui o Hub
- ✅ Transição suave dá sensação de "mergulhar" no módulo
- ✅ Navegação entre módulos é instantânea (1 clique na sidebar)
- ✅ Home sempre acessível via ◉ no topo da sidebar
- ✅ Experiência mobile coerente (tab bar + drawer)

### Contras
- ⚠️ Transição Hub→Módulo adiciona complexidade de implementação (animações + gerenciamento de estado visual)
- ⚠️ Precisa decisão: sidebar expande no hover (como D3) ou fica fixa em 64px?
- ⚠️ Mobile: voltar ao Hub requer toque na 🏠 da tab bar (não tão óbvio quanto botão "Voltar")
