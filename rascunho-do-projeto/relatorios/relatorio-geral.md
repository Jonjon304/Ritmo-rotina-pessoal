# MyFinance — Relatório Geral do Projeto

> Documento central com tudo que foi definido até agora. Único ponto de referência para qualquer agente ou pessoa que precise entender o projeto.

**Última atualização:** 2026-06-12
**Fase:** Planejamento (todas as funcionalidades definidas, nenhum código implementado)

---

## 1. Visão Geral

**MyFinance** é um life manager pessoal — uma aplicação web que centraliza finanças, tarefas, metas, cronograma, notas, hábitos e projetos em uma única interface dark elegante.

- **Público:** Uso pessoal exclusivo (1 usuário)
- **Plataforma:** Web responsiva (mobile + desktop)
- **Complexidade:** Simples e funcional
- **Custo:** $0/mês

---

## 2. Stack Técnica

| Camada | Tecnologia | Observação |
|--------|-----------|------------|
| Front-end | HTML/CSS/JS puro + ES Modules | Sem frameworks, simplicidade e controle direto |
| Gráficos | Chart.js (~60KB) | Biblioteca leve para barras, pizza, linha, empilhado |
| Editor notas | Markdown + marked.js (~15KB) | Preview estilo Notion, sem WYSIWYG |
| Back-end | Node.js + Express | Mesma linguagem do front |
| Banco | SQLite | 1 usuário, zero config, sem servidor |
| Segurança | helmet + bcrypt + rate-limit + cors | |
| Deploy front | GitHub Pages (grátis) | Serve estáticos |
| Deploy back | Render Free Tier (grátis) | Cold start ~30s após 15min inatividade |
| Mitigação cold start | UptimeRobot ping a cada 14min | Mantém a API acordada |

**Nota:** Vercel/Netlify/Deno Deploy não funcionam com SQLite (sem disco persistente em funções serverless).

---

## 3. Layout Aprovado: Spotlight-Sidebar-Transição

Duas fases visuais com transição animada (~400ms):

### Hub (Spotlight)
- Tela cheia, saudacao contextual
- 7 cards em grid (desktop) ou vertical (mobile)
- Zero sidebar
- Cada card = um módulo, clicável

### Dentro do Módulo
- Sidebar 64px surge pela esquerda com animação
- Ícones: 44x44px, border-radius 10px
- Botão ativo: box-shadow inset 3px 0 0 var(--accent)
- Botão Home (◉) no topo da sidebar → volta ao hub

### Volta ao Hub
- Clicar Home: sidebar sai, hub fade-in

---

## 4. Tokens de Design (Dark Elegante)

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
  --success: #22c55e (verde - positivo/receita)
  --danger: #ef4444 (vermelho - negativo/despesa)
  --warning: #f59e0b (amarelo - alerta)

Tipografia:
  Principal: Inter (400, 500, 600, 700)
  Monospace: JetBrains Mono (500) — valores financeiros
```

### Cores dos Módulos

| Módulo | Cor | Hex |
|--------|-----|-----|
| Finanças | Roxo | #8b5cf6 |
| Tarefas | Azul | #3b82f6 |
| Metas | Amarelo | #f59e0b |
| Cronograma | Verde | #10b981 |
| Notas | Rosa | #ec4899 |
| Hábitos | Ciano | #06b6d4 |
| Projetos | Laranja | #f97316 |

---

## 5. Módulos — Funcionalidades Detalhadas

---

### 5.1 Finanças (#8b5cf6) — ESPECIFICAÇÃO COMPLETA

> Arquivo detalhado: `testando-funcionalidades-financas.md`

**Seções (ordem de renderização):**

1. **Header** — Ícone + título + seletor de mês (◄ ►) + botões ação (Nova Transação, Importar, Relatórios)
2. **Tabs de Perfil/Conta** — "Todos" (consolidado) + perfis personalizados (Nubank, Inter, etc.) + "+ Perfil"
3. **Stats Row** — 4 cards: Saldo Total, Receitas (mês), Despesas (mês), Custos Fixos
4. **Extrato do Mês** — Lista de transações com filtros (tipo, categoria, perfil, fixas, busca)
5. **Receitas Fixas & Despesas Fixas** — Toggle ON/OFF, dia do mês, total ativas, já pagas
6. **Investimentos** — Cards com tipo (CDB, Tesouro, Ações, FII, Poupança, Outro), valor aplicado, rendimento, datas
7. **Categorias** — Chips visuais + mini gráfico pizza + gerenciamento (criar/editar/excluir)
8. **Gráficos & Relatórios** — Toggle Mensal/Geral + 4 gráficos (barras, pizza, linha, empilhado)

**Decisões F1-F15:**

| # | Funcionalidade | Decisão |
|---|---------------|---------|
| F1 | Perfis/Contas | Criar perfis personalizados. Visão consolidada "Todos" |
| F2 | Categorias | Personalizáveis com nome, ícone, cor, tipo |
| F3 | Período mensal | Navegação por mês, cada mês independente |
| F4 | Entrada manual | Formulário com tipo, nome, valor, data, categoria, perfil, observação |
| F5 | Importação | CSV/PDF com preview e mapeamento automático de categorias |
| F6 | Receitas fixas | Recorrência automática, toggle on/off |
| F7 | Despesas fixas | Recorrência automática, toggle on/off, seção dedicada |
| F8 | Custos fixos | Card dedicado nos stats, seção com total e pendentes |
| F9 | Salário fixo | Parte de receitas fixas, repete automaticamente |
| F10 | Investimentos | Seção dedicada com tipo, valor, rendimento, datas |
| F11 | Gráficos mensais | Receita vs despesa (barras), por categoria (pizza) |
| F12 | Gráficos gerais | Evolução patrimonial (linha), fixos vs variáveis (empilhado) |
| F13 | Extrato | Lista com filtros, ordenação por data, indicador de recorrente |
| F14 | Troca de mês | Atualiza toda a página (stats, extrato, gráficos) |
| F15 | Filtro por perfil | Filtra toda a página para o perfil selecionado |

**Modelo de dados:**

```
Perfil:       id, nome, cor, icone, criado_em
Categoria:    id, nome, icone, cor, tipo, criado_em
Transacao:    id, tipo, nome, valor, data, categoria_id, perfil_id, observacao, fixa_id, criado_em
TransacaoFixa: id, tipo, nome, valor, dia_mes, frequencia, categoria_id, perfil_id, ativa, data_fim, criado_em
Investimento: id, nome, tipo, perfil_id, valor_aplicado, rendimento_acumulado, data_aplicacao, data_vencimento, criado_em

Relacionamentos:
  Perfil 1──N Transacao
  Perfil 1──N TransacaoFixa
  Perfil 1──N Investimento
  Categoria 1──N Transacao
  Categoria 1──N TransacaoFixa
  TransacaoFixa 1──N Transacao
```

**API Endpoints:**

```
Perfis:       GET/POST /api/perfis | PUT/DELETE /api/perfis/:id
Categorias:   GET/POST /api/categorias | PUT/DELETE /api/categorias/:id
Transações:   GET/POST /api/transacoes (filtros: mes, perfil) | PUT/DELETE /api/transacoes/:id
Fixas:        GET/POST /api/fixas | PUT/DELETE /api/fixas/:id
Investimentos: GET/POST /api/investimentos | PUT/DELETE /api/investimentos/:id
Importação:   POST /api/importar/csv | POST /api/importar/pdf | POST /api/importar/confirmar
Relatórios:   GET /api/relatorios/mensal | GET /api/relatorios/geral | GET /api/relatorios/stats
```

---

### 5.2 Tarefas (#3b82f6)

| # | Decisão | Escolha |
|---|---------|---------|
| T1 | Organização | Lista simples (projetos ficaram no módulo Projetos) |
| T2 | Visão | Kanban (A Fazer / Em Progresso / Concluído) + Lista (toggle) |
| T3 | Drag & drop | Sim, nativo HTML5 entre colunas |
| T4 | Prioridade | 3 níveis: Alta 🔴, Média 🟡, Baixa ⚪ |
| T5 | Datas | Só data de vencimento |
| T6 | Tags | Personalizáveis com cor (ex: #estudo, #pessoal) |
| T7 | Sub-tarefas | Sim, com checkboxes |
| T8 | Recorrência | Não |

**Kanban — 3 colunas:**
- A Fazer → Em Progresso → Concluído
- Arrastar entre colunas muda o status automaticamente
- Ao mover para Concluído, registra data de conclusão

**Card de tarefa mostra:**
- Prioridade (bolinha colorida)
- Nome
- Tags (chips coloridos)
- Vencimento (vermelho se atrasado)
- Sub-tarefas colapsáveis (▸ Sub 1, ▸ Sub 2)
- Projeto vínculado (badge)

**Visão Lista:**
- Tabela com: checkbox, nome, projeto, prioridade, tags, vencimento
- Filtros: projeto, tag, prioridade, status
- Ordenação: vencimento, prioridade, nome

**Modelo de dados:**

```
Projeto:  id, nome, cor, descricao, criado_em (compartilhado com módulo Projetos)
Tag:      id, nome, cor
Tarefa:   id, nome, descricao, projeto_id (FK nullable), prioridade, status, vencimento, concluido_em, ordem, criado_em
SubTarefa: id, tarefa_id, nome, concluida, ordem
TarefaTag: tarefa_id, tag_id (N:N)
```

**API Endpoints:**

```
Tarefas:    GET/POST /api/tarefas (filtros) | PUT/DELETE /api/tarefas/:id | PATCH /api/tarefas/:id/status
Tags:       GET/POST /api/tags | PUT/DELETE /api/tags/:id
Sub-tarefas: GET/POST /api/tarefas/:id/subtarefas | PATCH/DELETE /api/tarefas/:id/subtarefas/:sid
```

---

### 5.3 Metas (#f59e0b)

| # | Decisão | Escolha |
|---|---------|---------|
| M1 | Tipo | Quantitativas com barra de progresso |
| M2 | Prazo | Opcional (sem obrigatoriedade) |
| M3 | Milestones | Não — progresso direto (atual/meta) |
| M4 | Vínculo Finanças | Não, módulos independentes, atualização manual |

**Cada meta:**
- Nome + descrição
- Valor atual / Valor alvo → barra de progresso automática
- Data alvo (opcional)
- Pode ser vinculada a um projeto (FK projeto_id)
- Visual: card grande com barra de progresso + percentual

**Modelo de dados:**

```
Meta: id, nome, descricao, valor_atual, valor_alvo, data_alvo (nullable), projeto_id (FK nullable), criado_em
```

**API Endpoints:**

```
GET/POST /api/metas | PUT/DELETE /api/metas/:id
PATCH   /api/metas/:id/progresso  — atualizar valor_atual
```

---

### 5.4 Cronograma (#10b981)

| # | Decisão | Escolha |
|---|---------|---------|
| C1 | Visão | Mês (calendário) + Dia (agenda por hora) — toggle |
| C2 | Eventos com horário | Início + fim (ex: 14:00–16:00 Reunião) |
| C3 | Eventos dia inteiro | Sem horário (ex: aniversário, feriado) |
| C4 | Lembretes | Sem horário, só no dia (ex: "ligar dentista") |
| C5 | Recorrência | Sim (semanal, quinzenal, mensal, anual) |
| C6 | Integração Tarefas | Automático — tarefas com vencimento aparecem no dia |
| C7 | Integração Hábitos | Badge resumido no dia (ex: "3/5 concluídos") |

**Visão Mês:**
- Grid calendário com dias
- Cada dia mostra: eventos + tarefas do dia + badge de hábitos
- Clicar no dia → abre visão Dia

**Visão Dia:**
- Timeline vertical com horas (00:00–23:00)
- Eventos posicionados por horário
- Tarefas do dia listadas
- Hábitos do dia com checkboxes

**Integrações automáticas:**
- Tarefas com vencimento = data X → aparecem no dia X do calendário
- Hábitos → badge no canto do dia (verde = todos, amarelo = parcial, vazio = nenhum)

**Modelo de dados:**

```
Evento: id, nome, descricao, tipo (com_horario, dia_inteiro, lembrete), data_inicio, data_fim, horario_inicio (nullable), horario_fim (nullable), recorrencia_tipo (nullable), recorrencia_fim (nullable), criado_em
```

**API Endpoints:**

```
GET/POST /api/eventos (filtros: mes, dia) | PUT/DELETE /api/eventos/:id
GET      /api/cronograma/dia/:data  — eventos + tarefas + hábitos consolidados do dia
```

---

### 5.5 Notas (#ec4899)

| # | Decisão | Escolha |
|---|---------|---------|
| N1 | Formato | Markdown com editor + preview (estilo Notion) |
| N2 | Organização | Pastas/cadernos |
| N3 | Tamanho | Flexível (curta ou longa) |
| N4 | Biblioteca | marked.js (~15KB) para renderizar preview |

**Estrutura:**
- Sidebar com lista de cadernos → cada caderno expande notas
- Área principal: editor de texto (textarea) + botão toggle Preview
- Preview renderiza Markdown em HTML estilizado

**Cadernos:**
- Criar, renomear, excluir
- Ordenar notas por data, título
- Cada nota pode ser vinculada a um projeto (FK projeto_id)

**Modelo de dados:**

```
Caderno: id, nome, cor, criado_em
Nota:    id, titulo, conteudo (markdown), caderno_id, projeto_id (FK nullable), criado_em, atualizado_em
```

**API Endpoints:**

```
Cadernos: GET/POST /api/cadernos | PUT/DELETE /api/cadernos/:id
Notas:    GET/POST /api/notas (filtros: caderno, projeto) | PUT/DELETE /api/notas/:id
```

---

### 5.6 Hábitos (#06b6d4)

| # | Decisão | Escolha |
|---|---------|---------|
| H1 | Tipo | Diários (checkbox por dia) |
| H2 | Streak | Sim — contagem de dias seguidos |
| H3 | Visão | Mapa de calor anual + lista detalhada (toggle) |
| H4 | Métrica | Binário (check/uncheck, sem valor numérico) |

**Mapa de calor:**
- Grade tipo GitHub Contributions (365 dias)
- Cada dia = quadradinho colorido (intensidade por % de hábitos cumpridos)
- Verde escuro = todos, verde claro = parcial, cinza = nenhum

**Lista detalhada:**
- Cada hábito com nome + streak atual + maior streak + taxa de cumprimento
- Checkboxes inline para o dia atual
- Historial por semana/mês

**Modelo de dados:**

```
Habito:        id, nome, criado_em
HabitoCheck:   id, habito_id, data, checked
```

**API Endpoints:**

```
GET/POST /api/habitos | PUT/DELETE /api/habitos/:id
GET      /api/habitos/checks?mes=2026-06  — todos os checks do mês
POST/DELETE /api/habitos/:id/check  — marcar/desmarcar dia
GET      /api/habitos/:id/stats  — streak, melhor streak, taxa
```

---

### 5.7 Projetos (#f97316) — NOVO

| # | Decisão | Escolha |
|---|---------|---------|
| P1 | Posição no hub | 7º módulo independente |
| P2 | Estrutura interna | Abas: Visão Geral, Tarefas, Notas, Arquivos, Metas |
| P3 | Arquivos | Links externos (sem upload) — Google Drive, etc |
| P4 | Origem | Absorveu a funcionalidade de "projetos" que estava em Tarefas |

**Visão Geral de um projeto:**
- Nome + descrição do projeto
- Status: Em andamento, Pausado, Concluído
- Progresso geral (baseado nas tarefasvinculadas)
- Próximos passos / pendências

**Abas internas:**
- **Tarefas:** Mesmo componente do módulo Tarefas, filtrado por projeto
- **Notas:** Mesmo componente do módulo Notas, filtrado por projeto
- **Arquivos:** Lista de links externos (nome + URL + tipo)
- **Metas:** Mesmo componente do módulo Metas, filtrado por projeto

**Modelo de dados:**

```
Projeto:     id, nome, cor, descricao, status, criado_em
ProjetoLink: id, projeto_id, nome, url, tipo, criado_em
```

Tarefas, Notas e Metas já possuem `projeto_id` (FK nullable) para vinculação.

**API Endpoints:**

```
GET/POST /api/projetos | PUT/DELETE /api/projetos/:id
GET      /api/projetos/:id/tarefas   — tarefas vinculadas
GET      /api/projetos/:id/notas     — notas vinculadas
GET      /api/projetos/:id/metas     — metas vinculadas
GET/POST /api/projetos/:id/links     — links externos
DELETE   /api/projetos/:id/links/:lid
```

---

## 6. Integrações entre Módulos

| Integração | Automática? | Dificuldade | Detalhe |
|---|---|---|---|
| Cronograma ← Tarefas | Sim | Baixa | Tarefas com vencimento aparecem no dia do calendário |
| Cronograma ← Hábitos | Sim | Baixa | Badge resumido no dia ("3/5 concluídos") |
| Projetos ← Tarefas | Sim | Baixa | FK projeto_id, reutiliza componente |
| Projetos ← Notas | Sim | Baixa | FK projeto_id, reutiliza componente |
| Projetos ← Metas | Sim | Baixa | FK projeto_id, reutiliza componente |
| Projetos ← Links | Sim | Baixa | Tabela projeto_links |

**Integrações rejeitadas:**
- Finanças ↔ Cronograma: não (Finanças já tem navegação temporal própria)
- Hábitos ↔ Tarefas: não (naturezas diferentes)
- Notas soltas ↔ Projetos: **pendente** (revisar depois)

---

## 7. Análise de Complexidade da Integração

**Resposta:** A integração adiciona ~15-20% de esforço, mas o ganho compensa.

| Integração | Esforço extra | Risco |
|---|---|---|
| Cronograma ← Tarefas | ~4-6h | Zero (só leitura) |
| Cronograma ← Hábitos | ~3-4h | Zero (só leitura) |
| Projetos ← Tarefas/Notas/Metas/Links | ~8-12h | Baixo (reutilizar componentes via ES Modules) |

**Atenção:**
1. Reutilização de componentes front — card de tarefa em Tarefas e em Projetos deve ser o mesmo componente importado
2. Navegação cruzada — clicar em tarefa dentro de Projetos: ficar em Projetos ou navegar para Tarefas? (a definir)
3. Consistência — editar tarefa em Projetos reflete em Tarefas automaticamente (mesmo registro no banco)

---

## 8. Estimativa de Esforço Total

| Módulo | Complexidade | Horas |
|--------|-------------|-------|
| Finanças | Alta | 60-80h |
| Tarefas | Média | 30-40h |
| Metas | Baixa | 12-16h |
| Cronograma | Média | 30-40h |
| Notas | Baixa-Média | 20-28h |
| Hábitos | Baixa-Média | 18-24h |
| Projetos | Média | 20-28h |
| Hub + Sidebar + Auth | Média | 20-28h |
| Back-end base | Média | 20-28h |
| Integrações | Baixa | 15-20h |
| Deploy + CI | Baixa | 6-8h |
| **TOTAL** | | **256-347h (~6-9 semanas a 40h/sem)** |

---

## 9. Riscos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| ~~Editor WYSIWYG em JS puro~~ | ~~Alto~~ | **Resolvido: trocado por Markdown + preview** |
| Drag & drop Kanban em JS puro | Médio | Usar API Drag nativa HTML5 (`dragstart/dragover/drop`) |
| Mapa de calor em JS puro | Baixo | Grid de divs com cores, implementação direta |
| Calendário mensal visual | Médio | Iterar dias do mês, sem lib |
| Importação CSV/PDF | Médio | CSV primeiro (fácil), PDF como fase 2 (lib `pdf-parse`) |
| Cold start Render | Baixo | UptimeRobot ping a cada 14min |
| Reutilização de componentes entre Projetos e outros módulos | Médio | ES Modules com imports compartilhados |

---

## 10. Pontos Pendentes de Decisão

| # | Ponto | Criticidade | Quando resolver |
|---|-------|------------|----------------|
| 1 | Estrutura de pastas do projeto (frontend/ + backend/) | **Alta** | Antes de implementar |
| 2 | Autenticação — como funciona? JWT? Sessão? Fluxo de login? | **Alta** | Antes de implementar |
| 3 | Navegação cruzada em Projetos — clicar em tarefa: fica ou navega? | Média | Ao implementar Projetos |
| 4 | Notas soltas vs Notas dentro de Projetos | Média | Ao implementar Notas |
| 5 | Hub cards — o que cada card mostra? (saldo, contagem, streak?) | Média | Ao implementar Hub |
| 6 | Layout mobile dos demais módulos (só Finanças foi rascunhado) | Média | Ao implementar cada módulo |
| 7 | Configurações (botão ⚙ da sidebar) — tema? perfil? exportar? | Baixa | Ao implementar sidebar |

---

## 11. Ordem de Implementação Sugerida

| Fase | O quê | Por quê |
|------|-------|---------|
| 1 | Back-end base + Auth + estrutura de pastas | Fundação para tudo |
| 2 | Hub + Sidebar + transições | Shell visual do app |
| 3 | Finanças | O mais complexo — resolve desafios logo |
| 4 | Tarefas | Segundo mais complexo, Kanban + drag&drop |
| 5 | Cronograma | Primeiras integrações (← Tarefas, ← Hábitos) |
| 6 | Hábitos | Integra com Cronograma (já implementado) |
| 7 | Metas | O mais simples, rápido |
| 8 | Notas | Markdown com preview |
| 9 | Projetos | Último — agrega os outros que já estarão prontos |
| 10 | Deploy + CI | Último passo |

---

## 12. Arquivos do Projeto

### Protótipo
- `rascunho-do-projeto/prototipo/index.html` — HTML completo com hub + 7 módulos
- `rascunho-do-projeto/prototipo/style.css` — Estilização dark elegante
- `rascunho-do-projeto/prototipo/app.js` — Interação hub ↔ módulo + transições

### Especificações
- `rascunho-do-projeto/testando-funcionalidades-financas.md` — Especificação completa do módulo Finanças (1964 linhas)
- `rascunho-do-projeto/relatorios/relatorio-geral.md` — Este documento

### Layouts (iterações da reunião 1)
- `rascunho-do-projeto/layouts-reuniao-1/layout-a-hub-grid.md`
- `rascunho-do-projeto/layouts-reuniao-1/layout-b-hub-sidebar.md`
- `rascunho-do-projeto/layouts-reuniao-1/layout-c-hub-spotlight.md`
- `rascunho-do-projeto/layouts-reuniao-1/layout-d1-spotlight-sidebar-generoso.md`
- `rascunho-do-projeto/layouts-reuniao-1/layout-d2-spotlight-sidebar-compacto.md`
- `rascunho-do-projeto/layouts-reuniao-1/layout-d3-spotlight-sidebar-expansivel.md`
- `rascunho-do-projeto/layouts-reuniao-1/layout-final-spotlight-sidebar-transicao.md`
- `rascunho-do-projeto/layouts-reuniao-1/modulos-detalhamento.md`
- `rascunho-do-projeto/layouts-reuniao-1/referencia-visual-tokens.md`

### Memórias
- `memorias/estado.md` — Estado atual do projeto
- `memorias/log.md` — Log dos últimos eventos
- `memorias/reunioes/reuniao-1-2026-06-11.md` — Ata da reunião 1

---

## 13. Histórico de Reuniões

| # | Data | Tema | Decisões |
|---|------|------|----------|
| 1 | 2026-06-11 | Brainstorming conceito + layout | 10 decisões (propsito, público, plataforma, complexidade, módulos, visual, auth, layout final) |
| 2 | 2026-06-12 | Stack + funcionalidades dos 7 módulos + integrações | Stack completa, 7 módulos detalhados, integrações definidas, Projetos adicionado como 7º módulo |
