# Layout A — Hub Grid

> Centro de comando com cards em grid centralizado. Inspirado em **Spotify Dashboard + Linear**.

## Conceito

Tela cheia, cards em grid simétrico no centro. Cada card é uma "porta" para um módulo. Visual limpo, respirado, elegante.

## Wireframe — Desktop (1280px+)

```
┌──────────────────────────────────────────────────────────────────────┐
│  ◉ MyFinance                                    [⚙] [🔔] [👤 Jon] │
│──────────────────────────────────────────────────────────────────────│
│                                                                      │
│                                                                      │
│          ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│          │   💰         │  │   📋         │  │   🎯         │          │
│          │  FINANÇAS    │  │  TAREFAS     │  │   METAS      │          │
│          │              │  │              │  │              │          │
│          │  R$ 4.230    │  │  5 hoje      │  │  3 ativas    │          │
│          │  ▲ 12%       │  │  2 urgentes  │  │  1 próxima   │          │
│          │              │  │              │  │              │          │
│          └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                      │
│          ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│          │   📅         │  │   📝         │  │   🔄         │          │
│          │ CRONOGRAMA   │  │   NOTAS      │  │  HÁBITOS     │          │
│          │              │  │              │  │              │          │
│          │  Próx: 14h   │  │  3 novas     │  │  4/7 hoje    │          │
│          │  Reunião     │  │  1 fixada    │  │  🔥 5 dias   │          │
│          │              │  │              │  │              │          │
│          └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                      │
│                                                                      │
│                        Última atualização: hoje 14:32                │
└──────────────────────────────────────────────────────────────────────┘
```

## Wireframe — Mobile (375px)

```
┌──────────────────────┐
│ ◉ MyFinance    [⚙]  │
│──────────────────────│
│                      │
│  ┌────────────────┐  │
│  │   💰 FINANÇAS  │  │
│  │   R$ 4.230     │  │
│  │   ▲ 12%        │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │   📋 TAREFAS   │  │
│  │   5 hoje       │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │   🎯 METAS     │  │
│  │   3 ativas     │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │   📅 CRONOGRAMA│  │
│  │   Próx: 14h    │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │   📝 NOTAS     │  │
│  │   3 novas      │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │   🔄 HÁBITOS   │  │
│  │   4/7 hoje     │  │
│  └────────────────┘  │
│                      │
└──────────────────────┘
```

## Características

- **Navegação:** Clica no card → entra no módulo. Botão "Voltar" ou logo retorna ao Hub
- **Resumo rápido:** Cada card mostra 1-2 dados relevantes (saldo, tarefas do dia, etc.)
- **Hover:** Card sobe levemente (translateY -2px) + brilho na cor do módulo
- **Grid:** CSS Grid 3 colunas (desktop), 2 (tablet), 1 (mobile)
- **Espaçamento:** Generoso — 24px gap entre cards, 48px padding do container
- **Header:** Minimalista — logo à esquerda, ícones à direita

## Prós

- ✅ Visual impactante, limpo e respirado
- ✅ Fácil de entender — cada card é óbvio
- ✅ Responsivo natural (grid adapta)
- ✅ Sem distrações laterais

## Contras

- ⚠️ Precisa clicar num card pra ver qualquer coisa — nenhuma info além do resumo
- ⚠️ Em mobile, vira lista longa (scroll)
- ⚠️ Sem navegação persistente dentro dos módulos (precisa voltar ao Hub)
