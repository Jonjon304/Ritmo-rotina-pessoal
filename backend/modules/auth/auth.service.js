const bcrypt = require('bcrypt')
const authModel = require('./auth.model')

async function login(email, senha) {
  const user = authModel.findByEmail(email)
  if (!user) {
    const err = new Error('Credenciais inválidas')
    err.status = 401
    throw err
  }
  const match = await bcrypt.compare(senha, user.senha_hash)
  if (!match) {
    const err = new Error('Credenciais inválidas')
    err.status = 401
    throw err
  }
  return { id: user.id, nome: user.nome, email: user.email, avatar: user.avatar }
}

function me(userId) {
  const user = authModel.findById(userId)
  if (!user) {
    const err = new Error('Usuário não encontrado')
    err.status = 404
    throw err
  }
  return user
}

async function alterarSenha(userId, senhaAtual, novaSenha) {
  const user = authModel.findByEmail((await me(userId)).email)
  const match = await bcrypt.compare(senhaAtual, user.senha_hash)
  if (!match) {
    const err = new Error('Senha atual incorreta')
    err.status = 400
    throw err
  }
  if (!novaSenha || novaSenha.length < 6) {
    const err = new Error('Nova senha deve ter no mínimo 6 caracteres')
    err.status = 400
    throw err
  }
  const hash = await bcrypt.hash(novaSenha, 10)
  authModel.updateSenha(userId, hash)
  return { mensagem: 'Senha alterada com sucesso' }
}

function obterConfig(userId) {
  const config = authModel.getConfig(userId)
  if (!config) {
    const err = new Error('Configurações não encontradas')
    err.status = 404
    throw err
  }
  return config
}

function atualizarConfig(userId, dados) {
  authModel.updateConfig(userId, dados)
  return obterConfig(userId)
}

module.exports = { login, me, alterarSenha, obterConfig, atualizarConfig }
