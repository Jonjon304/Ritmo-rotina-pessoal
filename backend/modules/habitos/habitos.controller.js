const express = require('express')
const router = express.Router()
const habitosService = require('./habitos.service')
const { requireAuth } = require('../../middleware/auth')

router.get('/checks', requireAuth, (req, res, next) => {
  try { res.json(habitosService.listarChecks(req.session.userId, req.query)) } catch (e) { next(e) }
})

router.get('/', requireAuth, (req, res, next) => {
  try { res.json(habitosService.listar(req.session.userId)) } catch (e) { next(e) }
})
router.post('/', requireAuth, (req, res, next) => {
  try { res.status(201).json(habitosService.criar(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/:id', requireAuth, (req, res, next) => {
  try { res.json(habitosService.atualizar(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/:id', requireAuth, (req, res, next) => {
  try { res.json(habitosService.deletar(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

router.post('/:id/check', requireAuth, (req, res, next) => {
  try { res.status(201).json(habitosService.marcarCheck(req.session.userId, +req.params.id, req.body.data)) } catch (e) { next(e) }
})
router.delete('/:id/check', requireAuth, (req, res, next) => {
  try { res.json(habitosService.desmarcarCheck(req.session.userId, +req.params.id, req.query.data)) } catch (e) { next(e) }
})
router.get('/:id/stats', requireAuth, (req, res, next) => {
  try { res.json(habitosService.obterStats(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

module.exports = router
