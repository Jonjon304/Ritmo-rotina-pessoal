const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const tarefasRoute = require('./routes/tarefas')
const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/api/tarefas', tarefasRoute)

app.get('/', (req, res) => {
  res.json({ mensagem: 'API MyFinance no AR: Developer: JhonJhon.....' })
})

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`)
})
