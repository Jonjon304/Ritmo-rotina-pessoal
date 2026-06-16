const db = require('../../db/database')

function listarTarefas(userId, filtros, limite, offset) {
  let sql = `SELECT t.id, t.user_id, t.nome, t.descricao, t.prioridade, t.status, t.vencimento, t.concluido_em, t.projeto_id, t.ordem, t.criado_em FROM tarefas t WHERE t.user_id = ?`
  const params = [userId]
  if (filtros.status) { sql += ' AND t.status = ?'; params.push(filtros.status) }
  if (filtros.prioridade) { sql += ' AND t.prioridade = ?'; params.push(filtros.prioridade) }
  if (filtros.projeto_id) { sql += ' AND t.projeto_id = ?'; params.push(filtros.projeto_id) }
  if (filtros.busca) { sql += ' AND (t.nome LIKE ? OR t.descricao LIKE ?)'; params.push(`%${filtros.busca}%`, `%${filtros.busca}%`) }
  if (filtros.tag_id) {
    sql += ' AND t.id IN (SELECT tarefa_id FROM tarefa_tags WHERE tag_id = ?)'
    params.push(filtros.tag_id)
  }
  const countSql = sql.replace('SELECT t.id, t.user_id, t.nome, t.descricao, t.prioridade, t.status, t.vencimento, t.concluido_em, t.projeto_id, t.ordem, t.criado_em FROM tarefas t', 'SELECT COUNT(*) as total FROM tarefas t')
  const total = db.prepare(countSql).get(...params).total
  sql += ' ORDER BY t.ordem, t.criado_em DESC LIMIT ? OFFSET ?'
  params.push(limite, offset)
  const tarefas = db.prepare(sql).all(...params)
  const resultado = tarefas.map(t => {
    const tags = db.prepare('SELECT tg.id, tg.nome, tg.cor FROM tags tg JOIN tarefa_tags tt ON tg.id = tt.tag_id WHERE tt.tarefa_id = ?').all(t.id)
    const sub_tarefas = db.prepare('SELECT id, nome, concluida, ordem FROM sub_tarefas WHERE tarefa_id = ? ORDER BY ordem').all(t.id)
    return { ...t, tags, sub_tarefas }
  })
  return { dados: resultado, total }
}

function criarTarefa(userId, dados) {
  const r = db.prepare('INSERT INTO tarefas (user_id, nome, descricao, prioridade, status, vencimento, projeto_id, ordem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    userId, dados.nome, dados.descricao || '', dados.prioridade || 'media',
    dados.status || 'afazer', dados.vencimento || null, dados.projeto_id || null, dados.ordem || 0
  )
  const tarefaId = r.lastInsertRowid
  if (dados.tags && dados.tags.length > 0) {
    const stmt = db.prepare('INSERT OR IGNORE INTO tarefa_tags (tarefa_id, tag_id) VALUES (?, ?)')
    for (const tagId of dados.tags) stmt.run(tarefaId, tagId)
  }
  return buscarTarefaPorId(userId, tarefaId)
}

function buscarTarefaPorId(userId, id) {
  const t = db.prepare('SELECT * FROM tarefas WHERE id = ? AND user_id = ?').get(id, userId)
  if (!t) return null
  const tags = db.prepare('SELECT tg.id, tg.nome, tg.cor FROM tags tg JOIN tarefa_tags tt ON tg.id = tt.tag_id WHERE tt.tarefa_id = ?').all(t.id)
  const sub_tarefas = db.prepare('SELECT id, nome, concluida, ordem FROM sub_tarefas WHERE tarefa_id = ? ORDER BY ordem').all(t.id)
  return { ...t, tags, sub_tarefas }
}

function atualizarTarefa(userId, id, dados) {
  const t = db.prepare('SELECT * FROM tarefas WHERE id = ? AND user_id = ?').get(id, userId)
  if (!t) return null
  const campos = []
  const valores = []
  for (const c of ['nome', 'descricao', 'prioridade', 'status', 'vencimento', 'projeto_id', 'ordem']) {
    if (dados[c] !== undefined) { campos.push(`${c} = ?`); valores.push(dados[c] || null) }
  }
  if (campos.length === 0 && !dados.tags) return buscarTarefaPorId(userId, id)
  if (campos.length > 0) { valores.push(id); db.prepare(`UPDATE tarefas SET ${campos.join(', ')} WHERE id = ?`).run(...valores) }
  if (dados.tags) {
    db.prepare('DELETE FROM tarefa_tags WHERE tarefa_id = ?').run(id)
    const stmt = db.prepare('INSERT OR IGNORE INTO tarefa_tags (tarefa_id, tag_id) VALUES (?, ?)')
    for (const tagId of dados.tags) stmt.run(id, tagId)
  }
  return buscarTarefaPorId(userId, id)
}

function mudarStatus(userId, id, status) {
  const t = db.prepare('SELECT * FROM tarefas WHERE id = ? AND user_id = ?').get(id, userId)
  if (!t) return null
  if (status === 'concluida') {
    db.prepare("UPDATE tarefas SET status = ?, concluido_em = datetime('now') WHERE id = ?").run(status, id)
  } else {
    db.prepare('UPDATE tarefas SET status = ?, concluido_em = NULL WHERE id = ?').run(status, id)
  }
  return buscarTarefaPorId(userId, id)
}

function deletarTarefa(userId, id) {
  const r = db.prepare('DELETE FROM tarefas WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

function listarSubTarefas(userId, tarefaId) {
  const t = db.prepare('SELECT id FROM tarefas WHERE id = ? AND user_id = ?').get(tarefaId, userId)
  if (!t) return null
  return db.prepare('SELECT id, nome, concluida, ordem FROM sub_tarefas WHERE tarefa_id = ? ORDER BY ordem').all(tarefaId)
}

function criarSubTarefa(userId, tarefaId, dados) {
  const t = db.prepare('SELECT id FROM tarefas WHERE id = ? AND user_id = ?').get(tarefaId, userId)
  if (!t) return null
  const r = db.prepare('INSERT INTO sub_tarefas (tarefa_id, nome, concluida, ordem) VALUES (?, ?, ?, ?)').run(
    tarefaId, dados.nome, 0, dados.ordem || 0
  )
  return db.prepare('SELECT id, nome, concluida, ordem FROM sub_tarefas WHERE id = ?').get(r.lastInsertRowid)
}

function atualizarSubTarefa(userId, tarefaId, subId, dados) {
  const t = db.prepare('SELECT id FROM tarefas WHERE id = ? AND user_id = ?').get(tarefaId, userId)
  if (!t) return null
  const campos = []
  const valores = []
  for (const c of ['nome', 'concluida', 'ordem']) {
    if (dados[c] !== undefined) { campos.push(`${c} = ?`); valores.push(dados[c]) }
  }
  if (campos.length === 0) return db.prepare('SELECT id, nome, concluida, ordem FROM sub_tarefas WHERE id = ?').get(subId)
  valores.push(subId)
  db.prepare(`UPDATE sub_tarefas SET ${campos.join(', ')} WHERE id = ? AND tarefa_id = ?`).run(...valores, tarefaId)
  return db.prepare('SELECT id, nome, concluida, ordem FROM sub_tarefas WHERE id = ?').get(subId)
}

function deletarSubTarefa(userId, tarefaId, subId) {
  const t = db.prepare('SELECT id FROM tarefas WHERE id = ? AND user_id = ?').get(tarefaId, userId)
  if (!t) return false
  const r = db.prepare('DELETE FROM sub_tarefas WHERE id = ? AND tarefa_id = ?').run(subId, tarefaId)
  return r.changes > 0
}

function listarTags(userId) {
  return db.prepare('SELECT id, nome, cor FROM tags WHERE user_id = ? ORDER BY nome').all(userId)
}

function criarTag(userId, dados) {
  const r = db.prepare('INSERT INTO tags (user_id, nome, cor) VALUES (?, ?, ?)').run(userId, dados.nome, dados.cor || '#3b82f6')
  return db.prepare('SELECT id, nome, cor FROM tags WHERE id = ?').get(r.lastInsertRowid)
}

function atualizarTag(userId, id, dados) {
  const tag = db.prepare('SELECT * FROM tags WHERE id = ? AND user_id = ?').get(id, userId)
  if (!tag) return null
  const campos = []
  const valores = []
  if (dados.nome !== undefined) { campos.push('nome = ?'); valores.push(dados.nome) }
  if (dados.cor !== undefined) { campos.push('cor = ?'); valores.push(dados.cor) }
  if (campos.length === 0) return tag
  valores.push(id)
  db.prepare(`UPDATE tags SET ${campos.join(', ')} WHERE id = ?`).run(...valores)
  return db.prepare('SELECT id, nome, cor FROM tags WHERE id = ?').get(id)
}

function deletarTag(userId, id) {
  const r = db.prepare('DELETE FROM tags WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

module.exports = {
  listarTarefas, criarTarefa, buscarTarefaPorId, atualizarTarefa, mudarStatus, deletarTarefa,
  listarSubTarefas, criarSubTarefa, atualizarSubTarefa, deletarSubTarefa,
  listarTags, criarTag, atualizarTag, deletarTag
}
