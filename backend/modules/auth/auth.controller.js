const express = require('express')
const router = express.Router()
const authService = require('./auth.service')
const { requireAuth } = require('../../middleware/auth')
const { loginLimiter } = require('../../middleware/rateLimit')
const { validarCamposObrigatorios, validarEmail } = require('../../utils/validate')
const { sanitizarString } = require('../../utils/validate')

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, senha } = req.body
    validarCamposObrigatorios(['email', 'senha'], req.body)
    validarEmail(email)
    const user = await authService.login(sanitizarString(email), senha)
    req.session.userId = user.id
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

router.post('/logout', requireAuth, (req, res, next) => {
  try {
    req.session.destroy()
    res.json({ mensagem: 'Logout realizado' })
  } catch (err) {
    next(err)
  }
})

router.get('/me', requireAuth, (req, res, next) => {
  try {
    const user = authService.me(req.session.userId)
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

router.put('/senha', requireAuth, async (req, res, next) => {
  try {
    const { senha_atual, nova_senha } = req.body
    validarCamposObrigatorios(['senha_atual', 'nova_senha'], req.body)
    const resultado = await authService.alterarSenha(req.session.userId, senha_atual, nova_senha)
    res.json(resultado)
  } catch (err) {
    next(err)
  }
})

router.get('/configuracoes', requireAuth, (req, res, next) => {
  try {
    const config = authService.obterConfig(req.session.userId)
    res.json(config)
  } catch (err) {
    next(err)
  }
})

router.put('/configuracoes', requireAuth, (req, res, next) => {
  try {
    const config = authService.atualizarConfig(req.session.userId, req.body)
    res.json(config)
  } catch (err) {
    next(err)
  }
})

module.exports = router
