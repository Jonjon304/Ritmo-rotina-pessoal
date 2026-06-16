const exportarModel = require('./exportar.model')

function exportarJSON(userId) {
  return exportarModel.exportarJSON(userId)
}

function exportarCSV(userId, tabela) {
  const result = exportarModel.exportarCSV(userId, tabela)
  if (result === null) { const e = new Error('Tabela não suportada para exportação CSV'); e.status = 400; throw e }
  return result
}

module.exports = { exportarJSON, exportarCSV }
