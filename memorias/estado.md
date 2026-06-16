# Estado Atual — MyFinance

atualizado = 2026-06-15
fase = implementacao (backend completo — 10 modulos + hub + exportar)
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
hub_cards = saldo mes, pendentes, top3 metas, prox eventos, ultimas notas, streak, projetos ativos
layout_mobile = sidebar some, full-screen, adaptacoes por modulo
configuracoes = perfil, aparencia, financas, cronograma, habitos, exportar, sobre

layout_aprovado = spotlight-sidebar-transicao (hub limpo → sidebar surge ao entrar no modulo)
prototipo_html = rascunho-do-projeto/prototipo/
layout_docs = rascunho-do-projeto/layouts-reuniao-1/
rascunhos = rascunho-do-projeto/ (centralizacao de ideias, relatorios, layouts)

reunioes_realizadas = 3
decisoes_totais = 55+

ultima_reuniao = 2026-06-14 — decisoes estruturais: pastas, auth, navegacao cruzada, hub cards, mobile, config
ultima_decisao = todos os modulos backend implementados (auth, financas, tarefas, metas, cronograma, habitos, notas, projetos, hub, exportar)
proxima_acao = implementar front-end (HTML/CSS/JS puro, dark elegante)

pendente = front-end completo

snapshot_atual = nenhum
