# Bugs Finanças — MyFinance

| ID | Bug | Status |
|----|-----|--------|
| F1 | Timezone: `new Date("2026-06-25")` vira dia 24 em GMT-3 | ✅ Corrigido (toDate com parse manual) |
| F2 | Categorias: chips não clicáveis, sem editar/excluir | ✅ Corrigido (click → openCategoriaModal) |
| F3 | Fixas: header "Despesas Fixas" ( Receitas também); tipo sempre despesa no edit; sem click editar | ✅ Corrigido (header, isReceita, selected dinâmico, click handler) |
| F4 | Modal transação com campo perfil_id | ❌ Cancelado (usuário não quer) |
| F5 | Modal fixa sem campo categoria_id | ✅ Corrigido (select de categorias adicionado) |
| F6 | Hub: `notasRecentes` declarado duas vezes | ✅ Corrigido (notasRecentesCount + notasRecentes) |
| F7 | Fixa: sem botão excluir no modal de edição | ✅ Corrigido (btn-danger f-delete + handler) |
| F8 | Backend listarTransacoes não retorna categoria_nome | ✅ Corrigido (LEFT JOIN categorias) |
| F9 | Dropdown categorias no modal transação mostra todas (não filtra por tipo) | ✅ Corrigido (listener #t-tipo filtra #t-cat) |
| F10 | Hub: variáveis undefined (proximoEvento, habitosCheckHoje, totalHabitos, maiorStreak) | ✅ Corrigido (queries adicionadas) |
| F11 | Conflitos de merge em financas.js (linhas 227-231, 277-281) | ✅ Corrigido (resolvido mantendo versão upstream) |
