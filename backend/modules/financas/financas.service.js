const financasModel = require('./financas.model')
const { validarCamposObrigatorios, validarEnum, sanitizarString } = require('../../utils/validate')
const { paginar, formatarRespostaPaginada } = require('../../utils/paginate')

function listarPerfis(userId) {
  return financasModel.listarPerfis(userId)
}

function criarPerfil(userId, dados) {
  validarCamposObrigatorios(['nome'], dados)
  dados.nome = sanitizarString(dados.nome)
  return financasModel.criarPerfil(userId, dados)
}

function atualizarPerfil(userId, id, dados) {
  if (dados.nome) dados.nome = sanitizarString(dados.nome)
  const result = financasModel.atualizarPerfil(userId, id, dados)
  if (!result) { const e = new Error('Perfil não encontrado'); e.status = 404; throw e }
  return result
}

function deletarPerfil(userId, id) {
  if (!financasModel.deletarPerfil(userId, id)) { const e = new Error('Perfil não encontrado'); e.status = 404; throw e }
  return { mensagem: 'Perfil excluído' }
}

function listarCategorias(userId, tipo) {
  if (tipo) validarEnum(tipo, ['receita', 'despesa'], 'tipo')
  return financasModel.listarCategorias(userId, tipo)
}

function criarCategoria(userId, dados) {
  validarCamposObrigatorios(['nome', 'tipo'], dados)
  validarEnum(dados.tipo, ['receita', 'despesa'], 'tipo')
  dados.nome = sanitizarString(dados.nome)
  return financasModel.criarCategoria(userId, dados)
}

function atualizarCategoria(userId, id, dados) {
  if (dados.tipo) validarEnum(dados.tipo, ['receita', 'despesa'], 'tipo')
  if (dados.nome) dados.nome = sanitizarString(dados.nome)
  const result = financasModel.atualizarCategoria(userId, id, dados)
  if (!result) { const e = new Error('Categoria não encontrada'); e.status = 404; throw e }
  return result
}

function deletarCategoria(userId, id) {
  if (!financasModel.deletarCategoria(userId, id)) { const e = new Error('Categoria não encontrada'); e.status = 404; throw e }
  return { mensagem: 'Categoria excluída' }
}

function listarTransacoes(userId, query) {
  const { limite, offset, pagina } = paginar(query)
  const filtros = {}
  if (query.mes) filtros.mes = query.mes
  if (query.tipo) { validarEnum(query.tipo, ['receita', 'despesa'], 'tipo'); filtros.tipo = query.tipo }
  if (query.categoria_id) filtros.categoria_id = query.categoria_id
  if (query.perfil_id) filtros.perfil_id = query.perfil_id
  if (query.busca) filtros.busca = query.busca
  const { dados, total } = financasModel.listarTransacoes(userId, filtros, pagina, limite, offset)
  return formatarRespostaPaginada(dados, total, pagina, limite)
}

function criarTransacao(userId, dados) {
  validarCamposObrigatorios(['tipo', 'nome', 'valor', 'data'], dados)
  validarEnum(dados.tipo, ['receita', 'despesa'], 'tipo')
  dados.nome = sanitizarString(dados.nome)
  return financasModel.criarTransacao(userId, dados)
}

function atualizarTransacao(userId, id, dados) {
  if (dados.tipo) validarEnum(dados.tipo, ['receita', 'despesa'], 'tipo')
  if (dados.nome) dados.nome = sanitizarString(dados.nome)
  const result = financasModel.atualizarTransacao(userId, id, dados)
  if (!result) { const e = new Error('Transação não encontrada'); e.status = 404; throw e }
  return result
}

function deletarTransacao(userId, id) {
  if (!financasModel.deletarTransacao(userId, id)) { const e = new Error('Transação não encontrada'); e.status = 404; throw e }
  return { mensagem: 'Transação excluída' }
}

function listarFixas(userId) {
  return financasModel.listarFixas(userId)
}

function criarFixa(userId, dados) {
  validarCamposObrigatorios(['tipo', 'nome', 'valor', 'dia_mes'], dados)
  validarEnum(dados.tipo, ['receita', 'despesa'], 'tipo')
  dados.nome = sanitizarString(dados.nome)
  return financasModel.criarFixa(userId, dados)
}

function atualizarFixa(userId, id, dados) {
  if (dados.tipo) validarEnum(dados.tipo, ['receita', 'despesa'], 'tipo')
  if (dados.nome) dados.nome = sanitizarString(dados.nome)
  const result = financasModel.atualizarFixa(userId, id, dados)
  if (!result) { const e = new Error('Transação fixa não encontrada'); e.status = 404; throw e }
  return result
}

function deletarFixa(userId, id) {
  if (!financasModel.deletarFixa(userId, id)) { const e = new Error('Transação fixa não encontrada'); e.status = 404; throw e }
  return { mensagem: 'Transação fixa excluída' }
}

function listarInvestimentos(userId) {
  return financasModel.listarInvestimentos(userId)
}

function criarInvestimento(userId, dados) {
  validarCamposObrigatorios(['nome', 'tipo', 'valor_aplicado'], dados)
  validarEnum(dados.tipo, ['cdb', 'tesouro', 'acoes', 'fii', 'poupanca', 'outro'], 'tipo')
  return financasModel.criarInvestimento(userId, dados)
}

function atualizarInvestimento(userId, id, dados) {
  if (dados.tipo) validarEnum(dados.tipo, ['cdb', 'tesouro', 'acoes', 'fii', 'poupanca', 'outro'], 'tipo')
  const result = financasModel.atualizarInvestimento(userId, id, dados)
  if (!result) { const e = new Error('Investimento não encontrado'); e.status = 404; throw e }
  return result
}

function deletarInvestimento(userId, id) {
  if (!financasModel.deletarInvestimento(userId, id)) { const e = new Error('Investimento não encontrado'); e.status = 404; throw e }
  return { mensagem: 'Investimento excluído' }
}

function relatorioMensal(userId, query) {
  const mes = query.mes || new Date().toISOString().slice(0, 7)
  return financasModel.relatorioMensal(userId, mes, query.perfil_id)
}

function relatorioGeral(userId, query) {
  return financasModel.relatorioGeral(userId, query.perfil_id)
}

function stats(userId, query) {
  const mes = query.mes || new Date().toISOString().slice(0, 7)
  return financasModel.stats(userId, mes, query.perfil_id)
}

function confirmarImportacao(userId, transacoes) {
  if (!transacoes || !Array.isArray(transacoes) || transacoes.length === 0) {
    const e = new Error('Lista de transações vazia ou inválida'); e.status = 400; throw e
  }
  const count = financasModel.importarEmLote(userId, transacoes)
  return { importados: count }
}

module.exports = {
  listarPerfis, criarPerfil, atualizarPerfil, deletarPerfil,
  listarCategorias, criarCategoria, atualizarCategoria, deletarCategoria,
  listarTransacoes, criarTransacao, atualizarTransacao, deletarTransacao,
  listarFixas, criarFixa, atualizarFixa, deletarFixa,
  listarInvestimentos, criarInvestimento, atualizarInvestimento, deletarInvestimento,
  relatorioMensal, relatorioGeral, stats, confirmarImportacao
}
