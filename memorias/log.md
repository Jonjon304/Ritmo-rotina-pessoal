# Log — MyFinance (ultimos 10 eventos)

1. [2026-06-17] Bugfix: URLs de exportacao hardcoded (localhost:3000) substituidas por caminhos relativos (/api/...)
2. [2026-06-17] Bugfix: Dark mode agora funciona de verdade — classe light-theme no <html>, variaveis CSS light, persistencia via localStorage + API /auth/configuracoes
3. [2026-06-17] Acao: Criado utils/theme.js (applyTheme, getStoredTheme, initTheme)
4. [2026-06-17] Acao: Adicionado bloco html.light-theme com variaveis claras em variables.css
5. [2026-06-17] Acao: app.js inicializa tema no startup + busca config.tema do backend no checkAuth
6. [2026-06-17] Acao: Adicionado CSS .app e .main-area (flex layout para o container principal)
7. [2026-06-17] Acao: Removidos 8 arquivos HTML vazios dos modulos (nao usados, renderizacao via JS)
8. [2026-06-17] Acao: Removidos 32 arquivos JS de sub-componentes vazios (funcionalidade integrada nos modulos principais)
9. [2026-06-17] Acao: Backend configurado para servir frontend via express.static (dev e prod)
10. [2026-06-17] Acao: API base relativa (/api) para funcionar same-origin (sem CORS)

# Eventos anteriores (arquivados)
# 1. [2026-06-15] Acao: Habitos module implementado (CRUD + checks + streak + stats)
# 2. [2026-06-15] Acao: Notas + Cadernos module implementado (CRUD com paginacao, busca, filtros)
# 3. [2026-06-15] Acao: Projetos module implementado (CRUD + links + itens vinculados + progresso)
# 4. [2026-06-15] Acao: Hub module implementado (dashboard agregado com resumo de todos os modulos)
# 5. [2026-06-15] Acao: Exportar module implementado (JSON completo + CSV por tabela)
