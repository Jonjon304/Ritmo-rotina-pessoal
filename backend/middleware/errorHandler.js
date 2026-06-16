function errorHandler(err, req, res, next) {
  console.error('Erro:', err.stack)
  const isDev = process.env.NODE_ENV === 'development'
  const statusCode = err.status || 500
  res.status(statusCode).json({
    erro: err.message || 'Ocorreu um erro interno no servidor.',
    detalhes: isDev ? err.stack : undefined
  })
}

module.exports = errorHandler
