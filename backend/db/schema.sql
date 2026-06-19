-- =============================================================
-- MYFINANCE — SCHEMA DO BANCO DE DADOS
-- Ordem de criação respeita as dependências entre tabelas.
-- Execute via: node db/init.js
-- =============================================================

-- 1. USUÁRIOS
-- Tabela base para quase todo o sistema.
-- Guarda os dados do único usuário do app.
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  senha_hash TEXT    NOT NULL,  -- NUNCA guardar senha pura. Sempre o hash bcrypt.
  avatar     TEXT    DEFAULT '',
  criado_em  TEXT    DEFAULT (datetime('now'))
);

-- 2. CONFIGURAÇÕES
-- Preferências do usuário: moeda, fuso, tema, horário de reset de hábitos.
-- Relação 1:1 com users (cada usuário tem exatamente uma configuração).
CREATE TABLE IF NOT EXISTS configuracoes (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id           INTEGER NOT NULL UNIQUE,
  moeda             TEXT    DEFAULT 'BRL',
  fuso_horario      TEXT    DEFAULT 'America/Sao_Paulo',
  inicio_semana     TEXT    DEFAULT 'dom',        -- 'dom' ou 'seg'
  tema              TEXT    DEFAULT 'dark',
  habito_reset_hora TEXT    DEFAULT '00:00',      -- Hora em que os hábitos resetam
  criado_em         TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3. PERFIS FINANCEIROS
-- Representa contas/carteiras: "Nubank", "Inter", "Carteira física", etc.
-- Permite filtrar transações por conta.
CREATE TABLE IF NOT EXISTS perfis (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL,
  nome      TEXT    NOT NULL,
  cor       TEXT    NOT NULL DEFAULT '#8b5cf6',
  icone     TEXT    NOT NULL DEFAULT '',
  criado_em TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. CATEGORIAS FINANCEIRAS
-- Classifica as transações: "Alimentação", "Salário", "Moradia", etc.
-- tipo: 'receita' (entrada de dinheiro) ou 'despesa' (saída de dinheiro).
CREATE TABLE IF NOT EXISTS categorias (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL,
  nome      TEXT    NOT NULL,
  icone     TEXT    NOT NULL DEFAULT '',
  cor       TEXT    NOT NULL DEFAULT '#6b7280',
  tipo      TEXT    NOT NULL CHECK(tipo IN ('receita', 'despesa')),
  criado_em TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5. TRANSAÇÕES FIXAS
-- Transações que se repetem automaticamente: salário, aluguel, Netflix, etc.
-- ativa = 1 significa que está ativa; ativa = 0 significa pausada.
CREATE TABLE IF NOT EXISTS transacoes_fixas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL,
  tipo         TEXT    NOT NULL CHECK(tipo IN ('receita', 'despesa')),
  nome         TEXT    NOT NULL,
  valor        REAL    NOT NULL,
  dia_mes      INTEGER NOT NULL CHECK(dia_mes BETWEEN 1 AND 31),
  frequencia   TEXT    NOT NULL DEFAULT 'mensal'
               CHECK(frequencia IN ('mensal', 'semanal', 'quinzenal', 'anual')),
  categoria_id INTEGER,
  perfil_id    INTEGER,
  ativa        INTEGER DEFAULT 1,
  data_fim     TEXT,
  criado_em    TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)      REFERENCES users(id),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (perfil_id)    REFERENCES perfis(id)
);

-- 6. TRANSAÇÕES
-- Cada entrada ou saída de dinheiro registrada.
-- fixa_id liga a transação à transacao_fixa que a gerou (se for recorrente).
CREATE TABLE IF NOT EXISTS transacoes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL,
  tipo         TEXT    NOT NULL CHECK(tipo IN ('receita', 'despesa')),
  nome         TEXT    NOT NULL,
  valor        REAL    NOT NULL,
  data         TEXT    NOT NULL,   -- Formato ISO: 'YYYY-MM-DD'
  categoria_id INTEGER,
  perfil_id    INTEGER,
  observacao   TEXT    DEFAULT '',
  fixa_id      INTEGER,            -- Referência à transação fixa que originou esta
  recorrente   INTEGER DEFAULT 0,  -- 1 se foi gerada por uma transação fixa
  criado_em    TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)      REFERENCES users(id),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (perfil_id)    REFERENCES perfis(id),
  FOREIGN KEY (fixa_id)      REFERENCES transacoes_fixas(id)
);

-- Índices aceleram consultas frequentes (busca por data, perfil, tipo).
-- Sem índice, o SQLite lê TODAS as linhas para encontrar o resultado.
CREATE INDEX IF NOT EXISTS idx_transacoes_data   ON transacoes(data);
CREATE INDEX IF NOT EXISTS idx_transacoes_perfil ON transacoes(perfil_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo   ON transacoes(tipo);

-- 7. INVESTIMENTOS
-- Registra aplicações financeiras: CDB, Tesouro Direto, Ações, FIIs, etc.
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
  FOREIGN KEY (user_id)   REFERENCES users(id),
  FOREIGN KEY (perfil_id) REFERENCES perfis(id)
);

-- 8. PROJETOS
-- Módulo agregador. Tarefas, notas e metas podem ser vinculadas a projetos.
-- Sobe antes de tarefas/metas/notas pois elas referenciam esta tabela.
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

-- 9. LINKS DE PROJETO
-- Links externos vinculados a um projeto (Google Drive, Figma, GitHub, etc.)
-- ON DELETE CASCADE: se o projeto for deletado, os links também são.
CREATE TABLE IF NOT EXISTS projeto_links (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  projeto_id INTEGER NOT NULL,
  nome       TEXT    NOT NULL,
  url        TEXT    NOT NULL,
  tipo       TEXT    DEFAULT 'link',
  criado_em  TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
);

-- 10. TAGS
-- Labels coloridas que podem ser aplicadas a tarefas: "#estudo", "#pessoal", etc.
CREATE TABLE IF NOT EXISTS tags (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nome    TEXT    NOT NULL,
  cor     TEXT    NOT NULL DEFAULT '#3b82f6',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 11. TAREFAS
-- projeto_id nullable: NULL = tarefa solta, número = vinculada a um projeto.
-- ON DELETE SET NULL: se o projeto for deletado, a tarefa fica solta.
CREATE TABLE IF NOT EXISTS tarefas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL,
  nome         TEXT    NOT NULL,
  descricao    TEXT    DEFAULT '',
  prioridade   TEXT    NOT NULL DEFAULT 'media'
               CHECK(prioridade IN ('alta', 'media', 'baixa')),
  status       TEXT    NOT NULL DEFAULT 'afazer'
               CHECK(status IN ('afazer', 'em_progresso', 'concluida')),
  vencimento   TEXT,            -- Data de vencimento, opcional
  concluido_em TEXT,            -- Preenchido automaticamente ao mudar status para 'concluida'
  projeto_id   INTEGER,
  ordem        INTEGER DEFAULT 0,
  criado_em    TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tarefas_status     ON tarefas(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_vencimento ON tarefas(vencimento);
CREATE INDEX IF NOT EXISTS idx_tarefas_projeto    ON tarefas(projeto_id);

-- 12. SUB-TAREFAS
-- Checklist dentro de uma tarefa. ON DELETE CASCADE: se a tarefa for deletada,
-- suas sub-tarefas também são automaticamente removidas.
CREATE TABLE IF NOT EXISTS sub_tarefas (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  tarefa_id INTEGER NOT NULL,
  nome      TEXT    NOT NULL,
  concluida INTEGER DEFAULT 0,
  ordem     INTEGER DEFAULT 0,
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE
);

-- 13. TAREFA-TAGS (tabela de junção N:N)
-- Uma tarefa pode ter várias tags. Uma tag pode estar em várias tarefas.
-- PRIMARY KEY composta garante que a combinação tarefa+tag seja única.
CREATE TABLE IF NOT EXISTS tarefa_tags (
  tarefa_id INTEGER NOT NULL,
  tag_id    INTEGER NOT NULL,
  PRIMARY KEY (tarefa_id, tag_id),
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)    REFERENCES tags(id)    ON DELETE CASCADE
);

-- 14. METAS
-- Objetivos com progresso quantitativo: valor_atual / valor_alvo.
-- Pode ser vinculada a um projeto (projeto_id nullable).
CREATE TABLE IF NOT EXISTS metas (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  nome        TEXT    NOT NULL,
  descricao   TEXT    DEFAULT '',
  tipo        TEXT    NOT NULL DEFAULT 'pessoal'
              CHECK(tipo IN ('financeira', 'pessoal')),
  status      TEXT    NOT NULL DEFAULT 'em_progresso'
              CHECK(status IN ('em_progresso', 'concluida', 'abandonada')),
  valor_atual REAL    NOT NULL DEFAULT 0,
  valor_alvo  REAL    NOT NULL,
  data_alvo   TEXT,
  projeto_id  INTEGER,
  criado_em   TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE SET NULL
);

-- 15. EVENTOS DO CRONOGRAMA
-- Três tipos: com horário definido, dia inteiro, ou simples lembrete.
-- Suporta recorrência: semanal, quinzenal, mensal ou anual.
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

-- 16. CADERNOS DE NOTAS
-- Agrupador de notas: "Trabalho", "Pessoal", "Estudos", etc.
CREATE TABLE IF NOT EXISTS cadernos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL,
  nome      TEXT    NOT NULL,
  cor       TEXT    NOT NULL DEFAULT '#ec4899',
  criado_em TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 17. NOTAS
-- conteudo em Markdown puro (texto simples com formatação).
-- caderno_id e projeto_id são opcionais (nullable).
CREATE TABLE IF NOT EXISTS notas (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  titulo        TEXT    NOT NULL DEFAULT 'Sem título',
  conteudo      TEXT    DEFAULT '',
  fixada        INTEGER NOT NULL DEFAULT 0,
  caderno_id    INTEGER,
  projeto_id    INTEGER,
  criado_em     TEXT    DEFAULT (datetime('now')),
  atualizado_em TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (caderno_id) REFERENCES cadernos(id)  ON DELETE SET NULL,
  FOREIGN KEY (projeto_id) REFERENCES projetos(id)  ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_notas_caderno    ON notas(caderno_id);
CREATE INDEX IF NOT EXISTS idx_notas_projeto    ON notas(projeto_id);
CREATE INDEX IF NOT EXISTS idx_notas_atualizado ON notas(atualizado_em);

-- 18. HÁBITOS
-- Cada hábito que o usuário quer acompanhar diariamente.
CREATE TABLE IF NOT EXISTS habitos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER NOT NULL,
  nome      TEXT    NOT NULL,
  criado_em TEXT    DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 19. REGISTROS DIÁRIOS DE HÁBITOS
-- Um registro por hábito por dia. UNIQUE(habito_id, data) garante isso.
-- ON DELETE CASCADE: se o hábito for deletado, todos os checks são deletados.
CREATE TABLE IF NOT EXISTS habito_checks (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  habito_id INTEGER NOT NULL,
  data      TEXT    NOT NULL,   -- Formato: 'YYYY-MM-DD'
  checked   INTEGER NOT NULL DEFAULT 1,
  UNIQUE(habito_id, data),
  FOREIGN KEY (habito_id) REFERENCES habitos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_habito_checks_data ON habito_checks(data);
