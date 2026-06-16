const db = require('../../db/database')

function listar(userId, status) {
  if (status) return db.prepare('SELECT id, user_id, nome, cor, descricao, status, criado_em FROM projetos WHERE user_id = ? AND status = ? ORDER BY criado_em DESC').all(userId, status)
  return db.prepare('SELECT id, user_id, nome, cor, descricao, status, criado_em FROM projetos WHERE user_id = ? ORDER BY criado_em DESC').all(userId)
}

function buscarPorId(userId, id) {
  return db.prepare('SELECT * FROM projetos WHERE id = ? AND user_id = ?').get(id, userId)
}

function criar(userId, dados) {
  const r = db.prepare('INSERT INTO projetos (user_id, nome, cor, descricao, status) VALUES (?, ?, ?, ?, ?)').run(
    userId, dados.nome, dados.cor || '#f97316', dados.descricao || '', dados.status || 'em_andamento'
  )
  return db.prepare('SELECT id, nome, cor, descricao, status, criado_em FROM projetos WHERE id = ?').get(r.lastInsertRowid)
}

function atualizar(userId, id, dados) {
  const p = buscarPorId(userId, id)
  if (!p) return null
  const campos = []
  const valores = []
  for (const c of ['nome', 'cor', 'descricao', 'status']) {
    if (dados[c] !== undefined) { campos.push(`${c} = ?`); valores.push(dados[c]) }
  }
  if (campos.length === 0) return p
  valores.push(id)
  db.prepare(`UPDATE projetos SET ${campos.join(', ')} WHERE id = ?`).run(...valores)
  return db.prepare('SELECT id, nome, cor, descricao, status, criado_em FROM projetos WHERE id = ?').get(id)
}

function deletar(userId, id) {
  const r = db.prepare('DELETE FROM projetos WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

function tarefasDoProjeto(userId, projetoId) {
  if (!buscarPorId(userId, projetoId)) return null
  return db.prepare('SELECT id, nome, prioridade, status, vencimento FROM tarefas WHERE projeto_id = ? AND user_id = ? ORDER BY ordem, criado_em DESC').all(projetoId, userId)
}

function notasDoProjeto(userId, projetoId) {
  if (!buscarPorId(userId, projetoId)) return null
  return db.prepare('SELECT id, titulo, atualizado_em FROM notas WHERE projeto_id = ? AND user_id = ? ORDER BY atualizado_em DESC').all(projetoId, userId)
}

function metasDoProjeto(userId, projetoId) {
  if (!buscarPorId(userId, projetoId)) return null
  return db.prepare('SELECT id, nome, valor_atual, valor_alvo FROM metas WHERE projeto_id = ? AND user_id = ?').all(projetoId, userId)
}

function progressoDoProjeto(userId, projetoId) {
  if (!buscarPorId(userId, projetoId)) return null
  const row = db.prepare("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'concluida' THEN 1 ELSE 0 END) as concluidas FROM tarefas WHERE projeto_id = ? AND user_id = ?").get(projetoId, userId)
  return { tarefas_total: row.total, tarefas_concluidas: row.concluidas, percentual: row.total > 0 ? Math.round((row.concluidas / row.total) * 100) : 0 }
}

function listarLinks(projetoId) {
  return db.prepare('SELECT id, projeto_id, nome, url, tipo, criado_em FROM projeto_links WHERE projeto_id = ? ORDER BY criado_em').all(projetoId)
}

function criarLink(projetoId, dados) {
  const r = db.prepare('INSERT INTO projeto_links (projeto_id, nome, url, tipo) VALUES (?, ?, ?, ?)').run(
    projetoId, dados.nome, dados.url, dados.tipo || 'link'
  )
  return db.prepare('SELECT id, nome, url, tipo, criado_em FROM projeto_links WHERE id = ?').get(r.lastInsertRowid)
}

function deletarLink(projetoId, linkId) {
  const r = db.prepare('DELETE FROM projeto_links WHERE id = ? AND projeto_id = ?').run(linkId, projetoId)
  return r.changes > 0
}

module.exports = {
  listar, buscarPorId, criar, atualizar, deletar,
  tarefasDoProjeto, notasDoProjeto, metasDoProjeto, progressoDoProjeto,
  listarLinks, criarLink, deletarLink
}
