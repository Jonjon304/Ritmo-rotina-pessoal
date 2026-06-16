const db = require('../../db/database')

function exportarJSON(userId) {
  const data = {
    usuario: db.prepare('SELECT id, nome, email, avatar, criado_em FROM users WHERE id = ?').get(userId),
    configuracoes: db.prepare('SELECT * FROM configuracoes WHERE user_id = ?').get(userId),
    perfis: db.prepare('SELECT * FROM perfis WHERE user_id = ?').all(userId),
    categorias: db.prepare('SELECT * FROM categorias WHERE user_id = ?').all(userId),
    transacoes: db.prepare('SELECT * FROM transacoes WHERE user_id = ?').all(userId),
    transacoes_fixas: db.prepare('SELECT * FROM transacoes_fixas WHERE user_id = ?').all(userId),
    investimentos: db.prepare('SELECT * FROM investimentos WHERE user_id = ?').all(userId),
    tags: db.prepare('SELECT * FROM tags WHERE user_id = ?').all(userId),
    tarefas: db.prepare('SELECT * FROM tarefas WHERE user_id = ?').all(userId),
    sub_tarefas: db.prepare('SELECT st.* FROM sub_tarefas st JOIN tarefas t ON st.tarefa_id = t.id WHERE t.user_id = ?').all(userId),
    tarefa_tags: db.prepare('SELECT tt.* FROM tarefa_tags tt JOIN tarefas t ON tt.tarefa_id = t.id WHERE t.user_id = ?').all(userId),
    metas: db.prepare('SELECT * FROM metas WHERE user_id = ?').all(userId),
    eventos: db.prepare('SELECT * FROM eventos WHERE user_id = ?').all(userId),
    habitos: db.prepare('SELECT * FROM habitos WHERE user_id = ?').all(userId),
    habito_checks: db.prepare('SELECT hc.* FROM habito_checks hc JOIN habitos h ON hc.habito_id = h.id WHERE h.user_id = ?').all(userId),
    cadernos: db.prepare('SELECT * FROM cadernos WHERE user_id = ?').all(userId),
    notas: db.prepare('SELECT * FROM notas WHERE user_id = ?').all(userId),
    projetos: db.prepare('SELECT * FROM projetos WHERE user_id = ?').all(userId),
    projeto_links: db.prepare('SELECT pl.* FROM projeto_links pl JOIN projetos p ON pl.projeto_id = p.id WHERE p.user_id = ?').all(userId)
  }
  return data
}

function exportarCSV(userId, tabela) {
  const map = {
    transacoes: { table: 'transacoes', fk: 'user_id' },
    transacoes_fixas: { table: 'transacoes_fixas', fk: 'user_id' },
    investimentos: { table: 'investimentos', fk: 'user_id' },
    tarefas: { table: 'tarefas', fk: 'user_id' },
    metas: { table: 'metas', fk: 'user_id' },
    eventos: { table: 'eventos', fk: 'user_id' },
    habitos: { table: 'habitos', fk: 'user_id' },
    notas: { table: 'notas', fk: 'user_id' },
    projetos: { table: 'projetos', fk: 'user_id' }
  }
  const cfg = map[tabela]
  if (!cfg) return null
  const rows = db.prepare(`SELECT * FROM ${cfg.table} WHERE ${cfg.fk} = ?`).all(userId)
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map(h => {
      const val = row[h] === null ? '' : String(row[h])
      return val.includes(',') || val.includes('"') || val.includes('\n') ? `"${val.replace(/"/g, '""')}"` : val
    }).join(','))
  }
  return lines.join('\n')
}

module.exports = { exportarJSON, exportarCSV }
