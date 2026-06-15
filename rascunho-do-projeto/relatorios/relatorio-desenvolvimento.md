# MyFinance — Relatório Completo de Desenvolvimento

> Documento definitivo com TUDO que um desenvolvedor precisa saber para implementar o MyFinance do zero.
> Inclui: visão geral, stack, design tokens, estrutura de pastas, modelo de dados completo, contrato de APIs, funcionalidades de todos os módulos, integrações, layout, configurações, ordem de implementação e riscos.

**Última atualização:** 2026-06-15
**Fase:** Implementação (planejamento concluído)

---

## 1. Visão Geral

**MyFinance** é um life manager pessoal — aplicação web que centraliza finanças, tarefas, metas, cronograma, notas, hábitos e projetos em uma única interface dark elegante.

| Atributo | Valor |
|----------|-------|
| Público | Uso pessoal exclusivo (1 usuário) |
| Plataforma | Web responsiva (mobile + desktop) |
| Complexidade | Simples e funcional |
| Custo | $0/mês |
| Conceito | Hub spotlight com 7 cards → sidebar surge ao entrar no módulo |

---

## 2. Stack Técnica

| Camada | Tecnologia | Observação |
|--------|-----------|------------|
| Front-end | HTML/CSS/JS puro + ES Modules | Sem frameworks |
| Gráficos | Chart.js (~60KB) | Barras, pizza, linha, empilhado |
| Editor notas | marked.js (~15KB) | Markdown + preview estilo Notion |
| Drag & drop | HTML5 Drag API nativo | Kanban entre colunas |
| Back-end | Node.js + Express | Mesma linguagem do front |
| Banco | SQLite | 1 usuário, zero config, arquivo local |
| Sessão | express-session + connect-sqlite3 | Salva no SQLite, resiliente a restarts |
| Segurança | helmet + bcrypt + rate-limit + cors | |
| Deploy front | GitHub Pages (grátis) | Serve estáticos |
| Deploy back | Render Free Tier (grátis) | Cold start ~30s após 15min inatividade |
| Mitigação cold start | UptimeRobot ping a cada 14min | Mantém API acordada |

**Nota:** Vercel/Netlify/Deno Deploy não funcionam com SQLite (sem disco persistente em serverless).

### Dependências Back-end

```
express
better-sqlite3
express-session
connect-sqlite3
bcrypt
helmet
cors
express-rate-limit
multer (upload CSV/PDF)
pdf-parse (importação PDF — fase 2)
csv-parse (importação CSV)
```

### Dependências Front-end (via CDN ou local)

```
chart.js     — ~60KB (gráficos)
marked.js    — ~15KB (markdown preview)
```

---

## 3. Tokens de Design (Dark Elegante)

### Cores de Fundo

```css
--bg-deepest: #0a0a0a
--bg-deep: #0f0f0f
--bg-base: #1a1a1a
--bg-raised: #222222
--bg-hover: #2a2a2a
```

### Bordas

```css
--border-subtle: #1e1e1e
--border-default: #2a2a2a
```

### Texto

```css
--text-primary: #f5f5f5
--text-secondary: #a3a3a3
--text-muted: #525252
```

### Estados

```css
--success: #22c55e  /* verde — positivo/receita */
--danger: #ef4444   /* vermelho — negativo/despesa */
--warning: #f59e0b  /* amarelo — alerta */
```

### Tipografia

```
Principal:  Inter (400, 500, 600, 700)
Monospace:  JetBrains Mono (500) — valores financeiros
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

## 4. Layout Aprovado: Spotlight-Sidebar-Transição

### Hub (Spotlight)
- Tela cheia, saudação contextual
- 7 cards em grid (desktop: 4 colunas, mobile: vertical)
- Zero sidebar
- Cada card = um módulo, clicável

### Dentro do Módulo
- Sidebar 64px surge pela esquerda com animação ~400ms
- Ícones: 44x44px, border-radius 10px
- Botão ativo: box-shadow inset 3px 0 0 var(--accent)
- Botão Home (◉) no topo da sidebar → volta ao hub

### Hub Cards — Conteúdo

| Módulo | Card mostra |
|--------|------------|
| Finanças | Saldo do mês atual + último lançamento |
| Tarefas | Total pendentes + próximas 3 com vencimento próximo |
| Metas | Top 3 metas com maior progresso |
| Cronograma | Próximos eventos de hoje/amanhã |
| Notas | Últimas 3 notas editadas |
| Hábitos | Streak atual + quantos hábitos feitos hoje |
| Projetos | Projetos ativos (em andamento) |

### Layout Mobile

| Módulo | Comportamento mobile |
|--------|---------------------|
| Geral | Sidebar some, header fixo com botão voltar Hub, conteúdo full-screen |
| Finanças | Abas deslizáveis (resumo, extrato, fixas, invest.) + lista |
| Tarefas | Alternância lista/Kanban — Kanban com swipe horizontal |
| Metas | Lista vertical com barra de progresso |
| Cronograma | Versão dia como padrão + swipe para mudar dia |
| Notas | Lista de notas → toque abre editor em tela cheia |
| Hábitos | Checklist simples + mapa de calor compacto |
| Projetos | Abas empilhadas verticalmente (scroll) |

---

## 5. Estrutura de Pastas Detalhada

### Front-end

```
frontend/
├── index.html                  ← Ponto de entrada (hub)
├── app.js                      ← Router SPA, carrega módulos dinamicamente
├── styles/
│   ├── variables.css            ← Tokens de design (cores, fontes, espaçamentos)
│   ├── reset.css                ← Reset/normalize
│   ├── base.css                 ← Estilos globais (body, tipografia, scrollbar)
│   ├── components.css           ← Estilos dos componentes reutilizáveis
│   ├── hub.css                  ← Estilos do hub/spotlight
│   └── sidebar.css              ← Estilos da sidebar
├── components/
│   ├── sidebar/
│   │   ├── sidebar.js
│   │   └── sidebar.css
│   ├── modal/
│   │   ├── modal.js
│   │   └── modal.css
│   ├── card/
│   │   ├── card.js
│   │   └── card.css
│   ├── header/
│   │   ├── header.js
│   │   └── header.css
│   ├── toast/
│   │   ├── toast.js
│   │   └── toast.css
│   └── confirm/
│       ├── confirm.js
│       └── confirm.css
├── modules/
│   ├── financas/
│   │   ├── financas.html
│   │   ├── financas.js
│   │   ├── financas.css
│   │   ├── components/
│   │   │   ├── stats-row.js
│   │   │   ├── extrato-lista.js
│   │   │   ├── transacao-modal.js
│   │   │   ├── fixas-section.js
│   │   │   ├── investimentos-section.js
│   │   │   ├── categorias-section.js
│   │   │   ├── graficos-section.js
│   │   │   └── importar-modal.js
│   │   └── financas.css
│   ├── tarefas/
│   │   ├── tarefas.html
│   │   ├── tarefas.js
│   │   ├── tarefas.css
│   │   └── components/
│   │       ├── kanban-board.js
│   │       ├── kanban-column.js
│   │       ├── tarefa-card.js
│   │       ├── lista-view.js
│   │       ├── tarefa-modal.js
│   │       └── tag-chip.js
│   ├── metas/
│   │   ├── metas.html
│   │   ├── metas.js
│   │   ├── metas.css
│   │   └── components/
│   │       ├── meta-card.js
│   │       └── meta-modal.js
│   ├── cronograma/
│   │   ├── cronograma.html
│   │   ├── cronograma.js
│   │   ├── cronograma.css
│   │   └── components/
│   │       ├── mes-view.js
│   │       ├── dia-view.js
│   │       ├── evento-modal.js
│   │       └── dia-cell.js
│   ├── notas/
│   │   ├── notas.html
│   │   ├── notas.js
│   │   ├── notas.css
│   │   └── components/
│   │       ├── caderno-lista.js
│   │       ├── nota-editor.js
│   │       ├── nota-preview.js
│   │       └── nota-modal.js
│   ├── habitos/
│   │   ├── habitos.html
│   │   ├── habitos.js
│   │   ├── habitos.css
│   │   └── components/
│   │       ├── heatmap.js
│   │       ├── habito-lista.js
│   │       └── habito-modal.js
│   ├── projetos/
│   │   ├── projetos.html
│   │   ├── projetos.js
│   │   ├── projetos.css
│   │   └── components/
│   │       ├── projeto-header.js
│   │       ├── projeto-abas.js
│   │       ├── projeto-modal.js
│   │       └── link-item.js
│   └── configuracoes/
│       ├── configuracoes.html
│       ├── configuracoes.js
│       └── configuracoes.css
├── utils/
│   ├── api.js                   ← Wrapper fetch (baseURL, headers, erro handling)
│   ├── formatDate.js            ← Formatação de datas
│   ├── formatCurrency.js        ← Formatação moeda BRL
│   ├── debounce.js              ← Debounce/throttle
│   └── helpers.js               ← Helpers gerais
└── assets/
    ├── icons/                   ← Ícones SVG dos módulos
    └── fonts/                   ← Inter + JetBrains Mono (se local)
```

### Back-end

```
backend/
├── server.js                    ← Entry point (Express, middlewares, rotas, listen)
├── package.json
├── .env                         ← Variáveis de ambiente (SESSION_SECRET, PORT)
├── .env.example                 ← Template do .env
├── db/
│   ├── database.js              ← Conexão SQLite (better-sqlite3)
│   ├── schema.sql               ← CREATE TABLES (todas as tabelas)
│   ├── seeds.sql                ← Dados iniciais (categorias padrão, usuário admin)
│   └── migrations/              ← Scripts de migração incremental
│       └── 001_initial.sql
├── middleware/
│   ├── auth.js                  ← express-session + connect-sqlite3 + validação sessão
│   ├── rateLimit.js             ← express-rate-limit config
│   └── errorHandler.js          ← Middleware de erro centralizado
├── routes/
│   └── index.js                 ← Express Router que importa todas as rotas dos módulos
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js   ← POST /login, POST /logout, GET /me
│   │   ├── auth.service.js      ← Validação de credenciais, bcrypt
│   │   └── auth.model.js        ← Queries na tabela users
│   ├── financas/
│   │   ├── financas.controller.js
│   │   ├── financas.service.js
│   │   └── financas.model.js
│   ├── tarefas/
│   │   ├── tarefas.controller.js
│   │   ├── tarefas.service.js
│   │   └── tarefas.model.js
│   ├── metas/
│   │   ├── metas.controller.js
│   │   ├── metas.service.js
│   │   └── metas.model.js
│   ├── cronograma/
│   │   ├── cronograma.controller.js
│   │   ├── cronograma.service.js
│   │   └── cronograma.model.js
│   ├── notas/
│   │   ├── notas.controller.js
│   │   ├── notas.service.js
│   │   └── notas.model.js
│   ├── habitos/
│   │   ├── habitos.controller.js
│   │   ├── habitos.service.js
│   │   └── habitos.model.js
│   └── projetos/
│       ├── projetos.controller.js
│       ├── projetos.service.js
│       └── projetos.model.js
└── utils/
    ├── validate.js              ← Validação de inputs (tipos, obrigatórios)
    ├── paginate.js              ← Helper de paginação
    └── helpers.js               ← Helpers gerais
```

---

## 6. Autenticação — Detalhamento

### Decisão: Sessão salva no SQLite

| Aspecto | Detalhe |
|---------|---------|
| Biblioteca | express-session + connect-sqlite3 |
| Armazenamento | Tabela `sessions` no SQLite |
| Cookie | `sid` (httpOnly, secure em produção, sameSite: lax) |
| Expiração | 7 dias |
| Login | POST /api/auth/login (email + senha) |
| Logout | POST /api/auth/logout |
| Verificar sessão | GET /api/auth/me |
| Criptografia senha | bcrypt (salt rounds: 10) |
| Usuário único | Seed cria 1 admin, sem registro aberto |

### Fluxo de Login

```
1. Front envia POST /api/auth/login { email, senha }
2. Back busca user por email → compara bcrypt
3. Se OK: cria sessão no SQLite → seta cookie → retorna { user }
4. Se Falha: retorna 401 { erro: "Credenciais inválidas" }
5. Front armazena estado logado no JS (não precisa de token)
6. Cada requisição subsequente envia cookie automaticamente
7. Middleware auth verifica sessão em todas as rotas /api/*
```

### Por que não JWT

- 1 único usuário, não precisa de stateless
- Sessão em memória morre com restart do Render
- Sessão no SQLite sobrevive a restarts
- Mais simples de implementar e manter

---

## 7. Modelo de Dados Completo

### Diagrama de Relacionamentos

```
users ─────────────────────────────────────────────────────
  │
  ├── Perfil (1:N) ── Transacao (1:N)
  │                  ── TransacaoFixa (1:N)
  │                  ── Investimento (1:N)
  │
  ├── Tarefa (1:N) ── SubTarefa (1:N)
  │                 ── TarefaTag (N:N) ── Tag
  │
  ├── Meta (1:N)
  ├── Evento (1:N)
  ├── Caderno (1:N) ── Nota (1:N)
  ├── Habito (1:N) ── HabitoCheck (1:N)
  ├── Projeto (1:N) ── ProjetoLink (1:N)
  │
  └── Configuracao (1:1)

Projeto ──┬── Tarefa (FK projeto_id, nullable)
          ├── Nota (FK projeto_id, nullable)
          └── Meta (FK projeto_id, nullable)

Cronograma ←── Tarefa (por vencimento)
Cronograma ←── HabitoCheck (por data)
```

### Tabelas — Definição Completa

#### users

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  criado_em TEXT DEFAULT (datetime('now'))
);
```

#### sessions (connect-sqlite3 cria automaticamente)

```sql
CREATE TABLE sessions (
  sid TEXT PRIMARY KEY,
  expired INTEGER NOT NULL,
  sess TEXT NOT NULL
);
```

#### configuracoes

```sql
CREATE TABLE configuracoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  moeda TEXT DEFAULT 'BRL',
  fuso_horario TEXT DEFAULT 'America/Sao_Paulo',
  inicio_semana TEXT DEFAULT 'dom',
  tema TEXT DEFAULT 'dark',
  habito_reset_hora TEXT DEFAULT '00:00',
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### perfis (finanças)

```sql
CREATE TABLE perfis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT '#8b5cf6',
  icone TEXT NOT NULL DEFAULT '',
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### categorias (finanças)

```sql
CREATE TABLE categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  icone TEXT NOT NULL DEFAULT '',
  cor TEXT NOT NULL DEFAULT '#6b7280',
  tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### transacoes (finanças)

```sql
CREATE TABLE transacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
  nome TEXT NOT NULL,
  valor REAL NOT NULL,
  data TEXT NOT NULL,
  categoria_id INTEGER,
  perfil_id INTEGER,
  observacao TEXT DEFAULT '',
  fixa_id INTEGER,
  recorrente INTEGER DEFAULT 0,
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (perfil_id) REFERENCES perfis(id),
  FOREIGN KEY (fixa_id) REFERENCES transacoes_fixas(id)
);

CREATE INDEX idx_transacoes_data ON transacoes(data);
CREATE INDEX idx_transacoes_perfil ON transacoes(perfil_id);
CREATE INDEX idx_transacoes_tipo ON transacoes(tipo);
```

#### transacoes_fixas (finanças)

```sql
CREATE TABLE transacoes_fixas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
  nome TEXT NOT NULL,
  valor REAL NOT NULL,
  dia_mes INTEGER NOT NULL CHECK(dia_mes BETWEEN 1 AND 31),
  frequencia TEXT NOT NULL DEFAULT 'mensal' CHECK(frequencia IN ('mensal', 'semanal', 'quinzenal', 'anual')),
  categoria_id INTEGER,
  perfil_id INTEGER,
  ativa INTEGER DEFAULT 1,
  data_fim TEXT,
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (perfil_id) REFERENCES perfis(id)
);
```

#### investimentos (finanças)

```sql
CREATE TABLE investimentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('cdb', 'tesouro', 'acoes', 'fii', 'poupanca', 'outro')),
  perfil_id INTEGER,
  valor_aplicado REAL NOT NULL DEFAULT 0,
  rendimento_acumulado REAL DEFAULT 0,
  data_aplicacao TEXT,
  data_vencimento TEXT,
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (perfil_id) REFERENCES perfis(id)
);
```

#### tags (tarefas)

```sql
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT '#3b82f6',
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### tarefas

```sql
CREATE TABLE tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  prioridade TEXT NOT NULL DEFAULT 'media' CHECK(prioridade IN ('alta', 'media', 'baixa')),
  status TEXT NOT NULL DEFAULT 'afazer' CHECK(status IN ('afazer', 'em_progresso', 'concluida')),
  vencimento TEXT,
  concluido_em TEXT,
  projeto_id INTEGER,
  ordem INTEGER DEFAULT 0,
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE SET NULL
);

CREATE INDEX idx_tarefas_status ON tarefas(status);
CREATE INDEX idx_tarefas_vencimento ON tarefas(vencimento);
CREATE INDEX idx_tarefas_projeto ON tarefas(projeto_id);
```

#### sub_tarefas

```sql
CREATE TABLE sub_tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tarefa_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  concluida INTEGER DEFAULT 0,
  ordem INTEGER DEFAULT 0,
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE
);
```

#### tarefa_tags (N:N)

```sql
CREATE TABLE tarefa_tags (
  tarefa_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (tarefa_id, tag_id),
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

#### metas

```sql
CREATE TABLE metas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  valor_atual REAL NOT NULL DEFAULT 0,
  valor_alvo REAL NOT NULL,
  data_alvo TEXT,
  projeto_id INTEGER,
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE SET NULL
);
```

#### eventos (cronograma)

```sql
CREATE TABLE eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  tipo TEXT NOT NULL CHECK(tipo IN ('com_horario', 'dia_inteiro', 'lembrete')),
  data_inicio TEXT NOT NULL,
  data_fim TEXT,
  horario_inicio TEXT,
  horario_fim TEXT,
  recorrencia_tipo TEXT CHECK(recorrencia_tipo IN ('semanal', 'quinzenal', 'mensal', 'anual')),
  recorrencia_fim TEXT,
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_eventos_data ON eventos(data_inicio);
```

#### cadernos (notas)

```sql
CREATE TABLE cadernos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT '#ec4899',
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### notas

```sql
CREATE TABLE notas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  titulo TEXT NOT NULL DEFAULT 'Sem título',
  conteudo TEXT DEFAULT '',
  caderno_id INTEGER,
  projeto_id INTEGER,
  criado_em TEXT DEFAULT (datetime('now')),
  atualizado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (caderno_id) REFERENCES cadernos(id) ON DELETE SET NULL,
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE SET NULL
);

CREATE INDEX idx_notas_caderno ON notas(caderno_id);
CREATE INDEX idx_notas_projeto ON notas(projeto_id);
CREATE INDEX idx_notas_atualizado ON notas(atualizado_em);
```

#### habitos

```sql
CREATE TABLE habitos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### habito_checks

```sql
CREATE TABLE habito_checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habito_id INTEGER NOT NULL,
  data TEXT NOT NULL,
  checked INTEGER NOT NULL DEFAULT 1,
  UNIQUE(habito_id, data),
  FOREIGN KEY (habito_id) REFERENCES habitos(id) ON DELETE CASCADE
);

CREATE INDEX idx_habito_checks_data ON habito_checks(data);
```

#### projetos

```sql
CREATE TABLE projetos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT '#f97316',
  descricao TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'em_andamento' CHECK(status IN ('em_andamento', 'pausado', 'concluido')),
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### projeto_links

```sql
CREATE TABLE projeto_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projeto_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  url TEXT NOT NULL,
  tipo TEXT DEFAULT 'link',
  criado_em TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
);
```

### Resumo das Tabelas

| # | Tabela | Módulo | Registros estimados |
|---|--------|--------|---------------------|
| 1 | users | Auth | 1 |
| 2 | sessions | Auth | 1-5 |
| 3 | configuracoes | Settings | 1 |
| 4 | perfis | Finanças | 2-5 |
| 5 | categorias | Finanças | 10-20 |
| 6 | transacoes | Finanças | 100-500/mês |
| 7 | transacoes_fixas | Finanças | 5-15 |
| 8 | investimentos | Finanças | 3-10 |
| 9 | tags | Tarefas | 5-15 |
| 10 | tarefas | Tarefas | 50-200 |
| 11 | sub_tarefas | Tarefas | 100-300 |
| 12 | tarefa_tags | Tarefas | 50-200 |
| 13 | metas | Metas | 5-20 |
| 14 | eventos | Cronograma | 50-200 |
| 15 | cadernos | Notas | 3-10 |
| 16 | notas | Notas | 20-100 |
| 17 | habitos | Hábitos | 5-15 |
| 18 | habito_checks | Hábitos | 180-540/ano |
| 19 | projetos | Projetos | 3-10 |
| 20 | projeto_links | Projetos | 5-20 |

---

## 8. Contrato de APIs Completo

### Auth

```
POST   /api/auth/login
  Body:    { email, senha }
  Success: { user: { id, nome, email, avatar } }
  Erro:    401 { erro: "Credenciais inválidas" }

POST   /api/auth/logout
  Success: { mensagem: "Logout realizado" }

GET    /api/auth/me
  Success: { user: { id, nome, email, avatar } }
  Erro:    401 { erro: "Não autenticado" }
```

### Perfis (finanças)

```
GET    /api/perfis
  Response: [{ id, nome, cor, icone, criado_em }]

POST   /api/perfis
  Body: { nome, cor, icone }
  Response: { id, nome, cor, icone, criado_em }

PUT    /api/perfis/:id
  Body: { nome?, cor?, icone? }
  Response: { id, nome, cor, icone }

DELETE /api/perfis/:id
  Response: { mensagem: "Perfil excluído" }
```

### Categorias (finanças)

```
GET    /api/categorias
  Query: ?tipo=receita|despesa
  Response: [{ id, nome, icone, cor, tipo }]

POST   /api/categorias
  Body: { nome, icone, cor, tipo }
  Response: { id, nome, icone, cor, tipo }

PUT    /api/categorias/:id
  Body: { nome?, icone?, cor?, tipo? }

DELETE /api/categorias/:id
  Response: { mensagem: "Categoria excluída" }
```

### Transações (finanças)

```
GET    /api/transacoes
  Query: ?mes=2026-06&perfil_id=1&tipo=receita&categoria_id=2&busca=mercado
  Response: {
    dados: [{ id, tipo, nome, valor, data, categoria_id, perfil_id, observacao, fixa_id, recorrente, criado_em }],
    total: number
  }

POST   /api/transacoes
  Body: { tipo, nome, valor, data, categoria_id?, perfil_id?, observacao?, fixa_id? }

PUT    /api/transacoes/:id
  Body: { tipo?, nome?, valor?, data?, categoria_id?, perfil_id?, observacao? }

DELETE /api/transacoes/:id
```

### Transações Fixas (finanças)

```
GET    /api/fixas
  Response: [{ id, tipo, nome, valor, dia_mes, frequencia, categoria_id, perfil_id, ativa, data_fim }]

POST   /api/fixas
  Body: { tipo, nome, valor, dia_mes, frequencia?, categoria_id?, perfil_id?, ativa? }

PUT    /api/fixas/:id
  Body: { tipo?, nome?, valor?, dia_mes?, frequencia?, ativa?, data_fim? }

DELETE /api/fixas/:id
```

### Investimentos (finanças)

```
GET    /api/investimentos
  Response: [{ id, nome, tipo, perfil_id, valor_aplicado, rendimento_acumulado, data_aplicacao, data_vencimento }]

POST   /api/investimentos
  Body: { nome, tipo, perfil_id?, valor_aplicado, data_aplicacao?, data_vencimento? }

PUT    /api/investimentos/:id
  Body: { nome?, tipo?, valor_aplicado?, rendimento_acumulado?, data_vencimento? }

DELETE /api/investimentos/:id
```

### Importação (finanças)

```
POST   /api/importar/csv
  Body: multipart/form-data { file }
  Response: { preview: [{ data, nome, valor, tipo, categoria_sugerida }] }

POST   /api/importar/pdf
  Body: multipart/form-data { file }
  Response: { preview: [{ data, nome, valor, tipo, categoria_sugerida }] }

POST   /api/importar/confirmar
  Body: { transacoes: [{ tipo, nome, valor, data, categoria_id, perfil_id }] }
  Response: { importados: number }
```

### Relatórios (finanças)

```
GET    /api/relatorios/mensal?mes=2026-06&perfil_id=1
  Response: { receitas, despesas, saldo, por_categoria: [{ categoria, valor }] }

GET    /api/relatorios/geral?perfil_id=1
  Response: { patrimonio, evolucao_mensal: [{ mes, receitas, despesas }], fixos_vs_variaveis }

GET    /api/relatorios/stats?mes=2026-06&perfil_id=1
  Response: { saldo_total, receitas_mes, despesas_mes, custos_fixos, ultimo_lancamento }
```

### Tarefas

```
GET    /api/tarefas
  Query: ?status=afazer&prioridade=alta&tag_id=1&projeto_id=2&busca=texto
  Response: [{ id, nome, descricao, prioridade, status, vencimento, concluido_em, projeto_id, ordem, tags: [{ id, nome, cor }], sub_tarefas: [{ id, nome, concluida, ordem }] }]

POST   /api/tarefas
  Body: { nome, descricao?, prioridade?, status?, vencimento?, projeto_id?, tags?: [tag_id] }

PUT    /api/tarefas/:id
  Body: { nome?, descricao?, prioridade?, status?, vencimento?, projeto_id? }

PATCH  /api/tarefas/:id/status
  Body: { status }
  Nota: se status = 'concluida', preenche concluido_em automaticamente

DELETE /api/tarefas/:id
```

### Tags (tarefas)

```
GET    /api/tags
POST   /api/tags       Body: { nome, cor }
PUT    /api/tags/:id    Body: { nome?, cor? }
DELETE /api/tags/:id
```

### Sub-tarefas

```
GET    /api/tarefas/:id/subtarefas
POST   /api/tarefas/:id/subtarefas   Body: { nome, ordem? }
PATCH  /api/tarefas/:id/subtarefas/:sid  Body: { nome?, concluida?, ordem? }
DELETE /api/tarefas/:id/subtarefas/:sid
```

### Metas

```
GET    /api/metas
  Query: ?projeto_id=1

POST   /api/metas
  Body: { nome, descricao?, valor_atual?, valor_alvo, data_alvo?, projeto_id? }

PUT    /api/metas/:id
  Body: { nome?, descricao?, valor_alvo?, data_alvo?, projeto_id? }

PATCH  /api/metas/:id/progresso
  Body: { valor_atual }

DELETE /api/metas/:id
```

### Eventos (cronograma)

```
GET    /api/eventos
  Query: ?mes=2026-06&data=2026-06-15
  Response: [{ id, nome, descricao, tipo, data_inicio, data_fim, horario_inicio, horario_fim, recorrencia_tipo, recorrencia_fim }]

POST   /api/eventos
  Body: { nome, descricao?, tipo, data_inicio, data_fim?, horario_inicio?, horario_fim?, recorrencia_tipo?, recorrencia_fim? }

PUT    /api/eventos/:id
  Body: { nome?, descricao?, tipo?, data_inicio?, ... }

DELETE /api/eventos/:id
```

### Dia Consolidado (cronograma)

```
GET    /api/cronograma/dia/:data
  Response: {
    eventos: [...],
    tarefas: [{ id, nome, prioridade, vencimento }],
    habitos: { total: 5, concluidos: 3, lista: [{ id, nome, checked }] }
  }
```

### Cadernos (notas)

```
GET    /api/cadernos
POST   /api/cadernos     Body: { nome, cor? }
PUT    /api/cadernos/:id Body: { nome?, cor? }
DELETE /api/cadernos/:id
```

### Notas

```
GET    /api/notas
  Query: ?caderno_id=1&projeto_id=2&busca=texto
  Response: [{ id, titulo, conteudo, caderno_id, projeto_id, criado_em, atualizado_em }]

POST   /api/notas
  Body: { titulo?, conteudo?, caderno_id?, projeto_id? }

PUT    /api/notas/:id
  Body: { titulo?, conteudo?, caderno_id?, projeto_id? }
  Nota: ao alterar conteudo, atualiza atualizado_em automaticamente

DELETE /api/notas/:id
```

### Hábitos

```
GET    /api/habitos
  Response: [{ id, nome, criado_em, streak_atual, melhor_streak, taxa_cumprimento }]

POST   /api/habitos      Body: { nome }
PUT    /api/habitos/:id   Body: { nome? }
DELETE /api/habitos/:id
```

### Hábito Checks

```
GET    /api/habitos/checks?mes=2026-06
  Response: [{ id, habito_id, data, checked }]

POST       /api/habitos/:id/check     Body: { data }     — marca como feito
DELETE     /api/habitos/:id/check?data=2026-06-15        — desmarca

GET        /api/habitos/:id/stats
  Response: { streak_atual, melhor_streak, total_dias, dias_cumpridos, taxa_cumprimento }
```

### Projetos

```
GET    /api/projetos
  Query: ?status=em_andamento

POST   /api/projetos
  Body: { nome, cor?, descricao?, status? }

PUT    /api/projetos/:id
  Body: { nome?, cor?, descricao?, status? }

DELETE /api/projetos/:id
```

### Projetos — Itens Vinculados

```
GET    /api/projetos/:id/tarefas
  Response: [{ id, nome, prioridade, status, vencimento, ... }]

GET    /api/projetos/:id/notas
  Response: [{ id, titulo, atualizado_em, ... }]

GET    /api/projetos/:id/metas
  Response: [{ id, nome, valor_atual, valor_alvo, ... }]

GET    /api/projetos/:id/progresso
  Response: { tarefas_total, tarefas_concluidas, percentual }
```

### Projeto Links

```
GET    /api/projetos/:id/links
POST   /api/projetos/:id/links     Body: { nome, url, tipo? }
DELETE /api/projetos/:id/links/:lid
```

### Configurações

```
GET    /api/configuracoes
  Response: { moeda, fuso_horario, inicio_semana, tema, habito_reset_hora }

PUT    /api/configuracoes
  Body: { moeda?, fuso_horario?, inicio_semana?, tema?, habito_reset_hora? }
```

### Hub (dashboard)

```
GET    /api/hub
  Response: {
    financas: { saldo_mes, ultimo_lancamento },
    tarefas: { pendentes, proximas: [{ id, nome, vencimento }] },
    metas: { top3: [{ id, nome, percentual }] },
    cronograma: { proximos_eventos: [{ id, nome, data_inicio }] },
    notas: { ultimas: [{ id, titulo, atualizado_em }] },
    habitos: { streak_atual, feitos_hoje, total_hoje },
    projetos: { ativos: [{ id, nome, status }] }
  }
```

### Exportar Dados

```
GET    /api/exportar/json
  Response: JSON com todas as tabelas do usuário

GET    /api/exportar/csv
  Response: CSV compactado (zip com um CSV por tabela)
```

---

## 9. Módulos — Funcionalidades Detalhadas

### 9.1 Finanças (#8b5cf6)

**Seções (ordem de renderização):**

1. **Header** — Ícone + título + seletor de mês ◄ ► + botões (Nova Transação, Importar, Relatórios)
2. **Tabs de Perfil** — "Todos" (consolidado) + perfis personalizados + "+ Perfil"
3. **Stats Row** — 4 cards: Saldo Total, Receitas (mês), Despesas (mês), Custos Fixos
4. **Extrato do Mês** — Lista com filtros (tipo, categoria, perfil, fixas, busca)
5. **Receitas Fixas & Despesas Fixas** — Toggle ON/OFF, dia do mês, total ativas, já pagas
6. **Investimentos** — Cards com tipo (CDB, Tesouro, Ações, FII, Poupança, Outro)
7. **Categorias** — Chips visuais + mini gráfico pizza + CRUD
8. **Gráficos & Relatórios** — Toggle Mensal/Geral + 4 gráficos

| # | Funcionalidade | Decisão |
|---|---------------|---------|
| F1 | Perfis/Contas | Personalizáveis + visão "Todos" consolidada |
| F2 | Categorias | Personalizáveis (nome, ícone, cor, tipo) |
| F3 | Período mensal | Navegação ◄ ►, cada mês independente |
| F4 | Entrada manual | Modal com tipo, nome, valor, data, categoria, perfil, obs |
| F5 | Importação | CSV/PDF com preview e mapeamento automático |
| F6 | Receitas fixas | Recorrência automática, toggle ON/OFF |
| F7 | Despesas fixas | Recorrência automática, toggle ON/OFF |
| F8 | Custos fixos | Card dedicado nos stats |
| F9 | Salário fixo | Parte de receitas fixas |
| F10 | Investimentos | Seção dedicada (tipo, valor, rendimento, datas) |
| F11 | Gráficos mensais | Barras (receita vs despesa) + pizza (categorias) |
| F12 | Gráficos gerais | Linha (patrimônio) + empilhado (fixos vs variáveis) |
| F13 | Extrato | Lista com filtros, ordenação, indicador recorrente |
| F14 | Troca de mês | Atualiza toda a página |
| F15 | Filtro por perfil | Filtra toda a página |

### 9.2 Tarefas (#3b82f6)

| # | Decisão | Escolha |
|---|---------|---------|
| T1 | Organização | Lista simples (projetos ficaram no módulo Projetos) |
| T2 | Visão | Kanban + Lista (toggle) |
| T3 | Drag & drop | Sim, HTML5 nativo entre colunas |
| T4 | Prioridade | 3 níveis: Alta, Média, Baixa |
| T5 | Datas | Só data de vencimento |
| T6 | Tags | Personalizáveis com cor |
| T7 | Sub-tarefas | Sim, com checkboxes |
| T8 | Recorrência | Não |

**Kanban — 3 colunas:** A Fazer → Em Progresso → Concluído

**Card de tarefa mostra:** Prioridade (bolinha), nome, tags (chips), vencimento (vermelho se atrasado), sub-tarefas colapsáveis, projeto vinculado (badge)

### 9.3 Metas (#f59e0b)

| # | Decisão | Escolha |
|---|---------|---------|
| M1 | Tipo | Quantitativas com barra de progresso |
| M2 | Prazo | Opcional |
| M3 | Milestones | Não — progresso direto |
| M4 | Vínculo Finanças | Não, independente |

### 9.4 Cronograma (#10b981)

| # | Decisão | Escolha |
|---|---------|---------|
| C1 | Visão | Mês (calendário) + Dia (agenda por hora) — toggle |
| C2 | Eventos com horário | Início + fim |
| C3 | Eventos dia inteiro | Sem horário |
| C4 | Lembretes | Só no dia |
| C5 | Recorrência | Sim (semanal, quinzenal, mensal, anual) |
| C6 | Integração Tarefas | Automático — vencimento no dia |
| C7 | Integração Hábitos | Badge resumido no dia |

### 9.5 Notas (#ec4899)

| # | Decisão | Escolha |
|---|---------|---------|
| N1 | Formato | Markdown + preview (estilo Notion) |
| N2 | Organização | Pastas/cadernos |
| N3 | Tamanho | Flexível |
| N4 | Biblioteca | marked.js (~15KB) |
| N5 | Notas soltas | Sim — sem projeto_id = solta, com projeto_id = vinculada |

### 9.6 Hábitos (#06b6d4)

| # | Decisão | Escolha |
|---|---------|---------|
| H1 | Tipo | Diários (checkbox por dia) |
| H2 | Streak | Sim — contagem de dias seguidos |
| H3 | Visão | Mapa de calor anual + lista detalhada (toggle) |
| H4 | Métrica | Binário (check/uncheck) |

**Mapa de calor:** Grade tipo GitHub Contributions (365 dias), intensidade por % de hábitos cumpridos

### 9.7 Projetos (#f97316)

| # | Decisão | Escolha |
|---|---------|---------|
| P1 | Posição | 7º módulo no hub |
| P2 | Estrutura | Abas: Visão Geral, Tarefas, Notas, Arquivos, Metas |
| P3 | Arquivos | Links externos (sem upload) |
| P4 | Navegação cruzada | Filtro/projeto_id — itens com projeto_id aparecem no projeto |

---

## 10. Integrações entre Módulos

| Integração | Automática? | Como funciona |
|---|---|---|
| Cronograma ← Tarefas | Sim | Tarefas com vencimento = data X aparecem no dia X |
| Cronograma ← Hábitos | Sim | Badge no dia (verde=todos, amarelo=parcial, vazio=nenhum) |
| Projetos ← Tarefas | Sim | FK projeto_id, reutiliza componente Tarefa via ES Module |
| Projetos ← Notas | Sim | FK projeto_id, reutiliza componente Nota via ES Module |
| Projetos ← Metas | Sim | FK projeto_id, reutiliza componente Meta via ES Module |
| Projetos ← Links | Sim | Tabela projeto_links |

**Integrações rejeitadas:** Finanças ↔ Cronograma, Hábitos ↔ Tarefas

**Princípios de integração:**
1. Cada item tem uma única "casa" (tarefa no módulo Tarefas, nota no módulo Notas)
2. Projetos é uma **view agregadora** — filtra e mostra itens vinculados
3. Itens sem `projeto_id` = soltos, com `projeto_id` = vinculados
4. Nota/tarefa solta pode ser vinculada a um projeto depois
5. Editar em qualquer lugar reflete no outro (mesmo registro no banco)
6. Componentes front são reutilizados via ES Modules (mesmo card de tarefa em Tarefas e Projetos)

---

## 11. Configurações (⚙)

| Seção | O que configura |
|-------|---------------|
| Perfil | Nome do usuário, avatar (emoji ou inicial), alterar senha |
| Aparência | Toggle dark/light (hoje só dark, deixa pronto para expansão) |
| Finanças | Moeda (R$), categorias personalizadas, perfis de orçamento |
| Cronograma | Fuso horário, início da semana (dom/seg) |
| Hábitos | Horário de corte do dia (quando hábitos resetam) |
| Exportar | Exportar dados em JSON/CSV (backup) |
| Sobre | Versão do app, créditos |

---

## 12. Ordem de Implementação

| Fase | O quê | Por quê | Horas |
|------|-------|---------|-------|
| 1 | Back-end base + Auth + SQLite setup | Fundação para tudo | 20-28h |
| 2 | Hub + Sidebar + transições | Shell visual do app | 20-28h |
| 3 | Finanças | O mais complexo — resolve desafios logo | 60-80h |
| 4 | Tarefas | Kanban + drag&drop | 30-40h |
| 5 | Cronograma | Primeiras integrações (← Tarefas, ← Hábitos) | 30-40h |
| 6 | Hábitos | Integra com Cronograma (já implementado) | 18-24h |
| 7 | Metas | O mais simples, rápido | 12-16h |
| 8 | Notas | Markdown com preview | 20-28h |
| 9 | Projetos | Último — agrega os outros que já estarão prontos | 20-28h |
| 10 | Configurações | Settings do app | 8-12h |
| 11 | Deploy + CI | GitHub Pages + Render | 6-8h |
| **Total** | | | **256-347h (~6-9 semanas a 40h/sem)** |

---

## 13. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Drag & drop Kanban em JS puro | Médio | API Drag nativa HTML5 |
| Mapa de calor em JS puro | Baixo | Grid de divs com cores |
| Calendário mensal visual | Médio | Iterar dias do mês, sem lib |
| Importação CSV/PDF | Médio | CSV primeiro, PDF fase 2 (pdf-parse) |
| Cold start Render | Baixo | UptimeRobot ping a cada 14min |
| Reutilização componentes Projetos/Outros | Médio | ES Modules com imports compartilhados |
| Modelo GLM lento no NIM | Médio | Aumentar timeouts ou trocar provedor |

---

## 14. Seeds — Dados Iniciais

### Usuário Admin

```sql
INSERT INTO users (nome, email, senha_hash) VALUES (
  'Admin', 'admin@myfinance.com', '$2b$10$...(bcrypt hash da senha)'
);
```

### Categorias Padrão

```sql
INSERT INTO categorias (user_id, nome, icone, cor, tipo) VALUES
(1, 'Salário', '💰', '#22c55e', 'receita'),
(1, 'Freelance', '💻', '#06b6d4', 'receita'),
(1, 'Alimentação', '🍕', '#ef4444', 'despesa'),
(1, 'Moradia', '🏠', '#f59e0b', 'despesa'),
(1, 'Transporte', '🚗', '#3b82f6', 'despesa'),
(1, 'Saúde', '💊', '#ec4899', 'despesa'),
(1, 'Educação', '📚', '#8b5cf6', 'despesa'),
(1, 'Lazer', '🎮', '#f97316', 'despesa'),
(1, 'Compras', '🛒', '#6b7280', 'despesa'),
(1, 'Outros', '📎', '#9ca3af', 'despesa');
```

### Configuração Padrão

```sql
INSERT INTO configuracoes (user_id, moeda, fuso_horario, inicio_semana, tema, habito_reset_hora)
VALUES (1, 'BRL', 'America/Sao_Paulo', 'dom', 'dark', '00:00');
```

---

## 15. Referências do Projeto

| Arquivo | Descrição |
|---------|-----------|
| `rascunho-do-projeto/prototipo/` | Protótipo HTML do hub + 7 módulos |
| `rascunho-do-projeto/testando-funcionalidades-financas.md` | Spec completa de Finanças (1964 linhas) |
| `rascunho-do-projeto/relatorios/relatorio-geral.md` | Relatório geral do projeto |
| `rascunho-do-projeto/layouts-reuniao-1/` | Documentação de layout (iterações) |
| `memorias/estado.md` | Estado atual do projeto |
| `memorias/log.md` | Log dos últimos eventos |
| `memorias/reunioes/` | Atas das reuniões (3 realizadas) |
| `AGENTS.md` | Regras dos agentes do projeto |

---

## 16. Histórico de Reuniões

| # | Data | Tema | Decisões |
|---|------|------|----------|
| 1 | 2026-06-11 | Brainstorming conceito + layout | 10 decisões (conceito, público, plataforma, visual, layout final) |
| 2 | 2026-06-12 | Stack + funcionalidades dos 7 módulos + integrações | Stack, 7 módulos detalhados, integrações, Projetos como 7º módulo |
| 3 | 2026-06-14 | Decisões estruturais finais | Pastas (híbrida), auth (sessão+SQLite), navegação cruzada, hub cards, mobile, configurações |

---

## 17. Checklist de Prontidão para Implementação

- [x] Conceito e público definidos
- [x] Stack técnica definida
- [x] Layout aprovado (spotlight-sidebar-transição)
- [x] Tokens de design definidos
- [x] 7 módulos com funcionalidades detalhadas
- [x] Integrações entre módulos definidas
- [x] Estrutura de pastas definida (híbrida)
- [x] Autenticação definida (sessão + SQLite)
- [x] Navegação cruzada em Projetos definida (filtro/projeto_id)
- [x] Hub cards definidos
- [x] Layout mobile definido
- [x] Configurações definidas
- [x] Modelo de dados completo (20 tabelas)
- [x] Contrato de APIs completo (~40 endpoints)
- [x] Seeds iniciais definidos
- [ ] Estrutura de pastas criada no filesystem
- [ ] Banco SQLite inicializado com schema
- [ ] Back-end base rodando (Express + Auth)
- [ ] Front-end base rodando (Hub + Sidebar)
