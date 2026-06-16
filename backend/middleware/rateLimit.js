const rateLimit = require('express-rate-limit')

const apiWindowMs = (parseInt(process.env.RATE_LIMIT_WINDOW_MIN) || 15) * 60 * 1000
const apiMax = parseInt(process.env.RATE_LIMIT_MAX) || 500
const loginMax = parseInt(process.env.RATE_LIMIT_LOGIN_MAX) || 10

const apiLimiter = rateLimit({
  windowMs: apiWindowMs,
  max: apiMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas requisicoes. Tente novamente mais tarde.' }
})

const loginLimiter = rateLimit({
  windowMs: apiWindowMs,
  max: loginMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Aguarde alguns minutos.' }
})

module.exports = { apiLimiter, loginLimiter }
