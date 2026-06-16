const habitosModel = require('./habitos.model')
const { validarCamposObrigatorios, sanitizarString } = require('../../utils/validate')

function listar(userId) {
  return habitosModel.listar(userId)
}

function criar(userId, dados) {
  validarCamposObrigatorios(['nome'], dados)
  dados.nome = sanitizarString(dados.nome)
  return habitosModel.criar(userId, dados)
}

function atualizar(userId, id, dados) {
  if (dados.nome) dados.nome = sanitizarString(dados.nome)
  const result = habitosModel.atualizar(userId, id, dados)
  if (!result) { const e = new Error('Hábito não encontrado'); e.status = 404; throw e }
  return result
}

function deletar(userId, id) {
  if (!habitosModel.deletar(userId, id)) { const e = new Error('Hábito não encontrado'); e.status = 404; throw e }
  return { mensagem: 'Hábito excluído' }
}

function listarChecks(userId, query) {
  const mes = query.mes || new Date().toISOString().slice(0, 7)
  return habitosModel.listarChecks(userId, mes)
}

function marcarCheck(userId, habitoId, data) {
  const habito = habitosModel.buscarPorId(userId, habitoId)
  if (!habito) { const e = new Error('Hábito não encontrado'); e.status = 404; throw e }
  return habitosModel.marcarCheck(habitoId, data)
}

function desmarcarCheck(userId, habitoId, data) {
  const habito = habitosModel.buscarPorId(userId, habitoId)
  if (!habito) { const e = new Error('Hábito não encontrado'); e.status = 404; throw e }
  if (!habitosModel.desmarcarCheck(habitoId, data)) { const e = new Error('Check não encontrado'); e.status = 404; throw e }
  return { mensagem: 'Check removido' }
}

function obterStats(userId, habitoId) {
  const habito = habitosModel.buscarPorId(userId, habitoId)
  if (!habito) { const e = new Error('Hábito não encontrado'); e.status = 404; throw e }
  return habitosModel.stats(habitoId)
}

module.exports = { listar, criar, atualizar, deletar, listarChecks, marcarCheck, desmarcarCheck, obterStats }
