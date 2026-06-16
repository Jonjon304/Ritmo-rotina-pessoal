# 📘 Guia Passo a Passo — MyFinance para Iniciantes

> Este guia foi feito para você construir o projeto **do zero**, entendendo cada linha de código que escrever.
> Cada etapa explica **O QUÊ** é, **POR QUÊ** existe, e **COMO** implementar.

---

## 📋 Índice Geral

- [Fase 1 — Preparando o Ambiente](#fase-1)
- [Fase 2 — Banco de Dados (SQLite)](#fase-2)
- [Fase 3 — Servidor Back-end (Express)](#fase-3)
- [Fase 4 — Autenticação (Login)](#fase-4)
- [Fase 5 — Hub e Sidebar (Front-end Base)](#fase-5)
- [Fase 6 — Módulo Finanças](#fase-6)
- [Fase 7 — Módulo Tarefas (Kanban)](#fase-7)
- [Fase 8 — Módulo Metas](#fase-8)
- [Fase 9 — Módulo Cronograma](#fase-9)
- [Fase 10 — Módulo Hábitos](#fase-10)
- [Fase 11 — Módulo Notas](#fase-11)
- [Fase 12 — Módulo Projetos](#fase-12)
- [Fase 13 — Deploy (Publicar online)](#fase-13)

---

## 🟢 FASE 1 — Preparando o Ambiente {#fase-1}

### O que é esta fase?
Antes de escrever qualquer código, precisamos instalar as ferramentas necessárias no seu computador. Pense nisso como montar a bancada antes de começar a construir um móvel.

---

### Passo 1.1 — Instalar o Node.js

**O que é o Node.js?**
Node.js é um programa que permite rodar JavaScript fora do navegador. Sem ele, JavaScript só funciona dentro do Chrome/Firefox. Com ele, podemos criar servidores, ler arquivos, etc.

**Como instalar:**
1. Acesse: https://nodejs.org
2. Baixe a versão **LTS** (Long Term Support — mais estável)
3. Siga o instalador normalmente

**Como verificar se funcionou:**
Abra o terminal e digite:
```bash
node --version
# Deve aparecer algo como: v20.11.0

npm --version
# Deve aparecer algo como: 10.2.4
```

> 💡 **O que é o npm?** É o gerenciador de pacotes do Node. Ele instala bibliotecas prontas para usar no seu projeto (como o Express, SQLite, etc). Vem junto com o Node automaticamente.

---

### Passo 1.2 — Instalar o VS Code

**O que é o VS Code?**
É um editor de código. É como o Word, mas para programação. Tem destaque de cores, autocomplete e muito mais.

1. Acesse: https://code.visualstudio.com
2. Baixe e instale normalmente

**Extensões recomendadas** (instale dentro do VS Code, menu lateral de extensões):
- `Prettier - Code formatter` → formata o código automaticamente
- `SQLite Viewer` → visualiza o banco de dados graficamente
- `Live Server` → abre o front-end no browser em tempo real

---

### Passo 1.3 — Entender a estrutura atual do projeto

Abra a pasta `/home/jonjon/projetos-github/MyFinance` no VS Code.

A estrutura que criamos é esta:

```
MyFinance/
├── backend/                 ← Código do servidor (Node.js)
│   ├── db/                  ← Banco de dados
│   │   └── migrations/      ← Atualizações do banco ao longo do tempo
│   ├── middleware/          ← "Filtros" que toda requisição passa
│   ├── modules/             ← Lógica separada por módulo
│   │   ├── auth/            ← Login/Logout
│   │   ├── financas/        ← Transações, perfis, etc
│   │   ├── tarefas/         ← Tarefas e Kanban
│   │   ├── metas/           ← Metas com progresso
│   │   ├── cronograma/      ← Calendário e eventos
│   │   ├── notas/           ← Editor Markdown
│   │   ├── habitos/         ← Hábitos diários
│   │   └── projetos/        ← Projetos agregadores
│   ├── routes/              ← Mapa de URLs da API
│   └── utils/               ← Funções auxiliares reutilizáveis
│
└── frontend/                ← Código da interface (HTML/CSS/JS)
    ├── styles/              ← CSS global e variáveis de design
    ├── components/          ← Componentes reutilizáveis
    │   ├── sidebar/         ← Menu lateral
    │   ├── modal/           ← Janela popup
    │   ├── card/            ← Card genérico
    │   ├── header/          ← Cabeçalho
    │   ├── toast/           ← Notificação temporária
    │   └── confirm/         ← Caixa de confirmação
    ├── modules/             ← Uma pasta por módulo
    │   ├── financas/
    │   ├── tarefas/
    │   └── ...
    ├── utils/               ← Funções JS reutilizáveis
    └── assets/              ← Imagens, ícones, fontes
```

> 💡 **Por que separar assim?** Imagine que no futuro você quer corrigir um bug no módulo de Finanças. Se tudo estivesse num arquivo único enorme, seria um pesadelo encontrar o problema. Separando por módulos, você sabe exatamente onde procurar.

---

### Passo 1.4 — Inicializar o projeto back-end

O back-end já tem um `package.json`. Precisamos instalar as dependências novas que vamos usar.

No terminal, dentro da pasta `MyFinance/`:
```bash
cd backend
npm install express better-sqlite3 express-session connect-sqlite3 bcrypt helmet cors express-rate-limit dotenv
npm install --save-dev nodemon
```

**O que cada biblioteca faz:**

| Biblioteca | Para que serve |
|------------|---------------|
| `express` | Framework para criar o servidor web |
| `better-sqlite3` | Driver para conectar ao banco SQLite |
| `express-session` | Gerencia sessões de login |
| `connect-sqlite3` | Salva as sessões no SQLite (não na memória) |
| `bcrypt` | Criptografa senhas com segurança |
| `helmet` | Adiciona cabeçalhos de segurança HTTP |
| `cors` | Permite que o front-end acesse a API |
| `express-rate-limit` | Limita requisições (proteção contra ataques) |
| `dotenv` | Carrega variáveis de ambiente do arquivo `.env` |
| `nodemon` | Reinicia o servidor automaticamente ao salvar |

---

### Passo 1.5 — Criar o arquivo `.env`

**O que é o `.env`?**
É um arquivo de configuração que guarda informações sensíveis (como senhas e chaves secretas) **fora do código**. Nunca deve ir para o GitHub.

Crie o arquivo `backend/.env`:
```env
PORT=3000
SESSION_SECRET=minha_chave_super_secreta_trocar_em_producao
NODE_ENV=development
```

> ⚠️ **Atenção:** Troque `minha_chave_super_secreta_trocar_em_producao` por qualquer texto longo e aleatório. Esta chave é usada para assinar os cookies de sessão.

---

## 🟡 FASE 2 — Banco de Dados (SQLite) {#fase-2}

### O que é esta fase?
Precisamos criar o banco de dados onde todos os dados do app serão armazenados. É como criar as planilhas antes de começar a usar o Excel.

---

### Passo 2.1 — Entender o SQLite

**O que é SQLite?**
É um banco de dados que fica salvo num único arquivo (`.db`) no seu computador. Diferente do MySQL ou PostgreSQL, não precisa instalar nenhum servidor separado. Perfeito para projetos pessoais e pequenos.

**Como funciona?**
Você cria **tabelas** (como planilhas) com **colunas** (como cabeçalhos). Depois **insere**, **lê**, **atualiza** e **deleta** linhas usando a linguagem SQL.

Exemplo básico de SQL:
```sql
-- Criar tabela
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY,
  nome TEXT,
  email TEXT
);

-- Inserir dados
INSERT INTO usuarios (nome, email) VALUES ('João', 'joao@email.com');

-- Ler dados
SELECT * FROM usuarios;

-- Atualizar
UPDATE usuarios SET nome = 'João Silva' WHERE id = 1;

-- Deletar
DELETE FROM usuarios WHERE id = 1;
```

---

### Passo 2.2 — Criar o arquivo de conexão com o banco

Crie o arquivo `backend/db/database.js`:

```javascript
// Importamos a biblioteca better-sqlite3
// O "require" é como um "import", carrega uma biblioteca externa
const Database = require('better-sqlite3')

// Importamos o módulo "path" do Node.js
// Ele ajuda a montar caminhos de pasta de forma compatível em qualquer sistema operacional
const path = require('path')

// Montamos o caminho completo até onde o arquivo do banco será salvo
// __dirname = pasta atual deste arquivo (backend/db/)
// 'myfinance.db' = nome do arquivo do banco
const DB_PATH = path.join(__dirname, 'myfinance.db')

// Criamos a conexão com o banco de dados
// Se o arquivo não existir, ele é criado automaticamente
const db = new Database(DB_PATH)

// PRAGMA é uma instrução especial do SQLite
// foreign_keys = ON ativa as regras de chave estrangeira
// Isso garante que, ao deletar um registro pai, os filhos também são deletados (CASCADE)
// IMPORTANTE: No SQLite, isso precisa ser ativado a cada conexão
db.pragma('foreign_keys = ON')

// journal_mode = WAL melhora a performance em leituras e escritas simultâneas
db.pragma('journal_mode = WAL')

// Exportamos a conexão para que outros arquivos possam usar
module.exports = db
```

**Por que esse arquivo existe?**
Para que **todos os outros arquivos do projeto usem a mesma conexão** com o banco. Se cada arquivo criasse sua própria conexão, teríamos problemas de conflito.

---

### Passo 2.3 — Criar o Schema (estrutura das tabelas)

Crie o arquivo `backend/db/schema.sql`:

```sql
-- =============================================================
-- MYFINANCE — SCHEMA DO BANCO DE DADOS
-- Execute na ordem abaixo para respeitar as dependências
-- =============================================================

-- 1. USUÁRIOS (base para quase tudo)
-- Guarda os dados do usuário único do sistema
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único, gerado automaticamente
  nome       TEXT    NOT NULL,                    -- Nome do usuário (obrigatório)
  email      TEXT    NOT NULL UNIQUE,             -- Email único (não pode repetir)
  senha_hash TEXT    NOT NULL,                    -- Senha criptografada (NUNCA guardar a senha pura!)
  avatar     TEXT    DEFAULT '',                  -- Emoji ou inicial do avatar
  criado_em  TEXT    DEFAULT (datetime('now'))    -- Data de criação automática
);

-- 2. CONFIGURAÇÕES (depende de users)
-- Preferências do usuário: moeda, fuso, tema, etc.
CREATE TABLE IF NOT EXISTS configuracoes (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER NOT NULL UNIQUE,       -- Cada usuário tem UMA configuração
  moeda            TEXT    DEFAULT 'BRL',
  fuso_horario     TEXT    DEFAULT 'America/Sao_Paulo',
  inicio_semana    TEXT    DEFAULT 'dom',         -- 'dom' ou 'seg'
  tema             TEXT    DEFAULT 'dark',
  habito_reset_hora TEXT   DEFAULT '00:00',       -- Quando os hábitos resetam
  criado_em        TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)     -- FK: user_id deve existir em users
);

-- 3. PERFIS FINANCEIROS (depende de users)
-- Ex: "Nubank", "Inter", "Carteira"
CREATE TABLE IF NOT EXISTS perfis (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL,
  nome      TEXT    NOT NULL,
  cor       TEXT    NOT NULL DEFAULT '#8b5cf6',
  icone     TEXT    NOT NULL DEFAULT '',
  criado_em TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. CATEGORIAS FINANCEIRAS (depende de users)
-- Ex: "Alimentação", "Salário", "Moradia"
CREATE TABLE IF NOT EXISTS categorias (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL,
  nome      TEXT    NOT NULL,
  icone     TEXT    NOT NULL DEFAULT '',
  cor       TEXT    NOT NULL DEFAULT '#6b7280',
  tipo      TEXT    NOT NULL CHECK(tipo IN ('receita', 'despesa')), -- Só aceita esses valores
  criado_em TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5. TRANSAÇÕES FIXAS (depende de users, categorias, perfis)
-- Salário, aluguel — entradas/saídas que se repetem todo mês
CREATE TABLE IF NOT EXISTS transacoes_fixas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL,
  tipo         TEXT    NOT NULL CHECK(tipo IN ('receita', 'despesa')),
  nome         TEXT    NOT NULL,
  valor        REAL    NOT NULL,                  -- REAL = número com casas decimais
  dia_mes      INTEGER NOT NULL CHECK(dia_mes BETWEEN 1 AND 31),
  frequencia   TEXT    NOT NULL DEFAULT 'mensal'
               CHECK(frequencia IN ('mensal', 'semanal', 'quinzenal', 'anual')),
  categoria_id INTEGER,
  perfil_id    INTEGER,
  ativa        INTEGER DEFAULT 1,                 -- 1 = ativa, 0 = desativada
  data_fim     TEXT,                              -- Quando para de repetir (opcional)
  criado_em    TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)      REFERENCES users(id),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (perfil_id)    REFERENCES perfis(id)
);

-- 6. TRANSAÇÕES (depende de users, categorias, perfis, transacoes_fixas)
-- Cada entrada/saída de dinheiro registrada
CREATE TABLE IF NOT EXISTS transacoes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL,
  tipo         TEXT    NOT NULL CHECK(tipo IN ('receita', 'despesa')),
  nome         TEXT    NOT NULL,
  valor        REAL    NOT NULL,
  data         TEXT    NOT NULL,                  -- Formato: 'YYYY-MM-DD'
  categoria_id INTEGER,
  perfil_id    INTEGER,
  observacao   TEXT    DEFAULT '',
  fixa_id      INTEGER,                           -- FK para transacao_fixa (se for gerada automaticamente)
  recorrente   INTEGER DEFAULT 0,
  criado_em    TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)      REFERENCES users(id),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (perfil_id)    REFERENCES perfis(id),
  FOREIGN KEY (fixa_id)      REFERENCES transacoes_fixas(id)
);

-- Índices para acelerar consultas frequentes
CREATE INDEX IF NOT EXISTS idx_transacoes_data   ON transacoes(data);
CREATE INDEX IF NOT EXISTS idx_transacoes_perfil ON transacoes(perfil_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo   ON transacoes(tipo);

-- 7. INVESTIMENTOS (depende de users, perfis)
CREATE TABLE IF NOT EXISTS investimentos (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id              INTEGER NOT NULL,
  nome                 TEXT    NOT NULL,
  tipo                 TEXT    NOT NULL
                       CHECK(tipo IN ('cdb', 'tesouro', 'acoes', 'fii', 'poupanca', 'outro')),
  perfil_id            INTEGER,
  valor_aplicado       REAL    NOT NULL DEFAULT 0,
  rendimento_acumulado REAL    DEFAULT 0,
  data_aplicacao       TEXT,
  data_vencimento      TEXT,
  criado_em            TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)  REFERENCES users(id),
  FOREIGN KEY (perfil_id) REFERENCES perfis(id)
);

-- 8. PROJETOS (depende de users) — sobe antes de tarefas/metas/notas
-- Módulo agregador: tarefas, notas e metas podem ser vinculadas a um projeto
CREATE TABLE IF NOT EXISTS projetos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL,
  nome      TEXT    NOT NULL,
  cor       TEXT    NOT NULL DEFAULT '#f97316',
  descricao TEXT    DEFAULT '',
  status    TEXT    NOT NULL DEFAULT 'em_andamento'
            CHECK(status IN ('em_andamento', 'pausado', 'concluido')),
  criado_em TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 9. LINKS DE PROJETO (depende de projetos)
CREATE TABLE IF NOT EXISTS projeto_links (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  projeto_id INTEGER NOT NULL,
  nome       TEXT    NOT NULL,
  url        TEXT    NOT NULL,
  tipo       TEXT    DEFAULT 'link',
  criado_em  TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
  -- ON DELETE CASCADE = se o projeto for deletado, os links também são deletados
);

-- 10. TAGS DE TAREFAS (depende de users)
CREATE TABLE IF NOT EXISTS tags (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome    TEXT    NOT NULL,
  cor     TEXT    NOT NULL DEFAULT '#3b82f6',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 11. TAREFAS (depende de users, projetos)
CREATE TABLE IF NOT EXISTS tarefas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL,
  nome         TEXT    NOT NULL,
  descricao    TEXT    DEFAULT '',
  prioridade   TEXT    NOT NULL DEFAULT 'media'
               CHECK(prioridade IN ('alta', 'media', 'baixa')),
  status       TEXT    NOT NULL DEFAULT 'afazer'
               CHECK(status IN ('afazer', 'em_progresso', 'concluida')),
  vencimento   TEXT,                              -- Data de vencimento (opcional)
  concluido_em TEXT,                              -- Preenchido automaticamente ao concluir
  projeto_id   INTEGER,                           -- NULL = tarefa solta, número = vinculada a projeto
  ordem        INTEGER DEFAULT 0,                 -- Para ordenação no Kanban
  criado_em    TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE SET NULL
  -- ON DELETE SET NULL = se o projeto for deletado, a tarefa fica "solta" (projeto_id = NULL)
);

CREATE INDEX IF NOT EXISTS idx_tarefas_status    ON tarefas(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_vencimento ON tarefas(vencimento);
CREATE INDEX IF NOT EXISTS idx_tarefas_projeto   ON tarefas(projeto_id);

-- 12. SUB-TAREFAS (depende de tarefas)
CREATE TABLE IF NOT EXISTS sub_tarefas (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  tarefa_id INTEGER NOT NULL,
  nome      TEXT    NOT NULL,
  concluida INTEGER DEFAULT 0,
  ordem     INTEGER DEFAULT 0,
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE
);

-- 13. TAREFA-TAGS (tabela intermediária N:N)
-- Uma tarefa pode ter várias tags, e uma tag pode estar em várias tarefas
CREATE TABLE IF NOT EXISTS tarefa_tags (
  tarefa_id INTEGER NOT NULL,
  tag_id    INTEGER NOT NULL,
  PRIMARY KEY (tarefa_id, tag_id),               -- A combinação é única
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)    REFERENCES tags(id)    ON DELETE CASCADE
);

-- 14. METAS (depende de users, projetos)
CREATE TABLE IF NOT EXISTS metas (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  nome        TEXT    NOT NULL,
  descricao   TEXT    DEFAULT '',
  valor_atual REAL    NOT NULL DEFAULT 0,
  valor_alvo  REAL    NOT NULL,
  data_alvo   TEXT,
  projeto_id  INTEGER,
  criado_em   TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE SET NULL
);

-- 15. EVENTOS DO CRONOGRAMA (depende de users)
CREATE TABLE IF NOT EXISTS eventos (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER NOT NULL,
  nome             TEXT    NOT NULL,
  descricao        TEXT    DEFAULT '',
  tipo             TEXT    NOT NULL
                   CHECK(tipo IN ('com_horario', 'dia_inteiro', 'lembrete')),
  data_inicio      TEXT    NOT NULL,
  data_fim         TEXT,
  horario_inicio   TEXT,
  horario_fim      TEXT,
  recorrencia_tipo TEXT    CHECK(recorrencia_tipo IN ('semanal', 'quinzenal', 'mensal', 'anual')),
  recorrencia_fim  TEXT,
  criado_em        TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos(data_inicio);

-- 16. CADERNOS DE NOTAS (depende de users)
CREATE TABLE IF NOT EXISTS cadernos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL,
  nome      TEXT    NOT NULL,
  cor       TEXT    NOT NULL DEFAULT '#ec4899',
  criado_em TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 17. NOTAS (depende de users, cadernos, projetos)
CREATE TABLE IF NOT EXISTS notas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL,
  titulo       TEXT    NOT NULL DEFAULT 'Sem título',
  conteudo     TEXT    DEFAULT '',               -- Conteúdo em Markdown
  caderno_id   INTEGER,
  projeto_id   INTEGER,
  criado_em    TEXT    DEFAULT (datetime('now')),
  atualizado_em TEXT   DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (caderno_id) REFERENCES cadernos(id)  ON DELETE SET NULL,
  FOREIGN KEY (projeto_id) REFERENCES projetos(id)  ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_notas_caderno    ON notas(caderno_id);
CREATE INDEX IF NOT EXISTS idx_notas_projeto    ON notas(projeto_id);
CREATE INDEX IF NOT EXISTS idx_notas_atualizado ON notas(atualizado_em);

-- 18. HÁBITOS (depende de users)
CREATE TABLE IF NOT EXISTS habitos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL,
  nome      TEXT    NOT NULL,
  criado_em TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 19. REGISTROS DE HÁBITOS DIÁRIOS (depende de habitos)
CREATE TABLE IF NOT EXISTS habito_checks (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  habito_id INTEGER NOT NULL,
  data      TEXT    NOT NULL,                    -- Formato: 'YYYY-MM-DD'
  checked   INTEGER NOT NULL DEFAULT 1,
  UNIQUE(habito_id, data),                       -- Um check por hábito por dia
  FOREIGN KEY (habito_id) REFERENCES habitos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_habito_checks_data ON habito_checks(data);
```

---

### Passo 2.4 — Criar os dados iniciais (Seeds)

**O que são Seeds?**
São dados iniciais que precisamos inserir quando o banco é criado pela primeira vez. Por exemplo: o usuário padrão para fazer login e categorias financeiras comuns.

Crie o arquivo `backend/db/seeds.sql`:

```sql
-- =============================================================
-- SEEDS — DADOS INICIAIS DO MYFINANCE
-- Execute APÓS criar o schema
-- =============================================================

-- USUÁRIO PADRÃO
-- A senha abaixo é o hash bcrypt de "admin123"
-- Você pode trocar depois nas configurações
INSERT OR IGNORE INTO users (id, nome, email, senha_hash) VALUES (
  1,
  'Admin',
  'admin@myfinance.com',
  '$2b$10$rOzJqhpZTOhXUv5bHKdOuuXjKbgr8.ZjQqh8XKv5hqJRNl6KWi3qy'
);

-- CONFIGURAÇÃO PADRÃO do usuário
INSERT OR IGNORE INTO configuracoes (user_id, moeda, fuso_horario, inicio_semana, tema, habito_reset_hora)
VALUES (1, 'BRL', 'America/Sao_Paulo', 'dom', 'dark', '00:00');

-- CATEGORIAS PADRÃO
-- INSERT OR IGNORE evita erro se já existirem
INSERT OR IGNORE INTO categorias (user_id, nome, icone, cor, tipo) VALUES
(1, 'Salário',      '💰', '#22c55e', 'receita'),
(1, 'Freelance',    '💻', '#06b6d4', 'receita'),
(1, 'Outros',       '📥', '#a3a3a3', 'receita'),
(1, 'Alimentação',  '🍕', '#ef4444', 'despesa'),
(1, 'Moradia',      '🏠', '#f59e0b', 'despesa'),
(1, 'Transporte',   '🚗', '#3b82f6', 'despesa'),
(1, 'Saúde',        '💊', '#ec4899', 'despesa'),
(1, 'Educação',     '📚', '#8b5cf6', 'despesa'),
(1, 'Lazer',        '🎮', '#f97316', 'despesa'),
(1, 'Compras',      '🛒', '#6b7280', 'despesa'),
(1, 'Outros',       '📎', '#9ca3af', 'despesa');
```

---

### Passo 2.5 — Criar o script de inicialização do banco

Crie o arquivo `backend/db/init.js`:

```javascript
// Este arquivo inicializa o banco de dados criando todas as tabelas
// e inserindo os dados iniciais. Deve ser executado UMA vez antes de
// iniciar o servidor pela primeira vez.

const fs   = require('fs')    // Módulo para ler arquivos
const path = require('path')
const db   = require('./database')

console.log('🔧 Inicializando banco de dados...')

// Lemos o arquivo schema.sql como texto
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')

// Lemos o arquivo seeds.sql como texto
const seeds  = fs.readFileSync(path.join(__dirname, 'seeds.sql'),  'utf-8')

// db.exec() executa múltiplos comandos SQL de uma vez
// Diferente do db.prepare() que executa um comando por vez
try {
  db.exec(schema)
  console.log('✅ Tabelas criadas com sucesso!')

  db.exec(seeds)
  console.log('✅ Dados iniciais inseridos!')

  console.log('🎉 Banco de dados pronto em: backend/db/myfinance.db')
} catch (erro) {
  console.error('❌ Erro ao inicializar banco:', erro.message)
  process.exit(1) // Encerra o processo com código de erro
}
```

**Para executar este script:**
```bash
cd backend
node db/init.js
```

Você verá no terminal:
```
🔧 Inicializando banco de dados...
✅ Tabelas criadas com sucesso!
✅ Dados iniciais inseridos!
🎉 Banco de dados pronto em: backend/db/myfinance.db
```

---

## 🔵 FASE 3 — Servidor Back-end (Express) {#fase-3}

### O que é esta fase?
O servidor é o "cérebro" do back-end. Ele recebe requisições do front-end (como "me dê as tarefas") e devolve respostas (como "aqui estão 5 tarefas").

---

### Passo 3.1 — Entender o fluxo de uma requisição

```
Navegador (front-end)
       |
       | HTTP Request: GET /api/tarefas
       |
       ↓
    Servidor Express (back-end)
       |
       | Passa pelos Middlewares (segurança, autenticação, parsing)
       |
       ↓
    Router (qual função vai tratar?)
       |
       | Chama o Controller correto
       |
       ↓
    Controller → Service → Model → Banco de Dados
       |
       | Resultado: [{id: 1, nome: "Estudar"}, ...]
       |
       ↓
    Response: JSON { dados: [...] }
       |
       ↓
Navegador (front-end) recebe os dados
```

---

### Passo 3.2 — Criar o middleware de autenticação

Crie o arquivo `backend/middleware/auth.js`:

```javascript
// Este middleware verifica se o usuário está logado antes de
// permitir acesso às rotas protegidas.

// "Middleware" = função que fica no meio do caminho entre a requisição e a resposta
// Recebe (req, res, next) e decide se deixa passar (next()) ou bloqueia (res.status(401))

function requireAuth(req, res, next) {
  // req.session.userId é definido quando o usuário faz login
  // Se não existir, o usuário não está autenticado
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ erro: 'Não autenticado. Faça login primeiro.' })
    // status(401) = HTTP 401 Unauthorized
  }

  // Se chegou aqui, o usuário está logado
  // next() = "pode passar para a próxima função"
  next()
}

module.exports = { requireAuth }
```

---

### Passo 3.3 — Criar o middleware de rate-limit

Crie o arquivo `backend/middleware/rateLimit.js`:

```javascript
const rateLimit = require('express-rate-limit')

// Limita requisições para evitar ataques de força bruta
// Ex: alguém tentando milhares de senhas por segundo

// Limite geral da API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 500,                  // Máximo 500 requisições por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas requisições. Tente novamente em 15 minutos.' }
})

// Limite mais estrito para login (evitar força bruta de senhas)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                   // Máximo 10 tentativas de login por janela
  message: { erro: 'Muitas tentativas de login. Aguarde 15 minutos.' }
})

module.exports = { apiLimiter, loginLimiter }
```

---

### Passo 3.4 — Criar o middleware de erro centralizado

Crie o arquivo `backend/middleware/errorHandler.js`:

```javascript
// Este middleware captura todos os erros não tratados do servidor
// e devolve uma resposta amigável ao invés de travar

function errorHandler(err, req, res, next) {
  // Logamos o erro no console para depuração
  console.error('❌ Erro não tratado:', err.stack)

  // Em produção, não devemos expor detalhes do erro ao cliente
  const isDev = process.env.NODE_ENV === 'development'

  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno do servidor',
    // Em desenvolvimento mostramos mais detalhes, em produção não
    detalhes: isDev ? err.stack : undefined
  })
}

module.exports = errorHandler
```

---

### Passo 3.5 — Criar o servidor principal

Substitua o conteúdo de `backend/server.js`:

```javascript
// =============================================================
// SERVIDOR PRINCIPAL — MyFinance
// =============================================================

// Carregamos as variáveis do arquivo .env
// (PORT, SESSION_SECRET, etc.)
require('dotenv').config()

const express      = require('express')
const session      = require('express-session')
const SQLiteStore  = require('connect-sqlite3')(session) // Armazena sessões no SQLite
const helmet       = require('helmet')
const cors         = require('cors')
const path         = require('path')

const { apiLimiter }  = require('./middleware/rateLimit')
const errorHandler    = require('./middleware/errorHandler')

// Criamos a aplicação Express
const app  = express()
const PORT = process.env.PORT || 3000

// =============================================================
// MIDDLEWARES DE SEGURANÇA
// (Toda requisição passa por estes filtros primeiro)
// =============================================================

// helmet() adiciona ~15 cabeçalhos HTTP de segurança automaticamente
// Ex: previne clickjacking, XSS, sniffing de MIME type, etc.
app.use(helmet({
  contentSecurityPolicy: false // Desativamos CSP pois usamos CDN (Chart.js, etc.)
}))

// cors() define quem pode fazer requisições para esta API
// Em desenvolvimento, permitimos localhost
// Em produção, permitimos apenas o domínio do GitHub Pages
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL   // Variável do .env com URL do GitHub Pages
    : 'http://localhost:5500',   // Live Server padrão do VS Code
  credentials: true              // Permite envio de cookies na requisição
}))

// express.json() permite que o servidor leia o body das requisições em JSON
// Sem isso, req.body seria undefined
app.use(express.json())

// Aplicamos o limitador de requisições em todas as rotas /api/
app.use('/api/', apiLimiter)

// =============================================================
// SESSÕES (LOGIN)
// =============================================================

app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db',          // Nome do arquivo onde as sessões são salvas
    dir: path.join(__dirname, 'db') // Pasta onde o arquivo fica
  }),
  secret: process.env.SESSION_SECRET, // Chave para assinar o cookie
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,             // Cookie não acessível por JavaScript (segurança)
    secure: process.env.NODE_ENV === 'production', // HTTPS obrigatório em produção
    sameSite: 'lax',            // Proteção contra CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias em milissegundos
  }
}))

// =============================================================
// ROTAS
// =============================================================

// Rota de health check — verifica se o servidor está no ar
app.get('/', (req, res) => {
  res.json({
    mensagem: '✅ API MyFinance no ar!',
    versao: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// Importamos o roteador principal que agrupa todas as rotas
// Criamos este arquivo no próximo passo
const routes = require('./routes')
app.use('/api', routes)

// =============================================================
// MIDDLEWARE DE ERRO (deve ser o ÚLTIMO middleware)
// =============================================================
app.use(errorHandler)

// =============================================================
// INICIAR SERVIDOR
// =============================================================
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`)
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`)
  console.log(`⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}\n`)
})
```

---

### Passo 3.6 — Criar o roteador central

Crie o arquivo `backend/routes/index.js`:

```javascript
// Este arquivo agrupa todas as rotas da API em um único lugar
// É o "mapa" completo de URLs da API

const express = require('express')
const router  = express.Router()

// Importaremos as rotas de cada módulo aqui
// (vamos criar esses arquivos nas próximas fases)

// Por enquanto, criamos uma rota de status para testar
router.get('/status', (req, res) => {
  res.json({ status: 'ok', hora: new Date().toISOString() })
})

// À medida que criar os módulos, adicione aqui:
// const authRoutes      = require('../modules/auth/auth.controller')
// const tarefasRoutes   = require('../modules/tarefas/tarefas.controller')
// ...
// router.use('/auth',     authRoutes)
// router.use('/tarefas',  tarefasRoutes)

module.exports = router
```

---

### Passo 3.7 — Atualizar o package.json com scripts úteis

Abra o `backend/package.json` e substitua a seção `"scripts"`:

```json
{
  "name": "myfinance-backend",
  "version": "1.0.0",
  "description": "Back-end do MyFinance — API RESTful com Express e SQLite",
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "start":   "node server.js",
    "dev":     "nodemon server.js",
    "init-db": "node db/init.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "better-sqlite3": "^12.8.0",
    "connect-sqlite3": "^0.9.15",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "express-rate-limit": "^7.5.0",
    "express-session": "^1.18.1",
    "helmet": "^8.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

**Scripts disponíveis:**
```bash
npm run init-db   # Cria as tabelas e insere os dados iniciais
npm run dev       # Inicia o servidor com auto-reload (para desenvolvimento)
npm start         # Inicia o servidor normal (para produção)
```

---

### Passo 3.8 — Testar o servidor

```bash
# Primeiro, inicialize o banco (se ainda não fez)
cd backend
npm run init-db

# Depois inicie o servidor
npm run dev
```

Abra o navegador em `http://localhost:3000`.
Você deve ver:
```json
{
  "mensagem": "✅ API MyFinance no ar!",
  "versao": "1.0.0",
  "timestamp": "2026-06-15T..."
}
```

> 🎉 **Parabéns!** O servidor está rodando! Agora vamos implementar o login.

---

## 🔴 FASE 4 — Autenticação (Login) {#fase-4}

### O que é esta fase?
Vamos criar o sistema de login. Quando você abre o app, ele verifica se você está logado. Se não estiver, mostra a tela de login. Após entrar com email e senha, o servidor cria uma "sessão" que prova quem você é em todas as requisições seguintes.

---

### Passo 4.1 — Criar o Model de Auth

**O que é um Model?**
É o arquivo responsável por **falar com o banco de dados**. Ele tem funções como "buscar usuário por email", "atualizar senha", etc. Não faz lógica — só consulta o banco.

Crie o arquivo `backend/modules/auth/auth.model.js`:

```javascript
// O Model é a camada que fala diretamente com o banco de dados
// Pense nele como o "repositório" de dados do usuário

const db = require('../../db/database')

const AuthModel = {
  // Busca um usuário pelo email
  // Usado no login para verificar se o usuário existe
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    // .get() retorna um objeto (1 linha) ou undefined
    // O ? é um placeholder para evitar SQL Injection
  },

  // Busca um usuário pelo ID (sem retornar a senha!)
  // Usado para verificar a sessão ativa
  findById(id) {
    return db.prepare(
      'SELECT id, nome, email, avatar, criado_em FROM users WHERE id = ?'
    ).get(id)
    // Note: não incluímos senha_hash por segurança
  },

  // Cria um novo usuário (para o seed ou futuro cadastro)
  create({ nome, email, senhaHash }) {
    const result = db.prepare(
      'INSERT INTO users (nome, email, senha_hash) VALUES (?, ?, ?)'
    ).run(nome, email, senhaHash)

    return result.lastInsertRowid // Retorna o ID do usuário criado
  },

  // Atualiza informações do usuário
  update(id, { nome, avatar }) {
    return db.prepare(
      'UPDATE users SET nome = ?, avatar = ? WHERE id = ?'
    ).run(nome, avatar, id)
  }
}

module.exports = AuthModel
```

---

### Passo 4.2 — Criar o Service de Auth

**O que é um Service?**
É onde fica a **lógica de negócio**. Exemplo: no login, a lógica é "buscar usuário por email" + "comparar a senha com o hash". O Controller chama o Service, e o Service usa o Model.

Crie o arquivo `backend/modules/auth/auth.service.js`:

```javascript
// O Service contém a lógica de negócio da autenticação
// Ele usa o Model para acessar o banco e aplica regras

const bcrypt    = require('bcrypt')
const AuthModel = require('./auth.model')

const AuthService = {
  // Tenta logar com email e senha
  // Retorna o usuário se as credenciais forem válidas, null se inválidas
  async login(email, senha) {
    // 1. Busca o usuário pelo email
    const user = AuthModel.findByEmail(email)

    // 2. Se não encontrou, retorna null (não existe este email)
    if (!user) return null

    // 3. Compara a senha digitada com o hash salvo no banco
    // bcrypt.compare() é assíncrono (por isso usamos await)
    // Ela NUNCA revela o hash — apenas diz se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash)

    // 4. Se a senha está errada, retorna null
    if (!senhaCorreta) return null

    // 5. Retorna o usuário sem a senha (por segurança)
    const { senha_hash, ...userSemSenha } = user
    return userSemSenha
    // O spread "..." pega todas as propriedades EXCETO senha_hash
  },

  // Retorna os dados do usuário logado pelo ID da sessão
  getMe(userId) {
    return AuthModel.findById(userId)
  },

  // Utilitário para criar hash de senha (usado no seed)
  async hashSenha(senha) {
    const saltRounds = 10 // Fator de custo — maior = mais seguro mas mais lento
    return bcrypt.hash(senha, saltRounds)
  }
}

module.exports = AuthService
```

---

### Passo 4.3 — Criar o Controller de Auth

**O que é um Controller?**
É o "gerente de tráfego". Recebe a requisição HTTP, chama o Service adequado, e devolve a resposta ao cliente. É responsável por validar o formato dos dados de entrada.

Crie o arquivo `backend/modules/auth/auth.controller.js`:

```javascript
// O Controller gerencia as requisições HTTP de autenticação

const express     = require('express')
const router      = express.Router()
const AuthService = require('./auth.service')
const { requireAuth } = require('../../middleware/auth')
const { loginLimiter } = require('../../middleware/rateLimit')

// POST /api/auth/login — Faz login
// loginLimiter = aplica o limite de tentativas ANTES de processar
router.post('/login', loginLimiter, async (req, res) => {
  try {
    // Pegamos email e senha do body da requisição
    const { email, senha } = req.body

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' })
    }

    // Chamamos o Service para verificar as credenciais
    const user = await AuthService.login(email, senha)

    // Se retornou null, as credenciais estão erradas
    if (!user) {
      // Retornamos 401 (Unauthorized) com mensagem vaga por segurança
      // Não dizemos se foi o email ou a senha que estava errado
      return res.status(401).json({ erro: 'Credenciais inválidas' })
    }

    // Se chegou aqui, o login foi bem-sucedido!
    // Salvamos o ID do usuário na sessão
    req.session.userId = user.id

    // Retornamos os dados do usuário (sem senha)
    res.json({ usuario: user, mensagem: 'Login realizado com sucesso!' })

  } catch (erro) {
    // Se ocorrer um erro inesperado, passamos para o errorHandler
    next(erro)
  }
})

// POST /api/auth/logout — Faz logout
router.post('/logout', requireAuth, (req, res) => {
  // req.session.destroy() apaga a sessão do banco de dados
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao fazer logout' })
    }

    // Também limpamos o cookie no navegador
    res.clearCookie('connect.sid')
    res.json({ mensagem: 'Logout realizado com sucesso!' })
  })
})

// GET /api/auth/me — Retorna dados do usuário logado
// requireAuth = middleware que verifica se está logado
router.get('/me', requireAuth, (req, res) => {
  const user = AuthService.getMe(req.session.userId)

  if (!user) {
    return res.status(404).json({ erro: 'Usuário não encontrado' })
  }

  res.json({ usuario: user })
})

module.exports = router
```

---

### Passo 4.4 — Registrar as rotas de auth no roteador central

Abra `backend/routes/index.js` e adicione:

```javascript
const express     = require('express')
const router      = express.Router()
const authRoutes  = require('../modules/auth/auth.controller')

// Rota de status
router.get('/status', (req, res) => {
  res.json({ status: 'ok', hora: new Date().toISOString() })
})

// Rotas de autenticação (prefixo /api/auth/)
router.use('/auth', authRoutes)

// (Vamos adicionar mais rotas aqui conforme criar os módulos)

module.exports = router
```

---

### Passo 4.5 — Testar o login

Com o servidor rodando (`npm run dev`), abra outro terminal e teste com curl:

```bash
# Tentar logar
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@myfinance.com","senha":"admin123"}'

# Resposta esperada:
# {"usuario":{"id":1,"nome":"Admin","email":"admin@myfinance.com",...},"mensagem":"Login realizado!"}
```

---

## 🟣 FASE 5 — Hub e Sidebar (Front-end Base) {#fase-5}

### O que é esta fase?
Vamos construir a interface visual do app — a tela principal (Hub com os 7 cards) e a barra lateral (Sidebar que aparece ao entrar em um módulo).

---

### Passo 5.1 — Criar os tokens de design (variáveis CSS)

Crie o arquivo `frontend/styles/variables.css`:

```css
/* =============================================================
   TOKENS DE DESIGN — MyFinance
   Variáveis CSS que definem toda a identidade visual do app.
   Alterar aqui reflete em TODA a interface automaticamente.
   ============================================================= */

:root {
  /* ---- CORES DE FUNDO (do mais escuro ao mais claro) ---- */
  --bg-deepest:  #0a0a0a;   /* Fundo mais escuro (fora do app) */
  --bg-deep:     #0f0f0f;   /* Fundo do body */
  --bg-base:     #1a1a1a;   /* Fundo principal dos painéis */
  --bg-raised:   #222222;   /* Cards, modais, inputs */
  --bg-hover:    #2a2a2a;   /* Estado hover de elementos */

  /* ---- BORDAS ---- */
  --border-subtle:  #1e1e1e;  /* Separadores muito sutis */
  --border-default: #2a2a2a;  /* Bordas padrão */

  /* ---- TEXTO ---- */
  --text-primary:   #f5f5f5;  /* Texto principal (quase branco) */
  --text-secondary: #a3a3a3;  /* Texto secundário (cinza médio) */
  --text-muted:     #525252;  /* Texto apagado (placeholder, datas) */

  /* ---- ESTADOS ---- */
  --success:  #22c55e;  /* Verde — receitas, concluído */
  --danger:   #ef4444;  /* Vermelho — despesas, erro, prazo vencido */
  --warning:  #f59e0b;  /* Amarelo — alertas, pendente */

  /* ---- CORES DOS MÓDULOS ---- */
  --color-financas:   #8b5cf6;  /* Roxo */
  --color-tarefas:    #3b82f6;  /* Azul */
  --color-metas:      #f59e0b;  /* Amarelo */
  --color-cronograma: #10b981;  /* Verde */
  --color-notas:      #ec4899;  /* Rosa */
  --color-habitos:    #06b6d4;  /* Ciano */
  --color-projetos:   #f97316;  /* Laranja */

  /* ---- TIPOGRAFIA ---- */
  --font-sans:  'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:  'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

  /* ---- ESPAÇAMENTOS ---- */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;

  /* ---- RAIOS DE BORDA ---- */
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   16px;
  --radius-full: 9999px;  /* Círculo perfeito */

  /* ---- SOMBRAS ---- */
  --shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md:  0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-lg:  0 8px 32px rgba(0, 0, 0, 0.6);

  /* ---- TRANSIÇÕES ---- */
  --transition-fast:   150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow:   400ms ease;  /* Animação da sidebar */

  /* ---- SIDEBAR ---- */
  --sidebar-width: 64px;
}
```

---

### Passo 5.2 — Criar o reset CSS

Crie o arquivo `frontend/styles/reset.css`:

```css
/* =============================================================
   RESET CSS — Remove estilos padrão dos navegadores
   Garante que o app tenha a mesma aparência em todos os browsers
   ============================================================= */

*, *::before, *::after {
  box-sizing: border-box;  /* Padding e border não aumentam o tamanho do elemento */
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-deep);
  color: var(--text-primary);
  line-height: 1.5;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;  /* Suaviza fontes no macOS/Chrome */
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
  font-size: inherit;
}

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
}

ul, ol {
  list-style: none;
}

img {
  display: block;
  max-width: 100%;
}
```

---

### Passo 5.3 — Criar os estilos base globais

Crie o arquivo `frontend/styles/base.css`:

```css
/* =============================================================
   BASE CSS — Estilos globais usados em todo o app
   ============================================================= */

/* Scrollbar personalizada (apenas Chrome/Edge) */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-base);
}

::-webkit-scrollbar-thumb {
  background: var(--border-default);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Utilitários de texto */
.text-primary   { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-muted     { color: var(--text-muted); }
.text-success   { color: var(--success); }
.text-danger    { color: var(--danger); }
.text-warning   { color: var(--warning); }

/* Utilitários de layout */
.flex       { display: flex; }
.flex-col   { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-sm     { gap: var(--space-sm); }
.gap-md     { gap: var(--space-md); }
.gap-lg     { gap: var(--space-lg); }

/* Estado de carregamento */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-raised) 25%,
    var(--bg-hover) 50%,
    var(--bg-raised) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes skeleton-loading {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Transição de tela (fade in/out) */
.page-transition {
  animation: fadeIn var(--transition-slow) ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

### Passo 5.4 — Criar o HTML principal do Hub

Substitua o conteúdo do arquivo `frontend/index.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="MyFinance — Seu life manager pessoal: finanças, tarefas, metas, cronograma, notas, hábitos e projetos.">
  <title>MyFinance — Hub</title>

  <!-- Google Fonts: Inter e JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">

  <!-- Nossos estilos (ordem importa!) -->
  <link rel="stylesheet" href="styles/variables.css">
  <link rel="stylesheet" href="styles/reset.css">
  <link rel="stylesheet" href="styles/base.css">
  <link rel="stylesheet" href="styles/hub.css">
  <link rel="stylesheet" href="components/sidebar/sidebar.css">
</head>
<body>

  <!-- ======================================================
       TELA DE LOGIN
       Visível quando o usuário não está autenticado
       ====================================================== -->
  <div id="tela-login" class="login-overlay">
    <div class="login-card">
      <div class="login-logo">
        <span class="login-logo-icon">◉</span>
        <h1 class="login-titulo">MyFinance</h1>
        <p class="login-subtitulo">Seu life manager pessoal</p>
      </div>

      <form id="form-login" class="login-form" novalidate>
        <div class="input-group">
          <label for="login-email">Email</label>
          <input
            type="email"
            id="login-email"
            name="email"
            placeholder="admin@myfinance.com"
            autocomplete="email"
            required
          >
        </div>

        <div class="input-group">
          <label for="login-senha">Senha</label>
          <input
            type="password"
            id="login-senha"
            name="senha"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          >
        </div>

        <p id="login-erro" class="login-erro" hidden></p>

        <button type="submit" id="btn-login" class="btn-login">
          Entrar
        </button>
      </form>
    </div>
  </div>

  <!-- ======================================================
       APLICAÇÃO PRINCIPAL
       Visível apenas quando o usuário está logado
       ====================================================== -->
  <div id="app" class="app" hidden>

    <!-- SIDEBAR (aparece ao entrar em um módulo) -->
    <aside id="sidebar" class="sidebar sidebar--hidden">
      <nav class="sidebar-nav">
        <!-- Botão voltar ao Hub -->
        <button id="btn-hub" class="sidebar-btn sidebar-btn--home" title="Voltar ao Hub" aria-label="Voltar ao Hub">
          ◉
        </button>

        <div class="sidebar-divider"></div>

        <!-- Ícones dos módulos -->
        <button class="sidebar-btn" data-modulo="financas"   title="Finanças"   aria-label="Finanças">💰</button>
        <button class="sidebar-btn" data-modulo="tarefas"    title="Tarefas"    aria-label="Tarefas">✓</button>
        <button class="sidebar-btn" data-modulo="metas"      title="Metas"      aria-label="Metas">🎯</button>
        <button class="sidebar-btn" data-modulo="cronograma" title="Cronograma" aria-label="Cronograma">📅</button>
        <button class="sidebar-btn" data-modulo="notas"      title="Notas"      aria-label="Notas">📝</button>
        <button class="sidebar-btn" data-modulo="habitos"    title="Hábitos"    aria-label="Hábitos">🔥</button>
        <button class="sidebar-btn" data-modulo="projetos"   title="Projetos"   aria-label="Projetos">🚀</button>

        <div class="sidebar-spacer"></div>

        <!-- Configurações (no rodapé da sidebar) -->
        <button class="sidebar-btn" data-modulo="configuracoes" title="Configurações" aria-label="Configurações">⚙</button>
      </nav>
    </aside>

    <!-- ÁREA PRINCIPAL (Hub ou módulo ativo) -->
    <main id="conteudo-principal" class="conteudo-principal">

      <!-- HUB — Tela inicial com os 7 cards -->
      <section id="hub" class="hub page-transition">
        <header class="hub-header">
          <div>
            <h1 id="hub-saudacao" class="hub-saudacao">Bom dia!</h1>
            <p id="hub-data" class="hub-data"></p>
          </div>
          <div class="hub-header-acoes">
            <span id="hub-usuario" class="hub-usuario"></span>
            <button id="btn-logout" class="btn-logout" title="Sair">Sair</button>
          </div>
        </header>

        <!-- Grid dos 7 cards dos módulos -->
        <div class="hub-grid" id="hub-grid">
          <!-- Os cards são gerados pelo JavaScript (app.js) -->
          <!-- Skeleton loading enquanto carrega -->
          <div class="hub-card skeleton" style="height:180px"></div>
          <div class="hub-card skeleton" style="height:180px"></div>
          <div class="hub-card skeleton" style="height:180px"></div>
          <div class="hub-card skeleton" style="height:180px"></div>
          <div class="hub-card skeleton" style="height:180px"></div>
          <div class="hub-card skeleton" style="height:180px"></div>
          <div class="hub-card skeleton" style="height:180px"></div>
        </div>
      </section>

      <!-- PLACEHOLDER — Área onde os módulos são carregados -->
      <section id="modulo-ativo" class="modulo-ativo" hidden></section>

    </main>
  </div>

  <!-- Script principal (ES Module) -->
  <script type="module" src="app.js"></script>

</body>
</html>
```

---

### Passo 5.5 — Criar os estilos do Hub

Crie o arquivo `frontend/styles/hub.css`:

```css
/* =============================================================
   HUB — Estilos da tela principal (spotlight)
   ============================================================= */

/* ---- OVERLAY DE LOGIN ---- */
.login-overlay {
  position: fixed;
  inset: 0;                   /* top:0 right:0 bottom:0 left:0 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-deepest);
  z-index: 1000;
  animation: fadeIn 0.4s ease;
}

.login-card {
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.login-logo {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.login-logo-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--space-sm);
  color: var(--color-financas);
}

.login-titulo {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.login-subtitulo {
  color: var(--text-secondary);
  margin-top: var(--space-xs);
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.input-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.input-group input {
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 10px var(--space-md);
  color: var(--text-primary);
  transition: border-color var(--transition-fast);
}

.input-group input:focus {
  outline: none;
  border-color: var(--color-financas);
}

.login-erro {
  color: var(--danger);
  font-size: 14px;
  text-align: center;
}

.btn-login {
  background: var(--color-financas);
  color: white;
  font-weight: 600;
  padding: 12px;
  border-radius: var(--radius-md);
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.btn-login:hover  { opacity: 0.9; }
.btn-login:active { transform: scale(0.98); }

/* ---- LAYOUT PRINCIPAL ---- */
.app {
  display: flex;
  min-height: 100vh;
}

.conteudo-principal {
  flex: 1;
  overflow-y: auto;
  min-height: 100vh;
}

/* ---- HUB HEADER ---- */
.hub {
  padding: var(--space-2xl);
  max-width: 1200px;
  margin: 0 auto;
}

.hub-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-2xl);
}

.hub-saudacao {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.hub-data {
  color: var(--text-secondary);
  margin-top: var(--space-xs);
  font-size: 15px;
}

.hub-header-acoes {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.hub-usuario {
  font-size: 14px;
  color: var(--text-secondary);
}

.btn-logout {
  font-size: 13px;
  color: var(--text-muted);
  padding: 6px 12px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.btn-logout:hover {
  color: var(--danger);
  border-color: var(--danger);
}

/* ---- GRID DOS CARDS ---- */
.hub-grid {
  display: grid;
  /* 4 colunas em desktop, ajusta automaticamente */
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
}

/* ---- CARD DE MÓDULO ---- */
.hub-card {
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: transform var(--transition-normal),
              border-color var(--transition-normal),
              box-shadow var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.hub-card::before {
  /* Barra colorida no topo do card */
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--card-color, var(--text-muted));
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.hub-card:hover {
  transform: translateY(-4px);
  border-color: var(--card-color, var(--border-default));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.hub-card:hover::before {
  opacity: 1;
}

.hub-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.hub-card-icone {
  font-size: 24px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--card-color) 15%, transparent);
}

.hub-card-nome {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-secondary);
}

.hub-card-conteudo {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.hub-card-principal {
  font-size: 28px;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.hub-card-detalhe {
  font-size: 13px;
  color: var(--text-muted);
}

/* ---- RESPONSIVO ---- */
@media (max-width: 1024px) {
  .hub-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .hub { padding: var(--space-md); }
  .hub-grid { grid-template-columns: repeat(2, 1fr); }
  .hub-saudacao { font-size: 24px; }
}

@media (max-width: 480px) {
  .hub-grid { grid-template-columns: 1fr; }
}
```

---

### Passo 5.6 — Criar os estilos da Sidebar

Crie o arquivo `frontend/components/sidebar/sidebar.css`:

```css
/* =============================================================
   SIDEBAR — Menu lateral que surge ao entrar em um módulo
   ============================================================= */

.sidebar {
  width: var(--sidebar-width);    /* 64px */
  background: var(--bg-base);
  border-right: 1px solid var(--border-subtle);
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  /* Animação de entrada da esquerda */
  transition: transform var(--transition-slow),
              opacity var(--transition-slow);
}

/* Estado oculto (no Hub) */
.sidebar--hidden {
  transform: translateX(calc(-1 * var(--sidebar-width)));
  opacity: 0;
  pointer-events: none;  /* Não recebe cliques quando invisível */
  width: 0;
}

/* Navegação da sidebar */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-md) 0;
  height: 100%;
  gap: var(--space-xs);
}

/* Botões da sidebar */
.sidebar-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 20px;
  color: var(--text-muted);
  transition: background var(--transition-fast),
              color var(--transition-fast),
              box-shadow var(--transition-fast);
  position: relative;
}

.sidebar-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

/* Estado ativo (módulo atual) */
.sidebar-btn--active {
  color: var(--text-primary);
  background: var(--bg-hover);
  /* Barra colorida na esquerda do botão ativo */
  box-shadow: inset 3px 0 0 var(--modulo-color, var(--text-primary));
}

/* Botão Home (◉) */
.sidebar-btn--home {
  font-size: 24px;
  color: var(--text-secondary);
}

.sidebar-btn--home:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

/* Divisor */
.sidebar-divider {
  width: 32px;
  height: 1px;
  background: var(--border-subtle);
  margin: var(--space-xs) 0;
}

/* Empurra o botão de config para o rodapé */
.sidebar-spacer {
  flex: 1;
}

/* Tooltip (nome do módulo ao hover) */
.sidebar-btn::after {
  content: attr(title);
  position: absolute;
  left: calc(100% + var(--space-sm));
  background: var(--bg-raised);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-default);
  opacity: 0;
  pointer-events: none;
  transform: translateX(-4px);
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.sidebar-btn:hover::after {
  opacity: 1;
  transform: translateX(0);
}
```

---

### Passo 5.7 — Criar o arquivo utilitário de API

Crie o arquivo `frontend/utils/api.js`:

```javascript
// =============================================================
// UTILITÁRIO DE API — Wrapper do fetch
// Centraliza todas as chamadas HTTP ao back-end
// =============================================================

// URL base da API (muda entre desenvolvimento e produção)
const API_BASE = 'http://localhost:3000/api'

// Função base que todas as outras chamadas usam
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`

  const config = {
    credentials: 'include',  // ESSENCIAL: envia o cookie de sessão em toda requisição
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  const response = await fetch(url, config)

  // Se a resposta não for OK (2xx), lança um erro
  if (!response.ok) {
    const erro = await response.json().catch(() => ({ erro: 'Erro desconhecido' }))
    throw new Error(erro.erro || `Erro HTTP ${response.status}`)
  }

  // Se não tiver corpo (ex: DELETE com status 204), retorna null
  if (response.status === 204) return null

  return response.json()
}

// Atalhos para cada método HTTP
const api = {
  get:    (endpoint)       => request(endpoint),
  post:   (endpoint, body) => request(endpoint, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (endpoint, body) => request(endpoint, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (endpoint, body) => request(endpoint, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (endpoint)       => request(endpoint, { method: 'DELETE' }),
}

export default api
// "export default" = permite importar em outros arquivos com:
// import api from './utils/api.js'
```

---

### Passo 5.8 — Criar o app.js principal (roteador SPA)

Crie o arquivo `frontend/app.js`:

```javascript
// =============================================================
// APP.JS — Roteador SPA e controlador do Hub
// SPA = Single Page Application (não recarrega a página ao navegar)
// =============================================================

import api from './utils/api.js'

// ---- REFERÊNCIAS AOS ELEMENTOS DO DOM ----
const telaLogin     = document.getElementById('tela-login')
const appEl         = document.getElementById('app')
const formLogin     = document.getElementById('form-login')
const loginErro     = document.getElementById('login-erro')
const hubSaudacao   = document.getElementById('hub-saudacao')
const hubData       = document.getElementById('hub-data')
const hubUsuario    = document.getElementById('hub-usuario')
const hubEl         = document.getElementById('hub')
const hubGrid       = document.getElementById('hub-grid')
const sidebar       = document.getElementById('sidebar')
const moduloAtivo   = document.getElementById('modulo-ativo')
const btnHub        = document.getElementById('btn-hub')
const btnLogout     = document.getElementById('btn-logout')

// ---- ESTADO DA APLICAÇÃO ----
let usuarioAtual = null   // Guarda os dados do usuário logado
let moduloAtualEl = null  // Referência ao módulo carregado

// ---- CONFIGURAÇÃO DOS MÓDULOS ----
// Array com os dados de cada módulo (para gerar os cards e a sidebar)
const MODULOS = [
  {
    id: 'financas',
    nome: 'Finanças',
    icone: '💰',
    cor: 'var(--color-financas)',
    descricao: 'Controle seu dinheiro'
  },
  {
    id: 'tarefas',
    nome: 'Tarefas',
    icone: '✓',
    cor: 'var(--color-tarefas)',
    descricao: 'Organize o que fazer'
  },
  {
    id: 'metas',
    nome: 'Metas',
    icone: '🎯',
    cor: 'var(--color-metas)',
    descricao: 'Acompanhe seu progresso'
  },
  {
    id: 'cronograma',
    nome: 'Cronograma',
    icone: '📅',
    cor: 'var(--color-cronograma)',
    descricao: 'Seus eventos e agenda'
  },
  {
    id: 'notas',
    nome: 'Notas',
    icone: '📝',
    cor: 'var(--color-notas)',
    descricao: 'Escreva e organize'
  },
  {
    id: 'habitos',
    nome: 'Hábitos',
    icone: '🔥',
    cor: 'var(--color-habitos)',
    descricao: 'Construa sua rotina'
  },
  {
    id: 'projetos',
    nome: 'Projetos',
    icone: '🚀',
    cor: 'var(--color-projetos)',
    descricao: 'Gerencie seus projetos'
  }
]

// ====================================================
// AUTENTICAÇÃO
// ====================================================

// Verifica se o usuário já está logado ao abrir o app
async function verificarSessao() {
  try {
    const data = await api.get('/auth/me')
    usuarioAtual = data.usuario
    entrarNoApp()
  } catch {
    // Não está logado → mostra tela de login
    mostrarLogin()
  }
}

function mostrarLogin() {
  telaLogin.hidden = false
  appEl.hidden = true
}

function entrarNoApp() {
  telaLogin.hidden = true
  appEl.hidden = false
  atualizarHubHeader()
  carregarDadosHub()
}

// Evento de submit do formulário de login
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault()  // Impede o comportamento padrão (recarregar página)

  loginErro.hidden = true  // Esconde mensagem de erro anterior
  const btnLogin = document.getElementById('btn-login')
  btnLogin.textContent = 'Entrando...'
  btnLogin.disabled = true

  const email = document.getElementById('login-email').value
  const senha  = document.getElementById('login-senha').value

  try {
    const data = await api.post('/auth/login', { email, senha })
    usuarioAtual = data.usuario
    entrarNoApp()
  } catch (erro) {
    loginErro.textContent = erro.message
    loginErro.hidden = false
  } finally {
    btnLogin.textContent = 'Entrar'
    btnLogin.disabled = false
  }
})

// Evento de logout
btnLogout.addEventListener('click', async () => {
  await api.post('/auth/logout')
  usuarioAtual = null
  mostrarLogin()
})

// ====================================================
// HUB
// ====================================================

function atualizarHubHeader() {
  // Saudação baseada no horário
  const hora = new Date().getHours()
  let saudacao = 'Boa noite'
  if (hora >= 5  && hora < 12) saudacao = 'Bom dia'
  if (hora >= 12 && hora < 18) saudacao = 'Boa tarde'

  hubSaudacao.textContent = `${saudacao}, ${usuarioAtual?.nome?.split(' ')[0] || ''}! 👋`
  hubUsuario.textContent  = usuarioAtual?.email || ''

  // Data formatada
  const hoje = new Date()
  hubData.textContent = hoje.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Carrega os dados dos cards do hub via API
async function carregarDadosHub() {
  try {
    const dados = await api.get('/hub')
    renderizarCards(dados)
  } catch {
    // Se a API do hub não existir ainda, renderiza cards vazios
    renderizarCards({})
  }
}

// Gera os 7 cards no grid do Hub
function renderizarCards(dadosHub) {
  hubGrid.innerHTML = ''  // Limpa os skeletons

  MODULOS.forEach(modulo => {
    const card = document.createElement('div')
    card.className = 'hub-card'
    card.style.setProperty('--card-color', modulo.cor)
    card.setAttribute('data-modulo', modulo.id)
    card.setAttribute('role', 'button')
    card.setAttribute('tabindex', '0')
    card.setAttribute('aria-label', `Abrir módulo ${modulo.nome}`)

    // Conteúdo do card (personalizado por módulo)
    const conteudo = getConteudoCard(modulo.id, dadosHub)

    card.innerHTML = `
      <div class="hub-card-header">
        <span class="hub-card-icone" style="--card-color: ${modulo.cor}">
          ${modulo.icone}
        </span>
        <span class="hub-card-nome">${modulo.nome}</span>
      </div>
      <div class="hub-card-conteudo">
        <span class="hub-card-principal">${conteudo.principal}</span>
        <span class="hub-card-detalhe">${conteudo.detalhe}</span>
      </div>
    `

    // Ao clicar no card, navega para o módulo
    card.addEventListener('click', () => navegarParaModulo(modulo.id))
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') navegarParaModulo(modulo.id)
    })

    hubGrid.appendChild(card)
  })
}

// Retorna o conteúdo a ser exibido em cada card
function getConteudoCard(moduloId, dados) {
  const hub = dados || {}

  const mapa = {
    financas:   {
      principal: hub.financas ? `R$ ${hub.financas.saldo_mes?.toFixed(2) || '0,00'}` : '—',
      detalhe: hub.financas?.ultimo_lancamento || 'Nenhum lançamento'
    },
    tarefas:    {
      principal: hub.tarefas?.pendentes ?? '—',
      detalhe: 'tarefas pendentes'
    },
    metas:      {
      principal: hub.metas?.top3?.[0]?.percentual
        ? `${hub.metas.top3[0].percentual}%`
        : '—',
      detalhe: hub.metas?.top3?.[0]?.nome || 'Nenhuma meta'
    },
    cronograma: {
      principal: hub.cronograma?.proximos_eventos?.length ?? '—',
      detalhe: hub.cronograma?.proximos_eventos?.[0]?.nome || 'Sem eventos hoje'
    },
    notas:      {
      principal: hub.notas?.ultimas?.length ?? '—',
      detalhe: hub.notas?.ultimas?.[0]?.titulo || 'Nenhuma nota recente'
    },
    habitos:    {
      principal: hub.habitos?.streak_atual ?? '—',
      detalhe: `dias seguidos • ${hub.habitos?.feitos_hoje ?? 0}/${hub.habitos?.total_hoje ?? 0} hoje`
    },
    projetos:   {
      principal: hub.projetos?.ativos?.length ?? '—',
      detalhe: 'projetos em andamento'
    }
  }

  return mapa[moduloId] || { principal: '—', detalhe: '' }
}

// ====================================================
// NAVEGAÇÃO ENTRE MÓDULOS
// ====================================================

// Vai do Hub para um módulo
async function navegarParaModulo(moduloId) {
  // 1. Esconde o hub
  hubEl.hidden = true

  // 2. Mostra a sidebar
  sidebar.classList.remove('sidebar--hidden')

  // 3. Marca o botão ativo na sidebar
  document.querySelectorAll('.sidebar-btn[data-modulo]').forEach(btn => {
    btn.classList.toggle('sidebar-btn--active', btn.dataset.modulo === moduloId)
    const modulo = MODULOS.find(m => m.id === btn.dataset.modulo)
    if (modulo) btn.style.setProperty('--modulo-color', modulo.cor)
  })

  // 4. Mostra a área do módulo
  moduloAtivo.hidden = false
  moduloAtivo.innerHTML = `<p style="padding:32px; color: var(--text-secondary)">
    Carregando ${moduloId}...
  </p>`

  // 5. Carrega o módulo dinamicamente (importação sob demanda)
  // Isso é ES Module "lazy loading" — só carrega o módulo quando necessário
  try {
    const modulo = await import(`./modules/${moduloId}/${moduloId}.js`)
    modulo.init(moduloAtivo)  // Cada módulo tem uma função "init"
  } catch (err) {
    moduloAtivo.innerHTML = `
      <div style="padding:32px; color: var(--text-muted)">
        <p>🚧 Módulo "${moduloId}" ainda não implementado.</p>
        <p style="margin-top:8px; font-size:13px">Em breve!</p>
      </div>
    `
  }
}

// Volta do módulo para o Hub
function voltarParaHub() {
  // 1. Esconde a sidebar
  sidebar.classList.add('sidebar--hidden')

  // 2. Limpa o módulo ativo
  moduloAtivo.hidden = true
  moduloAtivo.innerHTML = ''

  // 3. Mostra o Hub
  hubEl.hidden = false
  carregarDadosHub()  // Atualiza os dados dos cards

  // 4. Remove estado ativo da sidebar
  document.querySelectorAll('.sidebar-btn--active').forEach(btn => {
    btn.classList.remove('sidebar-btn--active')
  })
}

// Eventos de navegação
btnHub.addEventListener('click', voltarParaHub)

// Botões da sidebar também podem navegar
document.querySelectorAll('.sidebar-btn[data-modulo]').forEach(btn => {
  btn.addEventListener('click', () => navegarParaModulo(btn.dataset.modulo))
})

// ====================================================
// INICIALIZAR APP
// ====================================================
verificarSessao()
```

---

### Passo 5.9 — Testar o front-end

1. No VS Code, instale a extensão **Live Server**
2. Clique com o botão direito em `frontend/index.html`
3. Selecione **"Open with Live Server"**
4. O navegador abre em `http://localhost:5500`

Você deve ver a **tela de login**. Certifique-se que o servidor back-end está rodando (`npm run dev` na pasta `backend/`).

Faça o login com:
- Email: `admin@myfinance.com`
- Senha: `admin123`

Você deverá ver o **Hub com os 7 cards** e a saudação com seu nome!

---

> 📌 **Continue no próximo arquivo...**
> As fases 6 a 13 (implementação de cada módulo e deploy) serão detalhadas conforme você solicitar.
> O mais importante é que a **fundação (Fases 1 a 5) esteja funcionando perfeitamente** antes de avançar.

---

## 🗺️ Resumo do que já temos implementado

Após completar as Fases 1 a 5, você terá:

| Componente | Status |
|------------|--------|
| Node.js + Express funcionando | ✅ |
| SQLite com 20 tabelas + seeds | ✅ |
| Login/Logout com sessão persistente | ✅ |
| Middlewares de segurança (helmet, cors, rate-limit) | ✅ |
| Hub visual com 7 cards e saudação | ✅ |
| Sidebar animada surgindo ao entrar em módulo | ✅ |
| Navegação entre módulos (lazy loading) | ✅ |
| Design tokens centralizados em CSS | ✅ |
| Utilitário de API com fetch centralizado | ✅ |

O próximo passo será implementar **Fase 6 — Módulo Finanças** (o mais complexo).
