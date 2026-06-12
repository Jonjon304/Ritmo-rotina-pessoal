# Layout D — Hub Spotlight + Sidebar (Fusão B+C)

> O que pegar do B: sidebar sempre visível para navegação instantânea + botão "Home" no topo.
> O que pegar do C: saudação pessoal, visual minimalista e delicado, cards finos e elegantes.
> Resultado: Hub com alma de Spotlight, esqueleto de Sidebar.

---

## Variante D1 — Sidebar Fina + Hub Generoso

Sidebar ultra-estreita (56px), só ícones. Hub ocupa quase toda a tela com a saudação e cards finos. Sidebar funciona como "trilho" de navegação — nunca atrapalha o conteúdo.

### Desktop (1280px+)

```
┌──┬──────────────────────────────────────────────────────────────────────┐
│  │                                                                      │
│ ◉│              Boa tarde, Jon. 🌙                                      │
│  │              Quinta, 11 de junho de 2026                             │
│ 💰│                                                                     │
│  │              ── Seu dia ──                                            │
│ 📋│                                                                     │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│ 🎯│   │ 💰 Finanças  │  │ 📋 Tarefas   │  │ 🎯 Metas     │              │
│  │   │ R$ 4.230     │  │ 5 hoje       │  │ 3 ativas     │              │
│ 📅│   │ ▲ 12%       │  │ 2 urgentes   │  │ 1 próxima    │              │
│  │   └──────────────┘  └──────────────┘  └──────────────┘              │
│ 📝│                                                                     │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│ 🔄│   │ 📅 Cronograma│  │ 📝 Notas     │  │ 🔄 Hábitos   │              │
│  │   │ Próx: 14h    │  │ 3 novas      │  │ 4/7 hoje     │              │
│  │   │              │  │              │  │ 🔥 5 dias    │              │
│  │   └──────────────┘  └──────────────┘  └──────────────┘              │
│  │                                                                      │
│  │   ── Atividade recente ──────────────────────────                    │
│  │                                                                      │
│  │   • Despesa "Mercado" registrada — há 2h                            │
│  │   • Tarefa "Revisar orçamento" concluída — há 5h                    │
│  │   • Meta "Fundo emergência" atualizada — ontem                      │
│  │                                                                      │
│──│                                                                      │
│ ⚙│                                                                      │
└──┴──────────────────────────────────────────────────────────────────────┘
```

### Dentro de um módulo (ex: Finanças)

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
│  ── Seu dia ──       │
│                      │
│  ┌────────────────┐  │
│  │ 💰 Finanças    │  │
│  │ R$ 4.230  ▲12% │  │
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
│  ── Atividade ────── │
│  • Mercado — há 2h  │
│  • Revisar — há 5h  │
│                      │
│─────── Tab Bar ──────│
│ 🏠 💰 📋 🎯  ⋯     │
└──────────────────────┘
```

### Características D1
- **Sidebar:** 56px, só ícones, com ◉ (home) no topo, ⚙ no rodapé
- **Ícone ativo:** Fundo sutil #1a1a1a + cor do módulo no ícone
- **Hub:** Saudação + data + "Seu dia" com cards + feed de atividade
- **Cards:** 280px largura, altura variável (conteúdo mínimo), border-radius 12px
- **Módulos:** Ao clicar na sidebar, área central muda — sidebar mantém contexto
- **Mobile:** Hamburger abre sidebar como drawer. Tab bar fixa embaixo com 🏠 + 4 ícones + ⋯

### Prós
- ✅ Sidebar não compete visualmente com o Hub (muito estreita)
- ✅ Saudação dá personalidade sem tomar espaço
- ✅ Navegação instantânea entre módulos
- ✅ Feed de atividade agrega valor no Hub
- ✅ Home sempre acessível em 1 clique

### Contras
- ⚠️ Sidebar muito estreita pode ser difícil de acertar em toque (mobile)
- ⚠️ Feed de atividade pode crescer e poluir
- ⚠️ Cards no Hub + feed = bastante informação vertical
