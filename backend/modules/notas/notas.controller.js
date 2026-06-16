const express = require('express')
const router = express.Router()
const notasService = require('./notas.service')
const { requireAuth } = require('../../middleware/auth')

router.get('/cadernos', requireAuth, (req, res, next) => {
  try { res.json(notasService.listarCadernos(req.session.userId)) } catch (e) { next(e) }
})
router.post('/cadernos', requireAuth, (req, res, next) => {
  try { res.status(201).json(notasService.criarCaderno(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/cadernos/:id', requireAuth, (req, res, next) => {
  try { res.json(notasService.atualizarCaderno(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/cadernos/:id', requireAuth, (req, res, next) => {
  try { res.json(notasService.deletarCaderno(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

router.get('/', requireAuth, (req, res, next) => {
  try { res.json(notasService.listarNotas(req.session.userId, req.query)) } catch (e) { next(e) }
})
router.post('/', requireAuth, (req, res, next) => {
  try { res.status(201).json(notasService.criarNota(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/:id', requireAuth, (req, res, next) => {
  try { res.json(notasService.atualizarNota(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/:id', requireAuth, (req, res, next) => {
  try { res.json(notasService.deletarNota(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

module.exports = router
