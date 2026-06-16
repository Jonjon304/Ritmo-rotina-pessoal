const projetosModel = require('./projetos.model')
const { validarCamposObrigatorios, validarEnum, sanitizarString } = require('../../utils/validate')

function listar(userId, query) {
  return projetosModel.listar(userId, query.status)
}

function criar(userId, dados) {
  validarCamposObrigatorios(['nome'], dados)
  if (dados.status) validarEnum(dados.status, ['em_andamento', 'pausado', 'concluido'], 'status')
  dados.nome = sanitizarString(dados.nome)
  return projetosModel.criar(userId, dados)
}

function atualizar(userId, id, dados) {
  if (dados.status) validarEnum(dados.status, ['em_andamento', 'pausado', 'concluido'], 'status')
  if (dados.nome) dados.nome = sanitizarString(dados.nome)
  const result = projetosModel.atualizar(userId, id, dados)
  if (!result) { const e = new Error('Projeto não encontrado'); e.status = 404; throw e }
  return result
}

function deletar(userId, id) {
  if (!projetosModel.deletar(userId, id)) { const e = new Error('Projeto não encontrado'); e.status = 404; throw e }
  return { mensagem: 'Projeto excluído' }
}

function tarefas(userId, projetoId) {
  const result = projetosModel.tarefasDoProjeto(userId, projetoId)
  if (result === null) { const e = new Error('Projeto não encontrado'); e.status = 404; throw e }
  return result
}

function notas(userId, projetoId) {
  const result = projetosModel.notasDoProjeto(userId, projetoId)
  if (result === null) { const e = new Error('Projeto não encontrado'); e.status = 404; throw e }
  return result
}

function metas(userId, projetoId) {
  const result = projetosModel.metasDoProjeto(userId, projetoId)
  if (result === null) { const e = new Error('Projeto não encontrado'); e.status = 404; throw e }
  return result
}

function progresso(userId, projetoId) {
  const result = projetosModel.progressoDoProjeto(userId, projetoId)
  if (!result) { const e = new Error('Projeto não encontrado'); e.status = 404; throw e }
  return result
}

function listarLinks(userId, projetoId) {
  if (!projetosModel.buscarPorId(userId, projetoId)) { const e = new Error('Projeto não encontrado'); e.status = 404; throw e }
  return projetosModel.listarLinks(projetoId)
}

function criarLink(userId, projetoId, dados) {
  validarCamposObrigatorios(['nome', 'url'], dados)
  if (!projetosModel.buscarPorId(userId, projetoId)) { const e = new Error('Projeto não encontrado'); e.status = 404; throw e }
  return projetosModel.criarLink(projetoId, dados)
}

function deletarLink(userId, projetoId, linkId) {
  if (!projetosModel.buscarPorId(userId, projetoId)) { const e = new Error('Projeto não encontrado'); e.status = 404; throw e }
  if (!projetosModel.deletarLink(projetoId, linkId)) { const e = new Error('Link não encontrado'); e.status = 404; throw e }
  return { mensagem: 'Link excluído' }
}

module.exports = { listar, criar, atualizar, deletar, tarefas, notas, metas, progresso, listarLinks, criarLink, deletarLink }
