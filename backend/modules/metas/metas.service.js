const metasModel = require('./metas.model')
const { validarCamposObrigatorios, sanitizarString } = require('../../utils/validate')

function listar(userId, query) {
  return metasModel.listar(userId, query.projeto_id)
}

function criar(userId, dados) {
  validarCamposObrigatorios(['nome', 'valor_alvo'], dados)
  dados.nome = sanitizarString(dados.nome)
  return metasModel.criar(userId, dados)
}

function atualizar(userId, id, dados) {
  if (dados.nome) dados.nome = sanitizarString(dados.nome)
  const result = metasModel.atualizar(userId, id, dados)
  if (!result) { const e = new Error('Meta não encontrada'); e.status = 404; throw e }
  return result
}

function atualizarProgresso(userId, id, valorAtual) {
  if (valorAtual === undefined || valorAtual === null || isNaN(valorAtual)) {
    const e = new Error('valor_atual é obrigatório e deve ser um número'); e.status = 400; throw e
  }
  const result = metasModel.atualizarProgresso(userId, id, valorAtual)
  if (!result) { const e = new Error('Meta não encontrada'); e.status = 404; throw e }
  return result
}

function deletar(userId, id) {
  if (!metasModel.deletar(userId, id)) { const e = new Error('Meta não encontrada'); e.status = 404; throw e }
  return { mensagem: 'Meta excluída' }
}

module.exports = { listar, criar, atualizar, atualizarProgresso, deletar }
