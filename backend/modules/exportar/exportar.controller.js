const express = require('express')
const router = express.Router()
const exportarService = require('./exportar.service')
const { requireAuth } = require('../../middleware/auth')

router.get('/json', requireAuth, (req, res, next) => {
  try {
    res.setHeader('Content-Disposition', 'attachment; filename=myfinance-export.json')
    res.json(exportarService.exportarJSON(req.session.userId))
  } catch (e) { next(e) }
})

router.get('/csv', requireAuth, (req, res, next) => {
  try {
    const tabela = req.query.tabela
    if (!tabela) { const e = new Error('Parâmetro "tabela" é obrigatório'); e.status = 400; throw e }
    const csv = exportarService.exportarCSV(req.session.userId, tabela)
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename=${tabela}.csv`)
    res.send(csv)
  } catch (e) { next(e) }
})

module.exports = router
