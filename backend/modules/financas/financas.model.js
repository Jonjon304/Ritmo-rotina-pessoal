const db = require('../../db/database')

const PERFIS_COLS = 'id, user_id, nome, cor, icone, criado_em'
const CATEGORIAS_COLS = 'id, user_id, nome, icone, cor, tipo, criado_em'
const TRANSACOES_COLS = 'id, user_id, tipo, nome, valor, data, categoria_id, perfil_id, observacao, fixa_id, recorrente, criado_em'
const FIXAS_COLS = 'id, user_id, tipo, nome, valor, dia_mes, frequencia, categoria_id, perfil_id, ativa, data_fim, criado_em'
const INVEST_COLS = 'id, user_id, nome, tipo, perfil_id, valor_aplicado, rendimento_acumulado, data_aplicacao, data_vencimento, criado_em'

function listarPerfis(userId) {
  return db.prepare(`SELECT ${PERFIS_COLS} FROM perfis WHERE user_id = ? ORDER BY criado_em`).all(userId)
}

function criarPerfil(userId, dados) {
  const r = db.prepare('INSERT INTO perfis (user_id, nome, cor, icone) VALUES (?, ?, ?, ?)').run(
    userId, dados.nome, dados.cor || '#8b5cf6', dados.icone || ''
  )
  return db.prepare(`SELECT ${PERFIS_COLS} FROM perfis WHERE id = ?`).get(r.lastInsertRowid)
}

function atualizarPerfil(userId, id, dados) {
  const perfil = db.prepare('SELECT * FROM perfis WHERE id = ? AND user_id = ?').get(id, userId)
  if (!perfil) return null
  const campos = []
  const valores = []
  for (const c of ['nome', 'cor', 'icone']) {
    if (dados[c] !== undefined) { campos.push(`${c} = ?`); valores.push(dados[c]) }
  }
  if (campos.length === 0) return perfil
  valores.push(id)
  db.prepare(`UPDATE perfis SET ${campos.join(', ')} WHERE id = ?`).run(...valores)
  return db.prepare(`SELECT ${PERFIS_COLS} FROM perfis WHERE id = ?`).get(id)
}

function deletarPerfil(userId, id) {
  const r = db.prepare('DELETE FROM perfis WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

function listarCategorias(userId, tipo) {
  if (tipo) return db.prepare(`SELECT ${CATEGORIAS_COLS} FROM categorias WHERE user_id = ? AND tipo = ? ORDER BY nome`).all(userId, tipo)
  return db.prepare(`SELECT ${CATEGORIAS_COLS} FROM categorias WHERE user_id = ? ORDER BY tipo, nome`).all(userId)
}

function criarCategoria(userId, dados) {
  const r = db.prepare('INSERT INTO categorias (user_id, nome, icone, cor, tipo) VALUES (?, ?, ?, ?, ?)').run(
    userId, dados.nome, dados.icone || '', dados.cor || '#6b7280', dados.tipo
  )
  return db.prepare(`SELECT ${CATEGORIAS_COLS} FROM categorias WHERE id = ?`).get(r.lastInsertRowid)
}

function atualizarCategoria(userId, id, dados) {
  const cat = db.prepare('SELECT * FROM categorias WHERE id = ? AND user_id = ?').get(id, userId)
  if (!cat) return null
  const campos = []
  const valores = []
  for (const c of ['nome', 'icone', 'cor', 'tipo']) {
    if (dados[c] !== undefined) { campos.push(`${c} = ?`); valores.push(dados[c]) }
  }
  if (campos.length === 0) return cat
  valores.push(id)
  db.prepare(`UPDATE categorias SET ${campos.join(', ')} WHERE id = ?`).run(...valores)
  return db.prepare(`SELECT ${CATEGORIAS_COLS} FROM categorias WHERE id = ?`).get(id)
}

function deletarCategoria(userId, id) {
  const r = db.prepare('DELETE FROM categorias WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

function listarTransacoes(userId, filtros, pag, limite, offset) {
  let sql = `SELECT t.*, c.nome as categoria_nome FROM transacoes t LEFT JOIN categorias c ON t.categoria_id = c.id WHERE t.user_id = ?`
  const params = [userId]
  if (filtros.mes) { sql += ' AND t.data LIKE ?'; params.push(`${filtros.mes}%`) }
  if (filtros.tipo) { sql += ' AND t.tipo = ?'; params.push(filtros.tipo) }
  if (filtros.categoria_id) { sql += ' AND t.categoria_id = ?'; params.push(filtros.categoria_id) }
  if (filtros.perfil_id) { sql += ' AND t.perfil_id = ?'; params.push(filtros.perfil_id) }
  if (filtros.busca) { sql += ' AND t.nome LIKE ?'; params.push(`%${filtros.busca}%`) }
  const countSql = sql.replace(/SELECT t\.\*, c\.nome as categoria_nome/, 'SELECT COUNT(*) as total')
  const total = db.prepare(countSql).get(...params).total
  sql += ' ORDER BY t.data DESC, t.criado_em DESC LIMIT ? OFFSET ?'
  params.push(limite, offset)
  const dados = db.prepare(sql).all(...params)
  return { dados, total }
}

function criarTransacao(userId, dados) {
  const r = db.prepare('INSERT INTO transacoes (user_id, tipo, nome, valor, data, categoria_id, perfil_id, observacao, fixa_id, recorrente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    userId, dados.tipo, dados.nome, dados.valor, dados.data,
    dados.categoria_id || null, dados.perfil_id || null, dados.observacao || '',
    dados.fixa_id || null, dados.fixa_id ? 1 : 0
  )
  return db.prepare(`SELECT ${TRANSACOES_COLS} FROM transacoes WHERE id = ?`).get(r.lastInsertRowid)
}

function atualizarTransacao(userId, id, dados) {
  const t = db.prepare('SELECT * FROM transacoes WHERE id = ? AND user_id = ?').get(id, userId)
  if (!t) return null
  const campos = []
  const valores = []
  for (const c of ['tipo', 'nome', 'valor', 'data', 'categoria_id', 'perfil_id', 'observacao']) {
    if (dados[c] !== undefined) { campos.push(`${c} = ?`); valores.push(dados[c]) }
  }
  if (campos.length === 0) return t
  valores.push(id)
  db.prepare(`UPDATE transacoes SET ${campos.join(', ')} WHERE id = ?`).run(...valores)
  return db.prepare(`SELECT ${TRANSACOES_COLS} FROM transacoes WHERE id = ?`).get(id)
}

function deletarTransacao(userId, id) {
  const r = db.prepare('DELETE FROM transacoes WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

function listarFixas(userId) {
  return db.prepare(`SELECT ${FIXAS_COLS} FROM transacoes_fixas WHERE user_id = ? ORDER BY dia_mes`).all(userId)
}

function criarFixa(userId, dados) {
  const r = db.prepare('INSERT INTO transacoes_fixas (user_id, tipo, nome, valor, dia_mes, frequencia, categoria_id, perfil_id, ativa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
    userId, dados.tipo, dados.nome, dados.valor, dados.dia_mes,
    dados.frequencia || 'mensal', dados.categoria_id || null, dados.perfil_id || null, dados.ativa !== undefined ? dados.ativa : 1
  )
  return db.prepare(`SELECT ${FIXAS_COLS} FROM transacoes_fixas WHERE id = ?`).get(r.lastInsertRowid)
}

function atualizarFixa(userId, id, dados) {
  const f = db.prepare('SELECT * FROM transacoes_fixas WHERE id = ? AND user_id = ?').get(id, userId)
  if (!f) return null
  const campos = []
  const valores = []
  for (const c of ['tipo', 'nome', 'valor', 'dia_mes', 'frequencia', 'ativa', 'data_fim', 'categoria_id', 'perfil_id']) {
    if (dados[c] !== undefined) { campos.push(`${c} = ?`); valores.push(dados[c]) }
  }
  if (campos.length === 0) return f
  valores.push(id)
  db.prepare(`UPDATE transacoes_fixas SET ${campos.join(', ')} WHERE id = ?`).run(...valores)
  return db.prepare(`SELECT ${FIXAS_COLS} FROM transacoes_fixas WHERE id = ?`).get(id)
}

function deletarFixa(userId, id) {
  const r = db.prepare('DELETE FROM transacoes_fixas WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

function listarInvestimentos(userId) {
  return db.prepare(`SELECT ${INVEST_COLS} FROM investimentos WHERE user_id = ? ORDER BY criado_em`).all(userId)
}

function criarInvestimento(userId, dados) {
  const r = db.prepare('INSERT INTO investimentos (user_id, nome, tipo, perfil_id, valor_aplicado, rendimento_acumulado, data_aplicacao, data_vencimento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    userId, dados.nome, dados.tipo, dados.perfil_id || null,
    dados.valor_aplicado, dados.rendimento_acumulado || 0,
    dados.data_aplicacao || null, dados.data_vencimento || null
  )
  return db.prepare(`SELECT ${INVEST_COLS} FROM investimentos WHERE id = ?`).get(r.lastInsertRowid)
}

function atualizarInvestimento(userId, id, dados) {
  const inv = db.prepare('SELECT * FROM investimentos WHERE id = ? AND user_id = ?').get(id, userId)
  if (!inv) return null
  const campos = []
  const valores = []
  for (const c of ['nome', 'tipo', 'valor_aplicado', 'rendimento_acumulado', 'data_vencimento']) {
    if (dados[c] !== undefined) { campos.push(`${c} = ?`); valores.push(dados[c]) }
  }
  if (campos.length === 0) return inv
  valores.push(id)
  db.prepare(`UPDATE investimentos SET ${campos.join(', ')} WHERE id = ?`).run(...valores)
  return db.prepare(`SELECT ${INVEST_COLS} FROM investimentos WHERE id = ?`).get(id)
}

function deletarInvestimento(userId, id) {
  const r = db.prepare('DELETE FROM investimentos WHERE id = ? AND user_id = ?').run(id, userId)
  return r.changes > 0
}

function relatorioMensal(userId, mes, perfilId) {
  let base = 'SELECT tipo, SUM(valor) as total FROM transacoes WHERE user_id = ? AND data LIKE ?'
  const params = [userId, `${mes}%`]
  if (perfilId) { base += ' AND perfil_id = ?'; params.push(perfilId) }
  base += ' GROUP BY tipo'
  const rows = db.prepare(base).all(...params)
  let receitas = 0, despesas = 0
  rows.forEach(r => { if (r.tipo === 'receita') receitas = r.total; else despesas = r.total })
  let catSql = 'SELECT c.nome as categoria, c.tipo, SUM(t.valor) as valor FROM transacoes t JOIN categorias c ON t.categoria_id = c.id WHERE t.user_id = ? AND t.data LIKE ?'
  const catParams = [userId, `${mes}%`]
  if (perfilId) { catSql += ' AND t.perfil_id = ?'; catParams.push(perfilId) }
  catSql += ' GROUP BY t.categoria_id ORDER BY valor DESC'
  const porCategoria = db.prepare(catSql).all(...catParams)
  return { receitas, despesas, saldo: receitas - despesas, por_categoria: porCategoria }
}

function relatorioGeral(userId, perfilId) {
  const invRows = db.prepare('SELECT SUM(valor_aplicado + rendimento_acumulado) as total FROM investimentos WHERE user_id = ?').get(userId)
  const patrimonioInvest = invRows.total || 0
  let recSql = 'SELECT SUM(valor) as total FROM transacoes WHERE user_id = ? AND tipo = ?'
  const recParams = [userId, 'receita']
  const despParams = [userId, 'despesa']
  const recTotal = db.prepare(recSql).get(...recParams).total || 0
  const despTotal = db.prepare(recSql).get(...despParams).total || 0
  const patrimonio = patrimonioInvest + recTotal - despTotal
  let evoSql = `SELECT substr(data,1,7) as mes, SUM(CASE WHEN tipo='receita' THEN valor ELSE 0 END) as receitas, SUM(CASE WHEN tipo='despesa' THEN valor ELSE 0 END) as despesas FROM transacoes WHERE user_id = ? GROUP BY substr(data,1,7) ORDER BY mes DESC LIMIT 12`
  const evolucao = db.prepare(evoSql).all(userId).reverse()
  let fixosSql = "SELECT 'fixo' as tipo, SUM(valor) as total FROM transacoes_fixas WHERE user_id = ? AND ativa = 1"
  let varSql = 'SELECT SUM(valor) as total FROM transacoes WHERE user_id = ? AND recorrente = 0'
  const fixosTotal = db.prepare(fixosSql).get(userId).total || 0
  const varTotal = db.prepare(varSql).get(userId).total || 0
  return { patrimonio, evolucao_mensal: evolucao, fixos_vs_variaveis: { fixos: fixosTotal, variaveis: varTotal } }
}

function stats(userId, mes, perfilId) {
  let baseReceita = 'SELECT COALESCE(SUM(valor),0) as total FROM transacoes WHERE user_id = ? AND tipo = ? AND data LIKE ?'
  const p = [userId, `${mes}%`]
  const receitasMes = db.prepare(baseReceita).get(userId, 'receita', `${mes}%`).total
  const despesasMes = db.prepare(baseReceita).get(userId, 'despesa', `${mes}%`).total
  const saldoTotal = receitasMes - despesasMes
  const custosFixos = db.prepare("SELECT COALESCE(SUM(valor),0) as total FROM transacoes_fixas WHERE user_id = ? AND ativa = 1").get(userId).total
  const ultimo = db.prepare('SELECT nome, data FROM transacoes WHERE user_id = ? ORDER BY data DESC, criado_em DESC LIMIT 1').get(userId)
  return { saldo_total: saldoTotal, receitas_mes: receitasMes, despesas_mes: despesasMes, custos_fixos: custosFixos, ultimo_lancamento: ultimo || null }
}

function importarEmLote(userId, transacoes) {
  const stmt = db.prepare('INSERT INTO transacoes (user_id, tipo, nome, valor, data, categoria_id, perfil_id) VALUES (?, ?, ?, ?, ?, ?, ?)')
  let count = 0
  const insertMany = db.transaction(items => {
    for (const t of items) {
      stmt.run(userId, t.tipo, t.nome, t.valor, t.data, t.categoria_id || null, t.perfil_id || null)
      count++
    }
  })
  insertMany(transacoes)
  return count
}

module.exports = {
  listarPerfis, criarPerfil, atualizarPerfil, deletarPerfil,
  listarCategorias, criarCategoria, atualizarCategoria, deletarCategoria,
  listarTransacoes, criarTransacao, atualizarTransacao, deletarTransacao,
  listarFixas, criarFixa, atualizarFixa, deletarFixa,
  listarInvestimentos, criarInvestimento, atualizarInvestimento, deletarInvestimento,
  relatorioMensal, relatorioGeral, stats, importarEmLote
}
