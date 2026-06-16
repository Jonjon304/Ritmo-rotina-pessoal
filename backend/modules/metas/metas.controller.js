const express = require('express')
const router = express.Router()
const metasService = require('./metas.service')
const { requireAuth } = require('../../middleware/auth')

router.get('/', requireAuth, (req, res, next) => {
  try { res.json(metasService.listar(req.session.userId, req.query)) } catch (e) { next(e) }
})
router.post('/', requireAuth, (req, res, next) => {
  try { res.status(201).json(metasService.criar(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/:id', requireAuth, (req, res, next) => {
  try { res.json(metasService.atualizar(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.patch('/:id/progresso', requireAuth, (req, res, next) => {
  try { res.json(metasService.atualizarProgresso(req.session.userId, +req.params.id, req.body.valor_atual)) } catch (e) { next(e) }
})
router.delete('/:id', requireAuth, (req, res, next) => {
  try { res.json(metasService.deletar(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

module.exports = router
