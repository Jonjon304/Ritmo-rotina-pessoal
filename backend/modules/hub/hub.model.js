const db = require('../../db/database')

function dashboard(userId) {
  const hoje = new Date().toISOString().split('T')[0]
  const mesAtual = hoje.slice(0, 7)

  const tarefasPendentes = db.prepare("SELECT COUNT(*) as total FROM tarefas WHERE user_id = ? AND status != 'concluida'").get(userId).total
  const tarefasVencendo = db.prepare('SELECT COUNT(*) as total FROM tarefas WHERE user_id = ? AND vencimento = ? AND status != ?').get(userId, hoje, 'concluida').total
  const tarefas = db.prepare("SELECT id, nome, prioridade, status, vencimento FROM tarefas WHERE user_id = ? AND status != 'concluida' ORDER BY CASE prioridade WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END, vencimento ASC LIMIT 5").all(userId)

  const transacoesMes = db.prepare("SELECT tipo, SUM(valor) as total FROM transacoes WHERE user_id = ? AND data LIKE ? GROUP BY tipo").all(userId, `${mesAtual}%`)
  let receitasMes = 0, despesasMes = 0
  for (const t of transacoesMes) {
    if (t.tipo === 'receita') receitasMes = t.total
    else despesasMes = t.total
  }

  const eventosHoje = db.prepare('SELECT id, nome, tipo, horario_inicio, horario_fim FROM eventos WHERE user_id = ? AND data_inicio = ? ORDER BY horario_inicio').all(userId, hoje)
  const eventosProximos = db.prepare('SELECT id, nome, tipo, data_inicio, horario_inicio FROM eventos WHERE user_id = ? AND data_inicio > ? ORDER BY data_inicio, horario_inicio LIMIT 5').all(userId, hoje)

  const habitos = db.prepare('SELECT id, nome FROM habitos WHERE user_id = ? ORDER BY criado_em').all(userId)
  const habitosHoje = habitos.map(h => {
    const check = db.prepare('SELECT checked FROM habito_checks WHERE habito_id = ? AND data = ?').get(h.id, hoje)
    return { id: h.id, nome: h.nome, feito: !!check }
  })

  const metas = db.prepare('SELECT id, nome, valor_atual, valor_alvo FROM metas WHERE user_id = ? ORDER BY criado_em DESC LIMIT 5').all(userId)

  const projetosAtivos = db.prepare("SELECT id, nome, cor, status FROM projetos WHERE user_id = ? AND status = 'em_andamento' ORDER BY criado_em DESC").all(userId)

  const notasRecentes = db.prepare('SELECT id, titulo, atualizado_em FROM notas WHERE user_id = ? ORDER BY atualizado_em DESC LIMIT 3').all(userId)

  return {
    resumo: { tarefas_pendentes: tarefasPendentes, tarefas_vencendo_hoje: tarefasVencendo, receitas_mes: receitasMes, despesas_mes: despesasMes, saldo_mes: receitasMes - despesasMes },
    tarefas,
    eventos_hoje: eventosHoje,
    eventos_proximos: eventosProximos,
    habitos_hoje: habitosHoje,
    metas,
    projetos_ativos: projetosAtivos,
    notas_recentes: notasRecentes
  }
}

module.exports = { dashboard }
