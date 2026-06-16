const tarefasModel = require('./tarefas.model')
const { validarCamposObrigatorios, validarEnum, sanitizarString } = require('../../utils/validate')
const { paginar, formatarRespostaPaginada } = require('../../utils/paginate')

function listar(userId, query) {
  const { limite, offset, pagina } = paginar(query)
  const filtros = {}
  if (query.status) { validarEnum(query.status, ['afazer', 'em_progresso', 'concluida'], 'status'); filtros.status = query.status }
  if (query.prioridade) { validarEnum(query.prioridade, ['alta', 'media', 'baixa'], 'prioridade'); filtros.prioridade = query.prioridade }
  if (query.projeto_id) filtros.projeto_id = query.projeto_id
  if (query.tag_id) filtros.tag_id = query.tag_id
  if (query.busca) filtros.busca = query.busca
  const { dados, total } = tarefasModel.listarTarefas(userId, filtros, limite, offset)
  return formatarRespostaPaginada(dados, total, pagina, limite)
}

function criar(userId, dados) {
  validarCamposObrigatorios(['nome'], dados)
  if (dados.prioridade) validarEnum(dados.prioridade, ['alta', 'media', 'baixa'], 'prioridade')
  if (dados.status) validarEnum(dados.status, ['afazer', 'em_progresso', 'concluida'], 'status')
  dados.nome = sanitizarString(dados.nome)
  return tarefasModel.criarTarefa(userId, dados)
}

function atualizar(userId, id, dados) {
  if (dados.prioridade) validarEnum(dados.prioridade, ['alta', 'media', 'baixa'], 'prioridade')
  if (dados.status) validarEnum(dados.status, ['afazer', 'em_progresso', 'concluida'], 'status')
  if (dados.nome) dados.nome = sanitizarString(dados.nome)
  const result = tarefasModel.atualizarTarefa(userId, id, dados)
  if (!result) { const e = new Error('Tarefa não encontrada'); e.status = 404; throw e }
  return result
}

function mudarStatus(userId, id, status) {
  validarEnum(status, ['afazer', 'em_progresso', 'concluida'], 'status')
  const result = tarefasModel.mudarStatus(userId, id, status)
  if (!result) { const e = new Error('Tarefa não encontrada'); e.status = 404; throw e }
  return result
}

function deletar(userId, id) {
  if (!tarefasModel.deletarTarefa(userId, id)) { const e = new Error('Tarefa não encontrada'); e.status = 404; throw e }
  return { mensagem: 'Tarefa excluída' }
}

function listarSubTarefas(userId, tarefaId) {
  const result = tarefasModel.listarSubTarefas(userId, +tarefaId)
  if (result === null) { const e = new Error('Tarefa não encontrada'); e.status = 404; throw e }
  return result
}

function criarSubTarefa(userId, tarefaId, dados) {
  validarCamposObrigatorios(['nome'], dados)
  const result = tarefasModel.criarSubTarefa(userId, +tarefaId, dados)
  if (!result) { const e = new Error('Tarefa não encontrada'); e.status = 404; throw e }
  return result
}

function atualizarSubTarefa(userId, tarefaId, subId, dados) {
  const result = tarefasModel.atualizarSubTarefa(userId, +tarefaId, +subId, dados)
  if (!result) { const e = new Error('Sub-tarefa ou tarefa não encontrada'); e.status = 404; throw e }
  return result
}

function deletarSubTarefa(userId, tarefaId, subId) {
  if (!tarefasModel.deletarSubTarefa(userId, +tarefaId, +subId)) { const e = new Error('Sub-tarefa ou tarefa não encontrada'); e.status = 404; throw e }
  return { mensagem: 'Sub-tarefa excluída' }
}

function listarTags(userId) { return tarefasModel.listarTags(userId) }

function criarTag(userId, dados) {
  validarCamposObrigatorios(['nome'], dados)
  dados.nome = sanitizarString(dados.nome)
  return tarefasModel.criarTag(userId, dados)
}

function atualizarTag(userId, id, dados) {
  if (dados.nome) dados.nome = sanitizarString(dados.nome)
  const result = tarefasModel.atualizarTag(userId, id, dados)
  if (!result) { const e = new Error('Tag não encontrada'); e.status = 404; throw e }
  return result
}

function deletarTag(userId, id) {
  if (!tarefasModel.deletarTag(userId, id)) { const e = new Error('Tag não encontrada'); e.status = 404; throw e }
  return { mensagem: 'Tag excluída' }
}

module.exports = {
  listar, criar, atualizar, mudarStatus, deletar,
  listarSubTarefas, criarSubTarefa, atualizarSubTarefa, deletarSubTarefa,
  listarTags, criarTag, atualizarTag, deletarTag
}
