const db = require('../../db/database')

function listar(userId) {
  const habitos = db.prepare('SELECT id, user_id, nome, criado_em FROM habitos WHERE user_id = ? ORDER BY criado_em').all(userId)
  return habitos.map(h => {
    const checks = db.prepare('SELECT data FROM habito_checks WHERE habito_id = ? ORDER BY data DESC').all(h.id)
    const streak = calcularStreak(checks.map(c => c.data))
    const totalDias = checks.length
    const melhorStreak = calcularMelhorStreak(checks.map(c => c.data))
    const criado = new Date(h.criado_em).toISOString().split('T')[0]
    const diasDesdeCriacao = Math.max(1, Math.floor((Date.now() - new Date(h.criado_em).getTime()) / 86400000))
    return { ...h, streak_atual: streak, melhor_streak: melhorStreak, taxa_cumprimento: totalDias / diasDesdeCriacao }
  })
}

function buscarPorId(userId, id) {
  return db.prepare('SELECT id, nome, criado_em FROM habitos WHERE id = ? AND user_id = ?').get(id, userId)
}

function criar(userId, dados) {
  const r = db.prepare('INSERT INTO habitos (user_id, nome) VALUES (?, ?)').run(userId, dados.nome)
  return db.prepare('SELECT id, nome, criado_em FROM habitos WHERE id = ?').get(r.lastInsertRowid)
}

function atualizar(userId, id, dados) {
  const h = buscarPorId(userId, id)
  if (!h) return null
  if (dados.nome) db.prepare('UPDATE habitos SET nome = ? WHERE id = ?').run(dados.nome, id)
  return buscarPorId(userId, id)
}

function deletar(userId, id) {
  const r = db.prepare('DELETE FROM habitos WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

function listarChecks(userId, mes) {
  return db.prepare('SELECT hc.id, hc.habito_id, hc.data, hc.checked FROM habito_checks hc JOIN habitos h ON hc.habito_id = h.id WHERE h.user_id = ? AND hc.data LIKE ? ORDER BY hc.data').all(userId, `${mes}%`)
}

function marcarCheck(habitoId, data) {
  db.prepare('INSERT OR REPLACE INTO habito_checks (habito_id, data, checked) VALUES (?, ?, 1)').run(habitoId, data)
  return db.prepare('SELECT id, habito_id, data, checked FROM habito_checks WHERE habito_id = ? AND data = ?').get(habitoId, data)
}

function desmarcarCheck(habitoId, data) {
  const r = db.prepare('DELETE FROM habito_checks WHERE habito_id = ? AND data = ?').run(habitoId, data)
  return r.changes > 0
}

function stats(habitoId) {
  const checks = db.prepare('SELECT data FROM habito_checks WHERE habito_id = ? ORDER BY data DESC').all(habitoId)
  const streak = calcularStreak(checks.map(c => c.data))
  const melhorStreak = calcularMelhorStreak(checks.map(c => c.data))
  const totalDias = checks.length
  const habito = db.prepare('SELECT criado_em FROM habitos WHERE id = ?').get(habitoId)
  const diasDesdeCriacao = habito ? Math.max(1, Math.floor((Date.now() - new Date(habito.criado_em).getTime()) / 86400000)) : 1
  return { streak_atual: streak, melhor_streak: melhorStreak, total_dias: diasDesdeCriacao, dias_cumpridos: totalDias, taxa_cumprimento: totalDias / diasDesdeCriacao }
}

function calcularStreak(dias) {
  if (!dias || dias.length === 0) return 0
  const ordenados = dias.sort().reverse()
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

function calcularMelhorStreak(dias) {
  if (!dias || dias.length === 0) return 0
  const ordenados = [...new Set(dias)].sort()
  let melhor = 1, atual = 1
  for (let i = 1; i < ordenados.length; i++) {
    const anterior = new Date(ordenados[i - 1])
    const atual2 = new Date(ordenados[i])
    const diff = (atual2 - anterior) / 86400000
    if (diff === 1) { atual++; if (atual > melhor) melhor = atual }
    else { atual = 1 }
  }
  return melhor
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar, listarChecks, marcarCheck, desmarcarCheck, stats }
