-- =============================================================
-- SEEDS — DADOS INICIAIS DO MYFINANCE
-- Execute APÓS o schema. Via: node db/init.js
-- =============================================================

-- USUÁRIO PADRÃO
-- senha_hash abaixo é o bcrypt de "admin123" (salt rounds: 10)
-- Você pode alterar a senha depois nas configurações do app.
INSERT OR IGNORE INTO users (id, nome, email, senha_hash) VALUES (
  1,
  'Admin',
  'admin@myfinance.com',
  '$2b$10$erNpHoHghjK8ha1mWwLGOeA2iGByox6vI23OcEAmTh.EyTJfUG6nW'
);

-- CONFIGURAÇÃO PADRÃO
INSERT OR IGNORE INTO configuracoes (user_id, moeda, fuso_horario, inicio_semana, tema, habito_reset_hora)
VALUES (1, 'BRL', 'America/Sao_Paulo', 'dom', 'dark', '00:00');

-- CATEGORIAS DE RECEITA
INSERT OR IGNORE INTO categorias (user_id, nome, icone, cor, tipo) VALUES
  (1, 'Salário',   '💰', '#22c55e', 'receita'),
  (1, 'Freelance', '💻', '#06b6d4', 'receita'),
  (1, 'Outros',    '📥', '#a3a3a3', 'receita');

-- CATEGORIAS DE DESPESA
INSERT OR IGNORE INTO categorias (user_id, nome, icone, cor, tipo) VALUES
  (1, 'Alimentação', '🍕', '#ef4444', 'despesa'),
  (1, 'Moradia',     '🏠', '#f59e0b', 'despesa'),
  (1, 'Transporte',  '🚗', '#3b82f6', 'despesa'),
  (1, 'Saúde',       '💊', '#ec4899', 'despesa'),
  (1, 'Educação',    '📚', '#8b5cf6', 'despesa'),
  (1, 'Lazer',       '🎮', '#f97316', 'despesa'),
  (1, 'Compras',     '🛒', '#6b7280', 'despesa'),
  (1, 'Outros',      '📎', '#9ca3af', 'despesa');
