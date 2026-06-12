# Estado Atual — MyFinance

atualizado = 2026-06-12
fase = planejamento (todas funcionalidades definidas, nenhum codigo implementado)
projeto = reconstruir do zero

proposito = life manager pessoal
publico = uso pessoal exclusivo
plataforma = web responsiva (mobile + desktop)
complexidade = simples e funcional
integracao_modulos = independentes (com integracoes selecionadas)
visual = dark elegante (estilo Discord/Spotify/Linear)
autenticacao = login simples, 1 usuario, sem registro aberto (detalhes a definir)
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

layout_aprovado = spotlight-sidebar-transicao (hub limpo → sidebar surge ao entrar no modulo)
prototipo_html = rascunho-do-projeto/prototipo/
layout_docs = rascunho-do-projeto/layouts-reuniao-1/
rascunhos = rascunho-do-projeto/ (centralizacao de ideias, relatorios, layouts)

reunioes_realizadas = 2
decisoes_totais = 40+

ultima_reuniao = 2026-06-12 — definicao de stack, funcionalidades de todos os modulos e integracoes
ultima_decisao = notas usa markdown com preview (estilo Notion), nao WYSIWYG
proxima_acao = definir estrutura de pastas, autenticacao, modelo de dados completo dos demais modulos

pendente = estrutura de pastas, auth (JWT/sessao?), navegacao cruzada em Projetos, notas soltas vs notas em projetos, hub cards (oque mostrar), layout mobile dos demais modulos, configuracoes (⚙)

snapshot_atual = nenhum
