# Testando Funcionalidades — Módulo Finanças

> **Objetivo:** Este documento é uma especificação visual e funcional completa do módulo Finanças do MyFinance, integrada ao layout aprovado (Spotlight-Sidebar-Transição). Serve como referência para gerar o front-end com clareza de cada componente, interação e fluxo.

---

## 1. Contexto do Layout Aprovado

### Layout: Spotlight-Sidebar-Transição

O MyFinance tem duas fases visuais com transição animada:

- **Hub (Spotlight):** Tela cheia, saudacao contextual, 6 cards em grid 3x2 (desktop) ou vertical (mobile). Zero sidebar.
- **Modulo:** Sidebar 64px surge pela esquerda + conteudo do modulo. Animacao ~400ms.
- **Volta ao Hub:** Botao Home no topo da sidebar. Sidebar sai, hub fade-in.

### Tokens de Design (Dark Elegante)

```
Cores de fundo:
  --bg-deepest: #0a0a0a
  --bg-deep: #0f0f0f
  --bg-base: #1a1a1a
  --bg-raised: #222222
  --bg-hover: #2a2a2a

Bordas:
  --border-subtle: #1e1e1e
  --border-default: #2a2a2a

Texto:
  --text-primary: #f5f5f5
  --text-secondary: #a3a3a3
  --text-muted: #525252

Estados:
  --success: #22c55e  (verde - receita/positivo)
  --danger: #ef4444   (vermelho - despesa/negativo)
  --warning: #f59e0b  (amarelo - alerta)

Accent do modulo Financas:
  --accent: #8b5cf6       (roxo)
  --accent-bright: #a78bfa (roxo claro)

Tipografia:
  Principal: Inter (400, 500, 600, 700)
  Monospace: JetBrains Mono (500) — usada em valores financeiros

Sidebar:
  Largura: 64px
  Icones: 44x44px, border-radius 10px
  Botao ativo: box-shadow inset 3px 0 0 var(--accent)
```

### Estrutura HTML base (quando dentro do modulo)

```html
<div class="app">
  <!-- SIDEBAR — visivel quando dentro de modulo -->
  <nav class="sidebar visible">
    <div class="sidebar-top">
      <button class="sidebar-btn sidebar-home" title="Home">◉</button>
    </div>
    <div class="sidebar-modules">
      <button class="sidebar-btn active" style="--accent: #8b5cf6;">💰</button>
      <!-- outros modulos -->
    </div>
    <div class="sidebar-bottom">
      <button class="sidebar-btn">⚙️</button>
    </div>
  </nav>

  <!-- MAIN AREA — conteudo do modulo -->
  <main class="main-area">
    <div class="module-content visible">
      <div class="module-page active" data-module="financas">
        <!-- CONTEUDO DO MODULO FINANCAS AQUI -->
      </div>
    </div>
  </main>
</div>
```

---

## 2. Visao Geral das Seções do Modulo Financas

```
┌─ SIDEBAR 64px ─┬─ CONTEUDO FINANCAS ──────────────────────────────────────┐
│                 │                                                         │
│  ◉ Home         │  HEADER: titulo + seletor de mes + botoes de acao      │
│                 │                                                         │
│  💰 Financas ◄  │  TABS DE PERFIL: Todos | Nubank | Inter | Carteira     │
│  📋 Tarefas     │                                                         │
│  🎯 Metas       │  STATS ROW: Saldo | Receitas | Despesas | Custos Fixos │
│  📅 Cronograma  │                                                         │
│  📝 Notas       │  SECOES (scroll vertical):                             │
│  🔄 Habitos     │  ├─ Extrato do mes (lista de transacoes)               │
│                 │  ├─ Receitas Fixas / Despesas Fixas                    │
│  ⚙ Config       │  ├─ Investimentos                                      │
│                 │  ├─ Categorias                                          │
│                 │  └─ Graficos & Relatorios                              │
│                 │                                                         │
└─────────────────┴─────────────────────────────────────────────────────────┘
```

### Ordem de renderizacao no scroll:

1. Header com seletor de mes
2. Tabs de perfil/conta
3. Stats row (4 cards)
4. Extrato do mes
5. Receitas Fixas & Despesas Fixas
6. Investimentos
7. Categorias
8. Graficos & Relatorios

---

## 3. Detalhamento de Cada Seção

---

### 3.1 HEADER DO MODULO

**Posicao:** topo fixo da area de conteudo, abaixo da sidebar

**Estrutura visual:**

```
┌──────────────────────────────────────────────────────────────────┐
│  💰 Financas           ◄ Maio 2026 ►      [+ Nova Transacao]    │
│                                    [📥 Importar] [📊 Relatorios]│
└──────────────────────────────────────────────────────────────────┘
```

**Componentes:**

- **Icone + Titulo:** `💰 Financas` (esquerda, ja existe no prototipo)
- **Seletor de Mes:** Navegador central com setas ◄ ►
  - Display: "Maio 2026" (mes por extenso + ano)
  - Seta esquerda: volta 1 mes
  - Seta direita: avanca 1 mes
  - Clicavel: ao clicar no texto do mes, abre um dropdown/seletor rapido para escolher mes/ano diretamente
  - **Comportamento:** Trocar o mes atualiza TODA a pagina — stats, extrato, fixos, graficos — tudo reflete apenas o mes selecionado
- **Botao "Nova Transacao":** Primario, cor accent (#8b5cf6), abre modal de nova transacao (ver secao 3.5)
- **Botao "Importar":** Ghost, abre modal de importacao CSV/PDF (ver secao 3.6)
- **Botao "Relatorios":** Ghost, scrolla para a secao de graficos ou abre pagina dedicada

**HTML sugerido:**

```html
<header class="module-header">
  <div class="module-header-left">
    <span class="module-header-icon" style="color: #8b5cf6;">💰</span>
    <h2 class="module-header-title">Financas</h2>
  </div>
  <div class="month-selector">
    <button class="btn-icon month-prev">◄</button>
    <button class="month-label">Maio 2026</button>
    <button class="btn-icon month-next">►</button>
  </div>
  <div class="module-header-actions">
    <button class="btn-ghost">📥 Importar</button>
    <button class="btn-ghost">📊 Relatorios</button>
    <button class="btn-primary" style="--accent: #8b5cf6;">+ Nova Transacao</button>
  </div>
</header>
```

**Interacoes:**

| Acao | Resultado |
|------|-----------|
| Clicar ◄ | Volta 1 mes, atualiza toda a pagina |
| Clicar ► | Avanca 1 mes, atualiza toda a pagina |
| Clicar no texto do mes | Abre dropdown com seletor de mes/ano |
| Clicar "+ Nova Transacao" | Abre modal de nova transacao |
| Clicar "Importar" | Abre modal de importacao |
| Clicar "Relatorios" | Scroll suave para secao de graficos |

---

### 3.2 TABS DE PERFIL / CONTA

**Posicao:** abaixo do header, acima dos stats

**Estrutura visual:**

```
┌──────────────────────────────────────────────────────────────────┐
│  [Todos]  [Nubank]  [Inter]  [Carteira]  [PicPay]  [+ Perfil]   │
└──────────────────────────────────────────────────────────────────┘
```

**Descricao:**

- Cada "perfil" representa uma conta/banco/carteira diferente
- O usuario cria perfis personalizados (ex: Nubank, Inter, Carteira, PicPay, etc.)
- A tab **"Todos"** mostra a visao consolidada — junta todas as contas, como se fosse um open finance
- Ao clicar em um perfil especifico (ex: Nubank), toda a pagina filtra: stats, extrato, graficos mostram apenas dados daquele perfil
- O botao **"+ Perfil"** abre um mini-modal para criar um novo perfil

**HTML sugerido:**

```html
<div class="profile-tabs">
  <button class="profile-tab active" data-profile="all">Todos</button>
  <button class="profile-tab" data-profile="nubank">Nubank</button>
  <button class="profile-tab" data-profile="inter">Inter</button>
  <button class="profile-tab" data-profile="carteira">Carteira</button>
  <button class="profile-tab-add">+ Perfil</button>
</div>
```

**Estilos:**

- Tab ativa: background `var(--accent)` com opacidade 12%, texto com cor `var(--accent)`, border-bottom 2px solid `var(--accent)`
- Tab inativa: texto `var(--text-secondary)`, hover background `var(--bg-hover)`
- Scroll horizontal no mobile se forem muitos perfis
- Botao "+ Perfil": estilo dashed border, cor `var(--text-muted)`

**Interacoes:**

| Acao | Resultado |
|------|-----------|
| Clicar em "Todos" | Mostra dados consolidados de todos os perfis |
| Clicar em perfil especifico | Filtra toda a pagina para aquele perfil |
| Clicar "+ Perfil" | Abre mini-modal: nome do perfil + cor + icone |
| Hover no perfil | Mostra saldo rapido daquele perfil como tooltip |

**Modal de Criar Perfil:**

```
┌─ Novo Perfil ─────────────────┐
│                                │
│  Nome: [_______________]      │
│  Cor: [🟣][🔵][🟢][🟡][🔴] │
│  Icone: [🏦][💳][👛][💵]    │
│                                │
│  [Cancelar]  [Criar Perfil]   │
└────────────────────────────────┘
```

- Nome: input text
- Cor: picker de cores pre-definidas (5-8 opcoes)
- Icone: selecao de 4-8 icones pre-definidos
- Apos criar, a tab aparece na lista e ja fica selecionada

---

### 3.3 STATS ROW (4 Cards)

**Posicao:** abaixo das tabs de perfil

**Estrutura visual:**

```
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│  Saldo Total      │  Receitas (mes)  │  Despesas (mes)  │  Custos Fixos    │
│  R$ 4.230,00      │  R$ 5.500,00     │  R$ 1.270,00     │  R$ 2.450,00     │
│  ▲ Nubank: 2.100  │  ▲ +12% vs abl  │  ▼ -5% vs abl   │  ▲ 3 pendentes   │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

**Componentes:**

1. **Saldo Total:** Valor consolidado (todos os perfis) ou do perfil selecionado
   - Cor: `var(--text-primary)` (branco)
   - Sub-texto: breakdown por perfil quando em "Todos" (ex: "Nubank: R$ 2.100 | Inter: R$ 2.130")

2. **Receitas (mes):** Soma de receitas do mes selecionado
   - Cor: `var(--success)` (#22c55e verde)
   - Sub-texto: variacao vs mes anterior (ex: "▲ +12% vs abr")

3. **Despesas (mes):** Soma de despesas do mes selecionado
   - Cor: `var(--danger)` (#ef4444 vermelho)
   - Sub-texto: variacao vs mes anterior (ex: "▼ -5% vs abr")

4. **Custos Fixos:** Soma de despesas fixas programadas do mes
   - Cor: `var(--warning)` (#f59e0b amarelo)
   - Sub-texto: quantas estao pendentes vs pagas (ex: "▲ 3 pendentes")

**HTML sugerido:**

```html
<div class="stats-row">
  <div class="stat-card">
    <span class="stat-label">Saldo Total</span>
    <span class="stat-value mono">R$ 4.230,00</span>
    <span class="stat-sub">Nubank: R$ 2.100 | Inter: R$ 2.130</span>
  </div>
  <div class="stat-card positive">
    <span class="stat-label">Receitas (maio)</span>
    <span class="stat-value mono">R$ 5.500,00</span>
    <span class="stat-sub positive">▲ +12% vs abr</span>
  </div>
  <div class="stat-card negative">
    <span class="stat-label">Despesas (maio)</span>
    <span class="stat-value mono">R$ 1.270,00</span>
    <span class="stat-sub negative">▼ -5% vs abr</span>
  </div>
  <div class="stat-card">
    <span class="stat-label">Custos Fixos</span>
    <span class="stat-value mono warning">R$ 2.450,00</span>
    <span class="stat-sub">3 pendentes</span>
  </div>
</div>
```

**Estilos novos necessarios:**

```css
.stat-sub {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.stat-sub.positive {
  color: var(--success);
}

.stat-sub.negative {
  color: var(--danger);
}

.stat-value.warning {
  color: var(--warning);
}
```

**Comportamento por perfil:**

- Perfil "Todos": Saldo total = soma de todos, sub-texto com breakdown
- Perfil especifico: Saldo daquele perfil, sem breakdown
- Troca de mes: atualiza todos os 4 cards

---

### 3.4 EXTRATO DO MES

**Posicao:** abaixo dos stats, secao principal do modulo

**Estrutura visual:**

```
┌─ Extrato — Maio 2026 ────────────────────────────── [Filtros] [Ver todos] ─┐
│                                                                               │
│  🏠 Aluguel           Moradia     Nubank    -R$ 1.200,00     10/06  🔁      │
│  💰 Salario            Renda       Nubank   +R$ 5.500,00      05/06  🔁      │
│  🍔 Mercado            Alimentacao Inter     -R$ 350,00       08/06          │
│  ⛽ Combustivel        Transporte  Carteira  -R$ 120,00       07/06          │
│  🎧 Spotify           Lazer        Nubank    -R$ 22,00        01/06  🔁      │
│  📱 Internet          Custos Fixos Inter     -R$ 150,00      10/06  🔁      │
│                                                                               │
│  [Mostrar mais]                                                              │
└───────────────────────────────────────────────────────────────────────────────┘
```

**Descricao:**

- Lista vertical de transacoes do mes selecionado
- Cada transacao mostra: icone/emoji, nome, categoria, perfil/conta, valor, data
- Transacoes fixas/recorrentes tem icone 🔁 indicando que sao automaticas
- Valores positivos: verde (`var(--success)`), negativos: vermelho (`var(--danger)`)
- Limite inicial: 10 transacoes visiveis, botao "Mostrar mais" carrega o restante
- Ordenacao padrao: por data (mais recente primeiro)

**Colunas da lista:**

| Coluna | Alinhamento | Largura | Mobile |
|--------|------------|----------|--------|
| Icone | esquerda | 28px | visivel |
| Nome | esquerda | flex: 1 | visivel |
| Categoria | esquerda | 100px | oculta mobile |
| Perfil | centro | 80px | oculta mobile |
| Valor | direita | 120px | visivel |
| Data | direita | 60px | visivel |
| Recorrente | direita | 24px | visivel (icone 🔁) |

**HTML sugerido:**

```html
<div class="section-header">
  <h3>Extrato — Maio 2026</h3>
  <div class="section-actions">
    <button class="btn-ghost">Filtros</button>
    <button class="btn-ghost">Ver todos</button>
  </div>
</div>

<div class="transaction-list">
  <div class="transaction-item recurring">
    <span class="transaction-emoji">🏠</span>
    <span class="transaction-name">Aluguel</span>
    <span class="transaction-category">Moradia</span>
    <span class="transaction-profile">Nubank</span>
    <span class="transaction-amount negative mono">-R$ 1.200,00</span>
    <span class="transaction-date">10/06</span>
    <span class="transaction-recurring" title="Transacao fixa">🔁</span>
  </div>

  <div class="transaction-item recurring">
    <span class="transaction-emoji">💰</span>
    <span class="transaction-name">Salario</span>
    <span class="transaction-category">Renda</span>
    <span class="transaction-profile">Nubank</span>
    <span class="transaction-amount positive mono">+R$ 5.500,00</span>
    <span class="transaction-date">05/06</span>
    <span class="transaction-recurring" title="Receita fixa">🔁</span>
  </div>

  <!-- mais transacoes... -->
</div>

<button class="btn-ghost btn-load-more">Mostrar mais</button>
```

**Estilos novos:**

```css
.transaction-profile {
  font-size: 11px;
  color: var(--text-muted);
  min-width: 80px;
  text-align: center;
  background: var(--bg-raised);
  padding: 2px 8px;
  border-radius: 4px;
}

.transaction-recurring {
  font-size: 12px;
  opacity: 0.5;
  width: 24px;
  text-align: center;
}

.transaction-item.recurring .transaction-name::after {
  content: '';
  /* indicador visual sutil de recorrencia */
}

.btn-load-more {
  width: 100%;
  margin-top: 12px;
  text-align: center;
}
```

**Painel de Filtros:**

Ao clicar em "Filtros", abre um painel dropdown com:

```
┌─ Filtros ────────────────────────────┐
│  Tipo:      [Todos] [Receita] [Despesa] │
│  Categoria: [Todas ▼]                   │
│  Perfil:    [Todos ▼]                   │
│  Fixas:     [Todas] [Fixas] [Avulsas]   │
│  Busca:     [___________________]        │
│                              [Limpar]   │
└────────────────────────────────────────┘
```

- Tipo: toggle entre Todos / Receita / Despesa
- Categoria: dropdown com todas as categorias cadastradas
- Perfil: dropdown com todos os perfis
- Fixas: toggle entre Todas / Apenas fixas / Apenas avulsas
- Busca: filtro textual pelo nome da transacao
- Limpar: reseta todos os filtros

**Interacoes:**

| Acao | Resultado |
|------|-----------|
| Clicar em transacao | Abre detalhes/edicao da transacao |
| Clicar 🔁 | Mostra info "Esta transacao e fixa, editar em Receitas/Despesas Fixas" |
| Clicar "Mostrar mais" | Carrega +10 transacoes |
| Aplicar filtro | Filtra a lista instantaneamente |
| Trocar mes | Carrega extrato do novo mes |
| Trocar perfil | Filtra extrato pelo perfil selecionado |

---

### 3.5 ENTRADA MANUAL — MODAL NOVA TRANSACAO

**Acionador:** Botao "+ Nova Transacao" no header

**Estrutura visual (modal central):**

```
┌─ Nova Transacao ──────────────────────────────────┐
│                                                    │
│  Tipo:  (•) Receita   ( ) Despesa                  │
│                                                    │
│  Nome:            [________________________]        │
│  Valor:           [R$ ________________]             │
│  Data:            [10/06/2026        📅]           │
│  Categoria:       [Alimentacao     ▼]               │
│  Perfil/Conta:    [Nubank          ▼]               │
│  Observacao:     [________________________]        │
│                                                    │
│  ☐ Transacao fixa (repetir todo mes)              │
│                                                    │
│              [Cancelar]  [Salvar Transacao]       │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Campos:**

| Campo | Tipo | Obrigatorio | Detalhes |
|-------|------|-------------|----------|
| Tipo | Radio button | Sim | Receita ou Despesa. Muda cor do modal (verde ou vermelho) |
| Nome | Text input | Sim | Nome da transacao (ex: "Salario", "Mercado") |
| Valor | Number input | Sim | Valor em reais. Formato R$ 0.000,00 |
| Data | Date input | Sim | Default: data de hoje. Calendario picker ao clicar |
| Categoria | Dropdown | Sim | Lista de categorias do usuario. Opcao "+ Criar categoria" no final |
| Perfil/Conta | Dropdown | Sim | Lista de perfis cadastrados |
| Observacao | Textarea | Nao | Campo livre para anotacoes |
| Transacao fixa | Checkbox | Nao | Se marcado, abre campos adicionais (ver abaixo) |

**Campos adicionais quando "Transacao fixa" marcado:**

```
│  ☑ Transacao fixa                                  │
│  Repetir:         [Todo dia ___] [Mensalmente ▼]   │
│  Dia do mes:      [5]                               │
│  Ate:             ( ) Indefinido  (•) Data final   │
│                   [__/__/____]                      │
```

- **Repetir:** Frequencia (mensalmente, quinzenalmente, semanalmente)
- **Dia do mes:** Qual dia do mes a transacao se repete (1-31)
- **Ate:** Se e indefinido ou tem data final

**Comportamento do tipo:**

- Quando "Receita" selecionado: header do modal fica com borda verde, valor aparece com sinal +
- Quando "Despesa" selecionado: header do modal fica com borda vermelha, valor aparece com sinal -

**HTML sugerido:**

```html
<div class="modal-overlay" id="modal-transacao">
  <div class="modal modal-transacao">
    <div class="modal-header">
      <h3 class="modal-title">Nova Transacao</h3>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-body">
      <div class="type-toggle">
        <button class="type-btn type-receita active">Receita</button>
        <button class="type-btn type-despesa">Despesa</button>
      </div>

      <div class="form-group">
        <label>Nome</label>
        <input type="text" class="form-input" placeholder="Ex: Salario, Mercado...">
      </div>

      <div class="form-group">
        <label>Valor</label>
        <div class="input-prefix">
          <span class="prefix">R$</span>
          <input type="text" class="form-input mono" placeholder="0,00">
        </div>
      </div>

      <div class="form-group">
        <label>Data</label>
        <input type="date" class="form-input">
      </div>

      <div class="form-group">
        <label>Categoria</label>
        <select class="form-select">
          <option>Alimentacao</option>
          <option>Moradia</option>
          <option>Transporte</option>
          <!-- opcoes do usuario -->
          <option value="__new__">+ Criar categoria</option>
        </select>
      </div>

      <div class="form-group">
        <label>Perfil/Conta</label>
        <select class="form-select">
          <option>Nubank</option>
          <option>Inter</option>
          <option>Carteira</option>
        </select>
      </div>

      <div class="form-group">
        <label>Observacao</label>
        <textarea class="form-textarea" placeholder="Opcional..."></textarea>
      </div>

      <label class="checkbox-label">
        <input type="checkbox" class="form-checkbox" id="fixa-toggle">
        <span class="checkbox-checkmark"></span>
        <span>Transacao fixa (repetir todo mes)</span>
      </label>

      <div class="fixed-fields hidden" id="fixed-fields">
        <div class="form-row">
          <div class="form-group">
            <label>Repetir</label>
            <select class="form-select">
              <option>Mensalmente</option>
              <option>Quinzenalmente</option>
              <option>Semanalmente</option>
            </select>
          </div>
          <div class="form-group">
            <label>Dia do mes</label>
            <input type="number" class="form-input" min="1" max="31" placeholder="5">
          </div>
        </div>
        <div class="form-group">
          <label>Periodo</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="periodo" checked> Indefinido
            </label>
            <label class="radio-label">
              <input type="radio" name="periodo"> Data final
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-ghost">Cancelar</button>
      <button class="btn-primary" style="--accent: #8b5cf6;">Salvar Transacao</button>
    </div>
  </div>
</div>
```

**Estilos do modal:**

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease;
}

.modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.modal {
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: 16px;
  width: 480px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  transform: translateY(12px) scale(0.97);
  transition: transform 200ms ease;
}

.modal-overlay.open .modal {
  transform: translateY(0) scale(1);
}

.modal-transacao.type-receita {
  border-top: 3px solid var(--success);
}

.modal-transacao.type-despesa {
  border-top: 3px solid var(--danger);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-default);
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-default);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.type-toggle {
  display: flex;
  gap: 8px;
  background: var(--bg-raised);
  border-radius: 8px;
  padding: 4px;
}

.type-btn {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  transition: background 150ms ease, color 150ms ease;
}

.type-btn.type-receita.active {
  background: rgba(34, 197, 94, 0.12);
  color: var(--success);
}

.type-btn.type-despesa.active {
  background: rgba(239, 68, 68, 0.12);
  color: var(--danger);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.form-select,
.form-textarea {
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--text-primary);
  font-size: 14px;
  transition: border-color 150ms ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--accent);
  outline: none;
}

.form-select {
  appearance: none;
  cursor: pointer;
}

.form-textarea {
  min-height: 60px;
  resize: vertical;
}

.input-prefix {
  display: flex;
  align-items: center;
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  overflow: hidden;
}

.input-prefix .prefix {
  padding: 10px 12px;
  color: var(--text-muted);
  font-weight: 500;
  background: var(--bg-hover);
}

.input-prefix .form-input {
  border: none;
  background: transparent;
  flex: 1;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-row .form-group {
  flex: 1;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 12px;
  background: var(--bg-raised);
  border-radius: 8px;
  font-size: 13px;
}

.hidden {
  display: none;
}
```

---

### 3.6 IMPORTACAO CSV/PDF

**Acionador:** Botao "📥 Importar" no header

**Estrutura visual (modal):**

```
┌─ Importar Extrato ────────────────────────┐
│                                            │
│  Perfil de destino:  [Nubank  ▼]           │
│                                            │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐  │
│  │                                      │  │
│  │   📄 Arraste o arquivo aqui         │  │
│  │      ou clique para selecionar      │  │
│  │                                      │  │
│  │   Aceita: CSV, PDF                  │  │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘  │
│                                            │
│  ── OU ──                                 │
│                                            │
│  Cole o conteudo do extrato:               │
│  [                                     ]  │
│  [                                     ]  │
│  [                                     ]  │
│                                            │
│            [Cancelar]  [Importar]          │
└────────────────────────────────────────────┘
```

**Fluxo de importacao:**

1. **Step 1:** Selecionar perfil de destino (qual conta recebe os dados)
2. **Step 2:** Fazer upload do arquivo ou colar texto
3. **Step 3:** Preview — mostra as transacoes detectadas antes de importar
4. **Step 4:** Confirmacao — usuario confirma e salva

**Step 3 — Preview de importacao:**

```
┌─ Preview da Importacao ────────────────────────────┐
│                                                     │
│  12 transacoes encontradas                          │
│                                                     │
│  ☑ 05/06  Salario         +R$ 5.500,00   [Renda] │
│  ☑ 08/06  Mercado          -R$ 350,00     [Alim.] │
│  ☑ 10/06  Aluguel          -R$ 1.200,00   [Morad.]│
│  ☐ 03/06  PIX recebido    +R$ 50,00      [??]    │
│  ☑ 01/06  Spotify          -R$ 22,00      [Lazer] │
│  ...                                                │
│                                                     │
│  Categorias detectadas automaticamente.            │
│  Transactions com [??] precisam categoria manual. │
│                                                     │
│  [Cancelar]  [Importar 11 transacoes]              │
└─────────────────────────────────────────────────────┘
```

- Cada transacao tem checkbox para incluir ou nao na importacao
- O sistema tenta mapear categorias automaticamente (ex: "Mercado" → "Alimentacao")
- Transacoes que nao conseguiu categorizar mostram `[??]` — usuario seleciona manualmente
- O numero no botao "Importar N transacoes" atualiza conforme checkboxes

---

### 3.7 RECEITAS FIXAS & DESPESAS FIXAS

**Posicao:** secao dedicada abaixo do extrato

**Estrutura visual:**

```
┌─ Receitas Fixas ──────────────────────────── [+ Adicionar] ──┐
│                                                                │
│  💰 Salario          Nubank    R$ 5.500,00   Dia 5    [ON ]  │
│  💰 Freelance         Inter     R$ 1.200,00   Dia 15   [ON ]  │
│  💰 Renda Variavel    Nubank    R$ 500,00     Dia 20   [OFF]  │
│                                                                │
├─ Despesas Fixas ──────────────────────────── [+ Adicionar] ──┤
│                                                                │
│  🏠 Aluguel           Nubank    R$ 1.200,00   Dia 10   [ON ]  │
│  📱 Internet          Inter     R$ 150,00     Dia 10   [ON ]  │
│  💡 Energia           Inter     R$ 180,00     Dia 15   [ON ]  │
│  🎧 Spotify           Nubank    R$ 22,00      Dia 1    [ON ]  │
│  🏋️ Academia         Nubank    R$ 90,00       Dia 5    [OFF] │
│                                                                │
│  Total fixas ON: R$ 7.104,00                                  │
│  Total fixas este mes ja pagas: R$ 4.304,00                   │
└────────────────────────────────────────────────────────────────┘
```

**Descricao:**

- Duas listas separadas: Receitas Fixas e Despesas Fixas
- Cada item mostra: icon + nome, perfil, valor, dia do mes, toggle ON/OFF
- **Toggle ON/OFF:** desativar uma fixa faz ela parar de gerar transacoes automaticas nos meses futuros, mas nao apaga o registro
- O rodape mostra o total de fixas ativas e quanto ja foi pago no mes

**HTML sugerido:**

```html
<div class="section-header">
  <h3>Receitas Fixas</h3>
  <button class="btn-ghost">+ Adicionar</button>
</div>
<div class="fixed-list">
  <div class="fixed-item">
    <span class="fixed-emoji">💰</span>
    <span class="fixed-name">Salario</span>
    <span class="fixed-profile">Nubank</span>
    <span class="fixed-amount mono">R$ 5.500,00</span>
    <span class="fixed-day">Dia 5</span>
    <button class="toggle-btn active" title="Ativo"></button>
  </div>
  <!-- mais itens -->
</div>

<div class="section-header">
  <h3>Despesas Fixas</h3>
  <button class="btn-ghost">+ Adicionar</button>
</div>
<div class="fixed-list">
  <!-- itens de despesas fixas -->
</div>

<div class="fixed-summary">
  <span>Total fixas ativas: <strong class="mono">R$ 7.104,00</strong></span>
  <span>Ja pagas este mes: <strong class="mono">R$ 4.304,00</strong></span>
</div>
```

**Estilos:**

```css
.fixed-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 24px;
}

.fixed-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  transition: background 150ms ease;
}

.fixed-item:hover {
  background: var(--bg-base);
}

.fixed-name {
  font-weight: 500;
  flex: 1;
}

.fixed-profile {
  font-size: 11px;
  color: var(--text-muted);
  min-width: 70px;
}

.fixed-amount {
  font-weight: 600;
  min-width: 110px;
  text-align: right;
}

.fixed-day {
  font-size: 12px;
  color: var(--text-muted);
  min-width: 60px;
  text-align: center;
}

.toggle-btn {
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: var(--bg-hover);
  border: 1px solid var(--border-default);
  position: relative;
  transition: background 200ms ease, border-color 200ms ease;
  cursor: pointer;
}

.toggle-btn.active {
  background: var(--accent);
  border-color: var(--accent);
}

.toggle-btn::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--text-primary);
  transition: left 200ms ease;
}

.toggle-btn.active::after {
  left: 20px;
}

.fixed-summary {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--bg-raised);
  border-radius: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.fixed-summary strong {
  color: var(--text-primary);
}
```

**Interacoes:**

| Acao | Resultado |
|------|-----------|
| Toggle ON → OFF | Desativa fixa, para de gerar nos meses seguintes |
| Toggle OFF → ON | Reativa fixa |
| Clicar em item | Abre edicao da fixa |
| "Adicionar" | Abre modal similar ao de transacao, ja com campo fixo preenchido |
| Clicar icone 🗑 (hover) | Remove a fixa (com confirmacao) |

---

### 3.8 INVESTIMENTOS

**Posicao:** secao dedicada abaixo de fixas

**Estrutura visual:**

```
┌─ Investimentos ──────────────────────────── [+ Adicionar] ──┐
│                                                                │
│  ┌─ CDB Banco Inter ──────────────────────────────────────┐  │
│  │  Tipo: CDB              Perfil: Inter                  │  │
│  │  Valor aplicado: R$ 5.000,00                           │  │
│  │  Rendimento acumulado: +R$ 320,00  (6,4%)              │  │
│  │  Data aplicacao: 15/01/2026  Vencimento: 15/01/2028    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ Tesouro Direto ──────────────────────────────────────┐  │
│  │  Tipo: Tesouro IPCA+   Perfil: Nubank                  │  │
│  │  Valor aplicado: R$ 2.000,00                           │  │
│  │  Rendimento acumulado: +R$ 85,00  (4,25%)              │  │
│  │  Data aplicacao: 01/03/2026  Vencimento: 01/03/2029    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  Total investido: R$ 7.000,00                                 │
│  Rendimento total: +R$ 405,00                                 │
└────────────────────────────────────────────────────────────────┘
```

**Campos de cada investimento:**

| Campo | Tipo | Obrigatorio |
|-------|------|-------------|
| Nome | Text | Sim |
| Tipo | Dropdown (CDB, Tesouro, Acoes, FII, Poupanca, Outro) | Sim |
| Perfil/Conta | Dropdown | Sim |
| Valor aplicado | Number | Sim |
| Rendimento acumulado | Number | Nao |
| Data de aplicacao | Date | Sim |
| Data de vencimento | Date | Nao |

**HTML sugerido:**

```html
<div class="section-header">
  <h3>Investimentos</h3>
  <button class="btn-ghost">+ Adicionar</button>
</div>

<div class="investments-grid">
  <div class="investment-card">
    <div class="investment-header">
      <span class="investment-type-badge">CDB</span>
      <span class="investment-profile">Inter</span>
    </div>
    <h4 class="investment-name">CDB Banco Inter</h4>
    <div class="investment-values">
      <div class="investment-row">
        <span class="investment-label">Valor aplicado</span>
        <span class="investment-amount mono">R$ 5.000,00</span>
      </div>
      <div class="investment-row positive">
        <span class="investment-label">Rendimento</span>
        <span class="investment-amount mono">+R$ 320,00 <span class="pct">(6,4%)</span></span>
      </div>
    </div>
    <div class="investment-dates">
      <span>15/01/2026 → 15/01/2028</span>
    </div>
  </div>
  <!-- mais cards -->
</div>

<div class="investments-summary">
  <span>Total investido: <strong class="mono">R$ 7.000,00</strong></span>
  <span>Rendimento total: <strong class="mono positive">+R$ 405,00</strong></span>
</div>
```

**Estilos:**

```css
.investments-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.investment-card {
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 20px;
  transition: border-color 200ms ease;
}

.investment-card:hover {
  border-color: var(--accent);
}

.investment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.investment-type-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(139, 92, 246, 0.12);
  color: var(--accent-bright);
}

.investment-profile {
  font-size: 11px;
  color: var(--text-muted);
}

.investment-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}

.investment-values {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.investment-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.investment-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.investment-amount {
  font-weight: 600;
  font-size: 14px;
}

.investment-row.positive .investment-amount {
  color: var(--success);
}

.pct {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 400;
}

.investment-dates {
  font-size: 11px;
  color: var(--text-muted);
}

.investments-summary {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--bg-raised);
  border-radius: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.positive {
  color: var(--success);
}

@media (max-width: 768px) {
  .investments-grid {
    grid-template-columns: 1fr;
  }
}
```

---

### 3.9 CATEGORIAS PERSONALIZAVEIS

**Posicao:** secao dedicada abaixo de investimentos

**Estrutura visual:**

```
┌─ Categorias ──────────────────────────────── [+ Nova Categoria] ──┐
│                                                                     │
│  🏠 Moradia         Alimentacao  Transporte  Lazer  Saude  Renda  │
│  📊 [grafico pizza mostrando distribuicao por categoria]         │
│                                                                     │
│  ┌─ Gerenciar Categorias ─────────────────────────────────────┐  │
│  │  🏠 Moradia         [Editar] [🗑]  (3 transacoes)          │  │
│  │  🍔 Alimentacao     [Editar] [🗑]  (8 transacoes)          │  │
│  │  ⛽ Transporte      [Editar] [🗑]  (5 transacoes)          │  │
│  │  🎧 Lazer           [Editar] [🗑]  (2 transacoes)          │  │
│  │  💊 Saude           [Editar] [🗑]  (1 transacao)           │  │
│  │  💰 Renda           [Editar] [🗑]  (1 transacao)           │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Descricao:**

- Topo: chips/tags visuais das categorias com cores especificas
- Mini grafico pizza mostrando a distribuicao de gastos do mes por categoria
- Lista gerenciavel: editar nome, cor, icone; excluir (se nao tiver transacoes vinculadas)

**Campos de cada categoria:**

| Campo | Tipo | Detalhes |
|-------|------|----------|
| Nome | Text | Nome da categoria |
| Icone | Emoji picker | Emoji representativo |
| Cor | Color picker | Cor especifica da categoria (para graficos) |
| Tipo | Dropdown | "Receita", "Despesa" ou "Ambas" |

**HTML sugerido:**

```html
<div class="section-header">
  <h3>Categorias</h3>
  <button class="btn-ghost">+ Nova Categoria</button>
</div>

<div class="categories-chips">
  <span class="category-chip" style="--cat-color: #8b5cf6;">🏠 Moradia</span>
  <span class="category-chip" style="--cat-color: #22c55e;">🍔 Alimentacao</span>
  <span class="category-chip" style="--cat-color: #3b82f6;">⛽ Transporte</span>
  <span class="category-chip" style="--cat-color: #f59e0b;">🎧 Lazer</span>
  <span class="category-chip" style="--cat-color: #ec4899;">💊 Saude</span>
  <span class="category-chip" style="--cat-color: #22c55e;">💰 Renda</span>
</div>

<div class="categories-chart">
  <!-- mini grafico pizza aqui -->
</div>

<div class="categories-manage">
  <div class="category-manage-item">
    <span class="category-emoji">🏠</span>
    <span class="category-name">Moradia</span>
    <span class="category-count">3 transacoes</span>
    <button class="btn-ghost btn-sm">Editar</button>
    <button class="btn-ghost btn-sm btn-danger">🗑</button>
  </div>
  <!-- mais categorias -->
</div>
```

**Estilos:**

```css
.categories-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: color-mix(in srgb, var(--cat-color) 12%, transparent);
  color: var(--cat-color);
  border: 1px solid color-mix(in srgb, var(--cat-color) 25%, transparent);
}

.categories-manage {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.category-manage-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  transition: background 150ms ease;
}

.category-manage-item:hover {
  background: var(--bg-base);
}

.category-emoji {
  font-size: 16px;
}

.category-name {
  flex: 1;
  font-weight: 500;
}

.category-count {
  font-size: 12px;
  color: var(--text-muted);
}

.btn-sm {
  padding: 4px 10px;
  font-size: 11px;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.12);
  color: var(--danger);
  border-color: var(--danger);
}
```

---

### 3.10 GRAFICOS & RELATORIOS

**Posicao:** ultima secao do modulo (scroll)

**Estrutura visual:**

```
┌─ Graficos & Relatorios ───────────── [Mensal] [Geral] ──┐
│                                                            │
│  ┌─ Receita vs Despesa ─────┐  ┌─ Por Categoria ───────┐  │
│  │                          │  │                        │  │
│  │   [grafico de barras]    │  │   [grafico pizza]     │  │
│  │                          │  │                        │  │
│  │   Mai: ▮ 5.5k  ▮ 1.2k  │  │   Moradia: 45%        │  │
│  │   Abr: ▮ 4.9k  ▮ 1.5k  │  │   Alimentacao: 22%    │  │
│  │                          │  │   Transporte: 15%     │  │
│  └──────────────────────────┘  │   Lazer: 10%          │  │
│                                  │   Outros: 8%           │  │
│  ┌─ Evolucao Patrimonial ───┐  └──────────────────────────┘  │
│  │                          │                                 │
│  │   [grafico de linha]     │                                 │
│  │                          │                                 │
│  │   Jan  Fev  Mar  Abr  Mai│                                 │
│  │                          │                                 │
│  └──────────────────────────┘                                 │
│                                                            │
│  ┌─ Custos Fixos vs Variaveis ──────────────────────────┐    │
│  │   [grafico de barras empilhadas]                     │    │
│  │   Mostra proporcao de fixos vs variaveis por mes     │    │
│  └───────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

**Descricao:**

- Toggle **[Mensal] / [Geral]**: Mensal mostra dados do mes selecionado, Geral mostra acumulado (ultimos 12 meses ou ano inteiro)
- **Grafico 1: Receita vs Despesa** (barras agrupadas)
  - Eixo X: meses
  - Eixo Y: valores em reais
  - Barras verdes: receitas / Barras vermelhas: despesas
- **Grafico 2: Por Categoria** (pizza/donut)
  - Fatiado por categoria com as cores personalizadas
  - Hover no fatia mostra valor e percentual
- **Grafico 3: Evolucao Patrimonial** (linha)
  - Linha mostrando o saldo ao longo dos meses
  - Area preenchida com gradiente do accent
- **Grafico 4: Custos Fixos vs Variaveis** (barras empilhadas)
  - Cada barra = 1 mes
  - Parte inferior = custos fixos (amarelo)
  - Parte superior = custos variaveis (roxo)

**Nota sobre biblioteca de graficos:**

Para gerar os graficos com JS puro, recomenda-se uma biblioteca leve:
- **Chart.js** (~60KB) — a mais popular, simples, suporta todos os tipos necessarios
- Alternativa: **ApexCharts** — mais moderna e com mais features visuais

**HTML sugerido:**

```html
<div class="section-header">
  <h3>Graficos & Relatorios</h3>
  <div class="chart-toggle">
    <button class="toggle-btn-chart active" data-range="monthly">Mensal</button>
    <button class="toggle-btn-chart" data-range="general">Geral</button>
  </div>
</div>

<div class="charts-grid">
  <div class="chart-card">
    <h4 class="chart-title">Receita vs Despesa</h4>
    <div class="chart-container">
      <canvas id="chart-receita-despesa"></canvas>
    </div>
  </div>

  <div class="chart-card">
    <h4 class="chart-title">Por Categoria</h4>
    <div class="chart-container">
      <canvas id="chart-categorias"></canvas>
    </div>
  </div>

  <div class="chart-card full-width">
    <h4 class="chart-title">Evolucao Patrimonial</h4>
    <div class="chart-container">
      <canvas id="chart-patrimonio"></canvas>
    </div>
  </div>

  <div class="chart-card full-width">
    <h4 class="chart-title">Custos Fixos vs Variaveis</h4>
    <div class="chart-container">
      <canvas id="chart-fixos-variaveis"></canvas>
    </div>
  </div>
</div>
```

**Estilos:**

```css
.chart-toggle {
  display: flex;
  gap: 2px;
  background: var(--bg-raised);
  border-radius: 8px;
  padding: 3px;
}

.toggle-btn-chart {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  transition: background 150ms ease, color 150ms ease;
}

.toggle-btn-chart.active {
  background: var(--accent);
  color: #fff;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.chart-card {
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 24px;
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.chart-container {
  min-height: 200px;
  position: relative;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 4. Fluxos de Interacao (Passo a Passo)

---

### Fluxo 4.1: Adicionar Transacao Manual

```
1. Usuario clica em "+ Nova Transacao"
2. Modal abre com tipo "Receita" selecionado por padrao
3. Usuario preenche: nome, valor, data, categoria, perfil, observacao
4. [Opcional] Marca "Transacao fixa" e define repeticao
5. Usuario clica "Salvar Transacao"
6. Modal fecha com animacao
7. Novo item aparece no extrato (no topo da lista ou na posicao correta por data)
8. Stats row atualiza instantaneamente (receita/despesa/saldo)
9. Graficos atualizam para refletir a nova transacao
```

### Fluxo 4.2: Trocar de Mes

```
1. Usuario clica em ◄ ou ► no seletor de mes
2. Todo o conteudo faz transicao suave (fade rapido ~150ms)
3. Nova data do mes aparece no header
4. Stats row recalcula para o novo mes
5. Extrato carrega transacoes do novo mes
6. Fixas mostram status do novo mes
7. Graficos mensais atualizam
8. Se o mes nao tem dados, mostra estado vazio com ilustracao
```

### Fluxo 4.3: Filtrar por Perfil

```
1. Usuario clica em tab de perfil (ex: "Nubank")
2. Tab muda para estado ativo
3. Stats row mostra saldo/receita/despesa apenas do Nubank
4. Extrato filtra apenas transacoes do Nubank
5. Graficos filtram dados do Nubank
6. Badge no perfil mostra saldo total (hover: mostra descricao)
7. Para voltar a ver tudo: clicar "Todos"
```

### Fluxo 4.4: Importar Extrato CSV/PDF

```
1. Usuario clica em "📥 Importar"
2. Modal de importacao abre
3. Usuario seleciona perfil de destino
4. Usuario faz upload do arquivo CSV/PDF ou cola o conteudo
5. Sistema faz parse do arquivo
6. Preview mostra transacoes detectadas com checkboxes
7. Sistema tenta mapear categorias automaticamente
8. Transacoes com categoria incerta marcadas com [??]
9. Usuario ajusta categorias manualmente conforme necessario
10. Usuario desmarca transacoes que nao quer importar
11. Usuario clica "Importar N transacoes"
12. Transacoes aparecem no extrato
13. Modal fecha
14. Stats e graficos atualizam
```

### Fluxo 4.5: Adicionar Receita/Despesa Fixa

```
1. Usuario clica "+ Adicionar" na secao de Receitas Fixas ou Despesas Fixas
2. Modal abre com tipo pre-definido (receita ou despesa) e campo "fixa" ja marcado
3. Usuario preenche: nome, valor, dia do mes, perfil, categoria, repeticao
4. Usuario clica "Salvar"
5. Item fixo aparece na lista com toggle ON
6. No mes seguinte, a transacao e gerada automaticamente no extrato
```

### Fluxo 4.6: Criar Categoria

```
1. Menu: Categorias → "+ Nova Categoria"
2. Modal abre com campos: nome, icone, cor, tipo
3. Usuario preenche e salva
4. Nova categoria aparece na lista e no dropdown do modal de transacao
```

### Fluxo 4.7: Ver Relatorio Mensal vs Geral

```
1. Usuario scrolla ate a secao de Graficos
2. Por padrao, mostra "Mensal" (dados do mes selecionado)
3. Usuario clica em "Geral"
4. Graficos trocam para visao acumulada (12 meses ou ano)
5. Cada grafico atualiza com dados mais amplos
```

---

## 5. Wireframe Completo — Tela do Modulo Financas

### Desktop (>1024px)

```
┌──┬──────────────────────────────────────────────────────────────────────────┐
│SI│                                                                          │
│DB│  💰 Financas               ◄ Maio 2026 ►         [📥 Importar] [📊 Rel] [★ Nova Transacao]  │
│AR│                                                                          │
│  │  [Todos]  [Nubank]  [Inter]  [Carteira]  [+ Perfil]                    │
│64│                                                                          │
│px│  ┌────────────┬────────────┬────────────┬────────────┐                  │
│  │  │ Saldo Total │ Receitas   │ Despesas   │ C.Fixos    │                  │
│  │  │ R$ 4.230   │ R$ 5.500   │ R$ 1.270   │ R$ 2.450   │                  │
│  │  │ Nub:2.1k   │ ▲+12% abr  │ ▼-5% abr   │ 3 pend.    │                  │
│  │  └────────────┴────────────┴────────────┴────────────┘                  │
│  │                                                                          │
│◉ │  Extrato — Maio 2026                              [Filtros] [Ver todos]│
│  │  ─────────────────────────────────────────────────────────────────────  │
│💰│  🏠 Aluguel      Moradia    Nubank  -R$ 1.200   10/06  🔁               │
│📋│  💰 Salario       Renda      Nubank  +R$ 5.500    05/06  🔁              │
│🎯│  🍔 Mercado       Aliment.   Inter   -R$ 350      08/06                  │
│📅│  ⛽ Combustivel   Transp.    Cart.   -R$ 120      07/06                  │
│📝│  🎧 Spotify       Lazer      Nubank  -R$ 22        01/06  🔁             │
│🔄│  ─────────────────────────────────────────────────────────────────────  │
│⚙ │  [Mostrar mais]                                                         │
│  │                                                                          │
│  │  Receitas Fixas                                    [+ Adicionar]        │
│  │  💰 Salario         Nubank  R$ 5.500   Dia 5    [ON ]                 │
│  │  💰 Freelance       Inter   R$ 1.200   Dia 15   [ON ]                 │
│  │                                                                          │
│  │  Despesas Fixas                                    [+ Adicionar]        │
│  │  🏠 Aluguel         Nubank  R$ 1.200   Dia 10   [ON ]                 │
│  │  📱 Internet        Inter   R$ 150     Dia 10   [ON ]                 │
│  │  💡 Energia         Inter   R$ 180     Dia 15   [ON ]                 │
│  │  🎧 Spotify         Nubank  R$ 22      Dia 1    [ON ]                 │
│  │  Total fixas ativas: R$ 7.104  |  Ja pagas: R$ 4.304                  │
│  │                                                                          │
│  │  Investimentos                                     [+ Adicionar]        │
│  │  ┌─ CDB Banco Inter ───┐  ┌─ Tesouro IPCA+ ─────┐                   │
│  │  │ CDB          Inter  │  │ Tesouro       Nubank │                   │
│  │  │ R$ 5.000  +R$ 320   │  │ R$ 2.000   +R$ 85    │                   │
│  │  │ 6,4%      01/28     │  │ 4,25%      03/29      │                   │
│  │  └─────────────────────┘  └───────────────────────┘                   │
│  │  Total investido: R$ 7.000  |  Rendimento: +R$ 405                    │
│  │                                                                          │
│  │  Categorias                                 [+ Nova Categoria]        │
│  │  🏠 Moradia  🍔 Alimentacao  ⛽ Transporte  🎧 Lazer  💊 Saude  💰 Renda│
│  │                                                                          │
│  │  Graficos & Relatorios                    [Mensal] [Geral]             │
│  │  ┌─ Receita vs Despesa ──┐  ┌─ Por Categoria ─────┐                  │
│  │  │   ▮▮                 │  │      ◉               │                  │
│  │  │   ▮▮ ▮▮              │  │    ╱   ╲             │                  │
│  │  │   ▮▮ ▮▮              │  │   ◉     ◉            │                  │
│  │  └───────────────────────┘  └───────────────────────┘                  │
│  │  ┌─ Evolucao Patrimonial ──────────────────────────┐                  │
│  │  │   ╱‾‾‾‾‾╲                                         │                  │
│  │  │  ╱        ‾‾‾‾╲                                   │                  │
│  │  │ ╱               ‾‾╲                              │                  │
│  │  └──────────────────────────────────────────────────┘                  │
│  │                                                                          │
└──┴──────────────────────────────────────────────────────────────────────────┘
```

### Mobile (<768px)

```
┌──────────────────────────────┐
│  💰 Financas                  │
│  ◄ Maio 2026 ►               │
│                               │
│  [Todos] [Nubank] [Inter] [+]│
│                               │
│  ┌─ Saldo Total ────────────┐ │
│  │  R$ 4.230,00             │ │
│  └──────────────────────────┘ │
│  ┌─ Receitas ──┬─ Despesas ──┐ │
│  │  R$ 5.500   │  R$ 1.270  │ │
│  └─────────────┴─────────────┘ │
│  ┌─ Custos Fixos ────────────┐ │
│  │  R$ 2.450  | 3 pendentes │ │
│  └──────────────────────────┘ │
│                               │
│  Extrato             [Filtros]│
│  ────────────────────────────│
│  🏠 Aluguel   -R$ 1.200 10/6│
│  💰 Salario   +R$ 5.500 05/6│
│  🍔 Mercado    -R$ 350  08/6│
│  ⛽ Combust.   -R$ 120  07/6│
│  🎧 Spotify     -R$ 22   01/6│
│                               │
│  Receitas Fixas           [+] │
│  💰 Salario  R$5.500  [ON]  │
│                               │
│  Despesas Fixas           [+] │
│  🏠 Aluguel  R$1.200  [ON]  │
│  📱 Internet  R$150    [ON]  │
│                               │
│  Investimentos            [+] │
│  ┌─ CDB Inter ─────────────┐ │
│  │  R$5.000  +R$320 (6,4%)│ │
│  └──────────────────────────┘ │
│                               │
│  Categorias               [+] │
│  🏠  🍔  ⛽  🎧  💊  💰      │
│                               │
│  Graficos [Mensal] [Geral]   │
│  ┌─ Rec vs Desp ───────────┐ │
│  │  ▮▮                     │ │
│  └──────────────────────────┘ │
│                               │
├──────────────────────────────┤
│  🏠   💰   📋   🎯   ⋯      │
│  Home Fin  Task  Meta  Mais  │
└──────────────────────────────┘
```

---

## 6. Estados Especiais

### Estado Vazio (sem transacoes no mes)

```
┌──────────────────────────────┐
│                               │
│        📭                     │
│                               │
│  Nenhuma transacao em maio    │
│                               │
│  [★ Nova Transacao]          │
│  [📥 Importar Extrato]       │
│                               │
└──────────────────────────────┘
```

- Ilustracao central + texto + botoes de acao
- Mostra quando o mes selecionado nao tem nenhuma transacao

### Estado Carregando

- Skeleton loading: retangulos cinza animados no lugar dos dados
- Usado ao trocar de mes ou carregar dados da API

### Estado de Erro

- Card vermelho com mensagem: "Erro ao carregar. [Tentar novamente]"
- Usado quando a API nao responde

---

## 7. Modelo de Dados (Preliminar)

### Entidades do modulo Financas

```
Perfil (Account)
├── id: uuid
├── nome: string
├── cor: string (hex)
├── icone: string (emoji)
├── criado_em: datetime

Categoria
├── id: uuid
├── nome: string
├── icone: string (emoji)
├── cor: string (hex)
├── tipo: enum (receita, despesa, ambas)
├── criado_em: datetime

Transacao
├── id: uuid
├── tipo: enum (receita, despesa)
├── nome: string
├── valor: decimal
├── data: date
├── categoria_id: fk → Categoria
├── perfil_id: fk → Perfil
├── observacao: string (nullable)
├── fixa_id: fk → TransacaoFixa (nullable)
├── criado_em: datetime

TransacaoFixa
├── id: uuid
├── tipo: enum (receita, despesa)
├── nome: string
├── valor: decimal
├── dia_mes: int (1-31)
├── frequencia: enum (mensal, quinzenal, semanal)
├── categoria_id: fk → Categoria
├── perfil_id: fk → Perfil
├── ativa: boolean
├── data_fim: date (nullable)
├── criado_em: datetime

Investimento
├── id: uuid
├── nome: string
├── tipo: enum (cdb, tesouro, acoes, fii, poupanca, outro)
├── perfil_id: fk → Perfil
├── valor_aplicado: decimal
├── rendimento_acumulado: decimal
├── data_aplicacao: date
├── data_vencimento: date (nullable)
├── criado_em: datetime
```

### Relacionamentos

```
Perfil 1──N Transacao
Perfil 1──N TransacaoFixa
Perfil 1──N Investimento
Categoria 1──N Transacao
Categoria 1──N TransacaoFixa
TransacaoFixa 1──N Transacao (uma fixa gera N transacoes ao longo dos meses)
```

---

## 8. API Endpoints (Preliminar)

### Perfis

```
GET    /api/perfis              — Listar todos os perfis
POST   /api/perfis              — Criar novo perfil
PUT    /api/perfis/:id          — Editar perfil
DELETE /api/perfis/:id          — Remover perfil
```

### Categorias

```
GET    /api/categorias          — Listar todas as categorias
POST   /api/categorias          — Criar nova categoria
PUT    /api/categorias/:id      — Editar categoria
DELETE /api/categorias/:id      — Remover categoria
```

### Transacoes

```
GET    /api/transacoes?mes=2026-05&perfil=nubank  — Listar transacoes (com filtros)
POST   /api/transacoes          — Criar transacao manual
PUT    /api/transacoes/:id      — Editar transacao
DELETE /api/transacoes/:id      — Remover transacao
```

### Transacoes Fixas

```
GET    /api/fixas               — Listar todas as fixas
POST   /api/fixas               — Criar fixa
PUT    /api/fixas/:id           — Editar fixa (toggle ativa/inativa)
DELETE /api/fixas/:id           — Remover fixa
```

### Investimentos

```
GET    /api/investimentos        — Listar investimentos
POST   /api/investimentos       — Criar investimento
PUT    /api/investimentos/:id   — Editar investimento
DELETE /api/investimentos/:id   — Remover investimento
```

### Importacao

```
POST   /api/importar/csv        — Upload e parse de CSV
POST   /api/importar/pdf        — Upload e parse de PDF
POST   /api/importar/confirmar  — Confirmar importacao apos preview
```

### Relatorios

```
GET    /api/relatorios/mensal?mes=2026-05     — Dados do mes para graficos
GET    /api/relatorios/geral?ano=2026          — Dados do ano para graficos
GET    /api/relatorios/stats?mes=2026-05       — Stats do mes (saldo, receita, despesa, fixos)
```

---

## 9. Resumo das Decisoes do Modulo Financas

| # | Funcionalidade | Decisao |
|---|----------------|---------|
| F1 | Perfis/Contas | Criar perfis personalizados (ex: Nubank, Inter). Visa consolidada "Todos" |
| F2 | Categorias | Personalizaveis, com nome, icone, cor, tipo |
| F3 | Periodo mensal | Navegacao por mes, cada mes independente |
| F4 | Entrada manual | Formulario com tipo, nome, valor, data, categoria, perfil, observacao |
| F5 | Importacao | CSV/PDF com preview e mapeamento de categorias |
| F6 | Receitas fixas | Recorrencia automatica, toggle on/off |
| F7 | Despesas fixas | Recorrencia automatica, toggle on/off, secao dedicada |
| F8 | Custos fixos | Card dedicado nos stats, secao com total e pendentes |
| F9 | Salario fixo | Parte de receitas fixas, repete automaticamente |
| F10 | Investimentos | Secao dedicada com campos de tipo, valor, rendimento, datas |
| F11 | Graficos mensais | Receita vs despesa (barras), por categoria (pizza) |
| F12 | Graficos gerais | Evolucao patrimonial (linha), fixos vs variaveis (empilhado) |
| F13 | Extrato | Lista com filtros, ordenacao por data, indicador de recorrente |
| F14 | Troca de mes | Atualiza toda a pagina (stats, extrato, graficos) |
| F15 | Filtro por perfil | Filtra toda a pagina para o perfil selecionado |
