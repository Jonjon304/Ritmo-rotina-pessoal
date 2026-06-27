# Log — MyFinance (ultimos 10 eventos)

1. [2026-06-27] Feature: Projetos — clicar em tarefa/nota/meta dentro do projeto agora abre modal de EDICAO completo (campos editaveis, salvar, excluir, desvincular). Substituidos openTaskDetail/openNoteDetail/openMetaDetail read-only por versoes com formularios completos (replicados dos modulos originais).
2. [2026-06-26] Bugfix: Projetos — botoes Vincular/Adicionar nas abas (tarefas/notas/metas/links) nao funcionavam. Causa: body.innerHTML += destruia os event listeners dos botoes. Corrigido com createElement+appendChild em 8 locais.
3. [2026-06-24] Feature: Cronograma — view Mes com calendario grid, pontos coloridos habitos (cyan=checked, contorno=pendente, verde=eventos), navegacao mes anterior/proximo, click no dia abre view dia. Header dias da semana.
4. [2026-06-24] Feature: Cronograma semana — habitos pendentes (nao checked) agora aparecem com ✗ e estilo esmaecido/italico (.week-event-pending)
5. [2026-06-24] Feature: Modulo Habitos — clicar no nome do habito abre modal editar/excluir (openHabitoModal com frequencia). Checkmark continua toggle normal.
6. [2026-06-23] Feature: Cronograma — habitos agora aparecem na visao semana (accent cyan #06b6d4 com ✓) e na visao dia com opcoes de editar/excluir/toggle check. loadData agora busca /habitos/ e /habitos/checks tambem.
7. [2026-06-23] Feature: Notas — UI para criar/editar/excluir cadernos (botao +, chip Todos, editar/excluir por caderno, modal). Hub notasFixadas agora conta do DB (antes hardcoded 0)
8. [2026-06-23] Bugfix: Hub dashboard — 5 erros SQL corrigidos: tabela cronograma→eventos, coluna data→data_inicio, tabela habitos_checks→habito_checks, date(?,"-7 days")→date(?,'-7 days'), coluna fixada removida (nao existe), metas.tipo/status removidos (nao existem)
9. [2026-06-23] Bugfix: Hub card Financas — agora exibe resumo geral (saldo_total, receitas_total, despesas_total) em vez de apenas mes corrente
10. [2026-06-22] Bugfix: Hub cards — metas/cronograma/notas/habitos cards nao exibiam dados (frontend esperava formato diferente do backend). Corrigido para ler dados aninhados corretamente
9. [2026-06-22] Bugfix: Transacoes query — LEFT JOIN com perfis agora retorna perfil_nome, perfil_icone, perfil_cor; investimento update aceita perfil_id
10. [2026-06-21] Bugfix: Importacao CSV — datas dd/mm/yyyy nao convertidas para ISO (filtro por mes nunca achava), classificar tipo antes do Math.abs, campos categoria_id/perfil_id no preview, enviar transacoes completas, corrigidas 132 datas existentes no DB
8. [2026-06-21] Bugfix: Resumo da tela principal — UI esperava data.resumo; agora usa data.financas e data.tarefas
9. [2026-06-19] Feature: Cronograma — visao semana agora mostra tarefas com vencimento (accent azul #3b82f6) ao lado de eventos
10. [2026-06-19] Feature: Tarefas modal — campo projeto_id agora e um select com lista de projetos

# Eventos anteriores (arquivados)
# 0. [2026-06-19] Feature: Cronograma — visao dia agora renderiza tarefas com vencimento e habitos (do endpoint /dia/:data) alem de eventos
# 1. [2026-06-19] Feature: Metas modal — adicionado select de projeto ao criar/editar meta
# 2. [2026-06-19] Bugfix: Tarefas — checkbox desmarcar enviava pendente (invalido) em vez de afazer
# 3. [2026-06-19] Bugfix: Tarefas — kanban coluna Pendentes usava pendente em vez de afazer (nunca mostrava tarefas)
# 4. [2026-06-19] Bugfix: Metas — colunas tipo (financeira/pessoal) e status (em_progresso/concluida/abandonada) adicionadas ao schema/DB/model/service + validacao
# 5. [2026-06-19] Bugfix: Tarefas — front loadData agora le resposta paginada (.dados) em vez de .tarefas
# 6. [2026-06-15] Acao: Habitos module implementado (CRUD + checks + streak + stats)
# 2. [2026-06-15] Acao: Notas + Cadernos module implementado (CRUD com paginacao, busca, filtros)
# 3. [2026-06-15] Acao: Projetos module implementado (CRUD + links + itens vinculados + progresso)
# 4. [2026-06-15] Acao: Hub module implementado (dashboard agregado com resumo de todos os modulos)
# 5. [2026-06-15] Acao: Exportar module implementado (JSON completo + CSV por tabela)
