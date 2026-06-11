# Layout D2 — Sidebar Fina + Hub Compacto

> Mesma sidebar do D1, mas Hub mais contido — saudação + cards numa linha só, sem feed.
> Mais limpo, mais "landing page" pessoal. Menos informação, mais respiração.

### Desktop (1280px+)

```
┌──┬──────────────────────────────────────────────────────────────────────┐
│  │                                                                      │
│ ◉│                                                                      │
│  │              Boa tarde, Jon. 🌙                                      │
│ 💰│              Quinta, 11 de junho                                     │
│  │                                                                      │
│ 📋│   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐           │
│  │   │ 💰  │  │ 📋  │  │ 🎯  │  │ 📅  │  │ 📝  │  │ 🔄  │           │
│ 🎯│   │     │  │     │  │     │  │     │  │     │  │     │           │
│  │   │4.230│  │5    │  │3    │  │14h  │  │3    │  │4/7  │           │
│ 📅│   │▲12%│  │urgnt│  │ativs│  │próx │  │novas│  │🔥5d│           │
│  │   │     │  │     │  │     │  │     │  │     │  │     │           │
│ 📝│   └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘           │
│ 🔄│                                                                      │
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
│ 📝│                                                                      │
│ 🔄│   [Importar extrato]   [Ver todas]   [Filtros]                      │
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
│  ┌────┐  ┌────┐      │
│  │ 💰 │  │ 📋 │      │
│  │4.230│ │ 5  │      │
│  └────┘  └────┘      │
│                      │
│  ┌────┐  ┌────┐      │
│  │ 🎯 │  │ 📅 │      │
│  │  3 │  │14h │      │
│  └────┘  └────┘      │
│                      │
│  ┌────┐  ┌────┐      │
│  │ 📝 │  │ 🔄 │      │
│  │  3 │  │4/7 │      │
│  └────┘  └────┘      │
│                      │
│                      │
│                      │
│─────── Tab Bar ──────│
│ 🏠 💰 📋 🎯  ⋯     │
└──────────────────────┘
```

### Características D2
- **Sidebar:** 56px, igual ao D1
- **Hub:** Saudação + 6 cards pequenos em linha única (ou 2 linhas de 3)
- **Cards:** ~160px largura, compactos — só ícone + nome + 1 número
- **Sem feed:** Hub é limpo, só os cards. Zero ruído.
- **Respiração:** Muito espaço vazio — elegante e minimalista
- **Hover:** Card cresce levemente e mostra 1 dado extra (tooltip sutil)

### Prós
- ✅ Ultra-limpo — máximo de espaço vazio, mínimo de informação
- ✅ Cards compactos = tudo visível sem scroll
- ✅ Sidebar garante navegação rápida
- ✅ Mais elegante e "fino" que D1
- ✅ Mobile com grid 2x3 é compacto e rápido

### Contras
- ⚠️ Pouca informação no Hub — precisa entrar no módulo pra ver qualquer coisa
- ⚠️ Cards muito pequenos podem ser difíceis de tocar em mobile
- ⚠️ Pode parecer "vazio" demais pra quem gosta de dados
