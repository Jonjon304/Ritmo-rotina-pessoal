const express = require('express')
const router  = express.Router()

router.get('/status', (req, res) => {
  res.json({ status: 'ok', hora: new Date().toISOString() })
})

router.use('/auth', require('../modules/auth/auth.controller'))
router.use('/financas', require('../modules/financas/financas.controller'))
router.use('/tarefas', require('../modules/tarefas/tarefas.controller'))
router.use('/metas', require('../modules/metas/metas.controller'))
router.use('/cronograma', require('../modules/cronograma/cronograma.controller'))
router.use('/habitos', require('../modules/habitos/habitos.controller'))
router.use('/notas', require('../modules/notas/notas.controller'))
router.use('/projetos', require('../modules/projetos/projetos.controller'))
router.use('/hub', require('../modules/hub/hub.controller'))
router.use('/exportar', require('../modules/exportar/exportar.controller'))

module.exports = router
