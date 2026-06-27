# Estado Atual — MyFinance

atualizado = 2026-06-27
fase = integracao (backend + frontend integrados, servidos pelo mesmo Express)
projeto = reconstruir do zero

proposito = life manager pessoal
publico = uso pessoal exclusivo
plataforma = web responsiva (mobile + desktop)
complexidade = simples e funcional
integracao_modulos = independentes (com integracoes selecionadas)
visual = dark elegante (estilo Discord/Spotify/Linear)
autenticacao = sessao salva no SQLite (express-session + sessionStore custom better-sqlite3)
entrada_financeira = manual + importacao CSV/PDF extrato
conceito_central = hub com cards (centro de comando pessoal) — hub spotlight puro, sidebar surge ao entrar no modulo

stack_front = HTML/CSS/JS puro + ES Modules
stack_back = Node.js + Express
bd = SQLite
seguranca = helmet + bcrypt + rate-limit + cors
deploy_front = GitHub Pages (gratis)
deploy_back = Render Free Tier (gratis)
custo = $0/mes
graficos = Chart.js (~60KB)
editor_notas = Markdown com preview (estilo Notion) — lib marked.js (~15KB)

modulos_aprovados = financas, tarefas, metas, cronograma, notas, habitos, projetos
modulos_rejeitados = nenhum
modulos_candidatos = (todos aprovados)
cores_modulos = financas=#8b5cf6, tarefas=#3b82f6, metas=#f59e0b, cronograma=#10b981, notas=#ec4899, habitos=#06b6d4, projetos=#f97316

integracoes_ativas = cronograma←tarefas (vencimento), cronograma←habitos (badge diário), projetos←tarefas/notas/metas/links
integracoes_rejeitadas = finanças↔cronograma, habitos↔tarefas

estrutura_pastas = hibrida (compartilhado por tipo, modulos por funcionalidade)
auth = sessao + SQLite (express-session + sessionStore custom better-sqlite3)
navegacao_cruzada_projetos = filtro/projeto_id (itens com projeto_id aparecem no projeto, sem projeto = soltos)
hub_cards = saldo total geral, receitas/despesas total geral, pendentes, top3 metas, prox eventos, ultimas notas, streak, projetos ativos
layout_mobile = sidebar some, full-screen, adaptacoes por modulo
configuracoes = perfil, aparencia, financas, cronograma, habitos, exportar, sobre

layout_aprovado = spotlight-sidebar-transicao (hub limpo → sidebar surge ao entrar no modulo)
prototipo_html = rascunho-do-projeto/prototipo/
layout_docs = rascunho-do-projeto/layouts-reuniao-1/
rascunhos = rascunho-do-projeto/ (centralizacao de ideias, relatorios, layouts)

reunioes_realizadas = 3
decisoes_totais = 60+

ultima_reuniao = 2026-06-14 — decisoes estruturais: pastas, auth, navegacao cruzada, hub cards, mobile, config
ultima_decisao = metas colunas tipo/status adicionadas, tarefas resposta paginada corrigida, projetos vincular itens, cronograma integrado com tarefas/habitos
proxima_acao = testar interativamente no navegador (375px), resolver bugs visuais restantes

pendente = testes visuais manuais em 375px, deploy
bugs_corrigidos = exportacao URL hardcoded, dark mode sem persistencia/efeito, field mismatches front→back (6 modulos), notas fixada/datas/paginacao, hub cards mapeamento, tarefas paginacao .dados, metas tipo/status, projetos vincular itens, cronograma dia consolidado, timezone formatDate, categorias click editar, fixas receitas/tipo/edit/categoria/excluir, hub vars undefined, hub notasRecentes duplicado, transacoes LEFT JOIN categoria_nome, categorias filtro por tipo, importacao CSV (tipo antes abs, data BR→ISO, campos model, transacoes completas), resumo tela principal (UI esperava data.resumo), hub cards dados aninhados (metas/cronograma/notas/habitos), perfis bancarios aba+CRUD+perfil_id, hub dashboard SQL errado (cronograma→eventos, habitos_checks→habito_checks, data→data_inicio), hub notasFixadas hardcoded 0, projetos botoes add quebrados (innerHTML += destruia event listeners), projetos modais read-only substituidos por edicao completa
integracoes_feitas = cronograma semana com tarefas vencimento + habitos checks, cronograma dia com editar/excluir/toggle habitos, seletor projeto nos modulos tarefas/notas/metas, cronograma view mes com pontos habitos (checked=cyan, pendente=contorno), habitos clicar no nome abre modal editar/excluir, semana mostra habitos pendentes (✗)

snapshot_atual = nenhum
