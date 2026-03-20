const express = require('express')
const router = express.Router()
const db = require('../database/db')

// GET — lista todas as tarefas
router.get('/', (req, res) => {
  const tarefas = db.prepare(
    'SELECT * FROM tarefas ORDER BY horario ASC'
  ).all()
  res.json(tarefas)
})

// POST — cria nova tarefa
router.post('/', (req, res) => {
  const { titulo, horario, duracao, categoria } = req.body
  if (!titulo || !horario || !duracao) {
    return res.status(400).json({ erro: 'campos obrigatórios faltando' })
  }
  const result = db.prepare(
    'INSERT INTO tarefas (titulo,horario,duracao,categoria) VALUES (?,?,?,?)'
  ).run(titulo, horario, duracao, categoria || 'pessoal')
  res.status(201).json({ id: result.lastInsertRowid })
})

// PUT — atualiza (marca como concluída)
router.put('/:id', (req, res) => {
  const { concluida } = req.body
  db.prepare('UPDATE tarefas SET concluida=? WHERE id=?')
    .run(concluida, req.params.id)
  res.json({ ok: true })
})

// DELETE — apaga uma tarefa
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM tarefas WHERE id=?')
    .run(req.params.id)
  res.json({ ok: true })
})

module.exports = router