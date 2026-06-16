const cronogramaModel = require('./cronograma.model')
const { validarCamposObrigatorios, validarEnum, sanitizarString } = require('../../utils/validate')

function listar(userId, query) {
  const filtros = {}
  if (query.mes) filtros.mes = query.mes
  if (query.data) filtros.data = query.data
  return cronogramaModel.listar(userId, filtros)
}

function criar(userId, dados) {
  validarCamposObrigatorios(['nome', 'tipo', 'data_inicio'], dados)
  validarEnum(dados.tipo, ['com_horario', 'dia_inteiro', 'lembrete'], 'tipo')
  if (dados.recorrencia_tipo) validarEnum(dados.recorrencia_tipo, ['semanal', 'quinzenal', 'mensal', 'anual'], 'recorrencia_tipo')
  dados.nome = sanitizarString(dados.nome)
  return cronogramaModel.criar(userId, dados)
}

function atualizar(userId, id, dados) {
  if (dados.tipo) validarEnum(dados.tipo, ['com_horario', 'dia_inteiro', 'lembrete'], 'tipo')
  if (dados.recorrencia_tipo) validarEnum(dados.recorrencia_tipo, ['semanal', 'quinzenal', 'mensal', 'anual'], 'recorrencia_tipo')
  if (dados.nome) dados.nome = sanitizarString(dados.nome)
  const result = cronogramaModel.atualizar(userId, id, dados)
  if (!result) { const e = new Error('Evento não encontrado'); e.status = 404; throw e }
  return result
}

function deletar(userId, id) {
  if (!cronogramaModel.deletar(userId, id)) { const e = new Error('Evento não encontrado'); e.status = 404; throw e }
  return { mensagem: 'Evento excluído' }
}

function diaConsolidado(userId, data) {
  return cronogramaModel.diaConsolidado(userId, data)
}

module.exports = { listar, criar, atualizar, deletar, diaConsolidado }
