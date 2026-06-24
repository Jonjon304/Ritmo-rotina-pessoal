const express = require('express')
const router = express.Router()
const multer = require('multer')
const { parse } = require('csv-parse/sync')
const financasService = require('./financas.service')
const { requireAuth } = require('../../middleware/auth')

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

router.get('/perfis', requireAuth, (req, res, next) => {
  try { res.json(financasService.listarPerfis(req.session.userId)) } catch (e) { next(e) }
})
router.post('/perfis', requireAuth, (req, res, next) => {
  try { res.status(201).json(financasService.criarPerfil(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/perfis/:id', requireAuth, (req, res, next) => {
  try { res.json(financasService.atualizarPerfil(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/perfis/:id', requireAuth, (req, res, next) => {
  try { res.json(financasService.deletarPerfil(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

router.get('/categorias', requireAuth, (req, res, next) => {
  try { res.json(financasService.listarCategorias(req.session.userId, req.query.tipo)) } catch (e) { next(e) }
})
router.post('/categorias', requireAuth, (req, res, next) => {
  try { res.status(201).json(financasService.criarCategoria(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/categorias/:id', requireAuth, (req, res, next) => {
  try { res.json(financasService.atualizarCategoria(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/categorias/:id', requireAuth, (req, res, next) => {
  try { res.json(financasService.deletarCategoria(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

router.get('/transacoes', requireAuth, (req, res, next) => {
  try { res.json(financasService.listarTransacoes(req.session.userId, req.query)) } catch (e) { next(e) }
})
router.post('/transacoes', requireAuth, (req, res, next) => {
  try { res.status(201).json(financasService.criarTransacao(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/transacoes/:id', requireAuth, (req, res, next) => {
  try { res.json(financasService.atualizarTransacao(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/transacoes/:id', requireAuth, (req, res, next) => {
  try { res.json(financasService.deletarTransacao(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

router.get('/fixas', requireAuth, (req, res, next) => {
  try { res.json(financasService.listarFixas(req.session.userId)) } catch (e) { next(e) }
})
router.post('/fixas', requireAuth, (req, res, next) => {
  try { res.status(201).json(financasService.criarFixa(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/fixas/:id', requireAuth, (req, res, next) => {
  try { res.json(financasService.atualizarFixa(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/fixas/:id', requireAuth, (req, res, next) => {
  try { res.json(financasService.deletarFixa(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

router.get('/investimentos', requireAuth, (req, res, next) => {
  try { res.json(financasService.listarInvestimentos(req.session.userId)) } catch (e) { next(e) }
})
router.post('/investimentos', requireAuth, (req, res, next) => {
  try { res.status(201).json(financasService.criarInvestimento(req.session.userId, req.body)) } catch (e) { next(e) }
})
router.put('/investimentos/:id', requireAuth, (req, res, next) => {
  try { res.json(financasService.atualizarInvestimento(req.session.userId, +req.params.id, req.body)) } catch (e) { next(e) }
})
router.delete('/investimentos/:id', requireAuth, (req, res, next) => {
  try { res.json(financasService.deletarInvestimento(req.session.userId, +req.params.id)) } catch (e) { next(e) }
})

router.get('/relatorios/mensal', requireAuth, (req, res, next) => {
  try { res.json(financasService.relatorioMensal(req.session.userId, req.query)) } catch (e) { next(e) }
})
router.get('/relatorios/geral', requireAuth, (req, res, next) => {
  try { res.json(financasService.relatorioGeral(req.session.userId, req.query)) } catch (e) { next(e) }
})
router.get('/relatorios/stats', requireAuth, (req, res, next) => {
  try { res.json(financasService.stats(req.session.userId, req.query)) } catch (e) { next(e) }
})

router.post('/importar/csv', requireAuth, upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) { const e = new Error('Arquivo não enviado'); e.status = 400; throw e }
    const texto = req.file.buffer.toString('utf-8')
    const linhas = parse(texto, { columns: true, skip_empty_lines: true, delimiter: [',', ';', '\t'], relax_column_count: true })
    const todas = linhas.map(l => {
      const rawDate = l.Data || l.data || l.DATE || l.date || ''
      const nome = l.Descrição || l.Descricao || l.descrição || l.descricao || l.Description || l.description || l.Nome || l.nome || ''
      const rawValor = (l.Valor || l.valor || l.Amount || l.amount || '0').replace(',', '.')
      const valorNum = parseFloat(rawValor)
      const tipo = valorNum < 0 ? 'despesa' : 'receita'
      const valor = isNaN(valorNum) ? 0 : Math.abs(valorNum)
      let data = rawDate.trim()
      const brMatch = data.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/)
      if (brMatch) {
        const y = brMatch[3].length === 2 ? `20${brMatch[3]}` : brMatch[3]
        data = `${y}-${brMatch[2].padStart(2, '0')}-${brMatch[1].padStart(2, '0')}`
      }
      return { data, nome, valor, tipo, categoria_id: null, perfil_id: null }
    })
    res.json({ preview: todas.slice(0, 50), transacoes: todas })
  } catch (e) { next(e) }
})

router.post('/importar/confirmar', requireAuth, (req, res, next) => {
  try { res.json(financasService.confirmarImportacao(req.session.userId, req.body.transacoes)) } catch (e) { next(e) }
})

module.exports = router
