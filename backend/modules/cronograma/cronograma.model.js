const db = require('../../db/database')

function listar(userId, filtros) {
  let sql = 'SELECT id, user_id, nome, descricao, tipo, data_inicio, data_fim, horario_inicio, horario_fim, recorrencia_tipo, recorrencia_fim, criado_em FROM eventos WHERE user_id = ?'
  const params = [userId]
  if (filtros.mes) { sql += ' AND data_inicio LIKE ?'; params.push(`${filtros.mes}%`) }
  if (filtros.data) { sql += ' AND data_inicio <= ? AND (data_fim IS NULL OR data_fim >= ?)'; params.push(filtros.data, filtros.data) }
  sql += ' ORDER BY data_inicio, horario_inicio'
  return db.prepare(sql).all(...params)
}

function buscarPorId(userId, id) {
  return db.prepare('SELECT * FROM eventos WHERE id = ? AND user_id = ?').get(id, userId)
}

function criar(userId, dados) {
  const r = db.prepare('INSERT INTO eventos (user_id, nome, descricao, tipo, data_inicio, data_fim, horario_inicio, horario_fim, recorrencia_tipo, recorrencia_fim) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    userId, dados.nome, dados.descricao || '', dados.tipo, dados.data_inicio,
    dados.data_fim || null, dados.horario_inicio || null, dados.horario_fim || null,
    dados.recorrencia_tipo || null, dados.recorrencia_fim || null
  )
  return db.prepare('SELECT id, nome, descricao, tipo, data_inicio, data_fim, horario_inicio, horario_fim, recorrencia_tipo, recorrencia_fim, criado_em FROM eventos WHERE id = ?').get(r.lastInsertRowid)
}

function atualizar(userId, id, dados) {
  const ev = buscarPorId(userId, id)
  if (!ev) return null
  const campos = []
  const valores = []
  for (const c of ['nome', 'descricao', 'tipo', 'data_inicio', 'data_fim', 'horario_inicio', 'horario_fim', 'recorrencia_tipo', 'recorrencia_fim']) {
    if (dados[c] !== undefined) { campos.push(`${c} = ?`); valores.push(dados[c] || null) }
  }
  if (campos.length === 0) return ev
  valores.push(id)
  db.prepare(`UPDATE eventos SET ${campos.join(', ')} WHERE id = ?`).run(...valores)
  return db.prepare('SELECT id, nome, descricao, tipo, data_inicio, data_fim, horario_inicio, horario_fim, recorrencia_tipo, recorrencia_fim, criado_em FROM eventos WHERE id = ?').get(id)
}

function deletar(userId, id) {
  const r = db.prepare('DELETE FROM eventos WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

function diaConsolidado(userId, data) {
  const eventos = db.prepare('SELECT id, nome, descricao, tipo, data_inicio, data_fim, horario_inicio, horario_fim FROM eventos WHERE user_id = ? AND data_inicio <= ? AND (data_fim IS NULL OR data_fim >= ?) ORDER BY horario_inicio').all(userId, data, data)
  const tarefas = db.prepare('SELECT id, nome, prioridade, vencimento FROM tarefas WHERE user_id = ? AND vencimento = ? ORDER BY prioridade').all(userId, data)
  const habitos = db.prepare('SELECT h.id, h.nome, CASE WHEN hc.id IS NOT NULL THEN 1 ELSE 0 END as checked FROM habitos h LEFT JOIN habito_checks hc ON h.id = hc.habito_id AND hc.data = ? WHERE h.user_id = ?').all(data, userId)
  const total = habitos.length
  const concluidos = habitos.filter(h => h.checked).length
  return { eventos, tarefas, habitos: { total, concluidos, lista: habitos } }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar, diaConsolidado }
