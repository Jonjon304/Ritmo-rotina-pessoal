# Log — MyFinance (ultimos 10 eventos)

1. [2026-06-19] Feature: Cronograma — visao semana agora mostra tarefas com vencimento (accent azul #3b82f6) ao lado de eventos
2. [2026-06-19] Feature: Tarefas modal — campo projeto_id agora e um select com lista de projetos
3. [2026-06-19] Feature: Notas modal — adicionado select de projeto ao criar/editar nota
4. [2026-06-19] Feature: Metas modal — adicionado select de projeto ao criar/editar meta
5. [2026-06-19] Bugfix: Tarefas — checkbox desmarcar enviava pendente (invalido) em vez de afazer
6. [2026-06-19] Bugfix: Tarefas — kanban coluna Pendentes usava pendente em vez de afazer (nunca mostrava tarefas)
7. [2026-06-19] Bugfix: Metas — colunas tipo (financeira/pessoal) e status (em_progresso/concluida/abandonada) adicionadas ao schema/DB/model/service + validacao
8. [2026-06-19] Bugfix: Tarefas — front loadData agora le resposta paginada (.dados) em vez de .tarefas
9. [2026-06-19] Feature: Projetos — abas de tarefas/notas/metas agora tem botoes "Vincular" que buscam itens sem projeto e permitem vincular via PUT projeto_id
10. [2026-06-19] Feature: Cronograma — visao dia agora renderiza tarefas com vencimento e habitos (do endpoint /dia/:data) alem de eventos

# Eventos anteriores (arquivados)
# 1. [2026-06-15] Acao: Habitos module implementado (CRUD + checks + streak + stats)
# 2. [2026-06-15] Acao: Notas + Cadernos module implementado (CRUD com paginacao, busca, filtros)
# 3. [2026-06-15] Acao: Projetos module implementado (CRUD + links + itens vinculados + progresso)
# 4. [2026-06-15] Acao: Hub module implementado (dashboard agregado com resumo de todos os modulos)
# 5. [2026-06-15] Acao: Exportar module implementado (JSON completo + CSV por tabela)
