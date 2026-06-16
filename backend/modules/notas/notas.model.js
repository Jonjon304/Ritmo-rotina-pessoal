const db = require('../../db/database')

function listarCadernos(userId) {
  return db.prepare('SELECT id, user_id, nome, cor, criado_em FROM cadernos WHERE user_id = ? ORDER BY nome').all(userId)
}

function criarCaderno(userId, dados) {
  const r = db.prepare('INSERT INTO cadernos (user_id, nome, cor) VALUES (?, ?, ?)').run(userId, dados.nome, dados.cor || '#ec4899')
  return db.prepare('SELECT id, nome, cor, criado_em FROM cadernos WHERE id = ?').get(r.lastInsertRowid)
}

function atualizarCaderno(userId, id, dados) {
  const c = db.prepare('SELECT * FROM cadernos WHERE id = ? AND user_id = ?').get(id, userId)
  if (!c) return null
  const campos = []
  const valores = []
  if (dados.nome !== undefined) { campos.push('nome = ?'); valores.push(dados.nome) }
  if (dados.cor !== undefined) { campos.push('cor = ?'); valores.push(dados.cor) }
  if (campos.length === 0) return c
  valores.push(id)
  db.prepare(`UPDATE cadernos SET ${campos.join(', ')} WHERE id = ?`).run(...valores)
  return db.prepare('SELECT id, nome, cor, criado_em FROM cadernos WHERE id = ?').get(id)
}

function deletarCaderno(userId, id) {
  const r = db.prepare('DELETE FROM cadernos WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

function listarNotas(userId, filtros, limite, offset) {
  let sql = 'SELECT id, user_id, titulo, conteudo, caderno_id, projeto_id, criado_em, atualizado_em FROM notas WHERE user_id = ?'
  const params = [userId]
  if (filtros.caderno_id) { sql += ' AND caderno_id = ?'; params.push(filtros.caderno_id) }
  if (filtros.projeto_id) { sql += ' AND projeto_id = ?'; params.push(filtros.projeto_id) }
  if (filtros.busca) { sql += ' AND (titulo LIKE ? OR conteudo LIKE ?)'; params.push(`%${filtros.busca}%`, `%${filtros.busca}%`) }
  const countSql = sql.replace('SELECT id, user_id, titulo, conteudo, caderno_id, projeto_id, criado_em, atualizado_em', 'SELECT COUNT(*) as total')
  const total = db.prepare(countSql).get(...params).total
  sql += ' ORDER BY atualizado_em DESC LIMIT ? OFFSET ?'
  params.push(limite, offset)
  const dados = db.prepare(sql).all(...params)
  return { dados, total }
}

function buscarNota(userId, id) {
  return db.prepare('SELECT * FROM notas WHERE id = ? AND user_id = ?').get(id, userId)
}

function criarNota(userId, dados) {
  const r = db.prepare("INSERT INTO notas (user_id, titulo, conteudo, caderno_id, projeto_id, atualizado_em) VALUES (?, ?, ?, ?, ?, datetime('now'))").run(
    userId, dados.titulo || 'Sem título', dados.conteudo || '', dados.caderno_id || null, dados.projeto_id || null
  )
  return db.prepare('SELECT id, titulo, conteudo, caderno_id, projeto_id, criado_em, atualizado_em FROM notas WHERE id = ?').get(r.lastInsertRowid)
}

function atualizarNota(userId, id, dados) {
  const nota = buscarNota(userId, id)
  if (!nota) return null
  const campos = []
  const valores = []
  for (const c of ['titulo', 'caderno_id', 'projeto_id']) {
    if (dados[c] !== undefined) { campos.push(`${c} = ?`); valores.push(dados[c] || null) }
  }
  if (dados.conteudo !== undefined) {
    campos.push('conteudo = ?'); valores.push(dados.conteudo)
    campos.push("atualizado_em = datetime('now')")
  }
  if (campos.length === 0) return nota
  valores.push(id)
  db.prepare(`UPDATE notas SET ${campos.join(', ')} WHERE id = ?`).run(...valores)
  return db.prepare('SELECT id, titulo, conteudo, caderno_id, projeto_id, criado_em, atualizado_em FROM notas WHERE id = ?').get(id)
}

function deletarNota(userId, id) {
  const r = db.prepare('DELETE FROM notas WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

module.exports = { listarCadernos, criarCaderno, atualizarCaderno, deletarCaderno, listarNotas, buscarNota, criarNota, atualizarNota, deletarNota }
