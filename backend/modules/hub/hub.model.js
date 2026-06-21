const db = require('../../db/database')

function dashboard(userId) {
  const hoje = new Date().toISOString().split('T')[0]
  const mesAtual = hoje.slice(0, 7)

  const transacoesMes = db.prepare("SELECT tipo, SUM(valor) as total FROM transacoes WHERE user_id = ? AND data LIKE ? GROUP BY tipo").all(userId, `${mesAtual}%`)
  let receitasMes = 0, despesasMes = 0
  for (const t of transacoesMes) {
    if (t.tipo === 'receita') receitasMes = t.total
    else despesasMes = t.total
  }

  const tarefasPendentes = db.prepare("SELECT COUNT(*) as total FROM tarefas WHERE user_id = ? AND status != 'concluida'").get(userId).total
  const tarefasHoje = db.prepare('SELECT COUNT(*) as total FROM tarefas WHERE user_id = ? AND vencimento = ? AND status != ?').get(userId, hoje, 'concluida').total

  const metasAtivas = db.prepare('SELECT COUNT(*) as total FROM metas WHERE user_id = ?').get(userId).total
  const metasProximas = db.prepare("SELECT COUNT(*) as total FROM metas WHERE user_id = ? AND data_alvo IS NOT NULL AND data_alvo <= date('now','+30 days')").get(userId).total

  const metas = db.prepare('SELECT id, nome, tipo, status, valor_atual, valor_alvo FROM metas WHERE user_id = ? ORDER BY criado_em DESC LIMIT 5').all(userId)

  const notasRecentesCount = db.prepare('SELECT COUNT(*) as total FROM notas WHERE user_id = ? AND atualizado_em >= date(?,"-7 days")').get(userId, hoje).total
  const notasFixadas = 0

  const notasRecentes = db.prepare('SELECT id, titulo, fixada, atualizado_em FROM notas WHERE user_id = ? ORDER BY atualizado_em DESC LIMIT 3').all(userId)

  const proximoEvento = db.prepare("SELECT nome, horario_inicio FROM cronograma WHERE user_id = ? AND data >= date('now') ORDER BY data ASC, horario_inicio ASC LIMIT 1").get(userId) || null

  const totalHabitos = db.prepare('SELECT COUNT(*) as total FROM habitos WHERE user_id = ?').get(userId).total
  const habitosCheckHoje = totalHabitos > 0 ? db.prepare("SELECT COUNT(*) as total FROM habitos_checks hc JOIN habitos h ON hc.habito_id = h.id WHERE h.user_id = ? AND hc.data = date('now')").get(userId).total : 0
  const habitosDias = db.prepare('SELECT hc.data FROM habitos_checks hc JOIN habitos h ON hc.habito_id = h.id WHERE h.user_id = ?').all(userId).map(r => r.data)
  const maiorStreak = calcularStreak(habitosDias)

  return {
    financas: { saldo: receitasMes - despesasMes, receitas_mes: receitasMes, despesas_mes: despesasMes },
    tarefas: { pendentes: tarefasPendentes, hoje: tarefasHoje },
    metas: { ativas: metasAtivas, proximas: metasProximas },
    cronograma: { proximo_hora: proximoEvento?.horario_inicio || null, proximo_titulo: proximoEvento?.nome || null },
    notas: { recentes_count: notasRecentesCount, fixadas: notasFixadas, recentes: notasRecentes },
    habitos: { hoje: habitosCheckHoje, total: totalHabitos, maior_streak: maiorStreak }
  }
}

function calcularStreak(dias) {
  if (!dias || dias.length === 0) return 0
  const ordenados = [...new Set(dias)].sort().reverse()
  const hoje = new Date().toISOString().split('T')[0]
  let streak = 0
  let diaAtual = hoje
  for (const d of ordenados) {
    if (d === diaAtual) {
      streak++
      const dt = new Date(diaAtual)
      dt.setDate(dt.getDate() - 1)
      diaAtual = dt.toISOString().split('T')[0]
    } else if (d < diaAtual) {
      break
    }
  }
  return streak
}

module.exports = { dashboard }
