const db = require('../../db/database')

function listar(userId, projetoId) {
  if (projetoId) return db.prepare('SELECT id, nome, descricao, valor_atual, valor_alvo, data_alvo, projeto_id, criado_em FROM metas WHERE user_id = ? AND projeto_id = ? ORDER BY criado_em DESC').all(userId, projetoId)
  return db.prepare('SELECT id, nome, descricao, valor_atual, valor_alvo, data_alvo, projeto_id, criado_em FROM metas WHERE user_id = ? ORDER BY criado_em DESC').all(userId)
}

function buscarPorId(userId, id) {
  return db.prepare('SELECT id, nome, descricao, valor_atual, valor_alvo, data_alvo, projeto_id, criado_em FROM metas WHERE id = ? AND user_id = ?').get(id, userId)
}

function criar(userId, dados) {
  const r = db.prepare('INSERT INTO metas (user_id, nome, descricao, valor_atual, valor_alvo, data_alvo, projeto_id) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    userId, dados.nome, dados.descricao || '', dados.valor_atual || 0, dados.valor_alvo, dados.data_alvo || null, dados.projeto_id || null
  )
  return buscarPorId(userId, r.lastInsertRowid)
}

function atualizar(userId, id, dados) {
  const meta = db.prepare('SELECT * FROM metas WHERE id = ? AND user_id = ?').get(id, userId)
  if (!meta) return null
  const campos = []
  const valores = []
  for (const c of ['nome', 'descricao', 'valor_alvo', 'data_alvo', 'projeto_id']) {
    if (dados[c] !== undefined) { campos.push(`${c} = ?`); valores.push(dados[c] || null) }
  }
  if (campos.length === 0) return meta
  valores.push(id)
  db.prepare(`UPDATE metas SET ${campos.join(', ')} WHERE id = ?`).run(...valores)
  return buscarPorId(userId, id)
}

function atualizarProgresso(userId, id, valorAtual) {
  const meta = db.prepare('SELECT * FROM metas WHERE id = ? AND user_id = ?').get(id, userId)
  if (!meta) return null
  db.prepare('UPDATE metas SET valor_atual = ? WHERE id = ?').run(valorAtual, id)
  return buscarPorId(userId, id)
}

function deletar(userId, id) {
  const r = db.prepare('DELETE FROM metas WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

module.exports = { listar, buscarPorId, criar, atualizar, atualizarProgresso, deletar }
