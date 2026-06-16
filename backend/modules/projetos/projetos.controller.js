const express = require('express')
const router = express.Router()
const projetosService = require('./projetos.service')
const { requireAuth } = require('../../middleware/auth')

router.get('/', requireAuth, (req, res, next) => {
  try { res.json(projetosService.listar(req.session.userId, req.query)) } catch (e) { next(e) }
})
router.post('/', requireAuth, (req, res, next) => {
  try { res.status(201).json(projetosService.criar(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/:id', requireAuth, (req, res, next) => {
  try { res.json(projetosService.atualizar(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/:id', requireAuth, (req, res, next) => {
  try { res.json(projetosService.deletar(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

router.get('/:id/tarefas', requireAuth, (req, res, next) => {
  try { res.json(projetosService.tarefas(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})
router.get('/:id/notas', requireAuth, (req, res, next) => {
  try { res.json(projetosService.notas(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})
router.get('/:id/metas', requireAuth, (req, res, next) => {
  try { res.json(projetosService.metas(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})
router.get('/:id/progresso', requireAuth, (req, res, next) => {
  try { res.json(projetosService.progresso(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

router.get('/:id/links', requireAuth, (req, res, next) => {
  try { res.json(projetosService.listarLinks(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})
router.post('/:id/links', requireAuth, (req, res, next) => {
  try { res.status(201).json(projetosService.criarLink(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/:id/links/:lid', requireAuth, (req, res, next) => {
  try { res.json(projetosService.deletarLink(req.session.userId, +req.params.id, +req.params.lid)) } catch (e) { next(e) }
})

module.exports = router
