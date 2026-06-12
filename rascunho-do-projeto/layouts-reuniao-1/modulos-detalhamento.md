# Módulos — Detalhamento de Funcionalidades (MVP)

> Cada módulo funciona de forma independente. Simples e funcional — faz uma coisa bem feita.

---

## 1. 💰 Finanças (Roxo `#8b5cf6`)

### Tela Principal
- **Saldo total** em destaque (soma de todas as contas)
- **Receitas vs Despesas** do mês atual (dois cards lado a lado)
- **Últimas transações** (lista com as 10 mais recentes)

### Funcionalidades MVP
| Feature | Descrição |
|---------|-----------|
| Lançamento manual | Formulário: valor, tipo (receita/despesa), categoria, data, descrição |
| Categorias | Lista fixa + customizáveis. Ex: Alimentação, Moradia, Transporte, Lazer, Salário, Freelance |
| Contas | Carteira, Nubank, Itaú, etc. — cada conta tem saldo próprio |
| Importar CSV | Upload de arquivo CSV do extrato bancário → mapeamento de colunas → importação em lote |
| Listar transações | Tabela/lista com filtros: mês, categoria, tipo, conta |
| Resumo mensal | Cards: total receita, total despesa, saldo do mês |

### Importação CSV — Fluxo
1. Usuário clica "Importar extrato"
2. Seleciona arquivo CSV
3. Sistema lê colunas e mostra preview
4. Usuário mapeia: qual coluna é data? valor? descrição?
5. Sistema importa e cria transações em lote
6. Usuário pode editar/categorizar depois

### NÃO inclui no MVP
- Gráficos complexos (pizza, barras comparativas)
- Orçamento por categoria
- Transações recorrentes automáticas
- Exportar relatórios

---

## 2. 📋 Tarefas (Azul `#3b82f6`)

### Tela Principal
- **Tarefas de hoje** em destaque
- **Contadores**: pendentes, concluídas, total
- **Lista de tarefas** com filtros rápidos

### Funcionalidades MVP
| Feature | Descrição |
|---------|-----------|
| Criar tarefa | Título, descrição (opcional), data (opcional), prioridade |
| Prioridades | Baixa, Média, Alta (ícones coloridos) |
| Marcar como feita | Checkbox com animação de "risco" |
| Filtros | Todas / Pendentes / Concluídas / Por prioridade |
| Data | Associar uma data à tarefa (para aparecer no cronograma) |
| Editar/Excluir | Ações rápidas na tarefa |

### NÃO inclui no MVP
- Subtarefas
- Tags/etiquetas
- Atribuir a projetos
- Ordens customizáveis (drag & drop)

---

## 3. 🎯 Metas (Âmbar `#f59e0b`)

### Tela Principal
- **Metas ativas** como cards visuais com barra de progresso
- **Contadores**: ativas, concluídas, total

### Funcionalidades MVP
| Feature | Descrição |
|---------|-----------|
| Criar meta | Título, descrição, tipo (financeira/pessoal), valor alvo, prazo |
| Progresso | Barra visual preenchida manualmente ou por valor |
| Tipos | Financeira (ex: juntar R$ 10mil) ou Pessoal (ex: ler 12 livros) |
| Status | Em progresso / Concluída / Abandonada |
| Atualizar | Botão "Atualizar progresso" — registra novo valor |
| Histórico | Lista de atualizações da meta |

### NÃO inclui no MVP
- Metas com sub-metas
- Metas compartilhadas
- Lembretes automáticos de prazo
- Integração automática com finanças

---

## 4. 📅 Cronograma (Verde `#10b981`)

### Tela Principal
- **Visão semanal** (7 dias) como padrão
- **Compromissos de hoje** em destaque
- **Próximo compromisso** com countdown

### Funcionalidades MVP
| Feature | Descrição |
|---------|-----------|
| Criar evento | Título, data, hora início, hora fim, descrição |
| Visão semanal | Colunas com os 7 dias da semana atual |
| Visão diária | Lista de eventos do dia selecionado |
| Navegação | Setas ← → para mudar semana/dia |
| Editar/Excluir | Clique no evento |
| Tarefas com data | Tarefas que têm data aparecem no cronograma (read-only) |

### NÃO inclui no MVP
- Visão mensal
- Eventos recorrentes
- Drag & drop para mover eventos
- Notificações/lembretes
- Convidar pessoas

---

## 5. 📝 Notas (Rosa `#ec4899`)

### Tela Principal
- **Notas recentes** como lista
- **Notas fixadas** no topo
- **Busca** por texto

### Funcionalidades MVP
| Feature | Descrição |
|---------|-----------|
| Criar nota | Título, conteúdo em texto puro |
| Fixar | Fixar nota importante (fica no topo) |
| Buscar | Busca por título e conteúdo |
| Editar | Clique para editar inline |
| Excluir | Ação rápida |

### NÃO inclui no MVP
- Markdown / rich text
- Categorias/tags
- Notas com imagens ou anexos
- Compartilhar

---

## 6. 🔄 Hábitos (Ciano `#06b6d4`)

### Tela Principal
- **Hábitos de hoje** com checkbox
- **Streaks** (sequências) em destaque 🔥
- **Progresso semanal** visual

### Funcionalidades MVP
| Feature | Descrição |
|---------|-----------|
| Criar hábito | Nome, frequência (diário / semanal X vezes) |
| Marcar feito | Checkbox — um clique para registrar |
| Streak | Contador de dias consecutivos |
| Histórico | Calendário mini com dias marcados |
| Semana atual | Barra visual: 4/7 completos |

### NÃO inclui no MVP
- Estatísticas avançadas
- Lembretes/notificações
- Categorias de hábitos
- Hábitos negativos ("não fazer X")

---

## Resumo — Escopo MVP

| Módulo | Telas | Features principais |
|--------|-------|-------------------|
| Finanças | 4 (overview, nova transação, lista, importar) | CRUD transações, categorias, contas, importar CSV |
| Tarefas | 2 (lista, nova tarefa) | CRUD tarefas, prioridade, filtros, checkbox |
| Metas | 2 (lista, nova meta) | CRUD metas, progresso, tipos, histórico |
| Cronograma | 2 (semanal, diário) | CRUD eventos, visão semanal/diária |
| Notas | 2 (lista, editor) | CRUD notas, fixar, buscar |
| Hábitos | 2 (lista, novo hábito) | CRUD hábitos, marcar feito, streak, mini calendário |
| **Hub** | 1 (hub central) | Cards com resumo de cada módulo |
