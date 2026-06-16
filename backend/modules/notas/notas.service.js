const notasModel = require('./notas.model')
const { validarCamposObrigatorios, sanitizarString } = require('../../utils/validate')
const { paginar, formatarRespostaPaginada } = require('../../utils/paginate')

function listarCadernos(userId) { return notasModel.listarCadernos(userId) }

function criarCaderno(userId, dados) {
  validarCamposObrigatorios(['nome'], dados)
  dados.nome = sanitizarString(dados.nome)
  return notasModel.criarCaderno(userId, dados)
}

function atualizarCaderno(userId, id, dados) {
  if (dados.nome) dados.nome = sanitizarString(dados.nome)
  const result = notasModel.atualizarCaderno(userId, id, dados)
  if (!result) { const e = new Error('Caderno não encontrado'); e.status = 404; throw e }
  return result
}

function deletarCaderno(userId, id) {
  if (!notasModel.deletarCaderno(userId, id)) { const e = new Error('Caderno não encontrado'); e.status = 404; throw e }
  return { mensagem: 'Caderno excluído' }
}

function listarNotas(userId, query) {
  const { limite, offset, pagina } = paginar(query)
  const filtros = {}
  if (query.caderno_id) filtros.caderno_id = query.caderno_id
  if (query.projeto_id) filtros.projeto_id = query.projeto_id
  if (query.busca) filtros.busca = query.busca
  const { dados, total } = notasModel.listarNotas(userId, filtros, limite, offset)
  return formatarRespostaPaginada(dados, total, pagina, limite)
}

function criarNota(userId, dados) {
  if (dados.titulo) dados.titulo = sanitizarString(dados.titulo)
  return notasModel.criarNota(userId, dados)
}

function atualizarNota(userId, id, dados) {
  if (dados.titulo) dados.titulo = sanitizarString(dados.titulo)
  const result = notasModel.atualizarNota(userId, id, dados)
  if (!result) { const e = new Error('Nota não encontrada'); e.status = 404; throw e }
  return result
}

function deletarNota(userId, id) {
  if (!notasModel.deletarNota(userId, id)) { const e = new Error('Nota não encontrada'); e.status = 404; throw e }
  return { mensagem: 'Nota excluída' }
}

module.exports = { listarCadernos, criarCaderno, atualizarCaderno, deletarCaderno, listarNotas, criarNota, atualizarNota, deletarNota }
