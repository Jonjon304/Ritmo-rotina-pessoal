require('dotenv').config()

const express      = require('express')
const session      = require('express-session')
const SQLiteStore  = require('./middleware/sessionStore')(session)
const helmet       = require('helmet')
const cors         = require('cors')
const path         = require('path')

const { apiLimiter } = require('./middleware/rateLimit')
const errorHandler   = require('./middleware/errorHandler')

const app  = express()
const PORT = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'
const devOrigin = process.env.CORS_DEV_ORIGIN || 'http://localhost:5500'

app.use(helmet({ contentSecurityPolicy: false }))

app.use(cors({
  origin: isProd ? process.env.FRONTEND_URL : devOrigin,
  credentials: true
}))

app.use(express.json())

app.use('/api/', apiLimiter)

const sessionMaxAge = (parseInt(process.env.SESSION_MAX_AGE_DAYS) || 7) * 24 * 60 * 60 * 1000

app.use(session({
  store: new SQLiteStore({
    db: process.env.SESSION_DB || 'sessions.db',
    dir: path.join(__dirname, 'db')
  }),
  secret: process.env.SESSION_SECRET || 'chave_de_seguranca_padrao_para_desenvolvimento',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: sessionMaxAge
  }
}))

app.get('/', (req, res) => {
  res.json({ versao: '1.0.0', timestamp: new Date().toISOString() })
})

const routes = require('./routes')
app.use('/api', routes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`\nServidor MyFinance rodando em http://localhost:${PORT}`)
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Iniciado em: ${new Date().toLocaleString('pt-BR')}\n`)
})
