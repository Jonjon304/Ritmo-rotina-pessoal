# Layout D3 — Sidebar Expandível + Hub com Saudação e Resumos

> Sidebar que expande no hover (56px → 180px). Hub com saudação + cards de resumo médios.
> O meio-termo perfeito: compacto por padrão, generoso quando precisa.

### Desktop (1280px+) — Sidebar recolhida (padrão)

```
┌──┬──────────────────────────────────────────────────────────────────────┐
│  │                                                                      │
│ ◉│              Boa tarde, Jon. 🌙                                      │
│  │              Quinta, 11 de junho de 2026                             │
│ 💰│                                                                     │
│  │   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│ 📋│   │ 💰 Finanças    │  │ 📋 Tarefas     │  │ 🎯 Metas       │       │
│  │   │                │  │                │  │                │       │
│ 🎯│   │ R$ 4.230      │  │ 5 hoje         │  │ 3 ativas       │       │
│  │   │ ▲ 12% este mês │  │ 2 urgentes     │  │ 1 próxima      │       │
│ 📅│   │                │  │                │  │                │       │
│  │   └────────────────┘  └────────────────┘  └────────────────┘       │
│ 📝│                                                                     │
│ 🔄│   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │   │ 📅 Cronograma   │  │ 📝 Notas       │  │ 🔄 Hábitos     │       │
│  │   │                │  │                │  │                │       │
│  │   │ Próx: 14h      │  │ 3 novas        │  │ 4/7 hoje       │       │
│  │   │ Reunião equipe │  │ 1 fixada       │  │ 🔥 5 dias      │       │
│  │   │                │  │                │  │                │       │
│  │   └────────────────┘  └────────────────┘  └────────────────┘       │
│──│                                                                     │
│ ⚙│                                                                     │
└──┴──────────────────────────────────────────────────────────────────────┘
```

### Desktop — Sidebar expandida (hover sobre a sidebar)

```
┌──────────┬───────────────────────────────────────────────────────────────┐
│          │                                                               │
│ ◉ Home   │              Boa tarde, Jon. 🌙                               │
│          │              Quinta, 11 de junho de 2026                      │
│ 💰 Finan.│                                                               │
│          │   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐│
│ 📋 Taref.│   │ 💰 Finanças    │  │ 📋 Tarefas     │  │ 🎯 Metas       ││
│          │   │                │  │                │  │                ││
│ 🎯 Metas │   │ R$ 4.230      │  │ 5 hoje         │  │ 3 ativas       ││
│          │   │ ▲ 12% este mês │  │ 2 urgentes     │  │ 1 próxima      ││
│ 📅 Cronog│   │                │  │                │  │                ││
│          │   └────────────────┘  └────────────────┘  └────────────────┘│
│ 📝 Notas │                                                               │
│          │   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐│
│ 🔄 Hábit.│   │ 📅 Cronograma   │  │ 📝 Notas       │  │ 🔄 Hábitos     ││
│          │   │                │  │                │  │                ││
│          │   │ Próx: 14h      │  │ 3 novas        │  │ 4/7 hoje       ││
│──────────│   │ Reunião equipe │  │ 1 fixada       │  │ 🔥 5 dias      ││
│ ⚙ Config.│   │                │  │                │  │                ││
│          │   └────────────────┘  └────────────────┘  └────────────────┘│
│          │                                                               │
└──────────┴───────────────────────────────────────────────────────────────┘
```

### Dentro de um módulo (ex: Finanças) — sidebar recolhida

```
┌──┬──────────────────────────────────────────────────────────────────────┐
│  │  💰 Finanças                                         [+ Nova]       │
│ ◉│──────────────────────────────────────────────────────────────────────│
│  │                                                                      │
│ 💰│   Saldo total           Receitas (mês)        Despesas (mês)       │
│ ◉│   R$ 4.230,00           R$ 5.500,00           R$ 1.270,00          │
│ 📋│                                                                      │
│  │   ────────────────── Últimas transações ──────────────────          │
│ 🎯│                                                                      │
│  │   🏠 Alugel           Despesa   -R$ 1.200   10/06                  │
│ 📅│   💵 Salário          Receita   +R$ 5.500   05/06                  │
│  │   🍔 Mercado          Despesa   -R$ 350     08/06                  │
│ 📝│   ⛽ Combustível      Despesa   -R$ 120     07/06                  │
│ 🔄│                                                                      │
│  │   [Importar extrato]   [Ver todas]   [Filtros]                      │
│  │                                                                      │
│──│                                                                      │
│ ⚙│                                                                      │
└──┴──────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)

```
┌──────────────────────┐
│ ☰   Boa tarde, Jon 🌙│
│──────────────────────│
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
│  │ 3 novas · 1 fix│  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │ 🔄 Hábitos     │  │
│  │ 4/7 · 🔥 5 dias│  │
│  └────────────────┘  │
│                      │
│─────── Tab Bar ──────│
│ 🏠 💰 📋 🎯  ⋯     │
└──────────────────────┘
```

### Características D3
- **Sidebar recolhida:** 56px, só ícones (padrão)
- **Sidebar expandida:** 180px no hover, mostra ícone + nome do módulo
- **Transição:** 200ms ease-out, suave
- **Hub:** Saudação + cards médios (2 dados cada) em grid 3x2
- **Cards:** ~240px largura, border-radius 12px, conteúdo essencial
- **Módulo ativo:** Ícone com fundo na cor do módulo + nome visível na sidebar expandida
- **Home:** Sempre acessível via ◉ no topo da sidebar
- **Mobile:** Drawer lateral ao clicar no ☰. Tab bar fixa embaixo

### Prós
- ✅ Melhor dos dois mundos — sidebar discreta por padrão, informativa quando precisa
- ✅ Saudação personaliza a experiência
- ✅ Cards com 2 dados cada = informação suficiente sem sobrecarregar
- ✅ Sidebar expandível ajuda quem quer ver os nomes dos módulos
- ✅ Navegação sempre acessível (1 clique)
- ✅ Home sempre no topo da sidebar
- ✅ Equilíbrio entre informação e respiração visual

### Contras
- ⚠️ Sidebar expandível adiciona complexidade de implementação
- ⚠️ Em telas pequenas (~1024px), sidebar expandida pode comer espaço do Hub
- ⚠️ Precisa definir se expande só na sidebar ou se empurra o conteúdo também
