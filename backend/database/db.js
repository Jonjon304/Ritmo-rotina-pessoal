const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'cronograma.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS tarefas (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo    TEXT    NOT NULL,
    horario   TEXT    NOT NULL,
    duracao   INTEGER NOT NULL,
    categoria TEXT    DEFAULT 'pessoal',
    concluida INTEGER DEFAULT 0,
    data      TEXT    DEFAULT (date('now')),
    criado_em TEXT    DEFAULT (datetime('now'))
  )
`)

module.exports = db