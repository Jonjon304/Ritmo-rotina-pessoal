const express = require('express')
const router = express.Router()
const cronogramaService = require('./cronograma.service')
const { requireAuth } = require('../../middleware/auth')

router.get('/eventos', requireAuth, (req, res, next) => {
  try { res.json(cronogramaService.listar(req.session.userId, req.query)) } catch (e) { next(e) }
})
router.post('/eventos', requireAuth, (req, res, next) => {
  try { res.status(201).json(cronogramaService.criar(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/eventos/:id', requireAuth, (req, res, next) => {
  try { res.json(cronogramaService.atualizar(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/eventos/:id', requireAuth, (req, res, next) => {
  try { res.json(cronogramaService.deletar(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})
router.get('/dia/:data', requireAuth, (req, res, next) => {
  try { res.json(cronogramaService.diaConsolidado(req.session.userId, req.params.data)) } catch (e) { next(e) }
})

module.exports = router
