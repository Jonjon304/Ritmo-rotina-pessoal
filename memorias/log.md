# Log — MyFinance (ultimos 10 eventos)

1. [2026-06-17] Acao: Adicionado CSS .app e .main-area (flex layout para o container principal)
2. [2026-06-17] Acao: Removidos 8 arquivos HTML vazios dos modulos (nao usados, renderizacao via JS)
3. [2026-06-17] Acao: Removidos 32 arquivos JS de sub-componentes vazios (funcionalidade integrada nos modulos principais)
4. [2026-06-17] Acao: Backend configurado para servir frontend via express.static (dev e prod)
5. [2026-06-17] Acao: API base relativa (/api) para funcionar same-origin (sem CORS)
6. [2026-06-17] Acao: Auth 401 agora dispara CustomEvent auth:logout em vez de hash change
7. [2026-06-17] Acao: app.js atualizado para ouvir auth:logout e mostrar login page
8. [2026-06-17] Acao: Testado servidor integrado — all 18 JS + 18 CSS assets servidos com HTTP 200
9. [2026-06-17] Acao: Testado login API (admin@myfinance.com/admin123) e hub/dashboard — funcional
10. [2026-06-17] Decisao: Frontend servido pelo backend (same origin) elimina problema de CORS

# Eventos anteriores (arquivados)
# 1. [2026-06-15] Acao: Habitos module implementado (CRUD + checks + streak + stats)
# 2. [2026-06-15] Acao: Notas + Cadernos module implementado (CRUD com paginacao, busca, filtros)
# 3. [2026-06-15] Acao: Projetos module implementado (CRUD + links + itens vinculados + progresso)
# 4. [2026-06-15] Acao: Hub module implementado (dashboard agregado com resumo de todos os modulos)
# 5. [2026-06-15] Acao: Exportar module implementado (JSON completo + CSV por tabela)
