const express = require('express')
const router = express.Router()
const tarefasService = require('./tarefas.service')
const { requireAuth } = require('../../middleware/auth')

router.get('/tags', requireAuth, (req, res, next) => {
  try { res.json(tarefasService.listarTags(req.session.userId)) } catch (e) { next(e) }
})
router.post('/tags', requireAuth, (req, res, next) => {
  try { res.status(201).json(tarefasService.criarTag(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/tags/:id', requireAuth, (req, res, next) => {
  try { res.json(tarefasService.atualizarTag(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/tags/:id', requireAuth, (req, res, next) => {
  try { res.json(tarefasService.deletarTag(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

router.get('/', requireAuth, (req, res, next) => {
  try { res.json(tarefasService.listar(req.session.userId, req.query)) } catch (e) { next(e) }
})
router.post('/', requireAuth, (req, res, next) => {
  try { res.status(201).json(tarefasService.criar(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/:id', requireAuth, (req, res, next) => {
  try { res.json(tarefasService.atualizar(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.patch('/:id/status', requireAuth, (req, res, next) => {
  try { res.json(tarefasService.mudarStatus(req.session.userId, +req.params.id, req.body.status)) } catch (e) { next(e) }
})
router.delete('/:id', requireAuth, (req, res, next) => {
  try { res.json(tarefasService.deletar(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

router.get('/:id/subtarefas', requireAuth, (req, res, next) => {
  try { res.json(tarefasService.listarSubTarefas(req.session.userId, req.params.id)) } catch (e) { next(e) }
})
router.post('/:id/subtarefas', requireAuth, (req, res, next) => {
  try { res.status(201).json(tarefasService.criarSubTarefa(req.session.userId, req.params.id, req.body)) } catch (e) { next(e) }
})
router.patch('/:id/subtarefas/:sid', requireAuth, (req, res, next) => {
  try { res.json(tarefasService.atualizarSubTarefa(req.session.userId, req.params.id, req.params.sid, req.body)) } catch (e) { next(e) }
})
router.delete('/:id/subtarefas/:sid', requireAuth, (req, res, next) => {
  try { res.json(tarefasService.deletarSubTarefa(req.session.userId, req.params.id, req.params.sid)) } catch (e) { next(e) }
})

module.exports = router
